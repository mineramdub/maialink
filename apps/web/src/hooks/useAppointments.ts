import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi } from '../lib/api'

export const appointmentsKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentsKeys.all, 'list'] as const,
  list: (filters?: { patientId?: string; startDate?: string; endDate?: string; status?: string }) =>
    [...appointmentsKeys.lists(), filters] as const,
  details: () => [...appointmentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentsKeys.details(), id] as const,
}

export function useAppointments(filters?: { patientId?: string; startDate?: string; endDate?: string; status?: string }) {
  return useQuery({
    queryKey: appointmentsKeys.list(filters),
    queryFn: () => appointmentsApi.list(filters),
    select: (data) => data.appointments,
  })
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentsKeys.detail(id),
    queryFn: () => appointmentsApi.get(id),
    select: (data) => data.appointment,
    enabled: !!id,
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() })
    },
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      appointmentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() })
    },
  })
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() })
    },
  })
}
