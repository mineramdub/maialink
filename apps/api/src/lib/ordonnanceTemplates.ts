// Templates d'ordonnances pour sages-femmes
// Conformes au décret de compétences des sages-femmes

export interface Medicament {
  nom: string
  dci: string // Dénomination Commune Internationale
  dosage: string
  forme: string
  posologie: string
  duree: string
  indications: string[]
}

// Base de données des médicaments prescriptibles par les sages-femmes
export const MEDICAMENTS_COURANTS: Medicament[] = [
  // Supplémentation grossesse
  {
    nom: 'TARDYFERON',
    dci: 'Sulfate ferreux',
    dosage: '80 mg',
    forme: 'comprimé pelliculé',
    posologie: '1 comprimé par jour, en dehors des repas',
    duree: '3 mois',
    indications: ['Anémie gravidique', 'Carence martiale']
  },
  {
    nom: 'UVÉDOSE',
    dci: 'Cholécalciférol (Vitamine D3)',
    dosage: '100 000 UI',
    forme: 'solution buvable',
    posologie: '1 ampoule tous les 3 mois',
    duree: '9 mois',
    indications: ['Prévention carence vitamine D', 'Grossesse']
  },
  {
    nom: 'SPÉCIAFOLDINE',
    dci: 'Acide folique',
    dosage: '5 mg',
    forme: 'comprimé',
    posologie: '1 comprimé par jour',
    duree: '3 mois (T1)',
    indications: ['Prévention anomalies tube neural', 'Début grossesse']
  },

  // Antalgiques
  {
    nom: 'PARACÉTAMOL',
    dci: 'Paracétamol',
    dosage: '1 g',
    forme: 'comprimé',
    posologie: '1 comprimé jusqu\'à 3 fois par jour si douleur',
    duree: '5 jours',
    indications: ['Douleur', 'Fièvre']
  },
  {
    nom: 'SPASFON',
    dci: 'Phloroglucinol',
    dosage: '80 mg',
    forme: 'comprimé',
    posologie: '2 comprimés 3 fois par jour',
    duree: '5 jours',
    indications: ['Contractions utérines', 'Spasmes']
  },

  // Nausées/vomissements
  {
    nom: 'VOGALÈNE',
    dci: 'Métopimazine',
    dosage: '10 mg',
    forme: 'comprimé',
    posologie: '1 comprimé jusqu\'à 3 fois par jour avant les repas',
    duree: '10 jours',
    indications: ['Nausées gravidiques', 'Vomissements']
  },

  // Hémorroïdes
  {
    nom: 'TITANOREINE',
    dci: 'Oxyde de titane + Lidocaïne',
    dosage: '',
    forme: 'suppositoire',
    posologie: '1 suppositoire matin et soir',
    duree: '7 jours',
    indications: ['Crise hémorroïdaire', 'Post-partum']
  },

  // Allaitement
  {
    nom: 'GALACTOGIL',
    dci: 'Extrait de fenugrec',
    dosage: '',
    forme: 'gélule',
    posologie: '2 gélules 3 fois par jour',
    duree: '1 mois',
    indications: ['Stimulation lactation', 'Hypogalactie']
  },

  // Contraception post-partum
  {
    nom: 'CÉRAZETTE',
    dci: 'Désogestrel',
    dosage: '75 µg',
    forme: 'comprimé',
    posologie: '1 comprimé par jour à heure fixe, en continu',
    duree: '3 mois (renouvelable)',
    indications: ['Contraception', 'Post-partum', 'Allaitement']
  },
  {
    nom: 'OPTIMIZETTE',
    dci: 'Désogestrel',
    dosage: '75 µg',
    forme: 'comprimé',
    posologie: '1 comprimé par jour à heure fixe, en continu',
    duree: '3 mois (renouvelable)',
    indications: ['Contraception', 'Post-partum', 'Allaitement']
  },

  // Infection urinaire (uniquement E. coli)
  {
    nom: 'FOSFOMYCINE BIOGARAN',
    dci: 'Fosfomycine trométamol',
    dosage: '3 g',
    forme: 'sachet',
    posologie: '1 sachet en prise unique, à jeun',
    duree: 'Dose unique',
    indications: ['Cystite aiguë simple', 'E. coli']
  },

  // Candidose vaginale
  {
    nom: 'ECONAZOLE BIOGARAN',
    dci: 'Éconazole',
    dosage: '150 mg',
    forme: 'ovule',
    posologie: '1 ovule le soir au coucher, 3 jours consécutifs',
    duree: '3 jours',
    indications: ['Mycose vaginale', 'Candidose']
  },
]

