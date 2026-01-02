import jsPDF from 'jspdf'
import {
  colors,
  drawModernHeader,
  drawPatientBox,
  drawSection,
  drawFooter,
  drawAlertBox,
  drawBulletList,
} from './pdfStyles'
import { PatientData, GrossesseData, PraticienData } from './documentTemplatesModern'

// ============================================================================
// 1. SUPPLÉMENTATION GROSSESSE
// ============================================================================

export function generateOrdonnanceSupplementationGrossesse(
  patient: PatientData,
  grossesse: GrossesseData,
  supplements: {
    acideFolique?: boolean
    fer?: boolean
    vitamineD?: boolean
    calcium?: boolean
    magnesium?: boolean
    omega3?: boolean
  },
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.success)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.success)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Supplémentation grossesse', 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  const sa = calculateSA(grossesse.ddr)
  doc.setFontSize(10)
  doc.setTextColor(colors.gray)
  doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days}j`, 15, y)
  y += 15

  y = drawSection(doc, 'Prescription', y, colors.success)

  let itemNum = 1

  if (supplements.acideFolique) {
    y = drawMedicamentItem(doc, itemNum++, 'ACIDE FOLIQUE 400 µg', '1 comprimé par jour', 'Jusqu\'à 12 SA', y, colors.success)
  }

  if (supplements.fer) {
    y = drawMedicamentItem(doc, itemNum++, 'FER (Tardyferon B9® ou équivalent)', '1 comprimé par jour, le matin à jeun', 'Jusqu\'à l\'accouchement', y, colors.success)
  }

  if (supplements.vitamineD) {
    y = drawMedicamentItem(doc, itemNum++, 'VITAMINE D3 100 000 UI', '1 ampoule en une prise', 'À 28 SA (7ème mois)', y, colors.success)
  }

  if (supplements.calcium) {
    y = drawMedicamentItem(doc, itemNum++, 'CALCIUM 500 mg + Vitamine D', '1 comprimé matin et soir', 'Selon besoin', y, colors.success)
  }

  if (supplements.magnesium) {
    y = drawMedicamentItem(doc, itemNum++, 'MAGNÉSIUM 300 mg', '1 à 2 comprimés par jour', '1 à 3 mois', y, colors.success)
  }

  if (supplements.omega3) {
    y = drawMedicamentItem(doc, itemNum++, 'OMÉGA 3 (DHA)', '1 capsule par jour au repas', 'Jusqu\'à l\'accouchement', y, colors.success)
  }

  y += 5
  y = drawAlertBox(doc, '💡 Conseil : Prendre avec un grand verre d\'eau, de préférence pendant les repas', y, 'info')

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.success)
  return doc
}

// ============================================================================
// 2. TRAITEMENT NAUSÉES/VOMISSEMENTS GRAVIDIQUES
// ============================================================================

export function generateOrdonnanceNausees(
  patient: PatientData,
  grossesse: GrossesseData,
  severite: 'legere' | 'moderee' | 'severe',
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.warning)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.warning)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Traitement nausées et vomissements', 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  const sa = calculateSA(grossesse.ddr)
  doc.setFontSize(10)
  doc.setTextColor(colors.gray)
  doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days}j`, 15, y)
  y += 15

  y = drawSection(doc, 'Prescription', y, colors.warning)

  let itemNum = 1

  // Traitement de base
  y = drawMedicamentItem(doc, itemNum++, 'VITAMINE B6 (Pyridoxine) 40 mg', '1 comprimé 3 fois par jour', '7 jours, renouvelable', y, colors.warning)

  if (severite !== 'legere') {
    y = drawMedicamentItem(doc, itemNum++, 'DOXYLAMINE 15 mg (Donormyl®)', '1 comprimé le soir au coucher', '7 jours, renouvelable', y, colors.warning)
  }

  if (severite === 'severe') {
    y = drawMedicamentItem(doc, itemNum++, 'MÉTOCLOPRAMIDE 10 mg (Primpéran®)', '1 comprimé avant les repas si besoin', 'Maximum 3 par jour, 5 jours', y, colors.warning)
  }

  y += 5
  y = drawSection(doc, 'Conseils hygiéno-diététiques', y, colors.warning)

  const conseils = [
    'Fractionner les repas (5-6 petits repas par jour)',
    'Éviter les aliments gras, épicés ou odorants',
    'Privilégier les aliments froids ou tièdes',
    'Boire fréquemment en petites quantités',
    'Se reposer après les repas',
  ]
  y = drawBulletList(doc, conseils, 15, y, colors.warning)

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.warning)
  return doc
}

