import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { shareAuthMiddleware, requireWritePermission, requireDownloadPermission, ShareRequest, getClientIp, getUserAgent } from '../middleware/share-auth.js'
import { ShareService } from '../lib/share-service.js'
import { db } from '../lib/db.js'
import { auditLogs } from '../lib/schema.js'
import { shareCreationLimiter, shareAccessLimiter, sharedDataLimiter } from '../middleware/rate-limit.js'

const router = Router()

// ============================================================================
// AUTHENTICATED ROUTES - For practitioners (/api/share)
// ============================================================================

/**
 * POST /api/share/create - Create a new share
 */
router.post('/create', authMiddleware, shareCreationLimiter, async (req: AuthRequest, res) => {
  try {
    const {
      shareType,
      patientId,
      grossesseId,
      documentIds,
      permissions,
      recipientName,
      recipientEmail,
      recipientNote,
      expiresAt,
      maxAccessCount,
    } = req.body

    // Validation
    if (!shareType || !['patient', 'grossesse', 'documents', 'synthetic_pdf'].includes(shareType)) {
      return res.status(400).json({ error: 'Type de partage invalide' })
    }

    if (!permissions || typeof permissions.read !== 'boolean' || typeof permissions.write !== 'boolean' || typeof permissions.download !== 'boolean') {
      return res.status(400).json({ error: 'Permissions invalides' })
    }

    // Create share
    const result = await ShareService.createShare({
      userId: req.user!.id,
      shareType,
      patientId,
      grossesseId,
      documentIds,
      permissions,
      recipientName,
      recipientEmail,
      recipientNote,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      maxAccessCount,
    })

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'create',
      tableName: 'shared_access',
      recordId: result.share.id,
      newData: result.share,
    })

    res.json({
      success: true,
      share: result.share,
      accessCode: result.accessCode, // IMPORTANT: Only returned once
      shareUrl: result.shareUrl,
    })
  } catch (error) {
    console.error('Create share error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' })
  }
})

/**
 * GET /api/share/list - List all shares for the authenticated user
 */
router.get('/list', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const activeOnly = req.query.active === 'true'

    const shares = await ShareService.listShares(req.user!.id, activeOnly)

    res.json({
      success: true,
      shares,
    })
  } catch (error) {
    console.error('List shares error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

/**
 * GET /api/share/:shareId - Get share details
 */
router.get('/:shareId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { shareId } = req.params

    const share = await ShareService.getShareById(shareId, req.user!.id)

    res.json({
      success: true,
      share,
    })
  } catch (error) {
    console.error('Get share error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' })
  }
})

/**
 * PATCH /api/share/:shareId - Update share parameters
 */
router.patch('/:shareId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { shareId } = req.params
    const {
      permissions,
      recipientName,
      recipientEmail,
      recipientNote,
      expiresAt,
      maxAccessCount,
    } = req.body

    // Get old share for audit
    const oldShare = await ShareService.getShareById(shareId, req.user!.id)

    // Update (implement in ShareService if needed, or do directly here)
    const { sharedAccess } = await import('../lib/schema.js')
    const { eq, and } = await import('drizzle-orm')

    const updateData: any = {}
    if (permissions !== undefined) updateData.permissions = permissions
    if (recipientName !== undefined) updateData.recipientName = recipientName
    if (recipientEmail !== undefined) updateData.recipientEmail = recipientEmail
    if (recipientNote !== undefined) updateData.recipientNote = recipientNote
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null
    if (maxAccessCount !== undefined) updateData.maxAccessCount = maxAccessCount
    updateData.updatedAt = new Date()

    const [updatedShare] = await db.update(sharedAccess)
      .set(updateData)
      .where(and(eq(sharedAccess.id, shareId), eq(sharedAccess.userId, req.user!.id)))
      .returning()

    if (!updatedShare) {
      return res.status(404).json({ error: 'Partage non trouvé' })
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'update',
      tableName: 'shared_access',
      recordId: shareId,
      oldData: oldShare,
      newData: updatedShare,
    })

    res.json({
      success: true,
      share: updatedShare,
    })
  } catch (error) {
    console.error('Update share error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' })
  }
})

