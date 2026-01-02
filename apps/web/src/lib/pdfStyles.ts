import jsPDF from 'jspdf'

// Palette de couleurs professionnelle pour le design médical
export const colors = {
  primary: '#2563eb', // Bleu professionnel
  secondary: '#7c3aed', // Violet
  success: '#10b981', // Vert
  warning: '#f59e0b', // Orange
  danger: '#ef4444', // Rouge
  dark: '#1f2937',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  white: '#ffffff',
}

// Fonction pour dessiner un en-tête moderne avec bandeau coloré
export function drawModernHeader(
  doc: jsPDF,
  praticien: {
    firstName: string
    lastName: string
    rpps?: string
    adeli?: string
    address: string
    phone: string
    email: string
  },
  accentColor: string = colors.primary
) {
  // Bandeau coloré en haut
  doc.setFillColor(accentColor)
  doc.rect(0, 0, 210, 25, 'F')

  // Nom du praticien en blanc sur le bandeau
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`${praticien.firstName} ${praticien.lastName}`, 15, 12)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Sage-femme', 15, 18)

  // Informations du praticien à droite
  const rightX = 140
  doc.setFontSize(8)
  if (praticien.rpps) doc.text(`RPPS: ${praticien.rpps}`, rightX, 10)
  if (praticien.adeli) doc.text(`ADELI: ${praticien.adeli}`, rightX, 14)
  doc.text(praticien.phone, rightX, 18)
  doc.text(praticien.email, rightX, 22)

  // Adresse en bas à gauche
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.text(praticien.address, 15, 32)

  // Ligne de séparation élégante
  doc.setDrawColor(accentColor)
  doc.setLineWidth(0.5)
  doc.line(15, 38, 195, 38)

  // Reset des couleurs
  doc.setTextColor(0, 0, 0)
}

// Fonction pour dessiner une box avec bordure arrondie
export function drawRoundedBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  borderColor: string = colors.primary,
  fillColor?: string
) {
  const radius = 2

  if (fillColor) {
    doc.setFillColor(fillColor)
    doc.roundedRect(x, y, width, height, radius, radius, 'F')
  }

  doc.setDrawColor(borderColor)
  doc.setLineWidth(0.3)
  doc.roundedRect(x, y, width, height, radius, radius, 'S')
}

// Fonction pour dessiner un badge/tag
export function drawBadge(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  color: string = colors.primary
) {
  const textWidth = doc.getTextWidth(text)
  const padding = 4
  const width = textWidth + padding * 2
  const height = 6

  doc.setFillColor(color)
  doc.roundedRect(x, y - 4, width, height, 2, 2, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text(text, x + padding, y)

  doc.setTextColor(0, 0, 0)
}

// Fonction pour dessiner une section avec titre
export function drawSection(
  doc: jsPDF,
  title: string,
  y: number,
  accentColor: string = colors.primary
): number {
  doc.setFillColor(accentColor)
  doc.rect(15, y, 4, 6, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(accentColor)
  doc.text(title, 22, y + 4)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)

  return y + 10
}

// Fonction pour dessiner les informations patient dans une box
export function drawPatientBox(
  doc: jsPDF,
  patient: {
    firstName: string
    lastName: string
    birthDate: string
    secuNumber?: string
    address?: string
    city?: string
    postalCode?: string
  },
  y: number
): number {
  const boxY = y
  const boxHeight = patient.address ? 35 : 25

  // Box avec bordure
  drawRoundedBox(doc, 15, boxY, 180, boxHeight, colors.primary, colors.lightGray)

  // Badge "Patient"
  drawBadge(doc, 'PATIENTE', 18, boxY + 7, colors.primary)

  // Nom en gras
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(`${patient.firstName} ${patient.lastName}`, 55, boxY + 7)

  // Date de naissance
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(colors.gray)

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR')
  doc.text(`Né(e) le ${formatDate(patient.birthDate)}`, 55, boxY + 13)

  // Numéro sécu si disponible
  if (patient.secuNumber) {
    doc.text(`N° Sécu: ${patient.secuNumber}`, 55, boxY + 19)
  }

  // Adresse si disponible
  if (patient.address) {
    doc.text(patient.address, 18, boxY + (patient.secuNumber ? 25 : 19))
    if (patient.city) {
      doc.text(`${patient.postalCode} ${patient.city}`, 18, boxY + (patient.secuNumber ? 31 : 25))
    }
  }

  doc.setTextColor(0, 0, 0)
  return boxY + boxHeight + 5
}

// Fonction pour dessiner le pied de page
export function drawFooter(
  doc: jsPDF,
  date: string = new Date().toLocaleDateString('fr-FR'),
  accentColor: string = colors.primary
) {
  const pageHeight = doc.internal.pageSize.height
  const y = pageHeight - 40

  // Ligne de séparation
  doc.setDrawColor(accentColor)
  doc.setLineWidth(0.3)
  doc.line(15, y, 195, y)

  // Texte du footer
  doc.setFontSize(9)
  doc.setTextColor(colors.gray)
  doc.text(`Document généré le ${date}`, 15, y + 7)
  doc.text('Document confidentiel - Usage médical uniquement', 15, y + 12)

  // Espace signature à droite
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.text('Signature et cachet du praticien :', 140, y + 7)

  // Box pour signature
  doc.setDrawColor(colors.gray)
  doc.setLineWidth(0.2)
  doc.rect(140, y + 10, 50, 20, 'S')
}

// Fonction pour dessiner un champ de formulaire
export function drawFormField(
  doc: jsPDF,
  label: string,
  value: string | undefined,
  x: number,
  y: number,
  width: number = 80
): number {
  doc.setFontSize(9)
  doc.setTextColor(colors.gray)
  doc.setFont('helvetica', 'normal')
  doc.text(label, x, y)

  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)

  if (value) {
    doc.text(value, x, y + 5)
  } else {
    doc.setDrawColor(colors.gray)
    doc.setLineWidth(0.2)
    doc.line(x, y + 6, x + width, y + 6)
  }

  doc.setFont('helvetica', 'normal')
  return y + 10
}

