// Calendrier de suivi de grossesse selon recommandations HAS/CNGOF
// Pour sage-femmes libérales
// Organisé par les 7 consultations mensuelles obligatoires

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
  sousExamens?: {
    titre: string
    type: 'echographie' | 'biologie' | 'examen' | 'consultation_externe'
    priorite: 'obligatoire' | 'recommande' | 'optionnel'
    items: string[]
  }[]
}

// Calendrier organisé par consultations mensuelles
export const CALENDRIER_GROSSESSE: CalendarEvent[] = [
  // ========== CONSULTATION 1 - AVANT 15 SA ==========
  {
    id: 'consultation_1',
    titre: 'Consultation du 1er mois',
    description: '1ère consultation obligatoire - Déclaration de grossesse',
    saMin: 6,
    saMax: 14,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique complet (poids, TA, examen gynécologique)',
      'Déclaration de grossesse (CERFA à envoyer avant 15 SA)',
      'Prescription supplémentation : Acide folique + Vitamine D'
    ],
    conseils: [
      'Arrêt tabac et alcool',
      'Prévention toxoplasmose si non immune',
      'Activité physique modérée recommandée',
      'Alimentation équilibrée'
    ],
    sousExamens: [
      {
        titre: 'Bilan biologique T1 (obligatoire)',
        type: 'biologie',
        priorite: 'obligatoire',
        items: [
          'Groupe sanguin ABO + Rhésus + phénotype complet (si 1ère détermination)',
          'RAI (Recherche agglutinines irrégulières)',
          'NFS (Numération Formule Sanguine)',
          'Glycémie à jeun',
          'Sérologie Toxoplasmose (si non immune : contrôle mensuel)',
          'Sérologie Rubéole',
          'Sérologie Syphilis (TPHA/VDRL)',
          'Sérologie VIH (avec accord patiente)',
          'Sérologie Hépatite B (Ag HBs)',
          'Sérologie Hépatite C (si facteurs de risque)',
          'ECBU (Examen Cytobactériologique des Urines)'
        ]
      },
      {
        titre: 'Échographie T1 (11-13 SA + 6j)',
        type: 'echographie',
        priorite: 'obligatoire',
        items: [
          'Datation précise de la grossesse (LCC)',
          'Nombre d\'embryons',
          'Vitalité embryonnaire',
          'Mesure clarté nucale (dépistage trisomie 21)',
          'Biométrie embryonnaire'
        ]
      },
      {
        titre: 'Dépistage trisomie 21 (si souhaité)',
        type: 'examen',
        priorite: 'recommande',
        items: [
          'Dépistage combiné T1 : échographie + marqueurs sériques (PAPP-A, βHCG libre)',
          'OU Test ADN libre circulant (DPNI) si indication'
        ]
      }
    ]
  },

  // ========== CONSULTATION 2 - 4ÈME MOIS (EPP) ==========
  {
    id: 'consultation_2_epp',
    titre: 'Consultation du 4ème mois - EPP',
    description: 'Entretien Prénatal Précoce (recommandé)',
    saMin: 15,
    saMax: 20,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique : poids, TA, hauteur utérine',
      'Bruits du cœur fœtaux (doppler)',
      'Mouvements actifs fœtaux',
      'Bandelette urinaire'
    ],
    conseils: [
      'Entretien Prénatal Précoce (EPP) recommandé ce mois',
      'Discussion projet de naissance',
      'Préparation à la naissance : inscription possible',
      'Informations sur les droits sociaux'
    ],
    sousExamens: [
      {
        titre: 'Entretien Prénatal Précoce (EPP)',
        type: 'consultation_externe',
        priorite: 'recommande',
        items: [
          'Évaluation besoins psycho-sociaux',
          'Discussion projet de naissance',
          'Dépistage violences conjugales',
          'Orientation vers professionnels si nécessaire',
          'Information sur préparation à la naissance'
        ]
      },
      {
        titre: 'Contrôles biologiques mensuels',
        type: 'biologie',
        priorite: 'obligatoire',
        items: [
          'Toxoplasmose (si non immune)',
          'RAI (si Rhésus négatif)',
          'Albuminurie / Glycosurie (bandelette)',
          'NFS si anémie'
        ]
      }
    ]
  },

  // ========== CONSULTATION 3 - 5ÈME MOIS ==========
  {
    id: 'consultation_3',
    titre: 'Consultation du 5ème mois',
    description: '3ème consultation obligatoire',
    saMin: 20,
    saMax: 24,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique : poids, TA, hauteur utérine',
      'Bruits du cœur fœtaux',
      'Mouvements actifs fœtaux',
      'Présentation fœtale',
      'Bandelette urinaire'
    ],
    conseils: [
      'Surveillance mouvements fœtaux',
      'Préparation à la naissance : débuter les séances',
      'Repos si contractions fréquentes'
    ],
    sousExamens: [
      {
        titre: 'Échographie T2 (22-24 SA) - Morphologique',
        type: 'echographie',
        priorite: 'obligatoire',
        items: [
          'Biométrie fœtale complète (croissance)',
          'Étude morphologique complète des organes',
          'Dépistage malformations',
          'Localisation placentaire',
          'Quantité liquide amniotique',
          'Mesure col utérin'
        ]
      },
      {
        titre: 'Contrôles biologiques',
        type: 'biologie',
        priorite: 'obligatoire',
        items: [
          'Toxoplasmose (si non immune)',
          'RAI (si Rhésus négatif)',
          'Albuminurie / Glycosurie'
        ]
      }
    ]
  },

  // ========== CONSULTATION 4 - 6ÈME MOIS ==========
  {
    id: 'consultation_4',
    titre: 'Consultation du 6ème mois',
    description: '4ème consultation obligatoire - Dépistage diabète gestationnel',
    saMin: 24,
    saMax: 28,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique : poids, TA, hauteur utérine',
      'Bruits du cœur fœtaux',
      'Mouvements actifs fœtaux',
      'Présentation fœtale',
      'Bandelette urinaire',
      'Membres inférieurs (œdèmes, varices)'
    ],
    conseils: [
      'Surveillance mouvements fœtaux quotidiens',
      'Programmer consultation anesthésiste avant 37 SA',
      'Continuer préparation à la naissance'
    ],
    sousExamens: [
      {
        titre: 'HGPO 75g - Dépistage diabète gestationnel (24-28 SA)',
        type: 'biologie',
        priorite: 'obligatoire',
        items: [
          'Test OBLIGATOIRE entre 24-28 SA',
          'À jeun (8-12h de jeûne)',
          'Glycémie à jeun < 0.92 g/L',
          'Glycémie à 1h < 1.80 g/L',
          'Glycémie à 2h < 1.53 g/L',
          'Diabète gestationnel si 1 valeur dépassée'
        ]
      },
      {
        titre: 'Bilan biologique T2',
        type: 'biologie',
        priorite: 'obligatoire',
        items: [
          'NFS (dépistage anémie)',
          'RAI si Rhésus négatif (à 28 SA)',
          'Toxoplasmose (si non immune)',
          'Albuminurie / Glycosurie'
        ]
      },
      {
        titre: 'Prévention Rhésus (si Rh négatif)',
        type: 'examen',
        priorite: 'obligatoire',
        items: [
          'Injection Rhophylac 300μg IM à 28 SA',
          'Prévention allo-immunisation anti-D'
        ]
      }
    ]
  },

  // ========== CONSULTATION 5 - 7ÈME MOIS ==========
  {
    id: 'consultation_5',
    titre: 'Consultation du 7ème mois',
    description: '5ème consultation obligatoire - Début 3ème trimestre',
    saMin: 28,
    saMax: 32,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique : poids, TA, hauteur utérine',
      'Bruits du cœur fœtaux',
      'Mouvements actifs fœtaux',
      'Présentation fœtale',
      'Col utérin (TV)',
      'Bandelette urinaire',
      'Membres inférieurs (œdèmes)'
    ],
    conseils: [
      'Surveillance quotidienne mouvements fœtaux',
      'Repos si contractions fréquentes',
      'Signes début travail expliqués',
      'Préparation valise maternité'
    ],
    sousExamens: [
      {
        titre: 'Contrôles biologiques',
        type: 'biologie',
        priorite: 'obligatoire',
        items: [
          'NFS',
          'RAI (si Rhésus négatif)',
          'Toxoplasmose (si non immune)',
          'Albuminurie / Glycosurie'
        ]
      }
    ]
  },

  // ========== CONSULTATION 6 - 8ÈME MOIS ==========
  {
    id: 'consultation_6',
    titre: 'Consultation du 8ème mois',
    description: '6ème consultation obligatoire - Préparation accouchement',
    saMin: 32,
    saMax: 37,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique complet : poids, TA, œdèmes',
      'Hauteur utérine',
      'Bruits du cœur fœtaux',
      'Mouvements actifs fœtaux',
      'Présentation fœtale',
      'Engagement',
      'Toucher vaginal : col (longueur, position, consistance, dilatation)',
      'Score de Bishop',
      'Bandelette urinaire'
    ],
    conseils: [
      'Consultation anesthésiste OBLIGATOIRE avant 37 SA',
      'Vérifier valise maternité prête',
      'Signes début travail rappelés',
      'Projet de naissance finalisé'
    ],
    sousExamens: [
      {
        titre: 'Échographie T3 (32-34 SA)',
        type: 'echographie',
        priorite: 'obligatoire',
        items: [
          'Biométrie fœtale (croissance)',
          'Estimation poids fœtal',
          'Présentation fœtale',
          'Quantité liquide amniotique',
          'Localisation placentaire',
          'Doppler si indication'
        ]
      },
      {
        titre: 'Consultation anesthésiste (avant 37 SA)',
        type: 'consultation_externe',
        priorite: 'obligatoire',
        items: [
          'Évaluation terrain anesthésique',
          'Discussion péridurale / rachianesthésie',
          'Information risques et bénéfices',
          'Contre-indications éventuelles',
          'Accord anesthésie'
        ]
      },
      {
        titre: 'Bilan biologique T3',
        type: 'biologie',
        priorite: 'obligatoire',
        items: [
          'NFS (contrôle anémie)',
          'RAI si Rhésus négatif',
          'Toxoplasmose (si non immune)',
          'Albuminurie / Glycosurie'
        ]
      }
    ]
  },

  // ========== CONSULTATION 7 - 9ÈME MOIS ==========
  {
    id: 'consultation_7',
    titre: 'Consultation du 9ème mois',
    description: '7ème consultation obligatoire - Fin de grossesse',
    saMin: 35,
    saMax: 41,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique complet : poids, TA, œdèmes',
      'Hauteur utérine',
      'Bruits du cœur fœtaux',
      'Mouvements actifs fœtaux',
      'Présentation fœtale',
      'Engagement',
      'Toucher vaginal : Score de Bishop complet',
      'Perte bouchon muqueux',
      'Bandelette urinaire'
    ],
    conseils: [
      'Tout est prêt pour l\'accouchement',
      'Signes début travail bien expliqués',
      'Partir à la maternité si contractions régulières 5 min ou perte des eaux',
      'Surveillance mouvements fœtaux quotidienne'
    ],
    sousExamens: [
      {
        titre: 'Prélèvement vaginal Streptocoque B (35-37 SA)',
        type: 'biologie',
        priorite: 'obligatoire',
        items: [
          'PV vaginal + rectal',
          'Dépistage Streptocoque B',
          'Si positif : antibioprophylaxie pendant travail',
          'Prévention infection néonatale'
        ]
      },
      {
        titre: 'Bilan pré-accouchement',
        type: 'biologie',
        priorite: 'obligatoire',
        items: [
          'NFS (contrôle final anémie)',
          'RAI si Rhésus négatif',
          'Albuminurie / Glycosurie'
        ]
      },
      {
        titre: 'Monitoring fœtal (NST) - Si ≥ 39 SA',
        type: 'examen',
        priorite: 'recommande',
        items: [
          'Enregistrement RCF 20-30 min',
          'Vérification réactivité fœtale',
          'Détection contractions utérines',
          'RCF réactif = rassurant'
        ]
      }
    ]
  },

  // ========== CONSULTATION À TERME (≥ 41 SA) ==========
  {
    id: 'consultation_terme',
    titre: 'Consultation à terme / Dépassement',
    description: 'Surveillance rapprochée si ≥ 41 SA',
    saMin: 41,
    saMax: 42,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique complet',
      'Score de Bishop',
      'Monitoring fœtal (NST) obligatoire',
      'Discussion déclenchement'
    ],
    conseils: [
      'Surveillance rapprochée (tous les 2-3 jours)',
      'Monitoring bihebdomadaire',
      'Déclenchement à programmer si ≥ 41 SA',
      'Ne pas dépasser 42 SA'
    ],
    sousExamens: [
      {
        titre: 'Monitoring fœtal bihebdomadaire',
        type: 'examen',
        priorite: 'obligatoire',
        items: [
          'NST tous les 2-3 jours',
          'Vérification bien-être fœtal',
          'Détection souffrance fœtale'
        ]
      },
      {
        titre: 'Programmation déclenchement',
        type: 'examen',
        priorite: 'obligatoire',
        items: [
          'Date déclenchement fixée',
          'Maturation cervicale si col défavorable',
          'Information modalités déclenchement'
        ]
      }
    ]
  },

  // ========== POST-PARTUM ==========
  {
    id: 'consultation_postnatale',
    titre: 'Consultation postnatale',
    description: 'Consultation obligatoire 6-8 semaines après accouchement',
    saMin: 48,
    saMax: 56,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique général',
      'Examen gynécologique',
      'Contrôle involution utérine',
      'Examen périnée / cicatrice',
      'Dépistage dépression post-partum',
      'Contraception'
    ],
    conseils: [
      'Rééducation périnéale si nécessaire',
      'Contraception adaptée',
      'Reprise activité physique progressive',
      'Suivi psychologique si besoin'
    ],
    sousExamens: [
      {
        titre: 'Rééducation périnéale',
        type: 'examen',
        priorite: 'recommande',
        items: [
          '10 séances de kinésithérapie',
          'À débuter 6-8 semaines post-partum',
          'Prévention incontinence',
          'Renforcement musculaire'
        ]
      }
    ]
  }
]

