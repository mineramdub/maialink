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
  {
    nom: 'MYCOHYDRALIN',
    dci: 'Éconazole',
    dosage: '150 mg',
    forme: 'ovule + crème',
    posologie: 'Ovule: 1 ovule le soir pendant 3 jours. Crème: application locale 2 fois par jour',
    duree: '3 jours (ovule) + 7 jours (crème)',
    indications: ['Mycose vulvo-vaginale', 'Candidose']
  },

  // Vaginose bactérienne
  {
    nom: 'MÉTRONIDAZOLE',
    dci: 'Métronidazole',
    dosage: '500 mg',
    forme: 'comprimé',
    posologie: '1 comprimé 2 fois par jour',
    duree: '7 jours',
    indications: ['Vaginose bactérienne', 'Trichomonase']
  },
  {
    nom: 'FLAGYL ovule',
    dci: 'Métronidazole',
    dosage: '500 mg',
    forme: 'ovule',
    posologie: '1 ovule le soir au coucher',
    duree: '7 jours',
    indications: ['Vaginose bactérienne']
  },

  // Dysménorrhées
  {
    nom: 'IBUPROFÈNE',
    dci: 'Ibuprofène',
    dosage: '400 mg',
    forme: 'comprimé',
    posologie: '1 comprimé jusqu\'à 3 fois par jour pendant les règles',
    duree: '5 jours par cycle',
    indications: ['Dysménorrhée', 'Règles douloureuses']
  },
  {
    nom: 'ANTADYS',
    dci: 'Flurbiprofène',
    dosage: '100 mg',
    forme: 'comprimé',
    posologie: '1 comprimé jusqu\'à 4 fois par jour pendant les règles',
    duree: '3 à 5 jours par cycle',
    indications: ['Dysménorrhée primaire', 'Règles douloureuses']
  },

  // Saignements abondants
  {
    nom: 'EXACYL',
    dci: 'Acide tranexamique',
    dosage: '500 mg',
    forme: 'comprimé',
    posologie: '2 comprimés 3 fois par jour pendant les règles',
    duree: '3 à 5 jours par cycle',
    indications: ['Ménorragies', 'Saignements abondants']
  },

  // IST - Chlamydia
  {
    nom: 'AZITHROMYCINE',
    dci: 'Azithromycine',
    dosage: '1 g',
    forme: 'comprimé',
    posologie: '2 comprimés en prise unique',
    duree: 'Dose unique',
    indications: ['Chlamydia', 'IST']
  },
  {
    nom: 'DOXYCYCLINE',
    dci: 'Doxycycline',
    dosage: '100 mg',
    forme: 'comprimé',
    posologie: '1 comprimé 2 fois par jour',
    duree: '7 jours',
    indications: ['Chlamydia', 'IST']
  },

  // Dyspareunies - Sécheresse vaginale
  {
    nom: 'MUCOGYNE',
    dci: 'Acide hyaluronique',
    dosage: '',
    forme: 'gel vaginal',
    posologie: '1 application vaginale 2 fois par semaine',
    duree: '1 mois (renouvelable)',
    indications: ['Sécheresse vaginale', 'Dyspareunie', 'Atrophie vaginale']
  },
  {
    nom: 'MONASENS gel',
    dci: 'Acide hyaluronique',
    dosage: '',
    forme: 'gel vaginal',
    posologie: '1 application vaginale 1 à 2 fois par semaine',
    duree: '1 mois (renouvelable)',
    indications: ['Sécheresse vaginale', 'Dyspareunie']
  },
  {
    nom: 'REPLENS',
    dci: 'Polycarbophile',
    dosage: '',
    forme: 'gel vaginal',
    posologie: '1 application vaginale tous les 3 jours',
    duree: '1 mois',
    indications: ['Sécheresse vaginale', 'Dyspareunie']
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
  },

  // === 30 NOUVELLES ORDONNANCES ===

  {
    nom: 'Infection urinaire basse - Cystite',
    categorie: 'Grossesse',
    description: 'Traitement cystite aiguë gravidique',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. AMOXICILLINE 1 g, comprimé
   Posologie: 1 comprimé 3 fois par jour
   Durée: 7 jours

RECOMMANDATIONS:
- Augmenter hydratation (2L/eau par jour minimum)
- Uriner fréquemment, ne pas se retenir
- Uriner après chaque rapport sexuel
- Hygiène intime: d'avant en arrière uniquement
- Éviter bains moussants et savons irritants
- ECBU de contrôle 8-10 jours après fin traitement
- Consulter si: fièvre, douleurs lombaires, nausées/vomissements

SIGNES D'AGGRAVATION (pyélonéphrite):
- Fièvre > 38°C
- Douleurs lombaires
- Nausées, vomissements
→ Consulter en URGENCE

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Mycose vaginale pendant grossesse',
    categorie: 'Grossesse',
    description: 'Traitement candidose vulvo-vaginale',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MONAZOL 2%, crème gynécologique, 1 tube
   Posologie: 1 application intravaginale le soir au coucher
   Durée: 7 jours

2. MONAZOL 2%, crème cutanée, 1 tube (vulve)
   Posologie: 2 applications par jour sur vulve
   Durée: 7 jours

RECOMMANDATIONS:
- Traiter le partenaire en parallèle (crème)
- Sous-vêtements en coton, amples
- Éviter savons intimes parfumés
- Sécher soigneusement après toilette
- Pas de douches vaginales
- Changer serviettes hygiéniques fréquemment
- Possible récidives en fin de grossesse (normal)
- Consulter si pas d'amélioration à 48-72h

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Constipation pendant grossesse',
    categorie: 'Grossesse',
    description: 'Traitement constipation gravidique',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MOVICOL, sachet
   Posologie: 1 à 2 sachets par jour dans un verre d'eau
   Durée: selon besoin
   Boîte de 20 sachets

CONSEILS DIÉTÉTIQUES:
- Augmenter fibres: fruits, légumes, céréales complètes
- Pruneaux, kiwis le matin
- Hydratation: 1,5-2L d'eau par jour
- Activité physique régulière (marche)

CONSEILS:
- Effet sous 24-48h
- Ne pas utiliser laxatifs stimulants
- Ne pas forcer lors défécation
- Aller aux toilettes dès le besoin
- Position accroupie facilite transit

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Reflux gastro-œsophagien (RGO)',
    categorie: 'Grossesse',
    description: 'Traitement RGO gravidique',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. GAVISCON MENTHE, suspension buvable
   Posologie: 1 sachet après chaque repas et au coucher
   Durée: selon besoin
   Boîte de 24 sachets

2. Si insuffisant, ajouter:
   INEXIUM 20 mg, comprimé
   Posologie: 1 comprimé le matin à jeun
   Durée: 1 mois

CONSEILS HYGIÉNO-DIÉTÉTIQUES:
- Fractionner repas (5-6 petits repas/jour)
- Éviter: café, chocolat, agrumes, tomates, plats épicés
- Ne pas se coucher juste après manger (attendre 2-3h)
- Surélever tête de lit (15 cm)
- Vêtements amples, ne pas serrer abdomen
- Éviter tabac

NORMAL EN GROSSESSE:
- Compression estomac par utérus
- Relâchement sphincter œsophagien
- S'améliore après accouchement

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Insomnie pendant grossesse',
    categorie: 'Grossesse',
    description: 'Troubles du sommeil gravidiques',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. EUPHYTOSE, comprimé
   Posologie: 1 comprimé le soir au coucher
   Durée: 1 mois
   (Complément alimentaire à base de plantes)

CONSEILS HYGIÈNE DU SOMMEIL:
- Horaires réguliers coucher/lever
- Éviter écrans 1h avant coucher
- Température chambre: 18-19°C
- Rituel apaisant: lecture, tisane, relaxation
- Éviter caféine après 15h
- Activité physique en journée (pas le soir)
- Coussin de grossesse pour confort

TECHNIQUES RELAXATION:
- Respiration profonde
- Méditation guidée
- Yoga prénatal
- Musique douce

CAUSES NORMALES:
- Mouvements bébé
- Envies uriner fréquentes
- Inconfort positions
- Anxiété pré-accouchement

Si persistance: envisager consultation avec psychologue périnatale

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Douleurs périnéales post-partum',
    categorie: 'Post-partum',
    description: 'Traitement douleurs périnée après accouchement',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: 7 jours

2. TITANOREINE 2%, suppositoire (si épisiotomie)
   Posologie: 1 suppositoire matin et soir
   Durée: 7 jours

SOINS LOCAUX:
- Toilette intime 2-3x/jour (eau tiède, savon doux)
- Sécher tamponnant (pas frotter)
- Bains de siège eau tiède 10-15 min, 2-3x/jour
- Glace dans serviette 10 min (soulagement)
- Changement protection fréquent

POSITIONS ANTALGIQUES:
- Assise sur bouée/coussin
- Éviter position assise prolongée
- Privilégier positions latérales

SURVEILLANCE CICATRICE:
- Normale: légèrement rouge, sensible
- CONSULTER si: écoulement purulent, odeur, fièvre, douleur intense

ÉVOLUTION:
- Amélioration progressive 7-10 jours
- Cicatrisation complète: 3-4 semaines

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Crevasses mamelonnaires',
    categorie: 'Allaitement',
    description: 'Traitement crevasses du mamelon',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. LANOLINE PURE (LANSINOH ou PURELAN), tube 40g
   Application: après chaque tétée
   Pas besoin de rincer avant tétée suivante

2. COQUILLES D'ALLAITEMENT (protection)
   Usage: entre les tétées pour éviter frottement

SOINS:
- Lait maternel sur mamelon après tétée (cicatrisant naturel)
- Séchage à l'air entre tétées
- Compresses hydrogel (apaisantes)
- Pas d'alcool, biseptine, éosine (irritants)

CORRECTION POSITION/PRISE DU SEIN:
- Bouche bébé grande ouverte
- Aréole dans bouche (pas seulement mamelon)
- Lèvres retroussées
- Menton touche sein
- Nez dégagé

SI DOULEUR PERSISTANTE:
- Vérifier frein de langue bébé
- Consulter consultante en lactation IBCLC
- Possible muguet (consulter)

PRÉVENTION:
- Position correcte dès départ
- Varier positions allaitement
- Pas de durée limitée arbitraire
- Laisser bébé finir sein avant changer

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Engorgement mammaire - Allaitement',
    categorie: 'Allaitement',
    description: 'Traitement engorgement sein',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour
   Durée: 3-5 jours

TRAITEMENT LOCAL:

AVANT TÉTÉE (faciliter écoulement):
- Chaleur: compresse chaude, douche chaude sur sein 5 min
- Massage doux: du bord vers mamelon
- Expression manuelle quelques gouttes

PENDANT TÉTÉE:
- Allaiter fréquemment (toutes les 2-3h)
- Commencer par sein engorgé
- Vider complètement le sein
- Positions variées (drainage optimal)

APRÈS TÉTÉE (réduire inflammation):
- Froid: glace dans linge 10-15 min
- Feuilles de chou vert au frigo (anti-inflammatoire naturel)

PRÉVENTION:
- Allaitement à la demande
- Pas de restriction durée tétées
- Éviter sauter tétées
- Drainage complet des seins
- Vêtements amples

CONSULTER EN URGENCE SI:
- Fièvre > 38,5°C
- Zone rouge, chaude, très douloureuse
- État grippal
→ Risque mastite

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Baby blues / Anxiété post-partum',
    categorie: 'Post-partum',
    description: 'Soutien anxiété légère post-natale',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. EUPHYTOSE, comprimé
   Posologie: 1 comprimé 2 fois par jour
   Durée: 1 mois

2. MAGNÉSIUM TAURINE B6, comprimé
   Posologie: 2 comprimés par jour
   Durée: 1 mois

SOUTIEN PSYCHOLOGIQUE:
- Normal les 10 premiers jours (baby blues)
- Pleurs, irritabilité, anxiété fréquents
- Dû aux changements hormonaux brutaux
- Repos, soutien entourage essentiels

QUAND CONSULTER (dépression post-partum):
- Symptômes > 2 semaines
- Tristesse envahissante
- Pensées négatives persistantes
- Difficulté lien avec bébé
- Idées noires
- Perte appétit, sommeil impossible
→ Consultation psychiatre/psychologue périnatale URGENTE

RESSOURCES:
- Groupes de parole jeunes mamans
- PMI (suivi gratuit)
- Psychologue périnatale
- Association Maman Blues

CONSEILS:
- Accepter aide entourage
- Repos maximal
- Sortir, voir du monde
- Activité physique douce
- Parler de ses émotions

NUMÉROS UTILES:
- SOS Baby Blues: [numéro à compléter]
- Fil santé jeunes: 0800 235 236

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Jambes lourdes / Œdèmes grossesse',
    categorie: 'Grossesse',
    description: 'Traitement insuffisance veineuse',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. DAFLON 500 mg, comprimé
   Posologie: 2 comprimés par jour (midi et soir)
   Durée: 2 mois

2. BAS DE CONTENTION CLASSE 2
   Prescription: 2 paires
   Port: toute la journée jusqu'à accouchement
   Mise en place: le matin avant lever

CONSEILS:
- Surélever jambes au repos (coussin sous pieds)
- Marche quotidienne (30 min minimum)
- Éviter station debout/assise prolongée
- Douche froide sur jambes (bas → haut)
- Dormir jambes légèrement surélevées
- Massage lymphatique jambes

ÉVITER:
- Chaleur excessive (bain chaud, sauna)
- Vêtements serrés
- Talons hauts
- Croiser les jambes
- Piétinement

EXERCICES:
- Flexion/extension chevilles
- Marche sur pointe des pieds
- Rotation chevilles
- Vélo d'appartement

SURVEILLANCE TA:
- Œdèmes + prise poids brutale + TA élevée
→ Consulter rapidement (pré-éclampsie)

AMÉLIORATION APRÈS ACCOUCHEMENT:
- Disparition progressive œdèmes en 1-2 semaines

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Rhinite / Rhume pendant grossesse',
    categorie: 'Grossesse',
    description: 'Traitement rhume autorisé grossesse',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. SÉRUM PHYSIOLOGIQUE, unidoses
   Posologie: lavages nasaux 4-6 fois par jour
   Boîte de 40 unidoses

2. PARACÉTAMOL 1 g, comprimé (si fièvre/douleur)
   Posologie: 1 comprimé jusqu'à 3 fois par jour
   Durée: 5 jours maximum

SOINS LOCAUX:
- Lavages nez fréquents (sérum phy)
- Mouchage doux (1 narine à la fois)
- Humidificateur chambre
- Vapeur d'eau (inhalation sans huile essentielle)

CONTRE-INDIQUÉS EN GROSSESSE:
❌ Anti-inflammatoires (Ibuprofène)
❌ Vasoconstricteurs nasaux
❌ Aspirine
❌ Sirops avec codéine

CONSEILS:
- Repos
- Hydratation abondante
- Position demi-assise pour dormir
- Boissons chaudes: tisanes, bouillon

CONSULTER SI:
- Fièvre > 38,5°C persistante
- Toux grasse/expectorations colorées
- Essoufflement
- Douleur thoracique
- Pas d'amélioration après 7 jours

PRÉVENTION:
- Lavage mains fréquent
- Éviter lieux confinés en période épidémique
- Vaccination grippe recommandée

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Vaginose bactérienne',
    categorie: 'Grossesse',
    description: 'Traitement vaginose en cours de grossesse',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MÉTRONIDAZOLE 500 mg, comprimé
   Posologie: 1 comprimé 2 fois par jour
   Durée: 7 jours
   ⚠️ À partir du 2ème trimestre uniquement

RECOMMANDATIONS:
- Éviter alcool pendant traitement (effet antabuse)
- Traiter les 2 partenaires
- Pas de rapports pendant traitement
- Contrôle après traitement si symptômes

SYMPTÔMES:
- Pertes grisâtres
- Odeur "poisson" caractéristique
- Pas de prurit (différence avec mycose)

PRÉVENTION RÉCIDIVES:
- Toilette externe uniquement (pas de douche vaginale)
- Sous-vêtements coton
- Savon doux pH neutre
- Éviter protège-slips quotidiens

POURQUOI TRAITER EN GROSSESSE:
- Risque accouchement prématuré
- Risque rupture prématurée membranes
- Risque infection amniotique

CONSULTER SI:
- Pas d'amélioration à 72h
- Pertes sanglantes
- Douleurs abdominales
- Fièvre

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Préparation périnée (fin grossesse)',
    categorie: 'Grossesse',
    description: 'Assouplissement périnéal avant accouchement',
    medicaments: [],
    contenu: `PRESCRIPTION:

1. HUILE D'AMANDE DOUCE BIO, flacon 100ml
   Usage: massage périnéal
   À partir de: 34 SA

TECHNIQUE MASSAGE PÉRINÉAL (à partir 34 SA):

FRÉQUENCE:
- 3-4 fois par semaine
- 5-10 minutes
- Seule ou avec partenaire

MÉTHODE:
1. Vider vessie, se laver les mains
2. Position confortable (semi-assise)
3. Appliquer huile sur périnée et doigts
4. Introduire 1-2 doigts 3-4 cm dans vagin
5. Pression vers bas et côtés (en U)
6. Maintenir étirement 1-2 min
7. Massage doux en balayage

SENSATIONS NORMALES:
- Légère tension/étirement
- Sensation "besoin d'uriner"
- Pas de douleur vive

CONTRE-INDICATIONS:
- Infection vaginale active
- Saignements
- Menace accouchement prématuré
- Placenta prævia

BÉNÉFICES PROUVÉS:
- Réduction risque épisiotomie
- Réduction déchirures sévères
- Meilleure récupération post-partum
- Particulièrement efficace si 1ère grossesse

AUTRES PRÉPARATIONS:
- Exercices respiration/poussée
- Yoga prénatal
- Piscine
- Périnée position accroupie

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Diabète gestationnel - Conseils diététiques',
    categorie: 'Grossesse',
    description: 'Prise en charge nutritionnelle DG',
    medicaments: [],
    contenu: `PRESCRIPTION:

CONSULTATION DIÉTÉTICIENNE SPÉCIALISÉE
Nombre de séances: 3 (remboursées)

OBJECTIFS GLYCÉMIQUES:
- À jeun: < 0,95 g/L
- 2h après repas: < 1,20 g/L

PRINCIPES DIÉTÉTIQUES:

GLUCIDES:
- Répartition 3 repas + 2-3 collations
- Privilégier index glycémique bas
- Pain complet, pâtes al dente, légumineuses
- Éviter sucres rapides: gâteaux, sodas, bonbons

PROTÉINES:
- À chaque repas: viande, poisson, œufs, légumineuses
- Satiété prolongée

FIBRES:
- Légumes à volonté
- Fruits: 2-3/jour (éviter jus de fruits)

MATIÈRES GRASSES:
- Privilégier huiles végétales, poissons gras
- Limiter fritures, charcuterie

ACTIVITÉ PHYSIQUE:
- 30 min marche quotidienne
- Après chaque repas (baisse glycémie)

AUTOSURVEILLANCE GLYCÉMIQUE:
- 4-6 fois par jour
- Noter dans carnet
- Apporter à chaque consultation

CONSULTATION:
- Suivi mensuel sage-femme/gynécologue
- Échographie croissance fœtale
- Risque macrosomie

SI ÉCHEC MESURES DIÉTÉTIQUES:
- Insulinothérapie possible
- Consultation diabétologue

APRÈS ACCOUCHEMENT:
- Dépistage diabète type 2 à prévoir (3 mois post-partum)
- Risque augmenté pour grossesses ultérieures

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Prévention vergetures - Huiles de massage',
    categorie: 'Grossesse',
    description: 'Soins préventifs vergetures grossesse',
    medicaments: [],
    contenu: `PRESCRIPTION:

1. HUILE ANTI-VERGETURES (Bi-Oil, Mustela, Weleda...)
   Application: 2 fois par jour matin et soir
   Zones: ventre, seins, hanches, cuisses
   Durée: dès début grossesse jusqu'à 3 mois post-partum

TECHNIQUE APPLICATION:
- Après douche, peau légèrement humide
- Massage circulaire doux
- Insister zones à risque
- 5-10 minutes
- Régularité essentielle

ZONES À TRAITER:
- Ventre (surtout sous nombril)
- Seins (pourtour, pas mamelon)
- Hanches
- Haut cuisses
- Bas du dos

FACTEURS DE RISQUE:
- Grossesse multiple
- Gros bébé
- Prise poids rapide
- Antécédents familiaux
- Jeune âge
- 1ère grossesse

AUTRES CONSEILS:
- Hydratation: boire 1,5-2L/jour
- Alimentation équilibrée riche en vitamines
- Prise de poids progressive et régulière
- Éviter grattage (aggrave)
- Soutien-gorge adapté (bon maintien seins)

RÉALITÉ:
- Prévention réduit risque mais ne garantit pas
- Facteur génétique important
- Apparition surtout 3ème trimestre
- Couleur rouge/violacé initialement
- Éclaircissement progressif (blanches nacrées)
- Amélioration possible post-partum
- Laser/crèmes spécifiques après allaitement si souhait

IMPORTANT:
- Commencer tôt (ne pas attendre apparition)
- Régularité primordiale

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Sevrage allaitement',
    categorie: 'Allaitement',
    description: 'Arrêt progressif allaitement maternel',
    medicaments: [],
    contenu: `PROTOCOLE SEVRAGE PROGRESSIF:

PRINCIPE:
- Arrêt progressif (pas brutal)
- Durée recommandée: 2-4 semaines minimum
- Confort mère et adaptation bébé

MÉTHODE:

SEMAINE 1-2:
- Supprimer 1 tétée tous les 2-3 jours
- Commencer par tétée la moins importante
- Remplacer par biberon lait infantile
- Garder tétée matin/soir (+ affectives)

SEMAINE 3-4:
- Réduire progressivement tétées restantes
- Dernières: matin et coucher
- Laisser bébé s'adapter

GESTION ENGORGEMENT:

1. Si seins tendus:
   - Expression manuelle légère (juste soulagement)
   - Ne pas vider complètement (stimule production)
   - Froid: glace dans linge 15 min

2. PARLODEL ❌ NON RECOMMANDÉ
   - Effets secondaires importants
   - Arrêt progressif tout aussi efficace

CONFORT:
- Soutien-gorge adapté (sans armatures)
- PARACÉTAMOL si douleur
- Feuilles chou dans soutien-gorge (anti-inflammatoire naturel)

POUR BÉBÉ:
- Moment câlins/réconfort sans tétée
- Papa/entourage prend relais certains moments
- Introduction progressive biberon avant arrêt complet
- Tétine possible si besoin succion

DURÉE TARISSEMENT:
- Production s'arrête progressivement
- 2-6 semaines
- Possible petites gouttes plusieurs mois (normal)

RETOUR RÈGLES:
- Possible rapidement après arrêt
- Reprendre contraception

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Reprise transit post-partum',
    categorie: 'Post-partum',
    description: 'Stimulation transit après accouchement',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MOVICOL, sachet
   Posologie: 1 sachet matin et soir dans verre d'eau
   Durée: selon besoin
   Boîte de 20 sachets

2. LANSOYL (paraffine liquide), gel oral
   Posologie: 1 sachet le soir si besoin
   Durée: jusqu'à reprise transit normal

POURQUOI DIFFICULTÉS POST-PARTUM:
- Peur douleur périnée/épisiotomie
- Relâchement musculature abdominale
- Déshydratation
- Alitement/immobilisation
- Effets péridurale
- Prise fer (constipant)

CONSEILS IMMÉDIATS:

ALIMENTATION:
- Pruneaux le matin
- Fruits: kiwi, pomme avec peau
- Légumes fibreux
- Pain complet
- Éviter riz, banane, chocolat (constipants)

HYDRATATION:
- 2L eau minimum/jour
- Jus pruneaux
- Bouillons

MOBILISATION:
- Lever précoce
- Marche dès que possible
- Éviter position assise prolongée

TECHNIQUE AUX TOILETTES:
- Ne pas forcer
- Position pieds surélevés (marche-pied)
- Respiration ventrale
- Soutenir périnée (compresse)
- Pas de peur: points ne lâcheront pas

SI HÉMORROÏDES ASSOCIÉES:
- Bains de siège eau tiède
- Crème apaisante
- Glace dans linge

OBJECTIF:
- Selle dans les 3-4 jours post-accouchement
- Consulter si > 5 jours sans selle

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Douleurs ligaments ronds',
    categorie: 'Grossesse',
    description: 'Douleurs ligaments ronds',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si besoin
   Durée: selon nécessité

2. SPASFON 80 mg, comprimé
   Posologie: 1-2 comprimés si douleur intense
   Durée: prise ponctuelle

EXPLICATIONS:
- Douleurs ligaments ronds (soutiennent utérus)
- Étirement progressif avec croissance utérus
- Douleurs aiguës, brèves, en coup de poignard
- Localisées aine, bas ventre, plis inguinaux
- Surtout 2ème trimestre
- Aggravées par: mouvement brusque, toux, rire, changement position

POSITIONS SOULAGEMENT:
- Allongée sur côté (coussin entre jambes)
- Genoux pliés position fœtale
- Quatre pattes (soulage poids utérus)

PRÉVENTION:
- Éviter mouvements brusques
- Se lever/retourner doucement dans lit
- Soutien ventre: ceinture grossesse
- Éviter station debout prolongée
- Repos fréquent

EXERCICES DOUX:
- Étirements légers
- Yoga prénatal
- Marche modérée
- Natation (soulagement poids)

QUAND CONSULTER:
- Douleurs persistantes malgré repos
- Contractions régulières associées
- Saignements
- Fièvre
- Brûlures mictionnelles

DIFFÉRENCIER DE:
- Contractions (durent + longtemps, régulières)
- Infection urinaire (brûlures miction)
- Appendicite (fièvre, vomissements)

ÉVOLUTION:
- Diminuent généralement 3ème trimestre
- Disparaissent après accouchement

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Anémie modérée post-partum',
    categorie: 'Post-partum',
    description: 'Supplémentation fer après accouchement',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. TARDYFERON 80 mg, comprimé pelliculé
   Posologie: 2 comprimés par jour, en dehors des repas
   Durée: 3 mois

2. VITAMINE C 500 mg, comprimé
   Posologie: 1 comprimé avec chaque prise de fer
   (améliore absorption fer)

SYMPTÔMES ANÉMIE:
- Fatigue intense
- Pâleur
- Essoufflement effort minime
- Vertiges
- Palpitations
- Cheveux fragiles

APRÈS ACCOUCHEMENT:
- Pertes sanguines normales (lochies)
- Peut aggraver anémie
- Récupération nécessaire

CONSEILS PRISE:
- À jeun ou 1h avant repas / 2h après
- Avec jus d'orange (vitamine C)
- ÉVITER avec: thé, café, lait, produits laitiers

ALIMENTATION RICHE EN FER:
- Viande rouge (meilleure absorption)
- Abats (boudin noir)
- Poissons
- Légumineuses: lentilles, pois chiches
- Épinards, brocolis
- Fruits secs: abricots, figues

EFFETS SECONDAIRES POSSIBLES:
- Selles noires (normal, pas inquiétant)
- Constipation (augmenter fibres, eau)
- Nausées (prendre au milieu repas si besoin)
- Douleurs abdominales

CONTRÔLE BIOLOGIQUE:
- NFS à 1 mois
- Puis à 3 mois fin traitement
- Objectif: Hb > 12 g/dL

ALLAITEMENT:
- Compatible avec fer
- Passe peu dans lait

SI PAS D'AMÉLIORATION:
- Rechercher autre cause carence
- Envisager fer injectable

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Prévention thrombose post-partum',
    categorie: 'Post-partum',
    description: 'Anticoagulation préventive si risque',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. LOVENOX 4000 UI, seringue pré-remplie
   Posologie: 1 injection sous-cutanée par jour
   Durée: 6 semaines post-partum
   Boîte de 10 seringues (renouveler 4 fois)

TECHNIQUE INJECTION:

ZONES:
- Abdomen (5 cm autour nombril)
- Alterner côtés
- Cuisse externe en dernier recours

MÉTHODE:
1. Laver mains
2. Désinfecter zone
3. Pincer pli peau entre doigts
4. Piquer perpendiculairement 90°
5. Injecter lentement
6. Retirer aiguille
7. NE PAS masser
8. Jeter seringue container DASRI

MOMENT:
- Horaire fixe (ex: 20h)
- Même heure chaque jour

FACTEURS DE RISQUE POST-PARTUM:
- Césarienne
- Immobilisation
- Antécédents thrombose
- Varices importantes
- Obésité
- Tabac
- Âge > 35 ans
- Grossesse multiple

SIGNES ALERTER (thrombose):
❌ Douleur mollet unilatérale
❌ Gonflement jambe
❌ Chaleur, rougeur mollet
❌ Essoufflement brutal
❌ Douleur thoracique
→ URGENCE: appeler 15

ASSOCIER:
- Lever précoce
- Mobilisation active
- Marche quotidienne
- Bas de contention classe 2 (6 semaines)
- Hydratation abondante

COMPATIBLE:
- Allaitement
- Antalgie
- Contraception

SURVEILLANCE:
- Pas de prise sang systématique
- Hématomes possibles point injection (normaux si petits)

ARRÊT PROGRESSIF:
- Pas de relais nécessaire
- Simplement arrêter à 6 semaines

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Soins épisiotomie',
    categorie: 'Post-partum',
    description: 'Cicatrisation optimale épisiotomie',
    medicaments: [],
    contenu: `PRESCRIPTION SOINS:

1. BÉTADINE DERMIQUE 10%, flacon 125ml
   Usage: toilette périnéale 2 fois par jour
   Diluer dans eau tiède

2. TITANOREINE 2%, suppositoire
   Posologie: 1 suppositoire matin et soir
   Durée: 7 jours

3. PARACÉTAMOL 1 g, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour si douleur
   Durée: selon besoin

SOINS QUOTIDIENS:

TOILETTE:
- 2-3 fois par jour + après chaque selle
- Eau tiède + savon doux pH neutre
- D'avant en arrière UNIQUEMENT
- Sécher tamponnant (pas frotter)
- Sèche-cheveux air froid possible

POSITIONS:
- Assise sur bouée/coussin
- Éviter position assise prolongée
- Privilégier positions latérales
- Marche aide cicatrisation (active circulation)

ANTALGIQUE LOCAL:
- Glace dans linge 10-15 min
- Bains de siège eau tiède 10 min, 3x/jour
- Pas de chaleur excessive

PROTECTION HYGIÉNIQUE:
- Serviettes hygiéniques (pas tampons)
- Changer fréquemment (4-6h max)
- Privilégier serviettes coton bio

ÉVITER:
- Rapports sexuels (6 semaines minimum)
- Bains (privilégier douche)
- Parfums/déodorants intimes
- Vêtements serrés

SURVEILLANCE CICATRICE:

NORMAL:
- Léger gonflement
- Rougeur modérée
- Sensibilité
- Tiraillements
- Points tombent seuls (résorbables)

CONSULTER SI:
❌ Écoulement purulent, malodorant
❌ Fièvre
❌ Douleur intense non calmée
❌ Béance cicatrice
❌ Saignement important

ALIMENTATION:
- Éviter constipation (voir ordonnance transit)
- Hydratation 2L/jour

ÉVOLUTION:
- Cicatrisation: 2-3 semaines
- Confort: 4-6 semaines
- Sensibilité résiduelle possible plusieurs mois
- Rééducation périnéale à J45

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Récupération globale post-accouchement',
    categorie: 'Post-partum',
    description: 'Supplémentation complète post-partum',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. TARDYFERON 80 mg, comprimé
   Posologie: 1 comprimé par jour en dehors repas
   Durée: 2 mois (prévention anémie)

2. UVÉDOSE 100 000 UI, solution buvable
   Posologie: 1 ampoule immédiatement
   (dose de charge vitamine D)

3. MAGNÉSIUM MARIN + B6, comprimé
   Posologie: 2 comprimés par jour
   Durée: 1 mois
   (fatigue, récupération musculaire)

4. OMÉGA-3, gélule (si allaitement)
   Posologie: 1 gélule par jour
   Durée: toute la durée allaitement
   (développement cérébral bébé + récupération mère)

ALIMENTATION POST-PARTUM:

PRIORITÉS:
- Hydratation: 2-3L/jour (surtout si allaitement)
- Protéines: viande, poisson, œufs, légumineuses (cicatrisation)
- Fer: viande rouge, lentilles, épinards
- Calcium: produits laitiers, eaux minérales
- Oméga-3: poissons gras, noix, huile colza

PETITS REPAS FRÉQUENTS:
- 5-6 repas/jour plutôt que 3 gros
- Préparations faciles (fatigue)
- Congélation repas anticipée

INTERDITS SI ALLAITEMENT:
❌ Alcool (passe dans lait)
❌ Tabac (diminue lactation)
⚠️ Caféine limitée (2-3 cafés/jour max)

RÉCUPÉRATION PHYSIQUE:

PREMIÈRES SEMAINES:
- Repos maximal
- Pas sport intensif
- Marche douce autorisée
- Solliciter aide entourage

À 6 SEMAINES (visite post-natale):
- Rééducation périnéale (10 séances)
- Puis rééducation abdominale
- Progressivité reprise sport

RÉCUPÉRATION PSYCHOLOGIQUE:
- Baby blues J3-J10: normal
- Fatigue intense: normale
- Bouleversement émotionnel: normal
- Soutien entourage essentiel

QUAND CONSULTER:
- Tristesse persistante > 2 semaines
- Anxiété envahissante
- Difficulté lien mère-bébé
- Pensées négatives récurrentes

SUIVI POST-NATAL:
- J8: sage-femme à domicile
- 6-8 semaines: consultation post-natale
- Contraception: à discuter dès J15

OBJECTIF:
- Récupération progressive
- Pas de pression
- Prendre soin de soi = prendre soin bébé

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Syndrome canal carpien - Attelles',
    categorie: 'Grossesse',
    description: 'Traitement paresthésies mains',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. ATTELLE POIGNET (orthèse nocturne)
   Prescription: 1 ou 2 selon atteinte (bilatérale fréquente)
   Port: la nuit
   En pharmacie ou magasin orthopédie

EXPLICATIONS:
- Compression nerf médian au poignet
- Dû rétention eau (œdème tissus)
- Fréquent 2ème-3ème trimestre (30% femmes enceintes)
- Bilatéral dans 50% cas

SYMPTÔMES TYPIQUES:
- Fourmillements doigts (pouce, index, majeur)
- Sensation "main morte" au réveil
- Douleur poignet irradiant bras
- Difficulté mouvements fins (boutonner vêtements)
- Pire la nuit et au réveil

SOULAGEMENT:

ATTELLE NOCTURNE:
- Maintient poignet position neutre
- Empêche flexion nocturne
- Soulagement rapide souvent

EXERCICES:
- Rotation poignets (10 fois, 3x/jour)
- Flexion/extension doigts
- Secouer mains
- Massage main et avant-bras

POSITIONS:
- Éviter flexion poignet prolongée
- Surélever mains la nuit (oreiller sous avant-bras)
- Pauses fréquentes si travail répétitif mains

FROID:
- Glace poignet 10 min si douleur
- Compresses froides

ÉVITER:
- Mouvements répétitifs forcés
- Port charges lourdes
- Sommeil main sous oreiller

BON À SAVOIR:
- Amélioration progressive après accouchement
- Disparition complète 2-4 semaines post-partum
- Lié élimination rétention eau
- Rarement nécessaire chirurgie
- Si persistance > 3 mois post-partum: avis spécialisé

QUAND CONSULTER:
- Perte force main
- Atrophie muscles base pouce
- Douleur invalidante malgré traitement
- Aggravation rapide

ALTERNATIVE:
- Acupuncture (certaines femmes)
- Ostéopathie
- Kiné (massages, mobilisations)

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Hyperémèse gravidique modérée',
    categorie: 'Grossesse',
    description: 'Vomissements incoercibles début grossesse',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. VOGALÈNE 10 mg, comprimé
   Posologie: 1 comprimé 3 fois par jour avant repas
   Durée: 7 jours (renouveler si besoin)

2. SPASFON 80 mg, comprimé
   Posologie: 1-2 comprimés si spasmes abdominaux
   Durée: selon besoin

3. MAGNÉSIUM + B6, comprimé
   Posologie: 2 comprimés par jour
   Durée: 1 mois

MESURES DIÉTÉTIQUES:

FRACTIONNER:
- 5-6 petits repas au lieu de 3 gros
- Ne jamais rester estomac vide
- Grignoter quelque chose dès réveil (biscuit sec lit)

ALIMENTS TOLÉRÉS:
- Féculents nature: riz, pâtes, purée
- Pain, biscottes
- Banane
- Compote
- Bouillon
- Aliments froids (mieux tolérés)

ÉVITER:
- Aliments gras, frits
- Épices
- Odeurs fortes
- Aliments chauds
- Café

HYDRATATION:
- Boire par petites gorgées fréquentes
- Eau fraîche, gazeuse
- Tisanes gingembre
- Glace à sucer
- Éviter boire pendant repas

TECHNIQUES:

GINGEMBRE:
- Tisane gingembre frais
- Bonbons gingembre
- Capsules gingembre 250mg 3x/jour
- Prouvé efficace nausées grossesse

ACUPRESSION:
- Point P6 (Nei Guan)
- 3 doigts sous pli poignet
- Pression ou bracelet acupression

POSITIONS:
- Éviter allonger juste après repas
- Position demi-assise
- Éviter flexion brusque tronc

REPOS:
- Fatigue aggrave nausées
- Sieste si possible

SURVEILLANCE:

CRITÈRES HOSPITALISATION:
❌ Perte poids > 5% poids initial
❌ Déshydratation sévère
❌ Impossibilité boire
❌ Vomissements > 5x/jour persistants
❌ Urines foncées, rares
❌ Malaise général

EXAMENS SI AGGRAVATION:
- Ionogramme sanguin
- Fonction rénale
- Cétonurie

BON À SAVOIR:
- Pic 8-12 SA habituellement
- Amélioration progressive 14-16 SA
- Disparition généralement 2ème trimestre
- Pas de danger pour bébé si hydratation OK
- Signe bon fonctionnement hormones

ALTERNATIVES:
- Homéopathie: Nux vomica, Ipeca
- Acupuncture
- Hypnose
- Vitamine B6 seule (25mg 3x/jour)

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Prurit gravidique simple',
    categorie: 'Grossesse',
    description: 'Démangeaisons cutanées grossesse',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. ATARAX 25 mg, comprimé
   Posologie: 1 comprimé le soir au coucher
   Durée: selon besoin (maximum 1 mois)
   ⚠️ Somnolence possible

2. DEXERYL, crème émolliente, tube 250g
   Application: 2-3 fois par jour sur zones sèches
   Corps entier si besoin

3. Si échec:
   POLARAMINE 2 mg, comprimé
   Posologie: 1 comprimé 2 fois par jour
   Durée: 7 jours

SOINS LOCAUX:

TOILETTE:
- Douche tiède (pas chaude)
- Savon surgras, sans parfum
- Séchage tamponnant doux
- Éviter frictions

HYDRATATION CUTANÉE:
- Crème émolliente 2-3x/jour
- Sur peau légèrement humide (meilleure pénétration)
- Insister zones sèches: ventre, cuisses, seins

ÉVITER:
- Bains chauds prolongés (dessèchent)
- Savons parfumés, gels douche
- Vêtements synthétiques serrés
- Grattage (aggrave, risque infection)
- Chaleur excessive

SOULAGEMENT:

FROID:
- Compresses fraîches sur zones prurigineuses
- Ventilateur
- Brumisateur eau thermale

VÊTEMENTS:
- Coton, lin (matières naturelles)
- Amples, aérés
- Éviter laine directement sur peau

ENVIRONNEMENT:
- Chambre fraîche (18-19°C)
- Humidificateur si air sec
- Ongles courts (éviter lésions grattage)

SURVEILLANCE CHOLESTASE:

⚠️ CONSULTER RAPIDEMENT SI:
- Prurit intense palmes mains/plantes pieds
- Absence éruption cutanée
- Prurit nocturne prédominant
- Urines foncées
- Selles décolorées
- Jaunisse (ictère)
→ Rechercher cholestase gravidique (bilan hépatique urgent)

PRURIT SIMPLE:
- Fréquent 2ème-3ème trimestre
- Dû distension peau + hormones
- Pas de danger si bilan normal
- Amélioration après accouchement

BILAN SI PERSISTANCE:
- Transaminases (ASAT, ALAT)
- Bili rubine
- Acides biliaires
- Exclure cholestase

ALTERNATIVES:
- Avoine colloïdale bains
- Huile amande douce
- Gel aloe vera frais

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Carence en vitamine D',
    categorie: 'Grossesse',
    description: 'Supplémentation vitamine D renforcée',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. UVÉDOSE 100 000 UI, solution buvable
   Posologie: 1 ampoule IMMÉDIATEMENT (dose de charge)

2. ZYMAD 10 000 UI/ml, solution buvable
   Posologie: 10 gouttes par jour (1000 UI)
   Durée: Pendant toute la grossesse et 3 mois post-partum

POURQUOI VITAMINE D EN GROSSESSE:

POUR LA MÈRE:
- Santé osseuse
- Immunité
- Prévention diabète gestationnel
- Prévention pré-éclampsie
- Meilleure tonus musculaire

POUR LE BÉBÉ:
- Développement osseux fœtal
- Minéralisation squelette
- Croissance optimale
- Prévention rachitisme néonatal
- Développement système immunitaire

FACTEURS DE RISQUE CARENCE:
- Peau foncée (mélanine filtre UV)
- Peu exposition soleil
- Port voile intégral
- Obésité
- Alimentation pauvre poisson
- Hiver (peu de soleil)
- Vie urbaine (pollution)

APPORTS RECOMMANDÉS GROSSESSE:
- Besoins: 1000-1500 UI/jour
- Uvédose: rattrapage initial
- Zymad: entretien quotidien

SOURCES ALIMENTAIRES (complément):
- Poissons gras: saumon, maquereau, sardines
- Jaune d'œuf
- Produits laitiers enrichis
- Champignons
- Huile foie de morue

EXPOSITION SOLAIRE:
- 15-20 min/jour bras et visage
- Entre 11h-15h (été)
- Sans écran solaire (vitamine D)
- Attention coups de soleil

MODE D'EMPLOI ZYMAD:
- Directement dans bouche OU
- Dilué dans peu d'eau, compote
- Même heure chaque jour (routine)
- Ne pas oublier (essentiel)

CONTRÔLE BIOLOGIQUE:
- Dosage 25-OH vitamine D
- Si < 30 ng/ml: carence
- Objectif grossesse: 30-50 ng/ml
- Recontrôle à 3 mois si carence sévère initiale

SURDOSAGE:
- Impossible aux doses prescrites
- Toxicité seulement > 10 000 UI/jour sur long terme
- 1000 UI/jour: totalement sûr

APRÈS ACCOUCHEMENT:
- Continuer Zymad 3 mois
- Passe dans lait maternel
- Bébé aura supplément propre en plus

BÉBÉ:
- Supplémentation systématique à la naissance
- Zymad ou Adrigyl jusqu'à 18 mois minimum
- Même si allaitement + prise maman

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Mastose / Tension mammaire',
    categorie: 'Gynécologie',
    description: 'Douleurs seins cycliques',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. ALLAITER 10 mg, gélule
   Posologie: 1 gélule par jour du J16 au J5 du cycle
   Durée: 3 cycles minimum

2. ONAGRE 500 mg, capsule
   Posologie: 2 capsules par jour
   Durée: 3 mois

EXPLICATIONS:
- Mastose = sensibilité/douleur seins
- Liée hormones (œstrogènes/progestérone)
- Accentuée 2ème partie cycle
- Très fréquente (70% femmes)
- Bénin (pas de cancer)

SYMPTÔMES:
- Seins tendus, gonflés
- Douleur augmentant avant règles
- Sensibilité au toucher
- Amélioration après règles
- Possible petits kystes palpables

CONSEILS:

SOUTIEN-GORGE:
- Bien ajusté, bonnets adaptés
- Maintien même la nuit si très douloureux
- Sans armatures
- Coton (respirant)

ALIMENTATION:
- Réduire caféine (café, thé, coca, chocolat)
- Réduire sel (rétention eau)
- Augmenter oméga-3: poissons gras
- Vitamine E naturelle: amandes, avocat

ACTIVITÉ PHYSIQUE:
- Sport régulier (réduit œstrogènes)
- Bien maintenir seins (brassière sport)

APPLICATION LOCALE:
- Froid si douleur aiguë
- Massage doux huile onagre

ÉVITER:
- Contraception fortement dosée œstrogènes
- Tabac (aggrave)
- Stress (majore symptômes)

SUIVI:
- Autopalpation mensuelle
- Échographie si nodule persistant
- Mammographie selon âge (> 40 ans)

EXAMENS COMPLÉMENTAIRES SI BESOIN:
- Échographie mammaire (rassure)
- Différencier kyste simple / fibroadénome
- Surveillance simple si bénin

QUAND CONSULTER:
- Douleur unilatérale persistante
- Écoulement mamelon
- Rétraction mamelon
- Peau d'orange
- Nodule dur, fixé, indolore
- Adénopathie axillaire

ALTERNATIVES:
- Gattilier (plante)
- Progestérone locale gel
- Acupuncture
- Homéopathie: Folliculinum, Thuya

ÉVOLUTION:
- Amélioration souvent avec traitements
- Disparition après ménopause
- Grossesse améliore souvent

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Mycose récidivante (hors grossesse)',
    categorie: 'Gynécologie',
    description: 'Traitement mycoses vulvo-vaginales répétées',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. TRAITEMENT ATTAQUE:
   MONAZOL LP 1200 mg, ovule
   Posologie: 1 ovule en dose unique intravaginal

   + MONAZOL 2%, crème cutanée
   Posologie: 2 applications/jour sur vulve
   Durée: 7 jours

2. TRAITEMENT PRÉVENTIF RÉCIDIVES:
   FLUCONAZOLE 150 mg, gélule
   Posologie: 1 gélule
   Fréquence: 1 fois par semaine pendant 6 mois

3. PROBIOTIQUES VAGINAUX
   Posologie: 1 capsule intravaginale le soir
   Fréquence: 1 fois par semaine
   Durée: 3 mois

RECHERCHER FACTEURS FAVORISANTS:

DIABÈTE:
- Glycémie à jeun à faire
- HbA1c si diabète connu
- Équilibrer diabète

CONTRACEPTION:
- Pilule fortement dosée œstrogènes
- Envisager changement

ANTIBIOTIQUES RÉPÉTÉS:
- Déséquilibrent flore vaginale
- Probiotiques après chaque cure

PARTENAIRE:
- Traiter systématiquement (crème)
- Porteur sain fréquent
- Sinon réinfection perpétuelle

MESURES PRÉVENTIVES:

HYGIÈNE INTIME:
- Toilette externe uniquement (JAMAIS douche vaginale)
- 1 fois par jour maximum
- Savon doux pH physiologique
- D'avant en arrière
- Séchage soigneux

VÊTEMENTS:
- Sous-vêtements coton 100%
- Changer quotidiennement
- Laver 60°C
- Éviter strings
- Pantalons amples (pas de jeans serrés)

APRÈS SPORT/PISCINE:
- Retirer maillot humide rapidement
- Douche et séchage immédiat

ÉVITER:
- Protège-slips quotidiens
- Tampons parfumés
- Déodorants intimes
- Bains moussants
- Lingettes intimes

ALIMENTATION:
- Réduire sucres rapides
- Yaourts probiotiques quotidiens
- Éviter alcool excès

RAPPORTS:
- Lubrification suffisante
- Préservatif si partner non traité
- Miction + toilette après

SI ÉCHEC TRAITEMENT PRÉVENTIF:
- Prélèvement mycologique (identification levure)
- Recherche Candida non-albicans (+ résistant)
- Avis spécialiste
- Traitement prolongé adapté

ALTERNATIVES:
- Ovules ail (naturel antifongique)
- Probiotiques oraux spécifiques
- Acide borique capsules (hors AMM)

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Syndrome prémenstruel',
    categorie: 'Gynécologie',
    description: 'Prise en charge SPM',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. GATTILIER 20 mg, comprimé
   Posologie: 1 comprimé par jour le matin
   Durée: 3 cycles minimum (évaluation efficacité)

2. MAGNÉSIUM MARIN + B6, comprimé
   Posologie: 2 comprimés par jour
   Durée: 3 mois

3. Si douleurs importantes:
   PARACÉTAMOL 1 g
   ou IBUPROFÈNE 400 mg
   Selon besoin

SYMPTÔMES SPM (7-10 jours avant règles):

PHYSIQUES:
- Tension mammaire
- Ballonnements abdominaux
- Prise poids (rétention eau)
- Fatigue
- Maux de tête
- Acné
- Troubles sommeil

PSYCHOLOGIQUES:
- Irritabilité
- Anxiété
- Tristesse
- Sautes humeur
- Difficultés concentration
- Envies alimentaires (sucre)

MESURES HYGIÉNO-DIÉTÉTIQUES:

ALIMENTATION:
- Réduire sel (rétention eau)
- Réduire caféine (anxiété)
- Réduire sucres rapides
- Augmenter protéines
- Calcium: produits laitiers
- Oméga-3: poissons gras
- Vitamine B6: banane, lentilles
- Fractionner repas (5-6/jour)

ACTIVITÉ PHYSIQUE:
- 30 min/jour minimum
- Libère endorphines (humeur)
- Réduit rétention eau
- Yoga, stretching (détente)

GESTION STRESS:
- Relaxation, méditation
- Sommeil régulier (8h)
- Éviter surmenage en 2ème partie cycle

PLANTES:
- Gattilier (vitex agnus-castus)
- Onagre
- Bourrache
- Safran

SUPPLÉMENTS:
- Magnésium 300-400 mg/jour
- Vitamine B6 50-100 mg/jour
- Vitamine E 400 UI/jour
- Calcium 1000-1200 mg/jour

SUIVI SYMPTÔMES:
- Calendrier mensuel
- Noter intensité 0-10
- Identifier patterns
- Anticiper période difficile

OPTIONS SI ÉCHEC:

CONTRACEPTION:
- Pilule continue (sans arrêt 7j)
- DIU Mirena (réduit règles)
- Progestatifs 2ème partie cycle

ANTIDÉPRESSEURS:
- ISRS (si forme sévère = TDPM)
- Fluoxétine 20 mg
- Seulement 2ème partie cycle possible

QUAND ENVISAGER TRAITEMENT HORMONAL:
- SPM sévère handicapant
- Échec mesures naturelles
- Impact vie quotidienne
- Absentéisme

DIAGNOSTIC DIFFÉRENTIEL:
- Dépression/anxiété généralisée
- Troubles thyroïde
- Endométriose
- Anémie

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Dysménorrhée primaire',
    categorie: 'Gynécologie',
    description: 'Douleurs règles sans pathologie',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. IBUPROFÈNE 400 mg, comprimé
   Posologie: 1 comprimé 3 fois par jour PENDANT les règles
   Durée: 2-3 jours (durée douleurs)
   ⚠️ À PRENDRE DÈS DÉBUT RÈGLES (plus efficace)
   ⚠️ Avec aliments (protection estomac)

2. Si insuffisant, associer:
   SPASFON 80 mg, comprimé
   Posologie: 2 comprimés 3 fois par jour
   Durée: pendant douleurs

3. Alternative:
   CONTRACEPTION ŒSTROPROGESTATIVE continue
   (supprime règles = supprime douleurs)

EXPLICATIONS:

MÉCANISME:
- Prostaglandines (substances inflammatoires)
- Provoquent contractions utérines intenses
- Douleurs pelviennes, lombaires, cuisses

CARACTÉRISTIQUES:
- Débute avec règles
- Maximum J1-J2
- Crampes pelviennes
- Irradiation lombaire/cuisses
- Souvent nausées, diarrhée associées

TRAITEMENT NON MÉDICAMENTEUX:

CHALEUR LOCALE:
- Bouillotte abdomen
- Bain chaud
- Patch chauffant
- Améliore circulation, détend muscles

ACTIVITÉ PHYSIQUE:
- Marche, yoga
- Libère endorphines (antidouleur naturel)
- Améliore circulation pelvienne

ALIMENTATION:
- Oméga-3: anti-inflammatoires naturels (poissons gras)
- Magnésium: détend muscles
- Éviter caféine, alcool (augmentent douleur)

PLANTES:
- Gingembre: anti-inflammatoire
- Camomille: antispasmodique
- Achillée millefeuille
- Matricaire

TECHNIQUES:
- Respiration profonde
- Électrostimulation (TENS)
- Acupuncture
- Ostéopathie

TIMING TRAITEMENT:

⚠️ PRENDRE DÈS APPARITION RÈGLES:
- Efficacité maximale si prise préventive
- Bloque production prostaglandines
- Attendre d'avoir mal = moins efficace

CONTRACEPTION SOLUTION EFFICACE:
- Pilule continue (sans arrêt 7j)
- = Pas de règles = Pas de douleurs
- Efficacité 90%
- Option si douleurs handicapantes

QUAND CONSULTER:

⚠️ RECHERCHER ENDOMÉTRIOSE SI:
- Douleurs augmentent avec temps
- Apparition tardive (après 25 ans)
- Douleurs entre règles aussi
- Dyspareunie (douleur rapports)
- Troubles digestifs cycliques
- Infertilité
→ Échographie pelvienne + Avis gynéco

DYSMÉNORRHÉE SECONDAIRE:
- Fibrome
- Polype
- DIU cuivre
- Infection
→ Examens complémentaires

SURVEILLANCE:
- Si AINS insuffisants malgré bonne prise
- Si retentissement vie quotidienne
- Absentéisme scolaire/professionnel
→ Explorations

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Carence en magnésium',
    categorie: 'Gynécologie',
    description: 'Fatigue, crampes, irritabilité',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MAGNÉSIUM MARIN 300 mg + B6, comprimé
   Posologie: 2 comprimés par jour (matin et soir)
   Durée: 3 mois

2. Si crampes importantes:
   MAGNÉ B6, comprimé
   Posologie: 3 comprimés par jour
   Durée: 1 mois

SYMPTÔMES CARENCE MAGNÉSIUM:

MUSCULAIRES:
- Crampes (mollets, pieds)
- Fourmillements
- Paupière qui saute
- Tensions musculaires
- Tremblements

NERVEUX:
- Fatigue chronique
- Irritabilité
- Anxiété
- Troubles sommeil
- Difficultés concentration
- Stress ressenti +++

AUTRES:
- Maux tête
- Palpitations
- Constipation
- Syndrome prémenstruel marqué

CAUSES CARENCE:

APPORTS INSUFFISANTS:
- Alimentation raffinée
- Eau peu minéralisée

BESOINS AUGMENTÉS:
- Grossesse, allaitement
- Sport intensif
- Stress chronique
- Croissance

PERTES AUGMENTÉES:
- Diarrhées
- Alcool
- Médicaments (diurétiques, IPP)
- Diabète

ALIMENTATION RICHE MAGNÉSIUM:

SOURCES PRINCIPALES:
- Chocolat noir (70% minimum)
- Oléagineux: amandes, noix, noisettes
- Légumineuses: lentilles, pois chiches
- Céréales complètes: pain complet, riz complet
- Banane
- Épinards, blettes
- Fruits de mer
- Eaux minérales: Hépar, Contrex, Badoit

APPORTS QUOTIDIENS:
- Femmes: 300-360 mg/jour
- Grossesse/allaitement: 400 mg/jour
- Sport: 400-500 mg/jour

FORMES MAGNÉSIUM:

MEILLEURE ABSORPTION:
- Bisglycinate (très bien toléré)
- Citrate (bon rapport qualité/prix)
- Marin (naturel, bien assimilé)
- Malate

ÉVITER:
- Oxyde de magnésium (mal absorbé)
- Chlorure (laxatif)

VITAMINE B6:
- Améliore absorption magnésium
- Synergie d'action
- Toujours associée

MODE D'EMPLOI:

MOMENT PRISE:
- Matin ET soir (meilleure répartition)
- Avec repas (meilleure tolérance)
- Éloigner du calcium (compétition absorption)

DURÉE TRAITEMENT:
- 3 mois minimum
- Renouveler si besoin
- Cures répétées possibles

EFFETS:
- Amélioration sous 3-4 semaines
- Crampes: amélioration rapide (7-10j)
- Nervosité: 2-3 semaines
- Fatigue: 1 mois

EFFETS SECONDAIRES RARES:
- Diarrhée si surdosage
- Réduire dose si troubles digestifs

SURVEILLANCE:
- Magnésémie peu fiable (pas dans sang)
- Clinique: amélioration symptômes

CONTRE-INDICATIONS:
- Insuffisance rénale sévère
- Bloc cardiaque
- Myasthénie

ASSOCIATIONS:
- Souvent associé: Vitamine D, Oméga-3
- Synergie bénéfique

PRÉVENTION:
- Alimentation variée
- Gestion stress
- Sommeil régulier
- Limiter café, alcool
- Activité physique modérée

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Troubles du cycle (spanioménorrhée)',
    categorie: 'Gynécologie',
    description: 'Cycles irréguliers/espacés sans SOPK',
    medicaments: [],
    contenu: `MÉDICAMENTS PRESCRITS:

1. DUPHASTON 10 mg, comprimé
   Posologie: 2 comprimés par jour du J16 au J25 du cycle
   Durée: 3 cycles
   (régularisation cycles)

2. GATTILIER 20 mg, comprimé
   Posologie: 1 comprimé par jour le matin
   Durée: 3 mois minimum

EXPLICATIONS:

SPANIOMÉNORRHÉE:
- Cycles espacés > 35 jours
- Règles peu fréquentes (< 8/an)
- Pas pathologique si cycles réguliers entre eux

CAUSES POSSIBLES:
- Période puberté (adaptation)
- Pré-ménopause (> 40 ans)
- Post-pilule (retour à cycles naturels)
- Stress important
- Perte poids importante
- Sport intensif
- Allaitement
- SOPK (à éliminer)
- Hyperprolactinémie
- Troubles thyroïde

BILAN RÉALISÉ OU À FAIRE:

EXAMENS SANGUINS:
- FSH, LH, Œstradiol
- Prolactine
- TSH
- Testostérone, Delta-4-androstènedione (si signes hyperandrogénie)
- Progestérone J21 (si ovulation)

ÉCHOGRAPHIE PELVIENNE:
- Éliminer SOPK
- Évaluer endomètre
- Aspect ovaires

TRAITEMENT PROGESTATIF (Duphaston):

OBJECTIF:
- Déclencher règles régulières
- Protéger endomètre (éviter hyperplasie)
- Prévenir cancer endomètre à long terme

FONCTIONNEMENT:
- Progestérone artificielle
- Imite 2ème partie cycle normal
- Règles 2-3 jours après arrêt
- Pas de contraception

GATTILIER:

MÉCANISME:
- Plante régulatrice hormonale
- Agit sur hypophyse
- Régularise cycles
- Réduit prolactine si élevée

EFFICACITÉ:
- Délai 2-3 mois
- Cycles plus réguliers
- Syndrome prémenstruel amélioré

CONSEILS HYGIÉNO-DIÉTÉTIQUES:

POIDS:
- IMC normal important (18,5-25)
- Perte poids si surpoids (améliore ovulation)
- Reprise poids si maigreur (< 18,5)

ACTIVITÉ PHYSIQUE:
- Modérée (pas excessive)
- Excès sport bloque ovulation

STRESS:
- Gestion stress essentielle
- Relaxation, yoga
- Sommeil régulier

ALIMENTATION:
- Équilibrée
- Éviter régimes restrictifs
- Oméga-3, antioxydants

TABAC / ALCOOL:
- Arrêt tabac (perturbe cycles)
- Alcool modération

CONTRACEPTION SI BESOIN:
- Si pas désir grossesse
- Pilule régularise cycles
- Efficacité immédiate
- Option à discuter

SURVEILLANCE:

TENIR CALENDRIER MENSTRUEL:
- Noter J1 de chaque règles
- Calculer longueur cycles
- Noter symptômes

CONSULTER SI:
- Aménorrhée > 3 mois
- Saignements entre règles
- Douleurs pelviennes
- Pilosité excessive augmentée
- Acné importante
- Prise poids inexpliquée
- Galactorrhée (écoulement lait seins)

PROJET GROSSESSE:
- Cycles irréguliers = ovulation irrégulière
- Difficulté prévoir période fertile
- Tests ovulation utiles
- Patience (grossesse possible)
- Avis spécialisé si > 1 an essais

Ordonnance valable {{dureeValidite}} jours.`
  },

  // ========== TEMPLATES GYNÉCOLOGIE ==========

  // Dysménorrhées
  {
    nom: 'Dysménorrhée primaire',
    categorie: 'Gynécologie',
    description: 'Traitement des règles douloureuses',
    medicaments: [
      {
        medicamentId: 'IBUPROFÈNE',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. IBUPROFÈNE 400 mg, comprimé
   Posologie: 1 comprimé jusqu'à 3 fois par jour pendant les règles
   Durée: 5 jours par cycle (à renouveler)

RECOMMANDATIONS:
- Débuter le traitement dès les premiers signes de règles
- Prendre pendant les repas pour limiter les troubles digestifs
- Antécédent ulcère : contre-indiqué
- Efficacité maximale si prise préventive (avant douleur intense)

MESURES NON MÉDICAMENTEUSES:
- Chaleur locale (bouillotte)
- Activité physique régulière
- Éviter stress et tabac
- Repos si nécessaire

CONSULTER SI:
- Douleurs ne cédant pas au traitement
- Douleurs s'aggravant progressivement
- Douleurs apparaissant en dehors des règles
- Saignements abondants
- Douleurs lors des rapports sexuels
→ Bilan pour éliminer endométriose

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Dysménorrhée sévère',
    categorie: 'Gynécologie',
    description: 'Traitement des règles très douloureuses + pilule',
    medicaments: [
      {
        medicamentId: 'ANTADYS',
        personnalise: false
      },
      {
        medicamentId: 'LEELOO Gé',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. ANTADYS 100 mg, comprimé
   Posologie: 1 comprimé jusqu'à 4 fois par jour pendant les règles
   Durée: 3 à 5 jours par cycle

2. LEELOO Gé (Lévonorgestrel 100 µg + Éthinylestradiol 20 µg)
   Posologie: 1 comprimé par jour à heure fixe pendant 21 jours, puis 7 jours d'arrêt
   Durée: 3 mois (3 plaquettes)

   Début: 1er jour des règles
   Ne pas oublier de comprimé (efficacité contraceptive)

RECOMMANDATIONS PILULE:
- Contraception efficace dès le 1er jour si démarrage J1
- Prise quotidienne à heure fixe (alarme conseillée)
- En cas d'oubli < 12h: prendre immédiatement et poursuivre normalement
- En cas d'oubli > 12h: préservatif pendant 7 jours
- Vomissements/diarrhée dans les 4h après prise = oubli
- Arrêt tabac impératif après 35 ans
- Consultation de contrôle dans 3 mois

CONTRE-INDICATIONS PILULE:
- Antécédent phlébite/embolie
- Migraine avec aura
- Tabac > 35 ans
- HTA non contrôlée
- Diabète avec complications
- Cancer sein/utérus

CONSULTER EN URGENCE SI:
- Douleur thoracique
- Essoufflement brutal
- Maux de tête intenses inhabituels
- Troubles visuels
- Douleur mollet
- Douleur abdominale intense

Ordonnance valable {{dureeValidite}} jours.`
  },

  // Saignements abondants
  {
    nom: 'Ménorragies',
    categorie: 'Gynécologie',
    description: 'Traitement des saignements menstruels abondants',
    medicaments: [
      {
        medicamentId: 'EXACYL',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. EXACYL 500 mg (Acide tranexamique), comprimé
   Posologie: 2 comprimés 3 fois par jour pendant les règles
   Durée: 3 à 5 jours par cycle (à renouveler)

RECOMMANDATIONS:
- Débuter au début des règles
- Prendre pendant ou après les repas
- Bien s'hydrater
- Durée maximale: 5 jours par cycle
- Pas de contraception estroprogestative en parallèle (risque thrombose)

BILAN À PRÉVOIR:
□ NFS (recherche anémie)
□ Échographie pelvienne
□ Frottis cervico-vaginal si non à jour

SIGNES D'ANÉMIE:
- Fatigue importante
- Essoufflement à l'effort
- Pâleur
- Vertiges
→ Consultation rapide pour bilan

CONSULTER SI:
- Saignements ne diminuant pas malgré traitement
- Saignements entre les règles
- Douleurs pelviennes
- Fièvre
- Pertes malodorantes
- Cycles > 7 jours de saignements

ÉDUCATION:
- Noter durée et abondance des cycles
- Compter nombre de protections/jour
- Un cycle normal: 3-7 jours, < 80ml de perte

Ordonnance valable {{dureeValidite}} jours.`
  },

  // Aménorrhée
  {
    nom: 'Bilan aménorrhée',
    categorie: 'Gynécologie',
    description: 'Prescription bilan pour absence de règles',
    medicaments: [],
    contenu: `EXAMENS PRESCRITS:

BIOLOGIE - À réaliser à jeun:
□ β-HCG plasmatique (test de grossesse)
□ FSH, LH
□ Prolactine
□ TSH
□ Testostérone totale

IMAGERIE:
□ Échographie pelvienne

OBJECTIFS DU BILAN:
- Éliminer une grossesse
- Rechercher cause hormonale
- Évaluer fonction ovarienne
- Dépister SOPK (syndrome ovaires polykystiques)
- Éliminer hyperprolactinémie

QUAND RÉALISER:
- Biologie: à jeun, matin si possible
- Échographie: en dehors des règles (si elles reviennent)

APPORTER À LA CONSULTATION DE RÉSULTATS:
- Courbe de température sur 2 cycles (si règles irrégulières)
- Calendrier menstruel des 6 derniers mois
- Liste médicaments en cours

SITUATIONS À SURVEILLER:
- Perte de poids importante récente
- Stress intense
- Sport intensif
- Modification traitement
- Symptômes associés (céphalées, galactorrhée, troubles vision)

CONSULTER RAPIDEMENT SI:
- Saignements abondants brutaux
- Douleurs pelviennes intenses
- Fièvre
- Troubles visuels
- Céphalées intenses

Ordonnance valable {{dureeValidite}} jours.`
  },

  // Dyspareunies
  {
    nom: 'Dyspareunie - Sécheresse vaginale',
    categorie: 'Gynécologie',
    description: 'Traitement des douleurs pendant les rapports',
    medicaments: [
      {
        medicamentId: 'MUCOGYNE',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MUCOGYNE gel vaginal (Acide hyaluronique)
   Posologie: 1 application vaginale 2 fois par semaine
   Durée: 1 mois (renouvelable)

   Mode d'application:
   - Le soir au coucher
   - Position allongée
   - Introduire canule en intra-vaginal
   - Presser pour libérer le gel

RECOMMANDATIONS:
- Utiliser également avant rapports sexuels si besoin
- Peut être utilisé au long cours
- Compatible avec préservatifs
- Pas d'effet contraceptif
- Amélioration progressive sur plusieurs semaines

MESURES COMPLÉMENTAIRES:
- Utiliser lubrifiant à base d'eau lors des rapports
- Privilégier préliminaires prolongés
- Communication avec partenaire essentielle
- Éviter savons agressifs (toilette intime pH neutre)
- Sous-vêtements coton
- Hydratation suffisante

CAUSES POSSIBLES À EXPLORER:
- Post-partum / allaitement (hypœstrogénie)
- Ménopause / préménopause
- Pilule microprogestative
- Stress / anxiété
- Antécédents traumatiques
- Infection (à éliminer)
- Endométriose
- Vaginisme

CONSULTER SI:
- Pas d'amélioration après 2 mois
- Apparition pertes anormales
- Démangeaisons
- Saignements après rapports
- Douleurs pelviennes en dehors rapports
→ Examen gynécologique nécessaire

PRISE EN CHARGE GLOBALE:
- Consultation sexologue si composante psychologique
- Kinésithérapie périnéale parfois utile
- Relaxation / yoga
- Ostéopathie dans certains cas

Ordonnance valable {{dureeValidite}} jours.`
  },

  // IST - Chlamydia
  {
    nom: 'Traitement Chlamydia',
    categorie: 'Gynécologie',
    description: 'Antibiothérapie pour infection à Chlamydia',
    medicaments: [
      {
        medicamentId: 'AZITHROMYCINE',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. AZITHROMYCINE 1 g, comprimé
   Posologie: 2 comprimés en prise unique
   Durée: Dose unique

   À prendre:
   - À jeun (1h avant ou 2h après repas)
   - Avec un grand verre d'eau
   - En une seule fois

RECOMMANDATIONS IMPORTANTES:

TRAITEMENT PARTENAIRE(S):
⚠️ OBLIGATOIRE - Traitement simultané de tous les partenaires des 2 derniers mois
- Même traitement (Azithromycine 1g dose unique)
- Ordonnance pour le partenaire fournie
- Pas de rapports avant guérison complète

ABSTINENCE SEXUELLE:
- 7 jours après prise du traitement
- Ou utilisation préservatif systématique pendant 7 jours
- Risque de réinfection si partenaire non traité

CONTRÔLE:
- Test de contrôle 3-4 semaines après traitement
- Obligatoire pour confirmer guérison
- Prélèvement vaginal + recherche Chlamydia PCR

DÉPISTAGE AUTRES IST:
□ Sérologies VIH, VHB, VHC, Syphilis
□ Prélèvement vaginal complet (autres germes)
□ Examen gynécologique

COMPLICATIONS SI NON TRAITÉ:
- Salpingite (infection trompes)
- Infertilité
- Grossesse extra-utérine
- Douleurs pelviennes chroniques
- Transmission au nouveau-né (si grossesse)

CONSULTER EN URGENCE SI:
- Fièvre > 38°C
- Douleurs pelviennes intenses
- Saignements abondants
- Nausées/vomissements
- Douleurs lors des rapports

PRÉVENTION:
- Préservatif systématique avec nouveau partenaire
- Dépistage régulier si partenaires multiples
- Dépistage avant grossesse
- Information partenaires

DÉCLARATION:
- Infection à déclaration obligatoire
- Contact tracing recommandé
- Centre de dépistage gratuit disponible

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Traitement Chlamydia (alternative)',
    categorie: 'Gynécologie',
    description: 'Antibiothérapie alternative pour Chlamydia',
    medicaments: [
      {
        medicamentId: 'DOXYCYCLINE',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. DOXYCYCLINE 100 mg, comprimé
   Posologie: 1 comprimé 2 fois par jour
   Durée: 7 jours

RECOMMANDATIONS:
- Prendre pendant les repas
- Position debout/assise (risque ulcération œsophage)
- Boire un grand verre d'eau
- Ne pas s'allonger dans l'heure suivant la prise
- Photosensibilisation: éviter exposition soleil/UV

TRAITEMENT PARTENAIRE(S):
⚠️ OBLIGATOIRE - Traitement simultané
- Même schéma thérapeutique
- Abstinence 7 jours ou préservatif

CONTRE-INDICATIONS:
- Grossesse et allaitement (contre-indiqué)
- Enfant < 8 ans
- Allergie cyclines

CONTRÔLE:
- Test 3-4 semaines après fin traitement
- Dépistage autres IST
- Examen gynécologique

Ordonnance valable {{dureeValidite}} jours.`
  },

  // Vaginose bactérienne
  {
    nom: 'Vaginose bactérienne',
    categorie: 'Gynécologie',
    description: 'Traitement de la vaginose par Métronidazole',
    medicaments: [
      {
        medicamentId: 'MÉTRONIDAZOLE',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MÉTRONIDAZOLE 500 mg, comprimé
   Posologie: 1 comprimé 2 fois par jour
   Durée: 7 jours

RECOMMANDATIONS IMPORTANTES:

ALCOOL STRICTEMENT INTERDIT:
⚠️ Pendant le traitement + 48h après dernière prise
- Risque: effet Antabuse (nausées, vomissements, malaise)
- Concerne: vin, bière, spiritueux, médicaments contenant alcool

PRISE DU TRAITEMENT:
- Pendant ou après les repas
- Avec un grand verre d'eau
- Respecter horaires (matin et soir)
- Ne pas arrêter même si amélioration rapide

EFFETS SECONDAIRES POSSIBLES:
- Goût métallique dans bouche (fréquent, bénin)
- Nausées légères
- Urines foncées (normal)
- Langue chargée

HYGIÈNE:
- Toilette intime 1 fois/jour maximum
- Savon doux pH neutre ou surgras
- Éviter douches vaginales
- Sous-vêtements coton
- Sécher soigneusement
- Pas de protège-slips quotidiens

RAPPORTS SEXUELS:
- Possibles mais préservatif recommandé
- Pas de traitement systématique du partenaire sauf si:
  * Symptômes chez l'homme
  * Récidives fréquentes

GROSSESSE:
- Compatible avec grossesse
- Éviter 1er trimestre si possible

RÉCIDIVES:
Si vaginose récidivante (> 3 épisodes/an):
- Probiotiques vaginaux après traitement
- Rechercher facteurs favorisants:
  * Tabac
  * Stérilet cuivre
  * Douches vaginales
  * Changements fréquents partenaires
  * Stress

CONSULTER SI:
- Pas d'amélioration après 48-72h
- Apparition fièvre
- Douleurs pelviennes
- Saignements anormaux
- Symptômes s'aggravant

DIFFÉRENCE MYCOSE/VAGINOSE:
Vaginose:
- Pertes liquides grisâtres
- Odeur "poisson pourri"
- Pas de démangeaisons intenses
- pH vaginal > 4,5

Mycose:
- Pertes épaisses blanches "lait caillé"
- Démangeaisons ++
- Brûlures
- pH vaginal normal

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Vaginose bactérienne (traitement local)',
    categorie: 'Gynécologie',
    description: 'Traitement local de la vaginose',
    medicaments: [
      {
        medicamentId: 'FLAGYL ovule',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. FLAGYL ovule 500 mg (Métronidazole)
   Posologie: 1 ovule le soir au coucher
   Durée: 7 jours

MODE D'EMPLOI:
- Introduire profondément dans le vagin
- Le soir au coucher, position allongée
- Peut fondre et s'écouler: protège-slip possible
- Ne pas utiliser pendant les règles

RECOMMANDATIONS:
- Hygiène intime douce (savon pH neutre)
- Sous-vêtements coton
- Éviter douches vaginales
- Pas d'alcool pendant traitement

AVANTAGES TRAITEMENT LOCAL:
- Moins d'effets secondaires généraux
- Pas de goût métallique
- Concentration locale élevée
- Peut être utilisé pendant grossesse (hors T1)

RAPPORTS SEXUELS:
- Préservatif recommandé pendant traitement
- Attendre fin traitement pour rapports sans protection

RÉCIDIVES:
- Probiotiques vaginaux après traitement
- Correction facteurs favorisants

CONSULTER SI:
- Pas d'amélioration après 72h
- Irritation locale importante
- Apparition nouveaux symptômes

Ordonnance valable {{dureeValidite}} jours.`
  },

  // Mycose vulvo-vaginale
  {
    nom: 'Mycose vulvo-vaginale',
    categorie: 'Gynécologie',
    description: 'Traitement antifongique local',
    medicaments: [
      {
        medicamentId: 'MYCOHYDRALIN',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. MYCOHYDRALIN 150 mg, ovule (Éconazole)
   Posologie: 1 ovule le soir au coucher
   Durée: 3 jours (3 ovules)

2. MYCOHYDRALIN crème (Éconazole)
   Posologie: Application locale 2 fois par jour
   Durée: 7 jours

   Application:
   - Vulve et région péri-anale
   - Après toilette et séchage soigneux
   - Matin et soir

MODE D'EMPLOI OVULE:
- Introduire profondément dans le vagin
- Le soir au coucher, position allongée
- Protection hygiénique légère (écoulement possible)
- Possible pendant règles

RECOMMANDATIONS HYGIÈNE:

TOILETTE INTIME:
- 1 fois/jour maximum (pas plus!)
- Savon surgras ou pH neutre
- Eau tiède
- Séchage soigneux par tamponnement
- Éviter gant de toilette (macération)

VÊTEMENTS:
- Sous-vêtements coton 100%
- Éviter synthétiques, strings
- Pantalons pas trop serrés
- Changer quotidiennement sous-vêtements
- Lavage 60°C

À ÉVITER:
- Douches vaginales
- Déodorants intimes
- Lingettes parfumées
- Protège-slips quotidiens
- Bains moussants
- Jacuzzi/piscine pendant traitement

RAPPORTS SEXUELS:
- Abstinence pendant traitement recommandée
- Sinon préservatif obligatoire
- Attention: traitement dissout latex (utiliser polyuréthane)
- Peut traiter partenaire si symptômes (balanite):
  → Crème 2 fois/jour pendant 7 jours

FACTEURS FAVORISANTS À CORRIGER:

GÉNÉRAUX:
- Diabète (faire contrôle glycémie si récidives)
- Antibiotiques récents
- Pilule fortement dosée
- Immunodépression
- Grossesse
- Stress

LOCAUX:
- Transpiration excessive
- Sport sans douche immédiate
- Maillot de bain humide prolongé
- Toilette intime excessive
- Savons agressifs

RÉCIDIVES (> 4 épisodes/an):

PRÉVENTION:
- Probiotiques vaginaux (Lactobacilles)
- Probiotiques oraux après antibiotiques
- Régime pauvre sucres rapides
- Vêtements amples, coton
- Sécher soigneusement après toilette
- Traitement préventif 1 ovule/semaine si récidives fréquentes

BILAN SI RÉCIDIVES:
□ Glycémie à jeun (diabète?)
□ Prélèvement vaginal avec culture
□ Recherche autre cause (immunodépression)
□ Avis gynécologique

CONSULTER SI:
- Pas d'amélioration après 72h
- Aggravation symptômes
- Fièvre
- Douleurs pelviennes
- Saignements
- Pertes malodorantes (plutôt vaginose)
- Grossesse en cours ou projet

MYCOSE OU VAGINOSE?

MYCOSE:
- Démangeaisons intenses +++
- Brûlures
- Pertes épaisses blanches "lait caillé"
- Vulve rouge, gonflée
- Pas d'odeur particulière

VAGINOSE:
- Peu de démangeaisons
- Pertes liquides grisâtres
- Odeur "poisson pourri"
- Peu d'inflammation

Ordonnance valable {{dureeValidite}} jours.`
  },
  {
    nom: 'Mycose simple (traitement court)',
    categorie: 'Gynécologie',
    description: 'Traitement antifongique ovule seul',
    medicaments: [
      {
        medicamentId: 'ECONAZOLE BIOGARAN',
        personnalise: false
      }
    ],
    contenu: `MÉDICAMENTS PRESCRITS:

1. ECONAZOLE BIOGARAN 150 mg, ovule
   Posologie: 1 ovule le soir au coucher
   Durée: 3 jours (3 ovules)

MODE D'EMPLOI:
- Introduire profondément dans le vagin
- Le soir au coucher, position allongée
- Protection hygiénique si écoulement
- Traitement possible pendant règles

RECOMMANDATIONS:
- Hygiène intime douce (1 fois/jour max)
- Savon pH neutre
- Sous-vêtements coton
- Séchage soigneux
- Éviter douches vaginales et protège-slips

RAPPORTS SEXUELS:
- Abstinence pendant traitement
- Ou préservatif (attention: ovule dissout latex)

AMÉLIORATION ATTENDUE:
- Dès 24-48h
- Disparition complète en 3-7 jours

PRÉVENTION RÉCIDIVES:
- Correction facteurs favorisants
- Hygiène adaptée (ni trop, ni trop peu)
- Probiotiques si récidives fréquentes

CONSULTER SI:
- Pas d'amélioration 72h
- Récidives fréquentes (> 4/an)
- Grossesse

Ordonnance valable {{dureeValidite}} jours.`
  },

  // ========== ORDONNANCES ÉCHOGRAPHIES ==========

  {
    nom: 'Échographie de datation',
    categorie: 'Échographies grossesse',
    description: 'Échographie précoce de datation (8-11 SA)',
    medicaments: [],
    contenu: `EXAMEN PRESCRIT:

Échographie obstétricale de datation
À réaliser entre 8 et 11 SA (semaines d'aménorrhée)

OBJECTIFS:
- Datation précise de la grossesse
- Mesure de la longueur cranio-caudale (LCC)
- Vérification de la vitalité embryonnaire (activité cardiaque)
- Détection grossesse multiple
- Localisation de la grossesse (intra-utérine)
- Mesure de la clarté nucale si > 11 SA

INFORMATIONS CLINIQUES:
- Date des dernières règles: {{ddr}}
- Terme estimé: {{terme}}
- Antécédents: {{antecedents}}

URGENCE:
[Si saignements, douleurs pelviennes: échographie en urgence]

LIEU:
[Préciser le laboratoire/cabinet d'échographie si souhaité]

À APPORTER À L'ÉCHOGRAPHIE:
- Carte vitale et mutuelle
- Résultats biologiques si disponibles
- Dossier médical/obstétrical

Ordonnance valable {{dureeValidite}} jours.`
  },

  {
    nom: 'Échographie T1',
    categorie: 'Échographies grossesse',
    description: 'Échographie du 1er trimestre (11-13 SA + 6j)',
    medicaments: [],
    contenu: `EXAMEN PRESCRIT:

Échographie obstétricale du 1er trimestre
À réaliser entre 11 SA et 13 SA + 6 jours

OBJECTIFS:
- Datation précise de la grossesse (mesure LCC)
- Mesure de la clarté nucale (dépistage trisomie 21)
- Visualisation de l'os nasal
- Mesure du flux sanguin dans le canal d'Arant
- Détection d'anomalies morphologiques précoces
- Confirmation grossesse unique ou multiple
- Biométries fœtales complètes

DÉPISTAGE TRISOMIE 21:
Cette échographie fait partie du dépistage combiné du 1er trimestre associant:
- Clarté nucale (échographie)
- Dosage sérique β-HCG et PAPP-A (prise de sang)
- Âge maternel

INFORMATIONS CLINIQUES:
- Date des dernières règles: {{ddr}}
- Date prévue d'accouchement: {{dpa}}
- Grossesse: G{{gestite}} P{{parite}}
- Antécédents: {{antecedents}}

À RÉALISER:
□ Prise de sang pour marqueurs sériques (β-HCG, PAPP-A)
  À faire le même jour ou dans les 3 jours suivant l'échographie

À APPORTER À L'ÉCHOGRAPHIE:
- Carte vitale et mutuelle
- Résultats de la prise de sang (marqueurs sériques)
- Bilan biologique T1 si disponible
- Dossier de grossesse

IMPORTANT:
- Vessie semi-pleine (boire 2 verres d'eau 1h avant)
- Prévoir 30-45 minutes pour l'examen
- Consultation de résultats avec compte-rendu détaillé

Ordonnance valable {{dureeValidite}} jours.`
  },

  {
    nom: 'Échographie T2',
    categorie: 'Échographies grossesse',
    description: 'Échographie morphologique du 2ème trimestre (20-25 SA)',
    medicaments: [],
    contenu: `EXAMEN PRESCRIT:

Échographie obstétricale morphologique du 2ème trimestre
À réaliser entre 20 et 25 SA (idéalement 22 SA)

OBJECTIFS:
- Étude morphologique détaillée du fœtus
- Dépistage des malformations
- Biométries fœtales complètes:
  * Diamètre bipariétal (BIP)
  * Périmètre crânien (PC)
  * Périmètre abdominal (PA)
  * Longueur fémorale (LF)
- Estimation du poids fœtal
- Localisation placentaire
- Quantité de liquide amniotique
- Longueur du col utérin
- Sexe du fœtus (si souhaité)

ORGANES ÉTUDIÉS:
- Crâne et cerveau (ventricules, cervelet, citerne magna)
- Face (profil, lèvres, orbites)
- Colonne vertébrale
- Thorax et cœur (4 cavités, gros vaisseaux)
- Abdomen (estomac, reins, vessie, paroi abdominale)
- Membres (os longs, mains, pieds)
- Cordon ombilical (3 vaisseaux)

INFORMATIONS CLINIQUES:
- Date prévue d'accouchement: {{dpa}}
- Terme actuel: {{terme}}
- Grossesse: G{{gestite}} P{{parite}}
- Facteurs de risque: {{facteurs_risque}}
- Antécédents: {{antecedents}}

[Si facteurs de risque particuliers:]
- Diabète: étude cardiaque renforcée
- Antécédent malformation: surveillance ciblée
- Grossesse multiple: biométries comparées

À APPORTER À L'ÉCHOGRAPHIE:
- Carte vitale et mutuelle
- Compte-rendu échographie T1
- Résultat dépistage T1 (risque trisomie 21)
- Dossier de grossesse complet
- Résultats biologiques (T1 et T2)

IMPORTANT:
- Vessie vide (vider vessie juste avant)
- Prévoir 45-60 minutes pour l'examen
- Accompagnant autorisé
- Sexe: [souhaite connaître / ne souhaite pas connaître]

ATTENTION:
Cet examen permet de dépister environ 60-70% des malformations.
Un examen normal ne garantit pas l'absence totale d'anomalie.

Ordonnance valable {{dureeValidite}} jours.`
  },

  {
    nom: 'Échographie T3',
    categorie: 'Échographies grossesse',
    description: 'Échographie de croissance du 3ème trimestre (30-35 SA)',
    medicaments: [],
    contenu: `EXAMEN PRESCRIT:

Échographie obstétricale du 3ème trimestre
À réaliser entre 30 et 35 SA (idéalement 32 SA)

OBJECTIFS:
- Évaluation de la croissance fœtale
- Biométries fœtales:
  * Diamètre bipariétal (BIP)
  * Périmètre crânien (PC)
  * Périmètre abdominal (PA)
  * Longueur fémorale (LF)
- Estimation du poids fœtal
- Quantité de liquide amniotique (ILA)
- Localisation et aspect du placenta
- Présentation fœtale (céphalique, siège, transverse)
- Doppler ombilical et utérins (si indiqué)
- Longueur et aspect du col utérin

SURVEILLANCE PARTICULIÈRE:
□ Retard de croissance intra-utérin (RCIU)
□ Macrosomie fœtale
□ Diabète gestationnel
□ Hypertension artérielle
□ Liquide amniotique (oligoamnios/hydramnios)
□ Placenta praevia
□ Grossesse gémellaire

INFORMATIONS CLINIQUES:
- Date prévue d'accouchement: {{dpa}}
- Terme actuel: {{terme}}
- Grossesse: G{{gestite}} P{{parite}}
- Pathologies: {{pathologies}}
- Facteurs de risque: {{facteurs_risque}}

[Si anomalie détectée à T2:]
- Surveillance évolution anomalie: {{anomalie}}

[Si diabète gestationnel:]
- Surveillance macrosomie, liquide amniotique
- Estimation poids fœtal pour décision voie accouchement

[Si HTA/prééclampsie:]
- Doppler obligatoire: artères utérines et ombilicale
- Surveillance RCIU

À APPORTER À L'ÉCHOGRAPHIE:
- Carte vitale et mutuelle
- Comptes-rendus échographies précédentes (T1, T2)
- Dossier de grossesse complet
- Résultats biologiques du suivi
- Monitoring/enregistrements RCF si disponibles

IMPORTANT:
- Vessie vide (vider juste avant)
- Prévoir 30-45 minutes
- Accompagnant autorisé

[Si présentation siège à 32 SA:]
→ Nouvelle échographie de contrôle prévue à 36-37 SA
→ Version par manœuvre externe possible à 37 SA si siège persistant

[Si placenta praevia à 32 SA:]
→ Échographie de contrôle à 36 SA pour localisation définitive
→ Césarienne programmée si placenta recouvrant à terme

CONDUITE À TENIR:
Consultation post-échographie pour:
- Interprétation des résultats
- Adaptation du suivi si nécessaire
- Discussion mode d'accouchement si besoin

Ordonnance valable {{dureeValidite}} jours.`
  },

  {
    nom: 'Échographie pelvienne (gynécologie)',
    categorie: 'Échographies gynécologie',
    description: 'Échographie pelvienne par voie abdominale et/ou endovaginale',
    medicaments: [],
    contenu: `EXAMEN PRESCRIT:

Échographie pelvienne (voies abdominale et endovaginale)

OBJECTIFS:
- Étude de l'utérus: taille, position, myomètre, endomètre
- Étude des ovaires: taille, aspect, présence de kystes ou masses
- Recherche de pathologie pelvienne:
  * Fibromes utérins
  * Polypes endométriaux
  * Adénomyose
  * Kystes ovariens fonctionnels ou organiques
  * Endométriose
  * Malformations utérines

INDICATIONS:
[Cocher selon le motif:]
□ Saignements anormaux (ménorragies, métrorragies)
□ Douleurs pelviennes chroniques
□ Suspicion fibrome ou kyste ovarien
□ Bilan d'infertilité
□ Surveillance sous contraception (DIU)
□ Aménorrhée
□ Dysménorrhée sévère (suspicion endométriose)
□ Contrôle post-traitement
□ Autre: {{motif}}

INFORMATIONS CLINIQUES:
- Date des dernières règles: {{ddr}}
- Cycles: [réguliers/irréguliers, durée: ]
- Contraception: {{contraception}}
- Symptômes: {{symptomes}}
- Antécédents: {{antecedents}}

[Si bilan infertilité:]
- À réaliser entre J3 et J8 du cycle (phase folliculaire précoce)
- Compte des follicules antraux

[Si suspicion endométriose:]
- Recherche nodules endométriose profonde
- Étude mobilité organes pelviens
- Recherche endométriomes ovariens

[Si surveillance fibrome:]
- Comparer taille avec échographie précédente du [date]

À APPORTER:
- Carte vitale et mutuelle
- Échographies pelviennes antérieures si disponibles
- Résultats biologiques récents (β-HCG si aménorrhée)
- Dossier médical

IMPORTANT:
**Voie abdominale:**
- Vessie pleine: boire 1 litre d'eau 1h avant
- Ne pas uriner avant l'examen

**Voie endovaginale:**
- Vessie vide après la voie abdominale
- Sonde introduite délicatement dans le vagin
- Meilleure visualisation des organes pelviens

PRÉVOIR:
- 20-30 minutes pour l'examen complet
- Les deux voies (abdominale + endovaginale) sont généralement nécessaires

RÉSULTATS:
- Compte-rendu remis immédiatement ou envoyé au prescripteur
- Consultation de résultats avec votre sage-femme/médecin

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
