// Calendrier de suivi de grossesse selon recommandations HAS/CNGOF
// Pour sage-femmes libérales

export interface CalendarEvent {
  id: string
  titre: string
  description: string
  saMin: number // Semaine d'aménorrhée minimum
  saMax: number // Semaine d'aménorrhée maximum
  type: 'consultation' | 'examen' | 'echographie' | 'biologie' | 'depistage'
  priorite: 'obligatoire' | 'recommande' | 'optionnel'
  examens?: string[]
  conseils?: string[]
}

// Calendrier complet de suivi de grossesse
export const CALENDRIER_GROSSESSE: CalendarEvent[] = [
  // Premier trimestre
  {
    id: 'consultation_precoce',
    titre: 'Consultation précoce',
    description: 'Première consultation de grossesse - Déclaration',
    saMin: 6,
    saMax: 10,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique complet',
      'Poids, taille, TA, BMI',
      'Examen gynécologique',
      'Frottis si > 3 ans',
      'Prescription examens T1'
    ],
    conseils: [
      'Déclaration de grossesse',
      'Supplémentation acide folique',
      'Conseils hygiéno-diététiques',
      'Toxoplasmose si non immune'
    ]
  },
  {
    id: 'biologie_t1',
    titre: 'Bilan biologique T1',
    description: 'Examens biologiques du premier trimestre',
    saMin: 8,
    saMax: 12,
    type: 'biologie',
    priorite: 'obligatoire',
    examens: [
      'Groupe sanguin + RAI',
      'NFS (Hb, plaquettes)',
      'Glycémie à jeun',
      'Sérologies: Toxoplasmose, Rubéole, Syphilis, HIV, Hépatite B',
      'ECBU',
      'TSH si facteurs de risque'
    ]
  },
  {
    id: 'echo_t1',
    titre: 'Échographie T1',
    description: 'Échographie de datation et dépistage T1',
    saMin: 11,
    saMax: 13,
    type: 'echographie',
    priorite: 'obligatoire',
    examens: [
      'Datation (LCC)',
      'Clarté nucale',
      'Dépistage T21 combiné',
      'Recherche malformations précoces'
    ],
    conseils: [
      'Proposer dépistage T21',
      'Information DPNI si souhaité'
    ]
  },
  {
    id: 'consultation_4mois',
    titre: 'Consultation 4e mois',
    description: 'Consultation du 4e mois (16-18 SA)',
    saMin: 16,
    saMax: 18,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique',
      'TA, poids',
      'Hauteur utérine',
      'BCF',
      'Prescription écho T2'
    ],
    conseils: [
      'Mouvements actifs fœtaux',
      'Préparation à la naissance'
    ]
  },
  {
    id: 'echo_t2',
    titre: 'Échographie T2',
    description: 'Échographie morphologique',
    saMin: 20,
    saMax: 24,
    type: 'echographie',
    priorite: 'obligatoire',
    examens: [
      'Morphologie fœtale complète',
      'Biométrie',
      'Placenta et liquide amniotique',
      'Doppler utérins si FDR'
    ]
  },
  {
    id: 'depistage_diabete',
    titre: 'Dépistage diabète gestationnel',
    description: 'Test O\'Sullivan ou HGPO',
    saMin: 24,
    saMax: 28,
    type: 'depistage',
    priorite: 'recommande',
    examens: [
      'GAJ (si facteurs de risque)',
      'Test O\'Sullivan 50g',
      'HGPO 75g si O\'Sullivan positif'
    ],
    conseils: [
      'Systématique si FDR: obésité, ATCD, âge >35 ans',
      'À jeun le matin'
    ]
  },
  {
    id: 'consultation_5mois',
    titre: 'Consultation 5e mois',
    description: 'Consultation du 5e mois (20-22 SA)',
    saMin: 20,
    saMax: 22,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique',
      'TA, poids, HU',
      'BCF, MAF',
      'Résultats écho T2'
    ]
  },
  {
    id: 'consultation_6mois',
    titre: 'Consultation 6e mois',
    description: 'Consultation du 6e mois (24-26 SA)',
    saMin: 24,
    saMax: 26,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique',
      'TA, poids, HU',
      'BCF, MAF',
      'RAI si Rh-',
      'NFS'
    ],
    conseils: [
      'Préparation à la naissance',
      'Projet de naissance'
    ]
  },
  {
    id: 'consultation_7mois',
    titre: 'Consultation 7e mois',
    description: 'Consultation du 7e mois (28-30 SA)',
    saMin: 28,
    saMax: 30,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique',
      'TA, poids, HU',
      'BCF, MAF, présentation',
      'Prescription écho T3',
      'Coqueluche (si non vaccinée)'
    ]
  },
  {
    id: 'echo_t3',
    titre: 'Échographie T3',
    description: 'Échographie du troisième trimestre',
    saMin: 30,
    saMax: 35,
    type: 'echographie',
    priorite: 'obligatoire',
    examens: [
      'Biométrie fœtale',
      'Croissance (estimation poids)',
      'Quantité liquide amniotique',
      'Placenta',
      'Doppler si RCIU'
    ]
  },
  {
    id: 'consultation_8mois',
    titre: 'Consultation 8e mois',
    description: 'Consultation du 8e mois (32-34 SA)',
    saMin: 32,
    saMax: 34,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique',
      'TA, poids, HU',
      'BCF, MAF, présentation',
      'Prélèvement vaginal SGB (35-37 SA)',
      'NFS, RAI si Rh-'
    ],
    conseils: [
      'Signes travail',
      'Quand venir à la maternité',
      'Valise maternité'
    ]
  },
  {
    id: 'depistage_streptob',
    titre: 'Dépistage Streptocoque B',
    description: 'Prélèvement vaginal SGB',
    saMin: 35,
    saMax: 37,
    type: 'depistage',
    priorite: 'obligatoire',
    examens: [
      'Prélèvement vaginal',
      'Culture Streptocoque B'
    ],
    conseils: [
      'Antibioprophylaxie si positif'
    ]
  },
  {
    id: 'consultation_9mois',
    titre: 'Consultation 9e mois',
    description: 'Consultation du 9e mois (36-38 SA)',
    saMin: 36,
    saMax: 38,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique complet',
      'TA, poids, HU',
      'BCF, MAF, présentation',
      'Examen du col (si souhaité)',
      'Consultation anesthésie'
    ],
    conseils: [
      'Surveillance hebdomadaire dès 36 SA',
      'Consultation anesthésie obligatoire',
      'Projet de naissance'
    ]
  },
  {
    id: 'surveillance_hebdo',
    titre: 'Surveillance hebdomadaire',
    description: 'Consultations hebdomadaires de fin de grossesse',
    saMin: 37,
    saMax: 41,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'TA, poids',
      'HU, BCF',
      'Présentation',
      'État du col',
      'Bandelette urinaire'
    ],
    conseils: [
      'Signes d\'alerte',
      'MAF quotidiens',
      'Déclenchement si > 41 SA'
    ]
  },
  // Post-partum
  {
    id: 'visite_postpartum_precoce',
    titre: 'Visite post-partum précoce',
    description: 'Visite à domicile J1-J3',
    saMin: 42,
    saMax: 42,
    type: 'consultation',
    priorite: 'recommande',
    examens: [
      'État général mère',
      'Involution utérine',
      'Lochies',
      'Périnée/cicatrice',
      'Allaitement',
      'Examen bébé'
    ],
    conseils: [
      'Allaitement/biberon',
      'Contraception',
      'Rééducation périnéale'
    ]
  },
  {
    id: 'visite_postpartum_j8',
    titre: 'Visite post-partum J8-J10',
    description: 'Visite de contrôle post-accouchement',
    saMin: 43,
    saMax: 43,
    type: 'consultation',
    priorite: 'recommande',
    examens: [
      'État général',
      'Involution utérine',
      'Cicatrice périnéale',
      'Allaitement',
      'Examen bébé',
      'Test de Guthrie'
    ]
  },
  {
    id: 'consultation_postnatale',
    titre: 'Consultation post-natale',
    description: 'Consultation 6-8 semaines post-partum',
    saMin: 48,
    saMax: 50,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen gynécologique',
      'Frottis si besoin',
      'Contraception',
      'Testing périnéal',
      'État psychologique'
    ],
    conseils: [
      'Prescription rééducation périnéale',
      'Contraception',
      'Reprise activité sexuelle',
      'Dépistage dépression post-partum'
    ]
  }
]

