import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { db } from './db.js'
import { sharedAccess, sharedAccessLogs, patients, grossesses, documents } from './schema.js'
import { eq, and } from 'drizzle-orm'

// Types
export interface CreateShareOptions {
  userId: string
  shareType: 'patient' | 'grossesse' | 'documents' | 'synthetic_pdf'
  patientId?: string
  grossesseId?: string
  documentIds?: string[]
  permissions: {
    read: boolean
    write: boolean
    download: boolean
  }
  recipientName?: string
  recipientEmail?: string
  recipientNote?: string
  expiresAt?: Date
  maxAccessCount?: number
}

export interface ShareSession {
  shareId: string
  shareToken: string
  shareType: 'patient' | 'grossesse' | 'documents' | 'synthetic_pdf'
  permissions: {
    read: boolean
    write: boolean
    download: boolean
  }
  patientId?: string
  grossesseId?: string
  documentIds?: string[]
  userId: string
}

// Session storage (in-memory for now, could be Redis in production)
const activeSessions = new Map<string, ShareSession>()

export class ShareService {
  /**
   * Generate a secure share token (URL-safe, 43 characters, 256-bit entropy)
   */
  static generateShareToken(): string {
    return crypto.randomBytes(32).toString('base64url')
  }

  /**
   * Generate a 6-digit access code
   */
  static generateAccessCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Generate a session token for authenticated access
   */
  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('base64url')
  }

  /**
   * Create a new share
   */
  static async createShare(options: CreateShareOptions): Promise<{
    share: any
    accessCode: string
    shareUrl: string
  }> {
    // Validation
    if (options.shareType === 'patient' && !options.patientId) {
      throw new Error('patientId is required for patient share type')
    }
    if (options.shareType === 'grossesse' && !options.grossesseId) {
      throw new Error('grossesseId is required for grossesse share type')
    }
    if ((options.shareType === 'documents' || options.shareType === 'synthetic_pdf') && !options.documentIds?.length) {
      throw new Error('documentIds is required for documents/synthetic_pdf share type')
    }

    // Verify resources belong to user
    if (options.patientId) {
      const patient = await db.query.patients.findFirst({
        where: and(
          eq(patients.id, options.patientId),
          eq(patients.userId, options.userId)
        )
      })
      if (!patient) {
        throw new Error('Patient not found or does not belong to user')
      }
    }

    if (options.grossesseId) {
      const grossesse = await db.query.grossesses.findFirst({
        where: and(
          eq(grossesses.id, options.grossesseId),
          eq(grossesses.userId, options.userId)
        )
      })
      if (!grossesse) {
        throw new Error('Grossesse not found or does not belong to user')
      }
    }

    // Generate tokens
    const shareToken = this.generateShareToken()
    const accessCode = this.generateAccessCode()
    const accessCodeHash = await bcrypt.hash(accessCode, 10)

    // Create share
    const [share] = await db.insert(sharedAccess).values({
      userId: options.userId,
      shareType: options.shareType,
      patientId: options.patientId || null,
      grossesseId: options.grossesseId || null,
      documentIds: options.documentIds || null,
      shareToken,
      accessCodeHash,
      permissions: options.permissions,
      recipientName: options.recipientName || null,
      recipientEmail: options.recipientEmail || null,
      recipientNote: options.recipientNote || null,
      expiresAt: options.expiresAt || null,
      maxAccessCount: options.maxAccessCount || null,
      isActive: true,
      currentAccessCount: 0,
      failedAttemptsCount: 0,
    }).returning()

    // Generate share URL (will be set by frontend, but provide base)
    const shareUrl = `/shared/${shareToken}`

    return {
      share,
      accessCode, // IMPORTANT: Only returned once here
      shareUrl,
    }
  }

  /**
   * Verify access code with anti-brute-force protection
   */
  static async verifyAccessCode(
    token: string,
    accessCode: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; sessionToken?: string; error?: string; share?: any }> {
    // Find share by token
    const share = await db.query.sharedAccess.findFirst({
      where: eq(sharedAccess.shareToken, token)
    })

    if (!share) {
      return { success: false, error: 'Lien de partage invalide' }
    }

    // Check if share is active
    if (!share.isActive) {
      await this.logShareAction(share.id, 'access_denied', null, null, ipAddress, userAgent)
      return { success: false, error: 'Ce partage a été révoqué' }
    }

    // Check if expired
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      await this.logShareAction(share.id, 'access_denied', null, null, ipAddress, userAgent)
      return { success: false, error: 'Ce lien de partage a expiré' }
    }

    // Check if locked due to failed attempts
    if (share.lockedUntil && new Date(share.lockedUntil) > new Date()) {
      await this.logShareAction(share.id, 'access_denied', null, null, ipAddress, userAgent)
      const minutesRemaining = Math.ceil((new Date(share.lockedUntil).getTime() - Date.now()) / 60000)
      return {
        success: false,
        error: `Trop de tentatives échouées. Verrouillé pendant ${minutesRemaining} minute(s)`
      }
    }

    // Check max access count
    if (share.maxAccessCount && share.currentAccessCount >= share.maxAccessCount) {
      await this.logShareAction(share.id, 'access_denied', null, null, ipAddress, userAgent)
      return { success: false, error: 'Nombre maximum d\'accès atteint' }
    }

    // Verify access code
    const isValidCode = await bcrypt.compare(accessCode, share.accessCodeHash)

    if (!isValidCode) {
      // Increment failed attempts
      const newFailedCount = share.failedAttemptsCount + 1
      const updateData: any = {
        failedAttemptsCount: newFailedCount,
      }

      // Lock after 5 failed attempts
      if (newFailedCount >= 5) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        updateData.lockedUntil = lockUntil
      }

      await db.update(sharedAccess)
        .set(updateData)
        .where(eq(sharedAccess.id, share.id))

      await this.logShareAction(share.id, 'access_denied', null, null, ipAddress, userAgent)

      return {
        success: false,
        error: newFailedCount >= 5
          ? 'Trop de tentatives échouées. Verrouillé pendant 15 minutes.'
          : `Code d'accès incorrect (${newFailedCount}/5 tentatives)`
      }
    }

    // Success - Reset failed attempts and create session
    await db.update(sharedAccess)
      .set({
        failedAttemptsCount: 0,
        lockedUntil: null,
        lastAccessAt: new Date(),
        currentAccessCount: share.currentAccessCount + 1,
      })
      .where(eq(sharedAccess.id, share.id))

    // Create session
    const sessionToken = this.generateSessionToken()
    const session: ShareSession = {
      shareId: share.id,
      shareToken: token,
      shareType: share.shareType as any,
      permissions: share.permissions as any,
      patientId: share.patientId || undefined,
      grossesseId: share.grossesseId || undefined,
      documentIds: (share.documentIds as string[]) || undefined,
      userId: share.userId,
    }
    activeSessions.set(sessionToken, session)

    // Set session expiration (24 hours)
    setTimeout(() => {
      activeSessions.delete(sessionToken)
    }, 24 * 60 * 60 * 1000)

    await this.logShareAction(share.id, 'access_granted', null, null, ipAddress, userAgent)

    return {
      success: true,
      sessionToken,
      share,
    }
  }

  /**
   * Validate session token
   */
  static async validateSession(shareToken: string, sessionToken: string): Promise<ShareSession | null> {
    const session = activeSessions.get(sessionToken)

    if (!session || session.shareToken !== shareToken) {
      return null
    }

    // Verify share is still active
    const share = await db.query.sharedAccess.findFirst({
      where: eq(sharedAccess.shareToken, shareToken)
    })

    if (!share || !share.isActive) {
      activeSessions.delete(sessionToken)
      return null
    }

    // Check expiration
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      activeSessions.delete(sessionToken)
      return null
    }

    return session
  }

  /**
   * Get shared data based on share type
   */
  static async getSharedData(shareToken: string, sessionToken: string): Promise<any> {
    const session = await this.validateSession(shareToken, sessionToken)

    if (!session) {
      throw new Error('Session invalide ou expirée')
    }

    if (!session.permissions.read) {
      throw new Error('Permission de lecture non accordée')
    }

    let data: any = {}

    switch (session.shareType) {
      case 'patient': {
        if (!session.patientId) {
          throw new Error('Patient ID manquant')
        }

        const patient = await db.query.patients.findFirst({
          where: eq(patients.id, session.patientId),
          with: {
            grossesses: {
              with: {
                bebes: true,
                examens: true,
                consultations: {
                  orderBy: (consultations, { desc }) => [desc(consultations.date)],
                },
              },
            },
            documents: true,
            consultations: {
              orderBy: (consultations, { desc }) => [desc(consultations.date)],
            },
          },
        })

        if (!patient) {
          throw new Error('Patiente non trouvée')
        }

        data = patient

        // Log data read
        await this.logShareAction(
          session.shareId,
          'data_read',
          'patient',
          session.patientId
        )
        break
      }

      case 'grossesse': {
        if (!session.grossesseId) {
          throw new Error('Grossesse ID manquant')
        }

        const grossesse = await db.query.grossesses.findFirst({
          where: eq(grossesses.id, session.grossesseId),
          with: {
            patient: true,
            bebes: true,
            examens: {
              orderBy: (examens, { asc }) => [asc(examens.saPrevue)],
            },
            consultations: {
              orderBy: (consultations, { desc }) => [desc(consultations.date)],
            },
            suiviPostPartum: {
              orderBy: (suivi, { desc }) => [desc(suivi.date)],
            },
          },
        })

        if (!grossesse) {
          throw new Error('Grossesse non trouvée')
        }

        data = grossesse

        // Log data read
        await this.logShareAction(
          session.shareId,
          'data_read',
          'grossesse',
          session.grossesseId
        )
        break
      }

      case 'documents':
      case 'synthetic_pdf': {
        if (!session.documentIds?.length) {
          throw new Error('Document IDs manquants')
        }

        // Get documents
        const docs = await db.query.documents.findMany({
          where: (documents, { inArray }) => inArray(documents.id, session.documentIds!)
        })

        data = { documents: docs }

        // Log data read
        await this.logShareAction(
          session.shareId,
          'data_read',
          'documents',
          session.documentIds.join(',')
        )
        break
      }

      default:
        throw new Error('Type de partage non supporté')
    }

    return data
  }

  /**
   * Update shared data (if write permission granted)
   */
  static async updateSharedData(
    shareToken: string,
    sessionToken: string,
    resourceType: string,
    resourceId: string,
    newData: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<any> {
    const session = await this.validateSession(shareToken, sessionToken)

    if (!session) {
      throw new Error('Session invalide ou expirée')
    }

    if (!session.permissions.write) {
      throw new Error('Permission d\'écriture non accordée')
    }

    // Get old data for audit
    let oldData: any = null
    let updatedRecord: any = null

    // Handle different resource types
    // This is a simplified version - extend based on what data can be modified
    switch (resourceType) {
      case 'consultation': {
        const { consultations } = await import('./schema.js')

        // Get old data
        const oldConsultation = await db.query.consultations.findFirst({
          where: (consultations, { eq }) => eq(consultations.id, resourceId)
        })

        if (!oldConsultation) {
          throw new Error('Consultation non trouvée')
        }

        oldData = oldConsultation

        // Update
        const [updated] = await db.update(consultations)
          .set({
            ...newData,
            updatedAt: new Date(),
          })
          .where(eq(consultations.id, resourceId))
          .returning()

        updatedRecord = updated
        break
      }

      case 'examen': {
        const { examensPrenataux } = await import('./schema.js')

        const oldExamen = await db.query.examensPrenataux.findFirst({
          where: (examens, { eq }) => eq(examens.id, resourceId)
        })

        if (!oldExamen) {
          throw new Error('Examen non trouvé')
        }

        oldData = oldExamen

        const [updated] = await db.update(examensPrenataux)
          .set({
            ...newData,
          })
          .where(eq(examensPrenataux.id, resourceId))
          .returning()

        updatedRecord = updated
        break
      }

      default:
        throw new Error(`Type de ressource non supporté: ${resourceType}`)
    }

    // Log modification
    await this.logShareAction(
      session.shareId,
      'data_modified',
      resourceType,
      resourceId,
      ipAddress,
      userAgent,
      oldData,
      updatedRecord
    )

    return updatedRecord
  }

  /**
   * Revoke a share
   */
  static async revokeShare(
    shareId: string,
    userId: string,
    reason?: string
  ): Promise<void> {
    const share = await db.query.sharedAccess.findFirst({
      where: eq(sharedAccess.id, shareId)
    })

    if (!share) {
      throw new Error('Partage non trouvé')
    }

    if (share.userId !== userId) {
      throw new Error('Non autorisé à révoquer ce partage')
    }

    await db.update(sharedAccess)
      .set({
        isActive: false,
        revokedAt: new Date(),
        revokedBy: userId,
        revocationReason: reason || null,
        updatedAt: new Date(),
      })
      .where(eq(sharedAccess.id, shareId))

    // Log revocation
    await this.logShareAction(shareId, 'revoked', null, null)

    // Invalidate all sessions for this share
    for (const [sessionToken, session] of activeSessions.entries()) {
      if (session.shareId === shareId) {
        activeSessions.delete(sessionToken)
      }
    }
  }

  /**
   * Get share by ID
   */
  static async getShareById(shareId: string, userId: string): Promise<any> {
    const share = await db.query.sharedAccess.findFirst({
      where: and(
        eq(sharedAccess.id, shareId),
        eq(sharedAccess.userId, userId)
      ),
      with: {
        patient: true,
        grossesse: {
          with: {
            patient: true,
          },
        },
      },
    })

    if (!share) {
      throw new Error('Partage non trouvé')
    }

    return share
  }

  /**
   * List all shares for a user
   */
  static async listShares(userId: string, activeOnly: boolean = false): Promise<any[]> {
    const shares = await db.query.sharedAccess.findMany({
      where: activeOnly
        ? and(eq(sharedAccess.userId, userId), eq(sharedAccess.isActive, true))
        : eq(sharedAccess.userId, userId),
      with: {
        patient: true,
        grossesse: {
          with: {
            patient: true,
          },
        },
      },
      orderBy: (sharedAccess, { desc }) => [desc(sharedAccess.createdAt)],
    })

    return shares
  }

  /**
   * Get access logs for a share
   */
  static async getShareLogs(shareId: string, userId: string): Promise<any[]> {
    // Verify user owns this share
    const share = await db.query.sharedAccess.findFirst({
      where: and(
        eq(sharedAccess.id, shareId),
        eq(sharedAccess.userId, userId)
      )
    })

    if (!share) {
      throw new Error('Partage non trouvé ou non autorisé')
    }

    const logs = await db.query.sharedAccessLogs.findMany({
      where: eq(sharedAccessLogs.sharedAccessId, shareId),
      orderBy: (logs, { desc }) => [desc(logs.createdAt)],
    })

    return logs
  }

  /**
   * Log a share action
   */
  private static async logShareAction(
    sharedAccessId: string,
    action: 'access_granted' | 'access_denied' | 'data_read' | 'data_modified' | 'revoked',
    resourceType?: string | null,
    resourceId?: string | null,
    ipAddress?: string,
    userAgent?: string,
    oldData?: any,
    newData?: any
  ): Promise<void> {
    await db.insert(sharedAccessLogs).values({
      sharedAccessId,
      action,
      resourceType: resourceType || null,
      resourceId: resourceId || null,
      oldData: oldData || null,
      newData: newData || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    })
  }
}
