import { Router } from 'express'
import { db } from '../lib/db.js'
import { frottis, contraceptifs, resultatsARecuperer, grossesses, patients } from '../lib/schema.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm'

const router = Router()

// ========================================
// FROTTIS
// ========================================

// GET /api/suivi-gyneco/frottis - Liste tous les frottis
router.get('/frottis', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const allFrottis = await db.query.frottis.findMany({
      where: eq(frottis.userId, userId),
      with: {
        patient: true,
      },
      orderBy: [desc(frottis.dateRealisation)],
    })

    res.json({ success: true, frottis: allFrottis })
  } catch (error) {
    console.error('Error fetching frottis:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// GET /api/suivi-gyneco/frottis/en-attente - Frottis en attente de résultats
router.get('/frottis/en-attente', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const frottisEnAttente = await db.query.frottis.findMany({
      where: and(
        eq(frottis.userId, userId),
        eq(frottis.resultat, 'en_attente')
      ),
      with: {
        patient: true,
      },
      orderBy: [desc(frottis.dateRealisation)],
    })

    res.json({ success: true, frottis: frottisEnAttente })
  } catch (error) {
    console.error('Error fetching frottis en attente:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// POST /api/suivi-gyneco/frottis - Créer un frottis
router.post('/frottis', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { patientId, dateRealisation, dateResultat, resultat, notes } = req.body

    // Calculer date prochain frottis si résultat normal (3 ans après)
    let dateProchainFrottis = null
    if (resultat === 'normal' && dateRealisation) {
      const dateReal = new Date(dateRealisation)
      dateReal.setFullYear(dateReal.getFullYear() + 3)
      dateProchainFrottis = dateReal.toISOString().split('T')[0]
    }

    const [newFrottis] = await db
      .insert(frottis)
      .values({
        patientId,
        userId,
        dateRealisation,
        dateResultat: dateResultat || null,
        resultat: resultat || 'en_attente',
        notes: notes || null,
        dateProchainFrottis,
        rappelEnvoye: false,
      })
      .returning()

    res.json({ success: true, frottis: newFrottis })
  } catch (error) {
    console.error('Error creating frottis:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// PUT /api/suivi-gyneco/frottis/:id - Mettre à jour un frottis
router.put('/frottis/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { dateRealisation, dateResultat, resultat, notes, patientePrevenu, resultatRecupere } = req.body

    // Calculer date prochain frottis si résultat normal
    let dateProchainFrottis = null
    if (resultat === 'normal' && dateRealisation) {
      const dateReal = new Date(dateRealisation)
      dateReal.setFullYear(dateReal.getFullYear() + 3)
      dateProchainFrottis = dateReal.toISOString().split('T')[0]
    }

    // Construire l'objet de mise à jour
    const updateData: any = {
      updatedAt: new Date(),
    }

    // Ajouter les champs uniquement s'ils sont fournis
    if (dateRealisation !== undefined) updateData.dateRealisation = dateRealisation
    if (dateResultat !== undefined) updateData.dateResultat = dateResultat || null
    if (resultat !== undefined) updateData.resultat = resultat
    if (notes !== undefined) updateData.notes = notes || null
    if (dateProchainFrottis !== null) updateData.dateProchainFrottis = dateProchainFrottis
    if (patientePrevenu !== undefined) updateData.patientePrevenu = patientePrevenu
    if (resultatRecupere !== undefined) updateData.resultatRecupere = resultatRecupere

    const [updated] = await db
      .update(frottis)
      .set(updateData)
      .where(and(eq(frottis.id, id), eq(frottis.userId, userId)))
      .returning()

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Frottis introuvable' })
    }

    res.json({ success: true, frottis: updated })
  } catch (error) {
    console.error('Error updating frottis:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// DELETE /api/suivi-gyneco/frottis/:id - Supprimer un frottis
router.delete('/frottis/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    await db.delete(frottis).where(and(eq(frottis.id, id), eq(frottis.userId, userId)))

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting frottis:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// ========================================
// CONTRACEPTIFS
// ========================================

// GET /api/suivi-gyneco/contraceptifs - Liste tous les contraceptifs actifs
router.get('/contraceptifs', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const allContraceptifs = await db.query.contraceptifs.findMany({
      where: and(eq(contraceptifs.userId, userId), eq(contraceptifs.actif, true)),
      with: {
        patient: true,
      },
      orderBy: [desc(contraceptifs.datePose)],
    })

    res.json({ success: true, contraceptifs: allContraceptifs })
  } catch (error) {
    console.error('Error fetching contraceptifs:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// GET /api/suivi-gyneco/contraceptifs/a-renouveler - Contraceptifs à renouveler bientôt
router.get('/contraceptifs/a-renouveler', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    // Date dans 1 mois
    const dateIn1Month = new Date()
    dateIn1Month.setMonth(dateIn1Month.getMonth() + 1)
    const dateIn1MonthStr = dateIn1Month.toISOString().split('T')[0]

    const contraceptifsARenouv = await db.query.contraceptifs.findMany({
      where: and(
        eq(contraceptifs.userId, userId),
        eq(contraceptifs.actif, true),
        lte(contraceptifs.dateExpiration, dateIn1MonthStr)
      ),
      with: {
        patient: true,
      },
      orderBy: [contraceptifs.dateExpiration],
    })

    res.json({ success: true, contraceptifs: contraceptifsARenouv })
  } catch (error) {
    console.error('Error fetching contraceptifs à renouveler:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// POST /api/suivi-gyneco/contraceptifs - Créer un contraceptif
router.post('/contraceptifs', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { patientId, type, datePose, dateExpiration, numeroLot, marque, modele, notes } = req.body

    // Calculer date de rappel (2 semaines avant expiration)
    let dateRappel = null
    if (dateExpiration) {
      const dateExp = new Date(dateExpiration)
      dateExp.setDate(dateExp.getDate() - 14)
      dateRappel = dateExp.toISOString().split('T')[0]
    }

    const [newContraceptif] = await db
      .insert(contraceptifs)
      .values({
        patientId,
        userId,
        type,
        datePose,
        dateExpiration,
        numeroLot: numeroLot || null,
        marque: marque || null,
        modele: modele || null,
        notes: notes || null,
        dateRappel,
        rappelEnvoye: false,
        actif: true,
      })
      .returning()

    res.json({ success: true, contraceptif: newContraceptif })
  } catch (error) {
    console.error('Error creating contraceptif:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// PUT /api/suivi-gyneco/contraceptifs/:id - Mettre à jour un contraceptif
router.put('/contraceptifs/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { type, datePose, dateExpiration, numeroLot, marque, modele, notes, actif } = req.body

    // Recalculer date de rappel si dateExpiration change
    let dateRappel = undefined
    if (dateExpiration) {
      const dateExp = new Date(dateExpiration)
      dateExp.setDate(dateExp.getDate() - 14)
      dateRappel = dateExp.toISOString().split('T')[0]
    }

    const [updated] = await db
      .update(contraceptifs)
      .set({
        type,
        datePose,
        dateExpiration,
        numeroLot,
        marque,
        modele,
        notes,
        dateRappel,
        actif,
        updatedAt: new Date(),
      })
      .where(and(eq(contraceptifs.id, id), eq(contraceptifs.userId, userId)))
      .returning()

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Contraceptif introuvable' })
    }

    res.json({ success: true, contraceptif: updated })
  } catch (error) {
    console.error('Error updating contraceptif:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// POST /api/suivi-gyneco/contraceptifs/:id/retirer - Marquer un contraceptif comme retiré
router.post('/contraceptifs/:id/retirer', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { dateRetrait, raisonRetrait } = req.body

    const [updated] = await db
      .update(contraceptifs)
      .set({
        dateRetrait,
        raisonRetrait,
        actif: false,
        updatedAt: new Date(),
      })
      .where(and(eq(contraceptifs.id, id), eq(contraceptifs.userId, userId)))
      .returning()

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Contraceptif introuvable' })
    }

    res.json({ success: true, contraceptif: updated })
  } catch (error) {
    console.error('Error retiring contraceptif:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// DELETE /api/suivi-gyneco/contraceptifs/:id - Supprimer un contraceptif
router.delete('/contraceptifs/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    await db.delete(contraceptifs).where(and(eq(contraceptifs.id, id), eq(contraceptifs.userId, userId)))

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting contraceptif:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// ========================================
// ACCOUCHEMENTS À VENIR
// ========================================

// GET /api/suivi-gyneco/accouchements - Liste chronologique des accouchements à venir
router.get('/accouchements', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const grossessesEnCours = await db.query.grossesses.findMany({
      where: and(
        eq(grossesses.userId, userId),
        eq(grossesses.status, 'en_cours')
      ),
      with: {
        patient: true,
      },
      orderBy: [grossesses.dpa],
    })

    res.json({ success: true, accouchements: grossessesEnCours })
  } catch (error) {
    console.error('Error fetching accouchements:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// ========================================
// RÉSULTATS À RÉCUPÉRER
// ========================================

// GET /api/suivi-gyneco/resultats - Liste tous les résultats
router.get('/resultats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const allResultats = await db.query.resultatsARecuperer.findMany({
      where: eq(resultatsARecuperer.userId, userId),
      with: {
        patient: true,
      },
      orderBy: [desc(resultatsARecuperer.createdAt)],
    })

    res.json({ success: true, resultats: allResultats })
  } catch (error) {
    console.error('Error fetching resultats:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// GET /api/suivi-gyneco/resultats/en-attente - Résultats en attente
router.get('/resultats/en-attente', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const resultatsEnAttente = await db.query.resultatsARecuperer.findMany({
      where: and(
        eq(resultatsARecuperer.userId, userId),
        eq(resultatsARecuperer.statut, 'en_attente')
      ),
      with: {
        patient: true,
      },
      orderBy: [resultatsARecuperer.dateExamen],
    })

    res.json({ success: true, resultats: resultatsEnAttente })
  } catch (error) {
    console.error('Error fetching resultats en attente:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// POST /api/suivi-gyneco/resultats - Créer un résultat à récupérer
router.post('/resultats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { patientId, typeExamen, description, categorie, dateExamen, laboratoire, notes } = req.body

    const [newResultat] = await db
      .insert(resultatsARecuperer)
      .values({
        patientId,
        userId,
        typeExamen,
        description,
        categorie: categorie || 'gyneco',
        dateExamen: dateExamen || null,
        laboratoire: laboratoire || null,
        notes: notes || null,
        statut: 'en_attente',
      })
      .returning()

    res.json({ success: true, resultat: newResultat })
  } catch (error) {
    console.error('Error creating resultat:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// PUT /api/suivi-gyneco/resultats/:id - Mettre à jour un résultat
router.put('/resultats/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { typeExamen, description, categorie, dateExamen, laboratoire, statut, dateRecuperation, notes } = req.body

    const [updated] = await db
      .update(resultatsARecuperer)
      .set({
        typeExamen,
        description,
        categorie,
        dateExamen,
        laboratoire,
        statut,
        dateRecuperation,
        notes,
        updatedAt: new Date(),
      })
      .where(and(eq(resultatsARecuperer.id, id), eq(resultatsARecuperer.userId, userId)))
      .returning()

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Résultat introuvable' })
    }

    res.json({ success: true, resultat: updated })
  } catch (error) {
    console.error('Error updating resultat:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// DELETE /api/suivi-gyneco/resultats/:id - Supprimer un résultat
router.delete('/resultats/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    await db.delete(resultatsARecuperer).where(and(eq(resultatsARecuperer.id, id), eq(resultatsARecuperer.userId, userId)))

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting resultat:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

export default router
