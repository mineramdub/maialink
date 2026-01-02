import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { patients, grossesses, consultations, invoices } from '../lib/schema.js'
import { eq, and, gte, lte, between, sql } from 'drizzle-orm'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Stats - Nombre de patientes actives
    const totalPatients = await db
      .select({ count: sql<number>`count(*)` })
      .from(patients)
      .where(and(
        eq(patients.userId, userId),
        eq(patients.status, 'active')
      ))

    // Stats - Grossesses en cours
    const activeGrossesses = await db
      .select({ count: sql<number>`count(*)` })
      .from(grossesses)
      .where(and(
        eq(grossesses.userId, userId),
        eq(grossesses.status, 'en_cours')
      ))

    // Stats - Consultations aujourd'hui
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
    const todayConsultations = await db
      .select({ count: sql<number>`count(*)` })
      .from(consultations)
      .where(and(
        eq(consultations.userId, userId),
        gte(consultations.date, todayStart),
        lte(consultations.date, todayEnd)
      ))

    // Stats - CA du mois
    const monthlyRevenue = await db
      .select({ sum: sql<number>`COALESCE(SUM(montant_total), 0)` })
      .from(invoices)
      .where(and(
        eq(invoices.userId, userId),
        gte(invoices.dateFacture, firstDayOfMonth),
        lte(invoices.dateFacture, lastDayOfMonth)
      ))

    // Alertes - Grossesses proche du terme (>= 37 SA)
    const grossessesProcheTerMe = await db
      .select({
        id: grossesses.id,
        patientId: grossesses.patientId,
        ddr: grossesses.ddr,
        dpa: grossesses.dpa,
        patient: {
          firstName: patients.firstName,
          lastName: patients.lastName
        }
      })
      .from(grossesses)
      .leftJoin(patients, eq(grossesses.patientId, patients.id))
      .where(and(
        eq(grossesses.userId, userId),
        eq(grossesses.status, 'en_cours')
      ))

    const alertesTerme = grossessesProcheTerMe
      .map(g => {
        const ddr = new Date(g.ddr)
        const diffDays = Math.floor((today.getTime() - ddr.getTime()) / (1000 * 60 * 60 * 24))
        const sa = diffDays / 7

        return {
          ...g,
          sa: Math.floor(sa)
        }
      })
      .filter(g => g.sa >= 37)
      .map(g => ({
        type: 'terme_proche' as const,
        priority: g.sa >= 41 ? 'urgent' as const : 'normal' as const,
        message: g.sa >= 41
          ? `Dépassement de terme pour ${g.patient?.firstName} ${g.patient?.lastName} (${g.sa} SA)`
          : `Proche du terme: ${g.patient?.firstName} ${g.patient?.lastName} (${g.sa} SA)`,
        patientId: g.patientId,
        grossesseId: g.id,
        date: today.toISOString()
      }))

    // Alertes - Examens à faire selon SA
    const alertesExamens = grossessesProcheTerMe
      .map(g => {
        const ddr = new Date(g.ddr)
        const diffDays = Math.floor((today.getTime() - ddr.getTime()) / (1000 * 60 * 60 * 24))
        const sa = Math.floor(diffDays / 7)

        const examensAFaire = []

        // HGPO entre 24-28 SA
        if (sa >= 24 && sa <= 28) {
          examensAFaire.push('HGPO (test diabète gestationnel)')
        }

        // Strepto B entre 35-37 SA
        if (sa >= 35 && sa <= 37) {
          examensAFaire.push('Prélèvement streptocoque B')
        }

        // Monitoring si >= 37 SA
        if (sa >= 37) {
          examensAFaire.push('Monitoring fœtal')
        }

        if (examensAFaire.length > 0) {
          return {
            type: 'examen_a_faire' as const,
            priority: 'normal' as const,
            message: `${g.patient?.firstName} ${g.patient?.lastName} (${sa} SA): ${examensAFaire.join(', ')}`,
            patientId: g.patientId,
            grossesseId: g.id,
            date: today.toISOString()
          }
        }
        return null
      })
      .filter(Boolean)

    // Alertes - Vaccinations coqueluche (20-36 SA)
    const alertesVaccinations = grossessesProcheTerMe
      .map(g => {
        const ddr = new Date(g.ddr)
        const diffDays = Math.floor((today.getTime() - ddr.getTime()) / (1000 * 60 * 60 * 24))
        const sa = Math.floor(diffDays / 7)

        if (sa >= 20 && sa <= 36) {
          return {
            type: 'vaccination' as const,
            priority: 'normal' as const,
            message: `Vaccination coqueluche recommandée pour ${g.patient?.firstName} ${g.patient?.lastName} (${sa} SA)`,
            patientId: g.patientId,
            grossesseId: g.id,
            date: today.toISOString()
          }
        }
        return null
      })
      .filter(Boolean)

    // Prochaines consultations (7 prochains jours)
    const sevenDaysFromNow = new Date(today)
    sevenDaysFromNow.setDate(today.getDate() + 7)

    const upcomingConsultations = await db
      .select({
        id: consultations.id,
        date: consultations.date,
        type: consultations.type,
        patientId: consultations.patientId,
        patient: {
          firstName: patients.firstName,
          lastName: patients.lastName
        }
      })
      .from(consultations)
      .leftJoin(patients, eq(consultations.patientId, patients.id))
      .where(and(
        eq(consultations.userId, userId),
        gte(consultations.date, todayStart),
        lte(consultations.date, sevenDaysFromNow)
      ))
      .orderBy(consultations.date)
      .limit(5)

    // Combiner toutes les alertes
    const allAlertes = [
      ...alertesTerme,
      ...alertesExamens,
      ...alertesVaccinations
    ]

    // Trier par priorité (urgent d'abord)
    allAlertes.sort((a, b) => {
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1
      if (a.priority !== 'urgent' && b.priority === 'urgent') return 1
      return 0
    })

    res.json({
      success: true,
      stats: {
        patients: Number(totalPatients[0]?.count || 0),
        grossesses: Number(activeGrossesses[0]?.count || 0),
        consultationsToday: Number(todayConsultations[0]?.count || 0),
        monthlyRevenue: Number(monthlyRevenue[0]?.sum || 0)
      },
      alertes: allAlertes,
      upcomingConsultations: upcomingConsultations.map(c => ({
        id: c.id,
        date: c.date,
        type: c.type,
        patientName: `${c.patient?.firstName} ${c.patient?.lastName}`
      }))
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

export default router