// Templates d'ordonnances pré-remplies
export const ORDONNANCE_TEMPLATES = [
  {
    nom: 'Supplémentation grossesse T1',
    categorie: 'Grossesse',
    description: 'Supplémentation standard début de grossesse',
    medicaments: [
      {
        medicamentId: 'SPÉCIAFOLDINE',
        personnalise: false
      },
      {
        medicamentId: 'UVÉDOSE',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. SPÉCIAFOLDINE 5 mg, comprimé
   Posologie: 1 comprimé par jour
   Durée: 3 mois

2. UVÉDOSE 100 000 UI, solution buvable
   Posologie: 1 ampoule tous les 3 mois
   Durée: pendant toute la grossesse

RECOMMANDATIONS:
- Prendre l'acide folique de préférence le matin
- La vitamine D peut être prise à n'importe quel moment de la journée
- Surveiller l'apparition d'effets indésirables

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Anémie gravidique',
    categorie: 'Grossesse',
    description: 'Traitement de l\'anémie pendant la grossesse',
    medicaments: [
      {
        medicamentId: 'TARDYFERON',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. TARDYFERON 80 mg, comprimé pelliculé
   Posologie: 1 comprimé par jour, en dehors des repas
   Durée: 3 mois

RECOMMANDATIONS:
- Prendre à distance des repas (1h avant ou 2h après)
- Éviter la prise avec thé, café, lait (diminue l'absorption)
- Contrôle biologique à prévoir dans 1 mois
- Possible coloration noire des selles (normale)

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Nausées gravidiques',
    categorie: 'Grossesse',
    description: 'Traitement des nausées et vomissements de grossesse',
    medicaments: [
      {
        medicamentId: 'VOGALÈNE',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. VOGALÈNE 10 mg, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour avant les repas
   Durée: 10 jours

RECOMMANDATIONS:
- Prendre 15-30 minutes avant les repas
- Fractionner les repas (5-6 petits repas par jour)
- Éviter les aliments gras et épicés
- Boire régulièrement en petites quantités
- Consulter si vomissements persistants ou perte de poids

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Contraception post-partum',
    categorie: 'Post-partum',
    description: 'Contraception microprogestative compatible allaitement',
    medicaments: [
      {
        medicamentId: 'CÉRAZETTE',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. CÉRAZETTE 75 µg, comprimé
   Posologie: 1 comprimé par jour à heure fixe, en continu (sans arrêt)
   Durée: 3 mois (renouvelable)
   Début: À partir de J21 post-partum

RECOMMANDATIONS:
- Compatible avec l'allaitement maternel
- Prendre tous les jours à la même heure
- Utiliser un préservatif les 7 premiers jours
- En cas d'oubli < 12h: prendre immédiatement, pas de contraception additionnelle
- En cas d'oubli > 12h: contraception additionnelle 7 jours
- Consultation de contrôle à 3 mois

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Crise hémorroïdaire post-partum',
    categorie: 'Post-partum',
    description: 'Traitement symptomatique crise hémorroïdaire',
    medicaments: [
      {
        medicamentId: 'TITANOREINE',
        personnalise: false
      },
      {
        medicamentId: 'PARACÉTAMOL',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. TITANOREINE, suppositoire
   Posologie: 1 suppositoire matin et soir
   Durée: 7 jours

2. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: 5 jours

RECOMMANDATIONS:
- Hygiène locale: toilette à l'eau tiède après chaque selle
- Éviter la constipation: alimentation riche en fibres, hydratation
- Bains de siège tièdes 2-3 fois par jour
- Si pas d'amélioration sous 7 jours: consultation

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Cystite aiguë simple',
    categorie: 'Gynécologie',
    description: 'Traitement de la cystite aiguë non compliquée',
    medicaments: [
      {
        medicamentId: 'FOSFOMYCINE BIOGARAN',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. FOSFOMYCINE BIOGARAN 3 g, sachet
   Posologie: 1 sachet en prise unique, à jeun
   Le soir au coucher, après avoir vidé la vessie

RECOMMANDATIONS:
- Diluer le sachet dans un verre d'eau
- Attendre 2-3h après le dernier repas
- Uriner avant la prise
- Boire abondamment (1,5-2L/jour)
- Éviter les rapports sexuels 48-72h
- Si symptômes persistent > 3 jours: reconsulter
- ECBU de contrôle si grossesse

PRESCRIPTION SELON DÉCRET DE COMPÉTENCES SF:
Cystite à E. coli uniquement (pas de complication, pas de grossesse > 5 mois)

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Mycose vaginale',
    categorie: 'Gynécologie',
    description: 'Traitement candidose vaginale',
    medicaments: [
      {
        medicamentId: 'ECONAZOLE BIOGARAN',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. ECONAZOLE BIOGARAN 150 mg, ovule vaginal
   Posologie: 1 ovule le soir au coucher, 3 jours consécutifs
   À introduire profondément dans le vagin

RECOMMANDATIONS:
- Introduction le soir au coucher en position allongée
- Utiliser les doigtiers fournis
- Traiter également le partenaire si symptômes (consultation médicale)
- Éviter rapports sexuels pendant le traitement
- Port de sous-vêtements en coton
- Éviter toilettes intimes trop fréquentes (1 fois/jour max)
- Si récidive > 4 fois/an: consultation spécialisée

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Stimulation lactation',
    categorie: 'Allaitement',
    description: 'Traitement hypogalactie',
    medicaments: [
      {
        medicamentId: 'GALACTOGIL',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. GALACTOGIL, gélule
   Posologie: 2 gélules 3 fois par jour pendant les repas
   Durée: 1 mois

RECOMMANDATIONS:
- Associer à une mise au sein fréquente (8-12 fois/24h)
- Hydratation abondante (2-3L/jour)
- Repos et alimentation équilibrée
- Éviter stress et fatigue
- Consultation lactation recommandée
- Évaluation efficacité après 1 semaine

Complément alimentaire - Pas de remboursement Sécurité Sociale

Ordonnance valable {{dureeValidite}} jours.`
  }
]

// Fonction utilitaire pour générer une ordonnance à partir d'un template
export function generateOrdonnanceFromTemplate(
  templateId: string,
  variables: Record<string, string> = {}
): string {
  const template = ORDONNANCE_TEMPLATES.find(t => t.nom === templateId)
  if (!template) {
    throw new Error('Template non trouvé')
  }

  let contenu = template.contenu

  // Variables par défaut
  const defaultVars = {
    dureeValidite: '30',
    ...variables
  }

  // Remplacer toutes les variables
  for (const [key, value] of Object.entries(defaultVars)) {
    const regex = new RegExp(`{{${key}}}`, 'g')
    contenu = contenu.replace(regex, value)
  }

  return contenu
}

// Recherche de médicaments par nom ou DCI
export function searchMedicaments(query: string): Medicament[] {
  const lowerQuery = query.toLowerCase()
  return MEDICAMENTS_COURANTS.filter(
    med =>
      med.nom.toLowerCase().includes(lowerQuery) ||
      med.dci.toLowerCase().includes(lowerQuery) ||
      med.indications.some(ind => ind.toLowerCase().includes(lowerQuery))
  )
}
