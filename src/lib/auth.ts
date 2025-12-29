import { db } from './db'
import { users, sessions, auditLogs } from './schema'
import { eq, and, gt } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 heures

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'sage_femme' | 'secretaire'
  rpps?: string | null
  adeli?: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch {
    return null
  }
}

export async function createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
  const token = generateToken({ id: userId })
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await db.insert(sessions).values({
    userId,
    token,
    ipAddress,
    userAgent,
    expiresAt,
  })

  // Audit log
  await db.insert(auditLogs).values({
    userId,
    action: 'login',
    ipAddress,
    userAgent,
  })

  return token
}

export async function validateSession(token: string): Promise<AuthUser | null> {
  const session = await db.query.sessions.findFirst({
    where: and(
      eq(sessions.token, token),
      gt(sessions.expiresAt, new Date())
    ),
  })

  if (!session) return null

  const user = await db.query.users.findFirst({
    where: and(
      eq(users.id, session.userId),
      eq(users.isActive, true)
    ),
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    rpps: user.rpps,
    adeli: user.adeli,
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return null

  return validateSession(token)
}

export async function logout(token: string): Promise<void> {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
  })

  if (session) {
    await db.delete(sessions).where(eq(sessions.token, token))

    await db.insert(auditLogs).values({
      userId: session.userId,
      action: 'logout',
    })
  }
}

export async function registerUser(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  rpps?: string
  adeli?: string
}): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email.toLowerCase()),
    })

    if (existingUser) {
      return { success: false, error: 'Un compte existe déjà avec cet email' }
    }

    const passwordHash = await hashPassword(data.password)

    const [newUser] = await db.insert(users).values({
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      rpps: data.rpps,
      adeli: data.adeli,
    }).returning()

    await db.insert(auditLogs).values({
      userId: newUser.id,
      action: 'create',
      tableName: 'users',
      recordId: newUser.id,
    })

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        rpps: newUser.rpps,
        adeli: newUser.adeli,
      },
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Erreur lors de l\'inscription' }
  }
}

export async function loginUser(
  email: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; error?: string; token?: string; user?: AuthUser }> {
  try {
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.email, email.toLowerCase()),
        eq(users.isActive, true)
      ),
    })

    if (!user) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }

    const validPassword = await verifyPassword(password, user.passwordHash)

    if (!validPassword) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }

    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id))

    const token = await createSession(user.id, ipAddress, userAgent)

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        rpps: user.rpps,
        adeli: user.adeli,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Erreur lors de la connexion' }
  }
}
