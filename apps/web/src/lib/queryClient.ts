import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 10 minutes
      staleTime: 10 * 60 * 1000,

      // Keep unused data in cache for 15 minutes
      gcTime: 15 * 60 * 1000,

      // Refetch in background when window regains focus
      refetchOnWindowFocus: true,

      // Refetch in background when reconnecting
      refetchOnReconnect: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Retry failed requests once
      retry: 1,

      // Show stale data while revalidating in background
      refetchInterval: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    }
  }
})
