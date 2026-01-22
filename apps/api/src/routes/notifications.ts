import express from 'express'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'

const router = express.Router()

/**
 * GET /api/notifications/active
 * Récupère les notifications actives pour l'utilisateur
 */
router.get('/active', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const notifications = []

    // TODO: Implémenter la logique de récupération des notifications depuis la DB
    // Pour l'instant, retourne un tableau vide
    // Les notifications seront générées côté client de manière contextuelle

    res.json({ success: true, notifications })
  } catch (error) {
    console.error('Notifications error:', error)
    res.status(500).json({ success: false, error: 'Erreur' })
  }
})

/**
 * POST /api/notifications/dismiss/:id
 * Marque une notification comme lue/ignorée
 */
router.post('/dismiss/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    // TODO: Marquer comme lue dans la DB
    res.json({ success: true })
  } catch (error) {
    console.error('Dismiss notification error:', error)
    res.status(500).json({ success: false, error: 'Erreur' })
  }
})

export default router
