// Cotations NGAP pour les sages-femmes
// Base 2024

export interface CotationNGAP {
  code: string
  libelle: string
  lettreCle: string
  coefficient: number
  tarifBase: number
  categorie: string
  description?: string
}

// Valeurs des lettres cles (tarifs 2024)
export const LETTRES_CLES = {
  C: 25.0,    // Consultation
  SF: 3.15,   // Actes techniques sages-femmes
  SP: 2.80,   // Soins et pansements (non utilise SF)
}

export const COTATIONS_SAGE_FEMME: CotationNGAP[] = [
  // Consultations
  {
    code: 'C',
    libelle: 'Consultation',
    lettreCle: 'C',
    coefficient: 1,
    tarifBase: 25.0,
    categorie: 'consultation',
    description: 'Consultation de sage-femme',
  },
  {
    code: 'CSF',
    libelle: 'Consultation de suivi',
    lettreCle: 'C',
    coefficient: 1,
    tarifBase: 25.0,
    categorie: 'consultation',
    description: 'Consultation de suivi de grossesse ou gynecologique',
  },

  // Suivi de grossesse
  {
    code: 'C + MIS',
    libelle: 'Consultation avec majoration',
    lettreCle: 'C',
    coefficient: 1,
    tarifBase: 28.0,
    categorie: 'grossesse',
    description: 'Consultation avec majoration interim sortie',
  },
  {
    code: 'SF 12',
    libelle: 'Surveillance de grossesse pathologique',
    lettreCle: 'SF',
    coefficient: 12,
    tarifBase: 37.80,
    categorie: 'grossesse',
    description: 'Surveillance a domicile de grossesse pathologique',
  },
  {
    code: 'SF 15',
    libelle: 'Monitoring foetal',
    lettreCle: 'SF',
    coefficient: 15,
    tarifBase: 47.25,
    categorie: 'grossesse',
    description: 'Enregistrement du rythme cardiaque foetal',
  },

  // Post-partum
  {
    code: 'SF 6',
    libelle: 'Visite post-natale',
    lettreCle: 'SF',
    coefficient: 6,
    tarifBase: 18.90,
    categorie: 'postpartum',
    description: 'Visite de sortie de maternite',
  },
  {
    code: 'SF 9',
    libelle: 'Seance de suivi post-natal',
    lettreCle: 'SF',
    coefficient: 9,
    tarifBase: 28.35,
    categorie: 'postpartum',
    description: 'Seance de suivi post-natal',
  },
  {
    code: 'SF 12,6',
    libelle: 'Visite longue post-natale',
    lettreCle: 'SF',
    coefficient: 12.6,
    tarifBase: 39.69,
    categorie: 'postpartum',
    description: 'Visite longue a domicile J0-J2',
  },

  // Allaitement
  {
    code: 'SF 2,5',
    libelle: 'Conseil allaitement',
    lettreCle: 'SF',
    coefficient: 2.5,
    tarifBase: 7.88,
    categorie: 'allaitement',
    description: 'Consultation allaitement',
  },

  // Preparation a la naissance
  {
    code: 'SF 17',
    libelle: 'Seance preparation individuelle',
    lettreCle: 'SF',
    coefficient: 17,
    tarifBase: 53.55,
    categorie: 'preparation',
    description: 'Seance individuelle de preparation a la naissance',
  },
  {
    code: 'SF 10,6',
    libelle: 'Seance preparation collective',
    lettreCle: 'SF',
    coefficient: 10.6,
    tarifBase: 33.39,
    categorie: 'preparation',
    description: 'Seance collective de preparation (3 a 6 femmes)',
  },
  {
    code: 'SF 21',
    libelle: 'Entretien prenatal precoce',
    lettreCle: 'SF',
    coefficient: 21,
    tarifBase: 46.0,
    categorie: 'preparation',
    description: 'Entretien prenatal precoce (obligatoire)',
  },

  // Reeducation perineale
  {
    code: 'SF 7',
    libelle: 'Seance de reeducation perineale',
    lettreCle: 'SF',
    coefficient: 7,
    tarifBase: 22.05,
    categorie: 'reeducation',
    description: 'Seance de reeducation perineale avec ou sans biofeedback',
  },
  {
    code: 'SF 8',
    libelle: 'Bilan perineal',
    lettreCle: 'SF',
    coefficient: 8,
    tarifBase: 25.20,
    categorie: 'reeducation',
    description: 'Bilan perineal initial',
  },

  // Gynecologie
  {
    code: 'SF 9,5',
    libelle: 'Frottis cervico-uterin',
    lettreCle: 'SF',
    coefficient: 9.5,
    tarifBase: 29.93,
    categorie: 'gyneco',
    description: 'Prelevement cervico-uterin (FCU)',
  },
  {
    code: 'SF 4,4',
    libelle: 'Pose sterilet',
    lettreCle: 'SF',
    coefficient: 4.4,
    tarifBase: 38.40,
    categorie: 'gyneco',
    description: 'Pose de dispositif intra-uterin',
  },
  {
    code: 'SF 2,2',
    libelle: 'Retrait sterilet',
    lettreCle: 'SF',
    coefficient: 2.2,
    tarifBase: 6.93,
    categorie: 'gyneco',
    description: 'Retrait de dispositif intra-uterin',
  },
  {
    code: 'SF 4,3',
    libelle: 'Pose implant',
    lettreCle: 'SF',
    coefficient: 4.3,
    tarifBase: 17.20,
    categorie: 'gyneco',
    description: 'Pose d\'implant contraceptif sous-cutane',
  },
  {
    code: 'SF 2,1',
    libelle: 'Retrait implant',
    lettreCle: 'SF',
    coefficient: 2.1,
    tarifBase: 41.80,
    categorie: 'gyneco',
    description: 'Retrait d\'implant contraceptif sous-cutane',
  },

  // IVG
  {
    code: 'FHV',
    libelle: 'IVG medicamenteuse',
    lettreCle: 'SF',
    coefficient: 1,
    tarifBase: 187.92,
    categorie: 'ivg',
    description: 'IVG medicamenteuse forfait',
  },

  // Majorations
  {
    code: 'MN',
    libelle: 'Majoration nuit (20h-8h)',
    lettreCle: 'M',
    coefficient: 1,
    tarifBase: 9.15,
    categorie: 'majoration',
    description: 'Majoration pour acte de nuit',
  },
  {
    code: 'MD',
    libelle: 'Majoration dimanche/ferie',
    lettreCle: 'M',
    coefficient: 1,
    tarifBase: 8.00,
    categorie: 'majoration',
    description: 'Majoration dimanche et jours feries',
  },
  {
    code: 'IK',
    libelle: 'Indemnite kilometrique',
    lettreCle: 'IK',
    coefficient: 1,
    tarifBase: 0.35,
    categorie: 'deplacement',
    description: 'Par kilometre (plaine)',
  },
  {
    code: 'IFD',
    libelle: 'Indemnite forfaitaire deplacement',
    lettreCle: 'IFD',
    coefficient: 1,
    tarifBase: 2.50,
    categorie: 'deplacement',
    description: 'Forfait deplacement',
  },
]