// ============================================================================
// 3. TRAITEMENT INFECTION URINAIRE
// ============================================================================

export function generateOrdonnanceInfectionUrinaire(
  patient: PatientData,
  grossesse: GrossesseData | null,
  type: 'cystite' | 'bacteriurie',
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.danger)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.danger)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Traitement infection urinaire', 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  if (grossesse) {
    const sa = calculateSA(grossesse.ddr)
    doc.setFontSize(10)
    doc.setTextColor(colors.gray)
    doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days}j`, 15, y)
    y += 15
  }

  y = drawSection(doc, 'Prescription', y, colors.danger)

  let itemNum = 1

  // ECBU d'abord
  y = drawMedicamentItem(doc, itemNum++, 'ECBU (Examen cytobactériologique des urines)', 'En urgence avec antibiogramme', '1 exemplaire', y, colors.danger)

  // Antibiotique
  y = drawMedicamentItem(doc, itemNum++, 'FOSFOMYCINE-TROMÉTAMOL 3g (Monuril®)', '1 sachet en prise unique, le soir au coucher, vessie vide', '1 jour', y, colors.danger)

  // Alternative si grossesse
  if (grossesse) {
    doc.setFontSize(9)
    doc.setTextColor(colors.gray)
    doc.text('Alternative si allergie : AMOXICILLINE 1g x 3/j pendant 7 jours', 25, y)
    y += 5
    doc.setTextColor(0, 0, 0)
  }

  y += 10
  y = drawAlertBox(doc, '⚠️ ECBU de contrôle 8-10 jours après la fin du traitement', y, 'warning')

  y += 5
  y = drawSection(doc, 'Conseils', y, colors.danger)

  const conseils = [
    'Boire abondamment (2 litres par jour)',
    'Uriner fréquemment, ne pas se retenir',
    'Uriner après les rapports sexuels',
    'Hygiène intime avec savon doux',
    'Consulter si fièvre, douleurs lombaires ou persistance des symptômes',
  ]
  y = drawBulletList(doc, conseils, 15, y, colors.danger)

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.danger)
  return doc
}

// ============================================================================
// 4. TRAITEMENT MYCOSE VAGINALE
// ============================================================================

export function generateOrdonnanceMycose(
  patient: PatientData,
  grossesse: GrossesseData | null,
  recidivante: boolean,
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.secondary)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.secondary)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Traitement mycose vaginale', 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  if (grossesse) {
    const sa = calculateSA(grossesse.ddr)
    doc.setFontSize(10)
    doc.setTextColor(colors.gray)
    doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days}j`, 15, y)
    y += 15
  }

  y = drawSection(doc, 'Prescription', y, colors.secondary)

  let itemNum = 1

  // Ovule
  y = drawMedicamentItem(doc, itemNum++, 'ÉCONAZOLE 150 mg ovule (Gyno-Pévaryl®)', '1 ovule le soir au coucher', '3 jours consécutifs', y, colors.secondary)

  // Crème externe
  y = drawMedicamentItem(doc, itemNum++, 'ÉCONAZOLE crème 1% (Pévaryl®)', 'Application externe 2 fois par jour', '7 jours', y, colors.secondary)

  if (recidivante && !grossesse) {
    y += 5
    y = drawAlertBox(doc, '📋 Prélèvement vaginal recommandé en cas de récidive', y, 'info')
  }

  y += 5
  y = drawSection(doc, 'Conseils', y, colors.secondary)

  const conseils = [
    'Toilette intime avec savon doux, sans antiseptique',
    'Sécher soigneusement après la toilette',
    'Sous-vêtements en coton, éviter les synthétiques',
    'Éviter les vêtements trop serrés',
    'Traiter le partenaire si symptômes',
    'Éviter les rapports sexuels pendant le traitement',
  ]
  y = drawBulletList(doc, conseils, 15, y, colors.secondary)

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.secondary)
  return doc
}

// ============================================================================
// 5. CONTRACEPTION POST-PARTUM
// ============================================================================

