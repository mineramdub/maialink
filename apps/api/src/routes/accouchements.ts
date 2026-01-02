import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { accouchements, patients, grossesses } from '../lib/schema.js'
import { eq, and, desc } from 'drizzle-orm'

const router = Router()
router.use(authMiddleware)

// GET /api/accouchements - List accouchements
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { patientId, grossesseId } = req.query

    let whereClause = eq(accouchements.userId, req.user!.id)

    if (patientId) {
      whereClause = and(whereClause, eq(accouchements.patientId, patientId as string))!
    }
    if (grossesseId) {
      whereClause = and(whereClause, eq(accouchements.grossesseId, grossesseId as string))!
    }

    const result = await db.query.accouchements.findMany({
      where: whereClause,
      with: {
        patient: true,
        grossesse: true,
      },
      orderBy: [desc(accouchements.dateAccouchement)],
    })

    res.json({ success: true, accouchements: result })
  } catch (error) {
    console.error('Get accouchements error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/accouchements/:id - Get single accouchement
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const accouchement = await db.query.accouchements.findFirst({
      where: and(
        eq(accouchements.id, id),
        eq(accouchements.userId, req.user!.id)
      ),
      with: {
        patient: true,
        grossesse: true,
      },
    })

    if (!accouchement) {
      return res.status(404).json({ error: 'Accouchement non trouvé' })
    }

    res.json({ success: true, accouchement })
  } catch (error) {
    console.error('Get accouchement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/accouchements - Create accouchement
router.post('/', async (req: AuthRequest, res) => {
  try {
    const body = req.body

    // Verify patient belongs to user
    const patient = await db.query.patients.findFirst({
      where: and(eq(patients.id, body.patientId), eq(patients.userId, req.user!.id)),
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patiente non trouvée' })
    }

    // Verify grossesse belongs to user
    const grossesse = await db.query.grossesses.findFirst({
      where: and(
        eq(grossesses.id, body.grossesseId),
        eq(grossesses.userId, req.user!.id)
      ),
    })

    if (!grossesse) {
      return res.status(404).json({ error: 'Grossesse non trouvée' })
    }

    const [newAccouchement] = await db.insert(accouchements).values({
      patientId: body.patientId,
      grossesseId: body.grossesseId,
      userId: req.user!.id,
      dateAccouchement: new Date(body.dateAccouchement),
      lieuAccouchement: body.lieuAccouchement,
      termeSemaines: body.termeSemaines,
      termeJours: body.termeJours,
      dateDebutTravail: body.dateDebutTravail ? new Date(body.dateDebutTravail) : null,
      dureeTravailHeures: body.dureeTravailHeures,
      dureeTravailMinutes: body.dureeTravailMinutes,
      ruptureMembranes: body.ruptureMembranes,
      dateRuptureMembranes: body.dateRuptureMembranes ? new Date(body.dateRuptureMembranes) : null,
      aspectLiquideAmniotique: body.aspectLiquideAmniotique,
      apd: body.apd || false,
      dateApd: body.dateApd ? new Date(body.dateApd) : null,
      autreAnalgesie: body.autreAnalgesie,
      modeAccouchement: body.modeAccouchement,
      typeInstrumental: body.typeInstrumental,
      indicationInstrumental: body.indicationInstrumental,
      indicationCesarienne: body.indicationCesarienne,
      presentation: body.presentation,
      variete: body.variete,
      perinee: body.perinee,
      degre: body.degre,
      suture: body.suture,
      typeFilSuture: body.typeFilSuture,
      typeDelivrance: body.typeDelivrance,
      dureeDelivranceMinutes: body.dureeDelivranceMinutes,
      placentaComplet: body.placentaComplet,
      poidsPlacenta: body.poidsPlacenta,
      anomaliesPlacenta: body.anomaliesPlacenta,
      perteSanguine: body.perteSanguine,
      hemorragie: body.hemorragie || false,
      traitementHemorragie: body.traitementHemorragie,
      examenPostPartum: body.examenPostPartum,
      complications: body.complications,
      notes: body.notes,
    }).returning()

    res.json({ success: true, accouchement: newAccouchement })
  } catch (error) {
    console.error('Create accouchement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/accouchements/:id - Update accouchement
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const body = req.body

    // Verify accouchement belongs to user
    const existing = await db.query.accouchements.findFirst({
      where: and(
        eq(accouchements.id, id),
        eq(accouchements.userId, req.user!.id)
      ),
    })

    if (!existing) {
      return res.status(404).json({ error: 'Accouchement non trouvé' })
    }

    const [updated] = await db
      .update(accouchements)
      .set({
        dateAccouchement: body.dateAccouchement ? new Date(body.dateAccouchement) : existing.dateAccouchement,
        lieuAccouchement: body.lieuAccouchement ?? existing.lieuAccouchement,
        termeSemaines: body.termeSemaines ?? existing.termeSemaines,
        termeJours: body.termeJours ?? existing.termeJours,
        dateDebutTravail: body.dateDebutTravail ? new Date(body.dateDebutTravail) : existing.dateDebutTravail,
        dureeTravailHeures: body.dureeTravailHeures ?? existing.dureeTravailHeures,
        dureeTravailMinutes: body.dureeTravailMinutes ?? existing.dureeTravailMinutes,
        ruptureMembranes: body.ruptureMembranes ?? existing.ruptureMembranes,
        dateRuptureMembranes: body.dateRuptureMembranes ? new Date(body.dateRuptureMembranes) : existing.dateRuptureMembranes,
        aspectLiquideAmniotique: body.aspectLiquideAmniotique ?? existing.aspectLiquideAmniotique,
        apd: body.apd ?? existing.apd,
        dateApd: body.dateApd ? new Date(body.dateApd) : existing.dateApd,
        autreAnalgesie: body.autreAnalgesie ?? existing.autreAnalgesie,
        modeAccouchement: body.modeAccouchement ?? existing.modeAccouchement,
        typeInstrumental: body.typeInstrumental ?? existing.typeInstrumental,
        indicationInstrumental: body.indicationInstrumental ?? existing.indicationInstrumental,
        indicationCesarienne: body.indicationCesarienne ?? existing.indicationCesarienne,
        presentation: body.presentation ?? existing.presentation,
        variete: body.variete ?? existing.variete,
        perinee: body.perinee ?? existing.perinee,
        degre: body.degre ?? existing.degre,
        suture: body.suture ?? existing.suture,
        typeFilSuture: body.typeFilSuture ?? existing.typeFilSuture,
        typeDelivrance: body.typeDelivrance ?? existing.typeDelivrance,
        dureeDelivranceMinutes: body.dureeDelivranceMinutes ?? existing.dureeDelivranceMinutes,
        placentaComplet: body.placentaComplet ?? existing.placentaComplet,
        poidsPlacenta: body.poidsPlacenta ?? existing.poidsPlacenta,
        anomaliesPlacenta: body.anomaliesPlacenta ?? existing.anomaliesPlacenta,
        perteSanguine: body.perteSanguine ?? existing.perteSanguine,
        hemorragie: body.hemorragie ?? existing.hemorragie,
        traitementHemorragie: body.traitementHemorragie ?? existing.traitementHemorragie,
        examenPostPartum: body.examenPostPartum ?? existing.examenPostPartum,
        complications: body.complications ?? existing.complications,
        notes: body.notes ?? existing.notes,
        updatedAt: new Date(),
      })
      .where(eq(accouchements.id, id))
      .returning()

    res.json({ success: true, accouchement: updated })
  } catch (error) {
    console.error('Update accouchement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/accouchements/:id - Delete accouchement
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Verify accouchement belongs to user
    const existing = await db.query.accouchements.findFirst({
      where: and(
        eq(accouchements.id, id),
        eq(accouchements.userId, req.user!.id)
      ),
    })

    if (!existing) {
      return res.status(404).json({ error: 'Accouchement non trouvé' })
    }

    await db.delete(accouchements).where(eq(accouchements.id, id))

    res.json({ success: true })
  } catch (error) {
    console.error('Delete accouchement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
