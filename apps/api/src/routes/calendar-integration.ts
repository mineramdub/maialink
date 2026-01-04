import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { calendarIntegrations, appointments } from '../lib/schema.js'
import { eq, and } from 'drizzle-orm'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

const router = Router()
router.use(authMiddleware)

// Configuration Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/calendar-integration/callback'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

function getOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  )
}

// GET /api/calendar-integration/auth-url - Générer l'URL d'authentification Google
router.get('/auth-url', async (req: AuthRequest, res) => {
  try {
    const oauth2Client = getOAuth2Client()

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: req.user!.id, // Pour vérifier l'utilisateur au callback
      prompt: 'consent', // Force le consent pour obtenir refresh token
    })

    res.json({
      success: true,
      authUrl,
    })
  } catch (error) {
    console.error('Generate auth URL error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/calendar-integration/callback - Callback OAuth Google
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query
    const userId = state as string

    if (!code || !userId) {
      return res.status(400).json({ error: 'Code ou userId manquant' })
    }

    const oauth2Client = getOAuth2Client()
    const { tokens } = await oauth2Client.getToken(code as string)

    // Récupérer l'email de l'utilisateur Google
    oauth2Client.setCredentials(tokens)
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const userInfo = await oauth2.userinfo.get()
    const googleEmail = userInfo.data.email

    // Sauvegarder les tokens dans la base de données
    const existingIntegration = await db.query.calendarIntegrations.findFirst({
      where: eq(calendarIntegrations.userId, userId),
    })

    const integrationData = {
      userId,
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
      googleTokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      googleEmail,
      syncEnabled: true,
      updatedAt: new Date(),
    }

    if (existingIntegration) {
      await db.update(calendarIntegrations)
        .set(integrationData)
        .where(eq(calendarIntegrations.userId, userId))
    } else {
      await db.insert(calendarIntegrations).values(integrationData)
    }

    // Rediriger vers le frontend avec succès
    res.redirect(`${process.env.FRONTEND_URL}/settings?calendar=connected`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/settings?calendar=error`)
  }
})

// GET /api/calendar-integration/status - Vérifier le statut de l'intégration
router.get('/status', async (req: AuthRequest, res) => {
  try {
    const integration = await db.query.calendarIntegrations.findFirst({
      where: eq(calendarIntegrations.userId, req.user!.id),
    })

    if (!integration) {
      return res.json({
        success: true,
        connected: false,
      })
    }

    res.json({
      success: true,
      connected: !!integration.googleAccessToken,
      syncEnabled: integration.syncEnabled,
      googleEmail: integration.googleEmail,
      lastSyncAt: integration.lastSyncAt,
      syncDirection: integration.syncDirection,
      doctolibCalendarName: integration.doctolibCalendarName,
    })
  } catch (error) {
    console.error('Get integration status error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PATCH /api/calendar-integration/settings - Mettre à jour les paramètres de sync
router.patch('/settings', async (req: AuthRequest, res) => {
  try {
    const { syncEnabled, syncDirection, syncFrequency, doctolibCalendarName, googleCalendarId } = req.body

    const integration = await db.query.calendarIntegrations.findFirst({
      where: eq(calendarIntegrations.userId, req.user!.id),
    })

    if (!integration) {
      return res.status(404).json({ error: 'Intégration non trouvée. Veuillez d\'abord vous connecter à Google Calendar.' })
    }

    const updateData: any = { updatedAt: new Date() }
    if (syncEnabled !== undefined) updateData.syncEnabled = syncEnabled
    if (syncDirection !== undefined) updateData.syncDirection = syncDirection
    if (syncFrequency !== undefined) updateData.syncFrequency = syncFrequency
    if (doctolibCalendarName !== undefined) updateData.doctolibCalendarName = doctolibCalendarName
    if (googleCalendarId !== undefined) updateData.googleCalendarId = googleCalendarId

    await db.update(calendarIntegrations)
      .set(updateData)
      .where(eq(calendarIntegrations.userId, req.user!.id))

    res.json({
      success: true,
      message: 'Paramètres mis à jour',
    })
  } catch (error) {
    console.error('Update settings error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/calendar-integration/disconnect - Déconnecter Google Calendar
router.delete('/disconnect', async (req: AuthRequest, res) => {
  try {
    await db.delete(calendarIntegrations)
      .where(eq(calendarIntegrations.userId, req.user!.id))

    res.json({
      success: true,
      message: 'Déconnecté de Google Calendar',
    })
  } catch (error) {
    console.error('Disconnect error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/calendar-integration/calendars - Liste les calendriers Google disponibles
router.get('/calendars', async (req: AuthRequest, res) => {
  try {
    const integration = await db.query.calendarIntegrations.findFirst({
      where: eq(calendarIntegrations.userId, req.user!.id),
    })

    if (!integration || !integration.googleAccessToken) {
      return res.status(404).json({ error: 'Intégration non trouvée' })
    }

    const oauth2Client = getOAuth2Client()
    oauth2Client.setCredentials({
      access_token: integration.googleAccessToken,
      refresh_token: integration.googleRefreshToken,
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const calendarList = await calendar.calendarList.list()

    const calendars = calendarList.data.items?.map(cal => ({
      id: cal.id,
      summary: cal.summary,
      description: cal.description,
      primary: cal.primary,
      backgroundColor: cal.backgroundColor,
    })) || []

    res.json({
      success: true,
      calendars,
    })
  } catch (error) {
    console.error('Get calendars error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/calendar-integration/sync - Lancer une synchronisation manuelle
router.post('/sync', async (req: AuthRequest, res) => {
  try {
    const integration = await db.query.calendarIntegrations.findFirst({
      where: eq(calendarIntegrations.userId, req.user!.id),
    })

    if (!integration || !integration.googleAccessToken) {
      return res.status(404).json({ error: 'Intégration non trouvée' })
    }

    if (!integration.syncEnabled) {
      return res.status(400).json({ error: 'Synchronisation désactivée' })
    }

    // Importer le service de sync (on va le créer ensuite)
    const { syncGoogleCalendar } = await import('../lib/google-calendar-sync.js')

    const result = await syncGoogleCalendar(req.user!.id)

    res.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Manual sync error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