export function generateOrdonnanceContraception(
  patient: PatientData,
  typeContraception: 'pilule' | 'implant' | 'diu' | 'patch' | 'anneau',
  allaitement: boolean,
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.primary)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.primary)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Contraception', 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  if (allaitement) {
    y = drawAlertBox(doc, '🤱 Patiente allaitante - Contraception compatible', y, 'info')
    y += 5
  }

  y = drawSection(doc, 'Prescription', y, colors.primary)

  let itemNum = 1

  switch (typeContraception) {
    case 'pilule':
      if (allaitement) {
        y = drawMedicamentItem(doc, itemNum++, 'DÉSOGESTREL 75 µg (Cérazette®)', '1 comprimé par jour en continu', '3 mois, renouvelable', y, colors.primary)
      } else {
        y = drawMedicamentItem(doc, itemNum++, 'LÉVONORGESTREL/ÉTHINYLESTRADIOL (Microval® ou équivalent)', '1 comprimé par jour', '3 mois, renouvelable', y, colors.primary)
      }
      break

    case 'implant':
      y = drawMedicamentItem(doc, itemNum++, 'IMPLANT ÉTONOGESTREL 68 mg (Nexplanon®)', 'Pose par sage-femme', 'Valable 3 ans', y, colors.primary)
      break

    case 'diu':
      y = drawMedicamentItem(doc, itemNum++, 'DIU AU CUIVRE (ou DIU hormonal)', 'Pose par sage-femme à partir de 4 semaines post-partum', 'Valable 5-10 ans selon modèle', y, colors.primary)
      break

    case 'patch':
      y = drawMedicamentItem(doc, itemNum++, 'PATCH CONTRACEPTIF (Evra®)', '1 patch par semaine, 3 semaines/4', '3 mois, renouvelable', y, colors.primary)
      break

    case 'anneau':
      y = drawMedicamentItem(doc, itemNum++, 'ANNEAU VAGINAL (NuvaRing®)', '1 anneau pour 3 semaines, 1 semaine de pause', '3 mois, renouvelable', y, colors.primary)
      break
  }

  y += 10
  y = drawSection(doc, 'Informations importantes', y, colors.primary)

  const infos = [
    'Démarrer la contraception 21 jours après l\'accouchement minimum',
    'Première prise : 1er jour des règles ou à la date convenue',
    'Efficacité immédiate si démarrage correct',
    'Consulter en cas d\'oubli, saignements anormaux, effets secondaires',
    'Contrôle à 3 mois puis annuel',
  ]
  y = drawBulletList(doc, infos, 15, y, colors.primary)

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.primary)
  return doc
}

// ============================================================================
// 6. RÉÉDUCATION PÉRINÉALE
// ============================================================================

export function generateOrdonnanceReeducationPerineale(
  patient: PatientData,
  dateAccouchement: string,
  nombreSeances: number,
  indication: string,
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.secondary)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.secondary)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Rééducation périnéale', 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  doc.setFontSize(10)
  doc.setTextColor(colors.gray)
  doc.text(`Accouchement : ${formatDate(dateAccouchement)}`, 15, y)
  y += 15

  y = drawSection(doc, 'Prescription', y, colors.secondary)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`RÉÉDUCATION PÉRINÉO-SPHINCTÉRIENNE`, 15, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  y += 7
  doc.text(`${nombreSeances} séances`, 15, y)
  y += 6
  doc.text(`À débuter 6-8 semaines après l'accouchement`, 15, y)

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Indication :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 6
  const lines = doc.splitTextToSize(indication, 175)
  doc.text(lines, 15, y)
  y += lines.length * 5

  y += 10
  doc.setFontSize(9)
  doc.setTextColor(colors.gray)
  doc.text('Remboursement : 100% par l\'Assurance Maladie', 15, y)
  doc.setTextColor(0, 0, 0)

  y += 10
  y = drawSection(doc, 'Techniques possibles', y, colors.secondary)

  const techniques = [
    'Rééducation manuelle',
    'Électrostimulation',
    'Biofeedback',
    'Travail postural et proprioceptif',
  ]
  y = drawBulletList(doc, techniques, 15, y, colors.secondary)

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.secondary)
  return doc
}

// ============================================================================
// 7. EXAMENS BIOLOGIQUES GROSSESSE
// ============================================================================

