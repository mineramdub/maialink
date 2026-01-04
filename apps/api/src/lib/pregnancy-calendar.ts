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
    id: 'echo_datation',
    titre: 'Échographie de datation',
    description: 'Échographie précoce de datation (optionnelle)',
    saMin: 8,
    saMax: 11,
    type: 'echographie',
    priorite: 'optionnel',
    examens: [
      'Datation précise de la grossesse',
      'Vérification grossesse intra-utérine',
      'Nombre d\'embryons',
      'Vitalité embryonnaire (BCF)'
    ],
    conseils: [
      'Recommandée si doute sur DDR',
      'Grossesse multiple suspectée',
      'Antécédent de GEU'
    ]
  },
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
    id: 'entretien_prenatal_precoce',
    titre: 'Entretien Prénatal Précoce (EPP)',
    description: 'Entretien individuel ou en couple',
    saMin: 16,
    saMax: 20,
    type: 'consultation',
    priorite: 'recommande',
    examens: [
      'Évaluation des besoins',
      'Projet de naissance',
      'Contexte psycho-social',
      'Addictions'
    ],
    conseils: [
      'Entretien confidentiel',
      'Pas d\'examen clinique',
      'Orientation si besoin',
      '8 séances de préparation à la naissance incluses'
    ]
  },
  {
    id: 'bilan_buccodentaire',
    titre: 'Bilan bucco-dentaire',
    description: 'Examen dentaire (pris en charge à 100%)',
    saMin: 16,
    saMax: 28,
    type: 'examen',
    priorite: 'recommande',
    examens: [
      'Examen dentaire complet',
      'Détartrage si besoin',
      'Soins dentaires'
    ],
    conseils: [
      'Pris en charge intégralement par l\'Assurance Maladie',
      'Prévention gingivite gravidique',
      'Importance hygiène bucco-dentaire'
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
    id: 'preparation_naissance',
    titre: 'Séances préparation à la naissance',
    description: '8 séances de préparation (remboursées)',
    saMin: 24,
    saMax: 36,
    type: 'consultation',
    priorite: 'recommande',
    examens: [
      'Cours théoriques',
      'Exercices respiratoires',
      'Positions d\'accouchement',
      'Gestion de la douleur',
      'Allaitement',
      'Soins au bébé'
    ],
    conseils: [
      '8 séances prises en charge à 100%',
      'Peut être individuelle ou en groupe',
      'Différentes méthodes: classique, sophrologie, yoga, piscine...',
      'À débuter dès le 6ème mois'
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
    id: 'consultation_anesthesie',
    titre: 'Consultation anesthésie',
    description: 'Consultation obligatoire avec l\'anesthésiste',
    saMin: 32,
    saMax: 36,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Interrogatoire médical complet',
      'Antécédents chirurgicaux',
      'Allergies',
      'Traitements en cours',
      'Examen du dos/rachis',
      'Bilan sanguin (NFS, hémostase)'
    ],
    conseils: [
      'Obligatoire même si pas de péridurale souhaitée',
      'Apporter tous les examens médicaux',
      'Discuter du projet d\'analgésie',
      'Informations sur la péridurale et alternatives'
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
  {
    id: 'monitoring_foetal',
    titre: 'Monitoring fœtal',
    description: 'Enregistrement du rythme cardiaque fœtal',
    saMin: 37,
    saMax: 41,
    type: 'examen',
    priorite: 'recommande',
    examens: [
      'RCF (Rythme Cardiaque Fœtal)',
      'Enregistrement 20-30 minutes',
      'Réactivité fœtale',
      'Contractions utérines'
    ],
    conseils: [
      'Peut être fait lors des consultations hebdomadaires',
      'Rassurant pour la mère',
      'Détection anomalies RCF'
    ]
  },
  {
    id: 'consultation_terme',
    titre: 'Consultation de terme',
    description: 'Consultation à 41 SA si grossesse prolongée',
    saMin: 41,
    saMax: 41,
    type: 'consultation',
    priorite: 'obligatoire',
    examens: [
      'Examen clinique complet',
      'Monitoring fœtal',
      'Score de Bishop',
      'Échographie (quantité LA, Doppler)',
      'Décision déclenchement'
    ],
    conseils: [
      'Déclenchement systématique si >41 SA+3j',
      'Surveillance rapprochée',
      'Risque complications augmenté'
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
    id: 'consultation_pediatre_nne',
    titre: 'Consultation pédiatre nouveau-né',
    description: 'Examen du nouveau-né par le pédiatre J3-J5',
    saMin: 42,
    saMax: 42,
    type: 'consultation',
    priorite: 'recommande',
    examens: [
      'Examen clinique complet du bébé',
      'Poids, taille, périmètre crânien',
      'Réflexes archaïques',
      'Examen des hanches',
      'Ictère néonatal',
      'Alimentation (sein/biberon)'
    ],
    conseils: [
      'Dépistages néonatals (Guthrie)',
      'Test auditif',
      'Carnet de santé',
      'Conseils allaitement/biberon',
      'Prochaine consultation pédiatrique'
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

// Interface pour suggestions d'ordonnances
export interface OrdonnanceSuggestion {
  id: string
  nom: string
  description: string
  type: 'biologie' | 'echographie' | 'medicament' | 'autre'
  priorite: 'urgent' | 'recommande' | 'optionnel'
  templateNom?: string // Nom du template d'ordonnance à utiliser
}

// Fonction pour obtenir les recommandations pour une consultation
export function getConsultationRecommendations(currentSA: number): {
  examensAFaire: string[]
  prescriptionsAPrevoir: string[]
  pointsDeVigilance: string[]
  conseilsADonner: string[]
  ordonnancesSuggerees: OrdonnanceSuggestion[]
} {
  const { current } = getCalendarEventsForSA(currentSA)

  const examensAFaire: string[] = []
  const prescriptionsAPrevoir: string[] = []
  const pointsDeVigilance: string[] = []
  const conseilsADonner: string[] = []
  const ordonnancesSuggerees: OrdonnanceSuggestion[] = []

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

    // Ordonnances suggérées T1
    ordonnancesSuggerees.push({
      id: 'biologie_t1',
      nom: 'Bilan biologique T1',
      description: 'NFS, groupe sanguin, RAI, sérologies (toxo, rubéole, syphilis, VIH, VHB)',
      type: 'biologie',
      priorite: 'urgent',
      templateNom: 'Bilan biologique T1'
    })

    if (currentSA >= 8 && currentSA <= 11) {
      ordonnancesSuggerees.push({
        id: 'echo_t1',
        nom: 'Échographie T1',
        description: 'Échographie de datation et dépistage T1 (11-13 SA)',
        type: 'echographie',
        priorite: 'urgent',
        templateNom: 'Échographie T1'
      })
    }

    ordonnancesSuggerees.push({
      id: 'suppl_t1',
      nom: 'Supplémentation T1',
      description: 'Acide folique + Vitamine D',
      type: 'medicament',
      priorite: 'recommande',
      templateNom: 'Supplémentation grossesse T1'
    })

  } else if (currentSA >= 14 && currentSA < 28) {
    // T2
    pointsDeVigilance.push('Mouvements actifs fœtaux', 'Croissance (HU)', 'TA', 'Protéinurie')
    prescriptionsAPrevoir.push('Échographie T2 si non faite', 'NFS', 'RAI si Rh-')

    // Ordonnances suggérées T2
    if (currentSA >= 20 && currentSA <= 22) {
      ordonnancesSuggerees.push({
        id: 'echo_t2',
        nom: 'Échographie T2',
        description: 'Échographie morphologique T2 (22-24 SA)',
        type: 'echographie',
        priorite: 'urgent',
        templateNom: 'Échographie T2'
      })
    }

    ordonnancesSuggerees.push({
      id: 'biologie_t2',
      nom: 'Bilan biologique T2',
      description: 'NFS, RAI (si Rh-)',
      type: 'biologie',
      priorite: 'recommande',
      templateNom: 'Bilan biologique T2'
    })

    if (currentSA >= 24 && currentSA <= 28) {
      prescriptionsAPrevoir.push('Dépistage diabète gestationnel')
      ordonnancesSuggerees.push({
        id: 'hgpo',
        nom: 'Test diabète gestationnel',
        description: 'HGPO 75g (24-28 SA)',
        type: 'biologie',
        priorite: 'urgent',
        templateNom: 'Test diabète gestationnel'
      })
    }

    ordonnancesSuggerees.push({
      id: 'suppl_t2',
      nom: 'Supplémentation T2',
      description: 'Vitamine D + Fer si anémie',
      type: 'medicament',
      priorite: 'recommande',
      templateNom: 'Supplémentation grossesse T2'
    })

  } else if (currentSA >= 28) {
    // T3
    pointsDeVigilance.push('TA (pré-éclampsie)', 'MAF quotidiens', 'Contractions', 'Perte de liquide', 'Présentation fœtale')
    prescriptionsAPrevoir.push('Échographie T3 si non faite', 'NFS', 'RAI si Rh-')

    // Ordonnances suggérées T3
    if (currentSA >= 30 && currentSA <= 32) {
      ordonnancesSuggerees.push({
        id: 'echo_t3',
        nom: 'Échographie T3',
        description: 'Échographie de croissance T3 (32-34 SA)',
        type: 'echographie',
        priorite: 'urgent',
        templateNom: 'Échographie T3'
      })
    }

    ordonnancesSuggerees.push({
      id: 'biologie_t3',
      nom: 'Bilan biologique T3',
      description: 'NFS, RAI (si Rh-)',
      type: 'biologie',
      priorite: 'recommande',
      templateNom: 'Bilan biologique T3'
    })

    if (currentSA >= 35 && currentSA <= 37) {
      prescriptionsAPrevoir.push('Prélèvement vaginal Streptocoque B')
      ordonnancesSuggerees.push({
        id: 'pv_sgb',
        nom: 'Prélèvement vaginal SGB',
        description: 'Dépistage Streptocoque B (35-37 SA)',
        type: 'biologie',
        priorite: 'urgent',
        templateNom: 'Prélèvement vaginal Streptocoque B'
      })
    }

    if (currentSA >= 36) {
      conseilsADonner.push('Signes de travail', 'Quand venir à la maternité', 'Surveillance hebdomadaire')
    }

    ordonnancesSuggerees.push({
      id: 'suppl_t3',
      nom: 'Supplémentation T3',
      description: 'Vitamine D + Fer si anémie',
      type: 'medicament',
      priorite: 'recommande',
      templateNom: 'Supplémentation grossesse T3'
    })
  }

  return {
    examensAFaire: [...new Set(examensAFaire)],
    prescriptionsAPrevoir: [...new Set(prescriptionsAPrevoir)],
    pointsDeVigilance: [...new Set(pointsDeVigilance)],
    conseilsADonner: [...new Set(conseilsADonner)],
    ordonnancesSuggerees
  }
}

// Fonction pour obtenir les recommandations d'ordonnances pour une consultation gynécologique
export function getGynecologyRecommendations(motif: string): {
  ordonnancesSuggerees: OrdonnanceSuggestion[]
  examensAFaire: string[]
  conseilsADonner: string[]
} {
  const ordonnancesSuggerees: OrdonnanceSuggestion[] = []
  const examensAFaire: string[] = []
  const conseilsADonner: string[] = []

  const motifLower = motif.toLowerCase()

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
      motifLower.includes('stérilet') || motifLower.includes('diu') || motifLower.includes('implant')) {

    examensAFaire.push('Tension artérielle', 'Poids, IMC', 'Recherche contre-indications')
    conseilsADonner.push('Efficacité et mode d\'action expliqués', 'Préservatif en + pour protection IST')

    // Pas d'ordonnance pré-définie car dépend du choix de contraception
    // L'ordonnance sera faite manuellement selon le choix
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
