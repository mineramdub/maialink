import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { ORDONNANCE_TEMPLATES } from '../lib/ordonnanceTemplates.js'

const router = Router()
router.use(authMiddleware)

// GET /api/templates - Récupérer tous les templates d'ordonnances
router.get('/', async (req: AuthRequest, res) => {
  try {
    // Retourner les templates avec leur catégorie et métadonnées
    const templates = ORDONNANCE_TEMPLATES.map((template, index) => ({
      id: `ordonnance-${index}`,
      nom: template.nom,
      categorie: template.categorie,
      description: template.description,
      contenu: template.contenu,
      type: 'ordonnance'
    }))

    res.json({
      success: true,
      templates
    })
  } catch (error) {
    console.error('Get templates error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/templates/:id - Récupérer un template spécifique
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const templateIndex = parseInt(req.params.id.replace('ordonnance-', ''))

    if (isNaN(templateIndex) || templateIndex < 0 || templateIndex >= ORDONNANCE_TEMPLATES.length) {
      return res.status(404).json({ error: 'Template non trouvé' })
    }

    const template = ORDONNANCE_TEMPLATES[templateIndex]

    res.json({
      success: true,
      template: {
        id: `ordonnance-${templateIndex}`,
        nom: template.nom,
        categorie: template.categorie,
        description: template.description,
        contenu: template.contenu,
        type: 'ordonnance'
      }
    })
  } catch (error) {
    console.error('Get template error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