export function generateOrdonnanceBilanGrossesse(
  patient: PatientData,
  grossesse: GrossesseData,
  trimestre: 1 | 2 | 3,
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.primary)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.primary)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text(`Bilan biologique T${trimestre}`, 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  const sa = calculateSA(grossesse.ddr)
  doc.setFontSize(10)
  doc.setTextColor(colors.gray)
  doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days}j`, 15, y)
  y += 15

  y = drawSection(doc, 'Examens prescrits', y, colors.primary)

  const examens: string[] = []

  if (trimestre === 1) {
    examens.push(
      '☐ Groupe sanguin ABO + Rhésus + RAI (si pas de carte)',
      '☐ Sérologie Toxoplasmose (si négative)',
      '☐ Sérologie Rubéole (si statut inconnu)',
      '☐ Sérologie Syphilis (TPHA-VDRL)',
      '☐ Sérologie VIH (après information)',
      '☐ Sérologie Hépatite B (AgHBs)',
      '☐ Glycémie à jeun',
      '☐ ECBU',
      '☐ NFS (Numération Formule Sanguine)',
      '☐ TSH (si antécédents thyroïdiens)'
    )
  } else if (trimestre === 2) {
    examens.push(
      '☐ RAI (si rhésus négatif ou antécédent transfusionnel)',
      '☐ Sérologie Toxoplasmose (si négative au T1)',
      '☐ Test O\'Sullivan (glycémie 1h après 50g glucose)',
      '☐ ECBU',
      '☐ NFS'
    )
  } else {
    examens.push(
      '☐ RAI (si rhésus négatif)',
      '☐ Sérologie Toxoplasmose (si négative)',
      '☐ NFS',
      '☐ Groupe sanguin + RAI (contrôle)',
      '☐ AgHBs (contrôle hépatite B)',
      '☐ Streptocoque B (PV à 35-37 SA)'
    )
  }

  doc.setFontSize(10)
  examens.forEach((examen) => {
    doc.text(examen, 15, y)
    y += 6
  })

  y += 5
  doc.setFontSize(9)
  doc.setTextColor(colors.gray)
  doc.text('Prise en charge à 100% au titre de la grossesse', 15, y)
  doc.setTextColor(0, 0, 0)

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.primary)
  return doc
}

// ============================================================================
// 8. TRAITEMENT HÉMORROÏDES
// ============================================================================

export function generateOrdonnanceHemorroides(
  patient: PatientData,
  grossesse: GrossesseData | null,
  severite: 'legere' | 'moderee',
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.danger)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.danger)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Traitement hémorroïdes', 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  if (grossesse) {
    const sa = calculateSA(grossesse.ddr)
    doc.setFontSize(10)
    doc.setTextColor(colors.gray)
    doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days}j`, 15, y)
    y += 15
  }

  y = drawSection(doc, 'Prescription', y, colors.danger)

  let itemNum = 1

  // Traitement local
  y = drawMedicamentItem(doc, itemNum++, 'TITANORÉINE crème ou suppositoires', 'Application locale 2 fois par jour', '7 jours', y, colors.danger)

  if (severite === 'moderee') {
    y = drawMedicamentItem(doc, itemNum++, 'DIOSMINE 600 mg (Daflon®)', '2 comprimés matin et midi pendant 4 jours, puis 2 par jour', '7 jours', y, colors.danger)
  }

  // Laxatif doux
  y = drawMedicamentItem(doc, itemNum++, 'LACTULOSE (Duphalac®) sirop', '1 à 2 sachets par jour', 'Selon besoin', y, colors.danger)

  y += 5
  y = drawSection(doc, 'Conseils', y, colors.danger)

  const conseils = [
    'Alimentation riche en fibres (fruits, légumes, céréales)',
    'Boire abondamment (1,5 à 2 litres par jour)',
    'Éviter les efforts de poussée',
    'Toilette locale à l\'eau tiède après chaque selle',
    'Activité physique régulière (marche)',
    'Ne pas rester longtemps assis',
  ]
  y = drawBulletList(doc, conseils, 15, y, colors.danger)

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.danger)
  return doc
}

// ============================================================================
// 9. PRÉVENTION THROMBOSE (Bas de contention)
// ============================================================================

export function generateOrdonnanceBasContention(
  patient: PatientData,
  grossesse: GrossesseData | null,
  classe: 1 | 2 | 3,
  indication: string,
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.primary)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.primary)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Bas de contention', 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  if (grossesse) {
    const sa = calculateSA(grossesse.ddr)
    doc.setFontSize(10)
    doc.setTextColor(colors.gray)
    doc.text(`Grossesse : ${sa.weeks} SA + ${sa.days}j`, 15, y)
    y += 15
  }

  y = drawSection(doc, 'Prescription', y, colors.primary)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`BAS DE CONTENTION CLASSE ${classe}`, 15, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  y += 7
  doc.text('Type : Bas cuisse ou collant de contention', 15, y)
  y += 6
  doc.text('Quantité : 2 paires', 15, y)
  y += 6
  doc.text('À porter toute la journée, du lever au coucher', 15, y)

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Indication :', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 6
  const lines = doc.splitTextToSize(indication, 175)
  doc.text(lines, 15, y)
  y += lines.length * 5

  y += 10
  y = drawAlertBox(doc, '📏 Prendre les mesures le matin au lever (cheville, mollet, cuisse)', y, 'info')

  y += 5
  y = drawSection(doc, 'Conseils d\'utilisation', y, colors.primary)

  const conseils = [
    'Mettre les bas le matin avant de se lever',
    'Les enfiler progressivement sans tirer',
    'Laver à 30-40°C, séchage à plat',
    'Renouveler tous les 6 mois',
    'Consulter si douleurs, œdème important ou signes de phlébite',
  ]
  y = drawBulletList(doc, conseils, 15, y, colors.primary)

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.primary)
  return doc
}

