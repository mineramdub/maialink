// Types pour l'agenda unifié

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

export interface AgendaEventConfig {
  type: AgendaEventType
  color: string
  icon: string
  label: string
}

export type AgendaView = 'month' | 'week' | 'day'

export type AgendaMode = 'all' | 'patient' | 'today'

export interface AgendaFilters {
  types: AgendaEventType[]
  patientId?: string
  mode: AgendaMode
}

// Configuration par défaut des couleurs et icônes
export const EVENT_CONFIG: Record<AgendaEventType, { color: string; icon: string; label: string }> = {
  appointment: { color: '#3B82F6', icon: 'Calendar', label: 'Rendez-vous' },
  consultation: { color: '#22C55E', icon: 'Stethoscope', label: 'Consultations' },
  alerte_info: { color: '#60A5FA', icon: 'Info', label: 'Alertes (info)' },
  alerte_warning: { color: '#F97316', icon: 'AlertTriangle', label: 'Alertes (attention)' },
  alerte_urgent: { color: '#EF4444', icon: 'AlertOctagon', label: 'Alertes (urgent)' },
  examen_prenatal: { color: '#8B5CF6', icon: 'TestTube', label: 'Examens prénataux' },
  evenement_grossesse: { color: '#EC4899', icon: 'Baby', label: 'Événements grossesse' },
  reeducation: { color: '#06B6D4', icon: 'Activity', label: 'Rééducation' },
  suivi_postpartum: { color: '#A16207', icon: 'Heart', label: 'Suivi post-partum' },
  suivi_gyneco: { color: '#84CC16', icon: 'HeartPulse', label: 'Suivi gynéco' },
  dpa: { color: '#EAB308', icon: 'Star', label: 'DPA' },
}

// Groupes de types pour les filtres
export const EVENT_TYPE_GROUPS = {
  rdv: ['appointment'],
  medical: ['consultation', 'suivi_gyneco'],
  grossesse: ['examen_prenatal', 'evenement_grossesse', 'dpa'],
  postpartum: ['suivi_postpartum', 'reeducation'],
  alertes: ['alerte_info', 'alerte_warning', 'alerte_urgent'],
} as const

export const ALL_EVENT_TYPES: AgendaEventType[] = [
  'appointment',
  'consultation',
  'alerte_info',
  'alerte_warning',
  'alerte_urgent',
  'examen_prenatal',
  'evenement_grossesse',
  'reeducation',
  'suivi_postpartum',
  'suivi_gyneco',
  'dpa',
]
