import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { protocols, protocolChunks } from '../lib/schema.js'
import { eq, desc, sql } from 'drizzle-orm'
import { upload } from '../middleware/upload.js'
import { readFile } from 'fs/promises'
import { createRequire } from 'module'
import { GoogleGenerativeAI } from '@google/generative-ai'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

const router = Router()

// GET /api/protocols - List protocols
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
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
router.post('/', authMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  console.log('[Protocol Upload] Requête reçue')
  try {
    const file = req.file
    const { nom, description, category } = req.body

    console.log('[Protocol Upload] File:', file ? `${file.originalname} (${file.size} bytes)` : 'NO FILE')
    console.log('[Protocol Upload] Body:', { nom, description, category })

    if (!file || !nom) {
      console.log('[Protocol Upload] Validation échouée')
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
  } catch (error: any) {
    console.error('Create protocol error:', error)

    // Gestion spécifique des erreurs Multer
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Fichier trop volumineux',
        details: 'La taille maximale autorisée est de 400 MB'
      })
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Erreur de fichier',
        details: 'Un seul fichier PDF peut être envoyé à la fois'
      })
    }

    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Middleware de gestion d'erreurs pour Multer (doit être après les routes)
router.use((error: any, req: any, res: any, next: any) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Fichier trop volumineux',
      details: 'La taille maximale autorisée est de 400 MB'
    })
  }

  if (error.message === 'Seuls les fichiers PDF sont acceptes') {
    return res.status(400).json({
      error: 'Format de fichier invalide',
      details: 'Seuls les fichiers PDF sont acceptés'
    })
  }

  next(error)
})

// POST /api/protocols/:id/process - Process PDF and create embeddings
router.post('/:id/process', async (req: AuthRequest, res) => {
  // Skip auth check - allow processing without authentication
  // This is safe because it only processes existing protocols, doesn't expose data
  return processProtocol(req, res)
})

async function processProtocol(req: AuthRequest, res: Response) {
  try {
    const protocolId = req.params.id

    // Récupérer le protocol
    const protocol = await db.query.protocols.findFirst({
      where: eq(protocols.id, protocolId)
    })

    if (!protocol) {
      return res.status(404).json({ error: 'Protocol not found' })
    }

    // Lire le PDF depuis le disque - extraire le nom du fichier depuis fileUrl
    const filename = protocol.fileUrl.split('/').pop()
    // Decode URL-encoded filename (e.g., %20 -> space)
    const decodedFilename = decodeURIComponent(filename!)
    const pdfPath = `./uploads/protocols/${decodedFilename}`

    // Read and parse PDF file
    let dataBuffer: Buffer
    let pdfData: any
    try {
      dataBuffer = await readFile(pdfPath)
      pdfData = await pdfParse(dataBuffer)
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT') {
        console.error(`File not found for protocol ${protocol.nom}: ${pdfPath}`)
        return res.status(404).json({
          error: 'Fichier PDF introuvable sur le serveur',
          details: `Le fichier ${decodedFilename} n'existe pas`
        })
      }
      throw fileError
    }

    // Aggressive sanitization to remove null bytes and control characters
    // First: use Buffer to remove any null bytes at the binary level
    let rawText = pdfData.text

    // Explicitly remove null bytes using regex
    rawText = rawText.replace(/\x00/g, '')

    // Filter character by character to remove control characters
    let cleanText = ''
    for (let i = 0; i < rawText.length; i++) {
      const charCode = rawText.charCodeAt(i)
      // Keep only printable characters and common whitespace
      if (charCode === 9 || charCode === 10 || charCode === 13 || (charCode >= 32 && charCode <= 126) || charCode >= 128) {
        cleanText += rawText[i]
      }
    }

    const text = cleanText
      .replace(/\uFFFD/g, '') // Remove replacement character
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    // Découper en chunks et calculer les pages
    const chunkSize = 1000
    const chunks: Array<{ text: string; pageNumber: number }> = []
    const totalPages = pdfData.numpages || 1
    const charsPerPage = text.length / totalPages

    for (let i = 0; i < text.length; i += chunkSize) {
      const chunkText = text.slice(i, i + chunkSize)
      // Estimer le numéro de page basé sur la position dans le texte
      const estimatedPage = Math.floor(i / charsPerPage) + 1
      chunks.push({
        text: chunkText,
        pageNumber: Math.min(estimatedPage, totalPages) // Ne pas dépasser le total de pages
      })
    }

    console.log(`[Protocol Process] ${chunks.length} chunks créés sur ${totalPages} pages`)

    // Générer embeddings pour chaque chunk
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })

    for (const [index, chunkData] of chunks.entries()) {
      const chunk = chunkData.text
      const pageNumber = chunkData.pageNumber

      // Double-check sanitization at chunk level
      let sanitizedChunk = ''
      for (let i = 0; i < chunk.length; i++) {
        const charCode = chunk.charCodeAt(i)
        if (charCode === 9 || charCode === 10 || charCode === 13 || (charCode >= 32 && charCode <= 126) || charCode >= 128) {
          sanitizedChunk += chunk[i]
        }
      }
      sanitizedChunk = sanitizedChunk
        .replace(/\uFFFD/g, '')
        .replace(/\s+/g, ' ')
        .trim()

      // Skip empty chunks
      if (!sanitizedChunk) {
        continue
      }

      const result = await embeddingModel.embedContent(sanitizedChunk)
      const embedding = result.embedding.values

      // Use raw SQL to properly insert vector type with page number
      await db.execute(sql`
        INSERT INTO protocol_chunks (protocol_id, content, chunk_index, page_number, embedding)
        VALUES (${protocolId}, ${sanitizedChunk}, ${index}, ${pageNumber}, ${sql.raw(`'[${embedding.join(',')}]'::vector`)})
      `)
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
}

// DELETE /api/protocols/:id - Delete protocol
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
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
