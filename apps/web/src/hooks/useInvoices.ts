import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invoicesApi } from '../lib/api'

export const invoicesKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoicesKeys.all, 'list'] as const,
  list: (filters?: { patientId?: string; status?: string }) =>
    [...invoicesKeys.lists(), filters] as const,
  details: () => [...invoicesKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoicesKeys.details(), id] as const,
}

export function useInvoices(filters?: { patientId?: string; status?: string }) {
  return useQuery({
    queryKey: invoicesKeys.list(filters),
    queryFn: () => invoicesApi.list(filters),
    select: (data) => ({ invoices: data.invoices, stats: data.stats }),
  })
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoicesKeys.detail(id),
    queryFn: () => invoicesApi.get(id),
    select: (data) => data.invoice,
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: invoicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() })
    },
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      invoicesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() })
    },
  })
}

export function usePrefetchInvoice() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: invoicesKeys.detail(id),
      queryFn: () => invoicesApi.get(id),
    })
  }
}
