import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import patientsRoutes from './routes/patients.js'
import grossessesRoutes from './routes/grossesses.js'
import consultationsRoutes from './routes/consultations.js'
import accouchementsRoutes from './routes/accouchements.js'
import bebesRoutes from './routes/bebes.js'
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
import agendaRoutes from './routes/agenda.js'
import ordonnanceTemplatesRoutes from './routes/ordonnance-templates.js'
import calendarIntegrationRoutes from './routes/calendar-integration.js'
import reeducationRoutes from './routes/reeducation.js'
import patientDocumentsRoutes from './routes/patient-documents.js'
import suiviGynecoRoutes from './routes/suivi-gyneco.js'
import consultationTemplatesRoutes from './routes/consultation-templates.js'
import surveillanceRoutes from './routes/surveillance.js'
import searchRoutes from './routes/search.js'
import notificationsRoutes from './routes/notifications.js'
import traitementsHabituelsRoutes from './routes/traitements-habituels.js'
import resultatsLaboRoutes from './routes/resultats-labo.js'
import shareRoutes from './routes/share.js'
import practiceLearningRoutes from './routes/practice-learning.js'
import { auditMiddleware } from './middleware/audit.js'
import { shareCreationLimiter, shareAccessLimiter, sharedDataLimiter } from './middleware/rate-limit.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean) // Remove undefined values

    // For /api/shared/*, allow all origins (public access with session validation)
    // This is needed for shared medical records accessed by external healthcare professionals
    if (!origin) {
      // Allow requests with no origin (like mobile apps or curl)
      callback(null, true)
    } else if (allowedOrigins.includes(origin)) {
      // Allow known origins
      callback(null, true)
    } else {
      // For all other origins, still allow but we'll validate at the session level
      callback(null, true)
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Share-Session']
}))
app.use(express.json({ limit: '400mb' }))
app.use(express.urlencoded({ limit: '400mb', extended: true }))
app.use(cookieParser())

// Cache control middleware for API responses
app.use('/api', (req, res, next) => {
  // Enable caching for GET requests only
  if (req.method === 'GET') {
    // Cache for 5 minutes for most GET requests
    res.set('Cache-Control', 'private, max-age=300')
  } else {
    // No cache for mutations
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  }
  next()
})

// Audit middleware (pour conformité HDS/RGPD)
app.use(auditMiddleware)

// Serve uploaded files with caching headers
app.use('/uploads', express.static('./uploads', {
  maxAge: '1y',
  immutable: true,
  etag: true,
}))

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
app.use('/api/consultation-templates', consultationTemplatesRoutes)
app.use('/api/surveillance', surveillanceRoutes)
app.use('/api/accouchements', accouchementsRoutes)
app.use('/api/bebes', bebesRoutes)
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
app.use('/api/agenda', agendaRoutes)
app.use('/api/ordonnance-templates', ordonnanceTemplatesRoutes)
app.use('/api/calendar-integration', calendarIntegrationRoutes)
app.use('/api/reeducation', reeducationRoutes)
app.use('/api/patient-documents', patientDocumentsRoutes)
app.use('/api/suivi-gyneco', suiviGynecoRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/traitements-habituels', traitementsHabituelsRoutes)
app.use('/api/resultats-labo', resultatsLaboRoutes)
app.use('/api/practice-learning', practiceLearningRoutes)

// Share routes with rate limiting
// Authenticated routes (/api/share) - for practitioners
app.use('/api/share', shareRoutes)

// Public routes (/api/shared) - for recipients
// Apply rate limiters directly in the share routes file for more granular control

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
