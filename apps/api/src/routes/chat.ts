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

    if (relevantChunks.length === 0) {
      return res.json({
        success: true,
        answer: 'Aucun contenu pertinent trouvé dans vos protocoles pour cette question. Vérifiez que vos protocoles ont été traités (vectorisés).',
        sources: [],
        mode: 'no_results'
      })
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
