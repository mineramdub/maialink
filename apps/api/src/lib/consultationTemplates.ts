// Templates de consultation adaptés au terme de grossesse

export interface ConsultationTemplate {
  id: string
  name: string
  description: string
  type: 'prenatale' | 'postnatale' | 'gyneco' | 'epp' | 'preparation' | 'autre'
  saMin: number
  saMax: number
  data: {
    motif?: string
    examenClinique?: string
    conclusion?: string
  }
  examensRecommandes: string[]
  pointsVigilance: string[]
  questionsPoser: string[]
  prescriptionsSuggestions?: string[]
}

export const consultationTemplates: ConsultationTemplate[] = [
  // EPP - Entretien Prénatal Précoce
  {
    id: 'epp',
    name: "Entretien Prénatal Précoce (EPP)",
    description: "Entretien obligatoire pour préparer la grossesse et identifier les besoins",
    type: 'epp',
    saMin: 16,
    saMax: 20,
    data: {
      motif: "Entretien Prénatal Précoce (EPP) - Échange autour du projet de naissance",
      examenClinique: "Pas d'examen clinique systématique lors de l'EPP.\n\nTemps d'écoute et d'échange privilégié avec la patiente et son entourage.",
      conclusion: "EPP réalisé.\n\nBesoins identifiés et orientation proposée.\n\nProchain RDV : consultation prénatale du [X]ème mois."
    },
    examensRecommandes: [],
    pointsVigilance: [
      "Situation sociale et professionnelle",
      "Soutien familial et entourage",
      "Violences conjugales ou intrafamiliales",
      "Addictions (tabac, alcool, drogues)",
      "Santé mentale (anxiété, dépression)",
      "Précarité ou difficultés financières",
      "Isolement social",
      "Antécédents traumatiques"
    ],
    questionsPoser: [
      "Comment vivez-vous cette grossesse?",
      "Votre entourage vous soutient-il?",
      "Avez-vous des inquiétudes particulières?",
      "Situation professionnelle et aménagements nécessaires?",
      "Projet de naissance (lieu, accompagnement)?",
      "Souhaitez-vous allaiter?",
      "Préparation à la naissance envisagée?",
      "Avez-vous déjà réfléchi au mode de garde?",
      "Ressources disponibles (famille, amis)?",
      "Questions sur le déroulement de la grossesse?",
      "Besoin d'accompagnement spécifique?",
      "Consommation de substances?",
      "Vous sentez-vous en sécurité à votre domicile?"
    ],
    prescriptionsSuggestions: [
      "Séances de préparation à la naissance (8 séances remboursées)",
      "Orientation PMI si besoin d'accompagnement social",
      "Consultation psychologique si nécessaire",
      "Consultation diététique si besoin",
      "Sevrage tabagique (consultation tabacologue)",
      "Entretien post-natal à programmer (4ème mois post-partum)"
    ]
  },

  // Premier trimestre
  {
    id: 'prenatal_t1',
    name: "Consultation prénatale 1er trimestre (avant 14 SA)",
    description: "Première consultation de grossesse, déclaration et examens initiaux",
    type: 'prenatale',
    saMin: 0,
    saMax: 14,
    data: {
      motif: "Première consultation prénatale - Déclaration de grossesse",
      examenClinique: "Examen général\nPoids: [X] kg - IMC: [X]\nTension artérielle: [X]/[X] mmHg\nExamen gynécologique: col fermé, utérus gravide\nBruits du cœur fœtal: perçus au doppler\nMembres inférieurs: pas de varices ni d'œdèmes",
      conclusion: "Grossesse évolutive de [X] SA.\nPatiente informée du suivi de grossesse.\nDéclaration de grossesse remise.\nProchain RDV: consultation 2ème mois."
    },
    examensRecommandes: [
      "Tension artérielle",
      "Poids et IMC",
      "Examen gynécologique",
      "Hauteur utérine",
      "Bruits du cœur fœtal (doppler dès 10 SA)",
      "Bandelette urinaire (protéinurie, glycosurie)",
      "Examen des membres inférieurs (varices, œdèmes)"
    ],
    pointsVigilance: [
      "Nausées et vomissements (gravité?)",
      "Saignements vaginaux",
      "Douleurs abdominales",
      "Facteurs de risque (âge, antécédents, IMC)",
      "Exposition à des toxiques (tabac, alcool)",
      "Statut vaccinal (rubéole, toxoplasmose)",
      "Groupe sanguin et RAI si Rh négatif"
    ],
    questionsPoser: [
      "Date des dernières règles (DDR)?",
      "Avez-vous des nausées ou vomissements?",
      "Saignements ou pertes anormales?",
      "Douleurs abdominales?",
      "Antécédents médicaux et chirurgicaux?",
      "Antécédents obstétricaux (grossesses précédentes)?",
      "Prise de médicaments ou suppléments?",
      "Consommation tabac/alcool?",
      "Profession (exposition risques?)"
    ],
    prescriptionsSuggestions: [
      "Acide folique 400μg/jour (si pas déjà commencé)",
      "Vitamine D 400-800 UI/jour",
      "Bilan sanguin complet (NFS, groupe, sérologies)",
      "Échographie de datation (11-13 SA + 6j)",
      "Dépistage trisomie 21 (si souhaité)",
      "Consultation génétique si antécédents",
      "Toxoplasmose mensuelle si non immune"
    ]
  },

  // Deuxième trimestre précoce
  {
    id: 'prenatal_t2_early',
    name: "Consultation prénatale 15-20 SA",
    description: "Consultation 2ème trimestre précoce - Mouvements actifs fœtaux",
    type: 'prenatale',
    saMin: 15,
    saMax: 20,
    data: {
      motif: "Consultation prénatale 2ème trimestre - Suivi de grossesse",
      examenClinique: "Poids: [X] kg (prise: [X] kg depuis début grossesse)\nTension artérielle: [X]/[X] mmHg\nHauteur utérine: [X] cm\nBruits du cœur fœtal: [X] bpm\nMouvements actifs fœtaux: perçus par la patiente\nBandelette urinaire: négative",
      conclusion: "Grossesse évolutive de [X] SA + [X]j.\nSuivi de grossesse conforme.\nProchain RDV: consultation du [X]ème mois."
    },
    examensRecommandes: [
      "Tension artérielle",
      "Poids",
      "Hauteur utérine",
      "Bruits du cœur fœtal",
      "Bandelette urinaire",
      "Mouvements actifs fœtaux (dès 18-20 SA)",
      "Examen des membres inférieurs"
    ],
    pointsVigilance: [
      "Mouvements actifs fœtaux ressentis?",
      "Contractions utérines",
      "Pertes vaginales anormales",
      "Signes d'infection urinaire",
      "Diabète gestationnel (si facteurs de risque)"
    ],
    questionsPoser: [
      "Sentez-vous bébé bouger?",
      "Contractions ou douleurs abdominales?",
      "Pertes vaginales inhabituelles?",
      "Signes urinaires (brûlures, envies fréquentes)?",
      "Fatigue excessive?",
      "Jambes lourdes, œdèmes?"
    ],
    prescriptionsSuggestions: [
      "Échographie morphologique (20-24 SA)",
      "Glycémie à jeun (dépistage diabète gestationnel)",
      "Fer si anémie (NFS de contrôle)",
      "Toxoplasmose si non immune",
      "Consultation anesthésiste à programmer (7-8ème mois)"
    ]
  },

  // Deuxième trimestre tardif
  {
    id: 'prenatal_t2_late',
    name: "Consultation prénatale 21-28 SA",
    description: "Consultation 2ème trimestre tardif - Dépistage diabète gestationnel",
    type: 'prenatale',
    saMin: 21,
    saMax: 28,
    data: {
      motif: "Consultation prénatale 2ème trimestre tardif - Suivi de grossesse",
      examenClinique: "Poids: [X] kg\nTension artérielle: [X]/[X] mmHg\nHauteur utérine: [X] cm (conforme au terme)\nBruits du cœur fœtal: [X] bpm, bien perçus\nMouvements actifs fœtaux: réguliers\nBandelette urinaire: négative\nMembres inférieurs: pas d'œdèmes",
      conclusion: "Grossesse évolutive de [X] SA + [X]j.\nPas de signe d'appel pathologique.\nProchain RDV: consultation du [X]ème mois."
    },
    examensRecommandes: [
      "Tension artérielle",
      "Poids (surveillance prise pondérale)",
      "Hauteur utérine",
      "Bruits du cœur fœtal",
      "Bandelette urinaire",
      "Mouvements actifs fœtaux",
      "Œdèmes membres inférieurs",
      "Col utérin (TV si menace accouchement prématuré)"
    ],
    pointsVigilance: [
      "Diabète gestationnel (HGPO 24-28 SA)",
      "Menace d'accouchement prématuré",
      "Retard de croissance intra-utérin",
      "Hypertension artérielle débutante",
      "Anémie",
      "Infections cervico-vaginales"
    ],
    questionsPoser: [
      "Mouvements fœtaux réguliers?",
      "Contractions régulières ou douloureuses?",
      "Pertes de liquide?",
      "Œdèmes importants (mains, visage)?",
      "Maux de tête, troubles visuels?",
      "Résultats échographie morphologique?"
    ],
    prescriptionsSuggestions: [
      "HGPO 75g si non fait (24-28 SA)",
      "NFS de contrôle",
      "RAI si Rh négatif (28 SA)",
      "Prévention Rhésus si nécessaire (Rhophylac 300μg IM)",
      "Échographie de croissance si RCIU suspecté",
      "Repos si menace accouchement prématuré",
      "Fer si anémie confirmée"
    ]
  },

  // Troisième trimestre précoce
  {
    id: 'prenatal_t3_early',
    name: "Consultation prénatale 29-32 SA",
    description: "Consultation 3ème trimestre précoce - Surveillance pré-éclampsie",
    type: 'prenatale',
    saMin: 29,
    saMax: 32,
    data: {
      motif: "Consultation prénatale 3ème trimestre - Suivi de grossesse",
      examenClinique: "Poids: [X] kg\nTension artérielle: [X]/[X] mmHg\nHauteur utérine: [X] cm\nBruits du cœur fœtal: [X] bpm\nMouvements actifs fœtaux: réguliers\nPrésentation fœtale: [céphalique/siège]\nBandelette urinaire: négative\nMembres inférieurs: pas d'œdèmes",
      conclusion: "Grossesse évolutive de [X] SA + [X]j.\nSurveillance renforcée 3ème trimestre.\nProchain RDV: consultation du [X]ème mois."
    },
    examensRecommandes: [
      "Tension artérielle",
      "Poids",
      "Hauteur utérine (courbe de croissance)",
      "Bruits du cœur fœtal",
      "Bandelette urinaire (protéinurie++)",
      "Mouvements actifs fœtaux",
      "Œdèmes",
      "Présentation fœtale (palpation abdominale)",
      "Col utérin"
    ],
    pointsVigilance: [
      "Pré-éclampsie (HTA + protéinurie)",
      "Retard de croissance",
      "Macrosomie (diabète)",
      "Menace accouchement prématuré",
      "Présentation en siège",
      "Placenta prævia",
      "Anémie"
    ],
    questionsPoser: [
      "Mouvements fœtaux quotidiens?",
      "Contractions régulières?",
      "Pertes de liquide ou saignements?",
      "Œdèmes des mains et visage?",
      "Maux de tête persistants?",
      "Troubles visuels (mouches volantes)?",
      "Douleur épigastrique (barre)?",
      "Préparation à l'accouchement commencée?"
    ],
    prescriptionsSuggestions: [
      "Échographie de croissance (3ème trimestre)",
      "NFS, RAI si Rh négatif",
      "Consultation anesthésiste (obligatoire avant 37 SA)",
      "Frottis vaginal (Streptocoque B) à 35-37 SA",
      "Version par manœuvre externe si siège (après 36 SA)",
      "Enregistrement cardiotocographique si suspicion anomalie"
    ]
  },

  // Troisième trimestre tardif
  {
    id: 'prenatal_t3_late',
    name: "Consultation prénatale 33-37 SA",
    description: "Consultation 3ème trimestre tardif - Préparation accouchement",
    type: 'prenatale',
    saMin: 33,
    saMax: 37,
    data: {
      motif: "Consultation prénatale 3ème trimestre tardif - Préparation accouchement",
      examenClinique: "Poids: [X] kg\nTension artérielle: [X]/[X] mmHg\nHauteur utérine: [X] cm\nBruits du cœur fœtal: [X] bpm\nMouvements actifs fœtaux: réguliers\nPrésentation fœtale: céphalique, [non engagée/engagée]\nScore de Bishop: [X]/13\nBandelette urinaire: négative",
      conclusion: "Grossesse de [X] SA + [X]j.\nPrésentation céphalique.\nProjet de naissance discuté.\nConsultation anesthésiste réalisée.\nProchain RDV: consultation à terme."
    },
    examensRecommandes: [
      "Tension artérielle",
      "Poids",
      "Hauteur utérine",
      "Bruits du cœur fœtal",
      "Bandelette urinaire",
      "Mouvements actifs fœtaux",
      "Œdèmes",
      "Présentation fœtale",
      "Col utérin (score de Bishop)",
      "Palpation abdominale (engagement)"
    ],
    pointsVigilance: [
      "Pré-éclampsie",
      "Retard de croissance sévère",
      "Oligoamnios/Hydramnios",
      "Présentation dystocique",
      "Rupture prématurée membranes",
      "Maturation cervicale",
      "Streptocoque B positif"
    ],
    questionsPoser: [
      "Contractions régulières?",
      "Perte du bouchon muqueux?",
      "Pertes de liquide?",
      "Diminution mouvements fœtaux?",
      "Saignements?",
      "Projet de naissance défini?",
      "Maternité choisie?",
      "Valise maternité prête?",
      "Mode d'allaitement souhaité?"
    ],
    prescriptionsSuggestions: [
      "Frottis vaginal Streptocoque B (35-37 SA)",
      "Monitoring fœtal si facteurs de risque",
      "Échographie de présentation",
      "Consultation anesthésiste si non faite",
      "Antibioprophylaxie si Strepto B+ (pendant travail)",
      "Maturation cervicale si dépassement terme",
      "RDV maternité pour déclenchement si nécessaire"
    ]
  },

  // Terme et dépassement
  {
    id: 'prenatal_term',
    name: "Consultation à terme (≥ 37 SA)",
    description: "Consultation à terme - Surveillance rapprochée",
    type: 'prenatale',
    saMin: 37,
    saMax: 42,
    data: {
      motif: "Consultation à terme - Surveillance grossesse à terme",
      examenClinique: "Poids: [X] kg\nTension artérielle: [X]/[X] mmHg\nHauteur utérine: [X] cm\nBruits du cœur fœtal: [X] bpm, réguliers\nMouvements actifs fœtaux: ressentis quotidiennement\nPrésentation: céphalique, [engagement]\nScore de Bishop: [X]/13\nMonitoring fœtal: RCF réactif, pas de contractions\nBandelette urinaire: négative",
      conclusion: "Grossesse à terme de [X] SA + [X]j.\nSurveillance rapprochée.\nSignes de début de travail expliqués.\nProchain RDV: surveillance à terme ou début travail."
    },
    examensRecommandes: [
      "Tension artérielle",
      "Poids",
      "Hauteur utérine",
      "Bruits du cœur fœtal",
      "Bandelette urinaire",
      "Mouvements actifs fœtaux",
      "Présentation et engagement",
      "Col utérin (score de Bishop détaillé)",
      "Monitoring fœtal (NST)",
      "Perte bouchon muqueux"
    ],
    pointsVigilance: [
      "Dépassement de terme (> 41 SA)",
      "Diminution mouvements fœtaux",
      "Oligoamnios",
      "Macrosomie",
      "Signes de souffrance fœtale",
      "Rupture membranes",
      "Début travail"
    ],
    questionsPoser: [
      "Contractions régulières et douloureuses?",
      "Perte des eaux?",
      "Perte bouchon muqueux?",
      "Saignements?",
      "Mouvements fœtaux normaux?",
      "Prête pour accouchement?",
      "Questions sur le travail?"
    ],
    prescriptionsSuggestions: [
      "Monitoring fœtal bihebdomadaire si > 41 SA",
      "Échographie (liquide amniotique, poids fœtal)",
      "Déclenchement si > 41 SA (discuter modalités)",
      "Admission maternité si début travail",
      "Maturation cervicale si col défavorable",
      "Rupture artificielle membranes si indiquée"
    ]
  },

  // Post-partum
  {
    id: 'postpartum_early',
    name: "Consultation post-natale précoce (J1-J10)",
    description: "Visite post-natale précoce - Mère et bébé",
    type: 'postnatale',
    saMin: -1, // Spécial post-partum
    saMax: -1,
    data: {
      motif: "Consultation post-natale précoce - Visite à domicile J[X]",
      examenClinique: "État général: bon\nTempérature: [X]°C\nTension artérielle: [X]/[X] mmHg\nSeins: [souples/tendus/engorgés], [crevasses]\nHauteur utérine: [X] cm (involution normale)\nLochies: [normales/abondantes], aspect [physiologique]\nPérinée: [cicatrisation normale/œdème/hématome]\nMembres inférieurs: pas de signes de phlébite\nÉtat psychologique: [bien/fatigue/baby blues]",
      conclusion: "Suites de couches simples à J[X].\nAllaitement [maternel/artificiel]: [bien installé/difficultés].\nRééducation périnéale à programmer.\nProchain RDV: visite post-natale à 6-8 semaines."
    },
    examensRecommandes: [
      "Tension artérielle",
      "Température",
      "Examen des seins (engorgement, crevasses)",
      "Hauteur utérine (involution)",
      "Lochies (aspect, quantité, odeur)",
      "Périnée (cicatrisation épisiotomie/déchirure)",
      "Cicatrice césarienne si applicable",
      "Membres inférieurs (phlébite)",
      "État psychologique (baby blues)"
    ],
    pointsVigilance: [
      "Hémorragie du post-partum tardive",
      "Infection (endométrite, infection cicatrice)",
      "Thrombose veineuse",
      "Anémie post-hémorragique",
      "Difficultés allaitement",
      "Dépression post-partum",
      "Incontinence urinaire ou fécale"
    ],
    questionsPoser: [
      "Allaitement: comment ça se passe?",
      "Douleurs périnéales ou cicatrice?",
      "Saignements abondants ou malodorants?",
      "Fièvre ou frissons?",
      "Seins douloureux?",
      "Mictions normales?",
      "Selles (constipation)?",
      "Moral et soutien familial?",
      "Repos suffisant?",
      "Contraception envisagée?"
    ],
    prescriptionsSuggestions: [
      "Fer si anémie",
      "Antalgiques si douleurs périnéales",
      "Soins périnée (bains de siège)",
      "Conseil allaitement ou lait artificiel",
      "Contraception (microprogestatif si allaitement)",
      "Séances rééducation périnéale (ordonnance dès J10)",
      "Suivi psychologique si baby blues",
      "Échographie pelvienne si doute rétention"
    ]
  }
]

