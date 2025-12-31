import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientsApi } from '../lib/api'

// Query keys
export const patientsKeys = {
  all: ['patients'] as const,
  lists: () => [...patientsKeys.all, 'list'] as const,
  list: (filters?: { search?: string; status?: string }) =>
    [...patientsKeys.lists(), filters] as const,
  details: () => [...patientsKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientsKeys.details(), id] as const,
}

// Fetch all patients with filters
export function usePatients(filters?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: patientsKeys.list(filters),
    queryFn: () => patientsApi.list(filters),
    select: (data) => data.patients,
  })
}

// Fetch single patient
export function usePatient(id: string) {
  return useQuery({
    queryKey: patientsKeys.detail(id),
    queryFn: () => patientsApi.get(id),
    select: (data) => data.patient,
    enabled: !!id,
  })
}

// Create patient mutation
export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patientsApi.create,
    onSuccess: () => {
      // Invalidate all patient lists to refetch
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() })
    },
  })
}

// Update patient mutation
export function useUpdatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      patientsApi.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific patient and all lists
      queryClient.invalidateQueries({ queryKey: patientsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() })
    },
  })
}

// Delete patient mutation
export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() })
    },
  })
}

// Prefetch patient details (for hover)
export function usePrefetchPatient() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: patientsKeys.detail(id),
      queryFn: () => patientsApi.get(id),
    })
  }
}
