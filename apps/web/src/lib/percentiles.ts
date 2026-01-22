/**
 * Calcul des percentiles pour les mensurations de bébé
 * Basé sur les courbes de croissance OMS 2006
 */

// Données simplifiées OMS pour garçons et filles (0-24 mois)
// Format: [mois, P3, P10, P25, P50, P75, P90, P97]

const POIDS_GARCONS = [
  [0, 2.5, 2.9, 3.3, 3.5, 3.9, 4.3, 4.8],
  [1, 3.4, 3.9, 4.5, 4.9, 5.4, 5.9, 6.5],
  [2, 4.3, 4.9, 5.5, 6.0, 6.6, 7.2, 7.9],
  [3, 5.0, 5.6, 6.3, 6.9, 7.5, 8.2, 9.0],
  [4, 5.6, 6.2, 7.0, 7.6, 8.3, 9.0, 9.9],
  [5, 6.0, 6.7, 7.5, 8.2, 8.9, 9.7, 10.6],
  [6, 6.4, 7.1, 7.9, 8.6, 9.4, 10.2, 11.2],
  [9, 7.1, 7.8, 8.8, 9.6, 10.4, 11.3, 12.4],
  [12, 7.7, 8.5, 9.4, 10.3, 11.2, 12.1, 13.3],
  [18, 8.8, 9.7, 10.8, 11.8, 12.8, 13.9, 15.2],
  [24, 9.7, 10.8, 12.0, 13.0, 14.2, 15.4, 16.9]
]

const POIDS_FILLES = [
  [0, 2.4, 2.8, 3.2, 3.4, 3.7, 4.1, 4.6],
  [1, 3.2, 3.6, 4.2, 4.6, 5.0, 5.5, 6.1],
  [2, 3.9, 4.5, 5.1, 5.6, 6.1, 6.7, 7.4],
  [3, 4.5, 5.1, 5.8, 6.4, 7.0, 7.6, 8.4],
  [4, 5.0, 5.7, 6.4, 7.0, 7.7, 8.4, 9.2],
  [5, 5.4, 6.1, 6.9, 7.5, 8.2, 9.0, 9.9],
  [6, 5.7, 6.5, 7.3, 8.0, 8.7, 9.5, 10.4],
  [9, 6.4, 7.3, 8.2, 9.0, 9.8, 10.7, 11.8],
  [12, 7.0, 7.9, 8.9, 9.7, 10.6, 11.5, 12.7],
  [18, 8.1, 9.1, 10.2, 11.2, 12.2, 13.3, 14.6],
  [24, 9.0, 10.2, 11.4, 12.5, 13.7, 14.9, 16.4]
]

const TAILLE_GARCONS = [
  [0, 46.1, 48.0, 49.9, 51.0, 52.2, 53.7, 55.6],
  [1, 50.8, 52.8, 54.7, 56.0, 57.2, 58.9, 60.8],
  [2, 54.4, 56.4, 58.4, 59.7, 61.1, 62.8, 64.8],
  [3, 57.3, 59.4, 61.4, 62.8, 64.3, 66.1, 68.1],
  [4, 59.7, 61.8, 63.9, 65.4, 66.9, 68.7, 70.8],
  [5, 61.7, 63.8, 66.0, 67.6, 69.1, 71.0, 73.1],
  [6, 63.3, 65.5, 67.6, 69.3, 70.9, 72.8, 75.0],
  [9, 67.7, 69.9, 72.2, 74.0, 75.8, 77.7, 80.1],
  [12, 71.0, 73.4, 75.7, 77.6, 79.5, 81.5, 84.0],
  [18, 76.9, 79.5, 82.2, 84.2, 86.3, 88.5, 91.3],
  [24, 81.7, 84.6, 87.4, 89.6, 91.9, 94.2, 97.3]
]

const TAILLE_FILLES = [
  [0, 45.4, 47.3, 49.1, 50.2, 51.4, 52.9, 54.7],
  [1, 49.8, 51.7, 53.7, 55.0, 56.2, 57.8, 59.8],
  [2, 53.0, 55.0, 57.1, 58.4, 59.8, 61.5, 63.5],
  [3, 55.6, 57.7, 59.8, 61.2, 62.7, 64.5, 66.6],
  [4, 57.8, 59.9, 62.1, 63.6, 65.1, 66.9, 69.1],
  [5, 59.6, 61.8, 64.0, 65.6, 67.1, 69.0, 71.2],
  [6, 61.2, 63.5, 65.7, 67.3, 68.9, 70.8, 73.1],
  [9, 65.3, 67.8, 70.1, 71.9, 73.6, 75.6, 78.1],
  [12, 68.9, 71.4, 74.0, 75.8, 77.6, 79.7, 82.4],
  [18, 74.9, 77.7, 80.5, 82.5, 84.6, 86.8, 89.8],
  [24, 79.9, 83.0, 86.0, 88.3, 90.5, 92.9, 96.1]
]

