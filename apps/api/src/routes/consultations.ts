import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { consultations, patients, alertes, auditLogs, grossesses } from '../lib/schema.js'
import { eq, and, desc } from 'drizzle-orm'
import { calculateSA } from '../lib/utils.js'
import { checkClinicalAlerts } from '../lib/pregnancy-utils.js'
import { getTemplateForSA, generateConsultationFromTemplate, generateReminders } from '../lib/consultationTemplates.js'
import { getGynecologyRecommendations, getGynecologyRecommendationsAsync } from '../lib/pregnancy-calendar.js'
import { getOrdonnanceSuggestions } from '../lib/ordonnanceTemplates.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

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
      grossesseId: body.grossesseId || null,
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
      resumeCourt: body.resumeCourt || null,
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
        grossesseId: body.grossesseId || null,
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

// GET /api/consultations/gynecology-recommendations - Get ordonnance recommendations for gynecology consultation
router.get('/gynecology-recommendations', async (req: AuthRequest, res) => {
  try {
    const { motif, sousTypeGyneco } = req.query

    if (!motif || typeof motif !== 'string') {
      return res.status(400).json({
        error: 'Motif de consultation requis'
      })
    }

    const sousType = typeof sousTypeGyneco === 'string' ? sousTypeGyneco : undefined

    // Utiliser la version async qui charge depuis la BDD avec fallback sur version synchrone
    const recommendations = await getGynecologyRecommendationsAsync(motif, sousType, req.user!.id)

    res.json({
      success: true,
      recommendations
    })
  } catch (error) {
    console.error('Get gynecology recommendations error:', error)
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

// GET /api/consultations/template/:grossesseId - Get consultation template for pregnancy
router.get('/template/:grossesseId', async (req: AuthRequest, res) => {
  try {
    // Get grossesse
    const grossesse = await db.query.grossesses.findFirst({
      where: eq(grossesses.id, req.params.grossesseId),
      with: {
        patient: true,
      },
    })

    if (!grossesse) {
      return res.status(404).json({ error: 'Grossesse non trouvée' })
    }

    // Verify access
    if (grossesse.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Accès non autorisé' })
    }

    // Calculate SA
    const sa = calculateSA(grossesse.ddr)
    const saTotal = sa.weeks + sa.days / 7

    // Get template
    const template = getTemplateForSA(saTotal)
    if (!template) {
      return res.json({
        success: true,
        template: null,
        message: 'Aucun template disponible pour ce terme'
      })
    }

    // Generate pre-filled consultation
    const consultationData = generateConsultationFromTemplate(saTotal)

    // Generate reminders
    const reminders = generateReminders(saTotal)

    res.json({
      success: true,
      template: {
        name: template.name,
        sa: { weeks: sa.weeks, days: sa.days },
        examensRecommandes: template.examensRecommandes,
        pointsVigilance: template.pointsVigilance,
        questionsPoser: template.questionsPoser,
        prescriptionsSuggestions: template.prescriptionsSuggestions,
      },
      consultationData,
      reminders,
    })
  } catch (error) {
    console.error('Get template error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/consultations/:id - Update consultation
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const body = req.body

    // Check if consultation belongs to user
    const existingConsultation = await db.query.consultations.findFirst({
      where: and(
        eq(consultations.id, id),
        eq(consultations.userId, req.user!.id)
      ),
    })

    if (!existingConsultation) {
      return res.status(404).json({ error: 'Consultation non trouvée' })
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

    // Update consultation
    const [updatedConsultation] = await db.update(consultations)
      .set({
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
        resumeCourt: body.resumeCourt || null,
        proteineUrinaire: body.proteineUrinaire,
        glucoseUrinaire: body.glucoseUrinaire,
        leucocytesUrinaires: body.leucocytesUrinaires,
        nitritesUrinaires: body.nitritesUrinaires,
        alertes: clinicalAlerts.length > 0 ? clinicalAlerts : undefined,
      })
      .where(eq(consultations.id, id))
      .returning()

    // Delete old alerts and create new ones
    await db.delete(alertes).where(eq(alertes.consultationId, id))

    for (const alert of clinicalAlerts) {
      await db.insert(alertes).values({
        patientId: existingConsultation.patientId,
        grossesseId: body.grossesseId || null,
        consultationId: id,
        userId: req.user!.id,
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
      })
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'update',
      tableName: 'consultations',
      recordId: id,
      newData: updatedConsultation,
      oldData: existingConsultation,
    })

    res.json({
      success: true,
      consultation: updatedConsultation,
      alerts: clinicalAlerts,
    })
  } catch (error) {
    console.error('Update consultation error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/consultations/:id - Delete consultation
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Check if consultation belongs to user
    const consultation = await db.query.consultations.findFirst({
      where: and(
        eq(consultations.id, id),
        eq(consultations.userId, req.user!.id)
      ),
    })

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation non trouvée' })
    }

    // Delete consultation (cascade will handle related records)
    await db
      .delete(consultations)
      .where(eq(consultations.id, id))

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'delete',
      tableName: 'consultations',
      recordId: id,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Delete consultation error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/consultations/patient/:patientId/last - Get last consultation for a patient
router.get('/patient/:patientId/last', async (req: AuthRequest, res) => {
  try {
    const { patientId } = req.params
    const { type, excludeId } = req.query

    // Verify patient belongs to user
    const patient = await db.query.patients.findFirst({
      where: and(eq(patients.id, patientId), eq(patients.userId, req.user!.id)),
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patiente non trouvée' })
    }

    // Build where clause
    let whereClause = and(
      eq(consultations.patientId, patientId),
      eq(consultations.userId, req.user!.id)
    )!

    // Filter by type if provided
    if (type) {
      whereClause = and(whereClause, eq(consultations.type, type as any))!
    }

    // Exclude current consultation if editing
    if (excludeId) {
      whereClause = and(whereClause, eq(consultations.id, excludeId as string))!
    }

    // Get last consultation
    const lastConsultation = await db.query.consultations.findFirst({
      where: whereClause,
      orderBy: [desc(consultations.date)],
      with: {
        grossesse: true,
      }
    })

    if (!lastConsultation) {
      return res.json({ success: true, lastConsultation: null })
    }

    res.json({
      success: true,
      lastConsultation
    })
  } catch (error) {
    console.error('Get last consultation error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/consultations/:id/ordonnance-suggestions - Get ordonnance suggestions for a consultation
router.get('/:id/ordonnance-suggestions', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Get consultation
    const consultation = await db.query.consultations.findFirst({
      where: and(
        eq(consultations.id, id),
        eq(consultations.userId, req.user!.id)
      ),
    })

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation non trouvée' })
    }

    // Get ordonnance suggestions based on motif and type
    const suggestions = getOrdonnanceSuggestions(
      consultation.motif || '',
      consultation.type
    )

    res.json({
      success: true,
      suggestions
    })
  } catch (error) {
    console.error('Get ordonnance suggestions error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/consultations/:id/generate-summary - Generate AI summary for consultation
router.post('/:id/generate-summary', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Get consultation
    const consultation = await db.query.consultations.findFirst({
      where: and(
        eq(consultations.id, id),
        eq(consultations.userId, req.user!.id)
      ),
      with: {
        patient: true,
        grossesse: true,
      }
    })

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation non trouvée' })
    }

    // Build context for AI
    const context = {
      type: consultation.type,
      motif: consultation.motif || '',
      examenClinique: consultation.examenClinique || '',
      conclusion: consultation.conclusion || '',
      saTerm: consultation.saTerm,
      saJours: consultation.saJours,
      tensionSystolique: consultation.tensionSystolique,
      tensionDiastolique: consultation.tensionDiastolique,
      poids: consultation.poids,
      hauteurUterine: consultation.hauteurUterine,
      bdc: consultation.bdc,
    }

    // Generate summary using Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Tu es une sage-femme expérimentée. Génère un résumé TRÈS COURT (maximum 50 caractères) de cette consultation pour affichage dans une liste.

Type de consultation: ${context.type}
Motif: ${context.motif}
Examen clinique: ${context.examenClinique ? context.examenClinique.substring(0, 200) : ''}
Conclusion: ${context.conclusion ? context.conclusion.substring(0, 200) : ''}
${context.saTerm ? `SA: ${context.saTerm}+${context.saJours}` : ''}
${context.tensionSystolique ? `TA: ${context.tensionSystolique}/${context.tensionDiastolique}` : ''}
${context.poids ? `Poids: ${context.poids}kg` : ''}

Le résumé doit être:
- TRÈS COURT: maximum 50 caractères
- Informatif: mentionner l'essentiel (ex: "Cslt T2 - TA normale, RAS" ou "Cslt prénatal 32SA - Tout va bien")
- Professionnel mais concis
- Sans ponctuation finale

Exemples de bons résumés:
- "Cslt prénatal 28SA - RAS"
- "Suivi post-natal J7 - Allaitement OK"
- "Gynéco contraception - Pose DIU"
- "Prénatal 34SA - TA élevée surveillance"

Réponds UNIQUEMENT avec le résumé, sans guillemets ni explications.`

    const result = await model.generateContent(prompt)
    const summary = result.response.text().trim()

    // Truncate to 100 chars max as safety
    const finalSummary = summary.substring(0, 100)

    res.json({
      success: true,
      resume: finalSummary
    })
  } catch (error) {
    console.error('Generate summary error:', error)
    res.status(500).json({ error: 'Erreur lors de la génération du résumé' })
  }
})

export default router
