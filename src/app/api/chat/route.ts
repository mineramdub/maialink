import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { protocols, protocolChunks, aiConversations } from '@/lib/schema'
import { eq, sql, desc } from 'drizzle-orm'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const { question } = await request.json()

    if (!question || question.trim().length < 3) {
      return NextResponse.json({ error: 'Question trop courte' }, { status: 400 })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json({
        error: 'Cle API Gemini non configuree. Ajoutez GEMINI_API_KEY dans vos variables d\'environnement.'
      }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)

    // Récupérer tous les protocoles de l'utilisateur
    const userProtocols = await db.query.protocols.findMany({
      where: eq(protocols.userId, user.id),
    })

    if (userProtocols.length === 0) {
      return NextResponse.json({
        answer: 'Vous n\'avez pas encore importe de protocoles. Allez dans la section Protocoles pour en ajouter.',
        sources: []
      })
    }

    // Créer l'embedding de la question
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const questionEmbedding = await embeddingModel.embedContent(question)
    const queryVector = questionEmbedding.embedding.values

    // Recherche vectorielle dans les chunks
    // Utiliser la similarité cosinus avec pgvector
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
      WHERE pc.protocol_id = ANY(${protocolIds})
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
        where: sql`${protocolChunks.protocolId} = ANY(${protocolIds})`,
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
      userId: user.id,
      question,
      answer,
      sourcesUsed: sources.length > 0 ? sources : null,
    })

    return NextResponse.json({
      success: true,
      answer,
      sources
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Erreur lors de la generation de la reponse' }, { status: 500 })
  }
}

// Récupérer l'historique des conversations
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const conversations = await db.query.aiConversations.findMany({
      where: eq(aiConversations.userId, user.id),
      orderBy: [desc(aiConversations.createdAt)],
      limit: 50,
    })

    return NextResponse.json({ success: true, conversations })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