const PC_GARCONS = [
  [0, 31.9, 33.2, 34.5, 35.1, 35.8, 36.8, 38.1],
  [1, 34.9, 36.1, 37.3, 38.0, 38.6, 39.6, 40.9],
  [2, 36.8, 38.1, 39.3, 40.0, 40.7, 41.7, 43.0],
  [3, 38.1, 39.4, 40.6, 41.3, 42.0, 43.0, 44.3],
  [4, 39.2, 40.4, 41.6, 42.3, 43.1, 44.1, 45.4],
  [5, 40.1, 41.3, 42.5, 43.3, 44.0, 45.0, 46.3],
  [6, 40.9, 42.1, 43.3, 44.1, 44.8, 45.8, 47.1],
  [9, 42.5, 43.7, 44.9, 45.7, 46.4, 47.4, 48.7],
  [12, 43.5, 44.7, 45.9, 46.7, 47.4, 48.4, 49.7],
  [18, 45.0, 46.3, 47.5, 48.3, 49.1, 50.0, 51.4],
  [24, 46.0, 47.3, 48.6, 49.4, 50.2, 51.2, 52.5]
]

const PC_FILLES = [
  [0, 31.5, 32.7, 34.0, 34.6, 35.3, 36.2, 37.6],
  [1, 34.2, 35.5, 36.7, 37.4, 38.0, 39.0, 40.3],
  [2, 36.0, 37.3, 38.5, 39.2, 39.9, 40.8, 42.2],
  [3, 37.2, 38.5, 39.7, 40.4, 41.1, 42.0, 43.4],
  [4, 38.1, 39.5, 40.6, 41.4, 42.0, 43.0, 44.4],
  [5, 38.9, 40.2, 41.4, 42.1, 42.8, 43.7, 45.1],
  [6, 39.6, 40.9, 42.0, 42.8, 43.5, 44.4, 45.8],
  [9, 41.2, 42.5, 43.6, 44.4, 45.1, 46.0, 47.5],
  [12, 42.2, 43.5, 44.7, 45.4, 46.2, 47.1, 48.5],
  [18, 44.0, 45.3, 46.5, 47.3, 48.0, 49.0, 50.4],
  [24, 45.2, 46.6, 47.8, 48.6, 49.4, 50.3, 51.8]
]

interface PercentileResult {
  value: number
  percentile: number
  status: 'normal' | 'surveillance' | 'pathologique'
  message: string
}

/**
 * Interpolation linéaire pour trouver le percentile exact
 */
function interpolate(x: number, x1: number, x2: number, y1: number, y2: number): number {
  return y1 + (x - x1) * (y2 - y1) / (x2 - x1)
}

/**
 * Trouve le percentile d'une valeur donnée
 */
function findPercentile(value: number, ageMonths: number, data: number[][]): PercentileResult {
  // Trouver les données pour l'âge (interpolation si nécessaire)
  let row: number[] | null = null

  // Chercher l'âge exact
  for (const r of data) {
    if (r[0] === ageMonths) {
      row = r
      break
    }
  }

  // Si pas trouvé, interpoler entre deux âges
  if (!row) {
    let prevRow: number[] | null = null
    let nextRow: number[] | null = null

    for (let i = 0; i < data.length - 1; i++) {
      if (data[i][0] < ageMonths && data[i + 1][0] > ageMonths) {
        prevRow = data[i]
        nextRow = data[i + 1]
        break
      }
    }

    if (!prevRow || !nextRow) {
      // Âge hors limites (< 0 mois ou > 24 mois)
      if (ageMonths < 0) ageMonths = 0
      if (ageMonths > 24) ageMonths = 24

      // Prendre la ligne la plus proche
      row = data.reduce((prev, curr) =>
        Math.abs(curr[0] - ageMonths) < Math.abs(prev[0] - ageMonths) ? curr : prev
      )
    } else {
      // Interpoler les valeurs pour chaque percentile
      row = [ageMonths]
      for (let i = 1; i < prevRow.length; i++) {
        row.push(interpolate(ageMonths, prevRow[0], nextRow[0], prevRow[i], nextRow[i]))
      }
    }
  }

  // [mois, P3, P10, P25, P50, P75, P90, P97]
  const [, p3, p10, p25, p50, p75, p90, p97] = row

  let percentile = 50
  let status: 'normal' | 'surveillance' | 'pathologique' = 'normal'
  let message = ''

  if (value < p3) {
    percentile = 1
    status = 'pathologique'
    message = '< P3 - Insuffisance pondérale sévère, avis médical urgent'
  } else if (value < p10) {
    percentile = 5
    status = 'surveillance'
    message = 'P3-P10 - Sous la normale, surveillance recommandée'
  } else if (value < p25) {
    percentile = 17
    status = 'normal'
    message = 'P10-P25 - Normal bas'
  } else if (value < p50) {
    percentile = 37
    status = 'normal'
    message = 'P25-P50 - Normal'
  } else if (value < p75) {
    percentile = 62
    status = 'normal'
    message = 'P50-P75 - Normal'
  } else if (value < p90) {
    percentile = 82
    status = 'normal'
    message = 'P75-P90 - Normal haut'
  } else if (value < p97) {
    percentile = 93
    status = 'surveillance'
    message = 'P90-P97 - Au-dessus de la normale, surveillance'
  } else {
    percentile = 99
    status = 'pathologique'
    message = '> P97 - Excès de poids/taille, avis médical recommandé'
  }

  return { value, percentile, status, message }
}

