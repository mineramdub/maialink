import jsPDF from 'jspdf'
import {
  colors,
  drawModernHeader,
  drawPatientBox,
  drawSection,
  drawFooter,
  drawFormField,
  drawBulletList,
  drawAlertBox,
  drawTable,
  drawBadge,
  drawRoundedBox,
} from './pdfStyles'

// Types
export interface PatientData {
  firstName: string
  lastName: string
  birthDate: string
  address?: string
  city?: string
  postalCode?: string
  phone?: string
  email?: string
  secuNumber?: string
}

export interface GrossesseData {
  ddr: string
  dpa: string
  gestite?: number
  parite?: number
  grossesseMultiple?: boolean
  nombreFoetus?: number
}

export interface ConsultationData {
  date: string
  poids?: number
  tensionSystolique?: number
  tensionDiastolique?: number
  hauteurUterine?: number
  bdc?: number
  saTerm?: number
  saJours?: number
}

export interface PraticienData {
  firstName: string
  lastName: string
  rpps?: string
  adeli?: string
  address: string
  phone: string
  email: string
}

export interface BebeData {
  sexe?: 'M' | 'F'
  poids?: number
  taille?: number
  perimCranien?: number
  apgar1?: number
  apgar5?: number
  apgar10?: number
}

// Configuration
const PRATICIEN_DEFAULT: PraticienData = {
  firstName: 'Prénom',
  lastName: 'Nom',
  rpps: '123456789',
  adeli: '987654321',
  address: 'Adresse du cabinet',
  phone: '01 XX XX XX XX',
  email: 'contact@cabinet.fr',
}

// Helper functions
function calculateSA(ddr: string): { weeks: number; days: number } {
  const ddrDate = new Date(ddr)
  const today = new Date()
  const diffTime = today.getTime() - ddrDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(diffDays / 7)
  const days = diffDays % 7
  return { weeks, days }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// ============================================================================
// NOUVEAU: Certificat de naissance
// ============================================================================
export function generateCertificatNaissance(
  patient: PatientData,
  bebe: BebeData,
  dateNaissance: string,
  heureNaissance: string,
  lieuNaissance: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  drawModernHeader(doc, praticien, colors.success)

  // Titre
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.success)
  doc.text('CERTIFICAT DE NAISSANCE', 105, 55, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(colors.gray)
  doc.text('(Article L.2131-1 du Code de la santé publique)', 105, 62, { align: 'center' })

  // Info mère
  let y = 75
  y = drawPatientBox(doc, patient, y)

  // Section bébé
  y += 5
  y = drawSection(doc, 'Informations sur l\'enfant', y, colors.success)

  // Box bébé
  const boxY = y
  drawRoundedBox(doc, 15, boxY, 180, 50, colors.success, colors.lightGray)

  y = boxY + 8
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`Né(e) le ${formatDate(dateNaissance)} à ${heureNaissance}`, 20, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  y += 7
  doc.text(`Lieu de naissance : ${lieuNaissance}`, 20, y)

  y += 7
  if (bebe.sexe) {
    doc.text(`Sexe : ${bebe.sexe === 'M' ? 'Masculin' : 'Féminin'}`, 20, y)
  }

  // Mesures
  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Mesures anthropométriques :', 20, y)
  doc.setFont('helvetica', 'normal')

  y += 6
  if (bebe.poids) doc.text(`Poids : ${bebe.poids} g`, 25, y)
  if (bebe.taille) doc.text(`Taille : ${bebe.taille} cm`, 85, y)
  if (bebe.perimCranien) doc.text(`PC : ${bebe.perimCranien} cm`, 145, y)

  // Score Apgar
  y += 6
  if (bebe.apgar1 !== undefined || bebe.apgar5 !== undefined || bebe.apgar10 !== undefined) {
    const apgarText = `Score d'Apgar : ${bebe.apgar1 ?? '-'}/10 (1min) - ${bebe.apgar5 ?? '-'}/10 (5min) - ${bebe.apgar10 ?? '-'}/10 (10min)`
    doc.text(apgarText, 25, y)
  }

  // Certificat établi
  y = boxY + 65
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Je soussigné(e), certifie avoir procédé à l\'accouchement ci-dessus déclaré.', 15, y)

  drawFooter(doc, formatDate(new Date().toISOString()), colors.success)

  return doc
}

