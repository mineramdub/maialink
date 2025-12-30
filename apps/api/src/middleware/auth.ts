import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../lib/db.js'
import { sessions, users } from '../lib/schema.js'
import { eq, and, gt } from 'drizzle-orm'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    rpps?: string | null
    adeli?: string | null
  }
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.auth_token

  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' })
  }

  try {
    // Validate session
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      ),
    })

    if (!session) {
      return res.status(401).json({ error: 'Session expirée' })
    }

    const user = await db.query.users.findFirst({
      where: and(
        eq(users.id, session.userId),
        eq(users.isActive, true)
      ),
    })

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur introuvable' })
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      rpps: user.rpps,
      adeli: user.adeli,
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
