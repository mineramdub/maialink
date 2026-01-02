import { useQuery } from '@tanstack/react-query'
import { agendaApi } from '../lib/api'
import type { AgendaEventType } from '../types/agenda'

export const agendaKeys = {
  all: ['agenda'] as const,
  events: () => [...agendaKeys.all, 'events'] as const,
  eventsList: (filters?: {
    startDate?: string
    endDate?: string
    patientId?: string
    types?: AgendaEventType[]
  }) => [...agendaKeys.events(), filters] as const,
  config: () => [...agendaKeys.all, 'config'] as const,
}

export function useAgendaEvents(filters?: {
  startDate?: string
  endDate?: string
  patientId?: string
  types?: AgendaEventType[]
}) {
  return useQuery({
    queryKey: agendaKeys.eventsList(filters),
    queryFn: () => agendaApi.getEvents(filters),
    select: (data) => data.events,
  })
}

export function useAgendaConfig() {
  return useQuery({
    queryKey: agendaKeys.config(),
    queryFn: () => agendaApi.getConfig(),
    select: (data) => data.config,
    staleTime: 1000 * 60 * 60, // 1 heure - la config ne change pas souvent
  })
}