// Fonction pour obtenir les événements selon le terme actuel
export function getCalendarEventsForSA(currentSA: number): {
  passed: CalendarEvent[]
  current: CalendarEvent[]
  upcoming: CalendarEvent[]
  overdue: CalendarEvent[]
} {
  const passed: CalendarEvent[] = []
  const current: CalendarEvent[] = []
  const upcoming: CalendarEvent[] = []
  const overdue: CalendarEvent[] = []

  for (const event of CALENDRIER_GROSSESSE) {
    if (currentSA < event.saMin) {
      // Événement futur
      upcoming.push(event)
    } else if (currentSA >= event.saMin && currentSA <= event.saMax) {
      // Événement en cours
      current.push(event)
    } else if (currentSA > event.saMax) {
      // Événement passé - vérifier si fait ou en retard
      // Pour l'instant, on met tout dans "passé"
      // Plus tard, on vérifiera dans la BD si réalisé
      passed.push(event)
    }
  }

  return { passed, current, upcoming, overdue }
}

// Fonction pour obtenir les recommandations pour une consultation
export function getConsultationRecommendations(currentSA: number): {
  examensAFaire: string[]
  prescriptionsAPrevoir: string[]
  pointsDeVigilance: string[]
  conseilsADonner: string[]
} {
  const { current } = getCalendarEventsForSA(currentSA)

  const examensAFaire: string[] = []
  const prescriptionsAPrevoir: string[] = []
  const pointsDeVigilance: string[] = []
  const conseilsADonner: string[] = []

  for (const event of current) {
    if (event.examens) {
      examensAFaire.push(...event.examens)
    }
    if (event.conseils) {
      conseilsADonner.push(...event.conseils)
    }
  }

  // Recommandations selon le trimestre
  if (currentSA < 14) {
    // T1
    pointsDeVigilance.push('Rechercher signes de fausse couche', 'Nausées/vomissements', 'Supplémentation acide folique')
    prescriptionsAPrevoir.push('Échographie T1 si non faite', 'Biologie T1', 'Acide folique', 'Vitamine D')
  } else if (currentSA >= 14 && currentSA < 28) {
    // T2
    pointsDeVigilance.push('Mouvements actifs fœtaux', 'Croissance (HU)', 'TA', 'Protéinurie')
    prescriptionsAPrevoir.push('Échographie T2 si non faite', 'NFS', 'RAI si Rh-')

    if (currentSA >= 24 && currentSA <= 28) {
      prescriptionsAPrevoir.push('Dépistage diabète gestationnel')
    }
  } else if (currentSA >= 28) {
    // T3
    pointsDeVigilance.push('TA (pré-éclampsie)', 'MAF quotidiens', 'Contractions', 'Perte de liquide', 'Présentation fœtale')
    prescriptionsAPrevoir.push('Échographie T3 si non faite', 'NFS', 'RAI si Rh-')

    if (currentSA >= 35 && currentSA <= 37) {
      prescriptionsAPrevoir.push('Prélèvement vaginal Streptocoque B')
    }

    if (currentSA >= 36) {
      conseilsADonner.push('Signes de travail', 'Quand venir à la maternité', 'Surveillance hebdomadaire')
    }
  }

  return {
    examensAFaire: [...new Set(examensAFaire)],
    prescriptionsAPrevoir: [...new Set(prescriptionsAPrevoir)],
    pointsDeVigilance: [...new Set(pointsDeVigilance)],
    conseilsADonner: [...new Set(conseilsADonner)]
  }
}

