import multer from 'multer'
import path from 'path'
import { mkdir } from 'fs/promises'

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = './uploads/protocols'
    await mkdir(uploadDir, { recursive: true })
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

const MAX_FILE_SIZE = 400 * 1024 * 1024 // 400MB

console.log(`[Upload Config] Limite fichier configurée: ${MAX_FILE_SIZE / 1024 / 1024}MB`)

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fieldSize: MAX_FILE_SIZE, // Limite pour les champs de formulaire
    fieldNameSize: 1000, // Limite pour les noms de champs
    fields: 10, // Nombre max de champs non-fichiers
    parts: 20 // Nombre max de parties (fields + files)
  },
  fileFilter: (req, file, cb) => {
    console.log(`[Upload] Tentative upload: ${file.originalname} (${file.mimetype})`)
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Seuls les fichiers PDF sont acceptes'))
    }
  }
})
