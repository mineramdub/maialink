import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { grossesses, patients, auditLogs, alertes } from '../lib/schema.js'
import { eq, and, desc } from 'drizzle-orm'
import { calculateDPA } from '../lib/utils.js'
import { CALENDRIER_GROSSESSE, getCalendarEventsForSA, getConsultationRecommendations } from '../lib/pregnancy-calendar.js'

const router = Router()
router.use(authMiddleware)

// GET /api/grossesses - List grossesses
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { status, patientId } = req.query

    let whereClause = eq(grossesses.userId, req.user!.id)

    if (status) {
      whereClause = and(whereClause, eq(grossesses.status, status as 'en_cours' | 'terminee' | 'fausse_couche' | 'ivg' | 'img'))!
    }

    if (patientId) {
      whereClause = and(whereClause, eq(grossesses.patientId, patientId as string))!
    }

    const result = await db.query.grossesses.findMany({
      where: whereClause,
      with: {
        patient: true,
        bebes: true,
        examens: true,
      },
      orderBy: [desc(grossesses.createdAt)],
    })

    res.json({ success: true, grossesses: result })
  } catch (error) {
    console.error('Get grossesses error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/grossesses - Create grossesse
router.post('/', async (req: AuthRequest, res) => {
  try {
    const body = req.body

    // Verify patient belongs to user
    const patient = await db.query.patients.findFirst({
      where: and(eq(patients.id, body.patientId), eq(patients.userId, req.user!.id)),
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patiente non trouvee' })
    }

    // Calculate DPA from DDR
    const ddr = new Date(body.ddr)

    // Validate DDR date
    if (isNaN(ddr.getTime())) {
      return res.status(400).json({ error: 'Date DDR invalide' })
    }

    // Validate dateConception if provided
    if (body.dateConception) {
      const dateConception = new Date(body.dateConception)
      if (isNaN(dateConception.getTime())) {
        return res.status(400).json({ error: 'Date de conception invalide' })
      }
    }

    const dpa = calculateDPA(ddr)

    const [newGrossesse] = await db.insert(grossesses).values({
      patientId: body.patientId,
      userId: req.user!.id,
      ddr: body.ddr,
      dpa: dpa.toISOString().split('T')[0],
      dateConception: body.dateConception || null,
      grossesseMultiple: body.grossesseMultiple || false,
      nombreFoetus: body.nombreFoetus || 1,
      gestite: (patient.gravida || 0) + 1,
      parite: patient.para || 0,
      facteursRisque: body.facteursRisque || [],
      notes: body.notes || null,
    }).returning()

    // Update patient gravida
    await db.update(patients).set({
      gravida: (patient.gravida || 0) + 1,
      updatedAt: new Date(),
    }).where(eq(patients.id, patient.id))

    // Create initial alerts for required exams
    const initialAlerts = [
      { type: 'examen', message: 'Echo T1 a programmer (11-14 SA)', severity: 'info' as const },
      { type: 'examen', message: 'Bilan sanguin du 1er trimestre a realiser', severity: 'info' as const },
    ]

    for (const alert of initialAlerts) {
      await db.insert(alertes).values({
        patientId: body.patientId,
        grossesseId: newGrossesse.id,
        userId: req.user!.id,
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
      })
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'create',
      tableName: 'grossesses',
      recordId: newGrossesse.id,
      newData: newGrossesse,
    })

    res.json({ success: true, grossesse: newGrossesse })
  } catch (error) {
    console.error('Create grossesse error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/grossesses/:id - Get grossesse details
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const grossesse = await db.query.grossesses.findFirst({
      where: and(eq(grossesses.id, id), eq(grossesses.userId, req.user!.id)),
      with: {
        patient: true,
        bebes: true,
        examens: {
          orderBy: (examens, { asc }) => [asc(examens.saPrevue)],
        },
        consultations: {
          orderBy: (consultations, { desc }) => [desc(consultations.date)],
        },
        suiviPostPartum: {
          orderBy: (suivi, { desc }) => [desc(suivi.date)],
        },
      },
    })

    if (!grossesse) {
      return res.status(404).json({ error: 'Grossesse non trouvee' })
    }

    res.json({ success: true, grossesse })
  } catch (error) {
    console.error('Get grossesse error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PATCH /api/grossesses/:id - Update grossesse
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const body = req.body

    const oldGrossesse = await db.query.grossesses.findFirst({
      where: and(eq(grossesses.id, id), eq(grossesses.userId, req.user!.id)),
    })

    if (!oldGrossesse) {
      return res.status(404).json({ error: 'Grossesse non trouvee' })
    }

    // Validate dates if provided
    if (body.ddr) {
      const ddr = new Date(body.ddr)
      if (isNaN(ddr.getTime())) {
        return res.status(400).json({ error: 'Date DDR invalide' })
      }
    }

    if (body.dateConception) {
      const dateConception = new Date(body.dateConception)
      if (isNaN(dateConception.getTime())) {
        return res.status(400).json({ error: 'Date de conception invalide' })
      }
    }

    const [updatedGrossesse] = await db
      .update(grossesses)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(grossesses.id, id), eq(grossesses.userId, req.user!.id)))
      .returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'update',
      tableName: 'grossesses',
      recordId: id,
      oldData: oldGrossesse,
      newData: updatedGrossesse,
    })

    res.json({ success: true, grossesse: updatedGrossesse })
  } catch (error) {
    console.error('Update grossesse error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/grossesses/:id/calendrier - Get pregnancy calendar
router.get('/:id/calendrier', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const grossesse = await db.query.grossesses.findFirst({
      where: and(
        eq(grossesses.id, id),
        eq(grossesses.userId, req.user!.id)
      ),
      with: {
        patient: true
      }
    })

    if (!grossesse) {
      return res.status(404).json({ error: 'Grossesse non trouvée' })
    }

    // Calculate current SA
    const ddr = new Date(grossesse.ddr)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - ddr.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const currentSA = diffDays / 7

    // Get calendar events
    const events = getCalendarEventsForSA(currentSA)

    // Get consultation recommendations
    const recommendations = getConsultationRecommendations(currentSA)

    res.json({
      success: true,
      currentSA,
      calendrier: CALENDRIER_GROSSESSE,
      events,
      recommendations
    })
  } catch (error) {
    console.error('Get calendar error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/grossesses/:id/recommendations - Get consultation recommendations for current term
router.get('/:id/recommendations', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const grossesse = await db.query.grossesses.findFirst({
      where: and(
        eq(grossesses.id, id),
        eq(grossesses.userId, req.user!.id)
      )
    })

    if (!grossesse) {
      return res.status(404).json({ error: 'Grossesse non trouvée' })
    }

    // Calculate current SA
    const ddr = new Date(grossesse.ddr)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - ddr.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const currentSA = diffDays / 7

    const recommendations = getConsultationRecommendations(currentSA)

    res.json({
      success: true,
      currentSA,
      recommendations
    })
  } catch (error) {
    console.error('Get recommendations error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
