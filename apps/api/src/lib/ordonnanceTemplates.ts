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

  // Contraception post-partum - Microprogestatives
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
  {
    nom: 'MICROVAL',
    dci: 'Lévonorgestrel',
    dosage: '30 µg',
    forme: 'comprimé',
    posologie: '1 comprimé par jour à heure fixe, en continu',
    duree: '3 mois (renouvelable)',
    indications: ['Contraception', 'Post-partum', 'Allaitement']
  },

  // Contraception estroprogestative
  {
    nom: 'LEELOO Gé',
    dci: 'Lévonorgestrel + Éthinylestradiol',
    dosage: '100 µg + 20 µg',
    forme: 'comprimé',
    posologie: '1 comprimé par jour pendant 21 jours, puis 7 jours d\'arrêt',
    duree: '3 mois (3 plaquettes)',
    indications: ['Contraception']
  },
  {
    nom: 'OPTILOVA',
    dci: 'Lévonorgestrel + Éthinylestradiol',
    dosage: '100 µg + 20 µg',
    forme: 'comprimé',
    posologie: '1 comprimé par jour pendant 21 jours, puis 7 jours d\'arrêt',
    duree: '3 mois (3 plaquettes)',
    indications: ['Contraception']
  },
  {
    nom: 'DAILY Gé',
    dci: 'Drospirénone + Éthinylestradiol',
    dosage: '3 mg + 20 µg',
    forme: 'comprimé',
    posologie: '1 comprimé par jour pendant 24 jours, puis 4 jours d\'arrêt',
    duree: '3 mois (3 plaquettes)',
    indications: ['Contraception']
  },
  {
    nom: 'LOVALULO',
    dci: 'Lévonorgestrel + Éthinylestradiol',
    dosage: '100 µg + 20 µg',
    forme: 'comprimé',
    posologie: '1 comprimé par jour pendant 21 jours, puis 7 jours d\'arrêt',
    duree: '3 mois (3 plaquettes)',
    indications: ['Contraception']
  },

  // Contraception d'urgence
  {
    nom: 'NORLEVO',
    dci: 'Lévonorgestrel',
    dosage: '1,5 mg',
    forme: 'comprimé',
    posologie: '1 comprimé en prise unique le plus tôt possible',
    duree: 'Prise unique',
    indications: ['Contraception d\'urgence', 'Oubli pilule', 'Rapport non protégé']
  },
  {
    nom: 'ELLAONE',
    dci: 'Ulipristal acétate',
    dosage: '30 mg',
    forme: 'comprimé',
    posologie: '1 comprimé en prise unique le plus tôt possible',
    duree: 'Prise unique',
    indications: ['Contraception d\'urgence', 'Efficace jusqu\'à 120h']
  },

  // Patch contraceptif
  {
    nom: 'EVRA',
    dci: 'Norelgestromine + Éthinylestradiol',
    dosage: '203 µg/24h + 33,9 µg/24h',
    forme: 'patch transdermique',
    posologie: '1 patch par semaine pendant 3 semaines, puis 1 semaine sans patch',
    duree: '3 mois (9 patchs)',
    indications: ['Contraception']
  },

  // Anneau vaginal
  {
    nom: 'NUVARING',
    dci: 'Étonogestrel + Éthinylestradiol',
    dosage: '11,7 mg + 2,7 mg',
    forme: 'anneau vaginal',
    posologie: '1 anneau en place 3 semaines, puis 1 semaine sans anneau',
    duree: '3 mois (3 anneaux)',
    indications: ['Contraception']
  },

  // Implant contraceptif
  {
    nom: 'NEXPLANON',
    dci: 'Étonogestrel',
    dosage: '68 mg',
    forme: 'implant sous-cutané',
    posologie: 'Pose sous-cutanée face interne bras non dominant',
    duree: '3 ans',
    indications: ['Contraception longue durée']
  },

  // Douleurs pelviennes/lombaires
  {
    nom: 'IXPRIM',
    dci: 'Paracétamol + Tramadol',
    dosage: '325 mg + 37,5 mg',
    forme: 'comprimé',
    posologie: '1 à 2 comprimés jusqu\'à 3 fois par jour',
    duree: '5 jours',
    indications: ['Douleurs modérées à intenses', 'Lombalgies', 'Sciatique']
  },

  // Crampes musculaires
  {
    nom: 'MAGNÉSIUM',
    dci: 'Magnésium',
    dosage: '300 mg',
    forme: 'comprimé',
    posologie: '2 comprimés par jour',
    duree: '1 mois',
    indications: ['Crampes', 'Carence magnésium', 'Fatigue']
  },

  // RGO grossesse
  {
    nom: 'GAVISCON',
    dci: 'Alginate de sodium + Bicarbonate',
    dosage: '',
    forme: 'suspension buvable',
    posologie: '1 sachet après chaque repas et au coucher',
    duree: '1 mois',
    indications: ['Reflux gastro-œsophagien', 'Pyrosis']
  },

  // Constipation
  {
    nom: 'FORLAX',
    dci: 'Macrogol 4000',
    dosage: '10 g',
    forme: 'sachet',
    posologie: '1 sachet par jour le matin',
    duree: '1 mois',
    indications: ['Constipation', 'Transit ralenti']
  },

  // Hémorroïdes crème
  {
    nom: 'TITANOREINE CRÈME',
    dci: 'Oxyde de titane + Lidocaïne',
    dosage: '',
    forme: 'crème',
    posologie: 'Application locale 2 fois par jour',
    duree: '7 jours',
    indications: ['Hémorroïdes externes', 'Crise hémorroïdaire']
  },

  // Mycose crème
  {
    nom: 'MONAZOL',
    dci: 'Sertaconazole',
    dosage: '2%',
    forme: 'crème',
    posologie: 'Application 2 fois par jour',
    duree: '2-4 semaines',
    indications: ['Mycose cutanée', 'Candidose']
  },

  // Mamelons crevassés
  {
    nom: 'LANSINOH',
    dci: 'Lanoline pure',
    dosage: '',
    forme: 'crème',
    posologie: 'Application après chaque tétée',
    duree: 'Jusqu\'à guérison',
    indications: ['Crevasses', 'Mamelons douloureux', 'Allaitement']
  },

  // Montée de lait (arrêt allaitement)
  {
    nom: 'DOSTINEX',
    dci: 'Cabergoline',
    dosage: '0,5 mg',
    forme: 'comprimé',
    posologie: '1 comprimé 2 fois par jour pendant 2 jours',
    duree: '2 jours',
    indications: ['Inhibition lactation', 'Arrêt allaitement']
  },

  // Antibiothérapie cystite
  {
    nom: 'MONURIL',
    dci: 'Fosfomycine trométamol',
    dosage: '3 g',
    forme: 'sachet',
    posologie: '1 sachet en prise unique le soir',
    duree: 'Dose unique',
    indications: ['Cystite aiguë simple', 'Infection urinaire']
  },

  // Prurit vulvaire
  {
    nom: 'HYDROCORTISONE CRÈME',
    dci: 'Hydrocortisone',
    dosage: '1%',
    forme: 'crème',
    posologie: 'Application 2 fois par jour',
    duree: '5-7 jours',
    indications: ['Prurit vulvaire', 'Eczéma', 'Irritation']
  },

  // Homéopathie montée de lait
  {
    nom: 'RICINUS 5CH',
    dci: 'Ricinus communis',
    dosage: '5CH',
    forme: 'granules',
    posologie: '5 granules 3 fois par jour',
    duree: '3 jours',
    indications: ['Stimulation lactation', 'Engorgement']
  },

  // Carence fer sans anémie
  {
    nom: 'FER FUMARATE',
    dci: 'Fumarate ferreux',
    dosage: '66 mg',
    forme: 'gélule',
    posologie: '1 gélule par jour',
    duree: '3 mois',
    indications: ['Carence martiale', 'Prévention anémie']
  },

  // Troubles circulatoires
  {
    nom: 'DAFLON',
    dci: 'Diosmine + Hespéridine',
    dosage: '500 mg',
    forme: 'comprimé',
    posologie: '2 comprimés par jour',
    duree: '2 mois',
    indications: ['Insuffisance veineuse', 'Jambes lourdes', 'Varices']
  },

  // Insomnie grossesse
  {
    nom: 'EUPHYTOSE',
    dci: 'Extraits de plantes',
    dosage: '',
    forme: 'comprimé',
    posologie: '1-2 comprimés le soir au coucher',
    duree: '1 mois',
    indications: ['Troubles du sommeil', 'Anxiété légère', 'Nervosité']
  },

  // Mastite
  {
    nom: 'AMOXICILLINE',
    dci: 'Amoxicilline',
    dosage: '1 g',
    forme: 'comprimé',
    posologie: '1 g 3 fois par jour',
    duree: '7-10 jours',
    indications: ['Mastite', 'Infection sein', 'Galactophorite']
  },

  // Œdèmes
  {
    nom: 'VEINAMITOL',
    dci: 'Troxérutine',
    dosage: '3500 mg',
    forme: 'gélule',
    posologie: '2 gélules matin et soir',
    duree: '1 mois',
    indications: ['Œdèmes membres inférieurs', 'Troubles circulatoires']
  },

  // Syndrome canal carpien
  {
    nom: 'ATTELLE POIGNET',
    dci: 'Orthèse',
    dosage: '',
    forme: 'attelle',
    posologie: 'Port nocturne',
    duree: 'Jusqu\'à accouchement',
    indications: ['Syndrome canal carpien', 'Paresthésies']
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
  },
  {
    nom: 'Supplémentation grossesse T2-T3',
    categorie: 'Grossesse',
    description: 'Supplémentation avec fer pour T2 et T3',
    medicaments: [
      {
        medicamentId: 'TARDYFERON',
        personnalise: false
      },
      {
        medicamentId: 'UVÉDOSE',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. TARDYFERON 80 mg, comprimé pelliculé
   Posologie: 1 comprimé par jour, en dehors des repas
   Durée: jusqu'à l'accouchement

2. UVÉDOSE 100 000 UI, solution buvable
   Posologie: 1 ampoule tous les 3 mois
   Durée: jusqu'à l'accouchement

RECOMMANDATIONS:
- Tardyferon: prendre à distance des repas (1h avant ou 2h après)
- Éviter thé, café, lait avec le fer
- Contrôle NFS à prévoir au 3ème trimestre
- Coloration noire des selles possible (normale)

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Contractions prématurées',
    categorie: 'Grossesse',
    description: 'Traitement des contractions utérines',
    medicaments: [
      {
        medicamentId: 'SPASFON',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. SPASFON 80 mg, comprimé
   Posologie: 2 comprimés 3 fois par jour
   Durée: 5-7 jours

RECOMMANDATIONS:
- Repos relatif recommandé
- Hydratation abondante (1,5-2L/jour)
- Éviter efforts physiques importants
- Consulter en urgence si:
  * Contractions régulières (> 10/h)
  * Douleurs intenses
  * Perte de liquide ou saignements
- Contrôle consultation à prévoir dans 48-72h

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Douleurs ligamentaires grossesse',
    categorie: 'Grossesse',
    description: 'Traitement douleurs pelviennes et ligamentaires',
    medicaments: [
      {
        medicamentId: 'PARACÉTAMOL',
        personnalise: false
      },
      {
        medicamentId: 'SPASFON',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: 10 jours

2. SPASFON 80 mg, comprimé
   Posologie: 2 comprimés jusqu'à 3 fois par jour si besoin
   Durée: 10 jours

RECOMMANDATIONS:
- Port d'une ceinture de maintien pelvien si besoin
- Éviter station debout prolongée
- Repos avec surélévation des jambes
- Massages doux de la zone douloureuse
- Consultation si douleurs intenses ou persistantes

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'RGO / Reflux grossesse',
    categorie: 'Grossesse',
    description: 'Traitement du reflux gastro-œsophagien',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. GAVISCON, suspension buvable
   Posologie: 1 sachet après chaque repas et au coucher
   Durée: 1 mois (renouvelable)

RECOMMANDATIONS:
- Fractionner les repas (5-6 petits repas/jour)
- Éviter repas copieux le soir
- Surélever la tête du lit (15-20 cm)
- Éviter aliments gras, épicés, acides, chocolat
- Éviter café, thé, agrumes
- Attendre 2-3h avant de se coucher après repas
- Ne pas porter de vêtements trop serrés

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Constipation grossesse',
    categorie: 'Grossesse',
    description: 'Traitement de la constipation gravidique',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. FORLAX 10 g, sachet
   Posologie: 1 sachet par jour le matin, à diluer dans un grand verre d'eau
   Durée: 1 mois

RECOMMANDATIONS:
- Augmenter apport en fibres (fruits, légumes, céréales complètes)
- Hydratation abondante: 1,5-2L d'eau/jour
- Activité physique régulière adaptée (marche)
- Aller aux toilettes dès le besoin (ne pas se retenir)
- Pruneaux, jus de pruneaux le matin
- Éviter laxatifs stimulants

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Douleurs post-épisiotomie',
    categorie: 'Post-partum',
    description: 'Traitement des douleurs après épisiotomie',
    medicaments: [
      {
        medicamentId: 'PARACÉTAMOL',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: 10 jours

2. HEXOMEDINE TRANSCUTANEE, solution
   Posologie: Application locale 2 fois par jour après toilette
   Durée: 15 jours

RECOMMANDATIONS:
- Toilette à l'eau tiède 2 fois/jour
- Séchage doux par tamponnement
- Éviter position assise prolongée
- Bouée de siège si besoin
- Glace enveloppée dans un linge (15 min, 3-4 fois/jour)
- Consulter si: douleur intense, écoulement, fièvre
- Contrôle cicatrisation à J8-J10

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Engorgement mammaire',
    categorie: 'Allaitement',
    description: 'Traitement de l\'engorgement',
    medicaments: [
      {
        medicamentId: 'PARACÉTAMOL',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: 5 jours

RECOMMANDATIONS:
- Tétées fréquentes et efficaces (8-12/24h)
- Bien vider les seins à chaque tétée
- Application de froid entre les tétées (15 min)
- Massage doux aréolaire avant la tétée
- Douche chaude avant tétée si besoin
- Éviter soutien-gorge trop serré
- Consulter si: fièvre, zone rouge, douleur intense
- Consultation lactation si engorgements répétés

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Crevasses mamelons',
    categorie: 'Allaitement',
    description: 'Traitement des crevasses du mamelon',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. LANOLINE PURE (Lansinoh ou Purelan), crème
   Posologie: Application après chaque tétée
   Durée: jusqu'à guérison

RECOMMANDATIONS:
- Corriger la position et la prise du sein
- Varier les positions d'allaitement
- Commencer tétée par sein le moins douloureux
- Laisser sécher les mamelons à l'air après tétée
- Éviter savons et produits irritants
- Coquilles d'allaitement si frottement
- Paracétamol si douleur (voir ci-dessus)
- Consultation lactation recommandée
- Consulter si: fièvre, écoulement purulent, douleur intense

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Rééducation périnéale',
    categorie: 'Post-partum',
    description: 'Prescription rééducation périnéale',
    medicaments: [],
    contenu: `PRESCRIPTION DE KINÉSITHÉRAPIE:

Rééducation périnéale et abdomino-pelvienne du post-partum

Nombre de séances: 10 séances
À débuter: 6-8 semaines après l'accouchement

INDICATIONS:
- Prévention et traitement de l'incontinence urinaire
- Renforcement musculature périnéale
- Reprise progressive activité physique

RECOMMANDATIONS:
- Consultation préalable avec testing périnéal
- Rééducation manuelle ou électrostimulation selon évaluation
- Travail également de la sangle abdominale
- Exercices à domicile en complément
- Contrôle en fin de rééducation

Prescription conforme à l'avenant 6 de la convention nationale.

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Contraception estroprogestative',
    categorie: 'Gynécologie',
    description: 'Pilule combinée (hors allaitement)',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. LEELOO Gé, comprimé
   Posologie: 1 comprimé par jour pendant 21 jours, puis 7 jours d'arrêt
   Durée: 3 mois (3 plaquettes)

RECOMMANDATIONS:
- Débuter le 1er jour des règles
- Prendre à heure fixe chaque jour
- Contraception additionnelle les 7 premiers jours
- Oubli < 12h: prendre immédiatement, pas de contraception additionnelle
- Oubli > 12h: risque de grossesse, contraception additionnelle 7 jours
- CONTRE-INDIQUÉE pendant l'allaitement
- Surveillance TA et poids
- Consultation de contrôle à 3 mois

CONTRE-INDICATIONS à vérifier:
- Tabac si > 35 ans, migraine avec aura, ATCD thrombose

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Prévention vergetures',
    categorie: 'Grossesse',
    description: 'Soin préventif des vergetures',
    medicaments: [],
    contenu: `PRESCRIPTION:

Crème ou huile anti-vergetures pour prévention
Application quotidienne sur ventre, seins, hanches, cuisses

RECOMMANDATIONS:
- Commencer dès le début de la grossesse
- Application 1 à 2 fois par jour après douche
- Massage circulaire doux
- Hydratation cutanée importante
- Hydratation interne également (eau)
- Poids de grossesse à surveiller (prise progressive)
- Pas de remboursement Sécurité Sociale

PRODUITS RECOMMANDÉS (non exhaustif):
- Huile d'amande douce
- Bi-Oil
- Mustela crème prévention vergetures
- Weleda huile de massage

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Douleurs lombaires grossesse',
    categorie: 'Grossesse',
    description: 'Traitement lombalgies et sciatalgies',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: 10 jours

2. SPASFON 80 mg, comprimé
   Posologie: 2 comprimés jusqu'à 3 fois par jour si besoin
   Durée: 10 jours

RECOMMANDATIONS:
- Repos relatif, éviter port de charges lourdes
- Ceinture lombaire de soutien si besoin
- Chaleur locale (bouillotte)
- Position latérale de repos avec coussin entre les jambes
- Consultation ostéopathe/kinésithérapeute si douleurs persistantes
- Consulter si: irradiation jambe, déficit moteur, troubles urinaires

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Crampes nocturnes',
    categorie: 'Grossesse',
    description: 'Traitement des crampes musculaires',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MAGNÉSIUM 300 mg, comprimé
   Posologie: 2 comprimés par jour (matin et soir)
   Durée: 1 mois

RECOMMANDATIONS:
- Hydratation abondante (1,5-2L/jour)
- Étirements doux des mollets avant coucher
- Alimentation riche en magnésium (chocolat noir, fruits secs, légumes verts)
- Éviter position debout prolongée
- Surélever légèrement les jambes la nuit
- Massage des mollets en cas de crampe

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Prurit vulvaire/vaginite',
    categorie: 'Gynécologie',
    description: 'Traitement irritation vulvaire',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. HYDROCORTISONE 1%, crème
   Posologie: Application locale 2 fois par jour
   Durée: 7 jours maximum

RECOMMANDATIONS:
- Toilette intime à l'eau tiède 1 fois/jour
- Savon doux pH neutre ou surgras
- Séchage doux par tamponnement
- Sous-vêtements en coton
- Éviter protège-slips
- Éviter douches vaginales
- Si mycose associée: traitement antifongique
- Consulter si: pertes malodorantes, fièvre, douleurs

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Arrêt allaitement',
    categorie: 'Post-partum',
    description: 'Inhibition de la lactation',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. DOSTINEX 0,5 mg, comprimé
   Posologie: 1 comprimé 2 fois par jour pendant 2 jours
   Dose totale: 4 comprimés sur 2 jours
   À prendre pendant les repas

RECOMMANDATIONS:
- Arrêt progressif des tétées si possible
- Soutien-gorge adapté jour et nuit
- Application de froid si seins tendus
- Ne pas exprimer le lait
- Surveiller: TA, vertiges, céphalées
- CONTRE-INDICATIONS: HTA non contrôlée, cardiopathie
- Consulter si: fièvre, zone rouge, douleur intense (risque mastite)

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Soins périnée post-partum',
    categorie: 'Post-partum',
    description: 'Soins locaux cicatrice périnéale',
    medicaments: [],
    contenu: `PRESCRIPTION:

1. HEXOMEDINE TRANSCUTANEE, solution
   Posologie: Application locale 2 fois par jour après toilette
   Durée: 15 jours

2. PARACÉTAMOL 1 g, comprimé (si douleur)
   Posologie: 1 comprimé jusqu'à 3 fois par jour
   Durée: 7 jours

RECOMMANDATIONS:
- Toilette périnéale à l'eau tiède 2 fois/jour
- Séchage doux par tamponnement ou sèche-cheveux air froid
- Changer protections régulièrement
- Éviter position assise prolongée
- Bouée de siège si besoin
- Application de glace (15 min, 3-4 fois/jour) si œdème
- Consulter si: douleur intense, écoulement, fièvre
- Contrôle cicatrisation à J8-J10

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Traitement homéopathique allaitement',
    categorie: 'Allaitement',
    description: 'Stimulation lactation par homéopathie',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. RICINUS 5CH, granules
   Posologie: 5 granules 3 fois par jour
   Durée: 1 semaine

2. GALACTOGIL, gélule
   Posologie: 2 gélules 3 fois par jour pendant les repas
   Durée: 1 mois

RECOMMANDATIONS:
- Mises au sein fréquentes (8-12 fois/24h)
- Bonne prise du sein (bouche grande ouverte)
- Hydratation abondante (2-3L/jour)
- Alimentation équilibrée
- Repos suffisant
- Éviter stress et fatigue
- Consultation lactation si besoin
- Évaluation après 1 semaine

Complément alimentaire - Pas de remboursement

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Traitement complet post-partum',
    categorie: 'Post-partum',
    description: 'Ordonnance complète sortie maternité',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: 10 jours

2. FER FUMARATE 66 mg, gélule
   Posologie: 1 gélule par jour en dehors des repas
   Durée: 3 mois

3. UVÉDOSE 100 000 UI, ampoule
   Posologie: 1 ampoule maintenant, puis 1 ampoule dans 3 mois

4. HEXOMEDINE TRANSCUTANEE, solution (si épisiotomie)
   Posologie: Application locale 2 fois par jour
   Durée: 15 jours

RECOMMANDATIONS:
- Repos, déléguer tâches ménagères
- Alimentation équilibrée, hydratation
- Soins périnéaux si épisiotomie
- Rééducation périnéale à prévoir (6-8 semaines)
- Contraception à discuter
- Consulter si: fièvre, douleurs, saignements abondants

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Supplémentation fer sans anémie',
    categorie: 'Grossesse',
    description: 'Prévention carence martiale',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. FER FUMARATE 66 mg, gélule
   Posologie: 1 gélule par jour en dehors des repas
   Durée: 3 mois

RECOMMANDATIONS:
- Prendre à distance des repas (1h avant ou 2h après)
- Éviter avec thé, café, lait (diminue absorption)
- Privilégier avec jus d'orange (vitamine C améliore absorption)
- Possible coloration noire des selles (normale)
- Possible constipation (augmenter fibres et hydratation)
- Contrôle NFS à 3 mois
- Alimentation riche en fer: viande rouge, lentilles, épinards

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Douleurs post-césarienne',
    categorie: 'Post-partum',
    description: 'Traitement douleurs après césarienne',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé 3 fois par jour systématiquement
   Durée: 7 jours

2. SPASFON 80 mg, comprimé
   Posologie: 2 comprimés 3 fois par jour si besoin
   Durée: 5 jours

RECOMMANDATIONS:
- Repos, éviter port de charges (même bébé si possible les premiers jours)
- Lever progressif
- Cicatrice: garder propre et sèche, surveiller
- Pas de douche directe sur cicatrice 48h
- Retrait fils/agrafes selon protocole (J5-J7)
- Surveiller signes d'infection: rougeur, écoulement, fièvre
- Consulter si: douleur intense, fièvre, cicatrice rouge/chaude

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Mastite',
    categorie: 'Allaitement',
    description: 'Traitement infection du sein',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. AMOXICILLINE 1 g, comprimé
   Posologie: 1 g 3 fois par jour
   Durée: 7-10 jours

2. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 4 fois par jour si fièvre/douleur
   Durée: 5 jours

RECOMMANDATIONS IMPORTANTES:
- POURSUIVRE L'ALLAITEMENT (drainage optimal du sein)
- Commencer tétée par sein atteint
- Vider complètement le sein à chaque tétée
- Application de froid entre les tétées
- Repos au lit recommandé
- Hydratation abondante
- Paracétamol compatible avec allaitement
- Amoxicilline compatible avec allaitement
- Consulter en urgence si: état général altéré, fièvre persistante > 48h, abcès

SIGNES D'ALARME:
- Fièvre > 38,5°C persistante
- Zone fluctuante (abcès)
- État général altéré

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Varices et jambes lourdes',
    categorie: 'Grossesse',
    description: 'Traitement insuffisance veineuse',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. DAFLON 500 mg, comprimé
   Posologie: 2 comprimés par jour (matin et soir)
   Durée: 2 mois

RECOMMANDATIONS:
- Port de bas de contention classe 2 (sur prescription)
- Surélever les jambes au repos (15-20 cm)
- Éviter station debout/assise prolongée
- Marche quotidienne (30 min)
- Douches fraîches sur les jambes (bas vers haut)
- Éviter chaleur (bains chauds, soleil direct)
- Dormir jambes légèrement surélevées
- Massage drainage lymphatique si besoin

PRESCRIPTION ASSOCIÉE:
Bas de contention classe 2, hauteur cuisse ou mi-cuisse
Quantité: 2 paires
Renouvellement: tous les 6 mois

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Œdèmes membres inférieurs',
    categorie: 'Grossesse',
    description: 'Traitement œdèmes physiologiques',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. VEINAMITOL 3500 mg, gélule
   Posologie: 2 gélules matin et 2 gélules soir
   Durée: 1 mois

RECOMMANDATIONS:
- Surélever les jambes plusieurs fois par jour (20 min)
- Éviter station debout prolongée
- Marche régulière (améliore retour veineux)
- Bas de contention si besoin
- Limiter apport en sel
- Hydratation normale (ne pas restreindre)
- Dormir jambes surélevées
- Massage drainage lymphatique

SURVEILLANCE:
- Contrôle TA à prévoir
- Bandelette urinaire (protéinurie)
- Consulter si: œdèmes brusques, visage, mains, prise de poids rapide, céphalées

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Insomnie grossesse',
    categorie: 'Grossesse',
    description: 'Troubles du sommeil',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. EUPHYTOSE, comprimé
   Posologie: 1 à 2 comprimés le soir 1h avant le coucher
   Durée: 1 mois

RECOMMANDATIONS:
- Coucher et lever à heures régulières
- Éviter écrans 1h avant coucher
- Chambre fraîche (18-19°C), obscure, calme
- Rituel de coucher apaisant
- Éviter caféine après 16h
- Repas léger le soir
- Activité physique en journée (pas le soir)
- Relaxation: respiration, méditation
- Position latérale gauche avec coussin entre jambes
- Lever si insomnie > 20 min (activité calme)

CONTRE-INDICATIONS médicaments à éviter:
- Benzodiazépines
- Antihistaminiques sédatifs
- Somnifères classiques

Traitement par phytothérapie, compatible grossesse

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Syndrome canal carpien grossesse',
    categorie: 'Grossesse',
    description: 'Paresthésies mains et poignets',
    medicaments: [],
    contenu: `PRESCRIPTION:

1. ATTELLE DE POIGNET (orthèse), droite et/ou gauche
   Port: nocturne systématique + en journée si besoin
   Durée: jusqu'à l'accouchement

RECOMMANDATIONS:
- Port nocturne obligatoire (soulagement des symptômes)
- Éviter mouvements répétitifs du poignet
- Surélever les mains (oreiller) pendant le sommeil
- Exercices d'étirement doux du poignet
- Éviter port de charges lourdes
- Séances kinésithérapie si besoin
- Symptômes régressent généralement après accouchement

SIGNES D'ALARME (consultation urgente):
- Déficit moteur (perte de force)
- Perte de sensibilité marquée
- Douleur intense persistante

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Pertes vaginales grossesse',
    categorie: 'Grossesse',
    description: 'Leucorrhées physiologiques',
    medicaments: [],
    contenu: `RECOMMANDATIONS ET CONSEILS:

Les pertes blanches sont physiologiques et augmentent pendant la grossesse.
Aucun traitement médicamenteux nécessaire si:
- Pertes blanches/transparentes
- Pas d'odeur
- Pas de démangeaisons
- Pas de brûlures

HYGIÈNE INTIME:
- Toilette externe 1 fois par jour maximum
- Savon doux pH neutre ou surgras
- Séchage doux par tamponnement
- Sous-vêtements en coton
- Changer quotidiennement
- Éviter protège-slips (macération)
- JAMAIS de douches vaginales
- Pas de déodorants intimes

CONSULTER SI:
- Pertes malodorantes (infection)
- Pertes verdâtres/jaunâtres (infection)
- Démangeaisons (mycose)
- Pertes de liquide clair abondant (rupture poche des eaux)
- Saignements

En l'absence de signe d'infection, simple surveillance.

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Douleurs symphyse pubienne',
    categorie: 'Grossesse',
    description: 'Dysfonction symphyse pubienne',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: 10 jours

PRESCRIPTION ASSOCIÉE:
Séances de kinésithérapie ou ostéopathie
Nombre: 6 séances
Indication: Dysfonction symphyse pubienne, douleurs pelviennes

RECOMMANDATIONS:
- Ceinture de maintien pelvien (soutien symphyse)
- Éviter mouvements d'écartement des jambes
- Éviter station debout prolongée
- Éviter montée d'escaliers si possible
- Position latérale avec coussin entre jambes (sommeil)
- Entrer/sortir voiture: jambes serrées, rotation du bassin
- Mise au repos si douleurs intenses
- Amélioration généralement après accouchement

KINÉSITHÉRAPIE:
- Renforcement musculature pelvienne
- Travail proprioception
- Techniques manuelles

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Anxiété légère grossesse',
    categorie: 'Grossesse',
    description: 'Troubles anxieux légers',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. EUPHYTOSE, comprimé
   Posologie: 1 comprimé matin, midi et soir
   Durée: 1 mois

RECOMMANDATIONS:
- Phytothérapie compatible avec la grossesse
- Relaxation: sophrologie, yoga prénatal, méditation
- Activité physique adaptée (marche, natation)
- Préparation à la naissance (groupes de parole)
- Soutien entourage
- Identifier sources de stress
- Temps pour soi, activités plaisantes
- Sommeil suffisant

CONSULTATION SPÉCIALISÉE SI:
- Anxiété invalidante
- Troubles du sommeil majeurs
- Attaques de panique
- État dépressif associé
- Antécédents psychiatriques

Entretien prénatal précoce recommandé
Suivi psychologique si besoin

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Suites fausse couche précoce',
    categorie: 'Gynécologie',
    description: 'Prise en charge après FC < 14 SA',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: 5 jours

2. SPASFON 80 mg, comprimé (si contractions)
   Posologie: 2 comprimés jusqu'à 3 fois par jour
   Durée: 5 jours

RECOMMANDATIONS:
- Repos relatif pendant quelques jours
- Protections hygiéniques (JAMAIS de tampons)
- Pas de rapports sexuels pendant 15 jours
- Toilette externe uniquement
- Surveiller température

SURVEILLANCE:
- Saignements: diminution progressive normale
- Consulter si: saignements abondants, fièvre, douleurs intenses
- Contrôle β-hCG à prévoir selon protocole
- Échographie de contrôle selon indication
- Consultation à J15-J21

SOUTIEN PSYCHOLOGIQUE:
- Temps de deuil nécessaire
- Soutien psychologique disponible
- Associations de soutien

CONTRACEPTION:
- À discuter selon désir
- Pas de délai obligatoire avant nouvelle grossesse

Arrêt de travail si besoin: ____ jours

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Brûlures d\'estomac grossesse',
    categorie: 'Grossesse',
    description: 'Pyrosis et reflux gastro-œsophagien',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. GAVISCON, suspension buvable en sachet
   Posologie: 1 sachet après chaque repas et au coucher (4 fois/jour max)
   Durée: 1 mois (renouvelable)

2. MAALOX, suspension buvable (alternative)
   Posologie: 1 sachet si brûlures, maximum 6 sachets/jour
   Durée: 1 mois

RECOMMANDATIONS HYGIÉNO-DIÉTÉTIQUES:
- Fractionner les repas (5-6 petits repas/jour)
- Manger lentement, bien mastiquer
- Éviter repas copieux, surtout le soir
- Dernier repas 2-3h avant coucher
- Surélever tête du lit (15-20 cm) ou oreillers
- Éviter position allongée après repas

ALIMENTS À ÉVITER:
- Aliments gras, frits
- Épices, piments
- Chocolat
- Agrumes, tomates
- Café, thé
- Boissons gazeuses
- Menthe

ALIMENTS À PRIVILÉGIER:
- Féculents (pain, pâtes, riz)
- Légumes cuits
- Viandes maigres
- Produits laitiers

Position: éviter vêtements serrés au niveau de l'abdomen

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Contraception microprogestative - MICROVAL',
    categorie: 'Contraception',
    description: 'Pilule microprogestative (compatible allaitement)',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MICROVAL 30 µg, comprimé
   Posologie: 1 comprimé par jour à heure fixe, en continu (sans arrêt)
   Durée: 3 mois (3 plaquettes de 28 comprimés)
   Début: J1 du cycle ou J21 post-partum

RECOMMANDATIONS:
- Compatible avec l'allaitement maternel
- Prendre tous les jours à la MÊME heure (tolérance 3h seulement)
- Pas d'arrêt entre les plaquettes
- Utiliser un préservatif les 7 premiers jours
- En cas d'oubli < 3h: prendre immédiatement, pas de contraception additionnelle
- En cas d'oubli > 3h: contraception additionnelle 7 jours
- Consultation de contrôle à 3 mois

EFFETS INDÉSIRABLES POSSIBLES:
- Saignements irréguliers (fréquent au début)
- Aménorrhée possible (normal)
- Céphalées
- Tension mammaire

CONTRE-INDICATIONS:
- Grossesse
- Cancer du sein
- Accident thromboembolique en cours
- Saignements génitaux non diagnostiqués

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Contraception estroprogestative - OPTILOVA',
    categorie: 'Contraception',
    description: 'Pilule estroprogestative (hors allaitement)',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. OPTILOVA, comprimé
   Posologie: 1 comprimé par jour pendant 21 jours, puis 7 jours d'arrêt
   Durée: 3 mois (3 plaquettes de 21 comprimés)
   Début: J1 du cycle

RECOMMANDATIONS:
- Débuter le 1er jour des règles
- Prendre à heure fixe chaque jour
- Contraception additionnelle les 7 premiers jours
- Oubli < 12h: prendre immédiatement, pas de contraception additionnelle
- Oubli > 12h: risque de grossesse, contraception additionnelle 7 jours
- CONTRE-INDIQUÉE pendant l'allaitement
- Surveillance TA et poids
- Consultation de contrôle à 3 mois

CONTRE-INDICATIONS:
- Tabac si > 35 ans
- Migraine avec aura
- ATCD thromboemboliques
- HTA non contrôlée
- Allaitement

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Contraception d\'urgence - NORLEVO',
    categorie: 'Contraception',
    description: 'Contraception d\'urgence (72h)',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. NORLEVO 1,5 mg, comprimé
   Posologie: 1 comprimé en prise unique le plus tôt possible
   Durée: Prise unique

RECOMMANDATIONS IMPORTANTES:
- À prendre le PLUS TÔT possible après le rapport non protégé
- Efficace jusqu'à 72h (3 jours) après le rapport
- Plus efficace si pris dans les 12 premières heures
- Peut être pris à n'importe quel moment du cycle
- Compatible avec l'allaitement (suspendre 8h après la prise)

APRÈS LA PRISE:
- Règles normales ou légèrement décalées (±5 jours)
- Test de grossesse si retard de règles > 7 jours
- Reprendre contraception habituelle immédiatement
- Utiliser préservatif jusqu'aux prochaines règles

EFFETS INDÉSIRABLES:
- Nausées (20%)
- Fatigue
- Céphalées
- Saignements possibles

CE N'EST PAS UNE CONTRACEPTION RÉGULIÈRE
Mettre en place une contraception régulière adaptée

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Contraception d\'urgence - ELLAONE',
    categorie: 'Contraception',
    description: 'Contraception d\'urgence (120h)',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. ELLAONE 30 mg, comprimé
   Posologie: 1 comprimé en prise unique le plus tôt possible
   Durée: Prise unique

RECOMMANDATIONS IMPORTANTES:
- À prendre le PLUS TÔT possible après le rapport non protégé
- Efficace jusqu'à 120h (5 jours) après le rapport
- Plus efficace que Norlevo entre 72h et 120h
- Peut être pris à n'importe quel moment du cycle
- NON compatible avec allaitement (suspendre 7 jours après prise)

APRÈS LA PRISE:
- Règles normales ou légèrement décalées
- Test de grossesse si retard de règles > 7 jours
- Reprendre contraception habituelle après les prochaines règles
- Utiliser préservatif jusqu'aux prochaines règles

EFFETS INDÉSIRABLES:
- Nausées
- Céphalées
- Douleurs abdominales
- Saignements

IMPORTANT:
- Ne pas prendre si déjà pris un contraceptif progestatif dans les 7 derniers jours
- CE N'EST PAS UNE CONTRACEPTION RÉGULIÈRE

Mettre en place une contraception régulière adaptée

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Patch contraceptif - EVRA',
    categorie: 'Contraception',
    description: 'Patch transdermique hebdomadaire',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. EVRA, patch transdermique
   Posologie: 1 patch par semaine pendant 3 semaines, puis 1 semaine sans patch
   Durée: 3 mois (9 patchs)
   Début: J1 du cycle

RECOMMANDATIONS D'UTILISATION:
- Appliquer sur peau propre, sèche, sans crème
- Zones: abdomen, fesses, haut du torse (pas seins), face externe bras
- Changer le même jour chaque semaine
- 1 semaine d'arrêt tous les 3 patchs (règles)
- Bien vérifier que le patch adhère (tous les jours)
- Si décollement < 24h: recoller ou nouveau patch
- Si décollement > 24h: nouveau patch + contraception additionnelle 7j

AVANTAGES:
- Application hebdomadaire (vs quotidien pilule)
- Moins de problèmes en cas de vomissements/diarrhée
- Efficacité identique à la pilule

CONTRE-INDICATIONS: Identiques à pilule estroprogestative
- Tabac > 35 ans, migraine avec aura, ATCD thrombose, allaitement

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Anneau vaginal - NUVARING',
    categorie: 'Contraception',
    description: 'Anneau contraceptif mensuel',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. NUVARING, anneau vaginal
   Posologie: 1 anneau en place 3 semaines, puis 1 semaine sans anneau
   Durée: 3 mois (3 anneaux)
   Début: J1 du cycle

RECOMMANDATIONS D'UTILISATION:
- Insertion dans le vagin (comme un tampon)
- Laisser en place 3 semaines continues
- Retirer au bout de 3 semaines
- 1 semaine sans anneau (règles)
- Insérer nouvel anneau après 7 jours d'arrêt
- Position exacte dans le vagin n'est pas importante
- Ne gêne pas les rapports sexuels
- Si expulsion < 3h: rincer et réinsérer
- Si expulsion > 3h: contraception additionnelle 7j

AVANTAGES:
- Application mensuelle
- Moins de problèmes digestifs
- Efficacité identique à la pilule

CONTRE-INDICATIONS: Identiques à pilule estroprogestative
- Tabac > 35 ans, migraine avec aura, ATCD thrombose, allaitement
- Prolapsus génital sévère

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'DIU au cuivre - Prescription/Pose',
    categorie: 'Contraception',
    description: 'Dispositif intra-utérin au cuivre',
    medicaments: [],
    contenu: `PRESCRIPTION:

DIU AU CUIVRE
Taille: TT 380 (standard) ou NT 380 Short (nullipare/utérus petit)
Durée d'efficacité: 5 ans

PRESCRIPTION ASSOCIÉE:
- SPASFON 80 mg: 2 comprimés 1h avant la pose
- ANTADYS 200 mg: 1 comprimé 1h avant la pose (si besoin)

RECOMMANDATIONS AVANT LA POSE:
- Pose idéale: pendant les règles (col ouvert)
- Consultation de pose à programmer
- Apporter des protections hygiéniques
- Venir accompagnée si possible
- Bilan IST si facteurs de risque

APRÈS LA POSE:
- Repos relatif 24-48h
- Pas de rapports sexuels 48h
- Pas de tampons/cup pendant 48h
- Possible douleurs/saignements 48h (normal)
- Consultation de contrôle à 1 mois

AVANTAGES:
- Efficacité 99,4%
- Pas d'hormones
- Contraception longue durée (5 ans)
- Réversible immédiatement

SURVEILLANCE:
- Vérifier les fils après chaque règles
- Consultation annuelle

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'DIU hormonal - Prescription/Pose',
    categorie: 'Contraception',
    description: 'Dispositif intra-utérin hormonal',
    medicaments: [],
    contenu: `PRESCRIPTION:

DIU HORMONAL (au choix selon profil):
- MIRENA (52 mg lévonorgestrel) - 5 ans
- KYLEENA (19,5 mg lévonorgestrel) - 5 ans
- JAYDESS (13,5 mg lévonorgestrel) - 3 ans

PRESCRIPTION ASSOCIÉE:
- SPASFON 80 mg: 2 comprimés 1h avant la pose
- ANTADYS 200 mg: 1 comprimé 1h avant la pose (si besoin)

RECOMMANDATIONS AVANT LA POSE:
- Pose idéale: pendant les règles
- Consultation de pose à programmer
- Apporter des protections hygiéniques
- Venir accompagnée si possible

APRÈS LA POSE:
- Repos relatif 24-48h
- Pas de rapports sexuels 48h
- Pas de tampons 48h
- Possible douleurs/spottings (normal)
- Consultation de contrôle à 1 mois

AVANTAGES:
- Efficacité 99,8%
- Diminution des règles (voire aménorrhée)
- Traitement des ménorragies
- Contraception longue durée
- Réversible immédiatement

EFFETS POSSIBLES:
- Spotting les premiers mois
- Aménorrhée progressive (normal et bénéfique)
- Acné possible

SURVEILLANCE:
- Vérifier les fils régulièrement
- Consultation annuelle

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Implant contraceptif - NEXPLANON',
    categorie: 'Contraception',
    description: 'Implant sous-cutané (pose)',
    medicaments: [],
    contenu: `PRESCRIPTION:

NEXPLANON, implant contraceptif sous-cutané
Durée d'efficacité: 3 ans

PRESCRIPTION ASSOCIÉE POUR LA POSE:
- EMLA crème 5%, 1 tube
  Application: 1h avant la pose sur zone de pose
  + Film occlusif

RECOMMANDATIONS POSE:
- Pose sous anesthésie locale
- Face interne du bras non dominant
- À 6-8 cm au-dessus du pli du coude
- Pose J1-J5 du cycle (efficacité immédiate)
- Durée pose: 5 minutes

APRÈS LA POSE:
- Pansement compressif 24h
- Possible petit hématome (normal)
- Pas de port de charges lourdes 24h
- Palpable sous la peau (normal)
- Efficace immédiatement si posé pendant règles

AVANTAGES:
- Efficacité 99,95% (meilleure contraception)
- Contraception longue durée (3 ans)
- Pas de prise quotidienne
- Compatible allaitement
- Réversible immédiatement après retrait

EFFETS POSSIBLES:
- Saignements irréguliers (fréquent)
- Aménorrhée possible (20-30%)
- Spotting
- Prise de poids possible

SURVEILLANCE:
- Consultation de contrôle à 3 mois
- Retrait/remplacement à 3 ans

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