/**
 * POST /api/share/:shareId/revoke - Revoke a share
 */
router.post('/:shareId/revoke', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { shareId } = req.params
    const { reason } = req.body

    await ShareService.revokeShare(shareId, req.user!.id, reason)

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'delete',
      tableName: 'shared_access',
      recordId: shareId,
      newData: { revoked: true, reason },
    })

    res.json({
      success: true,
      message: 'Partage révoqué avec succès',
    })
  } catch (error) {
    console.error('Revoke share error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' })
  }
})

/**
 * GET /api/share/:shareId/logs - Get access logs for a share
 */
router.get('/:shareId/logs', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { shareId } = req.params

    const logs = await ShareService.getShareLogs(shareId, req.user!.id)

    res.json({
      success: true,
      logs,
    })
  } catch (error) {
    console.error('Get share logs error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' })
  }
})

// ============================================================================
// PUBLIC ROUTES - For recipients (/api/shared)
// ============================================================================

/**
 * POST /api/shared/:token/verify - Verify access code and create session
 */
router.post('/shared/:token/verify', shareAccessLimiter, async (req, res) => {
  try {
    const { token } = req.params
    const { accessCode } = req.body

    if (!accessCode) {
      return res.status(400).json({ error: 'Code d\'accès requis' })
    }

    const ipAddress = getClientIp(req)
    const userAgent = getUserAgent(req)

    const result = await ShareService.verifyAccessCode(token, accessCode, ipAddress, userAgent)

    if (!result.success) {
      return res.status(401).json({ error: result.error })
    }

    res.json({
      success: true,
      sessionToken: result.sessionToken,
      share: {
        shareType: result.share.shareType,
        permissions: result.share.permissions,
        recipientName: result.share.recipientName,
      },
    })
  } catch (error) {
    console.error('Verify access code error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

/**
 * GET /api/shared/:token/data - Get shared data
 */
router.get('/shared/:token/data', sharedDataLimiter, shareAuthMiddleware, async (req: ShareRequest, res) => {
  try {
    const { token } = req.params
    const sessionToken = req.headers['x-share-session'] as string

    const data = await ShareService.getSharedData(token, sessionToken)

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Get shared data error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' })
  }
})

/**
 * POST /api/shared/:token/data - Update shared data (requires write permission)
 */
router.post('/shared/:token/data', sharedDataLimiter, shareAuthMiddleware, requireWritePermission, async (req: ShareRequest, res) => {
  try {
    const { token } = req.params
    const sessionToken = req.headers['x-share-session'] as string
    const { resourceType, resourceId, data } = req.body

    if (!resourceType || !resourceId || !data) {
      return res.status(400).json({ error: 'resourceType, resourceId, et data sont requis' })
    }

    const ipAddress = getClientIp(req)
    const userAgent = getUserAgent(req)

    const updatedData = await ShareService.updateSharedData(
      token,
      sessionToken,
      resourceType,
      resourceId,
      data,
      ipAddress,
      userAgent
    )

    res.json({
      success: true,
      data: updatedData,
    })
  } catch (error) {
    console.error('Update shared data error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' })
  }
})

/**
 * GET /api/shared/:token/pdf - Download synthetic PDF (requires download permission)
 */
router.get('/shared/:token/pdf', shareAuthMiddleware, requireDownloadPermission, async (req: ShareRequest, res) => {
  try {
    // TODO: Implement PDF generation in Phase 5
    // For now, return a placeholder response
    res.status(501).json({ error: 'Génération PDF non encore implémentée (Phase 5)' })
  } catch (error) {
    console.error('Get PDF error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

/**
 * DELETE /api/shared/:token/session - End session
 */
router.delete('/shared/:token/session', shareAuthMiddleware, async (req: ShareRequest, res) => {
  try {
    // Session invalidation is handled by not storing it anymore
    // In production, you'd delete it from Redis or session store
    // For now, just return success (session will expire after 24h anyway)

    res.json({
      success: true,
      message: 'Session terminée',
    })
  } catch (error) {
    console.error('End session error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
