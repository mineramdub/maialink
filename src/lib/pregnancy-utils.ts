// Utilitaires pour le suivi de grossesse

export interface ExamenPrenatal {
  id: string
  type: string
  nom: string
  saPrevue: number
  saMin: number
  saMax: number
  obligatoire: boolean
  description: string
}

// Liste des examens prenataux recommandes
export const EXAMENS_PRENATAUX: ExamenPrenatal[] = [
  {
    id: 'declaration',
    type: 'administratif',
    nom: 'Declaration de grossesse',
    saPrevue: 10,
    saMin: 1,
    saMax: 14,
    obligatoire: true,
    description: 'Declaration a la CAF et a la Securite sociale',
  },
  {
    id: 'bilan_grossesse_t1',
    type: 'prise_sang',
    nom: 'Bilan de grossesse T1',
    saPrevue: 10,
    saMin: 1,
    saMax: 14,
    obligatoire: true,
    description: 'Groupe sanguin, RAI, NFS, Glycemie a jeun, Serologies (toxo, rubeo, syphilis, VIH, HBV, HCV)',
  },
  {
    id: 'echo_t1',
    type: 'echographie',
    nom: 'Echographie T1',
    saPrevue: 12,
    saMin: 11,
    saMax: 14,
    obligatoire: true,
    description: 'Echographie du 1er trimestre',
  },
  {
    id: 'depistage_t21',
    type: 'prise_sang',
    nom: 'Depistage T21',
    saPrevue: 12,
    saMin: 11,
    saMax: 14,
    obligatoire: false,
    description: 'Marqueurs seriques (si souhaite)',
  },
  {
    id: 'echo_t2',
    type: 'echographie',
    nom: 'Echographie T2',
    saPrevue: 22,
    saMin: 20,
    saMax: 24,
    obligatoire: true,
    description: 'Echographie morphologique',
  },
  {
    id: 'hgpo',
    type: 'prise_sang',
    nom: 'HGPO 75g',
    saPrevue: 26,
    saMin: 24,
    saMax: 28,
    obligatoire: false,
    description: 'Test de charge en glucose (si facteurs de risque)',
  },
  {
    id: 'bilan_t2_t3',
    type: 'prise_sang',
    nom: 'Bilan T2/T3',
    saPrevue: 28,
    saMin: 24,
    saMax: 32,
    obligatoire: true,
    description: 'RAI, NFS, Serologie toxoplasmose (si negative)',
  },
  {
    id: 'injection_rhophylac',
    type: 'injection',
    nom: 'Injection Rhophylac',
    saPrevue: 28,
    saMin: 28,
    saMax: 30,
    obligatoire: false,
    description: 'Prevention allo-immunisation (si Rh negatif)',
  },
  {
    id: 'echo_t3',
    type: 'echographie',
    nom: 'Echographie T3',
    saPrevue: 32,
    saMin: 30,
    saMax: 34,
    obligatoire: true,
    description: 'Echographie du 3eme trimestre',
  },
  {
    id: 'prelev_vaginal',
    type: 'prelevement',
    nom: 'Prelevement vaginal',
    saPrevue: 35,
    saMin: 34,
    saMax: 38,
    obligatoire: true,
    description: 'Depistage streptocoque B',
  },
  {
    id: 'consultation_anesthesie',
    type: 'consultation',
    nom: 'Consultation anesthesie',
    saPrevue: 36,
    saMin: 32,
    saMax: 38,
    obligatoire: true,
    description: 'Consultation pre-anesthesique obligatoire',
  },
]

// Consultations mensuelles recommandees
export const CONSULTATIONS_MENSUELLES = [
  { sa: 7, description: '1ere consultation - Confirmation grossesse' },
  { sa: 11, description: '2eme consultation' },
  { sa: 15, description: '3eme consultation' },
  { sa: 19, description: '4eme consultation' },
  { sa: 23, description: '5eme consultation' },
  { sa: 27, description: '6eme consultation' },
  { sa: 31, description: '7eme consultation' },
  { sa: 35, description: '8eme consultation' },
  { sa: 37, description: '9eme consultation' },
  { sa: 39, description: '10eme consultation' },
  { sa: 41, description: '11eme consultation (si depassement terme)' },
]

// Calcul du score de risque pre-eclampsie
export function calculatePreeclampsiaRisk(factors: {
  age: number
  imc: number
  nullipare: boolean
  atcdPreeclampsie: boolean
  atcdHTA: boolean
  diabete: boolean
  maladiAutoimmune: boolean
  grossesseMultiple: boolean
}): { score: number; level: 'low' | 'moderate' | 'high' } {
  let score = 0

  if (factors.age >= 40) score += 2
  else if (factors.age >= 35) score += 1

  if (factors.imc >= 35) score += 2
  else if (factors.imc >= 30) score += 1

  if (factors.nullipare) score += 1
  if (factors.atcdPreeclampsie) score += 3
  if (factors.atcdHTA) score += 2
  if (factors.diabete) score += 1
  if (factors.maladiAutoimmune) score += 2
  if (factors.grossesseMultiple) score += 2

  let level: 'low' | 'moderate' | 'high' = 'low'
  if (score >= 5) level = 'high'
  else if (score >= 3) level = 'moderate'

  return { score, level }
}

