// Templates d'observations pré-remplies pour les consultations

export interface ObservationTemplate {
  name: string
  type: 'prenatale' | 'gyneco' | 'postnatale' | 'reeducation' | 'autre'
  saMin?: number
  saMax?: number
  template: string
}

// Fonction helper pour générer le template avec les valeurs
export function generateObservationFromData(
  template: string,
  data: {
    sa?: { weeks: number; days: number }
    poids?: number
    poidsAnterieur?: number
    tension?: { systolique: number; diastolique: number }
    hauteurUterine?: number
    hauteurUterineAttendue?: number
    bdc?: number
    [key: string]: any
  }
): string {
  let result = template

  // Remplacer les variables
  if (data.sa) {
    result = result.replace(/\$\{SA\}/g, `${data.sa.weeks} SA + ${data.sa.days} jours`)
    result = result.replace(/\$\{SA_semaines\}/g, String(data.sa.weeks))
  }

  if (data.poids) {
    result = result.replace(/\$\{poids\}/g, String(data.poids))
    if (data.poidsAnterieur) {
      const variation = data.poids - data.poidsAnterieur
      const signe = variation >= 0 ? '+' : ''
      result = result.replace(/\$\{variation_poids\}/g, `${signe}${variation.toFixed(1)} kg`)
    } else {
      result = result.replace(/\$\{variation_poids\}/g, '')
    }
  }

  if (data.tension) {
    result = result.replace(/\$\{TA\}/g, `${data.tension.systolique}/${data.tension.diastolique}`)
  }

  if (data.hauteurUterine) {
    result = result.replace(/\$\{HU\}/g, String(data.hauteurUterine))
    if (data.hauteurUterineAttendue) {
      const diff = data.hauteurUterine - data.hauteurUterineAttendue
      const conformite =
        Math.abs(diff) <= 2 ? 'conforme' : diff > 2 ? 'supérieure à la normale' : 'inférieure à la normale'
      result = result.replace(/\$\{HU_conformite\}/g, conformite)
    }
  }

  if (data.bdc) {
    result = result.replace(/\$\{BDC\}/g, String(data.bdc))
  }

  return result
}

