import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { consultations, patients, alertes, auditLogs, grossesses } from '../lib/schema.js'
import { eq, and, desc } from 'drizzle-orm'
import { calculateSA } from '../lib/utils.js'
import { checkClinicalAlerts } from '../lib/pregnancy-utils.js'

const router = Router()
router.use(authMiddleware)

// GET /api/consultations - List consultations
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { patientId, grossesseId, type } = req.query

    let whereClause = eq(consultations.userId, req.user!.id)

    if (patientId) {
      whereClause = and(whereClause, eq(consultations.patientId, patientId as string))!
    }
    if (grossesseId) {
      whereClause = and(whereClause, eq(consultations.grossesseId, grossesseId as string))!
    }
    if (type) {
      whereClause = and(whereClause, eq(consultations.type, type as 'prenatale' | 'postnatale' | 'gyneco' | 'reeducation' | 'preparation' | 'monitoring' | 'autre'))!
    }

    const result = await db.query.consultations.findMany({
      where: whereClause,
      with: {
        patient: true,
        grossesse: true,
      },
      orderBy: [desc(consultations.date)],
    })

    res.json({ success: true, consultations: result })
  } catch (error) {
    console.error('Get consultations error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/consultations - Create consultation
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

    // Calculate SA if grossesse
    let saTerm: number | undefined
    let saJours: number | undefined
    if (body.grossesseId) {
      const grossesse = await db.query.grossesses.findFirst({
        where: eq(grossesses.id, body.grossesseId),
      })
      if (grossesse) {
        const sa = calculateSA(grossesse.ddr)
        saTerm = sa.weeks
        saJours = sa.days
      }
    }

    // Check clinical alerts
    const clinicalAlerts = checkClinicalAlerts({
      tensionSystolique: body.tensionSystolique,
      tensionDiastolique: body.tensionDiastolique,
      proteineUrinaire: body.proteineUrinaire,
      poids: body.poids,
      sa: saTerm,
      hauteurUterine: body.hauteurUterine,
      bdc: body.bdc,
    })

    const [newConsultation] = await db.insert(consultations).values({
      patientId: body.patientId,
      userId: req.user!.id,
      grossesseId: body.grossesseId,
      type: body.type,
      date: new Date(body.date),
      duree: body.duree,
      poids: body.poids,
      taille: body.taille,
      tensionSystolique: body.tensionSystolique,
      tensionDiastolique: body.tensionDiastolique,
      pouls: body.pouls,
      temperature: body.temperature,
      saTerm,
      saJours,
      hauteurUterine: body.hauteurUterine,
      bdc: body.bdc,
      mouvementsFoetaux: body.mouvementsFoetaux,
      presentationFoetale: body.presentationFoetale,
      motif: body.motif,
      examenClinique: body.examenClinique,
      conclusion: body.conclusion,
      prescriptions: body.prescriptions,
      proteineUrinaire: body.proteineUrinaire,
      glucoseUrinaire: body.glucoseUrinaire,
      leucocytesUrinaires: body.leucocytesUrinaires,
      nitritesUrinaires: body.nitritesUrinaires,
      alertes: clinicalAlerts.length > 0 ? clinicalAlerts : undefined,
    }).returning()

    // Create alerts in database
    for (const alert of clinicalAlerts) {
      await db.insert(alertes).values({
        patientId: body.patientId,
        grossesseId: body.grossesseId,
        consultationId: newConsultation.id,
        userId: req.user!.id,
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
      })
    }

    // Update patient last consultation
    await db.update(patients).set({
      updatedAt: new Date(),
    }).where(eq(patients.id, body.patientId))

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'create',
      tableName: 'consultations',
      recordId: newConsultation.id,
      newData: newConsultation,
    })

    res.json({
      success: true,
      consultation: newConsultation,
      alerts: clinicalAlerts,
    })
  } catch (error) {
    console.error('Create consultation error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/consultations/:id - Get consultation details
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const consultation = await db.query.consultations.findFirst({
      where: and(eq(consultations.id, id), eq(consultations.userId, req.user!.id)),
      with: {
        patient: true,
        grossesse: true,
      },
    })

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation non trouvee' })
    }

    res.json({ success: true, consultation })
  } catch (error) {
    console.error('Get consultation error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