// Recommandations de prise de poids selon l'IMC
export function getRecommendedWeightGain(imcPreGrossesse: number): {
  min: number
  max: number
  recommendation: string
} {
  if (imcPreGrossesse < 18.5) {
    return {
      min: 12.5,
      max: 18,
      recommendation: 'Prise de poids recommandee: 12.5 a 18 kg (insuffisance ponderale)',
    }
  } else if (imcPreGrossesse < 25) {
    return {
      min: 11.5,
      max: 16,
      recommendation: 'Prise de poids recommandee: 11.5 a 16 kg (poids normal)',
    }
  } else if (imcPreGrossesse < 30) {
    return {
      min: 7,
      max: 11.5,
      recommendation: 'Prise de poids recommandee: 7 a 11.5 kg (surpoids)',
    }
  } else {
    return {
      min: 5,
      max: 9,
      recommendation: 'Prise de poids recommandee: 5 a 9 kg (obesite)',
    }
  }
}

// Hauteur uterine attendue selon le terme
export function getExpectedUterineHeight(saWeeks: number): { min: number; max: number } {
  // Regle de McDonald: HU (cm) = SA - 4 (entre 20 et 32 SA)
  // Apres 32 SA, l'HU est d'environ 32-34 cm
  if (saWeeks < 20) {
    return { min: 0, max: 0 }
  } else if (saWeeks <= 32) {
    const expected = saWeeks - 4
    return { min: expected - 2, max: expected + 2 }
  } else {
    return { min: 30, max: 36 }
  }
}

// Verification des alertes cliniques
export function checkClinicalAlerts(data: {
  tensionSystolique?: number
  tensionDiastolique?: number
  proteineUrinaire?: string
  poids?: number
  poidsInitial?: number
  sa?: number
  hauteurUterine?: number
  bdc?: number
}): Array<{ type: string; message: string; severity: 'info' | 'warning' | 'critical' }> {
  const alerts: Array<{ type: string; message: string; severity: 'info' | 'warning' | 'critical' }> = []

  // Hypertension
  if (data.tensionSystolique && data.tensionSystolique >= 140) {
    alerts.push({
      type: 'tension',
      message: `Tension systolique elevee: ${data.tensionSystolique} mmHg`,
      severity: data.tensionSystolique >= 160 ? 'critical' : 'warning',
    })
  }
  if (data.tensionDiastolique && data.tensionDiastolique >= 90) {
    alerts.push({
      type: 'tension',
      message: `Tension diastolique elevee: ${data.tensionDiastolique} mmHg`,
      severity: data.tensionDiastolique >= 110 ? 'critical' : 'warning',
    })
  }

  // Proteinurie
  if (data.proteineUrinaire && data.proteineUrinaire !== 'negatif' && data.proteineUrinaire !== '0') {
    alerts.push({
      type: 'proteinurie',
      message: `Proteinurie positive: ${data.proteineUrinaire}`,
      severity: 'warning',
    })
  }

  // Prise de poids excessive
  if (data.poids && data.poidsInitial && data.sa) {
    const prisePoids = data.poids - data.poidsInitial
    const priseAttendue = data.sa * 0.3 // environ 300g par semaine
    if (prisePoids > priseAttendue + 3) {
      alerts.push({
        type: 'poids',
        message: `Prise de poids importante: +${prisePoids.toFixed(1)} kg`,
        severity: 'warning',
      })
    }
  }

  // Hauteur uterine
  if (data.hauteurUterine && data.sa && data.sa >= 20) {
    const expected = getExpectedUterineHeight(data.sa)
    if (data.hauteurUterine < expected.min - 2) {
      alerts.push({
        type: 'hu',
        message: `Hauteur uterine basse: ${data.hauteurUterine} cm (attendu: ${expected.min}-${expected.max} cm)`,
        severity: 'warning',
      })
    } else if (data.hauteurUterine > expected.max + 2) {
      alerts.push({
        type: 'hu',
        message: `Hauteur uterine elevee: ${data.hauteurUterine} cm (attendu: ${expected.min}-${expected.max} cm)`,
        severity: 'warning',
      })
    }
  }

  // Rythme cardiaque foetal
  if (data.bdc) {
    if (data.bdc < 110) {
      alerts.push({
        type: 'bdc',
        message: `Bradycardie foetale: ${data.bdc} bpm`,
        severity: 'critical',
      })
    } else if (data.bdc > 160) {
      alerts.push({
        type: 'bdc',
        message: `Tachycardie foetale: ${data.bdc} bpm`,
        severity: 'warning',
      })
    }
  }

  return alerts
}
