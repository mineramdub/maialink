import { Router } from 'express'
import { db } from '../lib/db'
import { parcoursReeducation, seancesReeducation } from '../lib/schema'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { eq, and, desc } from 'drizzle-orm'

const router = Router()

// GET /api/reeducation - Liste tous les parcours de l'utilisateur
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const parcours = await db.query.parcoursReeducation.findMany({
      where: eq(parcoursReeducation.userId, req.user!.id),
      with: {
        patient: true,
        seances: {
          orderBy: (seances, { asc }) => [asc(seances.numeroSeance)],
        },
      },
      orderBy: (parcours, { desc }) => [desc(parcours.dateDebut)],
    })

    res.json({ success: true, parcours })
  } catch (error) {
    console.error('Error fetching parcours reeducation:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// GET /api/reeducation/patient/:patientId - Liste tous les parcours d'une patiente
router.get('/patient/:patientId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { patientId } = req.params

    const parcours = await db.query.parcoursReeducation.findMany({
      where: and(
        eq(parcoursReeducation.patientId, patientId),
        eq(parcoursReeducation.userId, req.user!.id)
      ),
      with: {
        seances: {
          orderBy: (seances, { asc }) => [asc(seances.numeroSeance)],
        },
      },
      orderBy: (parcours, { desc }) => [desc(parcours.dateDebut)],
    })

    res.json({ success: true, parcours })
  } catch (error) {
    console.error('Error fetching patient parcours:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// POST /api/reeducation - Créer un nouveau parcours de rééducation
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { patientId, dateDebut, motif, nombreSeancesPrevues } = req.body

    if (!patientId || !dateDebut || !motif) {
      return res.status(400).json({
        success: false,
        error: 'patientId, dateDebut et motif sont requis'
      })
    }

    // Créer le parcours
    const [newParcours] = await db.insert(parcoursReeducation).values({
      patientId,
      userId: req.user!.id,
      dateDebut,
      motif,
      nombreSeancesPrevues: nombreSeancesPrevues || 5,
      status: 'en_cours',
    }).returning()

    // Créer automatiquement les 5 séances planifiées
    const seancesToCreate = []
    const nbSeances = nombreSeancesPrevues || 5

    for (let i = 1; i <= nbSeances; i++) {
      seancesToCreate.push({
        parcoursId: newParcours.id,
        patientId,
        userId: req.user!.id,
        numeroSeance: i,
        status: 'planifiee',
      })
    }

    const seances = await db.insert(seancesReeducation).values(seancesToCreate).returning()

    // Récupérer le parcours complet avec ses séances
    const parcoursComplet = await db.query.parcoursReeducation.findFirst({
      where: eq(parcoursReeducation.id, newParcours.id),
      with: {
        patient: true,
        seances: {
          orderBy: (seances, { asc }) => [asc(seances.numeroSeance)],
        },
      },
    })

    res.json({ success: true, parcours: parcoursComplet })
  } catch (error) {
    console.error('Error creating parcours:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// GET /api/reeducation/:id - Obtenir un parcours spécifique
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const parcours = await db.query.parcoursReeducation.findFirst({
      where: and(
        eq(parcoursReeducation.id, id),
        eq(parcoursReeducation.userId, req.user!.id)
      ),
      with: {
        patient: true,
        seances: {
          orderBy: (seances, { asc }) => [asc(seances.numeroSeance)],
        },
      },
    })

    if (!parcours) {
      return res.status(404).json({ success: false, error: 'Parcours introuvable' })
    }

    res.json({ success: true, parcours })
  } catch (error) {
    console.error('Error fetching parcours:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// PATCH /api/reeducation/:id - Mettre à jour un parcours
router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const [updatedParcours] = await db
      .update(parcoursReeducation)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(
        eq(parcoursReeducation.id, id),
        eq(parcoursReeducation.userId, req.user!.id)
      ))
      .returning()

    if (!updatedParcours) {
      return res.status(404).json({ success: false, error: 'Parcours introuvable' })
    }

    res.json({ success: true, parcours: updatedParcours })
  } catch (error) {
    console.error('Error updating parcours:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// DELETE /api/reeducation/:id - Supprimer un parcours
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    await db
      .delete(parcoursReeducation)
      .where(and(
        eq(parcoursReeducation.id, id),
        eq(parcoursReeducation.userId, req.user!.id)
      ))

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting parcours:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// ===== ROUTES POUR LES SÉANCES =====

// GET /api/reeducation/:parcoursId/seances/:seanceId - Obtenir une séance spécifique
router.get('/:parcoursId/seances/:seanceId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { seanceId } = req.params

    const seance = await db.query.seancesReeducation.findFirst({
      where: and(
        eq(seancesReeducation.id, seanceId),
        eq(seancesReeducation.userId, req.user!.id)
      ),
      with: {
        parcours: true,
        patient: true,
      },
    })

    if (!seance) {
      return res.status(404).json({ success: false, error: 'Séance introuvable' })
    }

    res.json({ success: true, seance })
  } catch (error) {
    console.error('Error fetching seance:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// PATCH /api/reeducation/:parcoursId/seances/:seanceId - Mettre à jour une séance
router.patch('/:parcoursId/seances/:seanceId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { parcoursId, seanceId } = req.params
    const updates = req.body

    // Mettre à jour la séance
    const [updatedSeance] = await db
      .update(seancesReeducation)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(
        eq(seancesReeducation.id, seanceId),
        eq(seancesReeducation.parcoursId, parcoursId),
        eq(seancesReeducation.userId, req.user!.id)
      ))
      .returning()

    if (!updatedSeance) {
      return res.status(404).json({ success: false, error: 'Séance introuvable' })
    }

    // Si la séance passe à 'realisee', incrémenter le nombre de séances réalisées
    if (updates.status === 'realisee') {
      const parcours = await db.query.parcoursReeducation.findFirst({
        where: eq(parcoursReeducation.id, parcoursId),
      })

      if (parcours) {
        await db
          .update(parcoursReeducation)
          .set({
            nombreSeancesRealisees: (parcours.nombreSeancesRealisees || 0) + 1,
            updatedAt: new Date(),
          })
          .where(eq(parcoursReeducation.id, parcoursId))
      }
    }

    res.json({ success: true, seance: updatedSeance })
  } catch (error) {
    console.error('Error updating seance:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// POST /api/reeducation/:parcoursId/seances - Ajouter une séance supplémentaire
router.post('/:parcoursId/seances', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { parcoursId } = req.params

    // Récupérer le parcours
    const parcours = await db.query.parcoursReeducation.findFirst({
      where: and(
        eq(parcoursReeducation.id, parcoursId),
        eq(parcoursReeducation.userId, req.user!.id)
      ),
      with: {
        seances: true,
      },
    })

    if (!parcours) {
      return res.status(404).json({ success: false, error: 'Parcours introuvable' })
    }

    // Calculer le nouveau numéro de séance
    const maxNumero = Math.max(...parcours.seances.map(s => s.numeroSeance), 0)
    const nouveauNumero = maxNumero + 1

    // Créer la nouvelle séance
    const [newSeance] = await db.insert(seancesReeducation).values({
      parcoursId,
      patientId: parcours.patientId,
      userId: req.user!.id,
      numeroSeance: nouveauNumero,
      status: 'planifiee',
    }).returning()

    // Mettre à jour le nombre de séances prévues
    await db
      .update(parcoursReeducation)
      .set({
        nombreSeancesPrevues: (parcours.nombreSeancesPrevues || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(parcoursReeducation.id, parcoursId))

    res.json({ success: true, seance: newSeance })
  } catch (error) {
    console.error('Error adding seance:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// DELETE /api/reeducation/:parcoursId/seances/:seanceId - Supprimer une séance
router.delete('/:parcoursId/seances/:seanceId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { parcoursId, seanceId } = req.params

    await db
      .delete(seancesReeducation)
      .where(and(
        eq(seancesReeducation.id, seanceId),
        eq(seancesReeducation.parcoursId, parcoursId),
        eq(seancesReeducation.userId, req.user!.id)
      ))

    // Décrémenter le nombre de séances prévues
    const parcours = await db.query.parcoursReeducation.findFirst({
      where: eq(parcoursReeducation.id, parcoursId),
    })

    if (parcours && parcours.nombreSeancesPrevues > 0) {
      await db
        .update(parcoursReeducation)
        .set({
          nombreSeancesPrevues: parcours.nombreSeancesPrevues - 1,
          updatedAt: new Date(),
        })
        .where(eq(parcoursReeducation.id, parcoursId))
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting seance:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

export default router
