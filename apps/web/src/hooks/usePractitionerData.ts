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

    // Build address from user data or settings
    let address = ''
    if (user.cabinetAddress) {
      address = user.cabinetAddress
      if (user.cabinetPostalCode && user.cabinetCity) {
        address += `\n${user.cabinetPostalCode} ${user.cabinetCity}`
      }
    } else if (settings?.cabinetAddress) {
      address = settings.cabinetAddress
    }

    // If no address configured, return minimal info (allow PDF generation anyway)
    if (!address) {
      address = 'Cabinet médical'
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      rpps: user.rpps || undefined,
      adeli: user.adeli || undefined,
      address: address,
      phone: user.phone || settings?.cabinetPhone || '',
      email: user.email,
    }
  }, [user, settingsData])
}
