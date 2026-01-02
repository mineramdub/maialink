import { jsPDF } from 'jspdf'
import { writeFileSync } from 'fs'

// Données praticien
const praticien = {
  firstName: 'raphaelle',
  lastName: 'dubrulle',
  rpps: '10001234567',
  address: '12 rue de la Santé\n75014 Paris',
  phone: '01 23 45 67 89',
  email: 'raphaelledubrulle@yahoo.fr'
}

// Données patiente de test
const patient = {
  firstName: 'Marie',
  lastName: 'Martin',
  birthDate: '15/05/1990',
  secuNumber: '2900512345678'
}

function addHeader(doc: jsPDF, praticien: any) {
  // Header box with light background
  doc.setFillColor(245, 247, 250)
  doc.rect(10, 10, 190, 45, 'F')

  // Practitioner name - larger and bold
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`${praticien.firstName.toUpperCase()} ${praticien.lastName.toUpperCase()}`, 15, 18)

  // Title
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 80, 120)
  doc.text('Sage-femme', 15, 24)

  // Professional identifiers
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  if (praticien.rpps) {
    doc.text(`N° RPPS: ${praticien.rpps}`, 15, 30)
  }

  // Contact information - right aligned
  doc.setFontSize(9)
  const addressLines = praticien.address.split('\n')
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

function addDocumentTitle(doc: jsPDF, title: string, subtitle?: string, y: number = 70): number {
  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(40, 60, 100)
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

function addPatientInfo(doc: jsPDF, patient: any, y: number): number {
  // Patient info box
  doc.setFillColor(250, 250, 252)
  doc.rect(10, y - 3, 190, 22, 'F')

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
  doc.text(`Née le : ${patient.birthDate}`, 15, y + 15)

  // Reset colors
  doc.setTextColor(0, 0, 0)

  return y + 25
}

console.log('📄 Génération du PDF de test...\n')

// Create PDF
const doc = new jsPDF()

// Add header
addHeader(doc, praticien)

// Add title
let y = addDocumentTitle(doc, 'ORDONNANCE', 'Examens de biologie médicale', 70)

y += 5

// Add patient info
y = addPatientInfo(doc, patient, y)

y += 10

// Pregnancy info
doc.setFontSize(10)
doc.text('Grossesse : 20 SA + 3 jours', 15, y)

y += 15

// Prescribed exams
doc.setFont('helvetica', 'bold')
doc.text('EXAMENS PRESCRITS :', 15, y)
doc.setFont('helvetica', 'normal')

y += 10

const examens = [
  'NFS (Numération Formule Sanguine)',
  'Créatinine plasmatique',
  'Acide urique',
  'Transaminases (ASAT, ALAT)',
  'Protéinurie des 24h',
  'Glycémie à jeun'
]

examens.forEach((examen) => {
  doc.text(`☐ ${examen}`, 20, y)
  y += 6
})

y += 10

// Indication
doc.setFont('helvetica', 'bold')
doc.text('Indication :', 15, y)
doc.setFont('helvetica', 'normal')
y += 7
doc.text('Suivi de grossesse - Bilan du 2ème trimestre', 15, y)

y += 15
doc.setFontSize(9)
doc.text('Résultats à communiquer au prescripteur.', 15, y)

// Footer
y = 250
doc.setFontSize(11)
doc.text(`Le ${new Date().toLocaleDateString('fr-FR')}`, 15, y)
y += 10
doc.text('Signature et cachet du praticien :', 15, y)

// Save PDF
const pdfBuffer = doc.output('arraybuffer')
const fileName = `test-ordonnance-${Date.now()}.pdf`
const filePath = `/Users/raphaelledubrulle/maialink/${fileName}`

writeFileSync(filePath, Buffer.from(pdfBuffer))

console.log('✅ PDF généré avec succès !')
console.log(`📍 Emplacement: ${filePath}`)
console.log('\n📋 Contenu du PDF:')
console.log('  - En-tête praticien avec design professionnel')
console.log('  - Informations patiente')
console.log('  - Liste d\'examens de biologie')
console.log('  - Indication et date')
console.log('\n🎉 Ouvrez le fichier pour voir le résultat !')
