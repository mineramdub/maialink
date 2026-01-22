import { Request, Response, NextFunction } from 'express'
import { ShareService, ShareSession } from '../lib/share-service.js'

// Extend Express Request type to include share session
export interface ShareRequest extends Request {
  share?: ShareSession
  shareToken?: string
  sessionToken?: string
}

/**
 * Middleware to authenticate shared access requests
 * Validates the session token and attaches share context to request
 */
export async function shareAuthMiddleware(
  req: ShareRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract tokens
    const shareToken = req.params.token || req.query.token as string
    const sessionToken = req.headers['x-share-session'] as string

    if (!shareToken) {
      res.status(401).json({ error: 'Token de partage manquant' })
      return
    }

    if (!sessionToken) {
      res.status(401).json({ error: 'Session non authentifiée' })
      return
    }

    // Validate session
    const session = await ShareService.validateSession(shareToken, sessionToken)

    if (!session) {
      res.status(401).json({ error: 'Session invalide ou expirée' })
      return
    }

    // Attach to request
    req.share = session
    req.shareToken = shareToken
    req.sessionToken = sessionToken

    next()
  } catch (error) {
    console.error('Share auth error:', error)
    res.status(500).json({ error: 'Erreur d\'authentification' })
  }
}

/**
 * Middleware to require read permission
 */
export function requireReadPermission(
  req: ShareRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.share) {
    res.status(401).json({ error: 'Authentification requise' })
    return
  }

  if (!req.share.permissions.read) {
    res.status(403).json({ error: 'Permission de lecture non accordée' })
    return
  }

  next()
}

/**
 * Middleware to require write permission
 */
export function requireWritePermission(
  req: ShareRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.share) {
    res.status(401).json({ error: 'Authentification requise' })
    return
  }

  if (!req.share.permissions.write) {
    res.status(403).json({ error: 'Permission d\'écriture non accordée' })
    return
  }

  next()
}

/**
 * Middleware to require download permission
 */
export function requireDownloadPermission(
  req: ShareRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.share) {
    res.status(401).json({ error: 'Authentification requise' })
    return
  }

  if (!req.share.permissions.download) {
    res.status(403).json({ error: 'Permission de téléchargement non accordée' })
    return
  }

  next()
}

/**
 * Helper to extract IP address from request
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  return req.ip || req.socket.remoteAddress || 'unknown'
}

/**
 * Helper to extract User-Agent from request
 */
export function getUserAgent(req: Request): string {
  return req.headers['user-agent'] || 'unknown'
}