// Fonction pour générer des alertes automatiques
export function generateAutomaticAlertsForPregnancy(
  grossesseId: string,
  patientId: string,
  userId: string,
  currentSA: number
): Array<{
  type: string
  message: string
  severity: 'info' | 'warning' | 'urgent'
  grossesseId: string
  patientId: string
  userId: string
}> {
  const alerts = []
  const { current, upcoming } = getCalendarEventsForSA(currentSA)

  // Alertes pour événements en cours
  for (const event of current) {
    if (event.priorite === 'obligatoire') {
      alerts.push({
        type: 'calendrier_grossesse',
        message: `${event.titre} à prévoir (${event.saMin}-${event.saMax} SA) - Actuellement ${Math.floor(currentSA)} SA`,
        severity: 'warning' as const,
        grossesseId,
        patientId,
        userId
      })
    }
  }

  // Alertes pour événements à venir (1 semaine avant)
  for (const event of upcoming) {
    if (event.priorite === 'obligatoire' && event.saMin - currentSA <= 1) {
      alerts.push({
        type: 'calendrier_grossesse',
        message: `À venir: ${event.titre} (${event.saMin}-${event.saMax} SA)`,
        severity: 'info' as const,
        grossesseId,
        patientId,
        userId
      })
    }
  }

  return alerts
}