// ============================================================================
// 10. VACCINATIONS (DTP, Coqueluche, Grippe)
// ============================================================================

export function generateOrdonnanceVaccination(
  patient: PatientData,
  vaccins: {
    dtpCoqueluche?: boolean
    grippe?: boolean
    hepatiteB?: boolean
  },
  contexte: 'grossesse' | 'postpartum' | 'general',
  praticien: PraticienData
): jsPDF {
  const doc = new jsPDF()
  drawModernHeader(doc, praticien, colors.success)

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(colors.success)
  doc.text('ORDONNANCE', 105, 52, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Vaccination', 105, 60, { align: 'center' })

  let y = 75
  y = drawPatientBox(doc, patient, y)
  y += 5

  if (contexte === 'grossesse') {
    y = drawAlertBox(doc, '🤰 Vaccination pendant la grossesse', y, 'info')
    y += 5
  } else if (contexte === 'postpartum') {
    y = drawAlertBox(doc, '👶 Vaccination post-partum immédiate', y, 'success')
    y += 5
  }

  y = drawSection(doc, 'Prescription', y, colors.success)

  let itemNum = 1

  if (vaccins.dtpCoqueluche) {
    y = drawMedicamentItem(doc, itemNum++, 'BOOSTRIXTETRA® (DTP + Coqueluche)', 'Injection IM en une fois', contexte === 'grossesse' ? 'Entre 20 et 36 SA (idéal 2e trimestre)' : 'Dès la sortie de maternité', y, colors.success)
  }

  if (vaccins.grippe) {
    y = drawMedicamentItem(doc, itemNum++, 'VACCIN ANTIGRIPPAL saisonnier', 'Injection IM en une fois', 'Dès le 1er trimestre pendant la saison grippale', y, colors.success)
  }

  if (vaccins.hepatiteB) {
    y = drawMedicamentItem(doc, itemNum++, 'ENGERIX B20® (Hépatite B)', 'Injection IM', 'Schéma M0-M1-M6', y, colors.success)
  }

  y += 10
  y = drawSection(doc, 'Informations', y, colors.success)

  const infos = [
    'Injection à réaliser par une sage-femme ou un médecin',
    'Aucun délai à respecter entre les vaccins',
    'Prise en charge à 100% par l\'Assurance Maladie',
    'Vaccination coqueluche : protection du nouveau-né par anticorps maternels',
    'Carnet de vaccination à jour recommandé',
  ]
  y = drawBulletList(doc, infos, 15, y, colors.success)

  drawFooter(doc, new Date().toLocaleDateString('fr-FR'), colors.success)
  return doc
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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

function drawMedicamentItem(
  doc: jsPDF,
  numero: number,
  nom: string,
  posologie: string,
  duree: string,
  y: number,
  color: string
): number {
  // Numéro circulaire
  doc.setFillColor(color)
  doc.circle(18, y + 2, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(numero.toString(), 18, y + 3, { align: 'center' })

  // Nom du médicament
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(nom, 25, y + 3)

  // Posologie
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  y += 7
  doc.text(`Posologie : ${posologie}`, 25, y)

  // Durée
  y += 5
  doc.setFontSize(9)
  doc.setTextColor(colors.gray)
  doc.text(`Durée : ${duree}`, 25, y)
  doc.setTextColor(0, 0, 0)

  return y + 10
}

// Export all ordonnance templates
export const ordonnancesTemplates = {
  supplementationGrossesse: generateOrdonnanceSupplementationGrossesse,
  nausees: generateOrdonnanceNausees,
  infectionUrinaire: generateOrdonnanceInfectionUrinaire,
  mycose: generateOrdonnanceMycose,
  contraception: generateOrdonnanceContraception,
  reeducationPerineale: generateOrdonnanceReeducationPerineale,
  bilanGrossesse: generateOrdonnanceBilanGrossesse,
  hemorroides: generateOrdonnanceHemorroides,
  basContention: generateOrdonnanceBasContention,
  vaccination: generateOrdonnanceVaccination,
}

export type OrdonnanceType = keyof typeof ordonnancesTemplates
