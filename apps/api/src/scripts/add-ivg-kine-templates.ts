import { db } from '../lib/db.js'
import { ordonnanceTemplates } from '../lib/schema.js'

async function addIVGKineTemplates() {
  console.log('Ajout ordonnances IVG et kinésithérapie...\n')

  const templates = [
    // ========== IVG MÉDICAMENTEUSE ==========
    {
      nom: 'IVG Médicamenteuse - Protocole complet',
      categorie: 'ivg',
      type: 'medicament' as const,
      priorite: 'urgent' as const,
      contenu: `=== ORDONNANCE IVG MÉDICAMENTEUSE ===

PROTOCOLE (jusqu'à 7 SA en ville, 9 SA en établissement):

JOUR 1 - MIFÉPRISTONE:
☐ MIFÉGYNE 600mg (Mifépristone)
  → 3 comprimés à 200mg
  → En 1 prise unique
  → À prendre devant le médecin/sage-femme
  → Stoppe la grossesse (anti-progestérone)

JOUR 3 (36-48h après Mifépristone) - MISOPROSTOL:
☐ GYMISO 200µg ou MISOPROSTOL 200µg
  → 2 comprimés = 400µg
  → Voie orale ou vaginale (selon terme)
  → Déclenche l'expulsion
  → À domicile ou en établissement selon terme

ANTALGIQUES (OBLIGATOIRES):
☐ PARACÉTAMOL 1g
  → 1 à 2 comprimés toutes les 6h si douleur
  → Maximum 4g/jour
  → Débuter avant Misoprostol

☐ IBUPROFÈNE 400mg
  → 1 comprimé toutes les 6-8h si douleur
  → Maximum 1200mg/jour
  → Contre-indiqué si allergie AINS
  → Alternative: ANTADYS (Flurbiprofène) 100mg

☐ SPASFON 80mg (Phloroglucinol)
  → 2 comprimés 3 fois/jour si crampes
  → Antispasmodique

ANTI-ÉMÉTIQUES (si nausées):
☐ PRIMPERAN 10mg (Métoclopramide)
  → 1 comprimé 3 fois/jour si besoin
  → OU VOGALÈNE 5mg

CONTRACEPTION POST-IVG (débuter le jour de l'IVG):
[Cocher la méthode choisie]
☐ PILULE ŒSTROPROGESTATIVE: [nom commercial]
  → Débuter le jour de la prise de Misoprostol
  → 1 cp/jour à heure fixe

☐ PILULE MICROPROGESTATIVE: [nom commercial]
  → Débuter le jour de la prise de Misoprostol
  → 1 cp/jour à heure fixe sans interruption

☐ DIU CUIVRE ou HORMONAL
  → Pose à prévoir 15 jours après IVG (après contrôle échographique)
  → RDV: [date]

☐ IMPLANT
  → Pose à prévoir: [date]

PRÉVENTION RHÉSUS (si Rh négatif):
☐ RHOPHYLAC 300µg (Immunoglobulines anti-D)
  → 1 injection IM dans les 72h après IVG
  → OBLIGATOIRE si rhésus négatif

CONSIGNES IMPORTANTES:
✓ Expulsion attendue 4-6h après Misoprostol
✓ Saignements: normaux pendant 1-2 semaines
✓ Douleurs: type règles douloureuses, prendre antalgiques
✓ URGENCE si: hémorragie (> 2 serviettes/h pendant 2h), fièvre > 38°C, douleurs intenses
✓ Pas de rapports sexuels pendant 15 jours
✓ Pas de tampons pendant 15 jours

SUIVI OBLIGATOIRE:
- Consultation contrôle: [date] (14-21 jours)
- Échographie + β-HCG pour vérifier IVG complète
- Téléphone urgence: [numéro centre IVG]

Ordonnance valable pour 3 mois.`,
      description: 'Protocole complet IVG médicamenteuse (Mifépristone + Misoprostol)',
      source: 'HAS',
    },

    // ========== IVG CHIRURGICALE ==========
    {
      nom: 'IVG Chirurgicale - Préparation et suites',
      categorie: 'ivg',
      type: 'medicament' as const,
      priorite: 'urgent' as const,
      contenu: `=== ORDONNANCE IVG CHIRURGICALE (Aspiration) ===

PRÉPARATION DU COL (si > 9 SA):
☐ MIFÉGYNE 600mg (Mifépristone)
  → 3 comprimés à 200mg
  → À prendre 24-48h avant intervention
  → OU GYMISO 400µg la veille

ANTIBIOPROPHYLAXIE (donnée le jour de l'intervention):
☐ AZITHROMYCINE 500mg
  → 2 comprimés en dose unique
  → Prévention infections

ANTALGIQUES POST-OPÉRATOIRES:
☐ PARACÉTAMOL 1g
  → 1 à 2 comprimés toutes les 6h si douleur
  → Maximum 4g/jour
  → Débuter dès sortie

☐ IBUPROFÈNE 400mg
  → 1 comprimé 3 fois/jour pendant 3 jours
  → Puis si besoin
  → Si allergie: ANTADYS 100mg

CONTRACEPTION POST-IVG (débuter le jour de l'IVG):
[Cocher la méthode choisie]
☐ PILULE ŒSTROPROGESTATIVE: [nom commercial]
  → Débuter le jour même de l'IVG
  → 1 cp/jour à heure fixe

☐ PILULE MICROPROGESTATIVE: [nom commercial]
  → Débuter le jour même de l'IVG
  → 1 cp/jour à heure fixe sans interruption

☐ DIU CUIVRE ou HORMONAL
  → Pose IMMÉDIATE le jour de l'IVG sous anesthésie
  → OU Pose différée à 15 jours (après contrôle)

☐ IMPLANT
  → Pose immédiate le jour de l'IVG
  → Valable 3 ans

PRÉVENTION RHÉSUS (si Rh négatif):
☐ RHOPHYLAC 300µg (Immunoglobulines anti-D)
  → 1 injection IM dans les 72h
  → OBLIGATOIRE si rhésus négatif

CONSIGNES POST-OPÉRATOIRES:
✓ Saignements: minimes à modérés pendant quelques jours
✓ Douleurs: modérées type règles, prendre antalgiques
✓ Repos 24-48h
✓ Pas de rapports sexuels pendant 15 jours
✓ Pas de tampons pendant 15 jours
✓ Pas de bains (douche autorisée)

SIGNES D'ALERTE (URGENCE):
⚠️ Fièvre > 38°C
⚠️ Douleurs pelviennes intenses
⚠️ Saignements abondants (> 2 serviettes/h)
⚠️ Pertes vaginales malodorantes
→ Contacter centre IVG: [téléphone]

SUIVI OBLIGATOIRE:
- Consultation contrôle: [date] (14-21 jours)
- Vérification IVG complète (échographie + β-HCG si besoin)

Ordonnance valable pour 3 mois.`,
      description: 'Préparation col + antalgiques + contraception post-IVG chirurgicale',
      source: 'HAS',
    },

    // ========== KINÉSITHÉRAPIE RÉÉDUCATION ABDOMINALE ==========
    {
      nom: 'Kinésithérapie - Rééducation abdominale post-partum',
      categorie: 'post_partum',
      type: 'autre' as const,
      priorite: 'recommande' as const,
      contenu: `=== ORDONNANCE KINÉSITHÉRAPIE ===
RÉÉDUCATION ABDOMINALE POST-PARTUM

INDICATION:
☐ Rééducation abdominale après accouchement
☐ Diastasis des grands droits ([X] cm)
☐ Hypotonie abdominale
☐ Douleurs lombaires post-partum

PRESCRIPTION:
☐ 10 séances de rééducation abdominale
  → À débuter APRÈS rééducation périnéale terminée
  → Délai minimum: 2-3 mois post-partum
  → Fréquence: 1-2 séances/semaine

OBJECTIFS:
1. Récupération tonus musculaire abdominal
2. Fermeture diastasis (si présent)
3. Renforcement ceinture abdominale
4. Correction posture
5. Prévention douleurs lombaires

TECHNIQUES:
- Renforcement musculaire progressif
- Travail transverse (muscle profond)
- Coordination respiration-gainage
- Exercices hypopressifs (si diastasis)
- Postures et conseils ergonomiques

CONTRE-INDICATIONS TEMPORAIRES:
- Périnée non récupéré (testing < 3/5)
- Prolapsus non traité
- Fuites urinaires persistantes
→ Priorité: rééducation périnéale AVANT abdominale

CONSIGNES:
- Apporter: compte-rendu bilan périnéal final
- Prévoir: tenue confortable, tapis de sol
- Exercices domicile: enseignés par kiné

Ordonnance valable 1 an.
Prise en charge sécurité sociale: 60% (+ mutuelle).

À débuter après validation fin rééducation périnéale.`,
      description: 'Rééducation abdominale post-partum (diastasis, hypotonie)',
      source: 'Recommandations CNGOF',
    },

    // ========== KINÉSITHÉRAPIE RÉÉDUCATION PÉRINÉALE ==========
    {
      nom: 'Kinésithérapie - Rééducation périnéale post-partum',
      categorie: 'post_partum',
      type: 'autre' as const,
      priorite: 'recommande' as const,
      contenu: `=== ORDONNANCE KINÉSITHÉRAPIE ===
RÉÉDUCATION PÉRINÉALE POST-PARTUM

INDICATION:
☐ Rééducation périnéale systématique après accouchement
☐ Incontinence urinaire d'effort
☐ Incontinence urinaire par impériosités
☐ Prolapsus débutant (cystocèle/rectocèle)
☐ Dyspareunie cicatricielle
☐ Diastasis périnéal
☐ Déchirure périnéale [degré]
☐ Épisiotomie

ACCOUCHEMENT:
- Date: [JJ/MM/AAAA]
- Voie: [voie basse / césarienne / instrumental]
- Périnée: [intact / déchirure / épisiotomie]

BILAN INITIAL RÉALISÉ:
- Testing périnéal: [X/5]
- Fuites urinaires: [oui / non]
- Prolapsus: [oui / non]

PRESCRIPTION:
☐ 10 séances de rééducation périnéale
  → Bilan + 10 séances + bilan final
  → À débuter 6-8 semaines post-partum minimum
  → Fréquence: 1-2 séances/semaine
  → Possible prolongation si insuffisant (sur nouvelle ordonnance)

TECHNIQUES POSSIBLES (choix kiné selon bilan):
- Rééducation manuelle (prise de conscience, renforcement)
- Biofeedback (visualisation contractions)
- Électrostimulation (si testing < 2/5)
- Travail postural et respiration
- Massage cicatrices (si épisiotomie/déchirure)

OBJECTIFS:
1. Prise de conscience périnée
2. Renforcement musculaire périnéal
3. Récupération continence urinaire
4. Prévention/traitement prolapsus
5. Amélioration confort sexuel
6. Coordination périnéo-abdominale

CONSIGNES:
- Débuter idéalement 2 mois post-partum
- Apporter: carnet de maternité, compte-rendu accouchement
- Exercices domicile: enseignés par kiné
- Rééducation abdominale: APRÈS périnée si diastasis

Ordonnance valable 1 an.
Prise en charge sécurité sociale: 60% (+ mutuelle).

IMPORTANT: Rééducation périnéale PRIORITAIRE avant toute rééducation abdominale.`,
      description: 'Rééducation périnéale post-partum (10 séances remboursées)',
      source: 'Recommandations HAS',
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

    console.log(`\n✅ ${templates.length} ordonnances ajoutées avec succès!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

addIVGKineTemplates()
