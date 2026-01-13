import { useCallback } from 'react'

interface AnonymizedContext {
  consultationType?: string
  sa?: number
  motif?: string
  ageGroupe?: string
  parite?: number
  trimestre?: number
}

export function usePracticeLearning() {
  /**
   * Anonymiser un âge en tranche
   */
  const anonymizeAge = (age: number): string => {
    if (age < 20) return '< 20'
    if (age < 30) return '20-30'
    if (age < 40) return '30-40'
    return '40+'
  }

  /**
   * Créer un contexte anonymisé à partir des données de consultation
   */
  const createContext = useCallback((data: {
    consultationType?: string
    sa?: number
    motif?: string
    patientAge?: number
    parite?: number
  }): AnonymizedContext => {
    const context: AnonymizedContext = {
      consultationType: data.consultationType,
      sa: data.sa,
      motif: data.motif,
      parite: data.parite,
    }

    if (data.patientAge) {
      context.ageGroupe = anonymizeAge(data.patientAge)
    }

    if (data.sa) {
      context.trimestre = Math.ceil(data.sa / 13)
    }

    return context
  }, [])

  /**
   * Capturer une prescription
   */
  const capturePrescription = useCallback(async (
    context: AnonymizedContext,
    prescription: {
      medicament: string
      dosage?: string
      duree?: string
    }
  ) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/practice-learning/capture/prescription`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ context, prescription }),
        }
      )
    } catch (error) {
      console.error('Error capturing prescription:', error)
    }
  }, [])

  /**
   * Capturer un examen
   */
  const captureExamen = useCallback(async (
    context: AnonymizedContext,
    examen: {
      type: string
      libelle: string
    }
  ) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/practice-learning/capture/examen`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ context, examen }),
        }
      )
    } catch (error) {
      console.error('Error capturing examen:', error)
    }
  }, [])

  /**
   * Capturer un conseil
   */
  const captureConseil = useCallback(async (
    context: AnonymizedContext,
    conseil: string
  ) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/practice-learning/capture/conseil`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ context, conseil }),
        }
      )
    } catch (error) {
      console.error('Error capturing conseil:', error)
    }
  }, [])

  /**
   * Capturer automatiquement après une consultation
   * Analyse les données de la consultation et capture tous les patterns
   */
  const captureConsultation = useCallback(async (consultationData: {
    type?: string
    sa?: number
    motif?: string
    patientAge?: number
    parite?: number
    prescriptions?: Array<{ medicament: string; dosage?: string; duree?: string }>
    examens?: Array<{ type: string; libelle: string }>
    conseils?: string[]
  }) => {
    const context = createContext({
      consultationType: consultationData.type,
      sa: consultationData.sa,
      motif: consultationData.motif,
      patientAge: consultationData.patientAge,
      parite: consultationData.parite,
    })

    // Capturer les prescriptions
    if (consultationData.prescriptions) {
      for (const prescription of consultationData.prescriptions) {
        await capturePrescription(context, prescription)
      }
    }

    // Capturer les examens
    if (consultationData.examens) {
      for (const examen of consultationData.examens) {
        await captureExamen(context, examen)
      }
    }

    // Capturer les conseils
    if (consultationData.conseils) {
      for (const conseil of consultationData.conseils) {
        if (conseil.trim()) {
          await captureConseil(context, conseil)
        }
      }
    }
  }, [createContext, capturePrescription, captureExamen, captureConseil])

  return {
    createContext,
    capturePrescription,
    captureExamen,
    captureConseil,
    captureConsultation,
  }
}
