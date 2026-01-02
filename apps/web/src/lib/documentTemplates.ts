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
  doc.setFontSize(10)
  doc.text(`${praticien.firstName} ${praticien.lastName}`, 15, 15)
  doc.text(`Sage-femme`, 15, 20)
  if (praticien.rpps) doc.text(`RPPS: ${praticien.rpps}`, 15, 25)
  if (praticien.adeli) doc.text(`ADELI: ${praticien.adeli}`, 15, 30)
  doc.text(praticien.address, 15, 35)
  doc.text(`Tél: ${praticien.phone}`, 15, 40)
  doc.text(praticien.email, 15, 45)

  doc.setLineWidth(0.5)
  doc.line(15, 50, 195, 50)
}

function addPatientInfo(doc: jsPDF, patient: PatientData, y: number): number {
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Patiente :', 15, y)
  doc.setFont('helvetica', 'normal')
  doc.text(`${patient.firstName} ${patient.lastName}`, 15, y + 5)
  doc.text(`Née le : ${formatDate(patient.birthDate)}`, 15, y + 10)

  if (patient.address) {
    doc.text(`Adresse : ${patient.address}`, 15, y + 15)
    if (patient.city) {
      doc.text(`${patient.postalCode} ${patient.city}`, 15, y + 20)
      return y + 25
    }
    return y + 20
  }

  return y + 15
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

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('ORDONNANCE', 105, 70, { align: 'center' })
  doc.text('Examens de biologie médicale', 105, 78, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  let y = 95
  y = addPatientInfo(doc, patient, y)

  y += 10
  const sa = calculateSA(grossesse.ddr)
  doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days} jours`, 15, y)

  y += 15
  doc.setFont('helvetica', 'bold')
  doc.text('EXAMENS PRESCRITS :', 15, y)
  doc.setFont('helvetica', 'normal')

  y += 10
  examens.forEach((examen) => {
    doc.text(`☐ ${examen}`, 20, y)
    y += 6
  })

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Indication :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  doc.text(indication, 15, y)

  y += 15
  doc.setFontSize(9)
  doc.text('Résultats à communiquer au prescripteur.', 15, y)

  y = 250
  doc.setFontSize(11)
  doc.text(`Le ${new Date().toLocaleDateString('fr-FR')}`, 15, y)
  y += 10
  doc.text('Signature et cachet du praticien :', 15, y)

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

// Export all templates
export const documentTemplates = {
  declarationGrossesse: generateDeclarationGrossesse,
  certificatGrossesse: generateCertificatGrossesse,
  arretTravail: generateArretTravail,
  ordonnanceBiologie: generateOrdonnanceBiologie,
  demandeEchographie: generateDemandeEchographie,
  compteRenduConsultation: generateCompteRenduConsultation,
}

export type DocumentType = keyof typeof documentTemplates
