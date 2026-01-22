import { db } from '../lib/db.js'
import { ordonnanceTemplates } from '../lib/schema.js'

async function addChlamydiaTemplate() {
  console.log('Ajout du template Chlamydia...')

  try {
    await db.insert(ordonnanceTemplates).values({
      userId: null, // Template système
      nom: 'IST - Chlamydia',
      categorie: 'infections',
      type: 'medicament',
      priorite: 'urgent',
      contenu: `=== ORDONNANCE - INFECTION À CHLAMYDIA ===

DIAGNOSTIC :
☐ Leucorrhées purulentes
☐ Douleurs pelviennes
☐ Dysurie / brûlures mictionnelles
☐ Dépistage systématique positif
☐ Partenaire infecté

TRAITEMENT ANTIBIOTIQUE :
☐ AZITHROMYCINE 1g - 1 comprimé dose unique
  → Prise orale, en une fois
☐ OU DOXYCYCLINE 100mg - 2 cp/jour pendant 7 jours
  → Si contre-indication azithromycine

EXAMENS COMPLÉMENTAIRES :
☐ PCR Chlamydia trachomatis (confirmation)
☐ Dépistage autres IST recommandé :
  • VIH, syphilis, hépatites B et C
  • Gonorrhée (si symptômes associés)

CONSEILS IMPORTANTS :
☐ Traitement du/des partenaire(s) OBLIGATOIRE
☐ Abstinence sexuelle pendant traitement + 7 jours
☐ Préservatif lors des rapports ultérieurs
☐ Test de contrôle à 3 mois (risque réinfection)
☐ Déclaration anonyme recommandée

COMPLICATIONS À SURVEILLER :
☐ Salpingite (douleurs pelviennes persistantes)
☐ Syndrome inflammatoire pelvien
☐ Risque de stérilité si non traité

GROSSESSE :
☐ Si enceinte : AZITHROMYCINE uniquement
☐ Pas de doxycycline (contre-indiquée)

Prochain RDV : Test de contrôle à 3 mois [ ]`,
      description: 'Ordonnance pour traitement d\'infection à Chlamydia trachomatis',
      source: 'HAS',
      version: '2024.1',
      dateValidite: null,
      isActive: true,
      isSystemTemplate: true,
    })

    console.log('✅ Template Chlamydia ajouté avec succès!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

addChlamydiaTemplate()
