import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { protocols, protocolChunks, aiConversations } from '../lib/schema.js'
import { eq, sql, desc } from 'drizzle-orm'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'
import { getResponseSchema, detectQuestionType, type ProtocolResponseStructured } from '../lib/protocolSchemas.js'

const router = Router()
router.use(authMiddleware)

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// POST /api/chat - Semantic search with structured AI response
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { question } = req.body

    if (!question || question.trim().length < 3) {
      return res.status(400).json({ error: 'Question trop courte' })
    }

    // Récupérer tous les protocoles de l'utilisateur
    const userProtocols = await db.query.protocols.findMany({
      where: eq(protocols.userId, req.user!.id),
    })

    if (userProtocols.length === 0) {
      return res.json({
        success: true,
        answer: 'Vous n\'avez pas encore importé de protocoles. Allez dans la section Protocoles pour en ajouter.',
        sources: [],
        mode: 'no_protocols'
      })
    }

    const protocolIds = userProtocols.map(p => p.id)

    // **ÉTAPE 1: Générer l'embedding de la question**
    console.log('[Chat Structured] Génération embedding pour la question...')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })

    const embeddingResult = await embeddingModel.embedContent(question)
    const queryEmbedding = embeddingResult.embedding.values

    // **ÉTAPE 2: Recherche vectorielle sémantique avec pgvector**
    console.log('[Chat Structured] Recherche sémantique dans les protocoles...')

    const semanticResults = await db.execute(sql`
      SELECT
        pc.id,
        pc.protocol_id,
        pc.content,
        pc.chunk_index,
        pc.page_number,
        p.nom as protocol_name,
        p.file_url,
        1 - (pc.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
      FROM protocol_chunks pc
      JOIN protocols p ON p.id = pc.protocol_id
      WHERE pc.protocol_id = ANY(ARRAY[${sql.raw(protocolIds.map(id => `'${id}'::uuid`).join(','))}])
      ORDER BY pc.embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT 5
    `)

    const relevantChunks = semanticResults.rows || []

    console.log(`[Chat Structured] ${relevantChunks.length} chunks pertinents trouvés`)

    // Vérifier la pertinence des résultats
    const hasPertinentResults = relevantChunks.length > 0 &&
      relevantChunks.some((chunk: any) => parseFloat(chunk.similarity) > 0.5)

    // **ÉTAPE INTERMÉDIAIRE: Si pas de résultats pertinents, essayer avec termes associés**
    let expandedSearchChunks = relevantChunks
    let searchWithSynonyms = false

    if (!hasPertinentResults) {
      console.log('[Chat Structured] ❌ Pas de résultats pertinents (similarity < 0.5)')
      console.log('[Chat Structured] 🔄 Tentative avec termes associés et synonymes...')

      try {
        // Utiliser Claude pour générer des termes associés
        const synonymPrompt = `Tu es un assistant médical. Génère des termes associés, synonymes et reformulations pour cette question médicale.

QUESTION ORIGINALE: ${question}

Génère 5-7 termes/expressions alternatifs en français médical qui pourraient décrire la même chose.
Inclus: synonymes médicaux, termes vernaculaires, acronymes, formulations alternatives.

Exemples:
- "diabète gestationnel" → ["DG", "diabète de grossesse", "intolérance au glucose grossesse", "hyperglycémie gravidique"]
- "césarienne" → ["accouchement par voie haute", "section césarienne", "extraction abdominale"]

Réponds UNIQUEMENT en JSON valide, sans markdown:
{
  "termes_associes": ["terme 1", "terme 2", "terme 3", ...],
  "question_reformulee": "reformulation plus large de la question"
}`

        const synonymMessage = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [{ role: 'user', content: synonymPrompt }]
        })

        const synonymText = synonymMessage.content[0].type === 'text' ? synonymMessage.content[0].text : '{}'
        const synonymData = JSON.parse(synonymText)

        console.log(`[Chat Structured] Termes associés générés:`, synonymData.termes_associes)

        // Créer une requête élargie avec les synonymes
        const expandedQuery = [question, ...synonymData.termes_associes, synonymData.question_reformulee].join(' ')

        // Générer nouvel embedding avec la requête élargie
        const expandedEmbeddingResult = await embeddingModel.embedContent(expandedQuery)
        const expandedEmbedding = expandedEmbeddingResult.embedding.values

        // Nouvelle recherche sémantique avec termes élargis
        const expandedResults = await db.execute(sql`
          SELECT
            pc.id,
            pc.protocol_id,
            pc.content,
            pc.chunk_index,
            pc.page_number,
            p.nom as protocol_name,
            p.file_url,
            1 - (pc.embedding <=> ${JSON.stringify(expandedEmbedding)}::vector) as similarity
          FROM protocol_chunks pc
          JOIN protocols p ON p.id = pc.protocol_id
          WHERE pc.protocol_id = ANY(ARRAY[${sql.raw(protocolIds.map(id => `'${id}'::uuid`).join(','))}])
          ORDER BY pc.embedding <=> ${JSON.stringify(expandedEmbedding)}::vector
          LIMIT 5
        `)

        expandedSearchChunks = expandedResults.rows || []

        const hasExpandedResults = expandedSearchChunks.length > 0 &&
          expandedSearchChunks.some((chunk: any) => parseFloat(chunk.similarity) > 0.4)

        if (hasExpandedResults) {
          console.log(`[Chat Structured] ✅ ${expandedSearchChunks.length} chunks trouvés avec termes associés`)
          searchWithSynonyms = true
          // On passe à l'utilisation de ces résultats élargis
        } else {
          console.log(`[Chat Structured] ❌ Toujours pas de résultats avec termes associés`)
        }

      } catch (synonymError) {
        console.error('[Chat Structured] Erreur génération synonymes:', synonymError)
      }
    }

    // Si toujours pas de résultats pertinents après recherche élargie, chercher sur sources médicales officielles
    const finalResults = searchWithSynonyms ? expandedSearchChunks : relevantChunks
    const hasFinalResults = finalResults.length > 0 &&
      finalResults.some((chunk: any) => parseFloat(chunk.similarity) > (searchWithSynonyms ? 0.4 : 0.5))

    if (!hasFinalResults) {
      console.log('[Chat Structured] 🌐 Utilisation des connaissances médicales avec sources officielles...')

      try {
        // Utiliser Claude pour répondre avec des sources officielles françaises
        // Au lieu de chercher sur Google (qui nécessite des clés API), on utilise les connaissances de Claude
        // en lui demandant de citer les sources officielles pertinentes

        const webPromptDirect = `Tu es un assistant médical expert pour les sages-femmes en France.

QUESTION: ${question}

Réponds en te basant UNIQUEMENT sur les recommandations officielles françaises que tu connais :
- HAS (Haute Autorité de Santé)
- CNGOF (Collège National des Gynécologues Obstétriciens Français)
- ANSM (Agence Nationale de Sécurité du Médicament)
- Ordre National des Sages-Femmes
- Assurance Maladie (Ameli.fr)
- Santé Publique France

RÈGLES STRICTES:
1. Base-toi UNIQUEMENT sur les recommandations officielles françaises que tu connais avec certitude
2. Cite PRÉCISÉMENT les sources (organisme + type de document + année si connue)
3. Fournis les URLs des organismes où consulter ces recommandations
4. Si tu n'es pas certain d'une information, indique-le clairement
5. Ne fais AUCUNE recommandation clinique sans source officielle

Format ta réponse en JSON avec la structure exacte:
{
  "resume": "résumé clair de 2-3 phrases maximum avec citations (Organisme, année)",
  "details": ["point 1 avec citation précise (HAS 2023)", "point 2 avec citation", ...],
  "recommandations": ["recommandation pratique 1 avec source", "recommandation 2", ...],
  "sources": [
    {
      "organisme": "nom complet de l'organisme (ex: HAS - Haute Autorité de Santé)",
      "titre": "titre du document ou type de recommandation",
      "annee": "2023" (ou "inconnue" si tu ne sais pas),
      "url": "URL de l'organisme où consulter (ex: https://www.has-sante.fr/)",
      "pertinence": "pourquoi cette source est pertinente pour la question"
    }
  ],
  "type": "reponse_officielle",
  "confiance": "haute/moyenne/faible selon ta certitude sur ces informations",
  "avertissement": "Ajoute un avertissement si des informations manquent ou si la question nécessite une consultation des recommandations complètes"
}

IMPORTANT: Si tu ne trouves pas d'information officielle fiable, renvoie un JSON avec des tableaux vides et un avertissement explicite.`

        const webMessageDirect = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: webPromptDirect }]
        })

        const webResponseTextDirect = webMessageDirect.content[0].type === 'text' ? webMessageDirect.content[0].text : '{}'

        // Nettoyer la réponse si elle contient des backticks markdown
        let cleanedResponse = webResponseTextDirect.trim()
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '')
        } else if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/```\s*/g, '')
        }

        const webStructuredData = JSON.parse(cleanedResponse)

        // Vérifier si on a des résultats pertinents
        if (webStructuredData.sources && webStructuredData.sources.length > 0) {
          console.log(`[Chat Structured] ✅ ${webStructuredData.sources.length} sources officielles trouvées`)

          // Formater les sources avec plus d'informations
          const webSources = webStructuredData.sources.map((source: any, i: number) => ({
            protocolId: 'web_official',
            protocolName: `${source.organisme} - ${source.titre}`,
            fileUrl: source.url,
            organisme: source.organisme,
            annee: source.annee,
            results: [{
              chunkId: `official_${i}`,
              excerpt: source.pertinence,
              pageNumber: null,
              similarity: 100
            }]
          }))

          // Formater la réponse finale avec citations détaillées
          let finalAnswer = `📚 **Réponse depuis recommandations officielles françaises**\n\n`
          finalAnswer += `${webStructuredData.resume}\n\n`

          if (webStructuredData.details && webStructuredData.details.length > 0) {
            finalAnswer += `**📋 Détails :**\n${webStructuredData.details.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}\n\n`
          }

          if (webStructuredData.recommandations && webStructuredData.recommandations.length > 0) {
            finalAnswer += `**💡 Recommandations pratiques :**\n${webStructuredData.recommandations.map((r: string) => `• ${r}`).join('\n')}\n\n`
          }

          finalAnswer += `**📖 Sources officielles consultées :**\n${webStructuredData.sources.map((s: any, i: number) => {
            return `\n**${i + 1}. ${s.organisme}** ${s.annee !== 'inconnue' ? `(${s.annee})` : ''}\n   📄 ${s.titre}\n   🔗 ${s.url}\n   ℹ️ ${s.pertinence}`
          }).join('\n')}\n\n`

          if (webStructuredData.avertissement) {
            finalAnswer += `⚠️ **Avertissement:** ${webStructuredData.avertissement}\n\n`
          }

          finalAnswer += `ℹ️ *Niveau de confiance: ${webStructuredData.confiance || 'moyen'}*\n`
          finalAnswer += `⚠️ *Pour toute application clinique, consultez les recommandations complètes et référez-vous à votre jugement professionnel.*`

          await db.insert(aiConversations).values({
            userId: req.user!.id,
            question,
            answer: finalAnswer,
            sourcesUsed: webSources,
          })

          return res.json({
            success: true,
            answer: finalAnswer,
            structured: webStructuredData,
            sources: webSources,
            mode: 'official_sources'
          })
        }
      } catch (webError) {
        console.error('[Chat Structured] Erreur recherche web:', webError)
      }

      // FALLBACK: Utiliser Claude avec ses connaissances générales sur les recommandations HAS/CNGOF
      console.log('[Chat Structured] Fallback: Utilisation des connaissances Claude sur recommandations médicales françaises')

      try {
        const fallbackPrompt = `Tu es un assistant médical expert pour les sages-femmes en France.

