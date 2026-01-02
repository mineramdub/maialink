import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { alertes } from '../lib/schema.js'
import { eq, and, desc, isNull, sql } from 'drizzle-orm'
import { generateExamAlertes, generatePostPartumAlertes } from '../lib/alertes.js'

const router = Router()
router.use(authMiddleware)

// GET /api/alertes/count - Get count of active alertes
router.get('/count', async (req: AuthRequest, res) => {
  try {
    const result = await db
      .select({ value: sql<number>`count(*)` })
      .from(alertes)
      .where(
        and(
          eq(alertes.userId, req.user!.id),
          eq(alertes.isDismissed, false)
        )
      )

    res.json({ success: true, count: result[0]?.value || 0 })
  } catch (error) {
    console.error('Alert count error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/alertes - List all alertes for current user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { onlyUnread, patientId } = req.query

    let whereClause = eq(alertes.userId, req.user!.id)

    if (onlyUnread === 'true') {
      whereClause = and(whereClause, eq(alertes.isRead, false), eq(alertes.isDismissed, false))!
    }

    if (patientId) {
      whereClause = and(whereClause, eq(alertes.patientId, patientId as string))!
    }

    const result = await db.query.alertes.findMany({
      where: whereClause,
      with: {
        patient: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        grossesse: {
          columns: {
            id: true,
            ddr: true,
            dpa: true,
          },
        },
      },
      orderBy: [desc(alertes.createdAt)],
      limit: 50,
    })

    res.json({ success: true, alertes: result })
  } catch (error) {
    console.error('Get alertes error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/alertes/stats - Get alertes statistics
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const allAlertes = await db.query.alertes.findMany({
      where: eq(alertes.userId, req.user!.id),
    })

    const stats = {
      total: allAlertes.length,
      unread: allAlertes.filter((a) => !a.isRead && !a.isDismissed).length,
      byType: {} as Record<string, number>,
      bySeverity: {
        info: 0,
        warning: 0,
        urgent: 0,
      },
    }

    for (const alerte of allAlertes) {
      if (!alerte.isDismissed) {
        stats.byType[alerte.type] = (stats.byType[alerte.type] || 0) + 1
        stats.bySeverity[alerte.severity]++
      }
    }

    res.json({ success: true, stats })
  } catch (error) {
    console.error('Get alertes stats error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/alertes - Create a manual alerte
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { patientId, grossesseId, type, message, severity } = req.body

    if (!patientId || !message) {
      return res.status(400).json({ error: 'PatientId et message requis' })
    }

    const [newAlerte] = await db
      .insert(alertes)
      .values({
        patientId,
        grossesseId: grossesseId || null,
        userId: req.user!.id,
        type: type || 'tache_manuelle',
        message,
        severity: severity || 'info',
      })
      .returning()

    res.json({ success: true, alerte: newAlerte })
  } catch (error) {
    console.error('Create alerte error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/alertes/generate - Generate new alertes
router.post('/generate', async (req: AuthRequest, res) => {
  try {
    const examCount = await generateExamAlertes(req.user!.id)
    const postPartumCount = await generatePostPartumAlertes(req.user!.id)

    res.json({
      success: true,
      generated: {
        examAlertes: examCount,
        postPartumAlertes: postPartumCount,
        total: examCount + postPartumCount,
      },
    })
  } catch (error) {
    console.error('Generate alertes error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PATCH /api/alertes/:id/read - Mark alerte as read
router.patch('/:id/read', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const [updatedAlerte] = await db
      .update(alertes)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(and(eq(alertes.id, id), eq(alertes.userId, req.user!.id)))
      .returning()

    if (!updatedAlerte) {
      return res.status(404).json({ error: 'Alerte non trouvée' })
    }

    res.json({ success: true, alerte: updatedAlerte })
  } catch (error) {
    console.error('Mark alerte read error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PATCH /api/alertes/:id/dismiss - Dismiss alerte
router.patch('/:id/dismiss', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const [updatedAlerte] = await db
      .update(alertes)
      .set({
        isDismissed: true,
        dismissedAt: new Date(),
      })
      .where(and(eq(alertes.id, id), eq(alertes.userId, req.user!.id)))
      .returning()

    if (!updatedAlerte) {
      return res.status(404).json({ error: 'Alerte non trouvée' })
    }

    res.json({ success: true, alerte: updatedAlerte })
  } catch (error) {
    console.error('Dismiss alerte error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/alertes/read-all - Mark all alertes as read
router.post('/read-all', async (req: AuthRequest, res) => {
  try {
    await db
      .update(alertes)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(and(eq(alertes.userId, req.user!.id), eq(alertes.isRead, false)))

    res.json({ success: true })
  } catch (error) {
    console.error('Mark all read error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