// ============================================================================
// NOUVEAU: Ordonnance de médicaments
// ============================================================================
export function generateOrdonnanceMedicaments(
  patient: PatientData,
  grossesse: GrossesseData | null,
  medicaments: Array<{
    nom: string
    posologie: string
    duree: string
  }>,
  indication: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  drawModernHeader(doc, praticien, colors.primary)

  // Titre
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.primary)
  doc.text('ORDONNANCE', 105, 55, { align: 'center' })

  // Info patient
  let y = 70
  y = drawPatientBox(doc, patient, y)

  // Info grossesse si applicable
  if (grossesse) {
    y += 3
    const sa = calculateSA(grossesse.ddr)
    drawBadge(doc, `Grossesse ${sa.weeks} SA + ${sa.days}j`, 15, y + 5, colors.warning)
    y += 10
  }

  // Section médicaments
  y = drawSection(doc, 'Prescription', y, colors.primary)

  medicaments.forEach((med, index) => {
    // Numéro
    doc.setFillColor(colors.primary)
    doc.circle(18, y + 2, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}`, 18, y + 3, { align: 'center' })

    // Nom du médicament
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(med.nom, 25, y + 3)

    // Posologie
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    y += 7
    doc.text(`Posologie : ${med.posologie}`, 25, y)

    // Durée
    y += 5
    doc.setFontSize(9)
    doc.setTextColor(colors.gray)
    doc.text(`Durée : ${med.duree}`, 25, y)
    doc.setTextColor(0, 0, 0)

    y += 10
  })

  // Indication
  y += 5
  y = drawSection(doc, 'Indication', y, colors.primary)
  doc.setFontSize(10)
  const lines = doc.splitTextToSize(indication, 175)
  doc.text(lines, 15, y)

  y += lines.length * 5 + 10
  doc.setFontSize(9)
  doc.setTextColor(colors.danger)
  doc.text('⚠ Ne pas dépasser la dose prescrite. Respecter la durée du traitement.', 15, y)
  doc.setTextColor(0, 0, 0)

  drawFooter(doc, formatDate(new Date().toISOString()), colors.primary)

  return doc
}

// ============================================================================
// NOUVEAU: Certificat de contre-indication sportive
// ============================================================================
export function generateCertificatContreIndicationSport(
  patient: PatientData,
  grossesse: GrossesseData,
  motif: string,
  dateDebut: string,
  dateFin: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  drawModernHeader(doc, praticien, colors.warning)

  // Titre
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.warning)
  doc.text('CERTIFICAT DE CONTRE-INDICATION', 105, 55, { align: 'center' })
  doc.text('À LA PRATIQUE SPORTIVE', 105, 63, { align: 'center' })

  // Info patient
  let y = 78
  y = drawPatientBox(doc, patient, y)

  // Info grossesse
  y += 3
  const sa = calculateSA(grossesse.ddr)
  y = drawSection(doc, 'État de grossesse', y, colors.warning)
  doc.setFontSize(10)
  doc.text(`Grossesse de ${sa.weeks} SA + ${sa.days} jours`, 15, y)
  y += 5
  doc.text(`Date présumée d'accouchement : ${formatDate(grossesse.dpa)}`, 15, y)

  // Contre-indication
  y += 15
  y = drawAlertBox(doc, `CONTRE-INDICATION TEMPORAIRE du ${formatDate(dateDebut)} au ${formatDate(dateFin)}`, y, 'warning')

  // Motif
  y += 5
  y = drawSection(doc, 'Motif médical', y, colors.warning)
  const lines = doc.splitTextToSize(motif, 175)
  doc.text(lines, 15, y)

  // Recommandations
  y += lines.length * 5 + 15
  y = drawSection(doc, 'Recommandations', y, colors.warning)
  const recommandations = [
    'Repos relatif recommandé',
    'Éviter les efforts physiques intenses',
    'Privilégier les activités douces (marche, relaxation)',
    'Réévaluation médicale à la fin de la période',
  ]
  y = drawBulletList(doc, recommandations, 15, y, colors.warning)

  drawFooter(doc, formatDate(new Date().toISOString()), colors.warning)

  return doc
}

// ============================================================================
// AMÉLIORATION: Déclaration de grossesse avec nouveau design
// ============================================================================
export function generateDeclarationGrossesseModerne(
  patient: PatientData,
  grossesse: GrossesseData,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  drawModernHeader(doc, praticien, colors.primary)

  // Titre avec icône
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.primary)
  doc.text('DÉCLARATION DE GROSSESSE', 105, 55, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(colors.gray)
  doc.text('(À transmettre avant la fin du 3ème mois)', 105, 62, { align: 'center' })

  // Info patient
  let y = 75
  y = drawPatientBox(doc, patient, y)

  // Grossesse
  y += 5
  y = drawSection(doc, 'Informations obstétricales', y, colors.primary)

  const sa = calculateSA(grossesse.ddr)

  // Tableau des dates
  const dateData = [
    ['Date des dernières règles (DDR)', formatDate(grossesse.ddr)],
    ['Date présumée d\'accouchement (DPA)', formatDate(grossesse.dpa)],
    ['Terme actuel', `${sa.weeks} SA + ${sa.days} jours`],
  ]

  dateData.forEach(([label, value]) => {
    y = drawFormField(doc, label, value, 15, y, 80)
  })

  y += 5

  // Antécédents obstétricaux
  if (grossesse.gestite || grossesse.parite !== undefined) {
    y = drawSection(doc, 'Antécédents obstétricaux', y, colors.primary)
    if (grossesse.gestite) {
      y = drawFormField(doc, 'Gestité (nombre de grossesses)', grossesse.gestite.toString(), 15, y, 40)
    }
    if (grossesse.parite !== undefined) {
      y = drawFormField(doc, 'Parité (nombre d\'accouchements)', grossesse.parite.toString(), 15, y, 40)
    }
  }

  // Grossesse multiple
  if (grossesse.grossesseMultiple) {
    y += 5
    y = drawAlertBox(doc, `Grossesse multiple : ${grossesse.nombreFoetus} fœtus`, y, 'info')
  }

  // À compléter
  y += 10
  y = drawSection(doc, 'À compléter par la patiente', y, colors.gray)
  y = drawFormField(doc, 'N° Sécurité Sociale', undefined, 15, y, 100)
  y = drawFormField(doc, 'Organisme d\'assurance maladie', undefined, 15, y, 100)
  y = drawFormField(doc, 'Médecin traitant', undefined, 15, y, 100)

  drawFooter(doc, formatDate(new Date().toISOString()), colors.primary)

  return doc
}

// ============================================================================
// NOUVEAU: Certificat de préparation à la naissance
// ============================================================================
export function generateCertificatPreparationNaissance(
  patient: PatientData,
  grossesse: GrossesseData,
  nombreSeances: number,
  typePreparation: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  drawModernHeader(doc, praticien, colors.secondary)

  // Titre
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.secondary)
  doc.text('CERTIFICAT DE PRÉPARATION', 105, 52, { align: 'center' })
  doc.text('À LA NAISSANCE', 105, 60, { align: 'center' })

  // Info patient
  let y = 75
  y = drawPatientBox(doc, patient, y)

  // Info grossesse
  y += 3
  const sa = calculateSA(grossesse.ddr)
  drawBadge(doc, `${sa.weeks} SA + ${sa.days}j`, 15, y + 5, colors.secondary)
  y += 10

  // Détails préparation
  y = drawSection(doc, 'Programme de préparation', y, colors.secondary)

  drawRoundedBox(doc, 15, y, 180, 35, colors.secondary, colors.lightGray)

  y += 8
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`Type de préparation : ${typePreparation}`, 20, y)

  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Nombre de séances prescrites : ${nombreSeances} séances`, 20, y)

  y += 7
  doc.text(`Remboursement : 100% par l'Assurance Maladie`, 20, y)

  y += 7
  doc.setFontSize(9)
  doc.setTextColor(colors.gray)
  doc.text('(Dans le cadre du suivi de grossesse - 8 séances maximum)', 20, y)
  doc.setTextColor(0, 0, 0)

  y += 20
  y = drawSection(doc, 'Thèmes abordés', y, colors.secondary)

  const themes = [
    'Anatomie et physiologie de la grossesse',
    'Travail et accouchement',
    'Techniques de respiration et relaxation',
    'Gestion de la douleur',
    'Soins du nouveau-né',
    'Allaitement maternel',
    'Retour à domicile et post-partum',
  ]

  y = drawBulletList(doc, themes, 15, y, colors.secondary)

  drawFooter(doc, formatDate(new Date().toISOString()), colors.secondary)

  return doc
}

