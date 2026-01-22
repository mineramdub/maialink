import { Router } from 'express'
import { db } from '../lib/db.js'
import { bebes, mensurationsBebe } from '../lib/schema.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'
import { eq, desc } from 'drizzle-orm'

const router = Router()

/**
 * GET /api/bebes/:id/last-measurements
 * Récupère les dernières mensurations d'un bébé
 */
router.get('/:id/last-measurements', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Vérifier que le bébé appartient à l'utilisateur
    const bebe = await db.query.bebes.findFirst({
      where: eq(bebes.id, id)
    })

    if (!bebe) {
      return res.status(404).json({ success: false, message: 'Bébé non trouvé' })
    }

    // Récupérer les dernières mensurations
    const lastMeasurement = await db.query.mensurationsBebe.findFirst({
      where: eq(mensurationsBebe.bebeId, id),
      orderBy: [desc(mensurationsBebe.date)],
    })

    if (!lastMeasurement) {
      return res.json({ success: true, measurements: null })
    }

    return res.json({
      success: true,
      measurements: {
        poids: lastMeasurement.poids,
        taille: lastMeasurement.taille,
        perimetreCranien: lastMeasurement.perimetreCranien,
        date: lastMeasurement.date,
      }
    })
  } catch (error) {
    console.error('Erreur récupération mensurations:', error)
    return res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

/**
 * GET /api/bebes/:id/measurements
 * Récupère tout l'historique des mensurations
 */
router.get('/:id/measurements', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const measurements = await db.query.mensurationsBebe.findMany({
      where: eq(mensurationsBebe.bebeId, id),
      orderBy: [desc(mensurationsBebe.date)],
    })

    return res.json({ success: true, measurements })
  } catch (error) {
    console.error('Erreur récupération historique mensurations:', error)
    return res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

/**
 * POST /api/bebes/:id/measurements
 * Enregistre de nouvelles mensurations
 */
router.post('/:id/measurements', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const {
      poids,
      taille,
      perimetreCranien,
      ageJours,
      percentilePoids,
      percentileTaille,
      percentilePC,
      alertes,
      statusGlobal,
      notes,
      consultationId
    } = req.body

    // Vérifier que le bébé existe
    const bebe = await db.query.bebes.findFirst({
      where: eq(bebes.id, id)
    })

    if (!bebe) {
      return res.status(404).json({ success: false, message: 'Bébé non trouvé' })
    }

    // Insérer les nouvelles mensurations
    const [newMeasurement] = await db.insert(mensurationsBebe).values({
      bebeId: id,
      consultationId: consultationId || null,
      poids,
      taille,
      perimetreCranien,
      ageJours,
      percentilePoids,
      percentileTaille,
      percentilePC,
      alertes,
      statusGlobal,
      notes,
    }).returning()

    return res.json({ success: true, measurement: newMeasurement })
  } catch (error) {
    console.error('Erreur enregistrement mensurations:', error)
    return res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

/**
 * GET /api/bebes/grossesse/:grossesseId
 * Récupère tous les bébés d'une grossesse
 */
router.get('/grossesse/:grossesseId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { grossesseId } = req.params

    const bebesList = await db.query.bebes.findMany({
      where: eq(bebes.grossesseId, grossesseId),
    })

    return res.json({ success: true, bebes: bebesList })
  } catch (error) {
    console.error('Erreur récupération bébés:', error)
    return res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

export default router