// Templates pour consultations prénatales par terme
export const observationTemplatesPrenatale: ObservationTemplate[] = [
  {
    name: 'Consultation prénatale 1er trimestre (< 14 SA)',
    type: 'prenatale',
    saMin: 0,
    saMax: 14,
    template: `=== CONSULTATION PRÉNATALE - \${SA} ===

MOTIF DE CONSULTATION :
[ À compléter ]

PLAINTES / SYMPTÔMES :
☐ Nausées/vomissements
☐ Asthénie importante
☐ Saignements
☐ Douleurs pelviennes
☐ Leucorrhées
☐ Troubles du sommeil
☐ Autres : [ ]

ANTÉCÉDENTS :
☐ Revus et actualisés dans le dossier

EXAMEN CLINIQUE :
- Poids : \${poids} kg \${variation_poids}
- IMC : [ ] (normal 18.5-25)
- TA : \${TA} mmHg
- Examen général : [ Normal / Particularité : ]

EXAMEN OBSTÉTRICAL :
- Hauteur utérine : Non mesurable < 12 SA / [ ] cm
- Bruits du cœur fœtal : ☐ Perçus au doppler (dès 10 SA) ☐ Non encore perçus
- Toucher vaginal : ☐ Non fait ☐ Col long postérieur fermé

BANDELETTE URINAIRE :
☐ Négative
☐ Protéinurie : [ ]
☐ Leucocytes : [ ]
☐ Nitrites : [ ]

EXAMENS PRESCRITS / À PROGRAMMER :
☐ Échographie de datation (11-14 SA) - Mesure clarté nucale
☐ Bilan sanguin T1 : NFS, groupe, RAI, sérologies (toxo, rubéole, syphilis, VIH, VHB, VHC)
☐ TSH si antécédents thyroïdiens
☐ Dépistage trisomie 21 : ☐ Proposé ☐ Accepté ☐ Refusé

VACCINATION :
☐ Coqueluche à jour ? (dTcaPolio entre 20-36 SA recommandé)

CONSEILS HYGIÉNO-DIÉTÉTIQUES :
☐ Supplémentation acide folique 400μg/j (jusqu'à 12 SA)
☐ Vitamine D 400-800 UI/j
☐ Éviction toxoplasmose si sérologie négative (viande, fruits/légumes crus)
☐ Arrêt tabac/alcool/toxiques
☐ Activité physique modérée recommandée

CONCLUSION :
☐ Grossesse évoluant normalement à ce jour
☐ Points de vigilance : [ ]

PROCHAIN RDV :
Dans 4 semaines / Date : [ ]`,
  },
  {
    name: 'Consultation prénatale 2ème trimestre précoce (15-20 SA)',
    type: 'prenatale',
    saMin: 15,
    saMax: 20,
    template: `=== CONSULTATION PRÉNATALE - \${SA} ===

MOTIF DE CONSULTATION :
[ À compléter ]

PLAINTES / SYMPTÔMES :
☐ Mouvements actifs fœtaux : ☐ Perçus (dès 18-20 SA) ☐ Non encore
☐ Contractions utérines
☐ Saignements
☐ Leucorrhées
☐ Troubles urinaires (pollakiurie, brûlures)
☐ Douleurs ligamentaires
☐ Reflux gastrique
☐ Autres : [ ]

EXAMEN CLINIQUE :
- Poids : \${poids} kg \${variation_poids}
- TA : \${TA} mmHg
- Œdèmes MI : ☐ Absents ☐ Discrets ☐ Importants

EXAMEN OBSTÉTRICAL :
- Hauteur utérine : \${HU} cm (\${HU_conformite})
- Bruits du cœur fœtaux : \${BDC} bpm (normal 120-160)
- Mouvements actifs fœtaux : ☐ Perçus normalement
- Présentation : [ Non déterminable à ce terme ]
- Tonus utérin : ☐ Normal ☐ Contractile

BANDELETTE URINAIRE :
☐ Négative
☐ Protéinurie : [ ]
☐ Glycosurie : [ ]
☐ Leucocytes : [ ]

RÉSULTATS EXAMENS :
☐ Écho T2 (22 SA) : ☐ À programmer ☐ Réalisée le [ ] - Résultat : [ ]
☐ Sérologies T1 : [ À vérifier ]
☐ Toxoplasmose si négatif : Contrôle mensuel

EXAMENS À PROGRAMMER :
☐ Échographie morphologique T2 (22-24 SA)
☐ Sérologies à recontrôler si besoin

SUPPLÉMENTATION :
☐ Fer si ferritine < 30 ou anémie
☐ Vitamine D (poursuite)

CONSEILS :
☐ Éviction toxoplasmose si négative
☐ Signes d'alerte : contractions régulières, saignements, perte liquide
☐ Préparation à la naissance : ☐ Inscrite ☐ À proposer

CONCLUSION :
☐ Grossesse évoluant normalement
☐ Points de vigilance : [ ]

PROCHAIN RDV :
Dans 4 semaines / Date : [ ]`,
  },
  {
    name: 'Consultation prénatale 2ème trimestre tardif (21-28 SA)',
    type: 'prenatale',
    saMin: 21,
    saMax: 28,
    template: `=== CONSULTATION PRÉNATALE - \${SA} ===

MOTIF DE CONSULTATION :
[ À compléter ]

PLAINTES / SYMPTÔMES :
☐ Mouvements actifs fœtaux : ☐ Normaux ☐ Diminués (URGENT si diminution)
☐ Contractions utérines : ☐ Absentes ☐ Rares ☐ Fréquentes
☐ Saignements
☐ Leucorrhées / Perte de liquide
☐ Troubles digestifs (RGO, constipation)
☐ Crampes nocturnes
☐ Syndrome du canal carpien
☐ Autres : [ ]

EXAMEN CLINIQUE :
- Poids : \${poids} kg \${variation_poids} (Prise de poids totale : [ ] kg)
- TA : \${TA} mmHg (⚠️ Si > 140/90 : HTA gravidique ?)
- Œdèmes MI : ☐ Absents ☐ Discrets ☐ Importants (⚠️ si important + HTA)
- Réflexes ostéo-tendineux : ☐ Normaux ☐ Vifs (si HTA)

EXAMEN OBSTÉTRICAL :
- Hauteur utérine : \${HU} cm (\${HU_conformite})
- Bruits du cœur fœtaux : \${BDC} bpm
- Mouvements actifs fœtaux : ☐ Perçus normalement ☐ Diminués
- Présentation : ☐ Céphalique ☐ Siège ☐ Transverse ☐ Non déterminée
- Tonus utérin : ☐ Souple ☐ Contractile
- Col (si indication) : [ ]

BANDELETTE URINAIRE :
☐ Négative
☐ Protéinurie : [ ] (⚠️ Si + avec HTA : suspicion prééclampsie)
☐ Glycosurie : [ ] (Si + : contrôle glycémies)

DÉPISTAGE DIABÈTE GESTATIONNEL (24-28 SA) :
☐ HGPO 75g prescrite / réalisée le [ ]
☐ Résultat : [ ] (Normal si T0 < 0.92, T1h < 1.80, T2h < 1.53 g/L)
☐ Diabète gestationnel : ☐ Non ☐ Oui → Prise en charge diététique + diabéto

RÉSULTATS EXAMENS :
☐ Écho T2 : [ Date ] - Biométrie : [ ] - Liquide amniotique : [ ]
☐ RAI si Rhésus négatif : [ ] - Injection Rhophylac® : ☐ À faire à 28 SA

EXAMENS À PROGRAMMER :
☐ NFS T2 (recherche anémie)
☐ RAI si Rhésus - (à 28 SA)
☐ Écho T3 (32 SA)

PRÉVENTION :
☐ Injection Rhophylac® 300μg si Rhésus négatif (28 SA)
☐ Vaccination coqueluche : ☐ À jour ☐ À programmer (20-36 SA)

PRÉPARATION NAISSANCE :
☐ Séances PNP : [ ] / 8 effectuées
☐ Inscription maternité : ☐ Faite ☐ À faire
☐ Projet de naissance discuté

CONCLUSION :
☐ Grossesse évoluant normalement
☐ Points de vigilance : [ ]

PROCHAIN RDV :
Dans 3-4 semaines / Date : [ ]`,
  },
  {
    name: 'Consultation prénatale 3ème trimestre (29-36 SA)',
    type: 'prenatale',
    saMin: 29,
    saMax: 36,
    template: `=== CONSULTATION PRÉNATALE - \${SA} ===

MOTIF DE CONSULTATION :
[ À compléter ]

PLAINTES / SYMPTÔMES :
☐ Mouvements actifs fœtaux : ☐ Normaux ☐ Diminués ⚠️
☐ Contractions : ☐ Rares ☐ Régulières (MAP si > 10/j avant 37 SA)
☐ Perte liquide / Rupture poche des eaux : ☐ Non ☐ Oui ⚠️
☐ Saignements
☐ Troubles visuels (scotomes, phosphènes) - ⚠️ Si HTA
☐ Céphalées persistantes
☐ Douleurs épigastriques / barre - ⚠️ Si HTA
☐ Essoufflement, dyspnée
☐ Syndrome du canal carpien
☐ Sciatique, lombalgies
☐ Contractions de Braxton-Hicks (fausses contractions)

EXAMEN CLINIQUE :
- Poids : \${poids} kg \${variation_poids} (Prise totale : [ ] kg)
- TA : \${TA} mmHg (⚠️ > 140/90 : HTA - > 160/110 : HTA sévère)
- Œdèmes : ☐ Absents ☐ Chevilles ☐ Généralisés (mains, visage)
- ROT : ☐ Normaux ☐ Vifs / polycinétiques (⚠️ signe gravité si HTA)

EXAMEN OBSTÉTRICAL :
- Hauteur utérine : \${HU} cm (\${HU_conformite})
- Bruits du cœur fœtaux : \${BDC} bpm
- Mouvements actifs fœtaux : ☐ Normaux ☐ Diminués (→ Monitoring)
- Présentation : ☐ Céphalique ☐ Siège (version par manœuvre externe ?)
- Engagement : ☐ Mobile ☐ Fixé ☐ Engagé
- Tonus utérin : ☐ Souple ☐ Contractile
- Estimation poids fœtal : [ ] g (écho)

TOUCHER VAGINAL (si indication) :
- Col : [ ] cm, [ ]% effacé, consistance [ ], position [ ]
- Présentation : [ ]

BANDELETTE URINAIRE :
☐ Négative
☐ Protéinurie : [ ] (⚠️ + HTA + signes = prééclampsie → URGENCE)
☐ Glycosurie : [ ]
☐ Leucocytes : [ ]

MONITORING FŒTAL (si indication) :
☐ Non fait
☐ RCF : [ ]
- Rythme de base : [ ] bpm
- Variabilité : ☐ Normale ☐ Réduite
- Accélérations : ☐ Présentes ☐ Absentes
- Décélérations : ☐ Absentes ☐ Présentes [ type ]
- Conclusion : ☐ Rassurant ☐ Non rassurant → Avis obstétricien

RÉSULTATS EXAMENS :
☐ Écho T3 : [ Date ] - Biométrie : [ ] - Liquide amniotique : [ ]
☐ NFS : Hb [ ] g/dL (anémie si < 10.5)
☐ Streptocoque B (35-37 SA) : ☐ À faire ☐ Positif ☐ Négatif

EXAMENS À PROGRAMMER :
☐ Prélèvement streptocoque B (35-37 SA)
☐ Consultation anesthésie (avant 37 SA) : ☐ Programmée le [ ]
☐ Écho croissance si indication (RCIU, diabète, macrosomie)
☐ RAI si Rhésus négatif (contrôle mensuel)

PRÉPARATION ACCOUCHEMENT :
☐ Séances PNP : [ ] / 8
☐ Valise maternité préparée
☐ Inscription maternité : ☐ OK
☐ Consultation anesthésie : ☐ Faite ☐ À programmer
☐ Lieu d'accouchement choisi : [ ]
☐ Projet de naissance : ☐ Discuté ☐ À aborder

SIGNAUX D'ALERTE RAPPELÉS :
☐ Contractions régulières > 10/jour avant 37 SA
☐ Perte de liquide / rupture poche
☐ Saignements
☐ Diminution mouvements fœtaux
☐ Troubles visuels, céphalées, douleurs épigastriques
☐ Fièvre > 38°C

CONCLUSION :
☐ Grossesse évoluant normalement
☐ Terme proche : surveillance rapprochée
☐ Points de vigilance : [ ]

PROCHAIN RDV :
Dans 2-3 semaines / Date : [ ]
Si ≥ 37 SA : surveillance hebdomadaire`,
  },
  {
    name: 'Consultation prénatale à terme (≥ 37 SA)',
    type: 'prenatale',
    saMin: 37,
    saMax: 45,
    template: `=== CONSULTATION PRÉNATALE À TERME - \${SA} ===

MOTIF DE CONSULTATION :
☐ Suivi à terme
☐ Suspicion travail
☐ Dépassement terme
☐ Autre : [ ]

CONTRACTIONS :
☐ Absentes
☐ Irrégulières (Braxton-Hicks)
☐ Régulières : Fréquence [ ] / 10 min - Durée [ ] sec
  → Si contractions régulières douloureuses : TRAVAIL ?

PERTE DE LIQUIDE :
☐ Non
☐ Oui - Heure : [ ] - Aspect : ☐ Clair ☐ Teinté ☐ Méconial ⚠️

PERTE DU BOUCHON MUQUEUX :
☐ Non
☐ Oui - Date : [ ]

MOUVEMENTS ACTIFS FŒTAUX :
☐ Normaux (≥ 10 mouvements par jour)
☐ Diminués ⚠️ → Monitoring urgent

EXAMEN CLINIQUE :
- Poids : \${poids} kg (Prise totale : [ ] kg)
- TA : \${TA} mmHg
- Œdèmes : ☐ Absents ☐ Présents [ localisation ]

EXAMEN OBSTÉTRICAL :
- Hauteur utérine : \${HU} cm
- BDC : \${BDC} bpm
- Mouvements actifs fœtaux : ☐ Perçus
- Présentation : ☐ Céphalique ☐ Siège (⚠️ césarienne programmée ?)
- Engagement : ☐ Mobile ☐ Fixé ☐ Engagé
- Estimation poids fœtal : [ ] g (clinique/écho)

TOUCHER VAGINAL :
- Col : [ ] cm de longueur
- Dilatation : [ ] cm (0-10)
- Effacement : [ ]% (0-100%)
- Consistance : ☐ Ferme ☐ Mou
- Position : ☐ Postérieur ☐ Intermédiaire ☐ Antérieur
- Score de Bishop : [ ] / 13 (≥6 = favorable)
- Présentation : [ ] - Niveau [ ]
- Membranes : ☐ Intactes ☐ Rompues

BANDELETTE URINAIRE :
☐ Négative
☐ Protéinurie : [ ]

MONITORING FŒTAL (OBLIGATOIRE à terme) :
Durée : [ ] min
- Rythme de base : [ ] bpm (normal 110-160)
- Variabilité : ☐ Normale (5-25 bpm) ☐ Réduite ☐ Absente ⚠️
- Accélérations : ☐ Présentes (bon signe) ☐ Absentes
- Décélérations : ☐ Absentes ☐ Présentes [ type ]
- Contractions : ☐ Absentes ☐ Présentes [ fréquence ]
- CONCLUSION RCF : ☐ RASSURANT ☐ NON RASSURANT ⚠️

ÉCHOGRAPHIE (si disponible) :
☐ Non faite
☐ Biométrie : [ ]
☐ Liquide amniotique : ☐ Normal ☐ Oligoamnios ☐ Hydramnios
☐ Placenta : Grade [ ] - Position [ ]
☐ Doppler : ☐ Normal ☐ Anormal

SI DÉPASSEMENT TERME (≥ 41 SA) :
⚠️ SURVEILLANCE RAPPROCHÉE
☐ Monitoring 2x/semaine
☐ Échographie : liquide amniotique + Doppler
☐ Déclenchement à discuter : ☐ Programmé le [ ]
☐ Conditions favorables : Score Bishop ≥ 6

RÉSULTATS :
☐ Strepto B : ☐ Négatif ☐ Positif (ATB pendant travail)
☐ Consultation anesthésie : ☐ Faite

PRÉPARATION :
☐ Valise maternité : ☐ Prête
☐ Maternité : [ Nom ] - Tél : [ ]
☐ Moyen de transport organisé
☐ Personne accompagnante : [ ]

SIGNAUX D'ALERTE - QUAND VENIR À LA MATERNITÉ :
☐ Contractions régulières toutes les 5 min depuis 1h (ou 10 min si ≥ 2e enfant)
☐ Perte de liquide (rupture poche des eaux)
☐ Saignements rouges abondants
☐ Diminution ou absence de mouvements fœtaux
☐ Fièvre > 38°C

CONCLUSION :
☐ Grossesse à terme évoluant normalement - En attente de travail spontané
☐ Col favorable : travail imminent possible
☐ Dépassement de terme : surveillance rapprochée
☐ Orientation : [ ]

PROCHAIN RDV :
☐ Si < 41 SA : dans 1 semaine
☐ Si ≥ 41 SA : dans 2-3 jours + monitoring
☐ Déclenchement programmé le : [ ]`,
  },
]

