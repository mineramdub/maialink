import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { ressourcesMedicales } from '../lib/schema.js'
import { eq, and, desc } from 'drizzle-orm'

const router = Router()

// GET /api/ressources-medicales - Liste des ressources
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id

    const ressources = await db.select()
      .from(ressourcesMedicales)
      .where(eq(ressourcesMedicales.userId, userId))
      .orderBy(desc(ressourcesMedicales.createdAt))

    res.json(ressources)
  } catch (error) {
    console.error('Error fetching ressources:', error)
    res.status(500).json({ error: 'Failed to fetch ressources' })
  }
})

// POST /api/ressources-medicales - Créer une ressource
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const { titre, description, categorie, type, url, contenu, tags } = req.body

    if (!titre || !categorie || !type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const [ressource] = await db.insert(ressourcesMedicales).values({
      userId,
      titre,
      description: description || null,
      categorie,
      type,
      url: url || null,
      contenu: contenu || null,
      tags: tags || [],
    }).returning()

    res.json(ressource)
  } catch (error) {
    console.error('Error creating ressource:', error)
    res.status(500).json({ error: 'Failed to create ressource' })
  }
})

// DELETE /api/ressources-medicales/:id - Supprimer une ressource
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    await db.delete(ressourcesMedicales)
      .where(and(
        eq(ressourcesMedicales.id, id),
        eq(ressourcesMedicales.userId, userId)
      ))

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting ressource:', error)
    res.status(500).json({ error: 'Failed to delete ressource' })
  }
})

export default router
