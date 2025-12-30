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

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Seuls les fichiers PDF sont acceptes'))
    }
  }
})