// Templates pour consultations gynécologiques
export const observationTemplatesGyneco: ObservationTemplate[] = [
  {
    name: 'Consultation gynécologique de suivi',
    type: 'gyneco',
    template: `=== CONSULTATION GYNÉCOLOGIQUE ===

MOTIF DE CONSULTATION :
[ À compléter ]

CYCLE MENSTRUEL :
- Date des dernières règles (DDR) : [ ]
- Durée du cycle : [ ] jours (normal 21-35j)
- Régularité : ☐ Régulier ☐ Irrégulier ☐ Aménorrhée
- Durée des règles : [ ] jours (normal 3-7j)
- Abondance : ☐ Normale ☐ Abondante ☐ Faible
- Dysménorrhée : ☐ Absente ☐ Légère ☐ Modérée ☐ Sévère
- Syndrome prémenstruel : ☐ Absent ☐ Présent [ symptômes ]

CONTRACEPTION :
- Méthode actuelle : [ ]
- Depuis : [ ]
- Satisfaction : ☐ Satisfaite ☐ Souhaite changer
- Observance : ☐ Bonne ☐ Oublis fréquents
- Effets secondaires : ☐ Aucun ☐ [ À préciser ]
- Changement souhaité : ☐ Non ☐ Oui → [ Nouveau choix ]

SEXUALITÉ :
- Rapports sexuels : ☐ Oui ☐ Non
- Dyspareunie : ☐ Non ☐ Oui (superficielle/profonde)
- Sécheresse vaginale : ☐ Non ☐ Oui
- Libido : ☐ Normale ☐ Diminuée ☐ Augmentée
- Difficultés : [ ]

SYMPTÔMES GYNÉCOLOGIQUES :
☐ Leucorrhées : ☐ Absentes ☐ Physiologiques ☐ Pathologiques
  → Si pathologiques : Aspect [ ], odeur [ ], prurit ☐
☐ Saignements hors règles (métrorragies)
☐ Douleurs pelviennes
☐ Mastodynies (douleurs seins)
☐ Troubles urinaires
☐ Troubles digestifs

DÉPISTAGE CANCER DU COL :
- Dernier frottis : [ Date ]
- Résultat : ☐ Normal ☐ ASC-US ☐ LSIL ☐ HSIL ☐ Autre
- Test HPV : ☐ Non fait ☐ Négatif ☐ Positif (génotype [ ])
- Prochain frottis :
  ☐ Si normal et < 30 ans : 3 ans
  ☐ Si normal et ≥ 30 ans avec HPV - : 5 ans
  ☐ Surveillance rapprochée si anomalie

DÉPISTAGE CANCER DU SEIN :
- Autopalpation : ☐ Réalisée ☐ À enseigner
- Dernière mammographie (si > 40 ans) : [ ]
- Échographie mammaire : [ ]
- Antécédents familiaux cancer sein/ovaire : ☐ Non ☐ Oui [ ]

ANTÉCÉDENTS OBSTÉTRICAUX :
- Gestité : [ ] (nombre de grossesses)
- Parité : [ ] (nombre d'accouchements)
- Fausses couches : [ ]
- IVG : [ ]
- Grossesses extra-utérines : [ ]

EXAMEN CLINIQUE GÉNÉRAL :
- Poids : [ ] kg - Taille : [ ] cm - IMC : [ ]
- TA : [ ] / [ ] mmHg
- État général : [ ]

EXAMEN DES SEINS :
- Inspection : ☐ Normale ☐ Rétraction ☐ Asymétrie
- Palpation quadrant par quadrant :
  ☐ Seins souples, sans masse palpable
  ☐ Nodule : Localisation [ ], taille [ ], mobilité [ ]
- Mamelons : ☐ Normaux ☐ Rétractés ☐ Écoulement
- Aires ganglionnaires : ☐ Libres ☐ Adénopathie

EXAMEN AU SPÉCULUM :
- Vulve : ☐ Normale ☐ Lésion [ ]
- Vagin : ☐ Normal ☐ Atrophie ☐ Inflammation
- Col : ☐ Normal ☐ Ectropion ☐ Lésion [ ]
- Leucorrhées : ☐ Absentes ☐ Présentes [ aspect ]
- Frottis réalisé : ☐ Non ☐ Oui

TOUCHER VAGINAL :
- Col : ☐ Fermé ☐ Perméable - Consistance [ ] - Mobilité [ ]
- Utérus : Taille [ ], position [ ], mobilité [ ], sensibilité [ ]
- Annexes : ☐ Libres ☐ Masse palpable [ ]
- Cul-de-sac de Douglas : ☐ Libre ☐ Empâté ☐ Douloureux

EXAMENS COMPLÉMENTAIRES :
☐ Frottis cervico-vaginal
☐ Prélèvement vaginal (si leucorrhées pathologiques)
☐ Échographie pelvienne : ☐ Prescrite ☐ Non nécessaire
☐ Mammographie / Écho mammaire
☐ Bilan hormonal : [ ]
☐ Sérologies : [ ]

PRESCRIPTIONS :
☐ Contraception : [ ]
☐ Traitement local : [ ]
☐ Traitement hormonal : [ ]
☐ Autre : [ ]

CONSEILS / ÉDUCATION :
☐ Autopalpation des seins enseignée
☐ Prévention IST
☐ Hygiène intime
☐ Planification familiale
☐ Dépistage organisé cancer col/sein

CONCLUSION :
☐ Examen gynécologique normal
☐ Anomalie détectée : [ ] → Conduite à tenir : [ ]

PROCHAIN RDV :
☐ Suivi annuel
☐ Contrôle dans [ ] mois
☐ Résultats examens`,
  },
  {
    name: 'Bilan contraception',
    type: 'gyneco',
    template: `=== CONSULTATION - BILAN CONTRACEPTION ===

MOTIF :
☐ Primo-prescription
☐ Renouvellement
☐ Changement de contraception
☐ Autre : [ ]

SITUATION PERSONNELLE :
- Âge : [ ] ans
- Parité : [ ]
- En couple : ☐ Stable ☐ Occasionnel ☐ Célibataire
- Désir de grossesse : ☐ Non ☐ Différé [ dans combien de temps ]

CONTRACEPTION ACTUELLE :
- Méthode : [ ]
- Depuis : [ ]
- Observance : ☐ Bonne ☐ Oublis occasionnels ☐ Oublis fréquents
- Satisfaction : ☐ Satisfaite ☐ Souhaite changer

MOTIF DE CHANGEMENT (si applicable) :
☐ Effets secondaires : [ prise de poids, acné, saignements, baisse libido, etc. ]
☐ Contrainte d'utilisation (oublis pilule)
☐ Souhait contraception longue durée
☐ Désir de grossesse à venir
☐ Contre-indication apparue
☐ Autre : [ ]

ANTÉCÉDENTS PERSONNELS (contre-indications ?) :
☐ HTA : ☐ Non ☐ Oui → Éviter œstrogènes
☐ Migraines : ☐ Non ☐ Avec aura → CI œstrogènes ☐ Sans aura → Précaution
☐ Diabète : ☐ Non ☐ Oui
☐ Thrombose veineuse / embolie pulmonaire : ☐ Non ☐ Oui → CI œstrogènes
☐ AVC / infarctus : ☐ Non ☐ Oui → CI œstrogènes
☐ Cancer sein / utérus : ☐ Non ☐ Oui → CI hormonal
☐ Lupus, SAPL : ☐ Non ☐ Oui
☐ Épilepsie : ☐ Non ☐ Oui (interactions médicamenteuses)
☐ Obésité : IMC [ ] → Si > 35 : précaution œstrogènes
☐ Varices importantes : ☐ Non ☐ Oui

ANTÉCÉDENTS FAMILIAUX :
☐ Thrombose avant 50 ans : ☐ Non ☐ Oui → Précaution œstrogènes
☐ AVC, infarctus précoce : ☐ Non ☐ Oui
☐ Cancer sein/ovaire : ☐ Non ☐ Oui

TABAC :
☐ Non-fumeuse
☐ Fumeuse : [ ] cigarettes/jour
  → Si ≥ 35 ans + tabac : CONTRE-INDICATION œstrogènes

EXAMEN CLINIQUE :
- Poids : [ ] kg - IMC : [ ]
- TA : [ ] / [ ] mmHg (⚠️ si > 140/90 : éviter œstrogènes)
- Examen cardio-vasculaire : ☐ Normal
- Examen sein : ☐ Normal
- Examen gynéco : ☐ Normal ☐ Particularité : [ ]

CHOIX CONTRACEPTIF DISCUTÉ :

1. PILULE ŒSTROPROGESTATIVE :
   ☐ Efficacité 99% (si bonne observance)
   ☐ Avantages : régularise cycles, diminue acné, diminue risque cancer ovaire/endomètre
   ☐ Inconvénients : prise quotidienne, oublis, effets secondaires possibles
   ☐ Contre-indications : ☐ Aucune ☐ Présentes [ ]

2. PILULE MICROPROGESTATIVE :
   ☐ Avantages : pas d'œstrogènes, compatible allaitement
   ☐ Inconvénients : prise quotidienne stricte (< 3h retard), saignements irréguliers
   ☐ Indications : CI œstrogènes, allaitement

3. DIU (STÉRILET) :
   a) DIU hormonal (Mirena®, Kyleena®, Jaydess®) :
      ☐ Efficacité 99%, durée 3-5 ans
      ☐ Avantages : longue durée, diminue règles (aménorrhée possible)
      ☐ Inconvénients : spotting initial, risque expulsion, pose parfois douloureuse

   b) DIU cuivre :
      ☐ Efficacité 99%, durée 5-10 ans
      ☐ Avantages : pas d'hormones, longue durée
      ☐ Inconvénients : règles plus abondantes, dysménorrhée

4. IMPLANT (Nexplanon®) :
   ☐ Efficacité 99%, durée 3 ans
   ☐ Avantages : invisible, pose simple
   ☐ Inconvénients : saignements irréguliers fréquents

5. PRÉSERVATIF :
   ☐ Seule protection IST
   ☐ Efficacité 85% (usage typique)

6. AUTRES : Patch, anneau vaginal, diaphragme, spermicides

DÉCISION :
☐ Contraception choisie : [ ]
☐ Informations données : efficacité, mode d'emploi, effets secondaires
☐ Pose DIU/implant : ☐ Aujourd'hui ☐ Programmée le [ ]

PRESCRIPTIONS :
☐ Pilule : [ Nom ] - Prendre à heure fixe, démarrage [ ]
☐ DIU : [ Type ] - Pose prévue [ ]
☐ Implant : Pose programmée
☐ Préservatifs + contraception d'urgence (Norlevo®) si besoin

SURVEILLANCE :
☐ Contrôle dans 3 mois (adaptation)
☐ Consultation annuelle

CONSEILS DONNÉS :
☐ Conduite à tenir si oubli de pilule
☐ Signes d'alerte : céphalées, troubles visuels, douleur mollet
☐ Contraception d'urgence disponible en pharmacie
☐ Préservatif indispensable pour protection IST`,
  },
  {
    name: 'Consultation ménopause',
    type: 'gyneco',
    template: `=== CONSULTATION - MÉNOPAUSE ===

MOTIF :
☐ Bilan ménopause
☐ Troubles climatériques
☐ Traitement hormonal substitutif (THS)
☐ Autre : [ ]

STATUT MÉNOPAUSIQUE :
- Âge : [ ] ans
- Date dernières règles : [ ]
☐ Préménopause (cycles irréguliers)
☐ Périménopause (aménorrhée < 12 mois)
☐ Ménopause confirmée (aménorrhée ≥ 12 mois)
☐ Ménopause chirurgicale (hystérectomie + ovariectomie)

SYMPTÔMES CLIMATÉRIQUES :
☐ Bouffées de chaleur : ☐ Absentes ☐ Rares ☐ Fréquentes ☐ Invalidantes
  → Intensité : [ /10 ] - Fréquence : [ /jour ] - Impact qualité de vie : [ ]
☐ Sueurs nocturnes
☐ Troubles du sommeil : ☐ Endormissement ☐ Réveils nocturnes ☐ Insomnie
☐ Irritabilité, labilité émotionnelle
☐ Troubles de l'humeur, anxiété, dépression
☐ Troubles de la concentration, de la mémoire
☐ Fatigue
☐ Prise de poids : [ ] kg depuis ménopause
☐ Sécheresse vaginale, dyspareunie
☐ Baisse de la libido
☐ Troubles urinaires : pollakiurie, urgences, incontinence
☐ Douleurs articulaires
☐ Sécheresse cutanée, cheveux, ongles cassants

RETENTISSEMENT QUALITÉ DE VIE :
☐ Mineur
☐ Modéré
☐ Important, invalidant

ANTÉCÉDENTS OBSTÉTRICAUX :
- Gestité : [ ] - Parité : [ ]
- Âge 1ère grossesse : [ ] ans
- Allaitement : ☐ Oui [ durée ] ☐ Non

ANTÉCÉDENTS PERSONNELS :
☐ HTA : ☐ Non ☐ Oui (contrôlée ?)
☐ Diabète : ☐ Non ☐ Oui
☐ Dyslipidémie : ☐ Non ☐ Oui (traitée ?)
☐ Maladie cardio-vasculaire : ☐ Non ☐ Oui → CI THS
☐ AVC, phlébite, embolie pulmonaire : ☐ Non ☐ Oui → CI THS
☐ Cancer sein : ☐ Non ☐ Oui → CI THS
☐ Cancer endomètre, ovaire : ☐ Non ☐ Oui
☐ Fibrome utérin
☐ Endométriose
☐ Ostéoporose : ☐ Non ☐ Oui ☐ Ostéopénie

ANTÉCÉDENTS FAMILIAUX :
☐ Cancer du sein : ☐ Non ☐ Oui [ qui, âge ]
☐ Cancer ovaire : ☐ Non ☐ Oui
☐ Maladie cardio-vasculaire précoce
☐ Ostéoporose, fractures

FACTEURS DE RISQUE CARDIO-VASCULAIRE :
☐ Tabac : ☐ Non ☐ Actif [ /j ] ☐ Sevré depuis [ ]
☐ HTA
☐ Diabète
☐ Dyslipidémie
☐ Obésité : IMC [ ]
☐ Sédentarité

FACTEURS DE RISQUE OSTÉOPOROSE :
☐ Ménopause précoce (< 45 ans)
☐ IMC < 19
☐ Tabac
☐ Corticoïdes au long cours
☐ Fractures antérieures
☐ Apports calciques insuffisants

EXAMEN CLINIQUE :
- Poids : [ ] kg - Taille : [ ] cm - IMC : [ ]
- TA : [ ] / [ ] mmHg
- Examen cardiovasculaire : ☐ Normal
- Examen sein : ☐ Normal ☐ Anomalie [ ]
- Examen gynéco :
  - Atrophie vulvo-vaginale : ☐ Absente ☐ Présente
  - Prolapsus : ☐ Absent ☐ Présent [ stade ]
  - Toucher vaginal : Utérus [ ], annexes [ ]

DÉPISTAGES À JOUR :
☐ Frottis : [ Date ] - Résultat [ ]
☐ Mammographie : [ Date ] - Résultat [ ]
☐ Densité mammaire : ☐ ACR A ☐ B ☐ C ☐ D

EXAMENS COMPLÉMENTAIRES :
☐ Bilan hormonal (si doute diagnostic) : FSH, E2
☐ Bilan lipidique : CT, LDL, HDL, TG
☐ Glycémie à jeun
☐ TSH
☐ Ostéodensitométrie (si facteurs de risque) : T-score [ ]
☐ Échographie pelvienne (si saignements)
☐ Mammographie + échographie mammaire

TRAITEMENT HORMONAL SUBSTITUTIF (THS) :

CONTRE-INDICATIONS ABSOLUES :
☐ Cancer du sein ou endomètre (actuel ou passé)
☐ Maladie thromboembolique veineuse évolutive
☐ Cardiopathie ischémique
☐ AVC
☐ Hépatopathie sévère
☐ Saignements génitaux inexpliqués

BALANCE BÉNÉFICES / RISQUES :
Bénéfices :
- Amélioration symptômes climatériques (bouffées, troubles sommeil)
- Prévention ostéoporose
- Amélioration qualité de vie
- Diminution atrophie uro-génitale

Risques :
- Légère augmentation risque cancer sein (si THS > 5 ans)
- Risque thromboembolique (faible avec œstrogènes transdermiques)

DÉCISION PARTAGÉE :
☐ Patiente informée bénéfices/risques
☐ THS souhaité : ☐ Oui ☐ Non ☐ Hésitante

SI THS PRESCRIT :
☐ Œstrogènes : ☐ Transdermiques (patch, gel) ☐ Oraux
  → Préférer transdermiques si facteurs risque CV
☐ Progestatifs (si utérus présent) : [ ]
☐ Schéma : ☐ Continu ☐ Séquentiel

SI REFUS THS OU CONTRE-INDICATION :
☐ Traitement non hormonal bouffées : Abufène®, Bêta-alanine
☐ Lubrifiant vaginal, œstrogènes locaux
☐ Phytoestrogènes (effet modeste)
☐ Règles hygiéno-diététiques

CONSEILS HYGIÉNO-DIÉTÉTIQUES :
☐ Activité physique régulière (30 min/j)
☐ Apports calciques : 1200 mg/j (produits laitiers)
☐ Vitamine D : 800-1000 UI/j
☐ Limiter alcool, café
☐ Arrêt tabac si fumeuse
☐ Poids de forme (IMC 19-25)

SURVEILLANCE :
☐ Consultation dans 3 mois (adaptation THS)
☐ Puis annuelle : examen clinique, mammographie, réévaluation THS

CONCLUSION :
☐ Ménopause physiologique
☐ Symptômes : ☐ Absents ☐ Modérés ☐ Invalidants
☐ THS : ☐ Instauré ☐ Non indiqué ☐ Contre-indiqué ☐ Refusé`,
  },
]

