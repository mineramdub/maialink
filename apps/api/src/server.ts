import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import patientsRoutes from './routes/patients.js'
import grossessesRoutes from './routes/grossesses.js'
import consultationsRoutes from './routes/consultations.js'
import accouchementsRoutes from './routes/accouchements.js'
import invoicesRoutes from './routes/invoices.js'
import protocolsRoutes from './routes/protocols.js'
import chatRoutes from './routes/chat.js'
import appointmentsRoutes from './routes/appointments.js'
import ordonnancesRoutes from './routes/ordonnances.js'
import alertesRoutes from './routes/alertes.js'
import auditRoutes from './routes/audit.js'
import gynecoRoutes from './routes/gyneco.js'
import dashboardRoutes from './routes/dashboard.js'
import documentTemplatesRoutes from './routes/documentTemplates.js'
import practitionerRoutes from './routes/practitioner.js'
import templatesRoutes from './routes/templates.js'
import { auditMiddleware } from './middleware/audit.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '400mb' }))
app.use(express.urlencoded({ limit: '400mb', extended: true }))
app.use(cookieParser())

// Audit middleware (pour conformité HDS/RGPD)
app.use(auditMiddleware)

// Serve uploaded files
app.use('/uploads', express.static('./uploads'))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API serveur fonctionnel' })
})

// Admin: Process all unprocessed protocols (temporary endpoint)
app.post('/admin/process-protocols', async (req, res) => {
  try {
    const { db } = await import('./lib/db.js')
    const { protocols } = await import('./lib/schema.js')
    const { eq } = await import('drizzle-orm')

    const unprocessedProtocols = await db.query.protocols.findMany({
      where: eq(protocols.isProcessed, false)
    })

    console.log(`Found ${unprocessedProtocols.length} unprocessed protocols`)

    const results = []
    for (const protocol of unprocessedProtocols) {
      console.log(`\nProcessing: ${protocol.nom} (ID: ${protocol.id})`)

      try {
        const response = await fetch(`http://localhost:${PORT}/api/protocols/${protocol.id}/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`  ✓ Processed successfully: ${data.chunksCount} chunks`)
          results.push({ id: protocol.id, nom: protocol.nom, success: true, chunks: data.chunksCount })
        } else {
          const errorText = await response.text()
          console.error(`  ✗ Error: ${errorText}`)
          results.push({ id: protocol.id, nom: protocol.nom, success: false, error: errorText })
        }
      } catch (error) {
        console.error(`  ✗ Error:`, error.message)
        results.push({ id: protocol.id, nom: protocol.nom, success: false, error: error.message })
      }
    }

    res.json({ success: true, processed: results.length, results })
  } catch (error) {
    console.error('Admin process error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/patients', patientsRoutes)
app.use('/api/grossesses', grossessesRoutes)
app.use('/api/consultations', consultationsRoutes)
app.use('/api/accouchements', accouchementsRoutes)
app.use('/api/invoices', invoicesRoutes)
app.use('/api/protocols', protocolsRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/ordonnances', ordonnancesRoutes)
app.use('/api/alertes', alertesRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/gyneco', gynecoRoutes)
app.use('/api/document-templates', documentTemplatesRoutes)
app.use('/api/practitioner', practitionerRoutes)
app.use('/api/templates', templatesRoutes)

// Global error handler for Multer errors
app.use((error: any, req: any, res: any, next: any) => {
  console.error('[Server Error Handler]', error)

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Fichier trop volumineux',
      details: `La taille maximale autorisée est de 400 MB. Votre fichier fait ${Math.round(error.fileSize / 1024 / 1024)}MB`
    })
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      error: 'Trop de fichiers',
      details: 'Un seul fichier peut être envoyé à la fois'
    })
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Champ de fichier inattendu',
      details: error.message
    })
  }

  if (error.message && error.message.includes('PDF')) {
    return res.status(400).json({
      error: 'Format de fichier invalide',
      details: error.message
    })
  }

  // Erreur générique
  res.status(500).json({
    error: 'Erreur serveur',
    details: error.message
  })
})

app.listen(PORT, () => {
  console.log(`API serveur demarre sur http://localhost:${PORT}`)
})

export { app }
