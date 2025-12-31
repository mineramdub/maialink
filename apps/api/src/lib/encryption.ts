import crypto from 'crypto'

// Clé de chiffrement (DOIT être stockée dans une variable d'environnement sécurisée)
// Pour HDS, utiliser un gestionnaire de secrets comme AWS Secrets Manager, Azure Key Vault, etc.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-me-in-production-must-be-32-chars!!'
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

// Génère une clé de chiffrement valide depuis une chaîne
function getEncryptionKey(): Buffer {
  return crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
}

/**
 * Chiffre une donnée sensible avec AES-256-GCM
 * @param text Texte à chiffrer
 * @returns Texte chiffré au format: iv:authTag:encryptedData (base64)
 */
export function encrypt(text: string | null | undefined): string | null {
  if (!text) return null

  try {
    const iv = crypto.randomBytes(IV_LENGTH)
    const key = getEncryptionKey()
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    const authTag = cipher.getAuthTag()

    // Format: iv:authTag:encryptedData
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`
  } catch (error) {
    console.error('[ENCRYPTION ERROR]', error)
    throw new Error('Erreur de chiffrement')
  }
}

/**
 * Déchiffre une donnée chiffrée avec AES-256-GCM
 * @param encryptedText Texte chiffré au format: iv:authTag:encryptedData
 * @returns Texte déchiffré
 */
export function decrypt(encryptedText: string | null | undefined): string | null {
  if (!encryptedText) return null

  try {
    const parts = encryptedText.split(':')
    if (parts.length !== 3) {
      throw new Error('Format de données chiffrées invalide')
    }

    const iv = Buffer.from(parts[0], 'base64')
    const authTag = Buffer.from(parts[1], 'base64')
    const encrypted = parts[2]

    const key = getEncryptionKey()
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('[DECRYPTION ERROR]', error)
    throw new Error('Erreur de déchiffrement')
  }
}

/**
 * Champs sensibles à chiffrer selon les recommandations HDS
 */
export const SENSITIVE_FIELDS = {
  patients: ['notes', 'antecedentsMedicaux', 'antecedentsFamiliaux', 'allergies'],
  consultations: ['motif', 'examenClinique', 'conclusion', 'notes'],
  grossesses: ['notes', 'facteursRisque'],
  consultationsGyneco: ['motif', 'observations', 'traitement'],
  seanc esReeducation: ['observations', 'evolution'],
  suiviPostPartum: ['observations', 'notes'],
}

/**
 * Chiffre automatiquement les champs sensibles d'un objet
 * @param data Objet contenant des données
 * @param tableName Nom de la table pour identifier les champs à chiffrer
 */
export function encryptSensitiveFields<T extends Record<string, any>>(
  data: T,
  tableName: keyof typeof SENSITIVE_FIELDS
): T {
  const fieldsToEncrypt = SENSITIVE_FIELDS[tableName]
  if (!fieldsToEncrypt) return data

  const encrypted = { ...data }

  for (const field of fieldsToEncrypt) {
    if (encrypted[field]) {
      encrypted[field] = encrypt(encrypted[field])
    }
  }

  return encrypted
}

/**
 * Déchiffre automatiquement les champs sensibles d'un objet
 * @param data Objet contenant des données chiffrées
 * @param tableName Nom de la table pour identifier les champs à déchiffrer
 */
export function decryptSensitiveFields<T extends Record<string, any>>(
  data: T,
  tableName: keyof typeof SENSITIVE_FIELDS
): T {
  const fieldsToDecrypt = SENSITIVE_FIELDS[tableName]
  if (!fieldsToDecrypt) return data

  const decrypted = { ...data }

  for (const field of fieldsToDecrypt) {
    if (decrypted[field]) {
      try {
        decrypted[field] = decrypt(decrypted[field])
      } catch (error) {
        // Si le déchiffrement échoue, garder la valeur chiffrée
        console.warn(`[DECRYPT WARNING] Impossible de déchiffrer le champ ${field}`)
      }
    }
  }

  return decrypted
}

/**
 * Hash une donnée avec SHA-256 (pour anonymisation RGPD)
 * @param data Donnée à hasher
 */
export function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Anonymise les données personnelles pour export RGPD
 * @param data Objet contenant des données personnelles
 */
export function anonymizePersonalData<T extends Record<string, any>>(data: T): T {
  return {
    ...data,
    firstName: hash(data.firstName || '').substring(0, 8),
    lastName: hash(data.lastName || '').substring(0, 8),
    email: data.email ? `${hash(data.email).substring(0, 8)}@anonymized.local` : null,
    phone: data.phone ? `+33*****${hash(data.phone).substring(0, 4)}` : null,
    address: '[ANONYMISÉ]',
    city: data.postalCode ? data.postalCode.substring(0, 2) + '***' : '[ANONYMISÉ]',
  }
}
