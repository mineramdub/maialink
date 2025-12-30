import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import patientsRoutes from './routes/patients.js'
import grossessesRoutes from './routes/grossesses.js'
import consultationsRoutes from './routes/consultations.js'
import invoicesRoutes from './routes/invoices.js'
import protocolsRoutes from './routes/protocols.js'
import chatRoutes from './routes/chat.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())

// Serve uploaded files
app.use('/uploads', express.static('./uploads'))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API serveur fonctionnel' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientsRoutes)
app.use('/api/grossesses', grossessesRoutes)
app.use('/api/consultations', consultationsRoutes)
app.use('/api/invoices', invoicesRoutes)
app.use('/api/protocols', protocolsRoutes)
app.use('/api/chat', chatRoutes)

app.listen(PORT, () => {
  console.log(`API serveur demarre sur http://localhost:${PORT}`)
})

export { app }
