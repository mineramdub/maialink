import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { protocols, protocolChunks } from '../lib/schema.js'
import { eq, desc, sql, count } from 'drizzle-orm'
import { upload } from '../middleware/upload.js'
import { readFile, unlink, writeFile } from 'fs/promises'
import { createRequire } from 'module'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { exec } from 'child_process'
import { promisify } from 'util'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'

const execAsync = promisify(exec)
const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

// Analyze text using Claude CLI
async function analyzeWithClaude(text: string): Promise<{ category: string; description: string; durationMs: number }> {
  const sampleText = text.substring(0, 6000) // Limit text size for CLI
  const startTime = Date.now()

  const prompt = `Tu es un assistant spécialisé en médecine obstétrique et gynécologie.
Analyse ce document médical et extrais :

1. La catégorie la plus appropriée (texte libre, exemples: "Grossesse", "Post-partum", "Gynécologie", "Rééducation périnéale", "Pédiatrie", "Échographie", "Allaitement", "Contraception", etc.)

2. Une description courte (2-3 phrases maximum) résumant le contenu et l'objectif du protocole.

Réponds UNIQUEMENT en JSON valide avec ce format exact, sans markdown, sans explication :
{"category": "Catégorie ici", "description": "Description courte ici"}

Voici le début du document :
${sampleText}`

  // Write prompt to temp file to avoid shell escaping issues
  const tempFile = join(tmpdir(), `claude-prompt-${randomUUID()}.txt`)
  await writeFile(tempFile, prompt, 'utf-8')

  try {
    console.log('[Claude CLI] Analyzing document...')

    // Use claude CLI with --print flag and read prompt from file via cat
    const { stdout, stderr } = await execAsync(
      `cat "${tempFile}" | claude --print --dangerously-skip-permissions`,
      {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        timeout: 120000 // 2 min timeout
      }
    )

    if (stderr) {
      console.log('[Claude CLI] stderr:', stderr)
    }

    const durationMs = Date.now() - startTime
    console.log('[Claude CLI] Completed in', durationMs, 'ms')
    console.log('[Claude CLI] Raw response:', stdout.substring(0, 500))

    // Parse JSON from response - handle potential markdown code blocks
    let jsonStr = stdout.trim()

    // Remove markdown code blocks if present
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.replace(/```\s*/g, '')
    }

    // Extract JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*?"category"[\s\S]*?"description"[\s\S]*?\}/)
    if (!jsonMatch) {
      console.error('[Claude CLI] No valid JSON found in response')
      throw new Error('Invalid response format')
    }

    const analysis = JSON.parse(jsonMatch[0])

    console.log('[Claude CLI] Parsed result:', analysis)
    return { ...analysis, durationMs }

  } finally {
    // Clean up temp file
    try {
      await unlink(tempFile)
    } catch {}
  }
}

const router = Router()

// Types pour le tracking de progression
interface ProcessingProgress {
  step: string
  progress: number
  total: number
  message: string
}

// Store pour le suivi de progression (en mémoire, simple)
const processingStatus = new Map<string, {
  status: 'analyzing' | 'processing' | 'completed' | 'error'
  progress: ProcessingProgress[]
  error?: string
}>()

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

// GET /api/protocols/:id - Get protocol details with stats
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const protocol = await db.query.protocols.findFirst({
      where: eq(protocols.id, id),
    })

    if (!protocol) {
      return res.status(404).json({ error: 'Protocole non trouvé' })
    }

    // Get chunk count and content preview
    const chunksResult = await db.select({
      count: count(),
    }).from(protocolChunks).where(eq(protocolChunks.protocolId, id))

    const chunksCount = chunksResult[0]?.count || 0

    // Get sample chunks for content preview
    const sampleChunks = await db.query.protocolChunks.findMany({
      where: eq(protocolChunks.protocolId, id),
      orderBy: [protocolChunks.chunkIndex],
      limit: 50,
    })

    // Get processing status if available
    const status = processingStatus.get(id)

    res.json({
      success: true,
      protocol: {
        ...protocol,
        chunksCount,
        chunks: sampleChunks.map(c => ({
          id: c.id,
          content: c.content,
          pageNumber: c.pageNumber,
          chunkIndex: c.chunkIndex,
        })),
        processingStatus: status || null,
      }
    })
  } catch (error) {
    console.error('Get protocol error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/protocols/:id/status - Get processing status
router.get('/:id/status', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const status = processingStatus.get(id)

    if (!status) {
      // Check if protocol exists and is processed
      const protocol = await db.query.protocols.findFirst({
        where: eq(protocols.id, id),
      })

      if (!protocol) {
        return res.status(404).json({ error: 'Protocole non trouvé' })
      }

      if (protocol.isProcessed) {
        return res.json({
          success: true,
          status: 'completed',
          progress: [],
        })
      }

      return res.json({
        success: true,
        status: 'pending',
        progress: [],
      })
    }

    res.json({
      success: true,
      ...status,
    })
  } catch (error) {
    console.error('Get status error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Helper to format bytes to human readable
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} octets`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / 1024 / 1024).toFixed(2)} Mo`
}

// POST /api/protocols/analyze - Upload and analyze with Claude CLI
router.post('/analyze', authMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  console.log('[Protocol Analyze] Requête reçue')
  const tempFilePath = req.file?.path
  const timings: { step: string; durationMs: number }[] = []
  let stepStart = Date.now()

  try {
    const file = req.file

    if (!file) {
      return res.status(400).json({ error: 'Fichier requis' })
    }

    const mimeType = file.mimetype
    const isValidPdf = mimeType === 'application/pdf'

    console.log('[Protocol Analyze] File:', file.originalname)
    console.log('[Protocol Analyze] Type:', mimeType)
    console.log('[Protocol Analyze] Size:', formatBytes(file.size))

    // Step 1: Read file from disk
    stepStart = Date.now()
    const dataBuffer = await readFile(file.path)
    timings.push({ step: 'file_read', durationMs: Date.now() - stepStart })

    // Step 2: Parse PDF
    stepStart = Date.now()
    const pdfData = await pdfParse(dataBuffer)
    timings.push({ step: 'pdf_parse', durationMs: Date.now() - stepStart })

    // Sanitize text
    let rawText = pdfData.text
    rawText = rawText.replace(/\x00/g, '')
    let cleanText = ''
    for (let i = 0; i < rawText.length; i++) {
      const charCode = rawText.charCodeAt(i)
      if (charCode === 9 || charCode === 10 || charCode === 13 || (charCode >= 32 && charCode <= 126) || charCode >= 128) {
        cleanText += rawText[i]
      }
    }
    const text = cleanText.replace(/\uFFFD/g, '').replace(/\s+/g, ' ').trim()

    const pageCount = pdfData.numpages || 1
    console.log(`[Protocol Analyze] ${pageCount} pages, ${text.length} caractères`)

    // Step 3: Analyze with Claude CLI
    stepStart = Date.now()
    const analysis = await analyzeWithClaude(text)
    timings.push({ step: 'claude_analysis', durationMs: analysis.durationMs })

    const totalDuration = timings.reduce((sum, t) => sum + t.durationMs, 0)

    // Return analysis results with detailed file info and timing
    res.json({
      success: true,
      analysis: {
        category: analysis.category,
        description: analysis.description,
        pageCount,
        textLength: text.length,
      },
      file: {
        path: file.path,
        originalName: file.originalname,
        size: file.size,
        sizeHuman: formatBytes(file.size),
        filename: file.filename,
        mimeType,
        isValidPdf,
      },
      timings,
      totalDurationMs: totalDuration,
    })

  } catch (error: any) {
    console.error('Analyze error:', error)

    // Clean up temp file on error
    if (tempFilePath) {
      try {
        await unlink(tempFilePath)
      } catch {}
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Fichier trop volumineux',
        details: 'La taille maximale autorisée est de 400 MB'
      })
    }

    res.status(500).json({ error: 'Erreur lors de l\'analyse', details: error.message })
  }
})

// POST /api/protocols/:id/reanalyze - Re-analyze with Claude CLI
router.post('/:id/reanalyze', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const protocol = await db.query.protocols.findFirst({
      where: eq(protocols.id, id),
    })

    if (!protocol) {
      return res.status(404).json({ error: 'Protocole non trouvé' })
    }

    // Read PDF
    const filename = protocol.fileUrl.split('/').pop()
    const decodedFilename = decodeURIComponent(filename!)
    const pdfPath = `./uploads/protocols/${decodedFilename}`

    const dataBuffer = await readFile(pdfPath)
    const pdfData = await pdfParse(dataBuffer)

    // Sanitize text
    let rawText = pdfData.text
    rawText = rawText.replace(/\x00/g, '')
    let cleanText = ''
    for (let i = 0; i < rawText.length; i++) {
      const charCode = rawText.charCodeAt(i)
      if (charCode === 9 || charCode === 10 || charCode === 13 || (charCode >= 32 && charCode <= 126) || charCode >= 128) {
        cleanText += rawText[i]
      }
    }
    const text = cleanText.replace(/\uFFFD/g, '').replace(/\s+/g, ' ').trim()

    // Analyze with Claude CLI
    const analysis = await analyzeWithClaude(text)

    // Update protocol
    await db.update(protocols)
      .set({
        category: analysis.category as any,
        description: analysis.description,
        updatedAt: new Date(),
      })
      .where(eq(protocols.id, id))

    res.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('Reanalyze error:', error)
    res.status(500).json({ error: 'Erreur lors de la ré-analyse' })
  }
})

// POST /api/protocols - Create protocol (supports both old and new flow)
router.post('/', authMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  console.log('[Protocol Upload] Requête reçue')
  try {
    const file = req.file
    const { nom, description, category, filename: existingFilename, pageCount } = req.body

    console.log('[Protocol Upload] Body:', { nom, description, category, existingFilename })

    // New flow: file was already uploaded via /analyze
    if (existingFilename && !file) {
      const fileUrl = `/uploads/protocols/${existingFilename}`

      const [protocol] = await db.insert(protocols).values({
        userId: req.user!.id,
        nom,
        description: description || null,
        category: category || 'Autre',
        fileUrl,
        fileName: nom, // Use provided name
        fileSize: 0, // Not critical
        pageCount: pageCount ? parseInt(pageCount) : null,
        isProcessed: false,
      }).returning()

      return res.json({ success: true, protocol })
    }

    // Old flow: file uploaded with this request
    if (!file || !nom) {
      console.log('[Protocol Upload] Validation échouée')
      return res.status(400).json({ error: 'Fichier et nom requis' })
    }

    console.log('[Protocol Upload] File:', `${file.originalname} (${file.size} bytes)`)

    const fileUrl = `/uploads/protocols/${file.filename}`

    const [protocol] = await db.insert(protocols).values({
      userId: req.user!.id,
      nom,
      description: description || null,
      category: category || 'Autre',
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
  const protocolId = req.params.id

  // Initialize progress tracking
  processingStatus.set(protocolId, {
    status: 'processing',
    progress: [{ step: 'init', progress: 0, total: 100, message: 'Initialisation du traitement...' }]
  })

  try {
    // Récupérer le protocol
    const protocol = await db.query.protocols.findFirst({
      where: eq(protocols.id, protocolId)
    })

    if (!protocol) {
      processingStatus.set(protocolId, { status: 'error', progress: [], error: 'Protocol not found' })
      return res.status(404).json({ error: 'Protocol not found' })
    }

    // Update progress: reading file
    processingStatus.set(protocolId, {
      status: 'processing',
      progress: [{ step: 'read', progress: 0, total: 100, message: '📄 Lecture du fichier PDF...' }]
    })

    // Lire le PDF depuis le disque
    const filename = protocol.fileUrl.split('/').pop()
    const decodedFilename = decodeURIComponent(filename!)
    const pdfPath = `./uploads/protocols/${decodedFilename}`

    let dataBuffer: Buffer
    let pdfData: any
    try {
      dataBuffer = await readFile(pdfPath)
      pdfData = await pdfParse(dataBuffer)
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT') {
        console.error(`File not found for protocol ${protocol.nom}: ${pdfPath}`)
        processingStatus.set(protocolId, { status: 'error', progress: [], error: 'Fichier introuvable' })
        return res.status(404).json({
          error: 'Fichier PDF introuvable sur le serveur',
          details: `Le fichier ${decodedFilename} n'existe pas`
        })
      }
      throw fileError
    }

    const totalPages = pdfData.numpages || 1

    // Update progress: extracting text
    processingStatus.set(protocolId, {
      status: 'processing',
      progress: [{ step: 'extract', progress: 0, total: totalPages, message: `📄 Extraction du texte... (${totalPages} pages)` }]
    })

    // Sanitize text
    let rawText = pdfData.text
    rawText = rawText.replace(/\x00/g, '')
    let cleanText = ''
    for (let i = 0; i < rawText.length; i++) {
      const charCode = rawText.charCodeAt(i)
      if (charCode === 9 || charCode === 10 || charCode === 13 || (charCode >= 32 && charCode <= 126) || charCode >= 128) {
        cleanText += rawText[i]
      }
    }
    const text = cleanText.replace(/\uFFFD/g, '').replace(/\s+/g, ' ').trim()

    // Découper en chunks
    const chunkSize = 1000
    const chunks: Array<{ text: string; pageNumber: number }> = []
    const charsPerPage = text.length / totalPages

    for (let i = 0; i < text.length; i += chunkSize) {
      const chunkText = text.slice(i, i + chunkSize)
      const estimatedPage = Math.floor(i / charsPerPage) + 1
      chunks.push({
        text: chunkText,
        pageNumber: Math.min(estimatedPage, totalPages)
      })
    }

    console.log(`[Protocol Process] ${chunks.length} chunks créés sur ${totalPages} pages`)

    // Update progress: chunking done
    processingStatus.set(protocolId, {
      status: 'processing',
      progress: [{ step: 'chunk', progress: chunks.length, total: chunks.length, message: `⚙️ ${chunks.length} chunks créés` }]
    })

    // Générer embeddings
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })

    let processedChunks = 0
    for (const [index, chunkData] of chunks.entries()) {
      const chunk = chunkData.text
      const pageNumber = chunkData.pageNumber

      // Sanitize chunk
      let sanitizedChunk = ''
      for (let i = 0; i < chunk.length; i++) {
        const charCode = chunk.charCodeAt(i)
        if (charCode === 9 || charCode === 10 || charCode === 13 || (charCode >= 32 && charCode <= 126) || charCode >= 128) {
          sanitizedChunk += chunk[i]
        }
      }
      sanitizedChunk = sanitizedChunk.replace(/\uFFFD/g, '').replace(/\s+/g, ' ').trim()

      if (!sanitizedChunk) continue

      const result = await embeddingModel.embedContent(sanitizedChunk)
      const embedding = result.embedding.values

      await db.execute(sql`
        INSERT INTO protocol_chunks (protocol_id, content, chunk_index, page_number, embedding)
        VALUES (${protocolId}, ${sanitizedChunk}, ${index}, ${pageNumber}, ${sql.raw(`'[${embedding.join(',')}]'::vector`)})
      `)

      processedChunks++

      // Update progress every 10 chunks or at the end
      if (processedChunks % 10 === 0 || processedChunks === chunks.length) {
        processingStatus.set(protocolId, {
          status: 'processing',
          progress: [{
            step: 'embedding',
            progress: processedChunks,
            total: chunks.length,
            message: `🔢 Génération embeddings... (${processedChunks}/${chunks.length})`
          }]
        })
      }
    }

    // Update page count if not set
    await db.update(protocols)
      .set({
        isProcessed: true,
        pageCount: totalPages,
        updatedAt: new Date()
      })
      .where(eq(protocols.id, protocolId))

    // Mark as completed
    processingStatus.set(protocolId, {
      status: 'completed',
      progress: [{ step: 'done', progress: chunks.length, total: chunks.length, message: `✅ Traitement terminé (${chunks.length} chunks)` }]
    })

    // Clean up status after 5 minutes
    setTimeout(() => processingStatus.delete(protocolId), 5 * 60 * 1000)

    res.json({ success: true, chunksCount: chunks.length, pages: totalPages })
  } catch (error) {
    console.error('Process error:', error)
    processingStatus.set(protocolId, { status: 'error', progress: [], error: 'Erreur traitement' })
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
