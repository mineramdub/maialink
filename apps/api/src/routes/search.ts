import express from 'express'
import { db } from '../lib/db.js'
import {
  patients,
  grossesses,
  consultations,
  protocols,
  patientsSurveillance,
  documentTemplates
} from '../lib/schema.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'
import { ilike, or, and, eq, desc, sql } from 'drizzle-orm'

const router = express.Router()

/**
 * GET /api/search?q=recherche&types=patients,grossesses
 * Recherche universelle dans toute l'application
 */
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { q, types } = req.query

    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.json({
        success: true,
        results: {
          patients: [],
          grossesses: [],
          consultations: [],
          protocols: [],
          surveillances: [],
          documents: []
        }
      })
    }

    const searchQuery = `%${q}%`
    const requestedTypes = types ? (types as string).split(',') : ['patients', 'grossesses', 'consultations', 'protocols', 'surveillances', 'documents']

    const results: any = {}

    // Recherche patientes
    if (requestedTypes.includes('patients')) {
      results.patients = await db
        .select({
          id: patients.id,
          firstName: patients.firstName,
          lastName: patients.lastName,
          birthDate: patients.dateNaissance,
          city: patients.city,
          phone: patients.mobilePhone,
          type: sql<string>`'patient'`,
        })
        .from(patients)
        .where(
          and(
            eq(patients.userId, userId),
            or(
              ilike(patients.firstName, searchQuery),
              ilike(patients.lastName, searchQuery),
              ilike(patients.email, searchQuery),
              ilike(patients.mobilePhone, searchQuery),
              ilike(patients.city, searchQuery)
            )
          )
        )
        .limit(10)
        .orderBy(desc(patients.updatedAt))
    }

    // Recherche grossesses
    if (requestedTypes.includes('grossesses')) {
      results.grossesses = await db
        .select({
          id: grossesses.id,
          patientId: grossesses.patientId,
          patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
          ddr: grossesses.ddr,
          dpa: grossesses.dpa,
          status: grossesses.status,
          type: sql<string>`'grossesse'`,
        })
        .from(grossesses)
        .leftJoin(patients, eq(grossesses.patientId, patients.id))
        .where(
          and(
            eq(grossesses.userId, userId),
            or(
              ilike(patients.firstName, searchQuery),
              ilike(patients.lastName, searchQuery)
            )
          )
        )
        .limit(10)
        .orderBy(desc(grossesses.createdAt))
    }

    // Recherche consultations
    if (requestedTypes.includes('consultations')) {
      results.consultations = await db
        .select({
          id: consultations.id,
          patientId: consultations.patientId,
          patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
          date: consultations.date,
          type: consultations.type,
          motif: consultations.motif,
          searchType: sql<string>`'consultation'`,
        })
        .from(consultations)
        .leftJoin(patients, eq(consultations.patientId, patients.id))
        .where(
          and(
            eq(consultations.userId, userId),
            or(
              ilike(patients.firstName, searchQuery),
              ilike(patients.lastName, searchQuery),
              ilike(consultations.motif, searchQuery),
              ilike(consultations.examenClinique, searchQuery)
            )
          )
        )
        .limit(10)
        .orderBy(desc(consultations.date))
    }

    // Recherche protocoles
    if (requestedTypes.includes('protocols')) {
      results.protocols = await db
        .select({
          id: protocols.id,
          nom: protocols.nom,
          description: protocols.description,
          categorie: protocols.categorie,
          type: sql<string>`'protocol'`,
        })
        .from(protocols)
        .where(
          and(
            eq(protocols.userId, userId),
            or(
              ilike(protocols.nom, searchQuery),
              ilike(protocols.description, searchQuery),
              ilike(protocols.contenu, searchQuery)
            )
          )
        )
        .limit(10)
        .orderBy(desc(protocols.updatedAt))
    }

    // Recherche surveillances
    if (requestedTypes.includes('surveillances')) {
      results.surveillances = await db
        .select({
          id: patientsSurveillance.id,
          patientId: patientsSurveillance.patientId,
          patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
          niveau: patientsSurveillance.niveau,
          raison: patientsSurveillance.raison,
          dateProchainControle: patientsSurveillance.dateProchainControle,
          isActive: patientsSurveillance.isActive,
          type: sql<string>`'surveillance'`,
        })
        .from(patientsSurveillance)
        .leftJoin(patients, eq(patientsSurveillance.patientId, patients.id))
        .where(
          and(
            eq(patientsSurveillance.userId, userId),
            eq(patientsSurveillance.isActive, true),
            or(
              ilike(patients.firstName, searchQuery),
              ilike(patients.lastName, searchQuery),
              ilike(patientsSurveillance.notesSurveillance, searchQuery)
            )
          )
        )
        .limit(10)
        .orderBy(desc(patientsSurveillance.dateProchainControle))
    }

    // Recherche documents/templates
    if (requestedTypes.includes('documents')) {
      results.documents = await db
        .select({
          id: documentTemplates.id,
          nom: documentTemplates.nom,
          description: documentTemplates.description,
          categorie: documentTemplates.categorie,
          type: sql<string>`'document'`,
        })
        .from(documentTemplates)
        .where(
          and(
            eq(documentTemplates.userId, userId),
            or(
              ilike(documentTemplates.nom, searchQuery),
              ilike(documentTemplates.description, searchQuery)
            )
          )
        )
        .limit(10)
        .orderBy(desc(documentTemplates.updatedAt))
    }

    res.json({ success: true, results })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la recherche' })
  }
})

/**
 * GET /api/search/recent
 * Récupère l'historique des recherches récentes
 */
router.get('/recent', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    // Récupère les 5 patientes les plus récemment consultées
    const recentPatients = await db
      .select({
        id: patients.id,
        firstName: patients.firstName,
        lastName: patients.lastName,
        city: patients.city,
        type: sql<string>`'patient'`,
      })
      .from(patients)
      .where(eq(patients.userId, userId))
      .orderBy(desc(patients.lastViewedAt))
      .limit(5)

    // Récupère les 5 consultations les plus récentes
    const recentConsultations = await db
      .select({
        id: consultations.id,
        patientId: consultations.patientId,
        patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        date: consultations.date,
        type: consultations.type,
        searchType: sql<string>`'consultation'`,
      })
      .from(consultations)
      .leftJoin(patients, eq(consultations.patientId, patients.id))
      .where(eq(consultations.userId, userId))
      .orderBy(desc(consultations.updatedAt))
      .limit(5)

    res.json({
      success: true,
      recent: {
        patients: recentPatients,
        consultations: recentConsultations,
      },
    })
  } catch (error) {
    console.error('Recent search error:', error)
    res.status(500).json({ success: false, error: 'Erreur' })
  }
})

export default router