// Fonction pour dessiner une liste à puces stylée
export function drawBulletList(
  doc: jsPDF,
  items: string[],
  x: number,
  y: number,
  bulletColor: string = colors.primary
): number {
  let currentY = y

  items.forEach((item) => {
    // Puce colorée
    doc.setFillColor(bulletColor)
    doc.circle(x + 1, currentY - 1.5, 1, 'F')

    // Texte
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const lines = doc.splitTextToSize(item, 170)
    doc.text(lines, x + 5, currentY)

    currentY += lines.length * 5 + 2
  })

  return currentY
}

// Fonction pour dessiner une alerte/warning box
export function drawAlertBox(
  doc: jsPDF,
  text: string,
  y: number,
  type: 'info' | 'warning' | 'danger' | 'success' = 'info'
): number {
  const typeColors = {
    info: colors.primary,
    warning: colors.warning,
    danger: colors.danger,
    success: colors.success,
  }

  const color = typeColors[type]
  const boxHeight = 15

  // Bordure gauche colorée
  doc.setFillColor(color)
  doc.rect(15, y, 3, boxHeight, 'F')

  // Box de fond
  const lightColor = `${color}15` // 15 = opacity en hex
  drawRoundedBox(doc, 15, y, 180, boxHeight, color, colors.lightGray)

  // Icône
  doc.setFontSize(12)
  doc.setTextColor(color)
  const icons = {
    info: 'ℹ',
    warning: '⚠',
    danger: '⚠',
    success: '✓',
  }
  doc.text(icons[type], 22, y + 9)

  // Texte
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  const lines = doc.splitTextToSize(text, 160)
  doc.text(lines, 30, y + 9)

  return y + boxHeight + 5
}

// Fonction pour dessiner un tableau simple
export function drawTable(
  doc: jsPDF,
  headers: string[],
  rows: string[][],
  x: number,
  y: number,
  columnWidths: number[],
  accentColor: string = colors.primary
): number {
  const rowHeight = 8
  let currentY = y

  // En-têtes
  doc.setFillColor(accentColor)
  doc.rect(x, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)

  let currentX = x
  headers.forEach((header, i) => {
    doc.text(header, currentX + 2, currentY + 5)
    currentX += columnWidths[i]
  })

  currentY += rowHeight
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')

  // Lignes
  rows.forEach((row, rowIndex) => {
    if (rowIndex % 2 === 0) {
      doc.setFillColor(colors.lightGray)
      doc.rect(x, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F')
    }

    currentX = x
    row.forEach((cell, i) => {
      doc.text(cell, currentX + 2, currentY + 5)
      currentX += columnWidths[i]
    })

    currentY += rowHeight
  })

  // Bordure du tableau
  doc.setDrawColor(accentColor)
  doc.setLineWidth(0.3)
  doc.rect(x, y, columnWidths.reduce((a, b) => a + b, 0), currentY - y, 'S')

  return currentY + 5
}
