/**
 * Service de pré-remplissage intelligent des formulaires
 * Analyse les données précédentes pour suggérer des valeurs
 */

interface ConsultationData {
  id: string
  date: string
  type: string
  examenClinique?: string
  conclusion?: string
  conduite?: string
  [key: string]: any
}

interface PatientData {
  id: string
  firstName: string
  lastName: string
  antecedents?: any
  allergies?: string[]
  [key: string]: any
}

interface GrossesseData {
  id: string
  ddr: string
  dpa: string
  status: string
  [key: string]: any
}

export class AutofillService {
  /**
   * Suggère des valeurs pour une nouvelle consultation basée sur l'historique
   */
  static suggestConsultationData(
    patient: PatientData,
    grossesse?: GrossesseData,
    previousConsultations: ConsultationData[] = []
  ): Partial<ConsultationData> {
    const suggestions: any = {}

    // Si c'est une grossesse, suggérer le type de consultation selon le terme
    if (grossesse) {
      const sa = this.calculateSA(grossesse.ddr)
      suggestions.type = this.suggestConsultationType(sa.weeks)

      // Pré-remplir des éléments d'examen clinique basés sur le terme
      suggestions.examenCliniqueTemplate = this.getExamenTemplateForSA(sa.weeks)
    }

    // Analyser les consultations précédentes
    if (previousConsultations.length > 0) {
      const lastConsultation = previousConsultations[0]

      // Copier les éléments qui changent rarement
      if (lastConsultation.conduite?.includes('revoir')) {
        suggestions.followUpNeeded = true
      }

      // Extraire les informations de suivi
      suggestions.previousConducte = lastConsultation.conduite
      suggestions.previousConclusion = lastConsultation.conclusion
    }

    // Ajouter les antécédents importants
    if (patient.antecedents) {
      suggestions.antecedentsToConsider = this.extractImportantAntecedents(patient.antecedents)
    }

    // Alertes allergies
    if (patient.allergies && patient.allergies.length > 0) {
      suggestions.allergiesAlert = patient.allergies.join(', ')
    }

    return suggestions
  }

