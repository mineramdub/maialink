import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import {
  appointments,
  consultations,
  alertes,
  examensPrenataux,
  reeducationSeances,
  suiviPostPartum,
  suiviGyneco,
  grossesses,
  patients
} from '../lib/schema.js'
import { eq, and, gte, lte, desc, or, isNull } from 'drizzle-orm'
import { CALENDRIER_GROSSESSE } from '../lib/pregnancy-calendar.js'
import { addDays, differenceInDays, parseISO, addWeeks } from 'date-fns'

const router = Router()
router.use(authMiddleware)

// Types d'événements pour l'agenda unifié
export type AgendaEventType =
  | 'appointment'
  | 'consultation'
  | 'alerte_info'
  | 'alerte_warning'
  | 'alerte_urgent'
  | 'examen_prenatal'
  | 'evenement_grossesse'
  | 'reeducation'
  | 'suivi_postpartum'
  | 'suivi_gyneco'
  | 'dpa'

export interface AgendaEvent {
  id: string
  type: AgendaEventType
  date: string
  endDate?: string
  title: string
  description?: string
  patient?: {
    id: string
    firstName: string
    lastName: string
  }
  severity?: 'info' | 'warning' | 'critical'
  color: string
  icon: string
  status?: string
  metadata?: Record<string, any>
}

// Couleurs et icônes par type
const EVENT_CONFIG: Record<AgendaEventType, { color: string; icon: string }> = {
  appointment: { color: '#3B82F6', icon: 'Calendar' }, // Bleu
  consultation: { color: '#22C55E', icon: 'Stethoscope' }, // Vert
  alerte_info: { color: '#60A5FA', icon: 'Info' }, // Bleu clair
  alerte_warning: { color: '#F97316', icon: 'AlertTriangle' }, // Orange
  alerte_urgent: { color: '#EF4444', icon: 'AlertOctagon' }, // Rouge
  examen_prenatal: { color: '#8B5CF6', icon: 'TestTube' }, // Violet
  evenement_grossesse: { color: '#EC4899', icon: 'Baby' }, // Rose
  reeducation: { color: '#06B6D4', icon: 'Activity' }, // Cyan
  suivi_postpartum: { color: '#A16207', icon: 'Heart' }, // Marron
  suivi_gyneco: { color: '#84CC16', icon: 'HeartPulse' }, // Lime
  dpa: { color: '#EAB308', icon: 'Star' }, // Or
}