// Fonction pour calculer le montant d'une cotation
export function calculateCotationAmount(cotation: CotationNGAP, quantity: number = 1): number {
  return cotation.tarifBase * quantity
}

// Fonction pour trouver une cotation par code
export function findCotation(code: string): CotationNGAP | undefined {
  return COTATIONS_SAGE_FEMME.find((c) => c.code === code)
}

// Fonction pour obtenir les cotations par categorie
export function getCotationsByCategory(categorie: string): CotationNGAP[] {
  return COTATIONS_SAGE_FEMME.filter((c) => c.categorie === categorie)
}

// Suggestions de cotations selon le type de consultation
export function suggestCotations(consultationType: string): CotationNGAP[] {
  const mapping: Record<string, string[]> = {
    prenatale: ['C', 'C + MIS', 'SF 15'],
    postnatale: ['SF 6', 'SF 9', 'SF 12,6'],
    gyneco: ['C', 'SF 9,5', 'SF 4,4', 'SF 2,2'],
    reeducation: ['SF 7', 'SF 8'],
    preparation: ['SF 17', 'SF 10,6', 'SF 21'],
    monitoring: ['SF 15'],
    autre: ['C'],
  }

  const codes = mapping[consultationType] || mapping.autre
  return COTATIONS_SAGE_FEMME.filter((c) => codes.includes(c.code))
}

// Generation du numero de facture
export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `F${year}${month}-${random}`
}
