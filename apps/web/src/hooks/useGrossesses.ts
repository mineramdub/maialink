import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { grossessesApi } from '../lib/api'

export const grossessesKeys = {
  all: ['grossesses'] as const,
  lists: () => [...grossessesKeys.all, 'list'] as const,
  list: (filters?: { patientId?: string; status?: string }) =>
    [...grossessesKeys.lists(), filters] as const,
  details: () => [...grossessesKeys.all, 'detail'] as const,
  detail: (id: string) => [...grossessesKeys.details(), id] as const,
}

export function useGrossesses(filters?: { patientId?: string; status?: string }) {
  return useQuery({
    queryKey: grossessesKeys.list(filters),
    queryFn: () => grossessesApi.list(filters),
    select: (data) => data.grossesses,
  })
}

export function useGrossesse(id: string) {
  return useQuery({
    queryKey: grossessesKeys.detail(id),
    queryFn: () => grossessesApi.get(id),
    select: (data) => data.grossesse,
    enabled: !!id,
  })
}

export function useCreateGrossesse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: grossessesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grossessesKeys.lists() })
    },
  })
}

export function useUpdateGrossesse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      grossessesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: grossessesKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: grossessesKeys.lists() })
    },
  })
}

export function usePrefetchGrossesse() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: grossessesKeys.detail(id),
      queryFn: () => grossessesApi.get(id),
    })
  }
}