// Fonction pour obtenir le template adapté au terme
export function getTemplateForSA(sa: number): ConsultationTemplate | null {
  if (sa < 0) {
    // Post-partum
    return consultationTemplates.find(t => t.saMin === -1) || null
  }

  return consultationTemplates.find(t => sa >= t.saMin && sa <= t.saMax) || null
}

// Fonction pour générer une consultation pré-remplie
export function generateConsultationFromTemplate(
  sa: number,
  patientData?: {
    lastWeight?: number
    lastTension?: { systolique: number; diastolique: number }
  }
): Partial<any> {
  const template = getTemplateForSA(sa)

  if (!template) {
    return {}
  }

  const observations = `# ${template.name}\n\n` +
    `## Examens recommandés:\n${template.examensRecommandes.map(e => `- [ ] ${e}`).join('\n')}\n\n` +
    `## Points de vigilance:\n${template.pointsVigilance.map(p => `- ${p}`).join('\n')}\n\n` +
    `## Questions à poser:\n${template.questionsPoser.map(q => `- ${q}`).join('\n')}\n`

  return {
    saTerm: Math.floor(sa),
    saJours: Math.round((sa - Math.floor(sa)) * 7),
    observations,
    prescriptions: template.prescriptionsSuggestions?.join('\n') || '',
  }
}

