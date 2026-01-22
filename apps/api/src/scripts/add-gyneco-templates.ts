import { db } from '../lib/db.js'
import { ordonnanceTemplates } from '../lib/schema.js'

async function addGynecoTemplates() {
  console.log('Ajout de templates gynécologiques manquants...\n')

  const templates = [
    // AMÉNORRHÉE
    {
      nom: 'Aménorrhée - Bilan',
      categorie: 'gynécologie',
      type: 'biologie' as const,
      priorite: 'urgent' as const,
      contenu: `=== ORDONNANCE - BILAN AMÉNORRHÉE ===

DÉFINITION :
☐ Aménorrhée primaire (jamais de règles à 16 ans)
☐ Aménorrhée secondaire (absence > 3 mois)

BILAN HORMONAL À PRESCRIRE :
☐ β-HCG (éliminer grossesse) - OBLIGATOIRE
☐ FSH, LH
☐ Œstradiol
☐ Prolactine
☐ TSH (dysthyroïdie)
☐ Testostérone totale
☐ 17-OH progestérone (hyperplasie surrénale)

EXAMENS COMPLÉMENTAIRES :
☐ Échographie pelvienne
☐ Test au progestatif (si β-HCG négatif)

CAUSES À RECHERCHER :
☐ Grossesse (cause n°1 à éliminer)
☐ Syndrome des ovaires polykystiques (SOPK)
☐ Hyperprolactinémie
☐ Insuffisance ovarienne prématurée
☐ Troubles du comportement alimentaire
☐ Stress, sport intensif
☐ Ménopause précoce

ORIENTATION :
☐ Si β-HCG positif → Suivi grossesse
☐ Si bilan anormal → Avis gynécologue/endocrinologue
☐ Si origine fonctionnelle → Rassurer, conseils hygiène de vie

Prochain RDV : Résultats à [ ]`,
      description: 'Bilan biologique et exploration d\'une aménorrhée',
      source: 'HAS/CNGOF',
    },

    // MÉNORRAGIES (Règles abondantes) - Déjà existant mais améliorons
    {
      nom: 'Ménorragies - Traitement',
      categorie: 'gynécologie',
      type: 'medicament' as const,
      priorite: 'recommande' as const,
      contenu: `=== ORDONNANCE - MÉNORRAGIES (Règles abondantes) ===

DIAGNOSTIC :
☐ Règles > 7 jours
☐ Saignements abondants (> 5-6 protections/jour)
☐ Caillots
☐ Anémie ferriprive (fatigue, pâleur)

TRAITEMENT MÉDICAL :
☐ ACIDE TRANEXAMIQUE (EXACYL) 500mg
  → 3-4 cp/jour pendant les règles (max 4 jours)
  → Réduit les saignements de 40-50%

☐ OU ANTI-INFLAMMATOIRES (AINS)
  → IBUPROFÈNE 400mg : 3x/jour pendant règles
  → Réduit flux + douleurs

☐ TRAITEMENT HORMONAL (si échec) :
  → Pilule œstroprogestative en continu
  → DIU hormonal Mirena (très efficace)
  → Progestatifs 2e partie de cycle

BILAN COMPLÉMENTAIRE :
☐ NFS (vérifier anémie)
☐ Ferritine (carence martiale fréquente)
☐ Échographie pelvienne (si > 40 ans ou résistance)

SUPPLÉMENTATION :
☐ FER (si ferritine basse ou anémie)
  → TARDYFERON 80mg : 1 cp/jour
  → À jeun ou en dehors des repas

SURVEILLANCE :
☐ Efficacité à évaluer cycle suivant
☐ Si échec ou > 40 ans → Avis gynécologue

Prochain RDV : Contrôle cycle suivant [ ]`,
      description: 'Traitement médical des règles abondantes (ménorragies)',
      source: 'HAS/CNGOF',
    },

    // SPANIOMÉNORRHÉE
    {
      nom: 'Spanioménorrhée - Exploration',
      categorie: 'gynécologie',
      type: 'biologie' as const,
      priorite: 'recommande' as const,
      contenu: `=== ORDONNANCE - SPANIOMÉNORRHÉE (Cycles longs) ===

DÉFINITION :
☐ Cycles > 35 jours
☐ < 9 cycles/an
☐ Oligoménorrhée associée

BILAN HORMONAL :
☐ β-HCG (éliminer grossesse)
☐ FSH, LH (ratio LH/FSH si SOPK)
☐ Œstradiol
☐ Testostérone totale + libre
☐ Delta-4-androstènedione
☐ 17-OH progestérone
☐ TSH (dysthyroïdie)
☐ Prolactine

EXAMENS COMPLÉMENTAIRES :
☐ Échographie pelvienne
  → Recherche SOPK (ovaires polymicrokystiques)
  → Compte follicules antraux

CAUSES FRÉQUENTES :
☐ Syndrome ovaires polykystiques (SOPK) - 70%
☐ Hyperprolactinémie
☐ Dysthyroïdie
☐ Insuffisance ovarienne débutante
☐ Stress, perte de poids
☐ Sport intensif

ORIENTATION SELON RÉSULTATS :
☐ SOPK confirmé → Traitement si désir grossesse ou symptômes
☐ Autres causes → Avis spécialisé

Prochain RDV : Résultats à [ ]`,
      description: 'Exploration de cycles menstruels longs et irréguliers',
      source: 'CNGOF',
    },

    // MÉNOPAUSE - Amélioration du template existant
    {
      nom: 'Ménopause - Bilan et conseils',
      categorie: 'ménopause',
      type: 'biologie' as const,
      priorite: 'recommande' as const,
      contenu: `=== ORDONNANCE - BILAN MÉNOPAUSE ===

CRITÈRES DIAGNOSTIQUES :
☐ Âge > 45 ans
☐ Aménorrhée > 12 mois
☐ Bouffées de chaleur
☐ Troubles sommeil, irritabilité

BILAN HORMONAL (si doute diagnostique) :
☐ FSH (> 30 UI/L = ménopause)
☐ Œstradiol (< 20 pg/mL)
☐ TSH (éliminer dysthyroïdie)

BILAN PRÉ-THÉRAPEUTIQUE (si THS envisagé) :
☐ Mammographie (< 2 ans)
☐ Frottis cervico-vaginal
☐ Bilan lipidique (cholestérol, triglycérides)
☐ Glycémie à jeun

CONSEILS NON HORMONAUX :
☐ Phyto-œstrogènes (soja, trèfle rouge)
☐ Activité physique régulière
☐ Supplémentation calcium + vitamine D
☐ Arrêt tabac (si fumeuse)
☐ Vêtements légers superposés
☐ Ventilateur, climatisation

TRAITEMENT HORMONAL (THS) :
☐ À discuter selon :
  • Intensité des symptômes
  • Âge < 60 ans ou < 10 ans post-ménopause
  • Absence de contre-indications
☐ Nécessite bilan complet + information patient

CONTRE-INDICATIONS THS :
☐ Cancer sein/endomètre (actuel ou passé)
☐ Thrombose veineuse
☐ AVC, infarctus
☐ Hépatopathie sévère

Prochain RDV : Résultats et décision thérapeutique [ ]`,
      description: 'Bilan et prise en charge de la ménopause',
      source: 'HAS/AFSSAPS',
    },

    // DÉPISTAGE IST COMPLET
    {
      nom: 'Dépistage IST Complet',
      categorie: 'infections',
      type: 'biologie' as const,
      priorite: 'recommande' as const,
      contenu: `=== ORDONNANCE - DÉPISTAGE IST COMPLET ===

INDICATIONS :
☐ Nouveau partenaire
☐ Partenaires multiples
☐ Partenaire à risque
☐ Grossesse (dépistage systématique)
☐ Symptômes évocateurs
☐ Exposition potentielle

SÉROLOGIES À PRESCRIRE :
☐ VIH 1 et 2 (Ag p24 + Ac)
  → Dépistage recommandé 1x/vie minimum
  → Si exposition : J0, M1, M3

☐ SYPHILIS (TPHA-VDRL)
  → Recrudescence actuelle

☐ HÉPATITE B (Ag HBs, Ac anti-HBs, Ac anti-HBc)
  → Vérifier immunité vaccinale

☐ HÉPATITE C (Ac anti-VHC)
  → Si facteurs de risque

PCR VAGINALES/URINAIRES :
☐ CHLAMYDIA TRACHOMATIS (PCR)
  → IST la plus fréquente
  → Prélèvement vaginal ou 1er jet urinaire

☐ NEISSERIA GONORRHOEAE (Gonocoque)
  → Co-infection fréquente avec Chlamydia

☐ MYCOPLASMA GENITALIUM (si symptômes)

AUTRES EXAMENS SI SYMPTÔMES :
☐ Prélèvement vaginal (Trichomonas, mycoses)
☐ HSV 1 et 2 (si lésions herpétiques)

CONSEILS IMPORTANTS :
☐ Résultats sous 7-10 jours
☐ Traitement partenaire si positif
☐ Préservatif en attendant résultats
☐ Contrôle à 3 mois si exposition récente

VACCINATION À PROPOSER :
☐ Hépatite B (si non immunisée)
☐ HPV (si < 26 ans et non vaccinée)

Prochain RDV : Résultats à [ ]`,
      description: 'Bilan complet de dépistage des infections sexuellement transmissibles',
      source: 'HAS',
    },

    // DÉPISTAGE CANCER COL (Frottis)
    {
      nom: 'Dépistage Cancer Col - Frottis',
      categorie: 'gynécologie',
      type: 'autre' as const,
      priorite: 'recommande' as const,
      contenu: `=== ORDONNANCE - FROTTIS CERVICO-VAGINAL ===

INDICATION :
☐ Dépistage cancer col utérus (recommandé)
☐ Femmes 25-65 ans
☐ Rythme selon âge :
  • 25-29 ans : 1 frottis tous les 3 ans
  • 30-65 ans : Test HPV tous les 5 ans

PRESCRIPTION :
☐ FROTTIS CERVICO-VAGINAL (FCU)
  → Examen cytologique
  → Recherche HPV si > 30 ans

☐ OU TEST HPV-HR (si > 30 ans)
  → Recherche HPV oncogènes (16, 18, +12 autres)
  → Cytologie réflexe si HPV positif

MODALITÉS DE RÉALISATION :
☐ En dehors des règles
☐ Pas de rapport 48h avant
☐ Pas de toilette vaginale
☐ Pas de traitement local en cours

CONSEILS :
☐ Vaccination HPV (si < 26 ans et non vaccinée)
  → Gardasil 9 : 2 ou 3 doses selon âge
☐ Préservatif (protection partielle HPV)

RÉSULTATS POSSIBLES :
☐ Normal → Prochain FCU selon rythme
☐ ASC-US, LSIL → Contrôle + colposcopie
☐ HSIL → Colposcopie + biopsie urgente
☐ HPV + sans lésion → Contrôle 1 an

Prochain RDV : Résultats à [ ]`,
      description: 'Prescription frottis cervico-vaginal dépistage cancer col utérus',
      source: 'HAS/INCa',
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

    console.log(`\n✅ ${templates.length} templates gynéco ajoutés avec succès!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

addGynecoTemplates()
