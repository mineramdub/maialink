import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { resultatsLaboratoire } from '../lib/schema.js'
import { eq, desc, and } from 'drizzle-orm'
import { upload } from '../middleware/upload.js'
import { readFile, unlink } from 'fs/promises'
import { createRequire } from 'module'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

const router = Router()

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// Processing status tracking (in-memory)
interface ProcessingStatus {
  step: string
  progress: number
  isProcessed: boolean
  processingError?: string
}

const processingStatus = new Map<string, ProcessingStatus>()

// Function to extract lab results using Gemini AI
async function extractLabResults(pdfText: string): Promise<any> {
  const prompt = `Tu es un assistant médical spécialisé dans l'analyse de résultats de laboratoire en France.

Analyse ce texte extrait d'un PDF de résultats de laboratoire et extrais les données de manière structurée.

CATÉGORIES :
- hematologie : NFS, hémoglobine, hématocrite, leucocytes, plaquettes, VGM, TCMH, CCMH, neutrophiles, lymphocytes, monocytes, éosinophiles, basophiles, etc.
- biochimie : glycémie, créatinine, urée, transaminases (ASAT, ALAT), bilirubine, protéines, albumine, électrolytes (Na, K, Cl, Ca, Mg), phosphore, acide urique, cholestérol, triglycérides, HDL, LDL, etc.
- serologies : toxoplasmose, rubéole, VIH, VHB, VHC, syphilis, CMV, VZV, etc.
- hormones : TSH, T3, T4, βHCG, progestérone, œstrogènes, FSH, LH, prolactine, cortisol, DHEA, testostérone, etc.
- autres : tous les tests qui ne rentrent pas dans les catégories ci-dessus (vitamines, marqueurs tumoraux, gaz du sang, etc.)

RÈGLES D'EXTRACTION :
1. Pour chaque test, extrais : nom exact, valeur (nombre + décimales ou texte), unité, intervalle de référence
2. Compare la valeur à l'intervalle de référence pour déterminer le statut :
   - "normal" : valeur dans l'intervalle
   - "anormal" : valeur hors intervalle mais pas critique
   - "critique" : valeur très élevée ou très basse (hors intervalle avec écart >50%)
3. Si l'intervalle de référence n'est pas fourni, mets statut = "normal" par défaut
4. Garde les noms de tests en français
5. Conserve les valeurs qualitatives (Positif, Négatif, Présence, Absence, Détecté, Non détecté)
6. Extrais aussi la date de l'examen (format YYYY-MM-DD) et le nom du laboratoire si présent dans le texte

FORMAT DE RÉPONSE :
Réponds UNIQUEMENT en JSON valide, sans markdown, sans explication :
{
  "dateExamen": "YYYY-MM-DD",
  "laboratoire": "nom du laboratoire",
  "hematologie": [
    {
      "nom": "Hémoglobine",
      "valeur": "13.5",
      "unite": "g/dL",
      "reference": "12.0 - 16.0",
      "statut": "normal"
    }
  ],
  "biochimie": [],
  "serologies": [],
  "hormones": [],
  "autres": []
}

Texte du résultat :
${pdfText}`

  try {
    console.log('[Claude] Analyzing lab results...')
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }]
    })

    const response = message.content[0].type === 'text' ? message.content[0].text : ''

    console.log('[Claude] Raw response:', response.substring(0, 500))

    // Parse JSON en gérant les markdown code blocks
    let jsonStr = response.trim()
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.replace(/```\s*/g, '')
    }

    // Extract JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*?\}(?=\s*$)/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }

    const extracted = JSON.parse(jsonMatch[0])
    console.log('[Claude] Extraction successful')

    return extracted
  } catch (error) {
    console.error('[Claude] Extraction error:', error)
    throw new Error('Failed to extract lab results: ' + (error as Error).message)
  }
}

// POST /api/resultats-labo/upload - Upload PDF and create record
router.post('/upload', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    if (req.file.mimetype !== 'application/pdf') {
      await unlink(req.file.path)
      return res.status(400).json({ error: 'Only PDF files are allowed' })
    }

    const { patientId, grossesseId, dateExamen, laboratoire, prescripteur, notes } = req.body

    if (!patientId || !dateExamen) {
      await unlink(req.file.path)
      return res.status(400).json({ error: 'Patient ID and exam date are required' })
    }

    // Create record in database
    const [resultat] = await db.insert(resultatsLaboratoire).values({
      patientId,
      grossesseId: grossesseId || null,
      userId: req.user!.userId,
      fichierUrl: req.file.path,
      fichierName: req.file.originalname,
      fichierSize: req.file.size,
      mimeType: req.file.mimetype,
      dateExamen,
      laboratoire: laboratoire || null,
      prescripteur: prescripteur || null,
      notes: notes || null,
      isProcessed: false,
    }).returning()

    console.log(`[Upload] Created lab result ${resultat.id} for patient ${patientId}`)

    // Initialize processing status
    processingStatus.set(resultat.id, {
      step: 'uploaded',
      progress: 0,
      isProcessed: false,
    })

    // Start processing in background
    processLabResult(resultat.id).catch(error => {
      console.error(`[Processing] Error for ${resultat.id}:`, error)
      processingStatus.set(resultat.id, {
        step: 'error',
        progress: 100,
        isProcessed: false,
        processingError: error.message,
      })
    })

    res.json({
      id: resultat.id,
      message: 'File uploaded successfully, processing started',
    })
  } catch (error) {
    console.error('[Upload] Error:', error)
    res.status(500).json({ error: 'Failed to upload file' })
  }
})

// Background processing function
async function processLabResult(id: string) {
  try {
    // Update status
    processingStatus.set(id, { step: 'reading_pdf', progress: 25, isProcessed: false })

    // Get the record
    const [resultat] = await db.select().from(resultatsLaboratoire).where(eq(resultatsLaboratoire.id, id))

    if (!resultat) {
      throw new Error('Lab result not found')
    }

    // Read PDF file
    const fileBuffer = await readFile(resultat.fichierUrl)
    console.log(`[Processing] Read PDF file ${resultat.fichierName} (${fileBuffer.length} bytes)`)

    // Extract text from PDF
    processingStatus.set(id, { step: 'extracting_text', progress: 50, isProcessed: false })
    const pdfData = await pdfParse(fileBuffer)
    const pdfText = pdfData.text

    console.log(`[Processing] Extracted ${pdfText.length} characters from PDF`)

    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error('No text could be extracted from PDF')
    }

    // Extract structured data with Gemini
    processingStatus.set(id, { step: 'analyzing_with_ai', progress: 75, isProcessed: false })
    const extracted = await extractLabResults(pdfText)

    // Update database with extracted data
    await db.update(resultatsLaboratoire)
      .set({
        donneesExtraites: extracted,
        dateExamen: extracted.dateExamen || resultat.dateExamen,
        laboratoire: extracted.laboratoire || resultat.laboratoire,
        isProcessed: true,
        updatedAt: new Date(),
      })
      .where(eq(resultatsLaboratoire.id, id))

    console.log(`[Processing] Successfully processed lab result ${id}`)

    // Update status
    processingStatus.set(id, { step: 'completed', progress: 100, isProcessed: true })

    // Clear status after 5 minutes
    setTimeout(() => {
      processingStatus.delete(id)
    }, 5 * 60 * 1000)
  } catch (error) {
    console.error(`[Processing] Error for ${id}:`, error)

    // Update database with error
    await db.update(resultatsLaboratoire)
      .set({
        processingError: (error as Error).message,
        updatedAt: new Date(),
      })
      .where(eq(resultatsLaboratoire.id, id))

    // Update status
    processingStatus.set(id, {
      step: 'error',
      progress: 100,
      isProcessed: false,
      processingError: (error as Error).message,
    })
  }
}

// GET /api/resultats-labo/:id/status - Get processing status
router.get('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    // Check in-memory status first
    const status = processingStatus.get(id)

    if (status) {
      return res.json(status)
    }

    // If not in memory, check database
    const [resultat] = await db.select({
      isProcessed: resultatsLaboratoire.isProcessed,
      processingError: resultatsLaboratoire.processingError,
    }).from(resultatsLaboratoire).where(eq(resultatsLaboratoire.id, id))

    if (!resultat) {
      return res.status(404).json({ error: 'Lab result not found' })
    }

    res.json({
      step: resultat.isProcessed ? 'completed' : 'processing',
      progress: resultat.isProcessed ? 100 : 50,
      isProcessed: resultat.isProcessed,
      processingError: resultat.processingError,
    })
  } catch (error) {
    console.error('[Status] Error:', error)
    res.status(500).json({ error: 'Failed to get status' })
  }
})

// GET /api/resultats-labo/patient/:patientId - Get all results for a patient
router.get('/patient/:patientId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId } = req.params

    const resultats = await db.select()
      .from(resultatsLaboratoire)
      .where(eq(resultatsLaboratoire.patientId, patientId))
      .orderBy(desc(resultatsLaboratoire.dateExamen))

    res.json(resultats)
  } catch (error) {
    console.error('[List] Error:', error)
    res.status(500).json({ error: 'Failed to fetch lab results' })
  }
})

// POST /api/resultats-labo/manual - Manual entry of lab results
router.post('/manual', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, dateExamen, laboratoire, donneesExtraites, notes } = req.body
    const userId = req.user!.id

    if (!patientId || !dateExamen || !donneesExtraites) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const [resultat] = await db.insert(resultatsLaboratoire).values({
      patientId,
      userId,
      dateExamen: new Date(dateExamen),
      laboratoire: laboratoire || 'Saisie manuelle',
      fichierName: 'Saisie manuelle',
      fichierUrl: '',
      donneesExtraites,
      notes: notes || null,
      isProcessed: true,
      statut: 'recupere',
    }).returning()

    console.log('[Manual Entry] Created:', resultat.id)
    res.json(resultat)
  } catch (error) {
    console.error('[Manual Entry] Error:', error)
    res.status(500).json({ error: 'Failed to create manual lab result' })
  }
})

// GET /api/resultats-labo/:id - Get single result with details
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const [resultat] = await db.select()
      .from(resultatsLaboratoire)
      .where(eq(resultatsLaboratoire.id, id))

    if (!resultat) {
      return res.status(404).json({ error: 'Lab result not found' })
    }

    res.json(resultat)
  } catch (error) {
    console.error('[Get] Error:', error)
    res.status(500).json({ error: 'Failed to fetch lab result' })
  }
})

// PUT /api/resultats-labo/:id - Update result (including manual edits)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { donneesExtraites, notes, isValidated, dateExamen, laboratoire, prescripteur, highlights } = req.body

    const updateData: any = { updatedAt: new Date() }

    if (donneesExtraites !== undefined) updateData.donneesExtraites = donneesExtraites
    if (notes !== undefined) updateData.notes = notes
    if (isValidated !== undefined) updateData.isValidated = isValidated
    if (dateExamen !== undefined) updateData.dateExamen = dateExamen
    if (laboratoire !== undefined) updateData.laboratoire = laboratoire
    if (prescripteur !== undefined) updateData.prescripteur = prescripteur
    if (highlights !== undefined) updateData.highlights = highlights

    const [updated] = await db.update(resultatsLaboratoire)
      .set(updateData)
      .where(eq(resultatsLaboratoire.id, id))
      .returning()

    if (!updated) {
      return res.status(404).json({ error: 'Lab result not found' })
    }

    res.json(updated)
  } catch (error) {
    console.error('[Update] Error:', error)
    res.status(500).json({ error: 'Failed to update lab result' })
  }
})

// DELETE /api/resultats-labo/:id - Delete result and file
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    // Get the result to delete the file
    const [resultat] = await db.select()
      .from(resultatsLaboratoire)
      .where(eq(resultatsLaboratoire.id, id))

    if (!resultat) {
      return res.status(404).json({ error: 'Lab result not found' })
    }

    // Delete the PDF file
    try {
      await unlink(resultat.fichierUrl)
      console.log(`[Delete] Deleted file ${resultat.fichierUrl}`)
    } catch (error) {
      console.error('[Delete] Failed to delete file:', error)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await db.delete(resultatsLaboratoire).where(eq(resultatsLaboratoire.id, id))

    res.json({ message: 'Lab result deleted successfully' })
  } catch (error) {
    console.error('[Delete] Error:', error)
    res.status(500).json({ error: 'Failed to delete lab result' })
  }
})

// GET /api/resultats-labo/:id/download - Download original PDF
router.get('/:id/download', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const [resultat] = await db.select()
      .from(resultatsLaboratoire)
      .where(eq(resultatsLaboratoire.id, id))

    if (!resultat) {
      return res.status(404).json({ error: 'Lab result not found' })
    }

    // Send file
    res.download(resultat.fichierUrl, resultat.fichierName)
  } catch (error) {
    console.error('[Download] Error:', error)
    res.status(500).json({ error: 'Failed to download file' })
  }
})

// POST /api/resultats-labo/:id/reprocess - Reprocess PDF with AI
router.post('/:id/reprocess', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const [resultat] = await db.select()
      .from(resultatsLaboratoire)
      .where(eq(resultatsLaboratoire.id, id))

    if (!resultat) {
      return res.status(404).json({ error: 'Lab result not found' })
    }

    // Reset processing status
    await db.update(resultatsLaboratoire)
      .set({
        isProcessed: false,
        processingError: null,
        updatedAt: new Date(),
      })
      .where(eq(resultatsLaboratoire.id, id))

    // Start processing
    processingStatus.set(id, {
      step: 'reprocessing',
      progress: 0,
      isProcessed: false,
    })

    processLabResult(id).catch(error => {
      console.error(`[Reprocess] Error for ${id}:`, error)
      processingStatus.set(id, {
        step: 'error',
        progress: 100,
        isProcessed: false,
        processingError: error.message,
      })
    })

    res.json({ message: 'Reprocessing started' })
  } catch (error) {
    console.error('[Reprocess] Error:', error)
    res.status(500).json({ error: 'Failed to reprocess' })
  }
})

export default router
