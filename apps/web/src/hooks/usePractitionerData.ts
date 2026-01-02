import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import type { PraticienData } from '../lib/documentTemplates'

/**
 * Hook to get complete practitioner data for document generation
 * Combines user info from AuthContext with cabinet settings from API
 * Returns PraticienData formatted for PDF templates
 */
export function usePractitionerData(): PraticienData | null {
  const { user } = useAuth()

  // Fetch practitioner settings from API
  const { data: settingsData } = useQuery({
    queryKey: ['practitioner-settings'],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/practitioner/settings`,
        { credentials: 'include' }
      )
      if (!res.ok) {
        throw new Error('Failed to fetch practitioner settings')
      }
      return res.json()
    },
    enabled: !!user, // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  })

  // Combine user data and settings into PraticienData format
  return useMemo(() => {
    if (!user) return null

    const settings = settingsData?.settings

    // If no settings exist yet, return null to indicate incomplete profile
    if (!settings || !settings.cabinetAddress) {
      return null
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      rpps: user.rpps || undefined,
      adeli: user.adeli || undefined,
      address: settings.cabinetAddress,
      phone: settings.cabinetPhone || '',
      email: settings.cabinetEmail || user.email,
    }
  }, [user, settingsData])
}
