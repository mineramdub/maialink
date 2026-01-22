import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { ordonnanceTemplates, auditLogs } from '../lib/schema.js'
import { eq, and, or, desc, sql } from 'drizzle-orm'
import { invalidateTemplateCache } from '../lib/template-loader.js'

const router = Router()
router.use(authMiddleware)

// GET /api/ordonnance-templates - List all templates (system + user's)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { categorie, type, isActive, search } = req.query

    let whereClause = or(
      eq(ordonnanceTemplates.isSystemTemplate, true),
      eq(ordonnanceTemplates.userId, req.user!.id)
    )!

    // Filtres
    if (categorie) {
      whereClause = and(whereClause, eq(ordonnanceTemplates.categorie, categorie as string))!
    }
    if (type) {
      whereClause = and(whereClause, eq(ordonnanceTemplates.type, type as any))!
    }
    if (isActive !== undefined) {
      whereClause = and(whereClause, eq(ordonnanceTemplates.isActive, isActive === 'true'))!
    }

    let templates = await db.query.ordonnanceTemplates.findMany({
      where: whereClause,
      orderBy: [desc(ordonnanceTemplates.createdAt)],
    })

    // Recherche textuelle si fournie
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      templates = templates.filter(t =>
        t.nom.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.categorie.toLowerCase().includes(searchLower)
      )
    }

    // Calculer l'âge des templates et ajouter des alertes
    const templatesWithAge = templates.map(template => {
      const ageInDays = template.createdAt
        ? Math.floor((Date.now() - new Date(template.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0

      const ageInYears = ageInDays / 365

      let ageWarning = null
      if (ageInYears >= 2) {
        ageWarning = 'critical' // > 2 ans
      } else if (ageInYears >= 1) {
        ageWarning = 'warning' // > 1 an
      }

      return {
        ...template,
        ageInDays,
        ageInYears: parseFloat(ageInYears.toFixed(1)),
        ageWarning,
      }
    })

    res.json({ success: true, templates: templatesWithAge })
  } catch (error) {
    console.error('Get templates error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/ordonnance-templates/:id - Get single template
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const template = await db.query.ordonnanceTemplates.findFirst({
      where: and(
        eq(ordonnanceTemplates.id, id),
        or(
          eq(ordonnanceTemplates.isSystemTemplate, true),
          eq(ordonnanceTemplates.userId, req.user!.id)
        )!
      ),
    })

    if (!template) {
      return res.status(404).json({ error: 'Template non trouvé' })
    }

    res.json({ success: true, template })
  } catch (error) {
    console.error('Get template error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/ordonnance-templates - Create new template (user only)
router.post('/', async (req: AuthRequest, res) => {
  try {
    const body = req.body

    // Validation
    if (!body.nom || !body.categorie || !body.type || !body.contenu) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants: nom, categorie, type, contenu'
      })
    }

    const [newTemplate] = await db.insert(ordonnanceTemplates).values({
      userId: req.user!.id,
      nom: body.nom,
      categorie: body.categorie,
      type: body.type,
      priorite: body.priorite || 'recommande',
      contenu: body.contenu,
      description: body.description,
      source: body.source,
      version: body.version,
      dateValidite: body.dateValidite ? new Date(body.dateValidite) : null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      isSystemTemplate: false, // Les templates utilisateurs ne sont jamais système
    }).returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'create',
      tableName: 'ordonnance_templates',
      recordId: newTemplate.id,
      newData: newTemplate,
    })

    // Invalider le cache
    invalidateTemplateCache()

    res.json({ success: true, template: newTemplate })
  } catch (error) {
    console.error('Create template error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/ordonnance-templates/:id - Update template
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const body = req.body

    // Check if template exists and belongs to user
    const existingTemplate = await db.query.ordonnanceTemplates.findFirst({
      where: eq(ordonnanceTemplates.id, id),
    })

    if (!existingTemplate) {
      return res.status(404).json({ error: 'Template non trouvé' })
    }

    // Ne peut pas modifier un template système
    if (existingTemplate.isSystemTemplate) {
      return res.status(403).json({
        error: 'Les templates système ne peuvent pas être modifiés. Créez une copie personnalisée.'
      })
    }

    // Ne peut pas modifier le template d'un autre utilisateur
    if (existingTemplate.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Accès non autorisé' })
    }

    // Update
    const [updatedTemplate] = await db.update(ordonnanceTemplates)
      .set({
        nom: body.nom,
        categorie: body.categorie,
        type: body.type,
        priorite: body.priorite,
        contenu: body.contenu,
        description: body.description,
        source: body.source,
        version: body.version,
        dateValidite: body.dateValidite ? new Date(body.dateValidite) : null,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(ordonnanceTemplates.id, id))
      .returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'update',
      tableName: 'ordonnance_templates',
      recordId: id,
      oldData: existingTemplate,
      newData: updatedTemplate,
    })

    // Invalider le cache
    invalidateTemplateCache()

    res.json({ success: true, template: updatedTemplate })
  } catch (error) {
    console.error('Update template error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/ordonnance-templates/:id/duplicate - Duplicate template (pour créer version personnalisée)
router.post('/:id/duplicate', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const originalTemplate = await db.query.ordonnanceTemplates.findFirst({
      where: and(
        eq(ordonnanceTemplates.id, id),
        or(
          eq(ordonnanceTemplates.isSystemTemplate, true),
          eq(ordonnanceTemplates.userId, req.user!.id)
        )!
      ),
    })

    if (!originalTemplate) {
      return res.status(404).json({ error: 'Template non trouvé' })
    }

    // Créer une copie
    const [duplicatedTemplate] = await db.insert(ordonnanceTemplates).values({
      userId: req.user!.id,
      nom: `${originalTemplate.nom} (Copie)`,
      categorie: originalTemplate.categorie,
      type: originalTemplate.type,
      priorite: originalTemplate.priorite,
      contenu: originalTemplate.contenu,
      description: originalTemplate.description,
      source: originalTemplate.source,
      version: originalTemplate.version,
      dateValidite: originalTemplate.dateValidite,
      isActive: true,
      isSystemTemplate: false,
    }).returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'create',
      tableName: 'ordonnance_templates',
      recordId: duplicatedTemplate.id,
      newData: duplicatedTemplate,
    })

    // Invalider le cache
    invalidateTemplateCache()

    res.json({ success: true, template: duplicatedTemplate })
  } catch (error) {
    console.error('Duplicate template error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/ordonnance-templates/:id - Delete template (user only, not system)
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const template = await db.query.ordonnanceTemplates.findFirst({
      where: eq(ordonnanceTemplates.id, id),
    })

    if (!template) {
      return res.status(404).json({ error: 'Template non trouvé' })
    }

    // Ne peut pas supprimer un template système
    if (template.isSystemTemplate) {
      return res.status(403).json({
        error: 'Les templates système ne peuvent pas être supprimés'
      })
    }

    // Ne peut pas supprimer le template d'un autre utilisateur
    if (template.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Accès non autorisé' })
    }

    await db.delete(ordonnanceTemplates).where(eq(ordonnanceTemplates.id, id))

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'delete',
      tableName: 'ordonnance_templates',
      recordId: id,
    })

    // Invalider le cache
    invalidateTemplateCache()

    res.json({ success: true })
  } catch (error) {
    console.error('Delete template error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/ordonnance-templates/stats/summary - Get statistics
router.get('/stats/summary', async (req: AuthRequest, res) => {
  try {
    const allTemplates = await db.query.ordonnanceTemplates.findMany({
      where: or(
        eq(ordonnanceTemplates.isSystemTemplate, true),
        eq(ordonnanceTemplates.userId, req.user!.id)
      )!,
    })

    const stats = {
      total: allTemplates.length,
      system: allTemplates.filter(t => t.isSystemTemplate).length,
      personal: allTemplates.filter(t => !t.isSystemTemplate).length,
      active: allTemplates.filter(t => t.isActive).length,
      inactive: allTemplates.filter(t => !t.isActive).length,
      expiringSoon: allTemplates.filter(t => {
        if (!t.createdAt) return false
        const ageInYears = (Date.now() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)
        return ageInYears >= 1 && ageInYears < 2
      }).length,
      expired: allTemplates.filter(t => {
        if (!t.createdAt) return false
        const ageInYears = (Date.now() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)
        return ageInYears >= 2
      }).length,
    }

    res.json({ success: true, stats })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
