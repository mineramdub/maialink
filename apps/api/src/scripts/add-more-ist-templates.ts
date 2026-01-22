import { db } from '../lib/db.js'
import { ordonnanceTemplates } from '../lib/schema.js'

async function addMoreISTTemplates() {
  console.log('Ajout de templates IST supplémentaires...\n')

  const templates = [
    // GONORRHÉE
    {
      nom: 'IST - Gonorrhée (Gonocoque)',
      categorie: 'infections',
      type: 'medicament' as const,
      priorite: 'urgent' as const,
      contenu: `=== ORDONNANCE - GONORRHÉE (GONOCOQUE) ===

DIAGNOSTIC :
☐ Leucorrhées purulentes jaunâtres
☐ Dysurie, brûlures intenses
☐ Douleurs pelviennes
☐ Partenaire diagnostiqué
☐ Dépistage positif (PCR gonocoque)

TRAITEMENT ANTIBIOTIQUE :
☐ CEFTRIAXONE 500mg - 1 injection IM dose unique
  → À administrer en cabinet/hôpital
☐ + AZITHROMYCINE 1g - 1 cp dose unique
  → Traitement combiné systématique

EXAMENS COMPLÉMENTAIRES :
☐ PCR Chlamydia (co-infection fréquente 40%)
☐ Dépistage autres IST :
  • VIH, syphilis, hépatites B et C

CONSEILS IMPÉRATIFS :
☐ Traitement partenaire(s) OBLIGATOIRE
☐ Abstinence complète 7 jours
☐ Test de contrôle à 2 semaines
☐ Déclaration obligatoire

URGENCE SI :
☐ Fièvre > 38.5°C
☐ Douleurs pelviennes sévères
→ Hospitalisation (risque salpingite aiguë)

Prochain RDV : Contrôle à 2 semaines [ ]`,
      description: 'Ordonnance pour traitement de gonorrhée (gonocoque)',
      source: 'HAS',
    },

    // VAGINOSE BACTÉRIENNE
    {
      nom: 'Vaginose Bactérienne',
      categorie: 'infections',
      type: 'medicament' as const,
      priorite: 'recommande' as const,
      contenu: `=== ORDONNANCE - VAGINOSE BACTÉRIENNE ===

DIAGNOSTIC :
☐ Leucorrhées grisâtres fluides
☐ Odeur de "poisson" (amine)
☐ pH vaginal > 4.5
☐ Absence de prurit
☐ Test amine positif

TRAITEMENT LOCAL :
☐ MÉTRONIDAZOLE ovule 500mg
  → 1 ovule/jour pendant 7 jours
  → Au coucher
☐ OU MÉTRONIDAZOLE gel vaginal 0.75%
  → 1 applicateur/jour pendant 7 jours

TRAITEMENT ORAL (alternative) :
☐ MÉTRONIDAZOLE 500mg
  → 2 cp/jour pendant 7 jours
  → Pendant les repas

CONTRE-INDICATIONS :
☐ PAS D'ALCOOL pendant traitement + 48h après
  (Effet antabuse)
☐ Grossesse T1 : éviter si possible

CONSEILS :
☐ Toilette intime douce pH neutre
☐ Sous-vêtements coton
☐ Traitement partenaire NON systématique
☐ Possible en période de règles

SUIVI :
☐ Si récidives fréquentes : bilan élargi
☐ Vérifier équilibre flore

Prochain RDV : Si persistance à 7 jours [ ]`,
      description: 'Ordonnance pour traitement de vaginose bactérienne',
      source: 'HAS',
    },

    // TRICHOMONASE
    {
      nom: 'IST - Trichomonase',
      categorie: 'infections',
      type: 'medicament' as const,
      priorite: 'urgent' as const,
      contenu: `=== ORDONNANCE - TRICHOMONASE ===

DIAGNOSTIC :
☐ Leucorrhées jaune-verdâtres spumeuses
☐ Prurit vulvo-vaginal intense
☐ Dysurie, dyspareunie
☐ Odeur désagréable
☐ Colpite diffuse au spéculum

TRAITEMENT ANTIBIOTIQUE :
☐ MÉTRONIDAZOLE 2g - Dose unique
  → 4 comprimés de 500mg en une prise
  → OU 500mg x 2/jour pendant 7 jours
☐ OU TINIDAZOLE 2g - Dose unique

IMPÉRATIF :
☐ Traitement du/des partenaire(s) OBLIGATOIRE
  (Même si asymptomatique)
☐ Traitement simultané couple

CONTRE-INDICATIONS :
☐ AUCUN ALCOOL pendant + 48h après
  (Risque effet antabuse sévère)
☐ Grossesse T1 : différer si possible

EXAMENS ASSOCIÉS :
☐ Dépistage autres IST recommandé
☐ VIH, syphilis, hépatites

CONSEILS :
☐ Abstinence pendant traitement
☐ Préservatif obligatoire après
☐ Test de contrôle à 3 mois
☐ Toilette intime douce

Prochain RDV : Test de contrôle à 3 mois [ ]`,
      description: 'Ordonnance pour traitement de trichomonase (IST à Trichomonas vaginalis)',
      source: 'HAS',
    },
  ]

  try {
    for (const template of templates) {
      await db.insert(ordonnanceTemplates).values({
        userId: null,
        nom: template.nom,
        categorie: template.categorie,
        type: template.type,
        priorite: template.priorite,
        contenu: template.contenu,
        description: template.description,
        source: template.source,
        version: '2024.1',
        dateValidite: null,
        isActive: true,
        isSystemTemplate: true,
      })

      console.log(`✅ ${template.nom}`)
    }

    console.log(`\n✅ ${templates.length} templates ajoutés avec succès!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

addMoreISTTemplates()
