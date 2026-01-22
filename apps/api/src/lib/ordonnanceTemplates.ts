// Templates d'ordonnances organisés par type de consultation et motif

export interface OrdonnanceTemplate {
  id: string
  titre: string
  motif: string
  type_consultation: string
  contenu: string
  tags: string[]
  // Frontend compatibility fields
  nom: string
  categorie: string
  description: string
  medicaments?: Array<{ medicamentId: string; personnalise: boolean }>
}

export const ORDONNANCE_TEMPLATES: OrdonnanceTemplate[] = [
  // CONTRACEPTION - Pilules
  {
    id: 'contraception-pilule',
    titre: 'Contraception - Pilule Combinée',
    nom: 'Contraception - Pilule Combinée',
    categorie: 'Contraception',
    description: 'Ordonnance pour pilule contraceptive combinée (œstroprogestatif)',
    motif: 'contraception',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - CONTRACEPTION ORALE COMBINÉE ===

MÉDICAMENT PRESCRIT :
☐ LEELOO Gé (Lévonorgestrel 100µg + Ethinylestradiol 20µg)
☐ OPTILOVA (Lévonorgestrel 100µg + Ethinylestradiol 20µg)
☐ MINIDRIL (Lévonorgestrel 150µg + Ethinylestradiol 30µg)
☐ Autre : [ ]

POSOLOGIE :
☐ 1 comprimé/jour pendant 21j, puis 7j d'arrêt
☐ Débuter le 1er jour des règles

QUANTITÉ :
☐ 3 plaquettes ☐ 6 plaquettes ☐ 12 plaquettes
Renouvelable : ☐ 6 mois ☐ 12 mois

CONSEILS DONNÉS :
☐ Prendre à heure fixe quotidienne
☐ Oubli < 12h : prendre immédiatement + suivant à l'heure
☐ Oubli > 12h : contraception additionnelle 7 jours
☐ Arrêt immédiat et consultation si :
  • Migraine intense inhabituelle
  • Douleur thoracique, essoufflement
  • Jambe gonflée, rouge, douloureuse
  • Troubles visuels

SURVEILLANCE :
☐ Consultation contrôle à 3 mois
☐ TA à surveiller
☐ Bilan lipidique si facteurs de risque

CONTRE-INDICATIONS VÉRIFIÉES :
☐ Tabac > 35 ans ☐ Antécédent thrombose ☐ HTA non contrôlée
☐ Migraine avec aura ☐ Diabète compliqué

Prochain RDV : [ ]`,
    tags: ['contraception', 'pilule']
  },
  {
    id: 'contraception-pilule-microprogestative',
    titre: 'Contraception - Pilule Microprogestative',
    nom: 'Contraception - Pilule Microprogestative',
    categorie: 'Contraception',
    description: 'Ordonnance pour pilule microprogestative (sans œstrogènes)',
    motif: 'contraception',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - PILULE MICROPROGESTATIVE ===

MÉDICAMENT PRESCRIT :
☐ CERAZETTE (Désogestrel 75µg)
☐ OPTIMIZETTE (Désogestrel 75µg)
☐ Autre : [ ]

POSOLOGIE :
☐ 1 comprimé/jour EN CONTINU (pas d'arrêt)
☐ À heure fixe (fenêtre 3h max)
☐ Débuter J1 des règles

QUANTITÉ :
☐ 3 plaquettes ☐ 6 plaquettes ☐ 12 plaquettes
Renouvelable : ☐ 6 mois ☐ 12 mois

AVANTAGES :
☐ Sans œstrogènes
☐ Compatible allaitement
☐ Compatible migraines, tabac, HTA modérée

CONSEILS DONNÉS :
☐ Prendre à heure fixe (très important)
☐ Oubli < 12h : prendre immédiatement
☐ Oubli > 12h : contraception additionnelle 7 jours
☐ Possible : aménorrhée ou saignements irréguliers (normal)

SURVEILLANCE :
☐ Consultation contrôle à 3 mois
☐ TA à surveiller

Prochain RDV : [ ]`,
    tags: ['contraception', 'pilule', 'microprogestative', 'allaitement']
  },
  {
    id: 'contraception-pilule-diane35',
    titre: 'Contraception - Diane 35 (Acné)',
    nom: 'Contraception - Diane 35 (Acné)',
    categorie: 'Contraception',
    description: 'Ordonnance pour Diane 35 en cas d\'acné sévère et contraception',
    motif: 'contraception',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - DIANE 35 (Acné sévère) ===

INDICATION :
☐ Acné modérée à sévère ☐ Hirsutisme ☐ Contraception

MÉDICAMENT PRESCRIT :
☐ DIANE 35 (Cyprotérone 2mg + Ethinylestradiol 35µg)

POSOLOGIE :
☐ 1 comprimé/jour pendant 21j, puis 7j d'arrêt
☐ Débuter J1 des règles

QUANTITÉ :
☐ 3 plaquettes ☐ 6 plaquettes
Renouvelable : ☐ 6 mois maximum

SURVEILLANCE RENFORCÉE :
☐ Bilan hépatique avant traitement
☐ Contrôle transaminases à 3 mois puis tous les 6 mois
☐ Arrêt immédiat si ictère ou cytolyse
☐ Risque thromboembolique : surveillance clinique

CONSEILS DONNÉS :
☐ Amélioration acné après 3-4 mois
☐ Arrêt dès amélioration cutanée satisfaisante
☐ Ne pas utiliser > 1 an sans réévaluation
☐ Mêmes conseils que pilule combinée

CONTRE-INDICATIONS VÉRIFIÉES :
☐ Insuffisance hépatique ☐ Antécédent thrombose
☐ Tumeur hépatique ☐ Méningiome

Prochain RDV : [ ]`,
    tags: ['contraception', 'pilule', 'diane35', 'acné']
  },

  // CONTRACEPTION - DIU
  {
    id: 'contraception-diu-cuivre',
    titre: 'Contraception - DIU Cuivre',
    nom: 'Contraception - DIU Cuivre',
    categorie: 'Contraception',
    description: 'Ordonnance pour pose de dispositif intra-utérin au cuivre',
    motif: 'contraception',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - DIU AU CUIVRE ===

DIU PRESCRIT :
☐ DIU Cuivre TT 380 (surface 380mm²) - Standard
☐ DIU Cuivre UT 380 Short (utérus < 7cm) - Petit utérus
☐ DIU Cuivre NT 380 (nullipare) - Nullipares
☐ Autre : [ ]

MATÉRIEL DE POSE :
☐ Matériel de pose stérile inclus dans emballage
☐ Antiseptique (Bétadine gynécologique)
☐ Pince de Pozzi
☐ Hystéromètre
☐ Gants stériles

POSE :
☐ Période de règles recommandée (col plus souple)
☐ Ou n'importe quand si grossesse exclue
☐ Consentement éclairé signé

DURÉE D'EFFICACITÉ :
☐ 5 ans ☐ 10 ans (selon modèle prescrit)

CONSEILS DONNÉS :
☐ Fils de contrôle : vérifier après chaque règles
☐ Règles possiblement plus abondantes et douloureuses
☐ Consultation urgente si : fièvre, douleurs intenses, pertes malodorantes
☐ Protection IST : préservatif si partenaires multiples
☐ Antalgiques si besoin : Ibuprofène 400mg

SURVEILLANCE :
☐ Contrôle position fils post-menstruel
☐ Échographie contrôle à 3 mois (optionnel)
☐ Consultation annuelle
☐ Retrait/changement avant expiration

EXAMENS DEMANDÉS :
☐ Prélèvement vaginal si risque IST
☐ Test grossesse si doute

Prochain RDV : 3 mois (contrôle) [ ]`,
    tags: ['contraception', 'DIU', 'cuivre']
  },
  {
    id: 'contraception-diu-hormonal',
    titre: 'Contraception - DIU Hormonal',
    nom: 'Contraception - DIU Hormonal',
    categorie: 'Contraception',
    description: 'Ordonnance pour pose de DIU hormonal (Mirena, Kyleena, Jaydess)',
    motif: 'contraception',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - DIU HORMONAL ===

DIU PRESCRIT :
☐ MIRENA (lévonorgestrel 52mg) - 5 ans - Standard
☐ KYLEENA (lévonorgestrel 19,5mg) - 5 ans - Plus petit
☐ JAYDESS (lévonorgestrel 13,5mg) - 3 ans - Nullipare

MATÉRIEL DE POSE :
☐ Matériel de pose stérile inclus
☐ Antiseptique (Bétadine gynécologique)
☐ Pince de Pozzi
☐ Hystéromètre
☐ Gants stériles

POSE :
☐ J1-J7 du cycle
☐ Ou n'importe quand si grossesse exclue
☐ Consentement éclairé signé

DURÉE D'EFFICACITÉ :
☐ 3 ans (Jaydess) ☐ 5 ans (Mirena/Kyleena)

AVANTAGES :
☐ Diminution flux menstruel (voire aménorrhée)
☐ Diminution dysménorrhée
☐ Traitement ménorragies/endométriose

CONSEILS DONNÉS :
☐ Fils de contrôle à vérifier
☐ Spotting possible 3-6 premiers mois (normal)
☐ Aménorrhée possible (normal, pas de grossesse)
☐ Consultation si : fièvre, douleurs, expulsion
☐ Antalgiques si besoin : Ibuprofène 400mg

SURVEILLANCE :
☐ Contrôle position fils
☐ Échographie contrôle à 3 mois (optionnel)
☐ Consultation annuelle
☐ Retrait/changement avant expiration

EFFETS SECONDAIRES POSSIBLES :
☐ Spotting (3-6 mois) ☐ Aménorrhée ☐ Acné
☐ Mastodynie ☐ Kystes ovariens fonctionnels (bénins)

Prochain RDV : 3 mois (contrôle) [ ]`,
    tags: ['contraception', 'DIU', 'Mirena', 'Jaydess', 'Kyleena', 'hormonal']
  },

  // CONTRACEPTION - Implant
  {
    id: 'contraception-implant',
    titre: 'Contraception - Implant',
    nom: 'Contraception - Implant',
    categorie: 'Contraception',
    description: 'Ordonnance pour pose d\'implant contraceptif sous-cutané (Nexplanon)',
    motif: 'contraception',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - IMPLANT CONTRACEPTIF ===

MATÉRIEL PRESCRIT :
☐ NEXPLANON - 1 implant sous-cutané (68mg étonogestrel)
☐ Xylocaïne 1% - 1 ampoule (anesthésie locale)
☐ Compresses stériles
☐ Steri-strip

TECHNIQUE DE POSE :
☐ Face interne bras non dominant
☐ 6-8 cm au-dessus pli du coude
☐ En sous-cutané (palpable)
☐ Entre J1-J5 du cycle
☐ Ou immédiatement si contraception efficace antérieure

DURÉE D'EFFICACITÉ : 3 ans

CONSEILS POST-POSE :
☐ Pas d'effort avec le bras pendant 24h
☐ Garder pansement compressif 24h
☐ Retirer pansement après 24h
☐ Palpation régulière implant (vérifier présence)
☐ Carte d'implantation remise et conservée

EFFETS ATTENDUS :
☐ Aménorrhée possible (normal)
☐ Spotting irrégulier possible (surtout 6 premiers mois)
☐ Efficacité immédiate si posé J1-J5

SURVEILLANCE :
☐ Contrôle cicatrice à J8
☐ Consultation contrôle à 3 mois
☐ Retrait/changement à programmer avant 3 ans

EFFETS SECONDAIRES POSSIBLES :
☐ Saignements irréguliers ☐ Aménorrhée
☐ Mastodynie ☐ Acné ☐ Prise poids modérée

Prochain RDV : J8 (cicatrice) puis 3 mois [ ]`,
    tags: ['contraception', 'implant']
  },

  // CONTRACEPTION - Autres méthodes
  {
    id: 'contraception-patch',
    titre: 'Contraception - Patch',
    nom: 'Contraception - Patch',
    categorie: 'Contraception',
    description: 'Ordonnance pour patch contraceptif transdermique hebdomadaire',
    motif: 'contraception',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - PATCH CONTRACEPTIF ===

MÉDICAMENT PRESCRIT :
☐ EVRA (Patch transdermique norelgestromine/éthinylestradiol)

POSOLOGIE :
☐ 1 patch/semaine pendant 3 semaines
☐ Puis 1 semaine d'arrêt (règles)
☐ Débuter J1 des règles

QUANTITÉ :
☐ 3 boîtes (9 patchs) ☐ 6 boîtes (18 patchs)
Renouvelable : ☐ 6 mois ☐ 12 mois

MODE D'EMPLOI :
☐ Application sur peau propre, sèche, non lésée
☐ Zones : fesse, abdomen, haut du torse (sauf seins), bras
☐ Changer même jour chaque semaine
☐ Alterner les sites d'application

CONSEILS DONNÉS :
☐ Bien vérifier adhésion quotidiennement
☐ Si décollement < 24h : recoller ou changer
☐ Si décollement > 24h : nouveau cycle + contraception 7j
☐ Pas de crème sur zone application
☐ Mêmes contre-indications que pilule combinée

SURVEILLANCE :
☐ Consultation contrôle à 3 mois
☐ TA à surveiller

EFFETS SECONDAIRES :
☐ Irritation cutanée locale possible
☐ Mastodynie ☐ Nausées ☐ Céphalées

Prochain RDV : 3 mois [ ]`,
    tags: ['contraception', 'patch', 'evra']
  },
  {
    id: 'contraception-anneau',
    titre: 'Contraception - Anneau Vaginal',
    nom: 'Contraception - Anneau Vaginal',
    categorie: 'Contraception',
    description: 'Ordonnance pour anneau vaginal contraceptif (NuvaRing)',
    motif: 'contraception',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - ANNEAU VAGINAL ===

MÉDICAMENT PRESCRIT :
☐ NUVARING (Anneau vaginal étonogestrel/éthinylestradiol)

POSOLOGIE :
☐ 1 anneau à insérer dans vagin
☐ Garder 3 semaines en continu
☐ Retirer, 1 semaine d'arrêt (règles)
☐ Puis nouvel anneau
☐ Débuter J1 des règles

QUANTITÉ :
☐ 3 anneaux ☐ 6 anneaux ☐ 12 anneaux
Renouvelable : ☐ 6 mois ☐ 12 mois

MODE D'EMPLOI :
☐ Insertion facile (comme tampon)
☐ Position dans vagin importe peu (confort)
☐ Retrait par crochetage avec doigt
☐ Conservation réfrigérateur avant usage

CONSEILS DONNÉS :
☐ Si expulsion < 3h : rincer + réinsérer
☐ Si expulsion > 3h : réinsérer + contraception 7j
☐ Retrait temporaire max 3h (rapport)
☐ Mêmes contre-indications que pilule combinée
☐ Peut être senti par partenaire (repositionner si gêne)

SURVEILLANCE :
☐ Consultation contrôle à 3 mois
☐ TA à surveiller

EFFETS SECONDAIRES :
☐ Leucorrhées ☐ Mastodynie
☐ Céphalées ☐ Sensation corps étranger

Prochain RDV : 3 mois [ ]`,
    tags: ['contraception', 'anneau', 'nuvaring']
  },

  // CONTRACEPTION D'URGENCE
  {
    id: 'contraception-urgence-norlevo',
    titre: 'Contraception d\'urgence - Norlevo',
    nom: 'Contraception d\'urgence - Norlevo',
    categorie: 'Contraception',
    description: 'Ordonnance pour contraception d\'urgence (lévonorgestrel, efficace jusqu\'à 72h)',
    motif: 'contraception urgence',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - CONTRACEPTION D'URGENCE ===

MÉDICAMENT PRESCRIT :
☐ NORLEVO (Lévonorgestrel 1,5mg)

POSOLOGIE :
☐ 1 comprimé en prise unique
☐ Le plus tôt possible après rapport
☐ Maximum 72h (3 jours) après rapport

CONSEILS DONNÉS :
☐ Efficacité maximale si prise précoce (< 12h)
☐ Efficacité diminue avec le temps
☐ Règles possiblement perturbées
☐ Nausées/vomissements possibles
☐ Si vomissements < 3h : reprendre 1 cp
☐ Ne remplace pas contraception régulière
☐ Test grossesse si retard règles > 5-7j

CONTRACEPTION ULTÉRIEURE :
☐ Pilule : reprendre le lendemain
☐ Préservatif jusqu'aux prochaines règles
☐ Consultation pour contraception adaptée

SURVEILLANCE :
☐ Test grossesse si retard règles
☐ Dépistage IST si rapport à risque
☐ Consultation contraception à programmer

Prochain RDV : [ ]`,
    tags: ['contraception', 'urgence', 'norlevo']
  },
  {
    id: 'contraception-urgence-ellaone',
    titre: 'Contraception d\'urgence - EllaOne',
    nom: 'Contraception d\'urgence - EllaOne',
    categorie: 'Contraception',
    description: 'Ordonnance pour contraception d\'urgence (ulipristal, efficace jusqu\'à 120h)',
    motif: 'contraception urgence',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - CONTRACEPTION D'URGENCE (EllaOne) ===

MÉDICAMENT PRESCRIT :
☐ ELLAONE (Ulipristal acétate 30mg)

POSOLOGIE :
☐ 1 comprimé en prise unique
☐ Le plus tôt possible après rapport
☐ Maximum 120h (5 jours) après rapport

AVANTAGES EllaOne vs Norlevo :
☐ Efficacité maintenue jusqu'à 120h (vs 72h)
☐ Plus efficace que lévonorgestrel après 72h
☐ Efficacité constante sur 5 jours

CONSEILS DONNÉS :
☐ À prendre dès que possible
☐ Peut être pris à tout moment du cycle
☐ Règles possiblement retardées de quelques jours
☐ Si vomissements < 3h : reprendre 1 cp
☐ Préservatif jusqu'aux prochaines règles
☐ Test grossesse si retard règles > 5-7j

CONTRACEPTION ULTÉRIEURE :
☐ Contraception hormonale : attendre 5 jours
☐ Préservatif en attendant
☐ Consultation contraception à programmer

SURVEILLANCE :
☐ Test grossesse si retard règles
☐ Dépistage IST si rapport à risque
☐ Consultation contraception

Prochain RDV : [ ]`,
    tags: ['contraception', 'urgence', 'ellaone']
  },

  // INFECTIONS - Mycose
  {
    id: 'mycose-vaginale',
    titre: 'Mycose Vaginale',
    nom: 'Mycose Vaginale',
    categorie: 'Infections',
    description: 'Ordonnance pour traitement de mycose vaginale (candidose)',
    motif: 'mycose',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - MYCOSE VAGINALE ===

DIAGNOSTIC :
☐ Leucorrhées blanches épaisses (caséeuses)
☐ Prurit vulvaire intense
☐ Muqueuse érythémateuse
☐ Pas de mauvaise odeur

TRAITEMENT LOCAL :
☐ ECONAZOLE LP 150mg - 1 ovule dose unique
☐ ECONAZOLE crème 1% - Tube 30g
  → Application 2x/jour pendant 7 jours
☐ Ou MONAZOL (Sertaconazole) - 1 ovule dose unique

TRAITEMENT ORAL (si récidives) :
☐ FLUCONAZOLE 150mg - 1 gélule dose unique

HYGIÈNE ET CONSEILS :
☐ Toilette intime : savon doux pH neutre, 1-2x/jour
☐ Sécher soigneusement (tamponnement)
☐ Sous-vêtements coton, éviter synthétiques
☐ Éviter protège-slips quotidiens
☐ Pas de douche vaginale
☐ Traiter partenaire si symptômes (balanite)

FACTEURS FAVORISANTS À ÉVITER :
☐ Antibiotiques ☐ Vêtements serrés
☐ Humidité prolongée ☐ Excès hygiène intime

SURVEILLANCE :
☐ Amélioration attendue sous 48-72h
☐ Reconsulter si persistance > 1 semaine
☐ Si récidives > 4/an : bilan (diabète, immunodépression)

Prochain RDV : Si persistance [ ]`,
    tags: ['mycose', 'candidose', 'infection']
  },

  // INFECTIONS - Cystite
  {
    id: 'infection-urinaire',
    titre: 'Infection Urinaire - Cystite',
    nom: 'Infection Urinaire - Cystite',
    categorie: 'Infections',
    description: 'Ordonnance pour traitement de cystite simple non compliquée',
    motif: 'infection urinaire',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - CYSTITE SIMPLE ===

DIAGNOSTIC :
☐ Brûlures mictionnelles ☐ Pollakiurie ☐ Urgences
☐ Pesanteur sus-pubienne ☐ Pas de fièvre

TRAITEMENT ANTIBIOTIQUE (Choix selon profil) :
☐ FOSFOMYCINE 3g (Monuril) - 1 sachet dose unique
☐ Ou PIVMECILLINAM 400mg - 2cp 2x/jour pendant 3 jours
☐ Ou NITROFURANTOÏNE 100mg - 1cp 3x/jour pendant 5 jours

TRAITEMENT SYMPTOMATIQUE :
☐ SPASFON 80mg - 1-2cp 3x/jour si douleurs
☐ Ou ACUPAN 20mg - 1 gélule 3x/jour si douleurs intenses

MESURES HYGIÉNIQUES :
☐ Boire 2 litres d'eau/jour minimum
☐ Uriner régulièrement, ne pas se retenir
☐ Miction après rapports sexuels
☐ Essuyage d'avant en arrière
☐ Éviter toilette intime excessive

EXAMENS COMPLÉMENTAIRES :
☐ ECBU si :
  • Signes de gravité (fièvre)
  • Grossesse
  • Récidive < 1 mois
  • Échec traitement
  • > 3 épisodes/an

SURVEILLANCE :
☐ Amélioration attendue sous 48h
☐ Consultation urgente si : fièvre, douleurs lombaires
☐ Reconsulter si persistance symptômes > 72h
☐ Si récidives fréquentes : bilan urologique

CONSEILS PRÉVENTION RÉCIDIVES :
☐ Hydratation abondante
☐ Canneberge (cranberry) 36mg PAC/jour
☐ Probiotiques vaginaux

Prochain RDV : Si persistance ou récidives [ ]`,
    tags: ['infection', 'cystite', 'urinaire']
  },

  // GROSSESSE - Vitamines
  {
    id: 'grossesse-vitamines',
    titre: 'Vitamines Prénatales',
    nom: 'Vitamines Prénatales',
    categorie: 'Grossesse',
    description: 'Ordonnance pour supplémentation vitamines et minéraux pendant la grossesse',
    motif: 'suivi grossesse',
    type_consultation: 'prenatale',
    medicaments: [],
    contenu: `=== ORDONNANCE - SUPPLÉMENTATION GROSSESSE ===

ACIDE FOLIQUE (Obligatoire) :
☐ ACIDE FOLIQUE 5mg (Speciafoldine)
  → 1 cp/jour jusqu'à 12 SA minimum
☐ Débuter idéalement avant conception

FER + VITAMINE B9 :
☐ TARDYFERON B9 - 1 cp/jour
☐ Ou FER AP-HP + ACIDE FOLIQUE
☐ Prendre à distance des repas (absorption optimale)

VITAMINE D :
☐ VITAMINE D 100 000 UI - 1 ampoule
  → Au 6ème mois de grossesse
☐ VITAMINE D 100 000 UI - 1 ampoule
  → Au 7ème mois de grossesse

MAGNÉSIUM (Si crampes, contractions) :
☐ MAGNESIUM 300mg - 1-2 cp/jour

CONSEILS ALIMENTAIRES :
☐ Alimentation variée et équilibrée
☐ Pas d'alcool ☐ Pas de tabac
☐ Poisson 2x/semaine (sauf prédateurs)
☐ Viande bien cuite
☐ Laver fruits et légumes
☐ Éviter fromages lait cru, charcuterie

SURVEILLANCE :
☐ Dosage fer à 6 mois si anémie
☐ Consultation mensuelle

Prochain RDV : [ ]`,
    tags: ['grossesse', 'vitamines', 'acide folique']
  },

  // GROSSESSE - Nausées
  {
    id: 'grossesse-nausees',
    titre: 'Nausées de Grossesse',
    nom: 'Nausées de Grossesse',
    categorie: 'Grossesse',
    description: 'Ordonnance pour traitement des nausées et vomissements de grossesse',
    motif: 'nausées',
    type_consultation: 'prenatale',
    medicaments: [],
    contenu: `=== ORDONNANCE - NAUSÉES GROSSESSE ===

TRAITEMENT ANTIÉMÉTIQUE :
☐ VOGALENE 5mg - 1cp 3x/jour avant repas
  → Maximum 15 jours
☐ Ou PRIMPERAN 10mg - 1cp 3x/jour avant repas
☐ Ou MOTILIUM 10mg - 1cp 3x/jour

TRAITEMENT SYMPTOMATIQUE :
☐ SPASFON 80mg - Si besoin (crampes)
☐ VITAMINE B6 40mg - 1cp 3x/jour

MESURES NON MÉDICAMENTEUSES :
☐ Fractionner repas (5-6 petits repas/jour)
☐ Éviter estomac vide
☐ Biscuits secs au réveil avant de se lever
☐ Privilégier aliments froids
☐ Éviter aliments gras, épicés, odorants
☐ Gingembre (tisane, bonbons)
☐ Repos suffisant

SURVEILLANCE :
☐ Amélioration attendue après 12-14 SA
☐ Consultation urgente si :
  • Vomissements incoercibles
  • Perte de poids > 5%
  • Impossibilité s'alimenter/s'hydrater
  • Signes déshydratation

CONSEILS :
☐ Éviter déclencheurs (odeurs, aliments)
☐ Rester hydratée (petites quantités fréquentes)
☐ Ne pas hésiter à reconsulter si aggravation

Prochain RDV : [ ]`,
    tags: ['grossesse', 'nausées', 'premier trimestre']
  },

  // POST-PARTUM - Allaitement
  {
    id: 'allaitement-crevasses',
    titre: 'Crevasses Allaitement',
    nom: 'Crevasses Allaitement',
    categorie: 'Allaitement',
    description: 'Ordonnance pour traitement des crevasses du mamelon pendant l\'allaitement',
    motif: 'allaitement',
    type_consultation: 'postnatale',
    medicaments: [],
    contenu: `=== ORDONNANCE - CREVASSES ALLAITEMENT ===

TRAITEMENT LOCAL :
☐ LANOLINE PURE (LANSINOH) - 1 tube
  → Appliquer après chaque tétée
  → Pas besoin de rincer avant tétée suivante
☐ Coquilles d'allaitement - 1 paire
  → Protéger mamelons entre tétées

TRAITEMENT ANTALGIQUE :
☐ PARACETAMOL 1g - 1cp si douleur
  → Maximum 3g/jour
  → Compatible allaitement

CONSEILS ALLAITEMENT :
☐ Vérifier position bébé (bon alignement)
☐ Bouche largement ouverte, aréole dans bouche
☐ Alterner sein de démarrage
☐ Laisser sécher mamelons à l'air après tétée
☐ Éviter coussinets humides
☐ Pas de savon sur mamelons
☐ Exprimer quelques gouttes lait sur crevasses (cicatrisant)

SIGNES D'ALERTE :
☐ Consultation si : fièvre, rougeur, induration (mastite)
☐ Consultation sage-femme si difficultés position
☐ Vérifier frein de langue bébé si crevasses persistantes

SOUTIEN :
☐ Consultation sage-femme à domicile possible
☐ Consultante lactation si besoin
☐ Groupe soutien allaitement

Prochain RDV : [ ]`,
    tags: ['allaitement', 'crevasses', 'post-partum']
  },

  // POST-PARTUM - Rééducation
  {
    id: 'reeducation-perineale',
    titre: 'Rééducation Périnéale',
    nom: 'Rééducation Périnéale',
    categorie: 'Rééducation',
    description: 'Ordonnance pour séances de rééducation périnéale post-partum',
    motif: 'rééducation',
    type_consultation: 'postnatale',
    medicaments: [],
    contenu: `=== ORDONNANCE - RÉÉDUCATION PÉRINÉALE ===

PRESCRIPTION :
☐ RÉÉDUCATION PÉRINÉO-SPHINCTÉRIENNE
☐ 10 séances (renouvelable si besoin)

PRATICIEN :
☐ Sage-femme
☐ Kinésithérapeute spécialisé

DÉBUT SÉANCES :
☐ 6-8 semaines post-accouchement
☐ Après consultation post-natale
☐ Après cicatrisation périnée

INDICATIONS :
☐ Suite accouchement voie basse
☐ Épisiotomie / Déchirure
☐ Incontinence urinaire d'effort
☐ Pesanteur pelvienne
☐ Dyspareunie
☐ Prévention descente organes

TECHNIQUES POSSIBLES :
☐ Rééducation manuelle
☐ Biofeedback
☐ Électrostimulation
☐ Méthode Pilates périnéal

CONSEILS :
☐ Éviter port charges lourdes
☐ Traiter constipation
☐ Contractions périnée quotidiennes
☐ Arrêt sport impact (course) jusqu'à rééducation
☐ Reprise progressive activité sportive

SURVEILLANCE :
☐ Évaluation testing périnéal initial
☐ Réévaluation en fin de séances
☐ Consultation gynéco 3-4 mois post-partum

Prochain RDV : 3-4 mois post-partum [ ]`,
    tags: ['rééducation', 'périnée', 'post-partum']
  },

  // TROUBLES DU CYCLE
  {
    id: 'dysmenorrhee',
    titre: 'Douleurs Menstruelles',
    nom: 'Douleurs Menstruelles',
    categorie: 'Gynécologie',
    description: 'Ordonnance pour traitement de la dysménorrhée (règles douloureuses)',
    motif: 'règles douloureuses',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - DYSMÉNORRHÉE (Règles douloureuses) ===

TRAITEMENT ANTALGIQUE :
☐ IBUPROFENE 400mg - 1cp toutes les 6-8h si besoin
  → Débuter dès début règles ou douleur
  → Prendre pendant repas
  → Maximum 1200mg/jour
☐ Ou KETOPROFENE 50mg - 1cp 3x/jour pendant repas

TRAITEMENT ANTISPASMODIQUE :
☐ SPASFON 80mg - 1-2cp 3x/jour si besoin

TRAITEMENT DE FOND (si échec antalgiques) :
☐ Contraception estroprogestative
☐ DIU hormonal (Mirena)
☐ Selon bilan et souhait contraception

MESURES NON MÉDICAMENTEUSES :
☐ Application chaleur (bouillotte)
☐ Activité physique régulière
☐ Relaxation, yoga
☐ Massage abdominal
☐ Éviter stress

EXAMENS COMPLÉMENTAIRES :
☐ Échographie pelvienne si :
  • Dysménorrhée secondaire (début tardif)
  • Résistance traitement
  • Signes associés (dyspareunie, métrorragies)
  • Recherche endométriose

SURVEILLANCE :
☐ Évaluer efficacité traitement
☐ Bilan si douleurs résistantes
☐ Rechercher endométriose si :
  • Dysménorrhée sévère
  • Dyspareunie profonde
  • Troubles fertilité

Prochain RDV : 3 mois ou si inefficacité [ ]`,
    tags: ['dysménorrhée', 'règles douloureuses']
  },
  {
    id: 'menorragies',
    titre: 'Règles Abondantes',
    nom: 'Règles Abondantes',
    categorie: 'Gynécologie',
    description: 'Ordonnance pour traitement des ménorragies (règles abondantes)',
    motif: 'règles abondantes',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - MÉNORRAGIES (Règles abondantes) ===

TRAITEMENT HÉMOSTATIQUE :
☐ EXACYL 500mg - 1cp 3x/jour pendant règles
  → Maximum 4 jours consécutifs/cycle
☐ Ou EXACYL 1g - 1 sachet 3x/jour pendant règles

SUPPLÉMENTATION MARTIALE :
☐ FER TARDYFERON 80mg - 1cp/jour en continu
  → Prendre à distance repas
  → Durée 3-6 mois

TRAITEMENT DE FOND (selon bilan) :
☐ DIU hormonal Mirena (traitement de référence)
☐ Contraception estroprogestative continue
☐ Progestatifs cycliques J16-J25

CONSEILS ALIMENTAIRES :
☐ Alimentation riche en fer :
  • Viande rouge, boudin noir
  • Lentilles, épinards
  • Vitamine C (favorise absorption fer)
☐ Éviter thé pendant repas (inhibe absorption fer)

EXAMENS COMPLÉMENTAIRES :
☐ NFS (recherche anémie)
☐ Ferritinémie
☐ Échographie pelvienne :
  • Recherche fibrome, polype, adénomyose
  • Mesure épaisseur endomètre
☐ Hystéroscopie si anomalie échographique

SURVEILLANCE :
☐ Contrôle NFS à 3 mois
☐ Évaluer efficacité traitement
☐ Quantifier flux menstruel (score Higham)

CRITÈRES GRAVITÉ :
☐ Consultation urgente si :
  • Anémie symptomatique (fatigue intense, pâleur)
  • Hémorragie aiguë nécessitant protections > 1/heure

Prochain RDV : 3 mois (contrôle NFS) [ ]`,
    tags: ['ménorragies', 'règles abondantes']
  },

  // MÉNOPAUSE
  {
    id: 'menopause-ths',
    titre: 'THS Ménopause',
    nom: 'THS Ménopause',
    categorie: 'Ménopause',
    description: 'Ordonnance pour traitement hormonal substitutif de la ménopause',
    motif: 'ménopause',
    type_consultation: 'gyneco',
    medicaments: [],
    contenu: `=== ORDONNANCE - TRAITEMENT HORMONAL SUBSTITUTIF ===

INDICATION :
☐ Bouffées chaleur invalidantes
☐ Sueurs nocturnes
☐ Troubles génito-urinaires (sécheresse, atrophie)
☐ Altération qualité de vie

TRAITEMENT PRESCRIT (Choisir selon profil) :
☐ CLIMASTON - 1cp/jour en continu
☐ Ou ESTREVA gel 0,5mg + UTROGESTAN 100mg
  → Gel : 1 pression/jour
  → Utrogestan : 1cp/jour J1-J25 ou continu

☐ Ou CLIMENE - 1cp/jour (séquentiel)

CONTRE-INDICATIONS VÉRIFIÉES :
☐ Cancer sein/endomètre ☐ Antécédent thrombose
☐ Maladie thromboembolique ☐ Saignements inexpliqués
☐ Hépatopathie sévère

SURVEILLANCE OBLIGATOIRE :
☐ Examen seins + mammographie avant THS
☐ Mammographie tous les 2 ans sous THS
☐ Examen gynéco annuel
☐ Bilan lipidique initial puis si facteurs risque
☐ Glycémie, TA

CONSEILS DONNÉS :
☐ Durée THS : la plus courte possible
☐ Dose minimale efficace
☐ Réévaluation bénéfice/risque annuelle
☐ Arrêt progressif après quelques années
☐ Autopalpation seins mensuelle

ALTERNATIVES NON HORMONALES :
☐ Phytoestrogènes (si refus THS)
☐ Traitements locaux sécheresse vaginale
☐ Mesures hygiéno-diététiques

RÉÉVALUATION :
☐ Consultation à 3 mois (tolérance, efficacité)
☐ Puis annuelle avec mammographie
☐ Arrêt si effets secondaires ou contre-indication

Prochain RDV : 3 mois puis annuel [ ]`,
    tags: ['ménopause', 'THS', 'bouffées chaleur']
  },
]

export function getOrdonnanceSuggestions(motif: string, typeConsultation: string): OrdonnanceTemplate[] {
  const motifLower = motif.toLowerCase()
  return ORDONNANCE_TEMPLATES.filter(t => {
    const matchType = t.type_consultation === typeConsultation || t.type_consultation === 'all'
    const matchMotif = t.motif.toLowerCase().includes(motifLower) ||
                       motifLower.includes(t.motif.toLowerCase()) ||
                       t.tags.some(tag => motifLower.includes(tag.toLowerCase()))
    return matchType && matchMotif
  })
}
