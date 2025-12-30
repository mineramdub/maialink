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
