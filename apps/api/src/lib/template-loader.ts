import { db } from './db.js'
import { ordonnanceTemplates } from './schema.js'
import { eq } from 'drizzle-orm'

/**
 * Système de chargement dynamique des templates d'ordonnances depuis la BDD avec cache
 */

interface OrdonnanceTemplate {
  id: string
  nom: string
  categorie: string
  type: 'medicament' | 'biologie' | 'echographie' | 'autre'
  priorite: 'urgent' | 'recommande' | 'optionnel'
  contenu: string
  description: string | null
  source: string | null
  version: string | null
  isActive: boolean
  isSystemTemplate: boolean
}

interface TemplateCache {
  templates: OrdonnanceTemplate[]
  timestamp: number
}

// Cache global avec TTL de 5 minutes
let cache: TemplateCache | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes en millisecondes

/**
 * Charge tous les templates actifs depuis la BDD
 * Utilise un cache de 5 minutes pour optimiser les performances
 */
export async function loadOrdonnanceTemplates(userId?: string): Promise<OrdonnanceTemplate[]> {
  // Vérifier le cache
  if (cache && (Date.now() - cache.timestamp) < CACHE_TTL) {
    console.log('[Template Loader] Cache hit')
    return cache.templates
  }

  console.log('[Template Loader] Cache miss, loading from database')

  try {
    // Charger tous les templates actifs (système + utilisateur si userId fourni)
    const templates = await db.query.ordonnanceTemplates.findMany({
      where: eq(ordonnanceTemplates.isActive, true),
    })

    // Filtrer pour n'inclure que les templates système + templates de l'utilisateur
    const filteredTemplates = userId
      ? templates.filter(t => t.isSystemTemplate || t.userId === userId)
      : templates.filter(t => t.isSystemTemplate)

    // Mettre en cache
    cache = {
      templates: filteredTemplates as OrdonnanceTemplate[],
      timestamp: Date.now()
    }

    console.log(`[Template Loader] Loaded ${filteredTemplates.length} templates`)
    return cache.templates
  } catch (error) {
    console.error('[Template Loader] Error loading templates:', error)

    // En cas d'erreur, fallback sur le cache même expiré si disponible
    if (cache) {
      console.warn('[Template Loader] Using expired cache due to error')
      return cache.templates
    }

    // Dernière solution de secours : retourner tableau vide
    return []
  }
}

/**
 * Invalide le cache pour forcer un rechargement
 * À appeler après création/modification/suppression d'un template
 */
export function invalidateTemplateCache(): void {
  console.log('[Template Loader] Cache invalidated')
  cache = null
}

/**
 * Trouve un template par nom
 */
export async function findTemplateByName(nom: string, userId?: string): Promise<OrdonnanceTemplate | null> {
  const templates = await loadOrdonnanceTemplates(userId)
  return templates.find(t => t.nom === nom) || null
}

/**
 * Trouve des templates par catégorie
 */
export async function findTemplatesByCategory(categorie: string, userId?: string): Promise<OrdonnanceTemplate[]> {
  const templates = await loadOrdonnanceTemplates(userId)
  return templates.filter(t => t.categorie.toLowerCase() === categorie.toLowerCase())
}

/**
 * Trouve des templates par type
 */
export async function findTemplatesByType(
  type: 'medicament' | 'biologie' | 'echographie' | 'autre',
  userId?: string
): Promise<OrdonnanceTemplate[]> {
  const templates = await loadOrdonnanceTemplates(userId)
  return templates.filter(t => t.type === type)
}

/**
 * Recherche de templates par mot-clé dans le nom ou la description
 */
export async function searchTemplates(keyword: string, userId?: string): Promise<OrdonnanceTemplate[]> {
  const templates = await loadOrdonnanceTemplates(userId)
  const lowerKeyword = keyword.toLowerCase()

  return templates.filter(t =>
    t.nom.toLowerCase().includes(lowerKeyword) ||
    t.description?.toLowerCase().includes(lowerKeyword) ||
    t.categorie.toLowerCase().includes(lowerKeyword)
  )
}
