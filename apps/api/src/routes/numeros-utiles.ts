import { Router } from 'express'
import { db } from '../lib/db.js'
import { numerosUtiles } from '../lib/schema.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'
import { eq, and, desc } from 'drizzle-orm'

const router = Router()
router.use(authMiddleware)

// GET /api/numeros-utiles - Get all numéros utiles for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { categorie, favori } = req.query

    let query = db.select()
      .from(numerosUtiles)
      .where(eq(numerosUtiles.userId, req.user!.id))

    const results = await query.orderBy(
      desc(numerosUtiles.favori),
      numerosUtiles.ordre,
      numerosUtiles.nom
    )

    // Filter by category if provided
    let filtered = results
    if (categorie && typeof categorie === 'string') {
      filtered = results.filter(n => n.categorie === categorie)
    }

    // Filter by favori if provided
    if (favori === 'true') {
      filtered = results.filter(n => n.favori === true)
    }

    res.json({
      success: true,
      numeros: filtered
    })
  } catch (error) {
    console.error('Get numéros utiles error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/numeros-utiles/:id - Get specific numéro utile
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const numero = await db.query.numerosUtiles.findFirst({
      where: and(
        eq(numerosUtiles.id, req.params.id),
        eq(numerosUtiles.userId, req.user!.id)
      )
    })

    if (!numero) {
      return res.status(404).json({ error: 'Numéro non trouvé' })
    }

    res.json({
      success: true,
      numero
    })
  } catch (error) {
    console.error('Get numéro utile error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/numeros-utiles - Create new numéro utile
router.post('/', async (req: AuthRequest, res) => {
  try {
    const {
      nom,
      description,
      categorie,
      telephone,
      email,
      adresse,
      notes,
      favori = false,
      ordre = 0
    } = req.body

    if (!nom || !categorie) {
      return res.status(400).json({ error: 'Nom et catégorie requis' })
    }

    const [numero] = await db.insert(numerosUtiles).values({
      userId: req.user!.id,
      nom,
      description: description || null,
      categorie,
      telephone: telephone || null,
      email: email || null,
      adresse: adresse || null,
      notes: notes || null,
      favori,
      ordre
    }).returning()

    res.status(201).json({
      success: true,
      numero
    })
  } catch (error) {
    console.error('Create numéro utile error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/numeros-utiles/:id - Update numéro utile
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const numero = await db.query.numerosUtiles.findFirst({
      where: and(
        eq(numerosUtiles.id, req.params.id),
        eq(numerosUtiles.userId, req.user!.id)
      )
    })

    if (!numero) {
      return res.status(404).json({ error: 'Numéro non trouvé' })
    }

    const {
      nom,
      description,
      categorie,
      telephone,
      email,
      adresse,
      notes,
      favori,
      ordre
    } = req.body

    const [updated] = await db.update(numerosUtiles)
      .set({
        nom: nom !== undefined ? nom : numero.nom,
        description: description !== undefined ? description : numero.description,
        categorie: categorie !== undefined ? categorie : numero.categorie,
        telephone: telephone !== undefined ? telephone : numero.telephone,
        email: email !== undefined ? email : numero.email,
        adresse: adresse !== undefined ? adresse : numero.adresse,
        notes: notes !== undefined ? notes : numero.notes,
        favori: favori !== undefined ? favori : numero.favori,
        ordre: ordre !== undefined ? ordre : numero.ordre,
        updatedAt: new Date()
      })
      .where(eq(numerosUtiles.id, req.params.id))
      .returning()

    res.json({
      success: true,
      numero: updated
    })
  } catch (error) {
    console.error('Update numéro utile error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/numeros-utiles/:id - Delete numéro utile
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const numero = await db.query.numerosUtiles.findFirst({
      where: and(
        eq(numerosUtiles.id, req.params.id),
        eq(numerosUtiles.userId, req.user!.id)
      )
    })

    if (!numero) {
      return res.status(404).json({ error: 'Numéro non trouvé' })
    }

    await db.delete(numerosUtiles)
      .where(eq(numerosUtiles.id, req.params.id))

    res.json({
      success: true,
      message: 'Numéro supprimé'
    })
  } catch (error) {
    console.error('Delete numéro utile error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
