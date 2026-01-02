import { Router } from 'express'
import { db } from '../lib/db.js'
import { practitionerSettings } from '../lib/schema.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { eq } from 'drizzle-orm'

const router = Router()

// GET /api/practitioner/settings - Get practitioner settings for current user
router.get('/settings', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const settings = await db
      .select()
      .from(practitionerSettings)
      .where(eq(practitionerSettings.userId, userId))
      .limit(1)

    if (settings.length === 0) {
      return res.json({
        success: true,
        settings: null,
        message: 'No settings found'
      })
    }

    res.json({
      success: true,
      settings: settings[0]
    })
  } catch (error) {
    console.error('Get practitioner settings error:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    })
  }
})

// PUT /api/practitioner/settings - Update or create practitioner settings
router.put('/settings', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const {
      cabinetAddress,
      cabinetPostalCode,
      cabinetCity,
      cabinetPhone,
      cabinetEmail,
      signatureImageUrl
    } = req.body

    // Validate required fields
    if (!cabinetAddress) {
      return res.status(400).json({
        success: false,
        error: 'L\'adresse du cabinet est requise'
      })
    }

    // Check if settings exist
    const existing = await db
      .select()
      .from(practitionerSettings)
      .where(eq(practitionerSettings.userId, userId))
      .limit(1)

    if (existing.length > 0) {
      // Update existing settings
      const updated = await db
        .update(practitionerSettings)
        .set({
          cabinetAddress,
          cabinetPostalCode,
          cabinetCity,
          cabinetPhone,
          cabinetEmail,
          signatureImageUrl,
          updatedAt: new Date()
        })
        .where(eq(practitionerSettings.userId, userId))
        .returning()

      res.json({
        success: true,
        settings: updated[0],
        message: 'Paramètres mis à jour avec succès'
      })
    } else {
      // Create new settings
      const created = await db
        .insert(practitionerSettings)
        .values({
          userId,
          cabinetAddress,
          cabinetPostalCode,
          cabinetCity,
          cabinetPhone,
          cabinetEmail,
          signatureImageUrl
        })
        .returning()

      res.json({
        success: true,
        settings: created[0],
        message: 'Paramètres créés avec succès'
      })
    }
  } catch (error) {
    console.error('Update practitioner settings error:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    })
  }
})

export default router
