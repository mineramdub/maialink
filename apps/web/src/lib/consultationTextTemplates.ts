export interface ConsultationTextTemplate {
  id: string
  category: string
  label: string
  text: string
  keywords?: string[]
}

export const EXAMEN_CLINIQUE_TEMPLATES: ConsultationTextTemplate[] = [
  // Examen général
  {
    id: 'general_normal',
    category: 'Examen général',
    label: 'État général normal',
    text: 'Patiente en bon état général. Conscience normale, eupnéique, apyrétique.',
    keywords: ['normal', 'général', 'état']
  },
  {
    id: 'abdomen_souple',
    category: 'Examen obstétrical',
    label: 'Abdomen souple',
    text: 'Abdomen souple, non douloureux. Utérus non contractile.',
    keywords: ['abdomen', 'souple', 'utérus']
  },
  {
    id: 'col_ferme',
    category: 'Examen obstétrical',
    label: 'Col fermé',
    text: 'Col postérieur, long, fermé, tonique.',
    keywords: ['col', 'fermé', 'tv']
  },
  {
    id: 'col_modifie',
    category: 'Examen obstétrical',
    label: 'Col modifié',
    text: 'Col ramolli, raccourci, perméable au doigt.',
    keywords: ['col', 'modifié', 'dilaté']
  },
  {
    id: 'maf_present',
    category: 'Examen obstétrical',
    label: 'MAF présents',
    text: 'Mouvements actifs fœtaux perçus et rapportés par la patiente.',
    keywords: ['maf', 'mouvements', 'bébé']
  },
  {
    id: 'bcf_normal',
    category: 'Examen obstétrical',
    label: 'BCF normaux',
    text: 'Bruits du cœur fœtaux bien perçus, réguliers, normaux.',
    keywords: ['bcf', 'cœur', 'bébé']
  },
  
  // Seins
  {
    id: 'seins_normal',
    category: 'Seins',
    label: 'Seins normaux',
    text: 'Seins souples, non douloureux, sans écoulement.',
    keywords: ['seins', 'normal']
  },
  {
    id: 'seins_allaitement',
    category: 'Seins',
    label: 'Allaitement normal',
    text: 'Seins souples, non douloureux. Mamelons bien formés, non crevassés. Allaitement efficace.',
    keywords: ['seins', 'allaitement', 'post-partum']
  },
  {
    id: 'seins_engorgement',
    category: 'Seins',
    label: 'Engorgement',
    text: 'Seins tendus, chauds. Présence d\'un engorgement.',
    keywords: ['seins', 'engorgement', 'douleur']
  },

  // Membres inférieurs
  {
    id: 'mi_normal',
    category: 'Membres inférieurs',
    label: 'MI normaux',
    text: 'Membres inférieurs sans œdème, mollets souples, signe de Homans négatif.',
    keywords: ['jambes', 'œdème', 'membres']
  },
  {
    id: 'mi_oedeme',
    category: 'Membres inférieurs',
    label: 'Œdèmes',
    text: 'Présence d\'œdèmes des membres inférieurs, bilatéraux, prenant le godet.',
    keywords: ['jambes', 'œdème', 'gonflement']
  },

  // Post-partum
  {
    id: 'pp_lochies_normal',
    category: 'Post-partum',
    label: 'Lochies normales',
    text: 'Lochies peu abondantes, rosées, sans odeur fétide.',
    keywords: ['lochies', 'saignements', 'post-partum']
  },
  {
    id: 'pp_uterus_involute',
    category: 'Post-partum',
    label: 'Involution normale',
    text: 'Utérus bien involué, non douloureux à la palpation.',
    keywords: ['utérus', 'involution', 'post-partum']
  },
  {
    id: 'pp_cicatrice',
    category: 'Post-partum',
    label: 'Cicatrice normale',
    text: 'Cicatrice propre, non inflammatoire, en bonne voie de cicatrisation.',
    keywords: ['cicatrice', 'épisiotomie', 'césarienne']
  },
  {
    id: 'pp_perinee',
    category: 'Post-partum',
    label: 'Périnée normal',
    text: 'Périnée souple, tonique, pas de douleur à la palpation.',
    keywords: ['périnée', 'rééducation', 'post-partum']
  },
]

