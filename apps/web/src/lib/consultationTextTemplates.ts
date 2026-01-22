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

  // Examen gynéco
  {
    id: 'gyneco_tv_normal',
    category: 'Examen gynécologique',
    label: 'TV normal',
    text: 'Toucher vaginal : col de taille et de consistance normales. Utérus antéversé, mobile, de taille normale. Annexes libres et indolores.',
    keywords: ['tv', 'toucher', 'vaginal', 'col', 'utérus']
  },
  {
    id: 'gyneco_speculum_normal',
    category: 'Examen gynécologique',
    label: 'Spéculum normal',
    text: 'Examen au spéculum : col rose, régulier. Glaire normale. Pas de leucorrhée pathologique.',
    keywords: ['spéculum', 'col', 'glaire', 'leucorrhée']
  },
  {
    id: 'gyneco_frottis',
    category: 'Examen gynécologique',
    label: 'Frottis réalisé',
    text: 'Frottis cervico-vaginal réalisé. Résultats attendus sous 3 semaines.',
    keywords: ['frottis', 'dépistage', 'col']
  },
  {
    id: 'gyneco_mycose',
    category: 'Examen gynécologique',
    label: 'Mycose',
    text: 'Examen au spéculum : leucorrhées blanches, aspect caséeux. Muqueuse inflammatoire. Aspect évocateur de mycose.',
    keywords: ['mycose', 'candidose', 'leucorrhées', 'pertes']
  },
  {
    id: 'gyneco_vulve_normal',
    category: 'Examen gynécologique',
    label: 'Vulve normale',
    text: 'Examen de la vulve : muqueuse rosée, sans lésion. Pas d\'inflammation.',
    keywords: ['vulve', 'muqueuse', 'normal']
  },
  {
    id: 'gyneco_diu_fils',
    category: 'Examen gynécologique',
    label: 'DIU en place',
    text: 'DIU en place, fils visibles au spéculum, longueur normale.',
    keywords: ['diu', 'stérilet', 'fils', 'contraception']
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

  // Conclusions gynéco
  {
    id: 'conclusion_gyneco_normal',
    category: 'Gynécologie',
    label: 'Consultation gynéco normale',
    text: 'Consultation sans particularité. Pas de signe d\'alerte. Prochain rendez-vous selon indication clinique.',
    keywords: ['normal', 'ras', 'gynéco']
  },
  {
    id: 'conclusion_contraception',
    category: 'Gynécologie',
    label: 'Contraception prescrite',
    text: 'Contraception prescrite. Informations données sur le mode d\'emploi, les effets secondaires et les signes d\'alerte. Consultation de contrôle à 3 mois.',
    keywords: ['contraception', 'pilule', 'diu', 'implant']
  },
  {
    id: 'conclusion_infection',
    category: 'Gynécologie',
    label: 'Infection traitée',
    text: 'Traitement prescrit. Amélioration attendue sous 48-72h. Reconsulter si persistance ou aggravation des symptômes.',
    keywords: ['infection', 'mycose', 'cystite', 'traitement']
  },
  {
    id: 'conclusion_depistage',
    category: 'Gynécologie',
    label: 'Dépistage réalisé',
    text: 'Examen gynécologique réalisé. Frottis cervico-vaginal effectué. Résultats attendus sous 3 semaines. Prochain dépistage selon recommandations.',
    keywords: ['dépistage', 'frottis', 'normal']
  },
  {
    id: 'conclusion_menopause',
    category: 'Gynécologie',
    label: 'Ménopause',
    text: 'Symptômes de ménopause. Traitement hormonal substitutif proposé/prescrit. Surveillance clinique et biologique régulière. Consultation de suivi dans 3 mois.',
    keywords: ['ménopause', 'ths', 'hormones']
  },
  {
    id: 'conclusion_surveillance_gyneco',
    category: 'Gynécologie',
    label: 'Surveillance gynéco',
    text: 'Situation nécessitant une surveillance. Examens complémentaires prescrits. Consultation de suivi programmée.',
    keywords: ['surveillance', 'suivi', 'examens']
  },
]

