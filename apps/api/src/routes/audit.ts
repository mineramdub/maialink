import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { auditLogs } from '../lib/schema.js'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { exportAuditLogs } from '../middleware/audit.js'

const router = Router()
router.use(authMiddleware)

// Middleware pour vérifier que l'utilisateur est admin
const adminOnly = (req: AuthRequest, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé - Admin uniquement' })
  }
  next()
}

// GET /api/audit - Liste tous les logs d'audit (admin uniquement)
router.get('/', adminOnly, async (req: AuthRequest, res) => {
  try {
    const { userId, tableName, action, startDate, endDate, limit = 100 } = req.query

    let whereConditions: any[] = []

    if (userId) {
      whereConditions.push(eq(auditLogs.userId, userId as string))
    }

    if (tableName) {
      whereConditions.push(eq(auditLogs.tableName, tableName as string))
    }

    if (action) {
      whereConditions.push(eq(auditLogs.action, action as any))
    }

    if (startDate) {
      whereConditions.push(gte(auditLogs.createdAt, new Date(startDate as string)))
    }

    if (endDate) {
      whereConditions.push(lte(auditLogs.createdAt, new Date(endDate as string)))
    }

    const logs = await db.query.auditLogs.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: [desc(auditLogs.createdAt)],
      limit: parseInt(limit as string),
    })

    res.json({ success: true, logs, total: logs.length })
  } catch (error) {
    console.error('Get audit logs error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/audit/stats - Statistiques des logs d'audit
router.get('/stats', adminOnly, async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query

    let whereConditions: any[] = []

    if (startDate) {
      whereConditions.push(gte(auditLogs.createdAt, new Date(startDate as string)))
    }

    if (endDate) {
      whereConditions.push(lte(auditLogs.createdAt, new Date(endDate as string)))
    }

    const logs = await db.query.auditLogs.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    })

    const stats = {
      total: logs.length,
      byAction: {} as Record<string, number>,
      byTable: {} as Record<string, number>,
      byUser: {} as Record<string, number>,
      byDay: {} as Record<string, number>,
    }

    logs.forEach((log) => {
      // Par action
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1

      // Par table
      if (log.tableName) {
        stats.byTable[log.tableName] = (stats.byTable[log.tableName] || 0) + 1
      }

      // Par utilisateur
      stats.byUser[log.userId] = (stats.byUser[log.userId] || 0) + 1

      // Par jour
      const day = log.createdAt.toISOString().split('T')[0]
      stats.byDay[day] = (stats.byDay[day] || 0) + 1
    })

    res.json({ success: true, stats })
  } catch (error) {
    console.error('Get audit stats error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/audit/my-data - Export des logs pour l'utilisateur connecté (RGPD)
router.get('/my-data', async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query

    const logs = await exportAuditLogs(
      req.user!.id,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    )

    res.json({
      success: true,
      logs,
      exportDate: new Date().toISOString(),
      userId: req.user!.id,
      userEmail: req.user!.email,
      note: 'Export conforme RGPD - Article 15 (Droit d\'accès)',
    })
  } catch (error) {
    console.error('Export my data error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/audit/sensitive-access/:recordId - Voir tous les accès à un dossier sensible
router.get('/sensitive-access/:recordId', adminOnly, async (req: AuthRequest, res) => {
  try {
    const { recordId } = req.params

    const logs = await db.query.auditLogs.findMany({
      where: eq(auditLogs.recordId, recordId),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: [desc(auditLogs.createdAt)],
    })

    res.json({ success: true, logs, recordId })
  } catch (error) {
    console.error('Get sensitive access logs error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