// ============================================================================
// NOUVEAU: Certificat post-natal
// ============================================================================
export function generateCertificatPostNatal(
  patient: PatientData,
  dateAccouchement: string,
  modeAccouchement: string,
  complications: string,
  recommandations: string[],
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  drawModernHeader(doc, praticien, colors.success)

  // Titre
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.success)
  doc.text('CERTIFICAT POST-NATAL', 105, 55, { align: 'center' })

  // Info patient
  let y = 70
  y = drawPatientBox(doc, patient, y)

  // Info accouchement
  y += 5
  y = drawSection(doc, 'Accouchement', y, colors.success)

  y = drawFormField(doc, 'Date d\'accouchement', formatDate(dateAccouchement), 15, y, 80)
  y = drawFormField(doc, 'Mode d\'accouchement', modeAccouchement, 15, y, 80)

  // Complications
  if (complications) {
    y += 5
    y = drawSection(doc, 'Complications', y, colors.danger)
    const lines = doc.splitTextToSize(complications, 175)
    doc.text(lines, 15, y)
    y += lines.length * 5 + 5
  }

  // État actuel
  y += 5
  y = drawSection(doc, 'État post-partum', y, colors.success)
  doc.setFontSize(10)
  doc.text('État général de la patiente : Bon', 15, y)

  // Recommandations
  y += 15
  y = drawSection(doc, 'Recommandations', y, colors.success)
  y = drawBulletList(doc, recommandations, 15, y, colors.success)

  // Suivi
  y += 10
  y = drawAlertBox(
    doc,
    'Visite post-natale recommandée dans les 6-8 semaines après l\'accouchement',
    y,
    'info'
  )

  drawFooter(doc, formatDate(new Date().toISOString()), colors.success)

  return doc
}