// Fonction pour obtenir les événements selon le terme actuel
export function getCalendarEventsForSA(currentSA: number): {
  current: CalendarEvent[]
  passed: CalendarEvent[]
  upcoming: CalendarEvent[]
} {
  const current: CalendarEvent[] = []
  const passed: CalendarEvent[] = []
  const upcoming: CalendarEvent[] = []

  for (const event of CALENDRIER_GROSSESSE) {
    if (currentSA >= event.saMin && currentSA <= event.saMax) {
      current.push(event)
    } else if (currentSA > event.saMax) {
      passed.push(event)
    } else {
      upcoming.push(event)
    }
  }

  return { current, passed, upcoming }
}

// Fonction pour obtenir les recommandations pour une consultation
export function getConsultationRecommendations(currentSA: number): {
  examensAFaire: string[]
  prescriptionsAPrevoir: string[]
  pointsDeVigilance: string[]
  conseilsADonner: string[]
  ordonnancesSuggerees: any[]
  examensEnRetard: Array<{titre: string, saMin: number, saMax: number, examens: string[]}>
} {
  const { current, passed } = getCalendarEventsForSA(currentSA)

  const examensAFaire: string[] = []
  const prescriptionsAPrevoir: string[] = []
  const pointsDeVigilance: string[] = []
  const conseilsADonner: string[] = []
  const ordonnancesSuggerees: any[] = []
  const examensEnRetard: Array<{titre: string, saMin: number, saMax: number, examens: string[]}> = []

  // Récupérer tous les événements en cours
  for (const event of current) {
    // Ajouter les examens principaux
    if (event.examens) {
      examensAFaire.push(...event.examens)
    }

    // Ajouter les conseils
    if (event.conseils) {
      conseilsADonner.push(...event.conseils)
    }

    // Ajouter les sous-examens (échos, biologies, consultations externes)
    if (event.sousExamens) {
      for (const sousExamen of event.sousExamens) {
        prescriptionsAPrevoir.push(`📋 ${sousExamen.titre}`)
        examensAFaire.push(...sousExamen.items.map(item => `  • ${item}`))
      }
    }
  }

  // Identifier les examens en retard
  for (const event of passed) {
    if (event.type === 'consultation' && (event.priorite === 'obligatoire' || event.priorite === 'recommande')) {
      // Vérifier les sous-examens
      if (event.sousExamens) {
        for (const sousExamen of event.sousExamens) {
          if (sousExamen.priorite === 'obligatoire' || sousExamen.priorite === 'recommande') {
            examensEnRetard.push({
              titre: `${event.titre} - ${sousExamen.titre}`,
              saMin: event.saMin,
              saMax: event.saMax,
              examens: sousExamen.items
            })

            // Reporter à la consultation actuelle
            prescriptionsAPrevoir.push(`⚠️ À RATTRAPER: ${sousExamen.titre} (prévu ${event.saMin}-${event.saMax} SA)`)
            examensAFaire.push(...sousExamen.items.map(item => `⚠️ RETARD: ${item}`))
          }
        }
      }

      // Vérifier les examens principaux
      if (event.examens && event.examens.length > 0) {
        examensEnRetard.push({
          titre: event.titre,
          saMin: event.saMin,
          saMax: event.saMax,
          examens: event.examens
        })
      }
    }
  }

  // Points de vigilance selon le trimestre
  if (currentSA < 14) {
    pointsDeVigilance.push(
      'Rechercher signes de fausse couche',
      'Nausées/vomissements',
      'Supplémentation acide folique'
    )
  } else if (currentSA >= 14 && currentSA < 28) {
    pointsDeVigilance.push(
      'Mouvements actifs fœtaux',
      'Croissance (HU)',
      'TA',
      'Protéinurie'
    )
  } else {
    pointsDeVigilance.push(
      'Surveillance quotidienne mouvements fœtaux',
      'Contractions régulières (MAP)',
      'TA et protéinurie (pré-éclampsie)',
      'Croissance fœtale (HU)'
    )
  }

  return {
    examensAFaire,
    prescriptionsAPrevoir,
    pointsDeVigilance,
    conseilsADonner,
    ordonnancesSuggerees,
    examensEnRetard
  }
}
export function getGynecologyRecommendations(motif: string, sousTypeGyneco?: string): {
  ordonnancesSuggerees: OrdonnanceSuggestion[]
  examensAFaire: string[]
  conseilsADonner: string[]
} {
  const ordonnancesSuggerees: OrdonnanceSuggestion[] = []
  const examensAFaire: string[] = []
  const conseilsADonner: string[] = []

  const motifLower = motif.toLowerCase()
  const sousType = sousTypeGyneco?.toLowerCase() || ''

  // DYSMÉNORRHÉE
  if (motifLower.includes('dysménorrhée') || motifLower.includes('dysmenorrhee') ||
      motifLower.includes('règles douloureuses') || motifLower.includes('regles douloureuses') ||
      motifLower.includes('douleur') && motifLower.includes('règles')) {

    ordonnancesSuggerees.push({
      id: 'gyneco_dysmenorrhee_ains',
      nom: 'Dysménorrhée primaire',
      description: 'IBUPROFÈNE 400mg pour soulager les règles douloureuses',
      type: 'medicament',
      priorite: 'urgent',
      templateNom: 'Dysménorrhée primaire'
    })

    ordonnancesSuggerees.push({
      id: 'gyneco_dysmenorrhee_severe',
      nom: 'Dysménorrhée sévère',
      description: 'ANTADYS + pilule contraceptive si douleurs intenses',
      type: 'medicament',
      priorite: 'recommande',
      templateNom: 'Dysménorrhée sévère'
    })

    ordonnancesSuggerees.push({
      id: 'gyneco_echo_dysmenorrhee',
      nom: 'Échographie pelvienne',
      description: 'Si suspicion endométriose ou douleurs résistantes au traitement',
      type: 'echographie',
      priorite: 'recommande',
      templateNom: 'Échographie pelvienne (gynécologie)'
    })

    examensAFaire.push('Rechercher signes d\'endométriose au TV')
    conseilsADonner.push('Chaleur locale (bouillotte)', 'Débuter AINS dès premiers signes', 'Repos si nécessaire')
  }

  // DYSPAREUNIE
  if (motifLower.includes('dyspareunie') || motifLower.includes('douleur') && motifLower.includes('rapport') ||
      motifLower.includes('sécheresse') || motifLower.includes('secheresse')) {

    ordonnancesSuggerees.push({
      id: 'gyneco_dyspareunie_lubrifiant',
      nom: 'Dyspareunie - Sécheresse vaginale',
      description: 'MUCOGYNE gel hydratant vaginal',
      type: 'medicament',
      priorite: 'urgent',
      templateNom: 'Dyspareunie - Sécheresse vaginale'
    })

    conseilsADonner.push('Lubrification à base d\'eau avant rapports', 'Préliminaires prolongés', 'Communication avec partenaire')

    if (motifLower.includes('post-partum') || motifLower.includes('cicatrice')) {
      examensAFaire.push('Examen cicatrice épisiotomie/déchirure')
      conseilsADonner.push('Massage cicatrice possible', 'Kinésithérapie périnéale si cicatrice douloureuse')
    }
  }

  // IST - CHLAMYDIA
  if (motifLower.includes('chlamydia') || motifLower.includes('ist') || motifLower.includes('mst') ||
      motifLower.includes('dépistage') && (motifLower.includes('infection') || motifLower.includes('sexuel'))) {

    ordonnancesSuggerees.push({
      id: 'gyneco_ist_chlamydia',
      nom: 'Traitement Chlamydia',
      description: 'AZITHROMYCINE 1g dose unique + traitement partenaire OBLIGATOIRE',
      type: 'medicament',
      priorite: 'urgent',
      templateNom: 'Traitement Chlamydia'
    })

    ordonnancesSuggerees.push({
      id: 'gyneco_ist_chlamydia_alt',
      nom: 'Traitement Chlamydia (alternative)',
      description: 'DOXYCYCLINE 100mg x2/j pendant 7 jours si contre-indication Azithromycine',
      type: 'medicament',
      priorite: 'recommande',
      templateNom: 'Traitement Chlamydia (alternative)'
    })

    examensAFaire.push('Prélèvement vaginal avec recherche Chlamydia PCR', 'Sérologies VIH, VHB, VHC, Syphilis')
    conseilsADonner.push('Traitement partenaire(s) OBLIGATOIRE', 'Abstinence 7 jours ou préservatif', 'Test contrôle 3-4 semaines')
  }

  // VAGINOSE
  if (motifLower.includes('vaginose') || motifLower.includes('pertes') && motifLower.includes('odeur') ||
      motifLower.includes('malodorante') || motifLower.includes('poisson')) {

    ordonnancesSuggerees.push({
      id: 'gyneco_vaginose_oral',
      nom: 'Vaginose bactérienne',
      description: 'MÉTRONIDAZOLE 500mg oral - ALCOOL INTERDIT',
      type: 'medicament',
      priorite: 'urgent',
      templateNom: 'Vaginose bactérienne'
    })

    ordonnancesSuggerees.push({
      id: 'gyneco_vaginose_local',
      nom: 'Vaginose bactérienne (traitement local)',
      description: 'FLAGYL ovule 500mg - alternative au traitement oral',
      type: 'medicament',
      priorite: 'recommande',
      templateNom: 'Vaginose bactérienne (traitement local)'
    })

    conseilsADonner.push('ALCOOL STRICTEMENT INTERDIT pendant traitement + 48h', 'Hygiène intime douce (1x/jour max)', 'Éviter douches vaginales')
  }

  // MYCOSE
  if (motifLower.includes('mycose') || motifLower.includes('candida') ||
      motifLower.includes('démangeaison') || motifLower.includes('prurit') ||
      (motifLower.includes('pertes') && motifLower.includes('blanche'))) {

    ordonnancesSuggerees.push({
      id: 'gyneco_mycose_complete',
      nom: 'Mycose vulvo-vaginale',
      description: 'MYCOHYDRALIN ovule 3j + crème 7j - traitement complet',
      type: 'medicament',
      priorite: 'urgent',
      templateNom: 'Mycose vulvo-vaginale'
    })

    ordonnancesSuggerees.push({
      id: 'gyneco_mycose_simple',
      nom: 'Mycose simple (traitement court)',
      description: 'ECONAZOLE ovule 3j - traitement simple',
      type: 'medicament',
      priorite: 'recommande',
      templateNom: 'Mycose simple (traitement court)'
    })

    conseilsADonner.push('Toilette intime 1x/jour MAXIMUM', 'Sous-vêtements coton 100%', 'Éviter protège-slips quotidiens', 'Abstinence pendant traitement (ovule dissout latex)')

    if (motifLower.includes('récidive') || motifLower.includes('recidive')) {
      examensAFaire.push('Glycémie à jeun (recherche diabète)')
      conseilsADonner.push('Probiotiques vaginaux après traitement', 'Réduire sucres rapides')
    }
  }

  // AMÉNORRHÉE
  if (motifLower.includes('aménorrhée') || motifLower.includes('amenorrhee') ||
      motifLower.includes('absence') && motifLower.includes('règles') ||
      motifLower.includes('pas de règles')) {

    ordonnancesSuggerees.push({
      id: 'gyneco_bilan_amenorrhee',
      nom: 'Bilan aménorrhée',
      description: 'Bilan hormonal complet (β-HCG, FSH, LH, Prolactine, TSH, Testostérone) + échographie',
      type: 'biologie',
      priorite: 'urgent',
      templateNom: 'Bilan aménorrhée'
    })

    ordonnancesSuggerees.push({
      id: 'gyneco_echo_amenorrhee',
      nom: 'Échographie pelvienne',
      description: 'Étude utérus et ovaires, recherche SOPK',
      type: 'echographie',
      priorite: 'urgent',
      templateNom: 'Échographie pelvienne (gynécologie)'
    })

    examensAFaire.push('β-HCG plasmatique (éliminer grossesse)', 'FSH, LH', 'Prolactine', 'TSH', 'Testostérone')
    conseilsADonner.push('Tenir calendrier menstruel', 'Courbe de température sur 2 cycles', 'RDV résultats dans 15 jours')
  }

  // CONTRACEPTION
  if (motifLower.includes('contraception') || motifLower.includes('pilule') ||
      motifLower.includes('stérilet') || motifLower.includes('diu') || motifLower.includes('implant') ||
      sousType === 'instauration' || sousType === 'suivi') {

    examensAFaire.push('Tension artérielle', 'Poids, IMC', 'Recherche contre-indications')
    conseilsADonner.push('Efficacité et mode d\'action expliqués', 'Préservatif en + pour protection IST')

    // INSTAURATION DE CONTRACEPTION - Proposer toutes les options
    if (sousType === 'instauration') {
      ordonnancesSuggerees.push({
        id: 'contraception_pilule_combinee',
        nom: 'Contraception - Pilule Combinée',
        description: 'Pilule œstroprogestative (Leeloo, Optilova, Minidril)',
        type: 'medicament',
        priorite: 'recommande',
        templateNom: 'Contraception - Pilule Combinée'
      })

      ordonnancesSuggerees.push({
        id: 'contraception_pilule_micro',
        nom: 'Contraception - Pilule Microprogestative',
        description: 'Pilule sans œstrogènes (Cerazette, Optimizette)',
        type: 'medicament',
        priorite: 'recommande',
        templateNom: 'Contraception - Pilule Microprogestative'
      })

      ordonnancesSuggerees.push({
        id: 'contraception_diu_cuivre',
        nom: 'Contraception - DIU Cuivre',
        description: 'Dispositif intra-utérin au cuivre (sans hormones)',
        type: 'medicament',
        priorite: 'recommande',
        templateNom: 'Contraception - DIU Cuivre'
      })

      ordonnancesSuggerees.push({
        id: 'contraception_diu_hormonal',
        nom: 'Contraception - DIU Hormonal',
        description: 'Mirena, Kyleena ou Jaydess (hormonal)',
        type: 'medicament',
        priorite: 'recommande',
        templateNom: 'Contraception - DIU Hormonal'
      })

      ordonnancesSuggerees.push({
        id: 'contraception_implant',
        nom: 'Contraception - Implant',
        description: 'Nexplanon (implant sous-cutané)',
        type: 'medicament',
        priorite: 'recommande',
        templateNom: 'Contraception - Implant'
      })

      ordonnancesSuggerees.push({
        id: 'contraception_patch',
        nom: 'Contraception - Patch',
        description: 'Patch transdermique hebdomadaire (Evra)',
        type: 'medicament',
        priorite: 'recommande',
        templateNom: 'Contraception - Patch'
      })

      ordonnancesSuggerees.push({
        id: 'contraception_anneau',
        nom: 'Contraception - Anneau Vaginal',
        description: 'Anneau contraceptif (NuvaRing)',
        type: 'medicament',
        priorite: 'recommande',
        templateNom: 'Contraception - Anneau Vaginal'
      })

      examensAFaire.push('Examen gynécologique si DIU envisagé', 'Vérifier dernières règles')
      conseilsADonner.push(
        'Expliquer les différentes méthodes',
        'Avantages et inconvénients de chaque option',
        'Laisser la patiente choisir selon son mode de vie'
      )
    }

    // SUIVI DE CONTRACEPTION - Renouvellement uniquement
    if (sousType === 'suivi') {
      ordonnancesSuggerees.push({
        id: 'contraception_renouvellement_pilule',
        nom: 'Renouvellement Pilule',
        description: 'Renouvellement pilule contraceptive habituelle',
        type: 'medicament',
        priorite: 'urgent',
        templateNom: 'Contraception - Pilule Combinée'
      })

      ordonnancesSuggerees.push({
        id: 'contraception_renouvellement_micro',
        nom: 'Renouvellement Pilule Microprogestative',
        description: 'Renouvellement pilule microprogestative',
        type: 'medicament',
        priorite: 'urgent',
        templateNom: 'Contraception - Pilule Microprogestative'
      })

      examensAFaire.push('Vérifier tolérance et observance', 'Effets secondaires ?')
      conseilsADonner.push(
        'Rappel importance prise régulière',
        'Signaler tout effet indésirable',
        'Prochain RDV dans 6 ou 12 mois'
      )
    }
  }

  // FROTTIS
  if (motifLower.includes('frottis') || motifLower.includes('fcv') ||
      motifLower.includes('dépistage') && motifLower.includes('col')) {

    examensAFaire.push('Prélèvement frottis cervico-vaginal')
    conseilsADonner.push('Résultats dans 3 semaines', 'Vaccination HPV si < 26 ans et non vaccinée', 'Arrêt tabac conseillé')

    // Pas d'ordonnance nécessaire, le frottis est fait pendant la consultation
  }

  // SAIGNEMENTS ABONDANTS / MÉNORRAGIES
  if (motifLower.includes('ménorragie') || motifLower.includes('menorragie') ||
      motifLower.includes('saignement') && motifLower.includes('abondant') ||
      motifLower.includes('règles abondantes')) {

    ordonnancesSuggerees.push({
      id: 'gyneco_menorragies',
      nom: 'Ménorragies',
      description: 'EXACYL (acide tranexamique) pour réduire les saignements',
      type: 'medicament',
      priorite: 'urgent',
      templateNom: 'Ménorragies'
    })

    ordonnancesSuggerees.push({
      id: 'gyneco_echo_menorragies',
      nom: 'Échographie pelvienne',
      description: 'Recherche fibrome, polype, adénomyose',
      type: 'echographie',
      priorite: 'urgent',
      templateNom: 'Échographie pelvienne (gynécologie)'
    })

    examensAFaire.push('NFS (recherche anémie)', 'Échographie pelvienne', 'Frottis si non à jour')
    conseilsADonner.push('Noter abondance cycles (nombre protections/jour)', 'Rechercher signes anémie (fatigue, pâleur)')
  }

  // CONSULTATION DE CONTRÔLE GYNÉCO (par défaut si motif vague)
  if (motifLower.includes('contrôle') || motifLower.includes('suivi') ||
      motifLower.includes('examen gynéco') || motifLower.includes('gynecologique')) {

    examensAFaire.push('Examen des seins', 'Examen gynécologique', 'Frottis si indiqué')
    conseilsADonner.push('Autopalpation seins mensuelle', 'Prochain contrôle dans 1 an')
  }

  return {
    ordonnancesSuggerees,
    examensAFaire: [...new Set(examensAFaire)],
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

/**
 * VERSION ASYNCHRONE - Charge les templates depuis la BDD
 * Remplace progressivement getGynecologyRecommendations()
 *
 * Cette version utilise les templates stockés en base de données au lieu
 * des templates codés en dur, permettant une gestion dynamique via l'interface admin
 */
export async function getGynecologyRecommendationsAsync(
  motif: string,
  sousTypeGyneco?: string,
  userId?: string
): Promise<{
  ordonnancesSuggerees: OrdonnanceSuggestion[]
  examensAFaire: string[]
  conseilsADonner: string[]
}> {
  const { searchTemplates } = await import('./template-loader.js')

  const ordonnancesSuggerees: OrdonnanceSuggestion[] = []
  const examensAFaire: string[] = []
  const conseilsADonner: string[] = []

  const motifLower = motif.toLowerCase()
  const sousType = sousTypeGyneco?.toLowerCase() || ''

  try {
    // Charger les templates pertinents depuis la BDD en fonction du motif
    // On recherche dans les catégories gynécologiques appropriées
    let templates: any[] = []

    // CONTRACEPTION
    if (sousType === 'contraception' || sousType === 'instauration' || sousType === 'suivi' ||
        motifLower.includes('contraception') || motifLower.includes('pilule') ||
        motifLower.includes('diu') || motifLower.includes('stérilet') ||
        motifLower.includes('implant')) {
      const { findTemplatesByCategory } = await import('./template-loader.js')
      templates = await findTemplatesByCategory('contraception', userId)
    }
    // INFECTIONS (mycose, chlamydia, cystite, etc.)
    else if (motifLower.includes('mycose') || motifLower.includes('candidose')) {
      templates = await searchTemplates('mycose', userId)
    }
    else if (motifLower.includes('chlamydia') || motifLower.includes('chlamidia')) {
      templates = await searchTemplates('chlamydia', userId)
    }
    else if (motifLower.includes('gonocoque') || motifLower.includes('gonorrhée') ||
             motifLower.includes('gonorrhee') || motifLower.includes('blennorragie')) {
      templates = await searchTemplates('gonorrhée', userId)
    }
    else if (motifLower.includes('trichomonas') || motifLower.includes('trichomonase')) {
      templates = await searchTemplates('trichomonase', userId)
    }
    else if (motifLower.includes('vaginose') || motifLower.includes('gardnerella')) {
      templates = await searchTemplates('vaginose', userId)
    }
    else if (motifLower.includes('cystite') || motifLower.includes('infection urinaire')) {
      templates = await searchTemplates('cystite', userId)
    }
    else if (motifLower.includes('dépistage ist') || motifLower.includes('depistage ist') ||
             motifLower.includes('dépistage mst') || motifLower.includes('bilan ist') ||
             motifLower.includes('test ist') || motifLower.includes('serologies')) {
      templates = await searchTemplates('dépistage ist', userId)
    }
    else if (motifLower.includes('frottis') || motifLower.includes('fcv') ||
             motifLower.includes('dépistage col') || motifLower.includes('papillomavirus') ||
             motifLower.includes('hpv') && motifLower.includes('test')) {
      templates = await searchTemplates('frottis', userId)
    }
    else if (motifLower.includes('infection') || motifLower.includes('ist') ||
             motifLower.includes('mst') || motifLower.includes('vaginite')) {
      // Recherche générique dans catégorie infections
      const { findTemplatesByCategory } = await import('./template-loader.js')
      templates = await findTemplatesByCategory('infections', userId)
    }
    // MÉNOPAUSE
    else if (motifLower.includes('ménopause') || motifLower.includes('menopause') ||
             motifLower.includes('bouffée') || motifLower.includes('bouffee')) {
      const { findTemplatesByCategory } = await import('./template-loader.js')
      templates = await findTemplatesByCategory('ménopause', userId)
    }
    // TROUBLES MENSTRUELS - Cas spécifiques d'abord
    else if (motifLower.includes('aménorrhée') || motifLower.includes('amenorrhee') ||
             motifLower.includes('absence') && (motifLower.includes('règles') || motifLower.includes('regles'))) {
      templates = await searchTemplates('aménorrhée', userId)
    }
    else if (motifLower.includes('ménorragies') || motifLower.includes('menorragies') ||
             motifLower.includes('règles abondantes') || motifLower.includes('regles abondantes') ||
             motifLower.includes('saignements abondants')) {
      templates = await searchTemplates('ménorragies', userId)
    }
    else if (motifLower.includes('spanioménorrhée') || motifLower.includes('spaniomenorrhee') ||
             motifLower.includes('oligoménorrhée') || motifLower.includes('oligomenorrhee') ||
             motifLower.includes('cycles longs') || motifLower.includes('cycles irréguliers')) {
      templates = await searchTemplates('spanioménorrhée', userId)
    }
    else if (motifLower.includes('dysménorrhée') || motifLower.includes('dysmenorrhee') ||
             motifLower.includes('règles douloureuses') || motifLower.includes('regles douloureuses')) {
      templates = await searchTemplates('douleurs menstruelles', userId)
    }
    else if (motifLower.includes('règles') || motifLower.includes('regles') ||
             motifLower.includes('menstruel')) {
      // Recherche générique pour troubles menstruels
      const { findTemplatesByCategory } = await import('./template-loader.js')
      templates = await findTemplatesByCategory('gynécologie', userId)
    }
    // ALLAITEMENT
    else if (motifLower.includes('allaitement') || motifLower.includes('crevasse') ||
             motifLower.includes('lactation')) {
      const { findTemplatesByCategory } = await import('./template-loader.js')
      templates = await findTemplatesByCategory('allaitement', userId)
    }
    // GROSSESSE
    else if (motifLower.includes('grossesse') || motifLower.includes('enceinte') ||
             motifLower.includes('nausée') || motifLower.includes('nausee') ||
             motifLower.includes('vitamine')) {
      const { findTemplatesByCategory } = await import('./template-loader.js')
      templates = await findTemplatesByCategory('grossesse', userId)
    }
    // RECHERCHE GÉNÉRIQUE en dernier recours
    else {
      templates = await searchTemplates(motif, userId)
    }

    // Convertir les templates en OrdonnanceSuggestion
    for (const template of templates) {
      ordonnancesSuggerees.push({
        id: template.id,
        nom: template.nom,
        description: template.description || '',
        type: template.type,
        priorite: template.priorite,
        templateNom: template.nom
      })
    }

    // Ajouter conseils et examens par défaut selon le contexte
    // Ces conseils restent génériques et ne sont pas stockés en BDD
    if (sousType === 'contraception' || motifLower.includes('contraception')) {
      examensAFaire.push('Tension artérielle', 'Poids, IMC', 'Recherche contre-indications')
      conseilsADonner.push('Efficacité et mode d\'action expliqués', 'Préservatif en + pour protection IST')
    }

    if (motifLower.includes('infection') || motifLower.includes('mycose')) {
      examensAFaire.push('Examen au spéculum', 'Prélèvement vaginal si besoin')
      conseilsADonner.push('Toilette intime douce', 'Éviter les irritants', 'Traiter le partenaire si besoin')
    }

  } catch (error) {
    console.error('[Gyneco Recommendations Async] Error loading templates:', error)
    // En cas d'erreur, fallback sur la version synchrone avec templates en dur
    return getGynecologyRecommendations(motif, sousTypeGyneco)
  }

  // Si aucun template trouvé en BDD, utiliser les templates statiques
  if (ordonnancesSuggerees.length === 0 && examensAFaire.length === 0) {
    const { getGynecoTemplateByMotif } = await import('./gynecoTemplates.js')
    const staticTemplate = getGynecoTemplateByMotif(motifLower)

    if (staticTemplate) {
      // Ajouter les examens recommandés
      examensAFaire.push(...staticTemplate.examensRecommandes)

      // Ajouter comme conseil les points de vigilance et questions
      if (staticTemplate.pointsVigilance.length > 0) {
        conseilsADonner.push('Points de vigilance:', ...staticTemplate.pointsVigilance.slice(0, 5))
      }

      // Ajouter les prescriptions suggérées comme ordonnances
      if (staticTemplate.prescriptionsSuggestions) {
        staticTemplate.prescriptionsSuggestions.forEach((prescription, idx) => {
          ordonnancesSuggerees.push({
            id: `static_${staticTemplate.id}_${idx}`,
            nom: prescription,
            description: staticTemplate.description,
            type: 'gynécologie',
            priorite: 'recommande',
            templateNom: staticTemplate.name
          })
        })
      }
    }
  }

  return {
    ordonnancesSuggerees,
    examensAFaire,
    conseilsADonner
  }
}
