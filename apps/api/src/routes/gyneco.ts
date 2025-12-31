import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { suiviGyneco, patients } from '../lib/schema.js'
import { eq, and, desc } from 'drizzle-orm'

const router = Router()
router.use(authMiddleware)

// GET /api/gyneco - List gyneco consultations
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { patientId } = req.query

    let whereClause = eq(suiviGyneco.userId, req.user!.id)

    if (patientId) {
      whereClause = and(whereClause, eq(suiviGyneco.patientId, patientId as string))!
    }

    const result = await db.query.suiviGyneco.findMany({
      where: whereClause,
      with: {
        patient: true,
      },
      orderBy: [desc(suiviGyneco.date)],
    })

    res.json({ success: true, consultations: result })
  } catch (error) {
    console.error('Get gyneco consultations error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/gyneco/:id - Get single gyneco consultation
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const consultation = await db.query.suiviGyneco.findFirst({
      where: and(
        eq(suiviGyneco.id, req.params.id),
        eq(suiviGyneco.userId, req.user!.id)
      ),
      with: {
        patient: true,
      },
    })

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation non trouvee' })
    }

    res.json({ success: true, consultation })
  } catch (error) {
    console.error('Get gyneco consultation error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/gyneco - Create gyneco consultation
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

    const [newConsultation] = await db.insert(suiviGyneco).values({
      patientId: body.patientId,
      userId: req.user!.id,
      date: new Date(body.date),
      motif: body.motif,

      // Cycle
      dateDernieresRegles: body.dateDernieresRegles ? new Date(body.dateDernieresRegles) : null,
      dureeRegles: body.dureeRegles,
      dureeCycle: body.dureeCycle,
      regularite: body.regularite,

      // Contraception
      contraceptionActuelle: body.contraceptionActuelle,
      dateDebutContraception: body.dateDebutContraception ? new Date(body.dateDebutContraception) : null,

      // Dépistage
      dateDernierFrottis: body.dateDernierFrottis ? new Date(body.dateDernierFrottis) : null,
      resultatFrottis: body.resultatFrottis,
      hpv: body.hpv,

      // Examen
      examenSeins: body.examenSeins,
      examenGynecologique: body.examenGynecologique,

      prescriptions: body.prescriptions,
      observations: body.observations,
    }).returning()

    res.json({ success: true, consultation: newConsultation })
  } catch (error) {
    console.error('Create gyneco consultation error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/gyneco/:id - Update gyneco consultation
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const body = req.body

    // Verify consultation belongs to user
    const existing = await db.query.suiviGyneco.findFirst({
      where: and(
        eq(suiviGyneco.id, req.params.id),
        eq(suiviGyneco.userId, req.user!.id)
      ),
    })

    if (!existing) {
      return res.status(404).json({ error: 'Consultation non trouvee' })
    }

    const [updated] = await db.update(suiviGyneco)
      .set({
        date: body.date ? new Date(body.date) : existing.date,
        motif: body.motif !== undefined ? body.motif : existing.motif,

        // Cycle
        dateDernieresRegles: body.dateDernieresRegles ? new Date(body.dateDernieresRegles) : existing.dateDernieresRegles,
        dureeRegles: body.dureeRegles !== undefined ? body.dureeRegles : existing.dureeRegles,
        dureeCycle: body.dureeCycle !== undefined ? body.dureeCycle : existing.dureeCycle,
        regularite: body.regularite !== undefined ? body.regularite : existing.regularite,

        // Contraception
        contraceptionActuelle: body.contraceptionActuelle !== undefined ? body.contraceptionActuelle : existing.contraceptionActuelle,
        dateDebutContraception: body.dateDebutContraception ? new Date(body.dateDebutContraception) : existing.dateDebutContraception,

        // Dépistage
        dateDernierFrottis: body.dateDernierFrottis ? new Date(body.dateDernierFrottis) : existing.dateDernierFrottis,
        resultatFrottis: body.resultatFrottis !== undefined ? body.resultatFrottis : existing.resultatFrottis,
        hpv: body.hpv !== undefined ? body.hpv : existing.hpv,

        // Examen
        examenSeins: body.examenSeins !== undefined ? body.examenSeins : existing.examenSeins,
        examenGynecologique: body.examenGynecologique !== undefined ? body.examenGynecologique : existing.examenGynecologique,

        prescriptions: body.prescriptions !== undefined ? body.prescriptions : existing.prescriptions,
        observations: body.observations !== undefined ? body.observations : existing.observations,

        updatedAt: new Date(),
      })
      .where(eq(suiviGyneco.id, req.params.id))
      .returning()

    res.json({ success: true, consultation: updated })
  } catch (error) {
    console.error('Update gyneco consultation error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/gyneco/:id - Delete gyneco consultation
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    // Verify consultation belongs to user
    const existing = await db.query.suiviGyneco.findFirst({
      where: and(
        eq(suiviGyneco.id, req.params.id),
        eq(suiviGyneco.userId, req.user!.id)
      ),
    })

    if (!existing) {
      return res.status(404).json({ error: 'Consultation non trouvee' })
    }

    await db.delete(suiviGyneco).where(eq(suiviGyneco.id, req.params.id))

    res.json({ success: true })
  } catch (error) {
    console.error('Delete gyneco consultation error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