// Fonction pour générer des alertes/rappels automatiques
export function generateReminders(sa: number, lastConsultDate?: Date): Array<{
  type: string
  message: string
  severity: 'info' | 'warning' | 'urgent'
  dueDate?: Date
}> {
  const reminders: Array<{
    type: string
    message: string
    severity: 'info' | 'warning' | 'urgent'
    dueDate?: Date
  }> = []

  // Échographie de datation (11-13 SA)
  if (sa >= 10 && sa < 11) {
    reminders.push({
      type: 'examen',
      message: 'Échographie de datation à programmer (11-13 SA + 6j)',
      severity: 'warning',
      dueDate: addWeeks(new Date(), 1)
    })
  }

  // Dépistage trisomie 21
  if (sa >= 11 && sa <= 13) {
    reminders.push({
      type: 'depistage',
      message: 'Proposition dépistage trisomie 21 (combiné ou ADN libre circulant)',
      severity: 'info'
    })
  }

  // Échographie morphologique (20-24 SA)
  if (sa >= 19 && sa < 20) {
    reminders.push({
      type: 'examen',
      message: 'Échographie morphologique à programmer (20-24 SA)',
      severity: 'warning',
      dueDate: addWeeks(new Date(), 1)
    })
  }

  // HGPO (24-28 SA)
  if (sa >= 23 && sa < 24) {
    reminders.push({
      type: 'examen',
      message: 'HGPO 75g à programmer (dépistage diabète gestationnel) - 24-28 SA',
      severity: 'warning',
      dueDate: addWeeks(new Date(), 1)
    })
  }

  // Prévention Rhésus (28 SA)
  if (sa >= 27 && sa < 28) {
    reminders.push({
      type: 'prevention',
      message: 'RAI et prévention Rhésus si Rh négatif (28 SA)',
      severity: 'warning'
    })
  }

  // Consultation anesthésiste (avant 37 SA)
  if (sa >= 28 && sa < 32) {
    reminders.push({
      type: 'consultation',
      message: 'Consultation anesthésiste obligatoire à programmer (avant 37 SA)',
      severity: 'warning',
      dueDate: addWeeks(new Date(), 4)
    })
  }

  // Frottis Streptocoque B (35-37 SA)
  if (sa >= 34 && sa < 35) {
    reminders.push({
      type: 'examen',
      message: 'Frottis vaginal Streptocoque B à réaliser (35-37 SA)',
      severity: 'warning',
      dueDate: addWeeks(new Date(), 1)
    })
  }

  // Consultation anesthésiste urgente si pas faite
  if (sa >= 35 && sa < 37) {
    reminders.push({
      type: 'consultation',
      message: '⚠️ Consultation anesthésiste OBLIGATOIRE si non réalisée',
      severity: 'urgent'
    })
  }

  // Surveillance rapprochée à terme
  if (sa >= 37) {
    reminders.push({
      type: 'surveillance',
      message: 'Grossesse à terme - Surveillance rapprochée recommandée',
      severity: 'info'
    })
  }

  // Dépassement de terme
  if (sa >= 41) {
    reminders.push({
      type: 'urgence',
      message: '⚠️ DÉPASSEMENT DE TERME - Monitoring + déclenchement à discuter',
      severity: 'urgent'
    })
  }

  return reminders
}

// Helper function
function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + weeks * 7)
  return result
}

// Get templates by consultation type
export function getTemplatesByType(type: string): ConsultationTemplate[] {
  return consultationTemplates.filter(t => t.type === type)
}

// Get template by ID
export function getTemplateById(id: string): ConsultationTemplate | undefined {
  return consultationTemplates.find(t => t.id === id)
}
