import jsPDF from 'jspdf'
import { formatDate } from './utils'

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

// Configuration
const PRATICIEN_DEFAULT: PraticienData = {
  firstName: 'Prénom',
  lastName: 'Nom',
  rpps: 'RPPS',
  adeli: 'ADELI',
  address: 'Adresse du cabinet',
  phone: '01 XX XX XX XX',
  email: 'contact@cabinet.fr',
}

// Helper functions
function addHeader(doc: jsPDF, praticien: PraticienData) {
  // Header box with light background
  doc.setFillColor(245, 247, 250) // Light blue-gray background
  doc.rect(10, 10, 190, 45, 'F')

  // Practitioner name - larger and bold
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`${praticien.firstName} ${praticien.lastName}`, 15, 18)

  // Title
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 80, 120) // Professional blue
  doc.text('Sage-femme', 15, 24)

  // Professional identifiers
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  let idY = 30
  if (praticien.rpps) {
    doc.text(`N° RPPS: ${praticien.rpps}`, 15, idY)
    idY += 5
  }
  if (praticien.adeli && !praticien.rpps) {
    doc.text(`N° ADELI: ${praticien.adeli}`, 15, idY)
    idY += 5
  }

  // Contact information - right aligned
  doc.setFontSize(9)
  const addressLines = doc.splitTextToSize(praticien.address, 60)
  let contactY = 18
  addressLines.forEach((line: string) => {
    doc.text(line, 195, contactY, { align: 'right' })
    contactY += 4
  })
  doc.text(`Tél: ${praticien.phone}`, 195, contactY, { align: 'right' })
  contactY += 4
  doc.text(praticien.email, 195, contactY, { align: 'right' })

  // Reset colors
  doc.setTextColor(0, 0, 0)

  // Separator line
  doc.setDrawColor(60, 80, 120)
  doc.setLineWidth(0.8)
  doc.line(10, 58, 200, 58)
}

function addPatientInfo(doc: jsPDF, patient: PatientData, y: number): number {
  // Patient info box
  doc.setFillColor(250, 250, 252)
  const boxHeight = patient.address && patient.city ? 32 : (patient.address ? 27 : 22)
  doc.rect(10, y - 3, 190, boxHeight, 'F')

  // Patient label
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(60, 80, 120)
  doc.text('PATIENTE', 15, y + 2)

  // Patient name - prominent
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(`${patient.firstName} ${patient.lastName}`, 15, y + 9)

  // Birth date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Née le : ${formatDate(patient.birthDate)}`, 15, y + 15)

  let finalY = y + 15

  if (patient.secuNumber) {
    doc.setFontSize(9)
    doc.text(`N° Sécurité Sociale : ${patient.secuNumber}`, 15, y + 20)
    finalY = y + 20
  }

  if (patient.address) {
    doc.setFontSize(9)
    doc.text(`${patient.address}`, 15, finalY + 5)
    finalY += 5
    if (patient.city) {
      doc.text(`${patient.postalCode} ${patient.city}`, 15, finalY + 4)
      finalY += 4
    }
  }

  // Reset colors
  doc.setTextColor(0, 0, 0)

  return finalY + 8
}

function addDocumentTitle(doc: jsPDF, title: string, subtitle?: string, y: number = 70): number {
  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(40, 60, 100) // Professional dark blue
  doc.text(title, 105, y, { align: 'center' })

  // Subtitle if provided
  if (subtitle) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(subtitle, 105, y + 7, { align: 'center' })
  }

  // Decorative line under title
  const lineY = subtitle ? y + 12 : y + 6
  doc.setDrawColor(60, 80, 120)
  doc.setLineWidth(0.5)
  doc.line(70, lineY, 140, lineY)

  // Reset colors
  doc.setTextColor(0, 0, 0)

  return subtitle ? y + 18 : y + 12
}

function calculateSA(ddr: string): { weeks: number; days: number } {
  const ddrDate = new Date(ddr)
  const today = new Date()
  const diffTime = today.getTime() - ddrDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(diffDays / 7)
  const days = diffDays % 7
  return { weeks, days }
}

// Document Templates