// GET /api/agenda/events - Liste tous les événements de l'agenda
router.get('/events', async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate, patientId, types } = req.query

    const start = startDate ? new Date(startDate as string) : new Date()
    const end = endDate ? new Date(endDate as string) : addDays(new Date(), 30)
    const userId = req.user!.id
    const filterPatientId = patientId as string | undefined
    const filterTypes = types ? (types as string).split(',') : null

    const events: AgendaEvent[] = []

    // 1. Appointments
    if (!filterTypes || filterTypes.includes('appointment')) {
      const appointmentsData = await db.query.appointments.findMany({
        where: and(
          eq(appointments.userId, userId),
          gte(appointments.startTime, start),
          lte(appointments.startTime, end),
          filterPatientId ? eq(appointments.patientId, filterPatientId) : undefined
        ),
        with: { patient: true },
        orderBy: [desc(appointments.startTime)],
      })

      for (const apt of appointmentsData) {
        events.push({
          id: apt.id,
          type: 'appointment',
          date: apt.startTime.toISOString(),
          endDate: apt.endTime.toISOString(),
          title: apt.title,
          description: apt.notes || undefined,
          patient: apt.patient ? {
            id: apt.patient.id,
            firstName: apt.patient.firstName,
            lastName: apt.patient.lastName,
          } : undefined,
          color: EVENT_CONFIG.appointment.color,
          icon: EVENT_CONFIG.appointment.icon,
          status: apt.status,
          metadata: {
            type: apt.type,
            location: apt.location,
            isHomeVisit: apt.isHomeVisit,
          },
        })
      }
    }

    // 2. Consultations réalisées
    if (!filterTypes || filterTypes.includes('consultation')) {
      const consultationsData = await db.query.consultations.findMany({
        where: and(
          eq(consultations.userId, userId),
          gte(consultations.date, start),
          lte(consultations.date, end),
          filterPatientId ? eq(consultations.patientId, filterPatientId) : undefined
        ),
        with: { patient: true },
        orderBy: [desc(consultations.date)],
      })

      for (const consult of consultationsData) {
        events.push({
          id: consult.id,
          type: 'consultation',
          date: consult.date.toISOString(),
          title: `Consultation ${consult.type}`,
          description: consult.motif || undefined,
          patient: consult.patient ? {
            id: consult.patient.id,
            firstName: consult.patient.firstName,
            lastName: consult.patient.lastName,
          } : undefined,
          color: EVENT_CONFIG.consultation.color,
          icon: EVENT_CONFIG.consultation.icon,
          metadata: {
            type: consult.type,
            duree: consult.duree,
            saTerm: consult.saTerm,
          },
        })
      }
    }

    // 3. Alertes
    if (!filterTypes || filterTypes.some(t => t.startsWith('alerte'))) {
      const alertesData = await db.query.alertes.findMany({
        where: and(
          eq(alertes.userId, userId),
          eq(alertes.isDismissed, false),
          gte(alertes.createdAt, start),
          lte(alertes.createdAt, end),
          filterPatientId ? eq(alertes.patientId, filterPatientId) : undefined
        ),
        with: { patient: true },
        orderBy: [desc(alertes.createdAt)],
      })

      for (const alerte of alertesData) {
        const alerteType = alerte.severity === 'critical'
          ? 'alerte_urgent'
          : alerte.severity === 'warning'
            ? 'alerte_warning'
            : 'alerte_info'

        if (filterTypes && !filterTypes.includes(alerteType)) continue

        events.push({
          id: alerte.id,
          type: alerteType,
          date: alerte.createdAt.toISOString(),
          title: alerte.type.replace(/_/g, ' '),
          description: alerte.message,
          patient: alerte.patient ? {
            id: alerte.patient.id,
            firstName: alerte.patient.firstName,
            lastName: alerte.patient.lastName,
          } : undefined,
          severity: alerte.severity || 'info',
          color: EVENT_CONFIG[alerteType].color,
          icon: EVENT_CONFIG[alerteType].icon,
          metadata: {
            isRead: alerte.isRead,
            type: alerte.type,
          },
        })
      }
    }

    // 4. Examens prénataux
    if (!filterTypes || filterTypes.includes('examen_prenatal')) {
      const examensData = await db.query.examensPrenataux.findMany({
        where: and(
          eq(examensPrenataux.userId, userId),
          or(
            and(gte(examensPrenataux.dateRecommandee, start.toISOString().split('T')[0]), lte(examensPrenataux.dateRecommandee, end.toISOString().split('T')[0])),
            and(gte(examensPrenataux.dateRealisee, start.toISOString().split('T')[0]), lte(examensPrenataux.dateRealisee, end.toISOString().split('T')[0]))
          )
        ),
        with: { grossesse: { with: { patient: true } } },
      })

      for (const examen of examensData) {
        const examDate = examen.dateRealisee || examen.dateRecommandee
        if (!examDate) continue

        if (filterPatientId && examen.grossesse?.patientId !== filterPatientId) continue

        events.push({
          id: examen.id,
          type: 'examen_prenatal',
          date: new Date(examDate).toISOString(),
          title: examen.nom,
          description: examen.resultat || `SA prévue: ${examen.saPrevue}`,
          patient: examen.grossesse?.patient ? {
            id: examen.grossesse.patient.id,
            firstName: examen.grossesse.patient.firstName,
            lastName: examen.grossesse.patient.lastName,
          } : undefined,
          color: EVENT_CONFIG.examen_prenatal.color,
          icon: EVENT_CONFIG.examen_prenatal.icon,
          status: examen.dateRealisee ? 'realise' : 'a_faire',
          metadata: {
            type: examen.type,
            saPrevue: examen.saPrevue,
            normal: examen.normal,
          },
        })
      }
    }

    // 5. DPA (dates prévues d'accouchement)
    if (!filterTypes || filterTypes.includes('dpa')) {
      const grossessesData = await db.query.grossesses.findMany({
        where: and(
          eq(grossesses.userId, userId),
          eq(grossesses.status, 'en_cours'),
          gte(grossesses.dpa, start.toISOString().split('T')[0]),
          lte(grossesses.dpa, end.toISOString().split('T')[0]),
          filterPatientId ? eq(grossesses.patientId, filterPatientId) : undefined
        ),
        with: { patient: true },
      })

      for (const grossesse of grossessesData) {
        if (!grossesse.dpa) continue

        events.push({
          id: `dpa-${grossesse.id}`,
          type: 'dpa',
          date: new Date(grossesse.dpa).toISOString(),
          title: 'DPA - Date prévue accouchement',
          description: `Terme prévu`,
          patient: grossesse.patient ? {
            id: grossesse.patient.id,
            firstName: grossesse.patient.firstName,
            lastName: grossesse.patient.lastName,
          } : undefined,
          color: EVENT_CONFIG.dpa.color,
          icon: EVENT_CONFIG.dpa.icon,
          metadata: {
            grossesseId: grossesse.id,
          },
        })
      }
    }

    // 6. Événements du calendrier de grossesse (calculés dynamiquement)
    if (!filterTypes || filterTypes.includes('evenement_grossesse')) {
      const activeGrossesses = await db.query.grossesses.findMany({
        where: and(
          eq(grossesses.userId, userId),
          eq(grossesses.status, 'en_cours'),
          filterPatientId ? eq(grossesses.patientId, filterPatientId) : undefined
        ),
        with: { patient: true },
      })

      for (const grossesse of activeGrossesses) {
        if (!grossesse.ddr) continue

        const ddrDate = new Date(grossesse.ddr)

        for (const event of CALENDRIER_GROSSESSE) {
          // Calculer les dates pour cet événement
          const eventStartDate = addWeeks(ddrDate, event.saMin)
          const eventEndDate = addWeeks(ddrDate, event.saMax)

          // Vérifier si l'événement est dans la plage demandée
          if (eventEndDate < start || eventStartDate > end) continue

          events.push({
            id: `grossesse-${grossesse.id}-${event.id}`,
            type: 'evenement_grossesse',
            date: eventStartDate.toISOString(),
            endDate: eventEndDate.toISOString(),
            title: event.titre,
            description: event.description,
            patient: grossesse.patient ? {
              id: grossesse.patient.id,
              firstName: grossesse.patient.firstName,
              lastName: grossesse.patient.lastName,
            } : undefined,
            color: EVENT_CONFIG.evenement_grossesse.color,
            icon: EVENT_CONFIG.evenement_grossesse.icon,
            metadata: {
              saMin: event.saMin,
              saMax: event.saMax,
              type: event.type,
              priorite: event.priorite,
              examens: event.examens,
              conseils: event.conseils,
              grossesseId: grossesse.id,
            },
          })
        }
      }
    }

    // 7. Séances de rééducation
    if (!filterTypes || filterTypes.includes('reeducation')) {
      const reeducationData = await db.query.reeducationSeances.findMany({
        where: and(
          eq(reeducationSeances.userId, userId),
          gte(reeducationSeances.date, start),
          lte(reeducationSeances.date, end),
          filterPatientId ? eq(reeducationSeances.patientId, filterPatientId) : undefined
        ),
        with: { patient: true },
        orderBy: [desc(reeducationSeances.date)],
      })

      for (const seance of reeducationData) {
        events.push({
          id: seance.id,
          type: 'reeducation',
          date: seance.date.toISOString(),
          title: `Rééducation périnéale - Séance ${seance.numeroSeance}`,
          description: seance.observations || undefined,
          patient: seance.patient ? {
            id: seance.patient.id,
            firstName: seance.patient.firstName,
            lastName: seance.patient.lastName,
          } : undefined,
          color: EVENT_CONFIG.reeducation.color,
          icon: EVENT_CONFIG.reeducation.icon,
          metadata: {
            numeroSeance: seance.numeroSeance,
            testingPerineal: seance.testingPerineal,
            biofeedback: seance.biofeedback,
            electrostimulation: seance.electrostimulation,
          },
        })
      }
    }

    // 8. Suivi post-partum
    if (!filterTypes || filterTypes.includes('suivi_postpartum')) {
      const suiviPPData = await db.query.suiviPostPartum.findMany({
        where: and(
          eq(suiviPostPartum.userId, userId),
          gte(suiviPostPartum.date, start),
          lte(suiviPostPartum.date, end),
          filterPatientId ? eq(suiviPostPartum.patientId, filterPatientId) : undefined
        ),
        with: { patient: true },
        orderBy: [desc(suiviPostPartum.date)],
      })

      for (const suivi of suiviPPData) {
        events.push({
          id: suivi.id,
          type: 'suivi_postpartum',
          date: suivi.date.toISOString(),
          title: `Suivi post-partum J${suivi.joursPostPartum || '?'}`,
          description: suivi.observations || undefined,
          patient: suivi.patient ? {
            id: suivi.patient.id,
            firstName: suivi.patient.firstName,
            lastName: suivi.patient.lastName,
          } : undefined,
          color: EVENT_CONFIG.suivi_postpartum.color,
          icon: EVENT_CONFIG.suivi_postpartum.icon,
          metadata: {
            joursPostPartum: suivi.joursPostPartum,
            allaitement: suivi.allaitement,
            babyBlues: suivi.babyBlues,
          },
        })
      }
    }

    // 9. Suivi gynéco
    if (!filterTypes || filterTypes.includes('suivi_gyneco')) {
      const suiviGynecoData = await db.query.suiviGyneco.findMany({
        where: and(
          eq(suiviGyneco.userId, userId),
          gte(suiviGyneco.date, start),
          lte(suiviGyneco.date, end),
          filterPatientId ? eq(suiviGyneco.patientId, filterPatientId) : undefined
        ),
        with: { patient: true },
        orderBy: [desc(suiviGyneco.date)],
      })

      for (const suivi of suiviGynecoData) {
        events.push({
          id: suivi.id,
          type: 'suivi_gyneco',
          date: suivi.date.toISOString(),
          title: 'Consultation gynécologique',
          description: suivi.motif || undefined,
          patient: suivi.patient ? {
            id: suivi.patient.id,
            firstName: suivi.patient.firstName,
            lastName: suivi.patient.lastName,
          } : undefined,
          color: EVENT_CONFIG.suivi_gyneco.color,
          icon: EVENT_CONFIG.suivi_gyneco.icon,
          metadata: {
            contraception: suivi.contraceptionActuelle,
            dateDernierFrottis: suivi.dateDernierFrottis,
          },
        })
      }
    }

    // Trier par date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    res.json({
      success: true,
      events,
      count: events.length,
    })
  } catch (error) {
    console.error('Get agenda events error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/agenda/config - Retourne la configuration des types d'événements
router.get('/config', async (req: AuthRequest, res) => {
  try {
    const config = Object.entries(EVENT_CONFIG).map(([type, { color, icon }]) => ({
      type,
      color,
      icon,
      label: getEventTypeLabel(type as AgendaEventType),
    }))

    res.json({ success: true, config })
  } catch (error) {
    console.error('Get agenda config error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

function getEventTypeLabel(type: AgendaEventType): string {
  const labels: Record<AgendaEventType, string> = {
    appointment: 'Rendez-vous',
    consultation: 'Consultations',
    alerte_info: 'Alertes (info)',
    alerte_warning: 'Alertes (attention)',
    alerte_urgent: 'Alertes (urgent)',
    examen_prenatal: 'Examens prénataux',
    evenement_grossesse: 'Événements grossesse',
    reeducation: 'Rééducation',
    suivi_postpartum: 'Suivi post-partum',
    suivi_gyneco: 'Suivi gynéco',
    dpa: 'DPA',
  }
  return labels[type]
}

export default router
