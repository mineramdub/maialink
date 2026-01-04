import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { protocols, protocolChunks, aiConversations } from '../lib/schema.js'
import { eq, sql, desc } from 'drizzle-orm'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getResponseSchema, detectQuestionType, type ProtocolResponseStructured } from '../lib/protocolSchemas.js'

const router = Router()
router.use(authMiddleware)

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

    // Si aucun résultat pertinent, chercher sur sources médicales officielles
    if (!hasPertinentResults) {
      console.log('[Chat Structured] Recherche sur sources médicales officielles...')

      try {
        // Recherche web via Google Custom Search API (gratuit 100 req/jour)
        const webSearchQuery = encodeURIComponent(`${question} site:has-sante.fr OR site:ansm.sante.fr OR site:cngof.fr`)

        const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY || ''}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID || ''}&q=${webSearchQuery}&num=3`

        const webSearchRes = await fetch(googleSearchUrl)

        if (webSearchRes.ok) {
          const webData = await webSearchRes.json()
          const webResults = (webData.items || []).map((item: any) => ({
            title: item.title,
            url: item.link,
            content: item.snippet,
            source: item.displayLink
          }))

          if (webResults.length > 0) {
            // Construire le contexte à partir des résultats web
            const webContext = webResults
              .map((result: any, i: number) =>
                `[Source ${i + 1} - ${result.title}]\nURL: ${result.url}\n${result.content}`
              )
              .join('\n\n---\n\n')

            // Générer réponse avec sources web
            const webPrompt = `Tu es un assistant médical expert pour les sages-femmes. Analyse les informations ci-dessous provenant de sources médicales officielles françaises et réponds à la question.

RÈGLES IMPORTANTES:
- Utilise UNIQUEMENT les informations des sources fournies
- Cite systématiquement les sources (nom + URL)
- Sois précis et factuel
- Indique clairement que ces informations proviennent de sources externes officielles

SOURCES MÉDICALES OFFICIELLES:
${webContext}

QUESTION: ${question}

Réponds de manière structurée avec :
1. Un résumé clair de la réponse
2. Les détails pertinents
3. Les sources citées (avec URL)

Format ta réponse en JSON avec la structure:
{
  "resume": "résumé de la réponse",
  "details": ["point 1", "point 2", ...],
  "sources": [{"nom": "...", "url": "...", "organisme": "..."}],
  "type": "reponse_generale"
}`

            const webGenerativeModel = genAI.getGenerativeModel({
              model: 'gemini-1.5-flash',
              generationConfig: {
                responseMimeType: 'application/json'
              }
            })

            const webResult = await webGenerativeModel.generateContent(webPrompt)
            const webResponseText = webResult.response.text()
            const webStructuredData = JSON.parse(webResponseText)

            // Formater les sources web
            const webSources = webResults.map((result: any) => ({
              protocolId: 'web',
              protocolName: result.title || 'Source web',
              fileUrl: result.url,
              results: [{
                chunkId: 'web',
                excerpt: result.content.substring(0, 200) + '...',
                pageNumber: null,
                similarity: 100
              }]
            }))

            // Ajouter indication que c'est une source externe
            const finalAnswer = `📚 **Réponse depuis sources médicales officielles**\n\n${webStructuredData.resume}\n\n**Sources consultées :**\n${webStructuredData.sources.map((s: any) => `• ${s.organisme || 'Source'}: [${s.nom}](${s.url})`).join('\n')}`

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
              mode: 'web_sources'
            })
          }
        }
      } catch (webError) {
        console.error('[Chat Structured] Erreur recherche web:', webError)
      }

      // FALLBACK: Utiliser Gemini avec ses connaissances générales sur les recommandations HAS/CNGOF
      console.log('[Chat Structured] Fallback: Utilisation des connaissances Gemini sur recommandations médicales françaises')

      try {
        const fallbackModel = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })

        const fallbackPrompt = `Tu es un assistant médical expert pour les sages-femmes en France.

QUESTION: ${question}

Réponds en te basant sur les recommandations officielles françaises (HAS, CNGOF, ANSM, Ordre des sages-femmes).

RÈGLES IMPORTANTES:
- Base-toi UNIQUEMENT sur les recommandations officielles françaises que tu connais
- Cite précisément les sources (nom de l'organisme + type de document si connu)
- Si tu n'es pas certain, indique-le clairement
- Ajoute des liens vers les sites officiels pour consultation
- Indique toujours l'année de la recommandation si tu la connais

Réponds au format JSON avec:
{
  "resume": "résumé clair de la réponse",
  "details": ["point 1 avec source", "point 2 avec source", ...],
  "sources": [{"organisme": "HAS/CNGOF/ANSM/etc", "type": "recommandation/guide/etc", "annee": "2023", "lien": "https://..."}],
  "type": "recommandation_generale",
  "avertissement": "Cette réponse se base sur les connaissances générales. Pour plus de précision, consultez directement les sources officielles."
}`

        const fallbackResult = await fallbackModel.generateContent(fallbackPrompt)
        const fallbackText = fallbackResult.response.text()
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
    const context = relevantChunks
      .map((chunk: any, i: number) =>
        `[Source ${i + 1} - ${chunk.protocol_name}, page ${chunk.page_number || '?'}]\n${chunk.content}`
      )
      .join('\n\n---\n\n')

    console.log(`[Chat Structured] Contexte construit: ${context.length} caractères`)

    // **ÉTAPE 4: Détection du type de question**
    const questionType = detectQuestionType(question)
    console.log(`[Chat Structured] Type détecté: ${questionType}`)

    // **ÉTAPE 5: Génération structurée avec Gemini**
    console.log('[Chat Structured] Génération de la réponse structurée...')

    const generativeModel = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: getResponseSchema()
      }
    })

    const prompt = `Tu es un assistant médical expert pour les sages-femmes. Analyse les extraits de protocoles ci-dessous et réponds à la question de manière STRUCTURÉE.

TYPE DE QUESTION DÉTECTÉ: ${questionType}

RÈGLES IMPORTANTES:
- Extrais UNIQUEMENT les informations présentes dans les sources
- Structure ta réponse selon le type (${questionType})
- Sois précis sur les dosages, timings, étapes
- Cite toujours les sources (protocole + page)
- Si info manquante, ne l'invente pas

EXTRAITS DES PROTOCOLES:
${context}

QUESTION: ${question}

Réponds au format JSON structuré selon le schéma fourni.`

    const result = await generativeModel.generateContent(prompt)
    const responseText = result.response.text()

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

    for (const row of relevantChunks) {
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
