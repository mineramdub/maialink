import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { protocols, protocolChunks } from '../lib/schema.js'
import { eq, desc } from 'drizzle-orm'
import { upload } from '../middleware/upload.js'
import { readFile } from 'fs/promises'
import { createRequire } from 'module'
import { GoogleGenerativeAI } from '@google/generative-ai'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

const router = Router()
router.use(authMiddleware)

// GET /api/protocols - List protocols
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userProtocols = await db.query.protocols.findMany({
      where: eq(protocols.userId, req.user!.id),
      orderBy: [desc(protocols.createdAt)],
    })

    res.json({ success: true, protocols: userProtocols })
  } catch (error) {
    console.error('Get protocols error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/protocols - Create protocol
router.post('/', upload.single('file'), async (req: AuthRequest, res) => {
  try {
    const file = req.file
    const { nom, description, category } = req.body

    if (!file || !nom) {
      return res.status(400).json({ error: 'Fichier et nom requis' })
    }

    const fileUrl = `/uploads/protocols/${file.filename}`

    const [protocol] = await db.insert(protocols).values({
      userId: req.user!.id,
      nom,
      description: description || null,
      category: category as 'grossesse' | 'post_partum' | 'gynecologie' | 'reeducation' | 'pediatrie' | 'autre',
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      isProcessed: false,
    }).returning()

    res.json({ success: true, protocol })
  } catch (error) {
    console.error('Create protocol error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/protocols/:id/process - Process PDF and create embeddings
router.post('/:id/process', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const protocolId = req.params.id

    // Récupérer le protocol
    const protocol = await db.query.protocols.findFirst({
      where: eq(protocols.id, protocolId)
    })

    if (!protocol) {
      return res.status(404).json({ error: 'Protocol not found' })
    }

    // Lire le PDF depuis le disque
    const pdfPath = `./uploads/protocols/${protocol.fileName}`
    const dataBuffer = await readFile(pdfPath)
    const pdfData = await pdfParse(dataBuffer)
    const text = pdfData.text

    // Découper en chunks
    const chunkSize = 1000
    const chunks: string[] = []
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize))
    }

    // Générer embeddings pour chaque chunk
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })

    for (const [index, chunk] of chunks.entries()) {
      const result = await embeddingModel.embedContent(chunk)
      const embedding = result.embedding.values

      await db.insert(protocolChunks).values({
        protocolId,
        content: chunk,
        chunkIndex: index,
        embedding: JSON.stringify(embedding)
      })
    }

    // Mettre à jour le status du protocol
    await db.update(protocols)
      .set({ isProcessed: true })
      .where(eq(protocols.id, protocolId))

    res.json({ success: true, chunksCount: chunks.length })
  } catch (error) {
    console.error('Process error:', error)
    res.status(500).json({ error: 'Erreur traitement' })
  }
})

// DELETE /api/protocols/:id - Delete protocol
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Delete chunks first
    await db.delete(protocolChunks).where(eq(protocolChunks.protocolId, id))

    // Delete protocol
    await db.delete(protocols).where(
      eq(protocols.id, id)
    )

    res.json({ success: true })
  } catch (error) {
    console.error('Delete protocol error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