export const CONCLUSION_TEMPLATES: ConsultationTextTemplate[] = [
  {
    id: 'conclusion_normal',
    category: 'Grossesse normale',
    label: 'Consultation normale',
    text: 'Consultation sans particularité. Grossesse évolutive normale. Prochain rendez-vous dans 1 mois ou en cas de signes d\'alerte (contractions, saignements, fièvre, baisse des MAF).',
    keywords: ['normal', 'ras', 'évolutive']
  },
  {
    id: 'conclusion_t1',
    category: 'Grossesse normale',
    label: 'T1 normal',
    text: 'Premier trimestre se déroulant normalement. Prescription des examens du 1er trimestre. Rendez-vous à prévoir pour l\'échographie T1. Conseils d\'hygiène de vie donnés.',
    keywords: ['t1', 'trimestre', 'début']
  },
  {
    id: 'conclusion_t2',
    category: 'Grossesse normale',
    label: 'T2 normal',
    text: 'Deuxième trimestre se déroulant normalement. Examens biologiques à prévoir. Échographie T2 à planifier entre 22-24 SA. Entretien prénatal précoce réalisé/à prévoir.',
    keywords: ['t2', 'trimestre', 'milieu']
  },
  {
    id: 'conclusion_t3',
    category: 'Grossesse normale',
    label: 'T3 normal',
    text: 'Troisième trimestre. Grossesse évolutive. Examens du 3e trimestre prescrits. Consultation anesthésie à planifier. Préparation à la naissance conseillée.',
    keywords: ['t3', 'trimestre', 'fin']
  },
  {
    id: 'conclusion_surveillance',
    category: 'Surveillance',
    label: 'Surveillance rapprochée',
    text: 'Situation nécessitant une surveillance rapprochée. Prochain rendez-vous dans 1 semaine. Consignes de surveillance données à la patiente.',
    keywords: ['surveillance', 'attention', 'rapproché']
  },
  {
    id: 'conclusion_orientation',
    category: 'Orientation',
    label: 'Orientation maternité',
    text: 'Situation nécessitant un avis obstétrical. Patiente orientée vers la maternité. Courrier rédigé.',
    keywords: ['orientation', 'urgence', 'maternité']
  },
  {
    id: 'conclusion_pp_normal',
    category: 'Post-partum',
    label: 'PP normal',
    text: 'Suites de couches simples. Involution utérine normale. Allaitement maternel/artificiel mis en place. Rééducation périnéale à débuter à partir de 6 semaines.',
    keywords: ['post-partum', 'suites', 'couches']
  },
]

export const MOTIF_TEMPLATES: ConsultationTextTemplate[] = [
  {
    id: 'motif_suivi',
    category: 'Suivi',
    label: 'Consultation de suivi',
    text: 'Consultation de suivi de grossesse',
    keywords: ['suivi', 'contrôle']
  },
  {
    id: 'motif_declaration',
    category: 'Administratif',
    label: 'Déclaration grossesse',
    text: 'Première consultation - Déclaration de grossesse',
    keywords: ['déclaration', 'première']
  },
  {
    id: 'motif_douleurs',
    category: 'Symptômes',
    label: 'Douleurs abdominales',
    text: 'Douleurs abdominales',
    keywords: ['douleur', 'mal', 'ventre']
  },
  {
    id: 'motif_contractions',
    category: 'Symptômes',
    label: 'Contractions',
    text: 'Contractions utérines',
    keywords: ['contractions', 'travail']
  },
  {
    id: 'motif_saignements',
    category: 'Symptômes',
    label: 'Saignements',
    text: 'Saignements',
    keywords: ['saignement', 'sang', 'métrorragies']
  },
  {
    id: 'motif_maf',
    category: 'Symptômes',
    label: 'Baisse MAF',
    text: 'Baisse des mouvements actifs fœtaux',
    keywords: ['maf', 'mouvements', 'bébé']
  },
]

export function searchTemplates(
  templates: ConsultationTextTemplate[],
  query: string
): ConsultationTextTemplate[] {
  const lowerQuery = query.toLowerCase()
  return templates.filter(
    (t) =>
      t.label.toLowerCase().includes(lowerQuery) ||
      t.text.toLowerCase().includes(lowerQuery) ||
      t.keywords?.some((k) => k.toLowerCase().includes(lowerQuery))
  )
}

export function getTemplatesByCategory(
  templates: ConsultationTextTemplate[],
  category: string
): ConsultationTextTemplate[] {
  return templates.filter((t) => t.category === category)
}
