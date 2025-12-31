// Templates de consultation adaptés au terme de grossesse

export interface ConsultationTemplate {
  name: string
  saMin: number
  saMax: number
  examensRecommandes: string[]
  pointsVigilance: string[]
  questionsPoser: string[]
  prescriptionsSuggestions?: string[]
}

export const consultationTemplates: ConsultationTemplate[] = [
  // Premier trimestre
  {
    name: "Consultation prénatale 1er trimestre (avant 14 SA)",
    saMin: 0,
    saMax: 14,
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
    name: "Consultation prénatale 15-20 SA",
    saMin: 15,
    saMax: 20,
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
    name: "Consultation prénatale 21-28 SA",
    saMin: 21,
    saMax: 28,
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
    name: "Consultation prénatale 29-32 SA",
    saMin: 29,
    saMax: 32,
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
    name: "Consultation prénatale 33-37 SA",
    saMin: 33,
    saMax: 37,
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
    name: "Consultation à terme (≥ 37 SA)",
    saMin: 37,
    saMax: 42,
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
    name: "Consultation post-natale précoce (J1-J10)",
    saMin: -1, // Spécial post-partum
    saMax: -1,
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
