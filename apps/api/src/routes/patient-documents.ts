import { Router } from 'express'
import { db } from '../lib/db'
import { documents } from '../lib/schema'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { eq, and } from 'drizzle-orm'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = Router()

// Configuration multer pour upload de fichiers
const uploadsDir = path.join(process.cwd(), 'uploads', 'patient-documents')

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png']
    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Type de fichier non autorisé. Seuls PDF, JPG, PNG sont acceptés.'))
    }
  },
})

// GET /api/patient-documents/:patientId - Liste tous les documents d'un patient
router.get('/:patientId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { patientId } = req.params

    const patientDocuments = await db.query.documents.findMany({
      where: and(
        eq(documents.patientId, patientId),
        eq(documents.userId, req.user!.id)
      ),
      orderBy: (documents, { desc }) => [desc(documents.createdAt)],
    })

    res.json({ success: true, documents: patientDocuments })
  } catch (error) {
    console.error('Error fetching patient documents:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// POST /api/patient-documents/:patientId/upload - Upload un document
router.post(
  '/:patientId/upload',
  authMiddleware,
  upload.single('file'),
  async (req: AuthRequest, res) => {
    try {
      const { patientId } = req.params
      const { title, notes } = req.body

      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Aucun fichier fourni' })
      }

      // Créer l'entrée dans la BDD
      const [document] = await db
        .insert(documents)
        .values({
          patientId,
          userId: req.user!.id,
          type: 'autre',
          title: title || req.file.originalname,
          filePath: req.file.filename, // Stocke juste le nom du fichier
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          notes,
        })
        .returning()

      res.json({ success: true, document })
    } catch (error) {
      console.error('Error uploading document:', error)
      // Supprimer le fichier si erreur BDD
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      res.status(500).json({ success: false, error: 'Erreur lors de l\'upload' })
    }
  }
)

// GET /api/patient-documents/:patientId/download/:documentId - Télécharger un document
router.get(
  '/:patientId/download/:documentId',
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { patientId, documentId } = req.params

      const document = await db.query.documents.findFirst({
        where: and(
          eq(documents.id, documentId),
          eq(documents.patientId, patientId),
          eq(documents.userId, req.user!.id)
        ),
      })

      if (!document || !document.filePath) {
        return res.status(404).json({ success: false, error: 'Document introuvable' })
      }

      const filePath = path.join(uploadsDir, document.filePath)

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: 'Fichier introuvable' })
      }

      res.download(filePath, document.title || 'document.pdf')
    } catch (error) {
      console.error('Error downloading document:', error)
      res.status(500).json({ success: false, error: 'Erreur lors du téléchargement' })
    }
  }
)

// DELETE /api/patient-documents/:patientId/:documentId - Supprimer un document
router.delete(
  '/:patientId/:documentId',
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { patientId, documentId } = req.params

      const document = await db.query.documents.findFirst({
        where: and(
          eq(documents.id, documentId),
          eq(documents.patientId, patientId),
          eq(documents.userId, req.user!.id)
        ),
      })

      if (!document) {
        return res.status(404).json({ success: false, error: 'Document introuvable' })
      }

      // Supprimer le fichier physique
      if (document.filePath) {
        const filePath = path.join(uploadsDir, document.filePath)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }

      // Supprimer de la BDD
      await db.delete(documents).where(eq(documents.id, documentId))

      res.json({ success: true })
    } catch (error) {
      console.error('Error deleting document:', error)
      res.status(500).json({ success: false, error: 'Erreur lors de la suppression' })
    }
  }
)

export default router
