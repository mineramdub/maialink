// Templates de consultation gynécologique

export interface GynecoTemplate {
  id: string
  name: string
  description: string
  motif: string
  sousType?: string
  data: {
    motif: string
    examenClinique?: string
    conclusion?: string
  }
  examensRecommandes: string[]
  pointsVigilance: string[]
  questionsPoser: string[]
  prescriptionsSuggestions?: string[]
}

export const gynecoTemplates: GynecoTemplate[] = [
  // Aménorrhée
  {
    id: 'amenorrhee',
    name: 'Aménorrhée',
    description: 'Absence de règles',
    motif: 'amenorrhee',
    data: {
      motif: 'Aménorrhée - Absence de règles',
      examenClinique: 'Poids : ___ kg | Taille : ___ cm | IMC : ___\nTA : ___/___\n\nType : ☐ Primaire ☐ Secondaire\nDurée : ___ mois\n\nExamen général :\n☐ Développement normal des caractères sexuels secondaires\n☐ Développement mammaire : ☐ Normal ☐ Retardé ☐ Absent\n☐ Pilosité pubienne : ☐ Normale ☐ Retardée ☐ Absente\n☐ Hirsutisme : ☐ Non ☐ Oui, score Ferriman : ___\n☐ Acné : ☐ Non ☐ Modéré ☐ Sévère\n☐ Galactorrhée : ☐ Non ☐ Oui\n☐ Vergetures violacées : ☐ Non ☐ Oui\n\nPalpation thyroïdienne :\n☐ Normale ☐ Goître ☐ Nodule\n\nExamen abdominal :\n☐ Normal ☐ Masse palpable\n\nExamen gynécologique :\n☐ Vulve normale\n☐ Vagin : ☐ Normal ☐ Imperforation ☐ Cloison\n☐ Col : ☐ Visualisé ☐ Non visualisé\n☐ Utérus : ☐ Normal ☐ Hypoplasique ☐ Non palpable',
      conclusion: 'Aménorrhée explorée.\nBilan biologique prescrit.\nRevoir avec résultats.'
    },
    examensRecommandes: [
      'Test de grossesse (βHCG)',
      'Bilan hormonal : FSH, LH, œstradiol, prolactine',
      'TSH',
      'Échographie pelvienne',
      'Selon orientation : testostérone, 17-OH-progestérone'
    ],
    pointsVigilance: [
      'Éliminer une grossesse en priorité',
      'Rechercher signes d\'hyperandrogénie',
      'Troubles alimentaires / poids',
      'Stress intense ou activité sportive excessive',
      'Médicaments (neuroleptiques, chimiothérapie)',
      'Signes d\'hypothyroïdie ou d\'hyperprolactinémie'
    ],
    questionsPoser: [
      'Depuis quand n\'avez-vous plus vos règles ?',
      'Avez-vous déjà eu vos règles ? (aménorrhée primaire vs secondaire)',
      'Pratique sportive intensive ?',
      'Stress important récemment ?',
      'Variation de poids ?',
      'Prise de médicaments ?',
      'Céphalées, troubles visuels, galactorrhée ?',
      'Bouffées de chaleur ?',
      'Pilosité excessive, acné ?',
      'Désir de grossesse ?'
    ],
    prescriptionsSuggestions: [
      'Bilan hormonal complet',
      'Échographie pelvienne',
      'Consultation endocrinologue si besoin',
      'Test thérapeutique progestatif selon contexte'
    ]
  },

  // SOPK
  {
    id: 'sopk',
    name: 'SOPK - Syndrome des Ovaires Polykystiques',
    description: 'Diagnostic et prise en charge du SOPK',
    motif: 'sopk',
    data: {
      motif: 'Consultation SOPK - Syndrome des ovaires polykystiques',
      examenClinique: 'Poids : ___ kg | Taille : ___ cm | IMC : ___\nTour de taille : ___ cm\nTA : ___/___\n\nCycles menstruels :\n☐ Réguliers ☐ Irréguliers (oligoménorrhée)\nDurée entre cycles : ___ jours\n\nSignes d\'hyperandrogénie :\n☐ Hirsutisme : ☐ Non ☐ Oui, score Ferriman : ___/36\n  Zones : ☐ Lèvre sup ☐ Menton ☐ Thorax ☐ Dos ☐ Abdomen ☐ Cuisses\n☐ Acné : ☐ Non ☐ Léger ☐ Modéré ☐ Sévère\n☐ Alopécie androgénique : ☐ Non ☐ Oui\n☐ Séborrhée : ☐ Non ☐ Oui\n\nSignes métaboliques :\n☐ Acanthosis nigricans : ☐ Non ☐ Oui (nuque, aisselles, plis)\n☐ Vergetures : ☐ Non ☐ Oui\n\nExamen gynécologique :\n☐ Normal ☐ Ovaires augmentés de volume au TV',
      conclusion: 'SOPK suivi.\nPrise en charge adaptée selon projet.\nSurveillance métabolique programmée.'
    },
    examensRecommandes: [
      'Échographie pelvienne (>12 follicules par ovaire)',
      'Bilan hormonal : testostérone totale, LH, FSH, AMH',
      'Bilan métabolique : glycémie à jeun, HGPO 75g, bilan lipidique',
      'TSH'
    ],
    pointsVigilance: [
      'Risque de diabète type 2 et syndrome métabolique',
      'Infertilité possible',
      'Risque cardiovasculaire augmenté',
      'Impact psychologique (image corporelle)',
      'Irrégularité menstruelle',
      'Risque d\'hyperplasie endométriale'
    ],
    questionsPoser: [
      'Cycles menstruels réguliers ou irréguliers ?',
      'Désir de grossesse actuel ou futur ?',
      'Antécédents familiaux de diabète ?',
      'Pilosité excessive, localisation ?',
      'Acné, séborrhée ?',
      'Variations de poids ?',
      'Humeur, fatigue ?',
      'Contraception actuelle ?'
    ],
    prescriptionsSuggestions: [
      'Metformine si résistance insulinique',
      'Pilule œstroprogestative (anti-androgénique)',
      'Conseils hygiéno-diététiques (perte 5-10% poids)',
      'Activité physique régulière',
      'Consultation diététique',
      'Épilation laser/électrolyse si hirsutisme',
      'Inositol en complément',
      'Consultation endocrinologue si besoin'
    ]
  },

  // Endométriose
  {
    id: 'endometriose',
    name: 'Endométriose',
    description: 'Prise en charge de l\'endométriose',
    motif: 'endometriose',
    data: {
      motif: 'Consultation endométriose',
      examenClinique: 'Poids : ___ kg | Taille : ___ cm | IMC : ___\nTA : ___/___\n\nExamen abdominal :\n☐ Pas de masse palpable\n☐ Douleur à la palpation : ☐ FID ☐ FIG ☐ Hypogastre\n☐ Défense\n\nExamen gynécologique :\n☐ Col normal\n☐ Utérus : ☐ Normal ☐ Augmenté de volume ☐ Rétroversé\n☐ Nodules Douglas : ☐ Non ☐ Oui\n☐ Nodules ligaments utérosacrés : ☐ Non ☐ Oui\n☐ Douleur au TV : ☐ Non ☐ Modérée ☐ Importante\n\nToucher rectal :\n☐ Non réalisé ☐ Normal ☐ Nodule ☐ Douleur\n\nÉvaluation douleur :\n- Dysménorrhée : EVA ___/10\n- Dyspareunie : ☐ Non ☐ Oui, EVA ___/10\n- Douleurs pelviennes chroniques : EVA ___/10',
      conclusion: 'Endométriose suivie.\nTraitement adapté.\nRéévaluation dans X mois.'
    },
    examensRecommandes: [
      'Échographie pelvienne endovaginale (opérateur formé)',
      'IRM pelvienne si formes profondes',
      'CA 125 (non spécifique)',
      'Coloscopie si symptômes digestifs'
    ],
    pointsVigilance: [
      'Douleurs cycliques (dysménorrhée, dyspareunie)',
      'Impact sur qualité de vie',
      'Infertilité associée',
      'Symptômes digestifs ou urinaires',
      'Douleurs chroniques',
      'Retentissement psychologique'
    ],
    questionsPoser: [
      'Intensité des douleurs pendant les règles ? (EVA)',
      'Douleurs lors des rapports ?',
      'Douleurs à la défécation, aux mictions ?',
      'Troubles digestifs cycliques ?',
      'Désir de grossesse ?',
      'Traitements déjà essayés ?',
      'Impact sur vie quotidienne, travail ?',
      'Fatigue chronique ?',
      'Absentéisme scolaire/professionnel ?'
    ],
    prescriptionsSuggestions: [
      '--- ORDONNANCE TYPE 1 : Traitement initial ---',
      'IBUPROFENE 400mg',
      '1 cp x 3/jour pendant les règles',
      'Boîte de 30 comprimés',
      'Renouvellement : 3 mois',
      '',
      'LEELOO Gé (lévonorgestrel 0.1mg + éthinylestradiol 0.02mg)',
      'Prise en continu (sans arrêt)',
      '1 cp/jour à heure fixe',
      'Renouvellement : 12 mois',
      '',
      '--- ORDONNANCE TYPE 2 : Traitement progestatif ---',
      'DIENOGEST 2mg (Visanne)',
      '1 cp/jour en continu',
      'Boîte de 28 ou 84 cp',
      'Renouvellement : 6 mois',
      '',
      'PARACETAMOL 1g',
      '1 cp si besoin, max 4g/jour',
      'Boîte de 100 cp',
      '',
      '--- ORDONNANCE TYPE 3 : DIU hormonal ---',
      'Pose DIU MIRENA (lévonorgestrel 52mg)',
      'Durée 5 ans',
      '+/- IBUPROFENE 400mg avant pose',
      '',
      '--- ORDONNANCE TYPE 4 : Forme sévère ---',
      'DECAPEPTYL LP 3mg (triptoréline)',
      '1 injection IM tous les 28 jours',
      '+ ADD-BACK therapy : Estradiol gel + progestatif',
      'Durée max : 6 mois',
      'Nécessite prescription spécialisée',
      '',
      '--- Prescriptions associées ---',
      'Kinésithérapie pelvienne : 10 séances',
      'Consultation centre douleur chronique',
      'Consultation psychologue si besoin',
      'FERO-GRAD (fer) si ménorragies : 1 cp/jour'
    ]
  },

  // Contraception
  {
    id: 'contraception',
    name: 'Contraception',
    description: 'Consultation de contraception',
    motif: 'contraception',
    data: {
      motif: 'Consultation de contraception',
      examenClinique: 'Poids, taille, IMC\nTA\nExamen gynécologique si pose DIU/implant',
      conclusion: 'Contraception choisie et prescrite.\nInformations données.\nSurveillance programmée.'
    },
    examensRecommandes: [
      'Frottis cervical si > 25 ans et non à jour',
      'Sérologies IST si facteurs de risque',
      'Bilan lipidique si pilule œstroprogestative > 35 ans'
    ],
    pointsVigilance: [
      'Contre-indications pilule (ATCD thrombose, HTA, migraine avec aura, tabac > 35 ans)',
      'Observance et mode de vie',
      'Effets secondaires antérieurs',
      'Projet de grossesse futur',
      'Protection contre IST (préservatif)'
    ],
    questionsPoser: [
      'Contraception actuelle ?',
      'Satisfaction de la méthode ?',
      'Effets secondaires ?',
      'Oublis fréquents ?',
      'Projet de grossesse dans combien de temps ?',
      'Partenaire stable ou multiples ?',
      'Antécédents personnels ou familiaux ?',
      'Tabac ?',
      'Préférence : hormonale ou non ?'
    ],
    prescriptionsSuggestions: [
      'Pilule œstroprogestative',
      'Pilule progestative',
      'DIU cuivre (5 ans)',
      'DIU hormonal Mirena (5 ans)',
      'Implant (3 ans)',
      'Patch contraceptif',
      'Anneau vaginal',
      'Préservatifs (protection IST)',
      'Contraception d\'urgence (Norlevo, EllaOne)'
    ]
  },

  // Spanioménorrhées
  {
    id: 'spaniomenorrhees',
    name: 'Spanioménorrhées',
    description: 'Cycles menstruels espacés',
    motif: 'spaniomenorrhees',
    data: {
      motif: 'Spanioménorrhées - Cycles espacés',
      examenClinique: 'Poids, taille, IMC\nExamen général\nExamen gynécologique',
      conclusion: 'Spanioménorrhées explorées.\nCause recherchée.\nSuivi à prévoir.'
    },
    examensRecommandes: [
      'βHCG (éliminer grossesse)',
      'Bilan hormonal : FSH, LH, œstradiol, prolactine, testostérone',
      'TSH',
      'Échographie pelvienne (recherche SOPK)',
      'Progestéronémie J21 (si cycles)'
    ],
    pointsVigilance: [
      'SOPK fréquent',
      'Hyperprolactinémie',
      'Dysthyroïdie',
      'Insuffisance ovarienne débutante',
      'Stress, troubles alimentaires',
      'Hyperandrogénie'
    ],
    questionsPoser: [
      'Durée habituelle de vos cycles ?',
      'Depuis quand les cycles sont espacés ?',
      'Flux menstruel normal ?',
      'Signes d\'hyperandrogénie (acné, pilosité) ?',
      'Prise ou perte de poids ?',
      'Stress important ?',
      'Sport intensif ?',
      'Désir de grossesse ?',
      'Galactorrhée ?'
    ],
    prescriptionsSuggestions: [
      'Traitement de la cause si identifiée',
      'Progestatifs cycliques si besoin',
      'Pilule œstroprogestative',
      'Metformine si SOPK avec résistance insulinique',
      'Suivi régulier'
    ]
  },

  // Dysménorrhées
  {
    id: 'dysmenorrhees',
    name: 'Dysménorrhées',
    description: 'Règles douloureuses',
    motif: 'dysmenorrhees',
    data: {
      motif: 'Dysménorrhées - Règles douloureuses',
      examenClinique: 'Examen abdominal\nExamen gynécologique (recherche endométriose)\nÉvaluation douleur (EVA)',
      conclusion: 'Dysménorrhées prises en charge.\nTraitement prescrit.\nRéévaluation efficacité.'
    },
    examensRecommandes: [
      'Échographie pelvienne si dysménorrhée secondaire',
      'IRM si suspicion endométriose',
      'Coloscopie si symptômes digestifs associés'
    ],
    pointsVigilance: [
      'Distinguer dysménorrhée primaire vs secondaire',
      'Rechercher endométriose',
      'Adénomyose',
      'Fibromes',
      'Malformation utérine',
      'Sténose cervicale',
      'Impact sur qualité de vie'
    ],
    questionsPoser: [
      'Depuis quand les règles sont douloureuses ?',
      'Douleurs depuis les premières règles ou apparues secondairement ?',
      'Intensité de la douleur (EVA 0-10) ?',
      'Douleurs avant/pendant/après les règles ?',
      'Traitements essayés ?',
      'Efficacité des antalgiques ?',
      'Absentéisme scolaire/professionnel ?',
      'Autres symptômes (digestifs, urinaires) ?',
      'Douleurs pendant les rapports ?'
    ],
    prescriptionsSuggestions: [
      'AINS (ibuprofène 400mg) dès début règles',
      'Phloroglucinol (Spasfon)',
      'Paracétamol',
      'Pilule en continu',
      'DIU hormonal Mirena',
      'Progestatifs',
      'Chaleur locale',
      'Activité physique adaptée',
      'Consultation douleur si réfractaire'
    ]
  },

  // Vaginisme
  {
    id: 'vaginisme',
    name: 'Vaginisme',
    description: 'Contraction involontaire du périnée',
    motif: 'vaginisme',
    data: {
      motif: 'Vaginisme',
      examenClinique: 'Examen gynécologique adapté, progressif\nPossible à différer si trop anxiogène\nObservation vulvaire seule si besoin',
      conclusion: 'Vaginisme diagnostiqué.\nPrise en charge pluridisciplinaire proposée.\nSuivi kinésithérapie et sexologue.'
    },
    examensRecommandes: [
      'Aucun examen systématique',
      'Examen gynécologique uniquement si accepté par patiente'
    ],
    pointsVigilance: [
      'Traumatisme sexuel (en parler avec tact)',
      'Anxiété, peur',
      'Éducation sexuelle lacunaire',
      'Croyances culturelles',
      'Impact sur couple',
      'Retentissement psychologique important',
      'Ne jamais forcer l\'examen'
    ],
    questionsPoser: [
      'Depuis quand rencontrez-vous cette difficulté ?',
      'Pénétration jamais possible ou devenue impossible ? (primaire vs secondaire)',
      'Tentatives de rapport douloureuses ?',
      'Utilisation de tampons possible ?',
      'Examen gynécologique déjà réalisé ?',
      'Traumatisme ou abus sexuel ? (avec bienveillance)',
      'Anxiété vis-à-vis de la sexualité ?',
      'Désir sexuel préservé ?',
      'Impact sur le couple ?',
      'Désir de grossesse ?'
    ],
    prescriptionsSuggestions: [
      'Kinésithérapie périnéale (rééducation)',
      'Consultation sexologue',
      'Dilatateurs vaginaux progressifs',
      'Relaxation, sophrologie',
      'Soutien psychologique / psychothérapie',
      'Lubrifiants',
      'Approche de couple si souhaité',
      'Livre : "Apprivoiser son corps" ou ressources'
    ]
  },

  // Dyspareunies
  {
    id: 'dyspareunies',
    name: 'Dyspareunies',
    description: 'Douleurs pendant les rapports',
    motif: 'dyspareunies',
    data: {
      motif: 'Dyspareunies - Douleurs lors des rapports',
      examenClinique: 'Examen vulvaire (recherche lésions, atrophie)\nExamen au spéculum adapté\nToucher vaginal doux (recherche nodules, douleur provoquée)\nÉvaluation tonicity périnéale',
      conclusion: 'Dyspareunie explorée.\nCause recherchée.\nPrise en charge adaptée.'
    },
    examensRecommandes: [
      'Prélèvement vaginal si suspicion infection',
      'Échographie pelvienne',
      'IRM si suspicion endométriose profonde',
      'Bilan hormonal si atrophie (ménopause)'
    ],
    pointsVigilance: [
      'Distinguer dyspareunie superficielle vs profonde',
      'Endométriose',
      'Infections (mycose, vaginose)',
      'Atrophie vaginale (ménopause, allaitement)',
      'Vestibulodynie',
      'Hypertonie périnéale',
      'Sécheresse vaginale',
      'Facteurs psychologiques',
      'Impact sur couple et sexualité'
    ],
    questionsPoser: [
      'Douleurs en début ou fin de pénétration ? (superficielle vs profonde)',
      'Depuis quand ?',
      'Douleurs à chaque rapport ou intermittent ?',
      'Lubrification suffisante ?',
      'Infections récentes ?',
      'Endométriose connue ?',
      'Ménopause, allaitement ?',
      'Contraception hormonale ?',
      'Anxiété pendant les rapports ?',
      'Impact sur vie sexuelle et couple ?'
    ],
    prescriptionsSuggestions: [
      'Lubrifiants (Replens, Monasens)',
      'Hydratants vaginaux',
      'Traitement œstrogène local si atrophie',
      'Antifongique si mycose',
      'Antibiotique si vaginose',
      'Kinésithérapie périnéale',
      'AINS avant rapport si endométriose',
      'Consultation sexologue',
      'Soutien psychologique si besoin'
    ]
  },

  // IST
  {
    id: 'ist',
    name: 'IST - Infections Sexuellement Transmissibles',
    description: 'Dépistage et prise en charge IST',
    motif: 'ist',
    data: {
      motif: 'Consultation IST - Dépistage ou symptômes',
      examenClinique: 'Examen génital externe\nRecherche adénopathies inguinales\nExamen au spéculum\nToucher vaginal\nInspection ano-rectale si besoin',
      conclusion: 'Dépistage IST réalisé.\nTraitement si positif.\nDépistage partenaire(s) recommandé.'
    },
    examensRecommandes: [
      'Sérologie VIH, VHB, VHC, syphilis',
      'PCR Chlamydia et gonocoque (prélèvement vaginal/urétral)',
      'Prélèvement vaginal si pertes anormales',
      'Sérologie HSV si lésions',
      'Frottis cervical si non à jour'
    ],
    pointsVigilance: [
      'Chlamydia et gonocoque souvent asymptomatiques',
      'Risque de stérilité si non traité',
      'Dépistage partenaire obligatoire',
      'Contraception d\'urgence si rapport à risque récent',
      'Prévention : préservatif systématique',
      'Grossesse en cours ?',
      'Vaccination HPV, VHB'
    ],
    questionsPoser: [
      'Symptômes : pertes, brûlures, douleurs ?',
      'Date du dernier rapport à risque ?',
      'Partenaire(s) stable ou multiples ?',
      'Utilisation de préservatif ?',
      'Dernier dépistage ?',
      'Partenaire symptomatique ?',
      'Antécédents d\'IST ?',
      'Grossesse possible ?',
      'Pratiques sexuelles (orale, anale) ?',
      'Vaccination HPV, VHB à jour ?'
    ],
    prescriptionsSuggestions: [
      'Azithromycine 1g dose unique (Chlamydia)',
      'Ceftriaxone 500mg IM (gonocoque)',
      'Doxycycline 100mg x2/j 7j (alternative)',
      'Métronidazole si Trichomonas',
      'Valaciclovir si HSV',
      'Préservatifs',
      'Contraception d\'urgence si < 72h',
      'Dépistage partenaires',
      'Vaccination HPV si < 26 ans',
      'Vaccination VHB si non immune'
    ]
  },

  // Mycose
  {
    id: 'mycose',
    name: 'Mycose vaginale',
    description: 'Candidose vulvo-vaginale',
    motif: 'mycose',
    data: {
      motif: 'Mycose vaginale - Candidose',
      examenClinique: 'Examen vulvaire (érythème, fissures)\nExamen au spéculum (leucorrhées blanchâtres)\nPrélèvement vaginal si récidivant',
      conclusion: 'Mycose vaginale traitée.\nConseils d\'hygiène donnés.\nConsulter si récidive.'
    },
    examensRecommandes: [
      'Prélèvement vaginal si mycoses récidivantes',
      'Glycémie à jeun si récidivant (diabète ?)',
      'Sérologie VIH si facteurs de risque'
    ],
    pointsVigilance: [
      'Mycoses récidivantes : rechercher diabète, immunodépression',
      'Éviter traitement antibiotique inutile',
      'Facteurs favorisants : stress, vêtements serrés, hygiène excessive',
      'Traitement du partenaire si symptomatique',
      'Grossesse : adapter traitement'
    ],
    questionsPoser: [
      'Démangeaisons, brûlures vulvaires ?',
      'Pertes blanches épaisses ?',
      'Première mycose ou récidivante ?',
      'Prise récente d\'antibiotiques ?',
      'Diabète connu ?',
      'Hygiène intime (produits utilisés) ?',
      'Port de vêtements serrés, synthétiques ?',
      'Stress important ?',
      'Partenaire symptomatique ?',
      'Grossesse ?'
    ],
    prescriptionsSuggestions: [
      'Ovule Econazole 150mg (3 jours)',
      'Crème Econazole pour vulve',
      'Fluconazole 150mg oral dose unique (si non enceinte)',
      'Savon doux pH neutre',
      'Sous-vêtements coton',
      'Probiotiques vaginaux en prévention',
      'Éviter toilette intime excessive',
      'Traitement partenaire si symptômes'
    ]
  },

  // Vaginose
  {
    id: 'vaginose',
    name: 'Vaginose bactérienne',
    description: 'Déséquilibre de la flore vaginale',
    motif: 'vaginose',
    data: {
      motif: 'Vaginose bactérienne',
      examenClinique: 'Examen au spéculum\nPH vaginal (> 4.5)\nTest à la potasse (odeur de poisson)\nPrélèvement vaginal',
      conclusion: 'Vaginose bactérienne traitée.\nConseil de surveillance.\nReconsulter si récidive.'
    },
    examensRecommandes: [
      'Prélèvement vaginal avec score de Nugent',
      'pH vaginal',
      'Test des amines (KOH)'
    ],
    pointsVigilance: [
      'Risque accru d\'IST',
      'Risque si grossesse (MAP, rupture prématurée membranes)',
      'Récidives fréquentes',
      'Pas de transmission sexuelle vraie mais favorisé par rapports',
      'Éviter toilette vaginale interne'
    ],
    questionsPoser: [
      'Pertes grisâtres avec odeur de poisson ?',
      'Odeur majorée après rapports ?',
      'Démangeaisons, brûlures ?',
      'Première fois ou récidivant ?',
      'Grossesse ?',
      'Nouveau partenaire récent ?',
      'Hygiène intime (produits, fréquence) ?',
      'Tabac ?'
    ],
    prescriptionsSuggestions: [
      'Métronidazole 500mg x2/j pendant 7 jours',
      'Métronidazole ovule 500mg 1/j pendant 7 jours',
      'Clindamycine crème vaginale (alternative)',
      'Probiotiques vaginaux (lactobacilles)',
      'Éviter toilette vaginale',
      'Préservatif recommandé',
      'Arrêt tabac si fumeur',
      'Traitement récidives : métronidazole gel 2x/semaine'
    ]
  },

  // Fibromes
  {
    id: 'fibromes',
    name: 'Fibromes utérins',
    description: 'Léiomyomes utérins',
    motif: 'fibromes',
    data: {
      motif: 'Consultation fibromes utérins',
      examenClinique: 'Palpation abdominale (utérus augmenté ?)\nSpéculum\nToucher vaginal (taille, contour utérus)',
      conclusion: 'Fibromes suivis.\nTraitement selon symptômes.\nSurveillance régulière.'
    },
    examensRecommandes: [
      'Échographie pelvienne (taille, nombre, localisation)',
      'NFS (recherche anémie)',
      'IRM pelvienne si chirurgie envisagée',
      'Hystéroscopie si saignements et fibrome sous-muqueux'
    ],
    pointsVigilance: [
      'Ménorragies avec anémie',
      'Douleurs pelviennes',
      'Compression vésicale ou rectale',
      'Infertilité',
      'Impact sur grossesse',
      'Croissance rapide suspecte',
      'Taille et localisation'
    ],
    questionsPoser: [
      'Règles abondantes, prolongées ?',
      'Caillots ?',
      'Douleurs pelviennes ?',
      'Sensation de pesanteur ?',
      'Troubles urinaires (pollakiurie, dysurie) ?',
      'Constipation ?',
      'Augmentation volume abdominal ?',
      'Désir de grossesse ?',
      'Fatigue, pâleur ?',
      'Traitement déjà essayé ?'
    ],
    prescriptionsSuggestions: [
      'AINS pour douleurs',
      'Acide tranexamique si ménorragies (Exacyl)',
      'DIU Mirena (réduit saignements)',
      'Pilule en continu',
      'Ulipristal (Esmya) - si dispo',
      'Fer si anémie',
      'Consultation chirurgien : myomectomie, embolisation, hystérectomie selon contexte',
      'Surveillance échographique annuelle'
    ]
  },

  // Infertilité
  {
    id: 'infertilite',
    name: 'Infertilité / Hypofertilité',
    description: 'Bilan et prise en charge infertilité',
    motif: 'infertilite',
    data: {
      motif: 'Consultation infertilité - Bilan initial',
      examenClinique: 'Poids, taille, IMC\nExamen général\nExamen gynécologique\nRecherche signes d\'hyperandrogénie',
      conclusion: 'Bilan d\'infertilité initié.\nExplorations programmées.\nConsultation spécialisée si besoin.'
    },
    examensRecommandes: [
      'Courbe de température',
      'Bilan hormonal J3 : FSH, LH, œstradiol, AMH, prolactine, TSH',
      'Échographie pelvienne (compte folliculaire)',
      'Hystérosalpingographie (perméabilité trompes)',
      'Spermogramme partenaire',
      'Progestéronémie J21 (ovulation)',
      'Sérologies : VIH, VHB, VHC, rubéole, toxoplasmose (les 2)',
      'Chlamydia'
    ],
    pointsVigilance: [
      'Durée d\'infertilité (> 1 an)',
      'Âge de la femme (> 35 ans : bilan plus rapide)',
      'Antécédents : GEU, infections, chirurgie',
      'Cycles irréguliers',
      'Endométriose',
      'SOPK',
      'Réserve ovarienne',
      'Facteur masculin (50% des cas)',
      'Retentissement psychologique'
    },
    questionsPoser: [
      'Depuis combien de temps essayez-vous ?',
      'Fréquence des rapports ?',
      'Cycles réguliers ?',
      'Antécédents de grossesse (vous ou partenaire) ?',
      'Antécédents : infections, chirurgie, GEU ?',
      'Contraception antérieure ?',
      'Tabac, alcool ?',
      'Poids stable ?',
      'Stress important ?',
      'Traitement en cours ?',
      'Antécédents familiaux ?'
    ],
    prescriptionsSuggestions: [
      'Acide folique 0.4mg/j dès maintenant',
      'Courbe de température',
      'Rapports tous les 2-3 jours en période ovulatoire',
      'Bilan hormonal J3',
      'Spermogramme partenaire',
      'Hystérosalpingographie',
      'Consultation centre AMP si bilan anormal',
      'Soutien psychologique si besoin',
      'Optimisation : poids, tabac, alcool',
      'Stimulation simple (Clomid) selon bilan'
    ]
  },

  // Sécheresse vaginale
  {
    id: 'secheresse',
    name: 'Sécheresse vaginale',
    description: 'Atrophie vulvo-vaginale',
    motif: 'secheresse',
    data: {
      motif: 'Sécheresse vaginale',
      examenClinique: 'Examen vulvaire (atrophie, pâleur, sécheresse)\nExamen au spéculum (muqueuse fine, pâle)\nToucher vaginal doux\nÉvaluation pH vaginal',
      conclusion: 'Sécheresse vaginale prise en charge.\nTraitement hydratant/hormonal prescrit.\nRéévaluation efficacité.'
    },
    examensRecommandes: [
      'Aucun systématique',
      'Bilan hormonal si ménopause précoce',
      'FSH si < 40 ans'
    ],
    pointsVigilance: [
      'Ménopause (principale cause)',
      'Allaitement (hypoestrogénie)',
      'Contraception hormonale microprogestative',
      'Post-traitement cancer (chimiothérapie, hormonothérapie)',
      'Syndrome de Sjögren',
      'Impact sur sexualité',
      'Dyspareunie associée',
      'Infections urinaires récidivantes'
    ],
    questionsPoser: [
      'Depuis quand cette sécheresse ?',
      'Ménopause ? Depuis quand ?',
      'Allaitement ?',
      'Contraception actuelle ?',
      'Traitements anticancéreux ?',
      'Douleurs pendant les rapports ?',
      'Prurit, irritation ?',
      'Infections urinaires fréquentes ?',
      'Sécheresse cutanée générale, yeux secs ?',
      'Traitement déjà essayé ?'
    ],
    prescriptionsSuggestions: [
      'Hydratants vaginaux (Replens, Mucogyne) 3x/semaine',
      'Lubrifiants pour rapports',
      'Œstrogènes locaux (Trophigil crème, ovules)',
      'DHEA intravaginale (Intrarosa)',
      'Promestriène (Colpotrophine)',
      'THS si ménopause et non contre-indiqué',
      'Acide hyaluronique vaginal',
      'Éviter savons irritants',
      'Sous-vêtements coton',
      'Consultation sexologue si dyspareunie'
    ]
  }
]

export function getGynecoTemplateByMotif(motif: string): GynecoTemplate | undefined {
  return gynecoTemplates.find(t => t.motif === motif)
}

export function getGynecoTemplateById(id: string): GynecoTemplate | undefined {
  return gynecoTemplates.find(t => t.id === id)
}

export function getAllGynecoMotifs(): Array<{ value: string; label: string }> {
  return gynecoTemplates.map(t => ({
    value: t.motif,
    label: t.name
  }))
}