export function generateDeclarationGrossesse(
  patient: PatientData,
  grossesse: GrossesseData,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  addHeader(doc, praticien)

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('DÉCLARATION DE GROSSESSE', 105, 70, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  let y = 90
  y = addPatientInfo(doc, patient, y)

  // Grossesse info
  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Informations sur la grossesse :', 15, y)
  doc.setFont('helvetica', 'normal')

  y += 7
  const sa = calculateSA(grossesse.ddr)
  doc.text(`Date des dernières règles (DDR) : ${formatDate(grossesse.ddr)}`, 15, y)
  y += 6
  doc.text(`Date présumée d'accouchement (DPA) : ${formatDate(grossesse.dpa)}`, 15, y)
  y += 6
  doc.text(`Terme actuel : ${sa.weeks} SA + ${sa.days} jours`, 15, y)
  y += 6

  if (grossesse.gestite) {
    doc.text(`Gestité : ${grossesse.gestite}`, 15, y)
    y += 6
  }
  if (grossesse.parite !== undefined) {
    doc.text(`Parité : ${grossesse.parite}`, 15, y)
    y += 6
  }

  if (grossesse.grossesseMultiple) {
    doc.text(`Grossesse multiple : ${grossesse.nombreFoetus} fœtus`, 15, y)
    y += 6
  }

  // À compléter
  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('À COMPLÉTER PAR LA PATIENTE :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  doc.text('N° Sécurité Sociale : ___________________________________', 15, y)
  y += 7
  doc.text('Organisme d\'assurance maladie : _______________________', 15, y)
  y += 7
  doc.text('Médecin traitant : _____________________________________', 15, y)

  // Signature
  y = 250
  doc.text(`Fait à _____________, le ${new Date().toLocaleDateString('fr-FR')}`, 15, y)
  y += 10
  doc.text('Signature et cachet du praticien :', 15, y)

  return doc
}

export function generateCertificatGrossesse(
  patient: PatientData,
  grossesse: GrossesseData,
  consultation: ConsultationData,
  praticien: PraticienData = PRATICIEN_DEFAULT,
  options: {
    apteTravail?: boolean
    pathologique?: boolean
    observations?: string
  } = {}
): jsPDF {
  const doc = new jsPDF()

  addHeader(doc, praticien)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICAT MÉDICAL', 105, 70, { align: 'center' })
  doc.text('DE GROSSESSE', 105, 78, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  let y = 95
  doc.text('Je soussigné(e), certifie avoir examiné ce jour :', 15, y)

  y += 10
  y = addPatientInfo(doc, patient, y)

  y += 10
  const sa = calculateSA(grossesse.ddr)
  doc.text(`Présente une grossesse évolutive de ${sa.weeks} SA + ${sa.days} jours`, 15, y)
  y += 7
  doc.text(`(Date présumée d'accouchement : ${formatDate(grossesse.dpa)})`, 15, y)

  y += 12
  if (options.pathologique) {
    doc.setFont('helvetica', 'bold')
    doc.text('Grossesse pathologique nécessitant un suivi rapproché.', 15, y)
    doc.setFont('helvetica', 'normal')
  } else {
    doc.text('Grossesse évoluant normalement à ce jour.', 15, y)
  }

  y += 12
  if (options.apteTravail === false) {
    doc.text('Patiente INAPTE au travail pour raison médicale.', 15, y)
  } else if (options.apteTravail === true) {
    doc.text('Patiente APTE à la poursuite de son activité professionnelle.', 15, y)
  }

  if (options.observations) {
    y += 12
    doc.setFont('helvetica', 'bold')
    doc.text('Observations :', 15, y)
    doc.setFont('helvetica', 'normal')
    y += 7
    const lines = doc.splitTextToSize(options.observations, 180)
    doc.text(lines, 15, y)
  }

  y = 250
  doc.text('Certificat établi à la demande de l\'intéressée pour faire valoir ce que de droit.', 15, y)

  y += 10
  doc.text(`Fait à _____________, le ${new Date().toLocaleDateString('fr-FR')}`, 15, y)
  y += 10
  doc.text('Signature et cachet du praticien :', 15, y)

  return doc
}

export function generateArretTravail(
  patient: PatientData,
  grossesse: GrossesseData,
  dateDebut: string,
  dateFin: string,
  motif: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  addHeader(doc, praticien)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICAT D\'ARRÊT DE TRAVAIL', 105, 70, { align: 'center' })
  doc.text('(Grossesse pathologique)', 105, 78, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  let y = 95
  doc.text('Je soussigné(e), certifie que l\'état de santé de :', 15, y)

  y += 10
  y = addPatientInfo(doc, patient, y)

  y += 10
  const sa = calculateSA(grossesse.ddr)
  doc.text(`Enceinte de ${sa.weeks} SA + ${sa.days} jours (DPA : ${formatDate(grossesse.dpa)})`, 15, y)

  y += 12
  doc.setFont('helvetica', 'bold')
  doc.text('NÉCESSITE UN ARRÊT DE TRAVAIL', 15, y)
  doc.setFont('helvetica', 'normal')

  y += 10
  doc.text(`Du : ${formatDate(dateDebut)}`, 15, y)
  y += 7
  doc.text(`Au : ${formatDate(dateFin)} (inclus)`, 15, y)

  // Calculer durée
  const debut = new Date(dateDebut)
  const fin = new Date(dateFin)
  const dureeJours = Math.floor((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)) + 1
  y += 7
  doc.text(`Soit ${dureeJours} jours`, 15, y)

  y += 12
  doc.setFont('helvetica', 'bold')
  doc.text('Motif médical :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  const lines = doc.splitTextToSize(motif, 180)
  doc.text(lines, 15, y)

  y = 250
  doc.text('Certificat établi pour faire valoir ce que de droit.', 15, y)

  y += 10
  doc.text(`Fait à _____________, le ${new Date().toLocaleDateString('fr-FR')}`, 15, y)
  y += 10
  doc.text('Signature et cachet du praticien :', 15, y)

  return doc
}

export function generateOrdonnanceBiologie(
  patient: PatientData,
  grossesse: GrossesseData,
  examens: string[],
  indication: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  addHeader(doc, praticien)

  let y = addDocumentTitle(doc, 'ORDONNANCE', 'Examens de biologie médicale', 70)

  y += 5
  y = addPatientInfo(doc, patient, y)

  y += 10
  const sa = calculateSA(grossesse.ddr)

  // Date et contexte de la prescription
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 15, y)
  doc.setFont('helvetica', 'normal')
  doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days} jours`, 120, y)

  // Symbole Rp/ (prescription)
  y += 15
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Rp/', 15, y)

  // Ligne horizontale sous Rp/
  doc.setLineWidth(0.5)
  doc.line(15, y + 2, 195, y + 2)

  y += 12
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('EXAMENS DE BIOLOGIE MÉDICALE', 15, y)
  doc.setFont('helvetica', 'normal')

  y += 10
  doc.setFontSize(10)

  examens.forEach((examen) => {
    // Checkbox stylisé
    doc.setDrawColor(100, 100, 100)
    doc.rect(18, y - 3, 3, 3)
    doc.text(examen, 25, y)
    y += 7
  })

  y += 8

  // Box pour l'indication
  doc.setFillColor(250, 250, 252)
  doc.rect(15, y - 5, 180, 20, 'F')

  doc.setFont('helvetica', 'bold')
  doc.text('Indication clinique :', 18, y)
  doc.setFont('helvetica', 'normal')
  y += 6
  const indicationLines = doc.splitTextToSize(indication, 170)
  doc.text(indicationLines, 18, y)

  y += 15
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text('→ Résultats à communiquer au prescripteur', 15, y)
  doc.setTextColor(0, 0, 0)

  // Footer professionnel
  y = 240

  // Box pour la signature
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.rect(120, y - 5, 75, 35)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(`Fait à ${praticien.address.split('\\n')[1] || 'Paris'}`, 15, y)
  doc.text(`Le ${new Date().toLocaleDateString('fr-FR')}`, 15, y + 6)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Signature et cachet', 125, y + 2)
  doc.text('du praticien :', 125, y + 7)

  // Mention légale
  y = 278
  doc.setFontSize(7)
  doc.setTextColor(120, 120, 120)
  doc.text('Ordonnance conforme aux dispositions du Code de la santé publique', 15, y)
  doc.setTextColor(0, 0, 0)

  return doc
}

export function generateDemandeEchographie(
  patient: PatientData,
  grossesse: GrossesseData,
  type: 'T1' | 'T2' | 'T3' | 'croissance' | 'autre',
  indication: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  addHeader(doc, praticien)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('DEMANDE D\'ÉCHOGRAPHIE', 105, 70, { align: 'center' })
  doc.text('OBSTÉTRICALE', 105, 78, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  let y = 95
  y = addPatientInfo(doc, patient, y)

  y += 10
  const sa = calculateSA(grossesse.ddr)
  doc.setFont('helvetica', 'bold')
  doc.text('Informations obstétricales :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  doc.text(`DDR : ${formatDate(grossesse.ddr)}`, 15, y)
  y += 6
  doc.text(`Terme actuel : ${sa.weeks} SA + ${sa.days} jours`, 15, y)
  y += 6
  doc.text(`DPA : ${formatDate(grossesse.dpa)}`, 15, y)

  if (grossesse.grossesseMultiple) {
    y += 6
    doc.setFont('helvetica', 'bold')
    doc.text(`GROSSESSE MULTIPLE (${grossesse.nombreFoetus} fœtus)`, 15, y)
    doc.setFont('helvetica', 'normal')
  }

  y += 15
  doc.setFont('helvetica', 'bold')
  doc.text('Type d\'échographie demandée :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 7

  const types = {
    T1: '☑ Échographie du 1er trimestre (11-14 SA)',
    T2: '☑ Échographie du 2ème trimestre (22-24 SA)',
    T3: '☑ Échographie du 3ème trimestre (32-34 SA)',
    croissance: '☑ Échographie de croissance',
    autre: '☑ Autre (voir indication)',
  }

  Object.entries(types).forEach(([key, label]) => {
    doc.text(key === type ? label : label.replace('☑', '☐'), 15, y)
    y += 6
  })

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Indication / Renseignements cliniques :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  const lines = doc.splitTextToSize(indication, 180)
  doc.text(lines, 15, y)

  y = 250
  doc.text(`Le ${new Date().toLocaleDateString('fr-FR')}`, 15, y)
  y += 10
  doc.text('Signature et cachet du praticien :', 15, y)

  return doc
}

export function generateCompteRenduConsultation(
  patient: PatientData,
  grossesse: GrossesseData | null,
  consultation: ConsultationData,
  observations: string,
  destinataire: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  addHeader(doc, praticien)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('COMPTE-RENDU DE CONSULTATION', 105, 70, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  let y = 90
  doc.text(`À l'attention de : ${destinataire}`, 15, y)

  y += 15
  y = addPatientInfo(doc, patient, y)

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text(`Consultation du ${formatDate(consultation.date)}`, 15, y)
  doc.setFont('helvetica', 'normal')

  if (grossesse) {
    y += 10
    const sa = calculateSA(grossesse.ddr)
    doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days} jours (DPA : ${formatDate(grossesse.dpa)})`, 15, y)
  }

  y += 15
  doc.setFont('helvetica', 'bold')
  doc.text('Examen clinique :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 7

  if (consultation.poids) {
    doc.text(`Poids : ${consultation.poids} kg`, 15, y)
    y += 6
  }
  if (consultation.tensionSystolique && consultation.tensionDiastolique) {
    doc.text(`Tension artérielle : ${consultation.tensionSystolique}/${consultation.tensionDiastolique} mmHg`, 15, y)
    y += 6
  }
  if (consultation.hauteurUterine) {
    doc.text(`Hauteur utérine : ${consultation.hauteurUterine} cm`, 15, y)
    y += 6
  }
  if (consultation.bdc) {
    doc.text(`BDC : ${consultation.bdc} bpm`, 15, y)
    y += 6
  }

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Observations :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  const lines = doc.splitTextToSize(observations, 180)
  doc.text(lines, 15, y)

  y = 250
  doc.text('Restant à votre disposition pour tout renseignement complémentaire.', 15, y)
  y += 7
  doc.text('Cordialement,', 15, y)

  y += 15
  doc.text(`Le ${new Date().toLocaleDateString('fr-FR')}`, 15, y)
  y += 10
  doc.text('Signature et cachet :', 15, y)

  return doc
}

// Specialized biology templates
export function generateBilanPreEclampsie(
  patient: PatientData,
  grossesse: GrossesseData,
  indication: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const examensPreEclampsie = [
    'NFS (Numération Formule Sanguine)',
    'Créatinine plasmatique',
    'Acide urique',
    'Transaminases (ASAT, ALAT)',
    'LDH (Lactate déshydrogénase)',
    'Protéinurie des 24h',
    'Rapport protéinurie/créatininurie',
    'Plaquettes',
    'Bilan hépatique complet',
  ]

  return generateOrdonnanceBiologie(
    patient,
    grossesse,
    examensPreEclampsie,
    indication || 'Suspicion de pré-éclampsie - Bilan biologique',
    praticien
  )
}

export function generateBilanCholestase(
  patient: PatientData,
  grossesse: GrossesseData,
  indication: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const examensCholestase = [
    'Transaminases (ASAT, ALAT)',
    'Gamma-GT',
    'Phosphatases alcalines',
    'Bilirubine totale et conjuguée',
    'Acides biliaires sériques (à jeun)',
    'NFS',
    'TP/TCA (bilan de coagulation)',
  ]

  return generateOrdonnanceBiologie(
    patient,
    grossesse,
    examensCholestase,
    indication || 'Suspicion de cholestase gravidique - Bilan biologique',
    praticien
  )
}

export function generateBilanDiabeteGestationnel(
  patient: PatientData,
  grossesse: GrossesseData,
  indication: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const examensDiabete = [
    'Glycémie à jeun',
    'HGPO 75g (Hyperglycémie provoquée par voie orale)',
    'HbA1c (Hémoglobine glyquée)',
    'Créatinine plasmatique',
    'Protéinurie',
    'Albuminurie',
  ]

  return generateOrdonnanceBiologie(
    patient,
    grossesse,
    examensDiabete,
    indication || 'Dépistage/Surveillance diabète gestationnel',
    praticien
  )
}

export function generateBilanAnemie(
  patient: PatientData,
  grossesse: GrossesseData,
  indication: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const examensAnemie = [
    'NFS (Numération Formule Sanguine)',
    'Ferritine',
    'Coefficient de saturation de la transferrine',
    'CRP (Protéine C-réactive)',
    'Réticulocytes',
    'Vitamine B12',
    'Folates sériques et érythrocytaires',
  ]

  return generateOrdonnanceBiologie(
    patient,
    grossesse,
    examensAnemie,
    indication || 'Bilan étiologique d\'anémie',
    praticien
  )
}

// Export all templates
// Generate formatted PDF from text ordonnance
export function generateOrdonnanceFromText(
  textContent: string,
  praticien: PraticienData = PRATICIEN_DEFAULT
): jsPDF {
  const doc = new jsPDF()

  // Parse header to extract patient info
  const lines = textContent.split('\n').filter(line => line.trim())

  // Add professional header
  addHeader(doc, praticien)

  // Title
  let y = addDocumentTitle(doc, 'ORDONNANCE', undefined, 70)
  y += 5

  // Find and display content starting after the header
  const contentStartIndex = lines.findIndex(line => line.includes('─────────'))
  if (contentStartIndex >= 0) {
    // Skip the header separator
    const contentLines = lines.slice(contentStartIndex + 1)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    // Process each line
    for (const line of contentLines) {
      if (line.includes('─────────')) {
        // Separator line - stop before footer
        break
      }

      if (y > 250) {
        doc.addPage()
        y = 20
      }

      if (line.startsWith('Patient')) {
        // Patient section
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60, 80, 120)
      } else if (line.includes('Rp/') || line.includes('ORDONNANCE')) {
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
      } else {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
      }

      const wrappedLines = doc.splitTextToSize(line, 180)
      doc.text(wrappedLines, 15, y)
      y += wrappedLines.length * 6
    }
  }

  // Professional footer
  y = 240
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.rect(120, y - 5, 75, 35)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(`Fait à ${praticien.address.split('\\n')[1] || 'Paris'}`, 15, y)
  doc.text(`Le ${new Date().toLocaleDateString('fr-FR')}`, 15, y + 6)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Signature et cachet', 125, y + 2)
  doc.text('du praticien :', 125, y + 7)

  // Legal mention
  y = 278
  doc.setFontSize(7)
  doc.setTextColor(120, 120, 120)
  doc.text('Ordonnance conforme aux dispositions du Code de la santé publique', 15, y)

  return doc
}

export const documentTemplates = {
  declarationGrossesse: generateDeclarationGrossesse,
  certificatGrossesse: generateCertificatGrossesse,
  arretTravail: generateArretTravail,
  ordonnanceBiologie: generateOrdonnanceBiologie,
  bilanPreEclampsie: generateBilanPreEclampsie,
  bilanCholestase: generateBilanCholestase,
  bilanDiabeteGestationnel: generateBilanDiabeteGestationnel,
  bilanAnemie: generateBilanAnemie,
  demandeEchographie: generateDemandeEchographie,
  compteRenduConsultation: generateCompteRenduConsultation,
  ordonnanceFromText: generateOrdonnanceFromText,
}

export type DocumentType = keyof typeof documentTemplates
