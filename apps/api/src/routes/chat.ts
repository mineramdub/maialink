import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { protocols, protocolChunks, aiConversations } from '../lib/schema.js'
import { eq, sql, desc } from 'drizzle-orm'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()
router.use(authMiddleware)

// POST /api/chat - Ask question to AI
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { question } = req.body

    if (!question || question.trim().length < 3) {
      return res.status(400).json({ error: 'Question trop courte' })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return res.status(500).json({
        error: 'Cle API Gemini non configuree. Ajoutez GEMINI_API_KEY dans vos variables d\'environnement.'
      })
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)

    // Récupérer tous les protocoles de l'utilisateur
    const userProtocols = await db.query.protocols.findMany({
      where: eq(protocols.userId, req.user!.id),
    })

    if (userProtocols.length === 0) {
      return res.json({
        success: true,
        answer: 'Vous n\'avez pas encore importe de protocoles. Allez dans la section Protocoles pour en ajouter.',
        sources: []
      })
    }

    // Créer l'embedding de la question
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const questionEmbedding = await embeddingModel.embedContent(question)
    const queryVector = questionEmbedding.embedding.values

    // Recherche vectorielle dans les chunks
    const protocolIds = userProtocols.map(p => p.id)

    const relevantChunks = await db.execute(sql`
      SELECT
        pc.id,
        pc.protocol_id,
        pc.content,
        pc.chunk_index,
        p.nom as protocol_name,
        1 - (pc.embedding <=> ${JSON.stringify(queryVector)}::vector) as similarity
      FROM protocol_chunks pc
      JOIN protocols p ON p.id = pc.protocol_id
      WHERE pc.protocol_id = ANY(ARRAY[${sql.raw(protocolIds.map(id => `'${id}'`).join(','))}])
        AND pc.embedding IS NOT NULL
      ORDER BY pc.embedding <=> ${JSON.stringify(queryVector)}::vector
      LIMIT 5
    `)

    let context = ''
    const sources: { protocolId: string; protocolName: string; chunkIds: string[] }[] = []

    if (relevantChunks.rows && relevantChunks.rows.length > 0) {
      // Grouper par protocole
      const protocolGroups = new Map<string, { name: string; chunks: string[]; chunkIds: string[] }>()

      for (const row of relevantChunks.rows as { id: string; protocol_id: string; content: string; protocol_name: string; similarity: number }[]) {
        if (!protocolGroups.has(row.protocol_id)) {
          protocolGroups.set(row.protocol_id, {
            name: row.protocol_name,
            chunks: [],
            chunkIds: []
          })
        }
        const group = protocolGroups.get(row.protocol_id)!
        group.chunks.push(row.content)
        group.chunkIds.push(row.id)
      }

      for (const [protocolId, group] of protocolGroups) {
        context += `\n\n--- Protocole: ${group.name} ---\n${group.chunks.join('\n\n')}`
        sources.push({
          protocolId,
          protocolName: group.name,
          chunkIds: group.chunkIds
        })
      }
    } else {
      // Fallback: recherche textuelle simple si pas d'embeddings
      const allChunks = await db.query.protocolChunks.findMany({
        where: sql`${protocolChunks.protocolId} = ANY(ARRAY[${sql.raw(protocolIds.map(id => `'${id}'`).join(','))}])`,
        limit: 10,
      })

      if (allChunks.length > 0) {
        // Recherche par mots-clés simple
        const keywords: string[] = question.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3)
        const matchingChunks = allChunks.filter(chunk =>
          keywords.some((kw: string) => chunk.content.toLowerCase().includes(kw))
        ).slice(0, 5)

        if (matchingChunks.length > 0) {
          context = matchingChunks.map(c => c.content).join('\n\n')
        } else {
          context = allChunks.slice(0, 3).map(c => c.content).join('\n\n')
        }
      }
    }

    // Générer la réponse avec Gemini
    const chatModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Tu es une assistante IA specialisee pour les sages-femmes. Tu reponds aux questions en te basant UNIQUEMENT sur les protocoles medicaux fournis ci-dessous.

REGLES IMPORTANTES:
- Reponds en francais
- Base-toi UNIQUEMENT sur les informations des protocoles fournis
- Si l'information n'est pas dans les protocoles, dis-le clairement
- Sois precise et professionnelle
- Cite les protocoles sources quand c'est pertinent

PROTOCOLES DE REFERENCE:
${context || 'Aucun contenu pertinent trouve dans les protocoles.'}

QUESTION DE L'UTILISATEUR:
${question}

REPONSE:`

    const result = await chatModel.generateContent(prompt)
    const answer = result.response.text()

    // Sauvegarder la conversation
    await db.insert(aiConversations).values({
      userId: req.user!.id,
      question,
      answer,
      sourcesUsed: sources.length > 0 ? sources : null,
    })

    res.json({
      success: true,
      answer,
      sources
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Erreur lors de la generation de la reponse' })
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
