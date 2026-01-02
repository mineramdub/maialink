import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { documentTemplates } from '../lib/schema.js'
import { eq, and, or } from 'drizzle-orm'

const router = Router()
router.use(authMiddleware)

// GET /api/document-templates - Liste des templates
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { type } = req.query

    let query = db
      .select()
      .from(documentTemplates)
      .where(
        or(
          eq(documentTemplates.userId, userId),
          eq(documentTemplates.isDefault, true)
        )
      )
      .$dynamic()

    if (type) {
      query = query.where(eq(documentTemplates.type, type as string))
    }

    const templates = await query

    res.json({
      success: true,
      templates,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des templates:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des templates',
    })
  }
})

// GET /api/document-templates/:id - Détail d'un template
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const template = await db.query.documentTemplates.findFirst({
      where: and(
        eq(documentTemplates.id, id),
        or(
          eq(documentTemplates.userId, userId),
          eq(documentTemplates.isDefault, true)
        )
      ),
    })

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template non trouvé',
      })
    }

    res.json({
      success: true,
      template,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du template:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du template',
    })
  }
})

// POST /api/document-templates - Créer un nouveau template
router.post('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { type, nom, contenu, variables, isDefault } = req.body

    // Validation
    if (!type || !nom || !contenu) {
      return res.status(400).json({
        success: false,
        error: 'Le type, le nom et le contenu sont obligatoires',
      })
    }

    // Seuls les admins peuvent créer des templates par défaut
    const finalIsDefault = req.user!.role === 'admin' ? isDefault : false

    const [newTemplate] = await db
      .insert(documentTemplates)
      .values({
        userId,
        type,
        nom,
        contenu,
        variables: variables || [],
        isDefault: finalIsDefault,
      })
      .returning()

    res.status(201).json({
      success: true,
      template: newTemplate,
    })
  } catch (error) {
    console.error('Erreur lors de la création du template:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du template',
    })
  }
})

// PUT /api/document-templates/:id - Modifier un template
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const { type, nom, contenu, variables, isDefault } = req.body

    // Vérifier que le template appartient à l'utilisateur
    const existingTemplate = await db.query.documentTemplates.findFirst({
      where: and(
        eq(documentTemplates.id, id),
        eq(documentTemplates.userId, userId)
      ),
    })

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        error: 'Template non trouvé ou non autorisé',
      })
    }

    // Seuls les admins peuvent modifier isDefault
    const finalIsDefault =
      req.user!.role === 'admin' ? isDefault : existingTemplate.isDefault

    const [updatedTemplate] = await db
      .update(documentTemplates)
      .set({
        type: type || existingTemplate.type,
        nom: nom || existingTemplate.nom,
        contenu: contenu || existingTemplate.contenu,
        variables: variables || existingTemplate.variables,
        isDefault: finalIsDefault,
        updatedAt: new Date(),
      })
      .where(eq(documentTemplates.id, id))
      .returning()

    res.json({
      success: true,
      template: updatedTemplate,
    })
  } catch (error) {
    console.error('Erreur lors de la modification du template:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la modification du template',
    })
  }
})

// DELETE /api/document-templates/:id - Supprimer un template
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    // Vérifier que le template appartient à l'utilisateur
    const existingTemplate = await db.query.documentTemplates.findFirst({
      where: and(
        eq(documentTemplates.id, id),
        eq(documentTemplates.userId, userId)
      ),
    })

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        error: 'Template non trouvé ou non autorisé',
      })
    }

    // Ne pas permettre la suppression des templates par défaut
    if (existingTemplate.isDefault) {
      return res.status(403).json({
        success: false,
        error: 'Les templates par défaut ne peuvent pas être supprimés',
      })
    }

    await db.delete(documentTemplates).where(eq(documentTemplates.id, id))

    res.json({
      success: true,
      message: 'Template supprimé avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du template:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du template',
    })
  }
})

export default router
