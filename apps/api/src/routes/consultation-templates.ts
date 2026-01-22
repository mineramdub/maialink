import express from 'express'
import { db } from '../lib/db.js'
import { consultationTemplates } from '../lib/schema.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'
import { eq, and } from 'drizzle-orm'
import { getTemplatesByType, getTemplateById } from '../lib/consultationTemplates.js'

const router = express.Router()

/**
 * GET /api/consultation-templates
 * Récupère tous les templates (par défaut + personnalisés)
 */
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { type } = req.query

    // Templates par défaut
    const defaultTemplates = type
      ? getTemplatesByType(type as string)
      : require('../lib/consultationTemplates.js').consultationTemplates

    // Templates personnalisés de l'utilisateur
    let customTemplates = await db.query.consultationTemplates.findMany({
      where: and(
        eq(consultationTemplates.userId, userId),
        eq(consultationTemplates.isActive, true),
        type ? eq(consultationTemplates.type, type as any) : undefined
      )
    })

    // Fusionner : templates personnalisés remplacent les templates par défaut
    const templatesMap = new Map()

    // D'abord les templates par défaut
    defaultTemplates.forEach((t: any) => {
      templatesMap.set(t.id, { ...t, isCustom: false })
    })

    // Puis les templates personnalisés (écrasent les défaut si même ID)
    customTemplates.forEach(t => {
      templatesMap.set(t.templateId, {
        id: t.templateId,
        name: t.name,
        description: t.description,
        type: t.type,
        saMin: t.saMin,
        saMax: t.saMax,
        data: t.data,
        isCustom: true,
        dbId: t.id
      })
    })

    res.json({
      success: true,
      templates: Array.from(templatesMap.values())
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des templates' })
  }
})

/**
 * GET /api/consultation-templates/:id
 * Récupère un template spécifique
 */
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    // Chercher d'abord dans les templates personnalisés
    const customTemplate = await db.query.consultationTemplates.findFirst({
      where: and(
        eq(consultationTemplates.templateId, id),
        eq(consultationTemplates.userId, userId),
        eq(consultationTemplates.isActive, true)
      )
    })

    if (customTemplate) {
      return res.json({
        success: true,
        template: {
          id: customTemplate.templateId,
          name: customTemplate.name,
          description: customTemplate.description,
          type: customTemplate.type,
          saMin: customTemplate.saMin,
          saMax: customTemplate.saMax,
          data: customTemplate.data,
          isCustom: true,
          dbId: customTemplate.id
        }
      })
    }

    // Sinon, chercher dans les templates par défaut
    const defaultTemplate = getTemplateById(id)
    if (defaultTemplate) {
      return res.json({
        success: true,
        template: { ...defaultTemplate, isCustom: false }
      })
    }

    res.status(404).json({ success: false, error: 'Template non trouvé' })
  } catch (error) {
    console.error('Error fetching template:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération du template' })
  }
})

/**
 * POST /api/consultation-templates
 * Crée ou met à jour un template personnalisé
 */
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { templateId, name, description, type, saMin, saMax, data } = req.body

    // Vérifier si un template personnalisé existe déjà pour cet ID
    const existing = await db.query.consultationTemplates.findFirst({
      where: and(
        eq(consultationTemplates.templateId, templateId),
        eq(consultationTemplates.userId, userId)
      )
    })

    if (existing) {
      // Mettre à jour
      await db
        .update(consultationTemplates)
        .set({
          name,
          description,
          type,
          saMin,
          saMax,
          data,
          updatedAt: new Date()
        })
        .where(eq(consultationTemplates.id, existing.id))

      return res.json({
        success: true,
        message: 'Template mis à jour',
        template: { id: existing.id, templateId }
      })
    }

    // Créer nouveau template personnalisé
    const [newTemplate] = await db
      .insert(consultationTemplates)
      .values({
        userId,
        templateId,
        name,
        description,
        type,
        saMin,
        saMax,
        data,
        isCustom: true,
        isActive: true
      })
      .returning()

    res.json({
      success: true,
      message: 'Template créé',
      template: newTemplate
    })
  } catch (error) {
    console.error('Error saving template:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la sauvegarde du template' })
  }
})

/**
 * DELETE /api/consultation-templates/:id
 * Supprime (désactive) un template personnalisé
 */
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const template = await db.query.consultationTemplates.findFirst({
      where: and(
        eq(consultationTemplates.templateId, id),
        eq(consultationTemplates.userId, userId)
      )
    })

    if (!template) {
      return res.status(404).json({ success: false, error: 'Template non trouvé' })
    }

    // Désactiver au lieu de supprimer
    await db
      .update(consultationTemplates)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(consultationTemplates.id, template.id))

    res.json({
      success: true,
      message: 'Template supprimé'
    })
  } catch (error) {
    console.error('Error deleting template:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du template' })
  }
})

/**
 * POST /api/consultation-templates/:id/reset
 * Réinitialise un template aux valeurs par défaut
 */
router.post('/:id/reset', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    // Supprimer la version personnalisée
    const template = await db.query.consultationTemplates.findFirst({
      where: and(
        eq(consultationTemplates.templateId, id),
        eq(consultationTemplates.userId, userId)
      )
    })

    if (template) {
      await db
        .delete(consultationTemplates)
        .where(eq(consultationTemplates.id, template.id))
    }

    res.json({
      success: true,
      message: 'Template réinitialisé aux valeurs par défaut'
    })
  } catch (error) {
    console.error('Error resetting template:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la réinitialisation du template' })
  }
})

export default router
