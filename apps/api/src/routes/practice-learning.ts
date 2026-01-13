import { Router } from 'express'
import { authenticateToken } from '../middleware/auth'
import { PracticeLearningService } from '../lib/practice-learning-service'
import { db } from '../lib/db'
import { users } from '../lib/schema'
import { eq } from 'drizzle-orm'

const router = Router()

// Toutes les routes nécessitent une authentification
router.use(authenticateToken)

/**
 * GET /api/practice-learning/stats
 * Obtenir les statistiques d'apprentissage
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user!.id

    const stats = await PracticeLearningService.getUserLearningStats(userId)

    res.json(stats)
  } catch (error) {
    console.error('Error fetching learning stats:', error)
    res.status(500).json({ error: 'Failed to fetch learning stats' })
  }
})

/**
 * POST /api/practice-learning/suggestions
 * Obtenir des suggestions pour un contexte donné
 */
router.post('/suggestions', async (req, res) => {
  try {
    const userId = req.user!.id
    const { context } = req.body

    if (!context) {
      return res.status(400).json({ error: 'Context is required' })
    }

    const suggestions = await PracticeLearningService.getSuggestions(userId, context)

    res.json({ suggestions })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    res.status(500).json({ error: 'Failed to fetch suggestions' })
  }
})

/**
 * POST /api/practice-learning/capture/prescription
 * Capturer une prescription
 */
router.post('/capture/prescription', async (req, res) => {
  try {
    const userId = req.user!.id
    const { context, prescription } = req.body

    if (!context || !prescription) {
      return res.status(400).json({ error: 'Context and prescription are required' })
    }

    await PracticeLearningService.capturePrescription(userId, context, prescription)

    res.json({ success: true })
  } catch (error) {
    console.error('Error capturing prescription:', error)
    res.status(500).json({ error: 'Failed to capture prescription' })
  }
})

/**
 * POST /api/practice-learning/capture/examen
 * Capturer un examen
 */
router.post('/capture/examen', async (req, res) => {
  try {
    const userId = req.user!.id
    const { context, examen } = req.body

    if (!context || !examen) {
      return res.status(400).json({ error: 'Context and examen are required' })
    }

    await PracticeLearningService.captureExamen(userId, context, examen)

    res.json({ success: true })
  } catch (error) {
    console.error('Error capturing examen:', error)
    res.status(500).json({ error: 'Failed to capture examen' })
  }
})

/**
 * POST /api/practice-learning/capture/conseil
 * Capturer un conseil
 */
router.post('/capture/conseil', async (req, res) => {
  try {
    const userId = req.user!.id
    const { context, conseil } = req.body

    if (!context || !conseil) {
      return res.status(400).json({ error: 'Context and conseil are required' })
    }

    await PracticeLearningService.captureConseil(userId, context, conseil)

    res.json({ success: true })
  } catch (error) {
    console.error('Error capturing conseil:', error)
    res.status(500).json({ error: 'Failed to capture conseil' })
  }
})

/**
 * POST /api/practice-learning/suggestions/:id/accept
 * Accepter une suggestion
 */
router.post('/suggestions/:id/accept', async (req, res) => {
  try {
    const userId = req.user!.id
    const suggestionId = req.params.id

    await PracticeLearningService.acceptSuggestion(userId, suggestionId)

    res.json({ success: true })
  } catch (error) {
    console.error('Error accepting suggestion:', error)
    res.status(500).json({ error: 'Failed to accept suggestion' })
  }
})

/**
 * POST /api/practice-learning/suggestions/:id/reject
 * Refuser une suggestion
 */
router.post('/suggestions/:id/reject', async (req, res) => {
  try {
    const userId = req.user!.id
    const suggestionId = req.params.id
    const { feedback } = req.body

    await PracticeLearningService.rejectSuggestion(userId, suggestionId, feedback)

    res.json({ success: true })
  } catch (error) {
    console.error('Error rejecting suggestion:', error)
    res.status(500).json({ error: 'Failed to reject suggestion' })
  }
})

/**
 * GET /api/practice-learning/settings
 * Obtenir les paramètres d'apprentissage
 */
router.get('/settings', async (req, res) => {
  try {
    const userId = req.user!.id

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Les paramètres seront dans user.settings (à ajouter au schéma users)
    const settings = (user as any).practiceLearningSettings || {
      enabled: true,
      autoCapture: true,
      showSuggestions: true,
    }

    res.json(settings)
  } catch (error) {
    console.error('Error fetching learning settings:', error)
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
})

/**
 * PUT /api/practice-learning/settings
 * Mettre à jour les paramètres d'apprentissage
 */
router.put('/settings', async (req, res) => {
  try {
    const userId = req.user!.id
    const settings = req.body

    // TODO: Ajouter practiceLearningSettings au schéma users
    // Pour l'instant, on retourne simplement les settings
    res.json({ success: true, settings })
  } catch (error) {
    console.error('Error updating learning settings:', error)
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

/**
 * DELETE /api/practice-learning/data
 * Supprimer toutes les données d'apprentissage
 */
router.delete('/data', async (req, res) => {
  try {
    const userId = req.user!.id

    await PracticeLearningService.deleteAllUserData(userId)

    res.json({ success: true, message: 'All learning data deleted' })
  } catch (error) {
    console.error('Error deleting learning data:', error)
    res.status(500).json({ error: 'Failed to delete learning data' })
  }
})

export default router
