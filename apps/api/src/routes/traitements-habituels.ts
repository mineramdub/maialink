import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { traitementsHabituels, auditLogs, patients } from '../lib/schema.js'
import { eq, and, desc, or } from 'drizzle-orm'

const router = Router()
router.use(authMiddleware)

// GET /api/traitements-habituels - List all traitements for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { patientId, isActive, isChronique, categorie } = req.query

    let whereClause = eq(traitementsHabituels.userId, req.user!.id)

    if (patientId) {
      whereClause = and(whereClause, eq(traitementsHabituels.patientId, patientId as string))!
    }

    if (isActive !== undefined) {
      whereClause = and(whereClause, eq(traitementsHabituels.isActive, isActive === 'true'))!
    }

    if (isChronique !== undefined) {
      whereClause = and(whereClause, eq(traitementsHabituels.isChronique, isChronique === 'true'))!
    }

    if (categorie) {
      whereClause = and(whereClause, eq(traitementsHabituels.categorie, categorie as string))!
    }

    const traitements = await db.query.traitementsHabituels.findMany({
      where: whereClause,
      orderBy: [desc(traitementsHabituels.createdAt)],
      with: {
        patient: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    })

    res.json({ success: true, traitements })
  } catch (error) {
    console.error('Get traitements error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/traitements-habituels/:id - Get single traitement
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const traitement = await db.query.traitementsHabituels.findFirst({
      where: and(
        eq(traitementsHabituels.id, id),
        eq(traitementsHabituels.userId, req.user!.id)
      ),
      with: {
        patient: true
      }
    })

    if (!traitement) {
      return res.status(404).json({ error: 'Traitement non trouvé' })
    }

    res.json({ success: true, traitement })
  } catch (error) {
    console.error('Get traitement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/traitements-habituels - Create new traitement
router.post('/', async (req: AuthRequest, res) => {
  try {
    const body = req.body

    // Validation
    if (!body.patientId || !body.nom || !body.posologie) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants: patientId, nom, posologie'
      })
    }

    // Verify patient belongs to user
    const patient = await db.query.patients.findFirst({
      where: and(
        eq(patients.id, body.patientId),
        eq(patients.userId, req.user!.id)
      )
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' })
    }

    const [newTraitement] = await db.insert(traitementsHabituels).values({
      userId: req.user!.id,
      patientId: body.patientId,
      nom: body.nom,
      dci: body.dci,
      dosage: body.dosage,
      forme: body.forme,
      posologie: body.posologie,
      voieAdministration: body.voieAdministration,
      dateDebut: body.dateDebut ? new Date(body.dateDebut) : null,
      dateFin: body.dateFin ? new Date(body.dateFin) : null,
      renouvellementAuto: body.renouvellementAuto || false,
      categorie: body.categorie,
      indication: body.indication,
      isActive: body.isActive !== undefined ? body.isActive : true,
      isChronique: body.isChronique || false,
      notes: body.notes,
      prescripteur: body.prescripteur,
    }).returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'create',
      tableName: 'traitements_habituels',
      recordId: newTraitement.id,
      newData: newTraitement,
    })

    res.json({ success: true, traitement: newTraitement })
  } catch (error) {
    console.error('Create traitement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/traitements-habituels/:id - Update traitement
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const body = req.body

    // Check if traitement exists and belongs to user
    const existingTraitement = await db.query.traitementsHabituels.findFirst({
      where: and(
        eq(traitementsHabituels.id, id),
        eq(traitementsHabituels.userId, req.user!.id)
      ),
    })

    if (!existingTraitement) {
      return res.status(404).json({ error: 'Traitement non trouvé' })
    }

    // Update
    const [updatedTraitement] = await db.update(traitementsHabituels)
      .set({
        nom: body.nom,
        dci: body.dci,
        dosage: body.dosage,
        forme: body.forme,
        posologie: body.posologie,
        voieAdministration: body.voieAdministration,
        dateDebut: body.dateDebut ? new Date(body.dateDebut) : null,
        dateFin: body.dateFin ? new Date(body.dateFin) : null,
        renouvellementAuto: body.renouvellementAuto,
        categorie: body.categorie,
        indication: body.indication,
        isActive: body.isActive,
        isChronique: body.isChronique,
        notes: body.notes,
        prescripteur: body.prescripteur,
        updatedAt: new Date(),
      })
      .where(eq(traitementsHabituels.id, id))
      .returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'update',
      tableName: 'traitements_habituels',
      recordId: id,
      oldData: existingTraitement,
      newData: updatedTraitement,
    })

    res.json({ success: true, traitement: updatedTraitement })
  } catch (error) {
    console.error('Update traitement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/traitements-habituels/:id - Delete traitement
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const traitement = await db.query.traitementsHabituels.findFirst({
      where: and(
        eq(traitementsHabituels.id, id),
        eq(traitementsHabituels.userId, req.user!.id)
      ),
    })

    if (!traitement) {
      return res.status(404).json({ error: 'Traitement non trouvé' })
    }

    await db.delete(traitementsHabituels).where(eq(traitementsHabituels.id, id))

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'delete',
      tableName: 'traitements_habituels',
      recordId: id,
      oldData: traitement,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Delete traitement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/traitements-habituels/:id/toggle-active - Toggle active status
router.post('/:id/toggle-active', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const traitement = await db.query.traitementsHabituels.findFirst({
      where: and(
        eq(traitementsHabituels.id, id),
        eq(traitementsHabituels.userId, req.user!.id)
      ),
    })

    if (!traitement) {
      return res.status(404).json({ error: 'Traitement non trouvé' })
    }

    const [updatedTraitement] = await db.update(traitementsHabituels)
      .set({
        isActive: !traitement.isActive,
        dateFin: !traitement.isActive ? null : new Date(), // Si on réactive, on enlève la date de fin
        updatedAt: new Date(),
      })
      .where(eq(traitementsHabituels.id, id))
      .returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'update',
      tableName: 'traitements_habituels',
      recordId: id,
      oldData: traitement,
      newData: updatedTraitement,
    })

    res.json({ success: true, traitement: updatedTraitement })
  } catch (error) {
    console.error('Toggle active error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/traitements-habituels/patient/:patientId/active - Get active traitements for a patient
router.get('/patient/:patientId/active', async (req: AuthRequest, res) => {
  try {
    const { patientId } = req.params

    // Verify patient belongs to user
    const patient = await db.query.patients.findFirst({
      where: and(
        eq(patients.id, patientId),
        eq(patients.userId, req.user!.id)
      )
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' })
    }

    const traitements = await db.query.traitementsHabituels.findMany({
      where: and(
        eq(traitementsHabituels.patientId, patientId),
        eq(traitementsHabituels.userId, req.user!.id),
        eq(traitementsHabituels.isActive, true)
      ),
      orderBy: [desc(traitementsHabituels.isChronique), desc(traitementsHabituels.createdAt)],
    })

    res.json({ success: true, traitements })
  } catch (error) {
    console.error('Get active traitements error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
