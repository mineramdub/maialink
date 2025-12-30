import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { patients, auditLogs } from '../lib/schema.js'
import { eq, and, or, ilike, desc } from 'drizzle-orm'

const router = Router()
router.use(authMiddleware)

// GET /api/patients - List patients
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { search, status = 'active' } = req.query

    let whereClause = and(
      eq(patients.userId, req.user!.id),
      status !== 'all' ? eq(patients.status, status as 'active' | 'inactive' | 'archived') : undefined
    )

    if (search) {
      whereClause = and(
        whereClause,
        or(
          ilike(patients.firstName, `%${search}%`),
          ilike(patients.lastName, `%${search}%`),
          ilike(patients.email, `%${search}%`)
        )
      )
    }

    const result = await db.query.patients.findMany({
      where: whereClause,
      orderBy: [desc(patients.updatedAt)],
    })

    res.json({ success: true, patients: result })
  } catch (error) {
    console.error('Get patients error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/patients - Create patient
router.post('/', async (req: AuthRequest, res) => {
  try {
    const body = req.body

    const [newPatient] = await db.insert(patients).values({
      userId: req.user!.id,
      firstName: body.firstName,
      lastName: body.lastName,
      maidenName: body.maidenName,
      birthDate: body.birthDate,
      birthPlace: body.birthPlace,
      socialSecurityNumber: body.socialSecurityNumber,
      email: body.email,
      phone: body.phone,
      mobilePhone: body.mobilePhone,
      address: body.address,
      postalCode: body.postalCode,
      city: body.city,
      bloodType: body.bloodType,
      rhesus: body.rhesus,
      allergies: body.allergies,
      antecedentsMedicaux: body.antecedentsMedicaux,
      antecedentsChirurgicaux: body.antecedentsChirurgicaux,
      antecedentsFamiliaux: body.antecedentsFamiliaux,
      traitementEnCours: body.traitementEnCours,
      gravida: body.gravida || 0,
      para: body.para || 0,
      mutuelle: body.mutuelle,
      numeroMutuelle: body.numeroMutuelle,
      medecinTraitant: body.medecinTraitant,
      personneConfiance: body.personneConfiance,
      telephoneConfiance: body.telephoneConfiance,
      consentementRGPD: body.consentementRGPD || false,
      dateConsentement: body.consentementRGPD ? new Date() : null,
      notes: body.notes,
    }).returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'create',
      tableName: 'patients',
      recordId: newPatient.id,
      newData: newPatient,
    })

    res.json({ success: true, patient: newPatient })
  } catch (error) {
    console.error('Create patient error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/patients/:id - Get patient details
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const patient = await db.query.patients.findFirst({
      where: and(eq(patients.id, id), eq(patients.userId, req.user!.id)),
      with: {
        grossesses: {
          orderBy: (grossesses, { desc }) => [desc(grossesses.createdAt)],
        },
        consultations: {
          orderBy: (consultations, { desc }) => [desc(consultations.date)],
          limit: 10,
        },
        appointments: {
          orderBy: (appointments, { desc }) => [desc(appointments.startTime)],
          limit: 5,
        },
        documents: {
          orderBy: (documents, { desc }) => [desc(documents.createdAt)],
          limit: 10,
        },
        alertes: {
          where: (alertes, { eq }) => eq(alertes.isRead, false),
        },
      },
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patiente non trouvee' })
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'read',
      tableName: 'patients',
      recordId: id,
    })

    res.json({ success: true, patient })
  } catch (error) {
    console.error('Get patient error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PATCH /api/patients/:id - Update patient
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const body = req.body

    // Get old data for audit
    const oldPatient = await db.query.patients.findFirst({
      where: and(eq(patients.id, id), eq(patients.userId, req.user!.id)),
    })

    if (!oldPatient) {
      return res.status(404).json({ error: 'Patiente non trouvee' })
    }

    const [updatedPatient] = await db
      .update(patients)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(patients.id, id), eq(patients.userId, req.user!.id)))
      .returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'update',
      tableName: 'patients',
      recordId: id,
      oldData: oldPatient,
      newData: updatedPatient,
    })

    res.json({ success: true, patient: updatedPatient })
  } catch (error) {
    console.error('Update patient error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/patients/:id - Archive patient
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Soft delete - just archive
    const [archivedPatient] = await db
      .update(patients)
      .set({
        status: 'archived',
        updatedAt: new Date(),
      })
      .where(and(eq(patients.id, id), eq(patients.userId, req.user!.id)))
      .returning()

    if (!archivedPatient) {
      return res.status(404).json({ error: 'Patiente non trouvee' })
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'delete',
      tableName: 'patients',
      recordId: id,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Delete patient error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
