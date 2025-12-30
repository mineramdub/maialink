import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { protocols, protocolChunks } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Fonction pour découper le texte en chunks
function splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    let chunk = text.slice(start, end)

    // Essayer de couper à la fin d'une phrase
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.')
      const lastNewline = chunk.lastIndexOf('\n')
      const cutPoint = Math.max(lastPeriod, lastNewline)
      if (cutPoint > chunkSize * 0.5) {
        chunk = chunk.slice(0, cutPoint + 1)
      }
    }

    chunks.push(chunk.trim())
    start = start + chunk.length - overlap
    if (start <= 0) start = end
  }

  return chunks.filter(c => c.length > 50) // Filtrer les chunks trop petits
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Récupérer le protocole
    const protocol = await db.query.protocols.findFirst({
      where: eq(protocols.id, id),
    })

    if (!protocol) {
      return NextResponse.json({ error: 'Protocole non trouve' }, { status: 404 })
    }

    if (protocol.isProcessed) {
      return NextResponse.json({ success: true, message: 'Deja traite' })
    }

    // Télécharger le PDF
    const pdfResponse = await fetch(protocol.fileUrl)
    const pdfBuffer = await pdfResponse.arrayBuffer()

    // Extraire le texte du PDF
    // @ts-expect-error - pdf-parse types
    const pdfParse = (await import('pdf-parse')).default
    const pdfData = await pdfParse(Buffer.from(pdfBuffer))
    const text = pdfData.text

    if (!text || text.length < 100) {
      await db.update(protocols)
        .set({ processingError: 'PDF vide ou non lisible' })
        .where(eq(protocols.id, id))
      return NextResponse.json({ error: 'PDF vide ou non lisible' }, { status: 400 })
    }

    // Découper en chunks
    const chunks = splitTextIntoChunks(text)

    // Vérifier si on a une clé Gemini
    const geminiApiKey = process.env.GEMINI_API_KEY

    if (geminiApiKey) {
      // Créer les embeddings avec Gemini
      const genAI = new GoogleGenerativeAI(geminiApiKey)
      const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]

        try {
          const result = await embeddingModel.embedContent(chunk)
          const embedding = result.embedding.values

          await db.insert(protocolChunks).values({
            protocolId: id,
            content: chunk,
            chunkIndex: i,
            embedding: embedding,
          })
        } catch (embeddingError) {
          console.error(`Error creating embedding for chunk ${i}:`, embeddingError)
          // Continuer sans embedding
          await db.insert(protocolChunks).values({
            protocolId: id,
            content: chunk,
            chunkIndex: i,
          })
        }
      }
    } else {
      // Sans clé API, on stocke juste les chunks sans embeddings
      for (let i = 0; i < chunks.length; i++) {
        await db.insert(protocolChunks).values({
          protocolId: id,
          content: chunks[i],
          chunkIndex: i,
        })
      }
    }

    // Mettre à jour le protocole
    await db.update(protocols)
      .set({
        isProcessed: true,
        pageCount: pdfData.numpages,
        updatedAt: new Date(),
      })
      .where(eq(protocols.id, id))

    return NextResponse.json({
      success: true,
      chunksCreated: chunks.length,
      pageCount: pdfData.numpages
    })
  } catch (error) {
    console.error('Process protocol error:', error)

    const { id } = await params
    await db.update(protocols)
      .set({ processingError: String(error) })
      .where(eq(protocols.id, id))

    return NextResponse.json({ error: 'Erreur de traitement' }, { status: 500 })
  }
}