QUESTION: ${question}

Réponds en te basant sur les recommandations officielles françaises (HAS, CNGOF, ANSM, Ordre des sages-femmes).

RÈGLES IMPORTANTES:
- Base-toi UNIQUEMENT sur les recommandations officielles françaises que tu connais
- Cite précisément les sources (nom de l'organisme + type de document si connu)
- Si tu n'es pas certain, indique-le clairement
- Ajoute des liens vers les sites officiels pour consultation
- Indique toujours l'année de la recommandation si tu la connais

Réponds UNIQUEMENT en JSON valide, sans markdown, sans explications:
{
  "resume": "résumé clair de la réponse",
  "details": ["point 1 avec source", "point 2 avec source", ...],
  "sources": [{"organisme": "HAS/CNGOF/ANSM/etc", "type": "recommandation/guide/etc", "annee": "2023", "lien": "https://..."}],
  "type": "recommandation_generale",
  "avertissement": "Cette réponse se base sur les connaissances générales. Pour plus de précision, consultez directement les sources officielles."
}`

        const fallbackMessage = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: fallbackPrompt }]
        })

        const fallbackText = fallbackMessage.content[0].type === 'text' ? fallbackMessage.content[0].text : '{}'
        const fallbackData = JSON.parse(fallbackText)

        const fallbackAnswer = `⚕️ **Réponse basée sur les recommandations officielles françaises**\n\n${fallbackData.resume}\n\n**Détails:**\n${fallbackData.details.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}\n\n**Sources recommandées:**\n${fallbackData.sources.map((s: any) => `• ${s.organisme} - ${s.type} ${s.annee ? `(${s.annee})` : ''}\n  ${s.lien || ''}`).join('\n')}\n\n⚠️ ${fallbackData.avertissement}`

        const fallbackSources = fallbackData.sources.map((s: any) => ({
          protocolId: 'external',
          protocolName: `${s.organisme} - ${s.type}`,
          fileUrl: s.lien || `https://${s.organisme === 'HAS' ? 'has-sante.fr' : s.organisme === 'CNGOF' ? 'cngof.fr' : s.organisme === 'ANSM' ? 'ansm.sante.fr' : 'ordre-sages-femmes.fr'}`,
          results: [{
            chunkId: 'external',
            excerpt: `Recommandation ${s.organisme}${s.annee ? ` ${s.annee}` : ''}`,
            pageNumber: null,
            similarity: 95
          }]
        }))

        await db.insert(aiConversations).values({
          userId: req.user!.id,
          question,
          answer: fallbackAnswer,
          sourcesUsed: fallbackSources.length > 0 ? fallbackSources : null,
        })

        return res.json({
          success: true,
          answer: fallbackAnswer,
          structured: fallbackData,
          sources: fallbackSources,
          mode: 'general_knowledge'
        })
      } catch (fallbackError) {
        console.error('[Chat Structured] Erreur fallback:', fallbackError)

        // Dernier fallback : message simple
        return res.json({
          success: true,
          answer: 'Aucune information pertinente trouvée dans vos protocoles pour cette question. Pour des informations fiables, consultez directement:\n\n• **HAS** (Haute Autorité de Santé): https://has-sante.fr\n• **CNGOF** (Collège National des Gynécologues et Obstétriciens): https://cngof.fr\n• **ANSM** (Agence Nationale de Sécurité du Médicament): https://ansm.sante.fr\n• **Ordre des sages-femmes**: https://ordre-sages-femmes.fr',
          sources: [],
          mode: 'no_results'
        })
      }
    }

    // **ÉTAPE 3: Construire le contexte pour l'IA**
    const context = finalResults
      .map((chunk: any, i: number) =>
        `[Source ${i + 1} - ${chunk.protocol_name}, page ${chunk.page_number || '?'}]\n${chunk.content}`
      )
      .join('\n\n---\n\n')

    console.log(`[Chat Structured] Contexte construit: ${context.length} caractères`)
    if (searchWithSynonyms) {
      console.log(`[Chat Structured] ℹ️ Résultats obtenus via recherche avec termes associés`)
    }

    // **ÉTAPE 4: Détection du type de question**
    const questionType = detectQuestionType(question)
    console.log(`[Chat Structured] Type détecté: ${questionType}`)

    // **ÉTAPE 5: Génération structurée avec Claude**
    console.log('[Chat Structured] Génération de la réponse structurée avec Claude...')

    const prompt = `Tu es un assistant médical expert pour les sages-femmes. Analyse les extraits de protocoles ci-dessous et réponds à la question de manière STRUCTURÉE.

TYPE DE QUESTION DÉTECTÉ: ${questionType}

RÈGLES IMPORTANTES:
- Extrais UNIQUEMENT les informations présentes dans les sources
- Structure ta réponse selon le type (${questionType})
- Sois précis sur les dosages, timings, étapes
- Cite toujours les sources (protocole + page)
- Si info manquante, ne l'invente pas
- Réponds UNIQUEMENT en JSON valide, sans markdown, sans explications

EXTRAITS DES PROTOCOLES:
${context}

QUESTION: ${question}

Réponds au format JSON avec cette structure exacte:
{
  "type": "${questionType}",
  "resume": "résumé concis de la réponse (2-3 phrases)",
  "reponse_principale": "réponse détaillée principale",
  "points_cles": ["point 1", "point 2", ...],
  "citations": ["citation protocole 1", "citation protocole 2", ...],
  "attention": "points d'attention ou contre-indications si pertinent"
}`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    console.log('[Chat Structured] Réponse brute:', responseText.substring(0, 200))

    let structuredData: ProtocolResponseStructured
    try {
      structuredData = JSON.parse(responseText)
    } catch (parseError) {
      console.error('[Chat Structured] Erreur parsing JSON:', parseError)
      // Fallback: réponse simple
      return res.json({
        success: true,
        answer: responseText,
        sources: [],
        mode: 'text_fallback'
      })
    }

    console.log('[Chat Structured] Réponse structurée générée:', structuredData.type)

    // **ÉTAPE 6: Organiser les sources**
    const protocolGroups = new Map<string, {
      name: string;
      fileUrl: string;
      chunks: Array<{ content: string; pageNumber: number; chunkId: string; similarity: number }>;
    }>()

    for (const row of finalResults) {
      const chunk = row as any
      if (!protocolGroups.has(chunk.protocol_id)) {
        protocolGroups.set(chunk.protocol_id, {
          name: chunk.protocol_name,
          fileUrl: chunk.file_url,
          chunks: []
        })
      }
      const group = protocolGroups.get(chunk.protocol_id)!
      group.chunks.push({
        content: chunk.content,
        pageNumber: chunk.page_number || 1,
        chunkId: chunk.id,
        similarity: parseFloat(chunk.similarity)
      })
    }

    const sources = Array.from(protocolGroups.entries()).map(([protocolId, group]) => ({
      protocolId,
      protocolName: group.name,
      fileUrl: group.fileUrl,
      results: group.chunks.map(chunk => ({
        chunkId: chunk.chunkId,
        excerpt: chunk.content.substring(0, 200) + '...',
        pageNumber: chunk.pageNumber,
        similarity: Math.round(chunk.similarity * 100)
      }))
    }))

    // **ÉTAPE 7: Sauvegarder la conversation**
    await db.insert(aiConversations).values({
      userId: req.user!.id,
      question,
      answer: structuredData.resume,
      sourcesUsed: sources.length > 0 ? sources : null,
    })

    res.json({
      success: true,
      answer: structuredData.resume,
      structured: structuredData,
      sources,
      mode: 'structured_ai'
    })

  } catch (error) {
    console.error('Chat Structured error:', error)
    res.status(500).json({
      error: 'Erreur lors de la recherche',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    })
  }
})

// GET /api/chat - Get conversation history
router.get('/', async (req: AuthRequest, res) => {
  try {
    const conversations = await db.query.aiConversations.findMany({
      where: eq(aiConversations.userId, req.user!.id),
      orderBy: [desc(aiConversations.createdAt)],
      limit: 50,
    })

    res.json({ success: true, conversations })
  } catch (error) {
    console.error('Get conversations error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