// ============================================================================
// NOUVEAU: Compte rendu de visite à domicile
// ============================================================================
export function generateCompteRenduVisiteADomicile(
  patient: PatientData,
  grossesse: GrossesseData | null,
  dateVisite: string,
  motif: string,
  examenClinique: string,
  conduite: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  drawModernHeader(doc, praticien, colors.primary)

  // Titre
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.primary)
  doc.text('COMPTE RENDU DE VISITE À DOMICILE', 105, 55, { align: 'center' })

  // Info patient
  let y = 70
  y = drawPatientBox(doc, patient, y)

  // Date visite
  y += 3
  drawBadge(doc, `Visite du ${formatDate(dateVisite)}`, 15, y + 5, colors.primary)
  y += 12

  // Info grossesse si applicable
  if (grossesse) {
    const sa = calculateSA(grossesse.ddr)
    doc.setFontSize(10)
    doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days} jours`, 15, y)
    y += 7
  }

  // Motif
  y = drawSection(doc, 'Motif de la visite', y, colors.primary)
  let lines = doc.splitTextToSize(motif, 175)
  doc.text(lines, 15, y)
  y += lines.length * 5 + 10

  // Examen clinique
  y = drawSection(doc, 'Examen clinique', y, colors.primary)
  lines = doc.splitTextToSize(examenClinique, 175)
  doc.text(lines, 15, y)
  y += lines.length * 5 + 10

  // Conduite à tenir
  y = drawSection(doc, 'Conduite à tenir', y, colors.primary)
  lines = doc.splitTextToSize(conduite, 175)
  doc.text(lines, 15, y)

  drawFooter(doc, formatDate(new Date().toISOString()), colors.primary)

  return doc
}

// Export all modern templates
export const modernDocumentTemplates = {
  certificatNaissance: generateCertificatNaissance,
  ordonnanceMedicaments: generateOrdonnanceMedicaments,
  contreIndicationSport: generateCertificatContreIndicationSport,
  declarationGrossesseModerne: generateDeclarationGrossesseModerne,
  preparationNaissance: generateCertificatPreparationNaissance,
  certificatPostNatal: generateCertificatPostNatal,
  visiteADomicile: generateCompteRenduVisiteADomicile,
}

export type ModernDocumentType = keyof typeof modernDocumentTemplates