/**
 * Calcule le percentile de poids
 */
export function calculatePoidsPercentile(
  poidsGrammes: number,
  ageMonths: number,
  sexe: 'M' | 'F'
): PercentileResult {
  const poidsKg = poidsGrammes / 1000
  const data = sexe === 'M' ? POIDS_GARCONS : POIDS_FILLES
  return findPercentile(poidsKg, ageMonths, data)
}

/**
 * Calcule le percentile de taille
 */
export function calculateTaillePercentile(
  tailleCm: number,
  ageMonths: number,
  sexe: 'M' | 'F'
): PercentileResult {
  const data = sexe === 'M' ? TAILLE_GARCONS : TAILLE_FILLES
  return findPercentile(tailleCm, ageMonths, data)
}

/**
 * Calcule le percentile de périmètre crânien
 */
export function calculatePCPercentile(
  pcMm: number,
  ageMonths: number,
  sexe: 'M' | 'F'
): PercentileResult {
  const pcCm = pcMm / 10
  const data = sexe === 'M' ? PC_GARCONS : PC_FILLES
  return findPercentile(pcCm, ageMonths, data)
}

/**
 * Calcule l'âge en mois à partir de la date de naissance
 */
export function calculateAgeInMonths(dateNaissance: Date): number {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - dateNaissance.getTime())
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44) // Moyenne de 30.44 jours par mois
  return Math.round(diffMonths * 10) / 10 // Arrondi à 1 décimale
}

/**
 * Analyse les mensurations d'un bébé et retourne les percentiles + alertes
 */
export function analyzeBabyMeasurements(
  poids: number, // grammes
  taille: number, // cm
  pc: number, // mm
  dateNaissance: Date | string,
  sexe: 'M' | 'F'
) {
  const dateNaiss = typeof dateNaissance === 'string' ? new Date(dateNaissance) : dateNaissance
  const ageMonths = calculateAgeInMonths(dateNaiss)

  const poidsResult = calculatePoidsPercentile(poids, ageMonths, sexe)
  const tailleResult = calculateTaillePercentile(taille, ageMonths, sexe)
  const pcResult = calculatePCPercentile(pc, ageMonths, sexe)

  const alerts: string[] = []
  let globalStatus: 'normal' | 'surveillance' | 'pathologique' = 'normal'

  if (poidsResult.status === 'pathologique') {
    alerts.push(`⚠️ POIDS: ${poidsResult.message}`)
    globalStatus = 'pathologique'
  } else if (poidsResult.status === 'surveillance') {
    alerts.push(`⚡ POIDS: ${poidsResult.message}`)
    if (globalStatus !== 'pathologique') globalStatus = 'surveillance'
  }

  if (tailleResult.status === 'pathologique') {
    alerts.push(`⚠️ TAILLE: ${tailleResult.message}`)
    globalStatus = 'pathologique'
  } else if (tailleResult.status === 'surveillance') {
    alerts.push(`⚡ TAILLE: ${tailleResult.message}`)
    if (globalStatus !== 'pathologique') globalStatus = 'surveillance'
  }

  if (pcResult.status === 'pathologique') {
    alerts.push(`⚠️ PC: ${pcResult.message}`)
    globalStatus = 'pathologique'
  } else if (pcResult.status === 'surveillance') {
    alerts.push(`⚡ PC: ${pcResult.message}`)
    if (globalStatus !== 'pathologique') globalStatus = 'surveillance'
  }

  return {
    ageMonths,
    poids: poidsResult,
    taille: tailleResult,
    pc: pcResult,
    alerts,
    globalStatus
  }
}
