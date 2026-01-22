import express from 'express'
import { db } from '../lib/db.js'
import { patientsSurveillance, patients, grossesses } from '../lib/schema.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm'

const router = express.Router()

/**
 * GET /api/surveillance
 * Récupère tous les patients sous surveillance
 */
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { niveau, active = 'true' } = req.query

    const surveillances = await db
      .select({
        id: patientsSurveillance.id,
        patient: {
          id: patients.id,
          firstName: patients.firstName,
          lastName: patients.lastName,
          dateNaissance: patients.dateNaissance,
        },
        grossesse: {
          id: grossesses.id,
          ddr: grossesses.ddr,
          dpa: grossesses.dpa,
        },
        niveau: patientsSurveillance.niveau,
        raison: patientsSurveillance.raison,
        raisonDetail: patientsSurveillance.raisonDetail,
        dateDebut: patientsSurveillance.dateDebut,
        dateFin: patientsSurveillance.dateFin,
        dateProchainControle: patientsSurveillance.dateProchainControle,
        frequenceControle: patientsSurveillance.frequenceControle,
        notesSurveillance: patientsSurveillance.notesSurveillance,
        parametresSuivre: patientsSurveillance.parametresSuivre,
        isActive: patientsSurveillance.isActive,
        createdAt: patientsSurveillance.createdAt,
      })
      .from(patientsSurveillance)
      .leftJoin(patients, eq(patientsSurveillance.patientId, patients.id))
      .leftJoin(grossesses, eq(patientsSurveillance.grossesseId, grossesses.id))
      .where(
        and(
          eq(patientsSurveillance.userId, userId),
          active === 'true' ? eq(patientsSurveillance.isActive, true) : undefined,
          niveau ? eq(patientsSurveillance.niveau, niveau as any) : undefined
        )
      )
      .orderBy(desc(patientsSurveillance.dateProchainControle))

    res.json({ success: true, surveillances })
  } catch (error) {
    console.error('Error fetching surveillances:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des surveillances' })
  }
})

/**
 * GET /api/surveillance/dashboard
 * Stats pour le dashboard
 */
router.get('/dashboard', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const today = new Date()
    const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Patients à voir cette semaine
    const aSurveillerSemaine = await db
      .select({
        id: patientsSurveillance.id,
        patient: {
          id: patients.id,
          firstName: patients.firstName,
          lastName: patients.lastName,
        },
        niveau: patientsSurveillance.niveau,
        raison: patientsSurveillance.raison,
        dateProchainControle: patientsSurveillance.dateProchainControle,
      })
      .from(patientsSurveillance)
      .leftJoin(patients, eq(patientsSurveillance.patientId, patients.id))
      .where(
        and(
          eq(patientsSurveillance.userId, userId),
          eq(patientsSurveillance.isActive, true),
          lte(patientsSurveillance.dateProchainControle, in7Days)
        )
      )
      .orderBy(patientsSurveillance.dateProchainControle)

    // En retard
    const enRetard = aSurveillerSemaine.filter(
      s => new Date(s.dateProchainControle) < today
    )

    // Stats par niveau
    const stats = await db
      .select({
        niveau: patientsSurveillance.niveau,
        count: sql<number>`count(*)::int`,
      })
      .from(patientsSurveillance)
      .where(
        and(
          eq(patientsSurveillance.userId, userId),
          eq(patientsSurveillance.isActive, true)
        )
      )
      .groupBy(patientsSurveillance.niveau)

    res.json({
      success: true,
      dashboard: {
        aSurveillerSemaine,
        enRetard,
        stats: {
          total: stats.reduce((sum, s) => sum + s.count, 0),
          parNiveau: stats,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    res.status(500).json({ success: false, error: 'Erreur' })
  }
})

/**
 * GET /api/surveillance/patient/:patientId
 * Récupère la surveillance active pour un patient
 */
router.get('/patient/:patientId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { patientId } = req.params

    const surveillance = await db.query.patientsSurveillance.findFirst({
      where: and(
        eq(patientsSurveillance.patientId, patientId),
        eq(patientsSurveillance.userId, userId),
        eq(patientsSurveillance.isActive, true)
      ),
    })

    res.json({ success: true, surveillance: surveillance || null })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, error: 'Erreur' })
  }
})

/**
 * POST /api/surveillance
 * Ajoute un patient en surveillance
 */
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const {
      patientId,
      grossesseId,
      niveau,
      raison,
      raisonDetail,
      dateProchainControle,
      frequenceControle,
      notesSurveillance,
      parametresSuivre,
    } = req.body

    const [surveillance] = await db
      .insert(patientsSurveillance)
      .values({
        userId,
        patientId,
        grossesseId,
        niveau,
        raison,
        raisonDetail,
        dateProchainControle: new Date(dateProchainControle),
        frequenceControle,
        notesSurveillance,
        parametresSuivre,
        isActive: true,
      })
      .returning()

    res.json({
      success: true,
      message: 'Patient ajouté en surveillance',
      surveillance,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, error: 'Erreur' })
  }
})

/**
 * PATCH /api/surveillance/:id
 * Met à jour une surveillance
 */
router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const updateData = req.body

    const [updated] = await db
      .update(patientsSurveillance)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(patientsSurveillance.id, id),
          eq(patientsSurveillance.userId, userId)
        )
      )
      .returning()

    res.json({ success: true, surveillance: updated })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, error: 'Erreur' })
  }
})

/**
 * POST /api/surveillance/:id/terminer
 * Termine une surveillance
 */
router.post('/:id/terminer', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const [updated] = await db
      .update(patientsSurveillance)
      .set({
        isActive: false,
        dateFin: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(patientsSurveillance.id, id),
          eq(patientsSurveillance.userId, userId)
        )
      )
      .returning()

    res.json({
      success: true,
      message: 'Surveillance terminée',
      surveillance: updated,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, error: 'Erreur' })
  }
})

export default router
