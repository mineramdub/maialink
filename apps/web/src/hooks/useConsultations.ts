import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { consultationsApi } from '../lib/api'

export const consultationsKeys = {
  all: ['consultations'] as const,
  lists: () => [...consultationsKeys.all, 'list'] as const,
  list: (filters?: { patientId?: string; grossesseId?: string; type?: string }) =>
    [...consultationsKeys.lists(), filters] as const,
  details: () => [...consultationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...consultationsKeys.details(), id] as const,
}

export function useConsultations(filters?: { patientId?: string; grossesseId?: string; type?: string }) {
  return useQuery({
    queryKey: consultationsKeys.list(filters),
    queryFn: () => consultationsApi.list(filters),
    select: (data) => data.consultations,
  })
}

export function useConsultation(id: string) {
  return useQuery({
    queryKey: consultationsKeys.detail(id),
    queryFn: () => consultationsApi.get(id),
    select: (data) => data.consultation,
    enabled: !!id,
  })
}

export function useCreateConsultation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: consultationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationsKeys.lists() })
    },
  })
}

export function useUpdateConsultation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      consultationsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: consultationsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: consultationsKeys.lists() })
    },
  })
}

export function usePrefetchConsultation() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: consultationsKeys.detail(id),
      queryFn: () => consultationsApi.get(id),
    })
  }
}