  /**
   * Calcule les SA depuis la DDR
   */
  private static calculateSA(ddr: string) {
    const ddrDate = new Date(ddr)
    const today = new Date()
    const diffTime = today.getTime() - ddrDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diffDays / 7)
    const days = diffDays % 7
    return { weeks, days }
  }

  /**
   * Suggère le type de consultation selon le terme
   */
  private static suggestConsultationType(weeks: number): string {
    if (weeks < 12) return 'consultation_prenatale'
    if (weeks >= 12 && weeks < 14) return 'echographie_t1'
    if (weeks >= 14 && weeks < 20) return 'consultation_prenatale'
    if (weeks >= 20 && weeks < 24) return 'echographie_t2'
    if (weeks >= 24 && weeks < 28) return 'consultation_prenatale'
    if (weeks >= 28 && weeks < 34) return 'echographie_t3'
    if (weeks >= 34 && weeks < 37) return 'consultation_prenatale'
    if (weeks >= 37) return 'consultation_terme'
    return 'consultation_prenatale'
  }

  /**
   * Retourne un template d'examen clinique selon le terme
   */
  private static getExamenTemplateForSA(weeks: number): string {
    const baseTemplate = `EXAMEN GÉNÉRAL
- État général :
- TA :
- Poids :
- Œdèmes :

EXAMEN OBSTÉTRICAL
- HU :
- BDC :
- MAF :
- Contractions :
- TV :
`

    if (weeks < 14) {
      return `${baseTemplate}
EXAMENS COMPLÉMENTAIRES
- Bilan sanguin T1
- Échographie de datation
- Dépistage trisomie 21`
    } else if (weeks >= 14 && weeks < 28) {
      return `${baseTemplate}
EXAMENS COMPLÉMENTAIRES
- Échographie morphologique
- Bilan sanguin T2`
    } else if (weeks >= 28 && weeks < 37) {
      return `${baseTemplate}
EXAMENS COMPLÉMENTAIRES
- Échographie T3
- Bilan sanguin T3
- RAI si Rhésus négatif`
    } else {
      return `${baseTemplate}
SURVEILLANCE TERME
- Monitoring
- Score de Bishop si terme dépassé
- Échographie de bien-être fœtal`
    }
  }

  /**
   * Extrait les antécédents importants
   */
  private static extractImportantAntecedents(antecedents: any): string[] {
    const important = []

    if (antecedents.diabete) important.push('Diabète')
    if (antecedents.hta) important.push('HTA')
    if (antecedents.cesarienne) important.push('Antécédent de césarienne')
    if (antecedents.premature) important.push('Antécédent de prématurité')
    if (antecedents.fausseCouche) important.push('Fausse couche antérieure')

    return important
  }

  /**
   * Suggère des ordonnances selon le contexte
   */
  static suggestOrdonnances(
    patient: PatientData,
    grossesse?: GrossesseData,
    consultationType?: string
  ): string[] {
    const suggestions = []

    if (grossesse) {
      const sa = this.calculateSA(grossesse.ddr)

      // Début de grossesse
      if (sa.weeks < 12) {
        suggestions.push('Acide folique 0,4mg (si pas déjà prescrit)')
        suggestions.push('Vitamine D 100 000 UI (dose de charge)')
      }

      // T2 - Dépistage diabète
      if (sa.weeks >= 24 && sa.weeks <= 28) {
        suggestions.push('HGPO 75g (dépistage diabète gestationnel)')
      }

      // T3 - Prélèvement streptocoque B
      if (sa.weeks >= 35 && sa.weeks <= 37) {
        suggestions.push('Prélèvement vaginal (Streptocoque B)')
      }

      // Proche du terme
      if (sa.weeks >= 37) {
        suggestions.push('Monitoring fœtal')
      }
    }

    return suggestions
  }

  /**
   * Suggère des actions de suivi
   */
  static suggestFollowUpActions(
    patient: PatientData,
    grossesse?: GrossesseData,
    lastConsultation?: ConsultationData
  ): string[] {
    const actions = []

    if (grossesse) {
      const sa = this.calculateSA(grossesse.ddr)

      // Consultations recommandées
      if (sa.weeks < 12) {
        actions.push('Revoir à 12 SA pour échographie T1')
      } else if (sa.weeks >= 12 && sa.weeks < 20) {
        actions.push('Revoir à 20-22 SA pour échographie T2')
      } else if (sa.weeks >= 20 && sa.weeks < 28) {
        actions.push('Revoir à 28-32 SA pour échographie T3')
      } else if (sa.weeks >= 28 && sa.weeks < 34) {
        actions.push('Consultation anesthésiste')
        actions.push('Revoir à 34-36 SA')
      } else if (sa.weeks >= 34 && sa.weeks < 37) {
        actions.push('Revoir à 37-38 SA')
        actions.push('Prélèvement strepto B si pas fait')
      } else if (sa.weeks >= 37 && sa.weeks < 41) {
        actions.push('Revoir toutes les semaines')
        actions.push('Monitoring à chaque consultation')
      } else if (sa.weeks >= 41) {
        actions.push('Déclenchement à discuter')
        actions.push('Surveillance rapprochée (monitoring tous les 2 jours)')
      }
    }

    // Analyser la dernière consultation
    if (lastConsultation) {
      if (lastConsultation.conclusion?.toLowerCase().includes('anomalie')) {
        actions.push('⚠️ Contrôle rapproché suite à anomalie détectée')
      }
      if (lastConsultation.conduite?.toLowerCase().includes('examen complémentaire')) {
        actions.push('Récupérer les résultats d\'examens')
      }
    }

    return actions
  }

  /**
   * Analyse les patterns dans l'historique pour détecter des tendances
   */
  static analyzePatterns(consultations: ConsultationData[]): {
    recurrentIssues: string[]
    trends: string[]
    alerts: string[]
  } {
    const recurrentIssues: string[] = []
    const trends: string[] = []
    const alerts: string[] = []

    // Analyser les conclusions récurrentes
    const conclusions = consultations
      .map(c => c.conclusion?.toLowerCase() || '')
      .filter(c => c.length > 0)

    // Détecter les problèmes récurrents
    if (conclusions.filter(c => c.includes('hta')).length >= 2) {
      recurrentIssues.push('HTA récurrente')
      alerts.push('⚠️ Surveillance tensionnelle renforcée recommandée')
    }

    if (conclusions.filter(c => c.includes('protéinurie')).length >= 2) {
      recurrentIssues.push('Protéinurie récurrente')
      alerts.push('⚠️ Risque de pré-éclampsie - surveillance rapprochée')
    }

    if (conclusions.filter(c => c.includes('contractions')).length >= 2) {
      recurrentIssues.push('Contractions fréquentes')
      alerts.push('⚠️ Risque de MAP - repos et surveillance')
    }

    // Analyser les tendances de poids (si données disponibles)
    // ... logique supplémentaire

    return { recurrentIssues, trends, alerts }
  }
}