// Template post-partum
export const observationTemplatePostPartum: ObservationTemplate = {
  name: 'Consultation post-partum',
  type: 'postnatale',
  template: `=== CONSULTATION POST-PARTUM ===

DATE ACCOUCHEMENT : [ ]
TERME ACCOUCHEMENT : [ ] SA
JOURS POST-PARTUM : [ ] jours (J[ ])

MODE D'ACCOUCHEMENT :
☐ Voie basse spontanée
☐ Voie basse instrumentale (ventouse/forceps)
☐ Césarienne : ☐ Programmée ☐ Urgence

COMPLICATIONS ACCOUCHEMENT :
☐ Aucune
☐ Hémorragie de la délivrance
☐ Déchirure périnéale : ☐ 1er degré ☐ 2ème degré ☐ 3ème degré ☐ 4ème degré
☐ Épisiotomie
☐ Autres : [ ]

ÉTAT GÉNÉRAL MATERNEL :
☐ Bon
☐ Fatigue modérée
☐ Fatigue importante, épuisement
☐ Fièvre : [ ]°C
☐ Douleurs : [ localisation, intensité ]

HUMEUR / PSYCHISME :
☐ Bien
☐ Baby blues (J3-J10, transitoire)
☐ Anxiété
☐ Signes dépression post-partum (≥ J10) :
  ☐ Tristesse persistante
  ☐ Pleurs fréquents
  ☐ Perte d'intérêt, anhédonie
  ☐ Troubles du sommeil
  ☐ Pensées négatives envers bébé
  ☐ Idées suicidaires ⚠️ URGENCE
☐ EPDS (si ≥ J10) : [ ] / 30 (≥ 12 = dépistage positif)

INVOLUTION UTÉRINE :
- Hauteur utérine : [ ] cm (ou ombilic + [ ] travers de doigt)
☐ Normale (diminue 1 cm/jour, non palpable à J10)
☐ Retardée (utérus trop haut) → ⚠️ Endométrite ?

LOCHIES :
☐ Normales (rouge puis séro-sanglantes puis blanchâtres)
☐ Abondantes (> règles)
☐ Malodorantes ⚠️ → Infection ?
☐ Caillots

CICATRISATION :
☐ Périnée intact
☐ Épisiotomie / Déchirure :
  - Aspect : ☐ Bonne cicatrisation ☐ Rouge, inflammatoire ☐ Écartée, béante
  - Douleur : [ /10 ]
  - Infection : ☐ Non ☐ Suspicion ⚠️
☐ Césarienne :
  - Aspect cicatrice : ☐ Bonne cicatrisation ☐ Rouge ☐ Écoulement
  - Douleur : [ /10 ]

PÉRINÉE :
- Testing : Contraction volontaire ☐ Présente ☐ Faible ☐ Absente
- Cotation : [ ] / 5 (0 = aucune contraction, 5 = forte)
☐ Béance vulvaire
☐ Incontinence urinaire : ☐ Non ☐ À l'effort ☐ Par urgence
☐ Incontinence anale / gaz : ☐ Non ☐ Oui
☐ Rééducation périnéale : ☐ Prescrite ☐ À débuter à [ ] semaines PP

PROLAPSUS :
☐ Absent
☐ Présent : ☐ Vessie ☐ Utérus ☐ Rectum - Stade [ ]

SEINS / ALLAITEMENT :
☐ Allaitement maternel exclusif
☐ Allaitement mixte
☐ Allaitement artificiel
☐ Sevrage en cours / terminé

Si allaitement maternel :
- Nombre de tétées : [ ] / 24h
- Succions efficaces : ☐ Oui ☐ Difficultés
- Positions d'allaitement : ☐ Maîtrisées ☐ À améliorer
- État des mamelons : ☐ Normaux ☐ Crevasses ☐ Douloureux
- Seins : ☐ Souples ☐ Engorgés ☐ Mastite (rouge, chaud, douloureux, fièvre)
☐ Tire-lait : ☐ Non ☐ Oui [ raison ]

Si arrêt allaitement :
- Montée laiteuse : ☐ Tarie ☐ Seins tendus
- Traitement : ☐ Parlodel® ☐ Bandage compressif

CONTRACEPTION :
☐ Désir de contraception : ☐ Oui ☐ Non ☐ Pas pour le moment
☐ Allaitement exclusif = MAMA (aménorrhée < 6 mois PP)
☐ Microprogestative (compatible allaitement)
☐ DIU : ☐ Prescrit ☐ Pose à [ ] semaines PP
☐ Préservatifs
☐ Autre : [ ]

REPRISE ACTIVITÉ SEXUELLE :
☐ Non
☐ Oui - Dyspareunie : ☐ Non ☐ Oui (sécheresse, douleur cicatrice)
☐ Informations données sur reprise progressive

EXAMEN CLINIQUE :
- Poids : [ ] kg (Poids avant grossesse : [ ])
- TA : [ ] / [ ] mmHg
- Palpation abdominale : Utérus [ ]
- Examen périnée / cicatrice : [ ]
- Examen seins : [ ]
- Membres inférieurs : ☐ Pas d'œdème ☐ Œdèmes ☐ Signe phlébite ⚠️

EXAMENS COMPLÉMENTAIRES :
☐ NFS (si anémie suspectée)
☐ Frottis cervical (si > 3 ans)
☐ Échographie pelvienne (si complications)

NOUVEAU-NÉ :
- Prénom : [ ]
- Poids naissance : [ ] g - Poids actuel : [ ] g
- Allaitement : ☐ Bon ☐ Difficultés
- Ictère : ☐ Non ☐ Oui (traité ?)
- Suivi pédiatrique : ☐ Organisé
- Dépistage néonatal : ☐ Fait

SOUTIEN / ENTOURAGE :
☐ Présence conjoint/famille
☐ Isolée, besoin aide
☐ Visite sage-femme à domicile (PRADO) : ☐ En cours ☐ Terminée
☐ PMI contactée : ☐ Oui ☐ Non

PRESCRIPTION / SOINS :
☐ Fer si anémie : [ ]
☐ Soins cicatrice : [ ]
☐ Antalgiques : [ ]
☐ Contraception : [ ]
☐ Rééducation périnéale : 10 séances dès [ ] semaines PP

CONSEILS :
☐ Repos, sommeil quand bébé dort
☐ Aide entourage / tâches ménagères
☐ Hydratation, alimentation équilibrée
☐ Soins périnée, hygiène
☐ Reprise activité physique progressive (marche)
☐ Signes d'alerte : fièvre, lochies malodorantes, douleur mollet, tristesse persistante

CONCLUSION :
☐ Suites de couches normales
☐ Anomalie : [ ] → Prise en charge : [ ]

PROCHAIN RDV :
☐ Visite post-natale (6-8 semaines) : [ Date ]
☐ Contrôle avant si besoin`,
}

// Export des templates par type
export function getObservationTemplate(
  type: 'prenatale' | 'gyneco' | 'postnatale' | 'reeducation',
  sa?: number
): ObservationTemplate | null {
  if (type === 'prenatale' && sa !== undefined) {
    return observationTemplatesPrenatale.find((t) => sa >= (t.saMin || 0) && sa <= (t.saMax || 999)) || null
  }

  if (type === 'gyneco') {
    // Return default gyneco template
    return observationTemplatesGyneco[0]
  }

  if (type === 'postnatale') {
    return observationTemplatePostPartum
  }

  return null
}

export function getAllTemplatesByType(type: string): ObservationTemplate[] {
  switch (type) {
    case 'prenatale':
      return observationTemplatesPrenatale
    case 'gyneco':
      return observationTemplatesGyneco
    case 'postnatale':
      return [observationTemplatePostPartum]
    default:
      return []
  }
}