export const MOTIF_TEMPLATES: ConsultationTextTemplate[] = [
  // Motifs obstétrique
  {
    id: 'motif_suivi',
    category: 'Suivi grossesse',
    label: 'Consultation de suivi',
    text: 'Consultation de suivi de grossesse',
    keywords: ['suivi', 'contrôle']
  },
  {
    id: 'motif_declaration',
    category: 'Suivi grossesse',
    label: 'Déclaration grossesse',
    text: 'Première consultation - Déclaration de grossesse',
    keywords: ['déclaration', 'première']
  },
  {
    id: 'motif_douleurs',
    category: 'Symptômes grossesse',
    label: 'Douleurs abdominales',
    text: 'Douleurs abdominales',
    keywords: ['douleur', 'mal', 'ventre']
  },
  {
    id: 'motif_contractions',
    category: 'Symptômes grossesse',
    label: 'Contractions',
    text: 'Contractions utérines',
    keywords: ['contractions', 'travail']
  },
  {
    id: 'motif_saignements',
    category: 'Symptômes grossesse',
    label: 'Saignements',
    text: 'Saignements',
    keywords: ['saignement', 'sang', 'métrorragies']
  },
  {
    id: 'motif_maf',
    category: 'Symptômes grossesse',
    label: 'Baisse MAF',
    text: 'Baisse des mouvements actifs fœtaux',
    keywords: ['maf', 'mouvements', 'bébé']
  },

  // Motifs gynéco - Contraception
  {
    id: 'motif_contraception_pilule',
    category: 'Contraception',
    label: 'Contraception - Pilule',
    text: 'Demande de contraception orale (pilule)',
    keywords: ['contraception', 'pilule', 'œstroprogestatif']
  },
  {
    id: 'motif_contraception_diu',
    category: 'Contraception',
    label: 'Contraception - DIU',
    text: 'Demande de pose de DIU (stérilet)',
    keywords: ['contraception', 'diu', 'stérilet']
  },
  {
    id: 'motif_contraception_implant',
    category: 'Contraception',
    label: 'Contraception - Implant',
    text: 'Demande de pose d\'implant contraceptif',
    keywords: ['contraception', 'implant', 'nexplanon']
  },
  {
    id: 'motif_contraception_urgence',
    category: 'Contraception',
    label: 'Contraception d\'urgence',
    text: 'Demande de contraception d\'urgence',
    keywords: ['contraception', 'urgence', 'norlevo']
  },
  {
    id: 'motif_renouvellement_contraception',
    category: 'Contraception',
    label: 'Renouvellement contraception',
    text: 'Renouvellement de contraception',
    keywords: ['renouvellement', 'contraception', 'ordonnance']
  },

  // Motifs gynéco - Infections
  {
    id: 'motif_mycose',
    category: 'Infections',
    label: 'Mycose vaginale',
    text: 'Suspicion de mycose vaginale',
    keywords: ['mycose', 'candidose', 'démangeaisons', 'pertes']
  },
  {
    id: 'motif_ist',
    category: 'Infections',
    label: 'IST',
    text: 'Suspicion d\'infection sexuellement transmissible',
    keywords: ['ist', 'mst', 'infection']
  },
  {
    id: 'motif_cystite',
    category: 'Infections',
    label: 'Cystite',
    text: 'Infection urinaire / Cystite',
    keywords: ['cystite', 'infection', 'urinaire', 'brûlures']
  },

  // Motifs gynéco - Troubles du cycle
  {
    id: 'motif_dysmenorrhee',
    category: 'Troubles du cycle',
    label: 'Règles douloureuses',
    text: 'Dysménorrhée - Règles douloureuses',
    keywords: ['dysménorrhée', 'règles', 'douloureuses', 'douleurs']
  },
  {
    id: 'motif_menorragies',
    category: 'Troubles du cycle',
    label: 'Règles abondantes',
    text: 'Ménorragies - Règles abondantes',
    keywords: ['ménorragies', 'règles', 'abondantes', 'hémorragiques']
  },
  {
    id: 'motif_amenorrhee',
    category: 'Troubles du cycle',
    label: 'Absence de règles',
    text: 'Aménorrhée - Absence de règles',
    keywords: ['aménorrhée', 'absence', 'règles']
  },
  {
    id: 'motif_spotting',
    category: 'Troubles du cycle',
    label: 'Saignements entre les règles',
    text: 'Métrorragies / Spotting',
    keywords: ['métrorragies', 'spotting', 'saignements']
  },

  // Motifs gynéco - Autres
  {
    id: 'motif_menopause',
    category: 'Ménopause',
    label: 'Ménopause',
    text: 'Symptômes de ménopause',
    keywords: ['ménopause', 'bouffées', 'chaleur']
  },
  {
    id: 'motif_depistage',
    category: 'Dépistage',
    label: 'Dépistage',
    text: 'Consultation de dépistage gynécologique',
    keywords: ['dépistage', 'frottis', 'prévention']
  },
  {
    id: 'motif_douleurs_pelviennes',
    category: 'Douleurs',
    label: 'Douleurs pelviennes',
    text: 'Douleurs pelviennes',
    keywords: ['douleurs', 'pelviennes', 'bas-ventre']
  },
  {
    id: 'motif_suivi_gyneco',
    category: 'Suivi gynécologique',
    label: 'Suivi gynécologique',
    text: 'Consultation de suivi gynécologique',
    keywords: ['suivi', 'gynéco', 'contrôle']
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
