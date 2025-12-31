import { Request, Response, NextFunction } from 'express'
import { db } from '../lib/db.js'
import { auditLogs } from '../lib/schema.js'
import { AuthRequest } from './auth.js'

// Tables contenant des données sensibles (HDS)
const SENSITIVE_TABLES = [
  'patients',
  'grossesses',
  'consultations',
  'examens_prenataux',
  'suivi_post_partum',
  'seances_reeducation',
  'consultations_gyneco',
]

// Actions qui doivent être auditées
const AUDITABLE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

interface AuditLogData {
  userId: string
  action: 'create' | 'update' | 'delete' | 'read' | 'export'
  tableName?: string
  recordId?: string
  oldData?: any
  newData?: any
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await db.insert(auditLogs).values({
      userId: data.userId,
      action: data.action,
      tableName: data.tableName,
      recordId: data.recordId,
      oldData: data.oldData,
      newData: data.newData,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    })
  } catch (error) {
    // Ne pas bloquer l'opération si l'audit échoue, mais logger l'erreur
    console.error('[AUDIT ERROR]', error)
  }
}

// Middleware pour logger automatiquement toutes les requêtes sensibles
export function auditMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const user = req.user

  if (!user) {
    // Si pas d'utilisateur authentifié, passer au middleware suivant
    return next()
  }

  // Capturer les informations de la requête
  const method = req.method
  const path = req.path
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip
  const userAgent = req.headers['user-agent']

  // Déterminer la table concernée depuis le path
  let tableName: string | undefined
  if (path.includes('/patients')) tableName = 'patients'
  else if (path.includes('/grossesses')) tableName = 'grossesses'
  else if (path.includes('/consultations')) tableName = 'consultations'
  else if (path.includes('/invoices')) tableName = 'invoices'
  else if (path.includes('/protocols')) tableName = 'protocols'

  // Logger les accès en lecture aux données sensibles
  if (method === 'GET' && tableName && SENSITIVE_TABLES.includes(tableName)) {
    // Extraire l'ID du record si présent dans l'URL
    const idMatch = path.match(/\/([a-f0-9-]{36})/)
    const recordId = idMatch ? idMatch[1] : undefined

    // Log asynchrone pour ne pas ralentir la requête
    setImmediate(async () => {
      await createAuditLog({
        userId: user.id,
        action: 'read',
        tableName,
        recordId,
        ipAddress,
        userAgent,
      })
    })
  }

  // Pour les modifications, on interceptera la réponse
  if (AUDITABLE_METHODS.includes(method) && tableName) {
    const originalJson = res.json.bind(res)

    res.json = function (body: any) {
      // Si la requête a réussi, logger l'action
      if (res.statusCode >= 200 && res.statusCode < 300) {
        let action: 'create' | 'update' | 'delete' | 'read' | 'export'
        if (method === 'POST') action = 'create'
        else if (method === 'PUT' || method === 'PATCH') action = 'update'
        else if (method === 'DELETE') action = 'delete'
        else action = 'read'

        // Extraire l'ID du record si présent
        const idMatch = path.match(/\/([a-f0-9-]{36})/)
        const recordId = idMatch ? idMatch[1] : body?.data?.id || body?.id

        // Log asynchrone
        setImmediate(async () => {
          await createAuditLog({
            userId: user.id,
            action,
            tableName,
            recordId,
            newData: method !== 'DELETE' ? { summary: `${action} on ${tableName}` } : undefined,
            ipAddress,
            userAgent,
          })
        })
      }

      return originalJson(body)
    }
  }

  next()
}

// Fonction utilitaire pour logger manuellement un accès à des données sensibles
export async function logSensitiveDataAccess(
  userId: string,
  action: 'read' | 'export',
  tableName: string,
  recordIds: string[],
  req: Request
) {
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip
  const userAgent = req.headers['user-agent']

  for (const recordId of recordIds) {
    await createAuditLog({
      userId,
      action,
      tableName,
      recordId,
      ipAddress,
      userAgent,
    })
  }
}

// Fonction pour exporter les logs d'audit (RGPD)
export async function exportAuditLogs(userId: string, startDate?: Date, endDate?: Date) {
  let query = db.query.auditLogs.findMany({
    where: (auditLogs, { eq, and, gte, lte }) => {
      const conditions = [eq(auditLogs.userId, userId)]

      if (startDate) {
        conditions.push(gte(auditLogs.createdAt, startDate))
      }

      if (endDate) {
        conditions.push(lte(auditLogs.createdAt, endDate))
      }

      return conditions.length > 1 ? and(...conditions) : conditions[0]
    },
    orderBy: (auditLogs, { desc }) => [desc(auditLogs.createdAt)],
  })

  return await query
}
