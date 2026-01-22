// Templates de données pour consultations (formulaires pré-remplis)
export interface ConsultationTemplate {
  id: string
  name: string
  type: string
  data: Record<string, any>
}

const TEMPLATES: ConsultationTemplate[] = [
  // ========== TEMPLATES GYNÉCOLOGIE ==========

  {
    id: 'gyneco-dysmenorrhee',
    name: 'Dysménorrhée',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Règles douloureuses (dysménorrhée)',
      examen_clinique: `Interrogatoire:
- Date des dernières règles: [à compléter]
- Cycles: [réguliers/irréguliers]
- Durée des cycles: [nombre de jours]
- Douleurs: début [1-2 jours avant/pendant] les règles
- Intensité: [échelle 1-10]
- Localisation: abdomen, bas-ventre, lombaires
- Signes associés: nausées, vomissements, diarrhée, céphalées
- Impact sur activités quotidiennes: [oui/non]
- Antécédents: ménarche à [âge], gravida [X], para [X]
- Contraception actuelle: [type ou aucune]
- Traitements essayés: [AINS, antispasmodiques...]
- Amélioration avec: [chaleur, repos, médicaments]

Examen des seins:
- Inspection: symétrique, pas de rétraction
- Palpation: seins souples, pas de masse palpable
- Aisselles: pas d'adénopathie

Examen gynécologique:
- Vulve: normale
- Spéculum: col [aspect], pas de leucorrhées anormales
- Toucher vaginal: utérus AVF mobile indolore, annexes libres
- Pas de masse palpable, pas de nodules`,
      conclusion: `Dysménorrhée [primaire/secondaire].
Pas d'anomalie à l'examen clinique.

Traitement proposé:
- AINS (Ibuprofène) à débuter dès les premiers signes
- Chaleur locale, repos
- [Si sévère: proposition pilule contraceptive]

[Si suspicion endométriose: échographie pelvienne recommandée]

Consultation de contrôle dans 3 mois.
Recontacter si douleurs intenses, saignements abondants, ou pas d'amélioration.`
    }
  },

  {
    id: 'gyneco-dyspareunie',
    name: 'Dyspareunie (douleurs pendant rapports)',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Douleurs lors des rapports sexuels (dyspareunie)',
      examen_clinique: `Interrogatoire:
- Date des dernières règles: [à compléter]
- Contexte: dyspareunie depuis [durée]
- Type: superficielle (entrée vagin) ou profonde
- Moment: pénétration, pendant, après
- Signes associés: sécheresse vaginale, brûlures, saignements
- Contraception: [pilule microprogestative? allaitement?]
- Post-partum: [oui/non, depuis combien de temps]
- Facteurs déclenchants: rapports peu fréquents, stress
- Impact sur vie sexuelle: [description]
- Antécédents: accouchement [voie basse/césarienne], épisiotomie, déchirure

Examen des seins:
- Inspection: normale
- Palpation: seins souples, pas d'anomalie

Examen gynécologique:
- Vulve: [aspect, rougeur, fissures]
- Test au coton-tige: [douleur vestibulaire oui/non]
- Spéculum: muqueuse vaginale [pâle/atrophique/normale], lubrification [diminuée/normale]
- Toucher vaginal: [contracture périnéale?], utérus mobile indolore, annexes libres
- Cicatrice épisiotomie: [souple/indurée]`,
      conclusion: `Dyspareunie [superficielle/profonde] dans un contexte de [sécheresse vaginale/vaginisme/cicatrice].

Traitement proposé:
- Lubrifiant vaginal à base d'eau avant rapports
- Mucogyne gel hydratant (2 applications/semaine)
- Préliminaires prolongés
- Communication avec partenaire

[Si vaginisme: rééducation périnéale, relaxation, sexologie]
[Si cicatrice douloureuse: kinésithérapie périnéale, massage cicatrice]
[Si atrophie post-partum/allaitement: hydratation locale, patience]

Consultation de contrôle dans 1-2 mois.`
    }
  },

  {
    id: 'gyneco-ist-chlamydia',
    name: 'IST - Suspicion Chlamydia',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Dépistage/suspicion infection à Chlamydia',
      examen_clinique: `Interrogatoire:
- Date des dernières règles: [à compléter]
- Motif: [dépistage systématique / symptômes / partenaire infecté]
- Symptômes: leucorrhées [aspect, odeur], brûlures mictionnelles, douleurs pelviennes
- Saignements: en dehors des règles, post-coïtaux
- Fièvre: [oui/non]
- Partenaires sexuels: nombre dans les 2 derniers mois
- Protection: préservatif [systématique/occasionnel/jamais]
- Dernier dépistage IST: [date]
- Contraception: [type]

Examen général:
- Température: [°C]
- État général: [bon/altéré]

Examen gynécologique:
- Vulve: [normale/inflammation]
- Spéculum: col [rouge/fragile], leucorrhées [aspect: mucopurulentes/verdâtres]
- Prélèvement vaginal: réalisé
- Toucher vaginal: utérus [mobile/douloureux], annexes [libres/empâtement douloureux]
- Mobilisation utérine: [indolore/douloureuse]`,
      conclusion: `Suspicion infection à Chlamydia trachomatis.
[Si salpingite: hospitalisation urgente recommandée]

Examens prescrits:
- Prélèvement vaginal avec recherche Chlamydia PCR
- Sérologies VIH, VHB, VHC, Syphilis

Traitement probabiliste débuté:
- Azithromycine 1g dose unique OU Doxycycline 100mg x2/j pendant 7j
- Traitement partenaire(s) OBLIGATOIRE
- Abstinence sexuelle 7 jours ou préservatif

Test de contrôle dans 3-4 semaines.
Consultation urgente si fièvre, douleurs pelviennes intenses, vomissements.`
    }
  },

  {
    id: 'gyneco-vaginose',
    name: 'Vaginose bactérienne',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Pertes vaginales malodorantes',
      examen_clinique: `Interrogatoire:
- Date des dernières règles: [à compléter]
- Leucorrhées: [durée], abondantes, liquides, grisâtres
- Odeur: "poisson pourri" (amine), accentuée après rapports
- Démangeaisons: absentes ou légères
- Brûlures: [oui/non]
- Facteurs favorisants: douches vaginales, tabac, changement partenaire
- Contraception: [stérilet cuivre?]
- Récidives: [oui/non, fréquence]

Examen gynécologique:
- Vulve: normale, pas d'inflammation
- Spéculum: leucorrhées liquides grisâtres adhérentes
- Test à la potasse (KOH): odeur de poisson (test positif)
- pH vaginal: > 4,5
- Prélèvement vaginal: réalisé
- Toucher vaginal: utérus et annexes normaux`,
      conclusion: `Vaginose bactérienne (diagnostic clinique).

Traitement prescrit:
- Métronidazole 500mg x2/j pendant 7 jours
- ALCOOL STRICTEMENT INTERDIT pendant traitement + 48h après
- Alternative: Métronidazole ovule (Flagyl) 500mg x 7 jours

Conseils hygiène:
- Toilette intime 1 fois/jour max (savon doux pH neutre)
- Éviter douches vaginales, protège-slips quotidiens
- Sous-vêtements coton
- Pas de traitement systématique du partenaire

[Si récidives fréquentes: probiotiques vaginaux après traitement]

Consultation si pas d'amélioration après 72h.`
    }
  },

  {
    id: 'gyneco-mycose',
    name: 'Mycose vulvo-vaginale',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Démangeaisons et pertes vaginales',
      examen_clinique: `Interrogatoire:
- Date des dernières règles: [à compléter]
- Symptômes: démangeaisons intenses (prurit), brûlures
- Leucorrhées: épaisses, blanches, aspect "lait caillé"
- Odeur: absente
- Dyspareunie: [oui/non]
- Facteurs déclenchants: antibiotiques récents, diabète, stress, grossesse
- Contraception: [pilule fortement dosée?]
- Récidives: [oui/non, > 4 épisodes/an]
- Traitements antérieurs: [efficacité]

Examen gynécologique:
- Vulve: rouge, œdématiée, excoriations de grattage
- Vestibule: érythémateux, fissures possibles
- Spéculum: muqueuse vaginale rouge, leucorrhées blanches épaisses adhérentes
- pH vaginal: normal (< 4,5)
- Prélèvement: [si récidives: avec culture et antifongigramme]
- Toucher vaginal: utérus et annexes normaux`,
      conclusion: `Mycose vulvo-vaginale (candidose).

Traitement prescrit:
- Mycohydralin ovule 150mg x 3 jours
- Mycohydralin crème application locale 2x/j pendant 7 jours
- Alternative: Econazole ovule 150mg x 3 jours

Conseils hygiène:
- Toilette intime 1 fois/jour MAXIMUM
- Savon surgras ou pH neutre
- Séchage soigneux par tamponnement
- Sous-vêtements coton 100%, éviter synthétiques
- Éviter douches vaginales, protège-slips, déodorants intimes
- Abstinence pendant traitement (ovule dissout latex)

[Si partenaire symptomatique (balanite): traiter avec crème]
[Si récidives > 4/an: glycémie à jeun, probiotiques vaginaux, traitement préventif]

Amélioration attendue sous 48-72h.
Consultation si aggravation ou pas d'amélioration.`
    }
  },

  {
    id: 'gyneco-amenorrhee',
    name: 'Aménorrhée (absence de règles)',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Absence de règles (aménorrhée)',
      examen_clinique: `Interrogatoire:
- Dernières règles: [date exacte]
- Durée aménorrhée: [nombre de mois]
- Type: [primaire: jamais eu règles / secondaire: arrêt après cycles normaux]
- Cycles antérieurs: [réguliers/irréguliers, durée]
- Test de grossesse: [fait? résultat?]
- Symptômes associés:
  * Galactorrhée (écoulement mammaire): [oui/non]
  * Bouffées de chaleur: [oui/non]
  * Hirsutisme (pilosité excessive): [oui/non]
  * Acné: [oui/non]
  * Prise/perte de poids: [kg]
  * Céphalées, troubles vision: [oui/non]
- Facteurs déclenchants:
  * Stress important: [oui/non]
  * Sport intensif: [type, heures/semaine]
  * Troubles alimentaires: [anorexie, boulimie]
  * Perte de poids: [kg, durée]
- Contraception récente: [pilule arrêtée depuis?]
- Traitements: [médicaments, chimiothérapie]
- Antécédents: âge ménarche [ans], grossesses

Examen général:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- Pilosité: [normale/hirsutisme: score Ferriman]
- Acné: [oui/non]
- Signes virilisation: [voix grave, hypertrophie clitoris]

Examen des seins:
- Galactorrhée: [oui/non, uni/bilatérale, spontanée/provoquée]
- Palpation: normale

Examen gynécologique:
- Vulve: [développement normal/infantile]
- Spéculum: col [présent/absent], muqueuse [œstrogénisée/atrophique]
- Toucher vaginal: utérus [taille, mobile], annexes [normales/masse]`,
      conclusion: `Aménorrhée [primaire/secondaire] depuis [durée].
Grossesse éliminée par β-HCG.

Hypothèses diagnostiques:
[Si stress/perte de poids: aménorrhée hypothalamique fonctionnelle]
[Si galactorrhée: hyperprolactinémie]
[Si hirsutisme: SOPK syndrome ovaires polykystiques]
[Si bouffées chaleur: insuffisance ovarienne prématurée]
[Si post-pilule: aménorrhée post-contraceptive]

Bilan prescrit:
- β-HCG plasmatique (éliminer grossesse)
- FSH, LH
- Prolactine
- TSH
- Testostérone totale
- Échographie pelvienne

Rendez-vous consultation de résultats dans 15 jours.
Apporter: résultats bilans, courbe température sur 2 cycles, calendrier menstruel.`
    }
  },

  {
    id: 'gyneco-controle',
    name: 'Consultation gynécologique de contrôle',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Consultation gynécologique de contrôle',
      examen_clinique: `Interrogatoire:
- Date des dernières règles: [à compléter]
- Cycles: [réguliers/irréguliers, durée]
- Dysménorrhée: [oui/non]
- Dyspareunie: [oui/non]
- Leucorrhées anormales: [oui/non]
- Saignements entre règles: [oui/non]
- Contraception: [type, depuis quand, observance]
- Dernier frottis cervico-vaginal: [date, résultat]
- Activité sexuelle: [oui/non, partenaires]
- Antécédents: gravida [X], para [X]
- Traitements en cours: [liste]

Examen des seins:
- Inspection: symétrique, pas de rétraction, pas d'écoulement mamelonnaire
- Palpation: seins souples, pas de masse palpable, pas de nodule
- Aisselles: pas d'adénopathie
- [Auto-palpation: technique expliquée]

Examen gynécologique:
- Vulve: normale, pas de lésion
- Spéculum: col [rose/sain], orifice [punctiforme/post-partum], leucorrhées [physiologiques/absentes]
- Frottis cervico-vaginal: [réalisé/non réalisé]
- Toucher vaginal: utérus AVF taille normale mobile indolore, annexes libres, cul-de-sac latéraux libres
- Toucher rectal: [si indiqué]`,
      conclusion: `Examen gynécologique normal.
[Si frottis réalisé: Résultats dans 3 semaines]

Contraception adaptée [ou: proposition changement contraception si effets indésirables].

Conseils:
- Autopalpation des seins mensuelle (après règles)
- Frottis de contrôle: [dans 1 an / 3 ans selon âge et antécédents]
- Consultation si: saignements anormaux, douleurs pelviennes, leucorrhées malodorantes

Prochain contrôle gynécologique dans 1 an.`
    }
  },

  {
    id: 'gyneco-contraception',
    name: 'Consultation contraception',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Demande de contraception',
      examen_clinique: `Interrogatoire:
- Date des dernières règles: [à compléter]
- Cycles: [réguliers/irréguliers]
- Parité: gravida [X], para [X]
- Contraception actuelle: [type ou aucune]
- Contraceptions antérieures: [types, tolérance, effets indésirables]
- Désir de grossesse: [à court/moyen/long terme, aucun]
- Projet contraceptif: [pilule, implant, DIU, préservatif, naturelle]

Antécédents personnels:
- Cardiovasculaires: HTA, phlébite, embolie, AVC, infarctus
- Migraines: [avec/sans aura]
- Diabète: [oui/non]
- Cancer: sein, utérus, ovaire
- Hépatiques: ictère, tumeur foie
- Tabac: [nombre cigarettes/jour]
- Âge: [ans]

Antécédents familiaux:
- Cancer sein/ovaire avant 50 ans
- Thrombose veineuse/embolie pulmonaire

Examen clinique:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- Tension artérielle: [TA systolique/diastolique]
- Examen des seins: [si > 25 ans] normal
- Examen gynécologique: [si vie sexuelle active] normal`,
      conclusion: `Consultation contraception.

Contre-indications recherchées:
[Liste selon choix: pilule OP, pilule microprogestative, implant, DIU...]

Méthode choisie: [préciser]

[Si pilule œstroprogestative:]
- Prescription: [nom commercial] 1cp/j à heure fixe, 21j puis 7j arrêt
- Débuter: 1er jour des règles
- Surveillance: TA, poids, examen seins annuel
- Consultation contrôle dans 3 mois
- Biologie: bilan lipidique si facteurs de risque

[Si DIU:]
- Pose prévue: pendant ou juste après règles
- Consultation contrôle 1 mois après pose

[Si implant:]
- Pose prévue: J1-J5 du cycle
- Durée: 3 ans
- Consultation si saignements prolongés

Conseils donnés:
- Efficacité, mode d'action expliqué
- Conduite à tenir en cas d'oubli [si pilule]
- Préservatif en + pour protection IST
- Signes d'alerte expliqués

Ordonnance remise.`
    }
  },

  {
    id: 'gyneco-frottis',
    name: 'Frottis cervico-vaginal',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Frottis cervico-vaginal de dépistage',
      examen_clinique: `Interrogatoire:
- Date des dernières règles: [à compléter]
- Dernier frottis: [date, résultat]
- Antécédents: frottis anormaux [oui/non, type: ASC-US, LSIL, HSIL]
- Traitements antérieurs: conisation, cryothérapie, laser
- Vaccination HPV: [oui/non, âge]
- Activité sexuelle: [âge 1er rapport, nombre partenaires]
- Tabac: [oui/non, nombre cigarettes/jour]
- IST antérieures: [Chlamydia, HPV, herpès]
- Contraception: [type]

Examen gynécologique:
- Vulve: normale
- Spéculum: col [rose/sain], [aspect: nullipare/multipar], [ectropion oui/non]
- Visualisation zone de jonction: [complète/incomplète]
- Prélèvement frottis:
  * Exocol: cytobrosse dans canal endocervical (rotation 360°)
  * Étalement sur lame ou milieu liquide
  * Fixation immédiate
- Toucher vaginal: utérus et annexes normaux`,
      conclusion: `Frottis cervico-vaginal de dépistage réalisé.

Prélèvement: [lame conventionnelle / milieu liquide]
Laboratoire: [nom]

Résultats attendus dans 3 semaines.
Vous serez contactée par téléphone si anomalie.

Conduite à tenir selon résultat:
- Normal: prochain frottis dans [1 an si < 30 ans / 3 ans si > 30 ans]
- ASC-US: test HPV ou contrôle 6 mois
- LSIL: colposcopie
- HSIL: colposcopie urgente

Consultation de résultats: [si nécessaire selon résultat]

Prévention:
- Vaccination HPV recommandée [si < 26 ans et non vaccinée]
- Arrêt tabac conseillé
- Préservatif avec nouveau partenaire`
    }
  },

  // ========== TEMPLATES PRÉNATAUX ==========

  {
    id: 'prenatal-epp',
    name: 'Entretien Prénatal Précoce (EPP)',
    type: 'prenatale',
    data: {
      type: 'prenatale',
      motif: 'Entretien prénatal précoce (EPP)',
      examenClinique: `ENTRETIEN PRÉNATAL PRÉCOCE
(Recommandé au 4ème mois de grossesse - obligatoire depuis 2007)

CONTEXTE DE LA GROSSESSE:
- Grossesse: [désirée/programmée/surprise]
- Ressentis face à la grossesse: [joie, inquiétude, ambivalence]
- Soutien de l'entourage: [conjoint, famille, amis]
- Situation familiale: [en couple/seule, stabilité]
- Conditions de vie: [logement adapté, ressources financières]
- Activité professionnelle: [métier, conditions de travail, arrêt prévu]

ANTÉCÉDENTS OBSTÉTRICAUX:
- Gestité: [nombre], Parité: [nombre]
- Grossesses antérieures: [déroulement, complications]
- Accouchements: [voie basse/césarienne, termes, poids naissance]
- Interruptions de grossesse: [IVG, IMG, FC]
- Allaitement précédent: [durée, ressenti]

SANTÉ PHYSIQUE:
- État de santé général: [bon/pathologies chroniques]
- Pathologies: diabète, HTA, épilepsie, asthme, troubles thyroïde
- Traitements en cours: [liste, compatibilité grossesse vérifiée]
- Addictions: tabac [nb/j], alcool, cannabis, autres substances
- IMC pré-grossessionnel: [calcul]
- Prise de poids depuis début grossesse: [kg]
- Acide folique: [débuté avant conception/en cours]

SANTÉ PSYCHOLOGIQUE:
- État émotionnel: [stable/anxiété/pleurs fréquents]
- Antécédents dépression/anxiété: [oui/non, suivi]
- Troubles du sommeil: [oui/non]
- Soutien psychologique souhaité: [oui/non]
- Violences conjugales dépistées: [oui/non] → ORIENTATION URGENTE si oui
- Baby blues/dépression post-partum antérieure: [oui/non]

PROJET DE NAISSANCE:
- Lieu d'accouchement souhaité: [maternité niveau 1/2/3, maison naissance]
- Type d'accouchement envisagé: [physiologique/péridurale]
- Accompagnement: [conjoint, doula, autre]
- Allaitement: [maternel/artificiel/mixte/indécis]
- Retour à domicile: [aide prévue, congé partenaire]

PRÉPARATION À LA NAISSANCE (PNP):
- Informations données sur les 8 séances remboursées
- Choix méthode: [classique/yoga/piscine/sophrologie/chant prénatal]
- Inscription: [faite/à faire]
- Projet suivi global sage-femme: [proposé oui/non]

DÉPISTAGES ET EXAMENS:
- Sérologies réalisées: [toxo, rubéole, VIH, VHB, syphilis]
- Échographie T1: [faite, date, résultat]
- Dépistage trisomie 21: [fait, résultat]
- Groupe sanguin: [groupe, rhésus, RAI]
- Vaccination: grippe [à jour], coqueluche [prévue 2e trim]

DROITS ET DÉMARCHES:
- Déclaration grossesse: [faite à CAF et CPAM]
- Carte vitale: [mise à jour]
- Projet d'accueil du jeune enfant (Paje): [expliqué]
- Congés maternité: [dates, durée expliquée]
- Reconnaissance anticipée: [si non mariés, expliqué]

RÉSEAU ET ORIENTATION:
- Médecin traitant informé: [oui/non]
- Suivi grossesse: [SF/gynéco/médecin généraliste]
- PMI contactée: [si besoin social]
- Diététicienne: [si besoin nutrition]
- Tabacologie: [si tabac actif]
- Psychologue: [si besoin identifié]
- Service social: [si difficultés financières]`,
      conclusion: `ENTRETIEN PRÉNATAL PRÉCOCE réalisé au [terme] SA.

SYNTHÈSE:
- Contexte: [résumé situation personnelle, sociale, psychologique]
- Facteurs de risque identifiés: [liste ou aucun]
- Ressources et soutien: [présents/à renforcer]

ORIENTATIONS:
[Liste les orientations vers professionnels si nécessaire:
- Psychologue si détresse
- Service social si précarité
- Addictologue si substances
- Diététicienne si surpoids/diabète
- Tabacologie si tabac]

PROJET DE NAISSANCE:
- Lieu: [préciser]
- Préparation: [inscrite où, méthode]
- Allaitement: [projet discuté]

PROCHAINS RENDEZ-VOUS:
- Consultation prénatale 5ème mois: [date]
- Échographie T2 (22 SA): [date]
- Séance préparation naissance: [date 1ère séance]

DOCUMENTS REMIS:
- Carnet de maternité complété
- Guide "Devenir parent" INPES
- Coordonnées PMI secteur
- Liste maternités du réseau
- Plaquette préparation naissance

Entretien vécu positivement. Patiente rassurée, questions répondues.
Disponibilité rappelée pour tout besoin.`
    }
  },

  // ========== TEMPLATES SUIVI GROSSESSE ==========

  {
    id: 'prenatal-t1',
    name: 'Consultation prénatale 1er trimestre (< 14 SA)',
    type: 'prenatale',
    data: {
      type: 'prenatale',
      motif: 'Consultation prénatale 1er trimestre - Déclaration de grossesse',
      examenClinique: `CONSULTATION PRÉNATALE 1ER TRIMESTRE
Terme: [X] SA + [X] jours

EXAMEN GÉNÉRAL:
- Poids: [X] kg - IMC: [X]
- Tension artérielle: [X]/[X] mmHg
- État général: bon

EXAMEN GYNÉCOLOGIQUE:
- Examen au spéculum: col fermé, leucorrhées physiologiques
- Toucher vaginal: utérus augmenté de volume, gravide, mobile, indolore
- Annexes: libres
- Cul-de-sac de Douglas: libre

EXAMEN COMPLÉMENTAIRE:
- Bruits du cœur fœtal: [non perçus / perçus au doppler à [X] bpm]
- Hauteur utérine: [non mesurable / [X] cm]
- Membres inférieurs: pas de varices, pas d'œdèmes
- Bandelette urinaire: négative`,
      conclusion: `Grossesse évolutive de [X] SA + [X]j.
DDR: [date] - DPA: [date]

✓ Déclaration de grossesse remise (CERFA à envoyer avant 15 SA)
✓ Dossier de maternité remis
✓ Guide suivi grossesse remis

PATIENTE INFORMÉE:
- 7 consultations prénatales obligatoires
- 3 échographies obligatoires (T1 à 11-13 SA, T2 à 22-24 SA, T3 à 32-34 SA)
- Examens biologiques mensuels
- Entretien prénatal précoce (EPP) recommandé au 4ème mois

📋 EXAMENS À RÉALISER - 1ER TRIMESTRE (OBLIGATOIRES):

🩸 BILAN SANGUIN COMPLET T1:
✓ Groupe sanguin ABO + Rhésus + phénotype complet (si 1ère détermination)
✓ RAI (Recherche agglutinines irrégulières) - Si Rh-: surveillance mensuelle
✓ NFS (Numération Formule Sanguine) - dépistage anémie
✓ Glycémie à jeun - dépistage diabète

🧪 SÉROLOGIES OBLIGATOIRES:
✓ Toxoplasmose (si non immune: contrôle mensuel)
✓ Rubéole (protection vérifiée)
✓ Syphilis (TPHA/VDRL)
✓ VIH (avec accord patiente)
✓ Hépatite B (Ag HBs)
✓ Hépatite C (si facteurs de risque)

📊 ÉCHOGRAPHIE T1 (11-13 SA + 6j):
✓ Datation de la grossesse (mesure LCC)
✓ Nombre d'embryons
✓ Mesure clarté nucale (dépistage trisomie 21)
✓ Vitalité embryonnaire

🧬 DÉPISTAGE TRISOMIE 21 (si souhaité):
✓ Dépistage combiné T1 (échographie + marqueurs sériques PAPP-A, βHCG libre)
OU Test ADN libre circulant (DPNI si indication)

📝 ORDONNANCES REMISES:
✓ Acide folique 400μg/j (jusqu'à 12 SA) - Prévention anomalies tube neural
✓ Vitamine D 400-800 UI/j (toute la grossesse)
✓ Bilan biologique T1 complet
✓ Échographie de datation T1 (11-13 SA)
✓ [Si toxo non immune: contrôle toxo mensuel]
✓ [Si Rh-: RAI mensuel]

⚠️ POINTS DE VIGILANCE T1:
- Rechercher signes de fausse couche (saignements, douleurs)
- Dépister hyperémèse gravidique (vomissements incoercibles)
- Vérifier supplémentation acide folique

💊 SUPPLÉMENTATION:
- Acide folique 400μg/j OBLIGATOIRE
- Vitamine D 400-800 UI/j toute la grossesse
- [Si anémie: fer + vitamine C]

🍎 CONSEILS ALIMENTAIRES - PRÉVENTION TOXOPLASMOSE:
- Cuire viandes à cœur (>65°C)
- Laver soigneusement fruits et légumes
- Éviter charcuterie crue, fromages au lait cru
- Éviter contact avec litière de chat

🚭 ADDICTIONS:
- Arrêt COMPLET tabac et alcool
- Aide au sevrage tabagique si besoin

📅 PROCHAIN RDV: Consultation 2ème trimestre (vers 18-20 SA)

⚠️ SIGNES D'ALERTE - CONSULTER EN URGENCE:
- Saignements abondants
- Douleurs pelviennes intenses
- Fièvre > 38°C
- Vomissements incoercibles`
    }
  },

  {
    id: 'prenatal-t2-early',
    name: 'Consultation prénatale 2ème trimestre précoce (15-20 SA)',
    type: 'prenatale',
    data: {
      type: 'prenatale',
      motif: 'Consultation prénatale 2ème trimestre - Suivi de grossesse',
      examenClinique: `CONSULTATION PRÉNATALE 2ÈME TRIMESTRE
Terme: [X] SA + [X] jours

EXAMEN GÉNÉRAL:
- Poids: [X] kg (prise de [X] kg depuis début grossesse)
- Tension artérielle: [X]/[X] mmHg
- État général: bon

EXAMEN OBSTÉTRICAL:
- Hauteur utérine: [X] cm (conforme au terme)
- Bruits du cœur fœtal: [X] bpm, bien perçus
- Mouvements actifs fœtaux: [perçus par la patiente / pas encore perçus]
- Bandelette urinaire: négative (pas de protéinurie, pas de glycosurie)

EXAMEN COMPLÉMENTAIRE:
- Membres inférieurs: [pas de varices / varices débutantes], pas d'œdèmes`,
      conclusion: `Grossesse évolutive de [X] SA + [X]j.
Évolution conforme.

Mouvements actifs fœtaux perçus.
Patiente en bon état général.

RÉSULTATS EXAMENS:
- Échographie T1 ([date]): [résumé]
- Dépistage trisomie 21: [risque faible / à discuter]
- Sérologies: [toxoplasmose: immune/non immune, rubéole: immune, autres: négatives]

PRESCRIPTIONS:
- Toxoplasmose mensuelle (si non immune)
- RAI (si Rhésus négatif)
- Échographie morphologique (20-24 SA)
- Glycémie à jeun (dépistage diabète gestationnel)

CONSEILS:
- Alimentation équilibrée
- Hydratation suffisante
- Repos si besoin
- Préparation à la naissance: inscription possible dès maintenant

Prochain RDV: consultation [X]ème mois (vers [X] SA).`
    }
  },

  {
    id: 'prenatal-t2-late',
    name: 'Consultation prénatale 2ème trimestre tardif (21-28 SA)',
    type: 'prenatale',
    data: {
      type: 'prenatale',
      motif: 'Consultation prénatale 2ème trimestre tardif - Suivi de grossesse',
      examenClinique: `CONSULTATION PRÉNATALE 2ÈME TRIMESTRE TARDIF
Terme: [X] SA + [X] jours

EXAMEN GÉNÉRAL:
- Poids: [X] kg (prise totale: [X] kg depuis début grossesse)
- Tension artérielle: [X]/[X] mmHg
- État général: bon

EXAMEN OBSTÉTRICAL:
- Hauteur utérine: [X] cm (conforme au terme: ± 2cm de SA)
- Bruits du cœur fœtal: [X] bpm, réguliers
- Mouvements actifs fœtaux: réguliers, ressentis quotidiennement
- Présentation fœtale: [non déterminée à ce stade]
- Bandelette urinaire: [négative / protéinurie / glycosurie]

EXAMEN COMPLÉMENTAIRE:
- Membres inférieurs: [pas d'œdèmes / œdèmes légers chevilles en fin de journée]`,
      conclusion: `Grossesse évolutive de [X] SA + [X]j.
Évolution conforme. Pas de signe d'appel pathologique.

RÉSULTATS EXAMENS:
- Échographie morphologique T2 ([date]): [normale / anomalie à surveiller]
- HGPO 75g ([date]): [normale / diabète gestationnel]
- NFS: [normale / anémie: Hb [g/dl]]
- Toxoplasmose: [statut]

📋 EXAMENS À RÉALISER - 2ÈME TRIMESTRE (24-28 SA):

📊 ÉCHOGRAPHIE T2 (22-24 SA) - MORPHOLOGIQUE:
✓ Biométrie fœtale (croissance)
✓ Étude morphologique complète des organes
✓ Localisation placentaire
✓ Quantité liquide amniotique
✓ Mesure col utérin

🩸 BILAN SANGUIN T2:
✓ NFS - Dépistage anémie
✓ RAI si Rhésus négatif (à 24-28 SA)
✓ Albuminurie / Glycosurie sur bandelette
✓ [Si toxo non immune: sérologie toxo]

🧪 DÉPISTAGE DIABÈTE GESTATIONNEL (24-28 SA) - OBLIGATOIRE:
✓ HGPO 75g (Hyperglycémie Provoquée par voie Orale)
  - Glycémie à jeun
  - Glycémie à 1h
  - Glycémie à 2h
✓ À réaliser le matin à jeun (8-12h de jeûne)
✓ Valeurs normales:
  - À jeun < 0.92 g/L
  - À 1h < 1.80 g/L
  - À 2h < 1.53 g/L
✓ Diabète gestationnel si 1 valeur dépassée

💉 PRÉVENTION RHÉSUS (si Rhésus négatif):
✓ Injection Rhophylac 300μg IM à 28 SA
✓ Prévention allo-immunisation anti-D

📝 ORDONNANCES REMISES:
✓ HGPO 75g (dépistage diabète gestationnel 24-28 SA)
✓ NFS de contrôle
✓ RAI si Rhésus négatif (28 SA)
✓ [Si Rh-: Ordonnance Rhophylac 300μg IM à 28 SA]
✓ [Si anémie: Fer + Vitamine C]
✓ [Si toxo non immune: sérologie toxo mensuelle]

⚠️ POINTS DE VIGILANCE T2:
- Surveiller mouvements actifs fœtaux (doivent être ressentis quotidiennement)
- Mesurer hauteur utérine (croissance fœtale)
- Contrôler tension artérielle (dépistage HTA gravidique)
- Rechercher protéinurie (pré-éclampsie)

À PRÉVOIR POUR T3:
✓ Consultation anesthésiste OBLIGATOIRE (à programmer avant 37 SA)
✓ Préparation à la naissance: débuter les 8 séances remboursées
✓ Inscription maternité si pas encore fait

💊 SUPPLÉMENTATION:
- Vitamine D 400-800 UI/j (toute la grossesse)
- [Si anémie (Hb < 11 g/dl): Fer 80-100mg/j + Vitamine C]
- [Si crampes: Magnésium]

🏃 ACTIVITÉ PHYSIQUE:
- Activité modérée toujours autorisée
- Natation, marche recommandées
- Repos si contractions fréquentes

📅 PROCHAIN RDV: Consultation 3ème trimestre (vers 32-34 SA)

⚠️ SIGNES D'ALERTE - CONSULTER EN URGENCE:
- Contractions douloureuses et régulières avant 37 SA (MAP)
- Saignements
- Perte de liquide amniotique
- Diminution ou absence mouvements fœtaux
- Maux de tête violents, troubles vision, œdèmes importants (pré-éclampsie)`
    }
  },

  {
    id: 'prenatal-t3-early',
    name: 'Consultation prénatale 3ème trimestre précoce (29-32 SA)',
    type: 'prenatale',
    data: {
      type: 'prenatale',
      motif: 'Consultation prénatale 3ème trimestre - Suivi de grossesse',
      examenClinique: `CONSULTATION PRÉNATALE 3ÈME TRIMESTRE
Terme: [X] SA + [X] jours

EXAMEN GÉNÉRAL:
- Poids: [X] kg
- Tension artérielle: [X]/[X] mmHg
- État général: [bon / fatigue / œdèmes]

EXAMEN OBSTÉTRICAL:
- Hauteur utérine: [X] cm
- Bruits du cœur fœtal: [X] bpm, réguliers
- Mouvements actifs fœtaux: réguliers
- Présentation fœtale: [céphalique / siège / transverse]
- Col utérin: [long, postérieur, fermé / modifications]
- Bandelette urinaire: [négative / protéinurie]

EXAMEN COMPLÉMENTAIRE:
- Membres inférieurs: [pas d'œdèmes / œdèmes]
- Réflexes ostéo-tendineux: [normaux / vifs]`,
      conclusion: `Grossesse de [X] SA + [X]j.
[Évolution normale / Points de vigilance]

RÉSULTATS EXAMENS:
- Échographie 3ème trimestre: [croissance harmonieuse / RCIU / macrosomie]
- Biométrie fœtale: [percentiles]
- Liquide amniotique: [normal / oligoamnios / hydramnios]
- Doppler: [normal / anomalie]
- NFS: [normale / anémie]

PRESCRIPTIONS:
- Consultation anesthésiste [si non faite: à faire AVANT 37 SA]
- Frottis vaginal Streptocoque B (35-37 SA)
- NFS, RAI si Rhésus négatif
- [Si RCIU: échographie de surveillance rapprochée]
- [Si diabète gestationnel: autosurveillance glycémique]

PRÉPARATION ACCOUCHEMENT:
- Séances préparation à la naissance: [en cours / terminées / à débuter]
- Consultation anesthésiste: [faite / à faire]
- Maternité choisie: [nom, niveau]
- Projet de naissance: [discuté]

CONSEILS:
- Surveillance mouvements fœtaux quotidienne
- Repos si contractions fréquentes
- Préparer valise maternité
- Signes début travail expliqués

Prochain RDV: consultation [X]ème mois (vers [X] SA).`
    }
  },

  {
    id: 'prenatal-t3-late',
    name: 'Consultation prénatale 3ème trimestre tardif (33-37 SA)',
    type: 'prenatale',
    data: {
      type: 'prenatale',
      motif: 'Consultation prénatale 3ème trimestre tardif - Préparation accouchement',
      examenClinique: `CONSULTATION PRÉNATALE 3ÈME TRIMESTRE TARDIF
Terme: [X] SA + [X] jours

EXAMEN GÉNÉRAL:
- Poids: [X] kg (prise totale: [X] kg)
- Tension artérielle: [X]/[X] mmHg
- Œdèmes: [absents / membres inférieurs / généralisés]

EXAMEN OBSTÉTRICAL:
- Hauteur utérine: [X] cm
- Bruits du cœur fœtal: [X] bpm
- Mouvements actifs fœtaux: réguliers
- Présentation fœtale: [céphalique / siège]
- Engagement: [non engagé / mobile / fixé / engagé]
- Col utérin:
  * Longueur: [long / raccourci / effacé]
  * Position: [postérieur / centré / antérieur]
  * Consistance: [tonique / ramolli]
  * Ouverture: [fermé / admettant pulpe / 1 doigt / 2 doigts]
  * Score de Bishop: [X]/13
- Bandelette urinaire: [négative / protéinurie]

PALPATION ABDOMINALE:
- Dos fœtal: [à gauche / à droite]
- Estimation poids fœtal: [X] g`,
      conclusion: `Grossesse de [X] SA + [X]j.
Présentation [céphalique / siège].

RÉSULTATS EXAMENS:
- Frottis vaginal Streptocoque B: [négatif / POSITIF → antibioprophylaxie pendant travail]
- Échographie T3 ([date]): [croissance harmonieuse / RCIU / macrosomie]
- Consultation anesthésiste: [réalisée le [date]]
- NFS: [normale / anémie]

📋 EXAMENS À RÉALISER - 3ÈME TRIMESTRE (35-37 SA):

📊 ÉCHOGRAPHIE T3 (32-34 SA):
✓ Biométrie fœtale (croissance, estimation poids)
✓ Présentation fœtale
✓ Quantité liquide amniotique
✓ Localisation placentaire
✓ Doppler si nécessaire

🦠 PRÉLÈVEMENT VAGINAL STREPTOCOQUE B (35-37 SA) - OBLIGATOIRE:
✓ PV vaginal + rectal
✓ Si positif: antibioprophylaxie pendant travail (Pénicilline G ou Amoxicilline IV)
✓ Prévention infection néonatale

🩸 BILAN SANGUIN T3:
✓ NFS - Contrôle anémie
✓ RAI si Rhésus négatif (36 SA)
✓ Albuminurie / Glycosurie sur bandelette
✓ [Si toxo non immune: sérologie toxo]

🏥 CONSULTATION ANESTHÉSISTE OBLIGATOIRE (avant 37 SA):
✓ Évaluation terrain anesthésique
✓ Discussion péridurale
✓ Information risques/bénéfices
✓ Accord anesthésie péridurale ou rachianesthésie

📝 ORDONNANCES REMISES:
✓ Prélèvement vaginal Streptocoque B (35-37 SA)
✓ NFS de contrôle
✓ RAI si Rhésus négatif (36 SA)
✓ [Si siège persistant: RDV version par manœuvre externe]
✓ [Si facteurs risque: monitoring fœtal]

⚠️ POINTS DE VIGILANCE T3:
- Surveillance quotidienne mouvements fœtaux (min 10 MAF/jour)
- Contrôler TA régulièrement (HTA gravidique, pré-éclampsie)
- Dépistage streptocoque B entre 35-37 SA
- Rechercher contractions régulières (MAP)

PRÉPARATION ACCOUCHEMENT - CHECKLIST:
✓ Consultation anesthésiste: [réalisée le [date] / à faire]
✓ Séances préparation naissance: [X/8 séances réalisées]
✓ Maternité choisie: [nom], niveau [1/2/3]
✓ Inscription maternité: [faite]
✓ Projet de naissance: [discuté et écrit]
✓ Valise maternité: [en cours / prête]
✓ Siège auto: [acheté]

PROJET DE NAISSANCE:
- Allaitement: [maternel / artificiel / indécis]
- Péridurale: [souhaitée / non / selon douleur]
- Accompagnement: [conjoint / doula / autre]
- Position accouchement: [libre / selon souhait]

💊 SUPPLÉMENTATION:
- Vitamine D 400-800 UI/j (continuer)
- [Si anémie: Fer + Vitamine C]

🏥 SIGNES DÉBUT TRAVAIL (à bien expliquer):
→ PARTIR À LA MATERNITÉ SI:
✓ Contractions régulières, douloureuses, rapprochées (toutes les 5 min depuis 1h)
✓ Perte des eaux (même sans contractions) - liquide clair
✓ Saignements abondants (comme règles)
✓ Diminution importante ou absence mouvements fœtaux

⚠️ SIGNES D'ALERTE - CONSULTER EN URGENCE:
- Perte de liquide amniotique teinté/verdâtre (liquide méconial)
- Saignements abondants
- Contractions très douloureuses et rapprochées
- Diminution ou absence mouvements fœtaux
- Maux de tête violents, troubles vision, douleur épigastrique, œdèmes importants (pré-éclampsie)
→ Appeler maternité ou consulter immédiatement

📋 DOCUMENTS À APPORTER À LA MATERNITÉ:
✓ Dossier médical complet
✓ Carte de groupe sanguin
✓ Tous les résultats d'examens
✓ Carte vitale + mutuelle
✓ Pièce d'identité
✓ Livret de famille (si marié)
✓ Projet de naissance

📅 PROCHAIN RDV: Consultation à terme (39-40 SA) ou début travail

Tout est prêt pour accueillir bébé. Bon courage pour la fin de grossesse !`
    }
  },

  {
    id: 'prenatal-term',
    name: 'Consultation à terme (≥ 37 SA)',
    type: 'prenatale',
    data: {
      type: 'prenatale',
      motif: 'Consultation à terme - Surveillance grossesse à terme',
      examenClinique: `CONSULTATION À TERME
Terme: [X] SA + [X] jours

EXAMEN GÉNÉRAL:
- Poids: [X] kg
- Tension artérielle: [X]/[X] mmHg
- Œdèmes: [absents / présents]

EXAMEN OBSTÉTRICAL:
- Hauteur utérine: [X] cm
- Bruits du cœur fœtal: [X] bpm, réguliers
- Mouvements actifs fœtaux: [ressentis quotidiennement / diminués]
- Présentation: [céphalique], engagement: [mobile / fixé / engagé]

TOUCHER VAGINAL - Score de Bishop:
- Col:
  * Dilatation: [fermé / 1 cm / 2 cm / 3 cm / 4 cm] → [0-3 points]
  * Effacement: [0-30% / 30-50% / 50-80% / >80%] → [0-3 points]
  * Consistance: [tonique / intermédiaire / ramolli] → [0-2 points]
  * Position: [postérieur / intermédiaire / antérieur] → [0-2 points]
- Présentation: [haute / appliquée / fixée / engagée] → [0-3 points]
- Score de Bishop total: [X]/13
  * Si ≥ 6: col favorable
  * Si < 6: col défavorable

PERTE BOUCHON MUQUEUX: [non / oui]

MONITORING FŒTAL (NST):
- Durée: 20-30 minutes
- Rythme cardiaque fœtal de base: [X] bpm
- Variabilité: [normale / diminuée]
- Accélérations: [présentes / absentes]
- Décélérations: [absentes / présentes]
- Mouvements fœtaux: [ressentis pendant tracé]
- Contractions utérines: [absentes / irrégulières / régulières]
- Interprétation: [RCF réactif / non réactif]

BANDELETTE URINAIRE: [négative / protéinurie]`,
      conclusion: `Grossesse à terme de [X] SA + [X]j.

BILAN:
- Score de Bishop: [X]/13 → Col [favorable / défavorable]
- Monitoring: [réactif / non réactif]
- Présentation: céphalique, [engagement]
- Estimation poids fœtal: [X] g

CONDUITE À TENIR:

[Si < 41 SA:]
- Surveillance à poursuivre
- Attente début spontané du travail
- Signes début travail rappelés
- Prochain RDV: dans [3-7 jours] ou début travail

[Si ≥ 41 SA (dépassement de terme):]
- DÉPASSEMENT DE TERME
- Surveillance rapprochée nécessaire
- Monitoring bihebdomadaire
- Déclenchement à discuter/programmer

[Si déclenchement décidé:]
DÉCLENCHEMENT PROGRAMMÉ:
- Date: [JJ/MM/AAAA]
- Heure: [HH:MM]
- Lieu: [Maternité]
- Modalités: [maturation cervicale si col défavorable / déclenchement direct]
- Méthode: [Propess / Cytotec / perfusion ocytocine / rupture membranes]

RAPPEL SIGNES DÉBUT TRAVAIL:
- Contractions régulières, douloureuses toutes les 5 min depuis 1h
- Perte des eaux
- Saignements abondants
- Diminution mouvements fœtaux
→ Venir à la maternité SANS ATTENDRE le RDV de déclenchement

DOCUMENTS:
- Dossier complet pour maternité
- Carte groupe sanguin
- Résultats examens
- Projet de naissance

Tout est prêt. Bon courage!`
    }
  },

  // ========== TEMPLATES POST-PARTUM ==========

  {
    id: 'postpartum-entretien-precoce',
    name: 'Entretien postnatal précoce (avant sortie maternité)',
    type: 'postnatale',
    data: {
      type: 'postnatale',
      motif: 'Entretien postnatal précoce',
      examenClinique: `ENTRETIEN POSTNATAL PRÉCOCE
(Dans les 48-72h après accouchement, avant sortie maternité)

ACCOUCHEMENT:
- Date: [JJ/MM/AAAA], Heure: [HH:MM]
- Terme: [SA + jours]
- Voie d'accouchement: [voie basse spontanée/instrumentale/césarienne]
- Durée travail: [heures]
- Analgésie: [péridurale/sans/autre]
- Complications: [déchirure degré, hémorragie, fièvre, autre]
- Sutures: [épisiotomie/déchirure périnéale, fils résorbables]
- Pertes sanguines: [normales/hémorragie]

ÉTAT PHYSIQUE MATERNEL:
- Constantes: TA [mmHg], pouls [bpm], température [°C]
- Involution utérine: utérus [sous-ombilical/à l'ombilic/sus-ombilical]
- Lochies: [normales/abondantes], odeur [normale/fétide]
- Périnée: [intégrité/sutures], douleur [0-10], œdème [oui/non]
- Seins: [souples/tendus], montée laiteuse [oui/non/en cours], crevasses [oui/non]
- Mictions: [spontanées/difficultés], premier transit [oui/non]
- Mobilisation: [autonome/avec aide]
- Douleurs: [localisation, intensité EVA]
- Traitement antalgique: [paracétamol, AINS, autre]

ÉTAT PSYCHOLOGIQUE:
- Humeur: [bonne/pleurs fréquents/irritabilité]
- Sommeil: [correct/fragmenté/insomnie]
- Baby blues: [non/signes débutants]
- Lien avec bébé: [attachement immédiat/progressif/difficultés]
- Soutien conjoint/famille: [présent/absent]
- Inquiétudes exprimées: [sur bébé/capacités/retour maison]

ALLAITEMENT:
[Si allaitement maternel:]
- Mise au sein: [dans les 2h/plus tard]
- Nombre tétées/24h: [fréquence]
- Durée tétées: [minutes]
- Position: [correcte/à améliorer]
- Prise du sein: [bonne/mauvaise]
- Crevasses: [non/débutantes/installées]
- Douleur tétée: [non/oui, intensité]
- Soutien reçu: [consultant lactation, SF]

[Si allaitement artificiel:]
- Raison choix: [personnel/contre-indication/échec AM]
- Lait infantile: [nom, quantités]
- Rythme biberons: [nombre/24h]
- Prise biberons: [bonne/difficultés]
- Régurgitations: [non/oui]
- Inhibition lactation: [bromocriptine prescrite]

NOUVEAU-NÉ:
- Prénom: [nom]
- Sexe: [M/F]
- Poids naissance: [g], Taille: [cm], PC: [cm]
- Apgar: [/10 à 1min, /10 à 5min]
- Poids actuel: [g], perte de poids: [% ou g]
- État général: [bon/à surveiller]
- Ictère: [non/léger/moyen/traité]
- Selles: [méconium/selles de transition/selles jaunes]
- Urines: [normales, nombre couches]
- Cordon: [sec/humide/suintant]
- Examens réalisés: [Guthrie J3, échographie hanches, bilan si indiqué]
- Couchage: [sur le dos expliqué, couffin/berceau]

PRÉPARATION SORTIE:
- Retour à domicile prévu: [date]
- Moyens de transport: [véhicule avec siège auto/autre]
- Logement: [adapté/difficultés]
- Aide à domicile: [conjoint, famille, HAD, PRADO]
- Matériel: [berceau, table à langer, baignoire]
- Suivi sage-femme libérale: [coordonnées données, RDV pris]
- Pédiatre: [choisi, RDV prévu J10-J15]
- Visite post-natale obligatoire: [6-8 semaines, RDV à prendre]

INFORMATIONS DONNÉES:
- Surveillance température, cordon, ictère
- Signes d'alerte: [fièvre >38°, refus tétées, léthargie, détresse respiratoire]
- Rééducation périnéale: [prescription remise, débuter 6-8 sem]
- Contraception: [discutée, méthode choisie, prescription]
- Reprise rapports: [conseils donnés, attendre cicatrisation]
- Soutien psychologique: [numéro urgence si baby blues]

PRESCRIPTIONS REMISES:
- Antalgiques si besoin
- Fer si anémie
- Vitamines si allaitement
- Contraception
- Rééducation périnéale (10 séances)`,
      conclusion: `ENTRETIEN POSTNATAL PRÉCOCE à J[nombre] post-partum.

MÈRE:
- État physique: [bon/surveillance]
- État psychologique: [adaptation normale/baby blues débutant/à surveiller]
- Allaitement: [bien démarré/difficultés/artificiel]
- Douleurs: [bien contrôlées/EVA]

NOUVEAU-NÉ:
- Adaptation: [bonne/surveillance]
- Alimentation: [efficace/à surveiller]
- Poids: [perte physiologique/excessive]

SORTIE:
- Prévue le: [date]
- Conditions retour: [favorables/nécessite soutien renforcé]
- Suivi organisé: [SF libérale, pédiatre]

ORIENTATIONS:
[Si besoin: PMI, psychologue, consultante lactation, HAD]

POINTS DE VIGILANCE:
[Liste signes d'alerte expliqués, numéros urgence donnés]

Mère informée, rassurée. Questions répondées.
Rappel: ne pas hésiter à appeler si inquiétude.`
    }
  },

  {
    id: 'postpartum-entretien-postnatal',
    name: 'Entretien postnatal (6-8 semaines)',
    type: 'postnatale',
    data: {
      type: 'postnatale',
      motif: 'Entretien postnatal (visite post-natale)',
      examenClinique: `ENTRETIEN POSTNATAL (6-8 semaines post-partum)
Visite post-natale obligatoire

RAPPEL ACCOUCHEMENT:
- Date accouchement: [JJ/MM/AAAA]
- Terme: [SA]
- Voie: [voie basse/césarienne]
- Complications: [oui/non, préciser]

ÉTAT GÉNÉRAL:
- Fatigue: [normale/excessive]
- Sommeil: [satisfaisant/insuffisant, heures/nuit]
- Appétit: [normal/diminué/augmenté]
- Reprise activités: [progressive/difficultés]

INVOLUTION UTÉRINE:
- Lochies: [terminées/encore présentes]
- Retour de couches: [oui, date / non, allaitement en cours]
- Utérus: involution complète, hauteur [non palpable]
- Métrorragies: [non/oui, abondance]

PÉRINÉE ET CICATRICES:
- Périnée: [tonique/relâché], cicatrice [non visible/bien cicatrisée]
- Testing périnéal: [score/5]
- Fuites urinaires: [non / oui: à l'effort/impériosités]
- Fuites gaz/selles: [non/oui]
- Dyspareunie: [rapports non repris / repris sans douleur / douloureux]
- Cicatrice césarienne (si applicable): [souple/indurée], adhérences [oui/non]

SEINS ET ALLAITEMENT:
[Si allaitement en cours:]
- Poursuite: [oui, exclusif/mixte]
- Nombre tétées/24h: [fréquence]
- Crevasses: [non/cicatrisées]
- Engorgement: [non/épisodes]
- Mastite: [non/oui, traitée]
- Projet sevrage: [non prévu / prévu quand]

[Si allaitement arrêté:]
- Date arrêt: [date]
- Raison: [choix/difficultés/reprise travail]
- Inhibition: [spontanée/médicamenteuse]

[Si pas d'allaitement:]
- Seins: [souples, involution complète]

ÉTAT PSYCHOLOGIQUE:
- Humeur: [stable/tristesse/irritabilité]
- Baby blues: [résolu/persistant]
- Dépression post-partum (EPDS): [score /30]
  * Si > 12: DÉPISTAGE POSITIF → prise en charge
- Anxiété: [normale/excessive]
- Lien mère-enfant: [bon/difficultés]
- Soutien entourage: [présent/insuffisant]
- Troubles du sommeil: [non/insomnie/hypersomnie]
- Idées noires: [non/OUI → URGENCE]

SEXUALITÉ:
- Rapports repris: [oui/non]
- Délai reprise: [semaines]
- Dyspareunie: [non/superficielle/profonde]
- Libido: [normal/diminué/absent]
- Sécheresse vaginale: [non/oui, surtout si allaitement]
- Désir autre enfant: [non/oui, délai souhaité]

CONTRACEPTION:
- Contraception actuelle: [méthode]
- Satisfaction: [oui/non]
- Changement souhaité: [oui/non]
- Prescription: [pilule/implant/DIU/autre]
- Pose DIU: [prévue, date]
- Conseils donnés: [compatibilité allaitement, efficacité]

EXAMEN CLINIQUE:
- Poids: [kg], évolution depuis grossesse: [kg perdus]
- TA: [mmHg]
- Seins: [souples/normaux], écoulement: [non/galactorrhée]
- Abdomen: [souple], diastasis grands droits: [non/oui, largeur cm]
- Cicatrice: [césarienne ou épisiotomie] aspect, douleur
- Spéculum: col [refermé/perméable], muqueuse [normale/atrophique si allaitement]
- Toucher vaginal: utérus [involué, taille normale], annexes [libres]
- Testing périnéal: [cotation/5]

RÉÉDUCATION PÉRINÉALE:
- Prescription: [remise lors sortie maternité]
- Séances débutées: [oui/non]
- Nombre séances réalisées: [X/10]
- Technique: [manuelle/électrostimulation/biofeedback]
- Évolution: [amélioration/stationnaire]
- Suite prévue: [continuer/arrêt si récupération complète]

NOUVEAU-NÉ:
- Prénom: [nom]
- Âge: [semaines]
- Poids actuel: [g], évolution pondérale: [courbe]
- Alimentation: [AM exclusif/mixte/AA, quantités]
- Sommeil: [nuits, siestes]
- Suivi pédiatrique: [régulier/à organiser]
- Vaccins: [à jour selon calendrier]
- Développement: [normal/retard]

VIE FAMILIALE:
- Conjoint: [implication, congé pris]
- Fratrie: [adaptation]
- Organisation quotidienne: [gérée/difficultés]
- Reprise travail: [date prévue]
- Mode de garde: [choix, organisé]

EXAMENS COMPLÉMENTAIRES:
- Frottis cervico-vaginal: [si non fait depuis 3 ans]
- Bilan biologique si indiqué:
  * NFS (si anémie grossesse)
  * Glycémie (si diabète gestationnel)
  * TSH (si dysthyroïdie)`,
      conclusion: `VISITE POST-NATALE à [nombre] semaines post-partum.

BILAN PHYSIQUE:
- Involution utérine: [complète]
- Cicatrisation: [bonne]
- Périnée: [tonique/nécessite rééducation]
- Poids: [kg, à [X] kg objectif pré-grossesse]

BILAN PSYCHOLOGIQUE:
- Adaptation: [bonne/baby blues résolu/DPP dépistée]
- Soutien: [présent/à renforcer]
- Score EPDS: [/30]

ALLAITEMENT:
- Poursuite: [oui/non]
- Difficultés: [aucune/crevasses résolues]

CONTRACEPTION:
- Méthode choisie: [préciser]
- [Si DIU: pose prévue le [date]]

RÉÉDUCATION PÉRINÉALE:
- [Prescription remise/en cours/terminée]
- [Si fuites: importance rééducation expliquée]

ORIENTATIONS:
[Si DPP: psychologue, psychiatre, CMP]
[Si fuites persistantes après rééducation: consultation uro-gynéco]
[Si dyspareunie: consultation sexologie, ostéopathe]

PROCHAINS RDV:
- Rééducation abdominale: [si diastasis]
- Suivi psychologique: [si besoin]
- Consultation gynécologique: [1 an]

DOCUMENTS REMIS:
- Prescription contraception
- Prescription rééducation (si non faite)
- Ordonnance examens biologiques si nécessaire

Patiente informée, questions répondues.
Reprise vie normale encouragée progressivement.`
    }
  },

  {
    id: 'postpartum-pediatrie-suivi',
    name: 'Suivi pédiatrique nouveau-né/nourrisson',
    type: 'postnatale',
    data: {
      type: 'postnatale',
      motif: 'Suivi pédiatrique (courbe de croissance, développement)',
      examenClinique: `CONSULTATION DE SUIVI PÉDIATRIQUE

IDENTITÉ:
- Prénom, Nom: [prénom NOM]
- Date de naissance: [JJ/MM/AAAA]
- Âge: [X mois et X jours]
- Sexe: [M/F]

ANTÉCÉDENTS NÉONATAUX:
- Terme de naissance: [SA + jours]
- Poids naissance: [g], Taille: [cm], PC: [cm]
- Apgar: [/10 à 1min, /10 à 5min]
- Complications néonatales: [aucune/ictère/détresse respi/infection]
- Hospitalisation: [non/oui, durée, motif]
- Dépistage néonatal (Guthrie): [normal/anomalie]

MOTIF CONSULTATION:
- [Suivi de routine / Inquiétude parents / Pathologie]

ALIMENTATION:
[Si allaitement maternel:]
- Allaitement: exclusif/mixte, durée totale [mois]
- Nombre tétées/24h: [fréquence]
- Tétées nocturnes: [oui/non, nombre]
- Compléments: [non/vitamine D/fer]
- Diversification: [non débutée / débutée à [mois]]

[Si allaitement artificiel:]
- Lait infantile: [marque, type: 1er âge/2e âge]
- Nombre biberons/24h: [nombre]
- Quantité par biberon: [ml]
- Biberons nocturnes: [oui/non]
- Préparation: [eau minérale/du robinet, respect dosage]
- Régurgitations: [non/oui, fréquence, abondance]
- Constipation: [non/oui]
- Diversification: [âge début, aliments introduits]

[Diversification alimentaire (dès 4-6 mois):]
- Âge début: [mois]
- Légumes: [introduits, tolérance]
- Fruits: [introduits, tolérance]
- Protéines: [viande, poisson, œuf, quantités]
- Féculents: [pain, pâtes, riz]
- Produits laitiers: [yaourt, fromage]
- Allergies alimentaires: [aucune/suspicion/confirmée]
- Appétit: [bon/capricieux/refus]

CROISSANCE (à reporter sur courbes):
- Poids: [g ou kg], percentile: [Pème]
- Taille/longueur: [cm], percentile: [Pème]
- Périmètre crânien: [cm], percentile: [Pème]
- Évolution pondérale: [régulière/cassure/accélération]
- Prise de poids depuis dernière visite: [g/mois]

DÉVELOPPEMENT PSYCHOMOTEUR:
[Nouveau-né 0-2 mois:]
- Tonus: [bon/hypotonie/hypertonie]
- Réflexes archaïques: [présents/absents]
- Tenue de tête: [non/début/acquise]
- Sourire-réponse: [non/oui]
- Suivi du regard: [non/oui]
- Réaction aux sons: [non/oui, sursaute]

[Nourrisson 2-4 mois:]
- Tenue de tête: [ferme/non]
- Mains: [ouvertes/poings serrés]
- Préhension volontaire: [non/début]
- Gazouillis: [oui/non]
- Sourire social: [présent]
- Se retourne: [non/du dos au ventre/du ventre au dos]

[Nourrisson 4-6 mois:]
- Position assise: [avec soutien/tient seul/non]
- Préhension: [volontaire, passe objets d'une main à l'autre]
- Babillage: [présent/absent]
- Réagit à son prénom: [oui/non]
- Rit aux éclats: [oui/non]

[Nourrisson 6-9 mois:]
- Position assise: [stable seul]
- Tient debout: [avec appui/non]
- 4 pattes: [oui/rampe/non]
- Préhension: [pince supérieure/inférieure]
- Syllabes: [ba-ba, da-da, ma-ma]
- Angoisse de séparation: [présente/non]
- Permanent de l'objet: [acquis/non]

[Nourrisson 9-12 mois:]
- Marche: [seul/avec appui/4 pattes]
- Premiers pas: [âge]
- Préhension: [pince fine, pointe index]
- Mots: [papa, maman, autres]
- Compréhension: [consignes simples, au revoir]
- Imitation: [bravo, coucou]

SOMMEIL:
- Nuits: [heures totales]
- Réveils nocturnes: [nombre, facilité rendormissement]
- Siestes: [nombre/jour, durée]
- Endormissement: [facile/difficile, rituel]
- Lieu: [lit, chambre parents/seul]
- Position: [dos/ventre/côté] → RAPPEL: TOUJOURS SUR LE DOS

ÉLIMINATION:
- Selles: [fréquence/jour, aspect: normales/liquides/dures]
- Constipation: [non/oui]
- Urines: [nombre couches/jour]
- Érythème fessier: [non/oui, sévérité]

SANTÉ:
- Infections depuis dernière visite: [rhume, otite, bronchiolite, gastro]
- Fièvre: [non/oui, fréquence, traitée comment]
- Traitement en cours: [aucun/préciser]
- Hospitalisations: [non/oui, motif, durée]
- Allergies connues: [aucune/préciser]

VACCINATIONS (à vérifier calendrier vaccinal):
- 2 mois: DTP-Coq-Hib-HepB-Pneumo [fait le / à faire]
- 4 mois: DTP-Coq-Hib-HepB-Pneumo [fait le / à faire]
- 5 mois: Méningo C [fait le / à faire]
- 11 mois: DTP-Coq-Hib-HepB-Pneumo [fait le / à faire]
- 12 mois: ROR [fait le / à faire], Méningo C [fait le / à faire]
- Vaccins à jour: [oui/non]

EXAMEN CLINIQUE:
- État général: [bon/altéré]
- Comportement: [éveillé/tonique/réactif/apathique]
- Coloration: [rosé/pâle/ictérique/cyanosé]
- Hydratation: [bonne/déshydratation]
- Température: [°C]

Peau:
- [Normale/eczéma/angiome/taches/éruption]
- Érythème fessier: [non/oui, stade]

Tête et cou:
- Crâne: [normal/plagiocéphalie/craniosynostose]
- Fontanelle antérieure: [ouverte taille [cm], fermée, bombée, déprimée]
- Yeux: [strabisme/normal], larmoiement [oui/non]
- Oreilles: [normales], tympans [roses/congestionnés]
- Bouche: [muguet/aphtes/normal], dents [nombre]
- Cou: [souple], torticolis [non/oui]

Thorax:
- Auscultation cardiaque: [bruits réguliers, pas de souffle/souffle présent]
- Auscultation pulmonaire: [murmure vésiculaire normal/crépitants/sibilants/wheezing]

Abdomen:
- [Souple/ballonné], hernie ombilicale [non/oui, taille]
- Foie: [non palpable/déborde de [cm]]
- Rate: [non palpable]

Organes génitaux:
[Garçon:] testicules [en place bilatéralement/ectopie], prépuce [décalottable/adhérent], méat urinaire [normal]
[Fille:] vulve [normale], leucorrhées [non/oui]

Hanches (jusqu'à 4 mois):
- Manœuvre Ortolani/Barlow: [négative/positive]
- Abduction: [symétrique/limitée]
- Échographie hanches: [faite, résultat / non faite]

Colonne vertébrale:
- [Normale/scoliose/cyphose]

Membres:
- Mobilité: [normale/asymétrie]
- Réflexes ostéo-tendineux: [normaux]

EXAMEN NEURO-SENSORIEL:
- Tonus: [normal/hypotonie/hypertonie]
- Contact visuel: [bon/absent]
- Audition: [réagit aux bruits/pas de réaction] → BERA si doute
- Vision: [reflet cornéen symétrique/strabisme]

GUIDANCE PARENTALE:
- Prévention mort subite du nourrisson: [position dos, pas couverture/oreiller/tour de lit, température 18-20°C, chambre parents jusqu'à 6 mois]
- Prévention accidents: [surveillance bain, pas seul table à langer, pas petits objets, sécurité voiture siège dos route]
- Hygiène: [bain quotidien pas obligatoire, savon doux, sérum physiologique nez]
- Soleil: [pas d'exposition directe < 1 an, crème indice 50+, chapeau]
- Écrans: [AUCUN avant 3 ans]
- Stimulation: [parler, jouer, livres, musique]
- Complémentation: [vitamine D jusqu'à 18 mois minimum]`,
      conclusion: `CONSULTATION DE SUIVI PÉDIATRIQUE à [âge].

CROISSANCE:
- Poids: [g/kg] (Pème P)
- Taille: [cm] (Pème P)
- PC: [cm] (Pème P)
- Courbe: [harmonieuse/cassure/rebond]

DÉVELOPPEMENT PSYCHOMOTEUR:
- [Normal pour l'âge / Retard léger / Retard à surveiller]
- Acquisitions: [liste]
- [Si retard: orientation psychomotricien/neuropédiatre]

ALIMENTATION:
- [Adaptée/carences/excès]
- Diversification: [bien conduite/conseils donnés]

SANTÉ:
- État général: [excellent/bon/moyen]
- Pathologies: [aucune/en cours]

VACCINATIONS:
- [À jour / Rattrapage à prévoir]
- Prochains vaccins: [date]

ORIENTATIONS:
[Si anomalie: pédiatre, ophtalmo, ORL, orthophoniste, psychomotricien, etc.]

CONSEILS DONNÉS:
- Poursuite allaitement/diversification
- Prévention accidents domestiques
- Stimulation adaptée
- Sommeil: régularité, rituel

PRESCRIPTIONS:
- Vitamine D: [posologie]
- Fer si besoin
- [Autres selon pathologie]

PROCHAIN RDV:
- [À 1 mois / 2 mois / selon calendrier]
- Vaccination: [si prévue]

Parents rassurés. Développement satisfaisant.
Rappel: consulter si fièvre > 38°5, refus alimentation, léthargie, convulsion.`
    }
  },

  // ========== TEMPLATES RÉÉDUCATION PÉRINÉALE ==========

  {
    id: 'reeducation-bilan-initial',
    name: 'Bilan périnéal initial',
    type: 'reeducation',
    data: {
      type: 'reeducation',
      motif: 'Bilan périnéal initial - Rééducation post-partum',
      examenClinique: `BILAN PÉRINÉAL INITIAL (après accouchement)

CONTEXTE OBSTÉTRICAL:
- Date accouchement: [JJ/MM/AAAA], soit [X] semaines post-partum
- Parité: Gestité [G], Parité [P]
- Mode accouchement: [voie basse spontanée / instrumental: forceps/ventouse / césarienne]
- Durée travail: [heures]
- Périnée: [intact / déchirure 1er/2e/3e/4e degré / épisiotomie]
- Poids bébé: [g]
- Complications: [aucune / hémorragie / infection / autre]

MOTIF CONSULTATION:
- [Fuites urinaires / Pesanteur pelvienne / Dyspareunie / Prévention systématique]

PLAINTES FONCTIONNELLES:
Incontinence urinaire:
- [Non / Oui]: à l'effort (toux, éternuement, rire, sport) / impériosités
- Fréquence: [occasionnelle / quotidienne / permanente]
- Quantité: [quelques gouttes / nécessite protection]
- Depuis: [post-partum immédiat / progressif]
- Retentissement sur vie quotidienne: [échelle 0-10]

Incontinence anale:
- Gaz: [non / oui, fréquence]
- Selles liquides: [non / oui]
- Selles solides: [non / oui] → URGENCE si oui

Troubles de la statique pelvienne:
- Sensation pesanteur pelvienne: [non / oui]
- Sensation boule vaginale: [non / oui]
- Gêne en fin de journée: [non / oui]
- Aggravation en position debout: [non / oui]

Sexualité:
- Rapports repris: [non / oui, depuis combien de temps]
- Dyspareunie: [non / superficielle (entrée) / profonde]
- Intensité douleur: [EVA /10]
- Sécheresse vaginale: [non / oui]
- Appréhension rapports: [non / oui]

ANTÉCÉDENTS:
- Rééducation périnéale antérieure: [non / oui, après quelle grossesse]
- Incontinence avant grossesse: [non / oui]
- Pratique sportive: [type, niveau, reprise prévue]
- Chirurgie pelvienne: [non / oui: prolapsus, incontinence]

EXAMEN ABDOMINAL:
- Cicatrice césarienne (si applicable): [souple / adhérente / douloureuse]
- Diastasis des grands droits: [non / oui, largeur [cm]]
  * Si > 2-3 cm: rééducation abdominale recommandée après périnée
- Testing abdominaux: [cotation /5]

EXAMEN PÉRINÉAL:
Inspection:
- Cicatrice épisiotomie/déchirure: [non visible / bien cicatrisée / indurée / douloureuse]
- Trophicité vulvo-vaginale: [bonne / atrophie si allaitement]
- Prolapsus visible (toux): [non / cystocèle / rectocèle / hystérocèle], grade [/4]

Tonus périnéal au repos:
- Contraction volontaire: [absente / faible / présente]
- Visualisation: [pas de mouvement / ascension périnée visible]

Testing périnéal (cotation Amiel-Tison ou Oxford):
- Doigt vaginal introduit délicatement
- Contraction volontaire demandée ("serrez autour du doigt")
- Testing: [0/5, 1/5, 2/5, 3/5, 4/5, 5/5]
  * 0 = aucune contraction
  * 1 = frémissement
  * 2 = contraction faible
  * 3 = contraction modérée
  * 4 = contraction bonne
  * 5 = contraction forte contre résistance

Tenue de la contraction:
- Durée: [secondes]
- Relâchement: [complet / incomplet]

Testing endurance:
- Nombre de contractions successives: [X/10]
- Fatigue rapide: [oui / non]

Réflexe à la toux:
- Contraction réflexe: [présente / absente / inversée (poussée)]

Coordination périnéo-abdominale:
- Dissociation: [possible / difficile]
- Poussée abdominale: [périnée se contracte / périnée pousse (mauvais)]

Sensibilité:
- Zones hypo/hyperesthésiques: [non / oui, localisation]
- Cicatrice douloureuse: [non / oui]`,
      conclusion: `BILAN PÉRINÉAL POST-PARTUM à [X] semaines.

DIAGNOSTIC FONCTIONNEL:
[Cocher selon résultats]
☐ Hypotonie périnéale (testing [/5])
☐ Incontinence urinaire d'effort
☐ Incontinence urinaire par impériosités (hyperactivité vésicale)
☐ Incontinence anale aux gaz
☐ Prolapsus débutant (cystocèle/rectocèle grade [/4])
☐ Dyspareunie cicatricielle
☐ Diastasis des grands droits ([cm])
☐ Périnée normal - Rééducation préventive

INDICATIONS:
- Rééducation périnéale: [10 séances prescrites]
- Technique privilégiée: [manuelle / biofeedback / électrostimulation / mixte]
- Rééducation abdominale: [après récupération périnée si diastasis]

OBJECTIFS:
1. Prise de conscience du périnée
2. Renforcement musculaire périnéal
3. Coordination périnéo-abdominale
4. Travail des verrouillages périnéaux (réflexe à la toux)
5. [Diminution fuites urinaires]
6. [Amélioration confort sexuel]

RÉÉDUCATION:
- Rythme: 1 à 2 séances/semaine
- Durée prévisionnelle: [2-3 mois]
- Exercices à domicile: enseignés progressivement

CONSEILS HYGIÉNO-DIÉTÉTIQUES:
- Éviter ports de charges lourdes
- Éviter sports à impact (course, trampoline) tant que périnée faible
- Lutter contre constipation (hydratation, fibres)
- Perte de poids si surpoids
- Mictions régulières sans poussée abdominale
- Pas de stop-pipi (mauvais exercice)

PROCHAIN RDV:
- Séance rééducation n°2: [date]
- Bilan intermédiaire après 5 séances
- Bilan final après 10 séances

Patiente motivée. Exercices expliqués.`
    }
  },

  {
    id: 'reeducation-seance-suivi',
    name: 'Séance de rééducation périnéale',
    type: 'reeducation',
    data: {
      type: 'reeducation',
      motif: 'Séance de rééducation périnéale - Séance n°[X]/10',
      examenClinique: `SÉANCE DE RÉÉDUCATION PÉRINÉALE n°[X]/10

ÉVOLUTION DEPUIS DERNIÈRE SÉANCE:
- Fuites urinaires: [amélioration / stables / aggravation]
- Exercices à domicile: [faits régulièrement / occasionnellement / non faits]
- Difficultés rencontrées: [aucune / préciser]

SÉANCE DU JOUR:

1. PRISE DE CONSCIENCE (5-10 min):
- Respiration abdominale
- Localisation périnée (inspiration: relâchement, expiration: contraction)
- Dissociation périnéo-abdominale

2. RENFORCEMENT MUSCULAIRE (15-20 min):

[Si méthode manuelle:]
- Contractions lentes (tenir 5-10 sec): [X répétitions]
- Contractions rapides (1 sec): [X répétitions]
- Endurance: [durée tenue]
- Travail en différentes positions: [décubitus / assise / debout]

[Si biofeedback:]
- Sonde vaginale connectée
- Visualisation graphique de la contraction
- Objectif: atteindre [X] µV
- Résultats: [pic atteint, moyenne]
- Motivation: jeu/cible visuelle

[Si électrostimulation:]
- Sonde vaginale avec électrodes
- Programme: [fréquence Hz, durée]
- Intensité: [mA] selon tolérance
- Ressenti: [contractions perçues/non perçues]
- Durée: [20-30 minutes]

3. COORDINATION PÉRINÉO-ABDOMINALE (5-10 min):
- Verrouillage périnéal avant effort
- Travail à la toux: contraction réflexe
- Exercices fonctionnels: se lever, éternuer, porter

4. EXERCICES SPÉCIFIQUES:
[Si incontinence:]
- Stop-test (interrompre jet urinaire): [réussi / non] → 1 fois/semaine max
- Travail impériosités: retenir, respirer, se détendre

[Si dyspareunie:]
- Travail relâchement périnée (inspiration)
- Massage cicatrice si indurée
- Exercice "ascenseur" (contraction progressive)

5. EXERCICES À DOMICILE (prescrits):
- Contractions [X] fois/jour (ex: 3x10 contractions)
- Position: [couchée / assise / debout selon niveau]
- Durée contraction: [5-10 secondes]
- Rappel: ne pas faire pendant mictions

ÉVALUATION:
- Testing du jour: [cotation /5]
- Progression: [amélioration / stagnation]
- Motivation patiente: [bonne / à encourager]
- Observance exercices maison: [bonne / insuffisante]`,
      conclusion: `SÉANCE RÉÉDUCATION PÉRINÉALE n°[X]/10

TESTING: [/5] (évolution depuis bilan: [+/- X points])

TECHNIQUE UTILISÉE:
- [Manuelle / Biofeedback / Électrostimulation]

RÉSULTATS:
- Fuites urinaires: [amélioration nette / légère / pas encore]
- Force périnéale: [amélioration / stable]
- Endurance: [amélioration / stable]
- Coordination: [acquise / en cours]

EXERCICES DOMICILE:
- [X] contractions x [X] fois/jour
- Durée: [secondes]
- Verrouillage avant toux: à systématiser

PROCHAINE SÉANCE:
- Objectifs: [continuer renforcement / travail fonctionnel / bilan intermédiaire]
- RDV: [date]

[Si séance 5/10: Bilan intermédiaire prévu]
[Si séance 10/10: Bilan final + décision prolongation si nécessaire]`
    }
  },

  // ========== TEMPLATES PRÉPARATION À LA NAISSANCE ==========

  {
    id: 'preparation-seance1',
    name: 'Préparation naissance - Séance 1 (Projet naissance)',
    type: 'preparation',
    data: {
      type: 'preparation',
      motif: 'Préparation à la naissance - Séance 1/8',
      examenClinique: `PRÉPARATION À LA NAISSANCE - SÉANCE 1/8
Thème: Projet de naissance et connaissances générales

PARTICIPANTS:
- Mère: [prénom]
- Accompagnant: [conjoint / autre / seule]
- Terme actuel: [SA]

PROJET DE NAISSANCE:
Lieu d'accouchement:
- Maternité choisie: [nom, niveau 1/2/3]
- Distance domicile: [km, temps trajet]
- Visite maternité: [faite / à prévoir]

Accompagnement souhaité:
- Présence: [conjoint / accompagnant / seule]
- Doula: [non / oui]

Type d'accouchement envisagé:
- [Physiologique / Avec péridurale / Indécis]
- Mobilité pendant travail: [souhaitée / indifférent]
- Position accouchement: [classique / autre: accroupie, 4 pattes]

Prise en charge douleur:
- Péridurale: [souhaitée / refusée / selon douleur]
- Méthodes alternatives: [ballon, baignoire, massages, TENS]
- Analgésie gazeuse (MEOPA): [informée]

Alimentation:
- Allaitement: [maternel exclusif / artificiel / mixte / indécis]
- Projet ferme: [oui / à réfléchir]

Peau à peau:
- Immédiat après naissance: [souhaité]
- Participation accompagnant: [oui / non]

Retour maison:
- Durée hospitalisation souhaitée: [classique 3-4j / sortie précoce 48h / RAD]
- Aide à domicile: [famille / HAD / PRADO / seule]

CONNAISSANCES DE BASE:

Anatomie basique:
- Schéma pelvis expliqué
- Utérus, col, vagin, périnée
- Bébé in utero: position, liquide amniotique

Signes début de travail:
- Contractions régulières, douloureuses, rapprochées (règle 5-1-1 ou 3-1-2)
- Perte liquide amniotique: [clair / teinté / méconial]
- Perte bouchon muqueux (glaire rosée/sanglante)

Quand partir à la maternité:
- Contractions régulières: toutes les [5 min depuis 1h] ou [3 min depuis 2h] si déjà accouché
- Perte des eaux (même sans contractions)
- Saignements abondants
- Diminution mouvements bébé
- Distance maternité > 30 min: partir plus tôt

Valise maternité:
- Documents: carte vitale, mutuelle, carnet maternité, carte groupe sanguin
- Affaires mère: [liste donnée]
- Affaires bébé: [liste donnée]
- Siège auto installé dans voiture

EXERCICES PRATIQUES:
- Respiration abdominale enseignée
- Relaxation guidée (10 min)
- Auto-massage du périnée expliqué (si souhait accouchement physiologique)

QUESTIONS/RÉPONSES:
[Questions posées et réponses données]`,
      conclusion: `PRÉPARATION NAISSANCE - SÉANCE 1 complétée.

PROJET:
- Accouchement: [maternité]
- Péridurale: [souhaitée / non / indécis]
- Allaitement: [projet]

THÈMES ABORDÉS:
✓ Anatomie et physiologie
✓ Signes début travail
✓ Quand partir maternité
✓ Valise maternité
✓ Respiration abdominale

EXERCICES DOMICILE:
- Respiration abdominale: 10 min/jour
- Auto-massage périnée: 5 min/jour (si projet sans péridurale)
- Préparer valise maternité

PROCHAINE SÉANCE (2/8):
- Thème: Déroulement du travail et de l'accouchement
- Date: [date]`
    }
  },

  {
    id: 'preparation-accouchement',
    name: 'Préparation naissance - Déroulement accouchement',
    type: 'preparation',
    data: {
      type: 'preparation',
      motif: 'Préparation à la naissance - Déroulement accouchement',
      examenClinique: `PRÉPARATION À LA NAISSANCE
Thème: Déroulement du travail et de l'accouchement

PHASES DU TRAVAIL:

1. PHASE DE LATENCE (col 0 à 3-4 cm):
- Durée: [variable, plusieurs heures]
- Contractions: irrégulières puis régulières
- Ce qu'on fait: [rester à domicile, se reposer, manger léger, boire]
- Gestion douleur: bain chaud, ballon, marche, massages

2. PHASE ACTIVE (col 4 à 10 cm = dilatation complète):
- Durée: [4-8h primipare, 2-5h multipare]
- Contractions: régulières, rapprochées (2-3 min), intenses
- À la maternité: monitoring, examen col
- Péridurale: [posée si souhaitée, à 3-4 cm généralement]
- Positions favorables: ballon, marche, suspension, 4 pattes
- Rupture membranes: [spontanée ou artificielle]

3. EXPULSION (col 10 cm jusqu'à naissance):
- Durée: [20 min à 2h]
- Envie de pousser: irrépressible quand bébé descend
- Positions: [classique gynéco / autre selon projet]
- Poussées dirigées: [avec sage-femme]
- Progression bébé: visualisation au miroir possible
- Sortie tête puis corps (épaules, reste suit)

4. DÉLIVRANCE (placenta):
- Durée: [< 30 minutes]
- Contractions reprennent
- Expulsion placenta (poussée légère ou traction)
- Vérification placenta complet
- Ocytocine perfusion (prévention hémorragie)

BÉBÉ À LA NAISSANCE:

Premiers gestes:
- Aspiration bouche/nez si besoin
- Clampage cordon (immédiat ou différé selon projet)
- Section cordon (par accompagnant si souhaité)

Peau à peau immédiat:
- Bébé posé sur mère
- Séchage, bonnet
- Durée: [1-2h minimum]
- Première tétée dans l'heure

Examens bébé:
- Score Apgar (1 min et 5 min)
- Pesée, mesures (taille, PC)
- Vitamine K (prévention hémorragie)
- Collyre (prévention infection oculaire)

PÉRINÉE:

Épisiotomie:
- [Non systématique]
- Indications: souffrance fœtale, extraction instrumentale, périnée très serré
- Anesthésie locale si pas de péridurale
- Suture fils résorbables

Déchirure:
- 1er degré (peau): suture ou non
- 2e degré (muscles): suture nécessaire
- 3e/4e degré (sphincter anal): rare, suture au bloc

GESTION DOULEUR:

Sans péridurale:
- Respiration (lente/rapide selon phase)
- Positions (ballon, suspension, bain)
- Massages (bas du dos, épaules)
- TENS (stimulation électrique)
- MEOPA (gaz hilarant)
- Bain/douche
- Accompagnement/encouragements

Avec péridurale:
- Cathéter posé dans dos (entre 2 vertèbres)
- Anesthésie locale préalable
- Effet: 15-20 min
- Doses continues ou à la demande
- Permet de se reposer
- Mobilité limitée mais certaines maternités proposent "péridurale ambulatoire"

POSITIONS D'ACCOUCHEMENT:

Classique (gynécologique):
- Sur le dos, jambes relevées
- Permet surveillance, gestes si besoin

Alternatives:
- Accroupie: favorise descente bébé
- Sur le côté: moins de pression périnée
- 4 pattes: soulage dos, bébé mieux positionné
- Suspension/debout: gravité aide

Exercices respiratoires enseignés selon phase travail.`,
      conclusion: `PRÉPARATION - Déroulement accouchement abordé.

NOTIONS ACQUISES:
✓ Phases du travail
✓ Gestion contractions
✓ Positions d'accouchement
✓ Péridurale (fonctionnement, avantages/inconvénients)
✓ Peau à peau
✓ Délivrance

EXERCICES:
- Respiration pendant contraction simulée
- Positions sur ballon
- Massage bas du dos (accompagnant)

Couple/patiente rassurée, questions répondues.

PROCHAINE SÉANCE:
- Thème: [Allaitement / Suites de couches / Soins bébé]`
    }
  },

  // ========== TEMPLATES IVG ==========

  {
    id: 'ivg-consultation-information',
    name: 'IVG - Consultation information et consentement',
    type: 'ivg',
    data: {
      type: 'ivg',
      motif: 'Consultation information IVG',
      examenClinique: `CONSULTATION INFORMATION ET CONSENTEMENT IVG

CONTEXTE:
- Âge: [ans]
- Dernières règles: [date]
- Aménorrhée estimée: [SA]
- Test grossesse: [positif le [date]]
- Grossesse: [désirée initialement / non désirée / non prévue]

DÉCISION:
- Demande IVG: [certaine / hésitante / sous pression]
- Réflexion menée: [oui, mûrement réfléchi / impulsive]
- Pression extérieure: [aucune / famille / conjoint] → VIGILANCE
- Ambivalence: [aucune / présente]
- Entourage informé: [oui / non / partiellement]
- Soutien: [conjoint / famille / amie / aucun]

ANTÉCÉDENTS:
Gynéco-obstétricaux:
- Gestité: [G], Parité: [P]
- IVG antérieures: [nombre, dates, méthode]
- Fausses couches: [nombre]
- Accouchements: [nombre, voies]
- Désir enfant ultérieur: [oui / non / indécis]

Contraception:
- Contraception actuelle: [aucune / pilule / DIU / préservatif / autre]
- Raison échec: [oubli pilule / rupture préservatif / aucune / autre]
- Contraception future souhaitée: [à discuter / méthode envisagée]

Médicaux:
- Allergies: [aucune / préciser]
- Traitements: [aucun / liste]
- Pathologies: [asthme, épilepsie, troubles coagulation, insuffisance surrénale]
- Groupe sanguin: [groupe, rhésus]

EXAMEN CLINIQUE:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- TA: [mmHg], Pouls: [bpm]
- État général: [bon]
- Examen abdominal: [utérus non palpable / palpable si > 12 SA]

Examen gynécologique:
- Spéculum: col [fermé / entrouvert], aspect
- Toucher vaginal: utérus [taille estimée en SA], annexes [libres]

DATATION GROSSESSE:
- Terme échographique: [SA + jours]
- Échographie datation: [faite / à faire]
  * Si < 9 SA: échographie pelvienne
  * Si > 9 SA: échographie abdominale

MÉTHODES IVG EXPLIQUÉES:

1. IVG MÉDICAMENTEUSE (jusqu'à 7 SA en ville, 9 SA en établissement):

Avantages:
- Pas d'anesthésie, pas de geste instrumental
- Vécu comme "fausse couche"
- Ambulatoire

Inconvénients:
- Douleurs (contractions)
- Saignements abondants plusieurs jours
- Risque échec 2-5% (nécessite alors aspiration)
- Plusieurs consultations

Protocole:
J1: Mifépristone 600mg (anti-progestérone, stoppe grossesse)
J3: Misoprostol 400µg (prostaglandine, expulsion), à domicile ou établissement
Expulsion: 4-6h après misoprostol
Contrôle: 14-21 jours (échographie + β-HCG)

2. IVG CHIRURGICALE (aspiration jusqu'à 14 SA):

Avantages:
- Rapide (10 min)
- Efficacité > 99%
- Pas de saignements prolongés

Inconvénients:
- Geste instrumental
- Anesthésie (générale ou locale)
- Risque rare: perforation, infection

Protocole:
- Préparation col (Mifépristone ou Misoprostol si > 9 SA)
- Aspiration endo-utérine sous anesthésie
- Surveillance 2h
- Contrôle 14-21 jours

CHOIX PATIENTE:
- Méthode choisie: [médicamenteuse / chirurgicale / hésite]
- Raisons du choix: [expliquées]

INFORMATIONS DONNÉES:

Déroulement:
- Délai réflexion: [7 jours obligatoires entre 1ère et 2ème consultation]
- Entretien psycho-social: [proposé, obligatoire si mineure]
- Attestation consentement: remise

Suites normales:
- Saignements: [variables, 1-2 semaines]
- Douleurs: [contractions, prendre antalgiques]
- Retour règles: [4-6 semaines]

Complications à surveiller (rares):
- Hémorragie abondante (> 2 serviettes/h pendant 2h)
- Fièvre > 38°C
- Douleurs intenses non calmées
- Signes grossesse persistants

Contraception:
- Reprise dès le jour de l'IVG
- Méthode: [pilule / DIU / implant / autre] → prescription donnée
- Pose DIU: [le jour de l'IVG chirurgicale / 15j après si médicamenteuse]

Prévention Rhésus:
- Si rhésus négatif: injection Rhophylac obligatoire dans les 72h

Soutien psychologique:
- Numéro écoute: [donné]
- Proposition suivi psychologique: [accepté / refusé]

DOCUMENTS REMIS:
- Attestation consultation
- Livret information IVG
- Consentement à signer (ramener consultation suivante)
- Numéros urgence

BIOLOGIE:
- Groupe sanguin si non connu
- β-HCG si doute terme
- Sérologies si non faites: [VIH, VHB, VHC proposées]`,
      conclusion: `CONSULTATION INFORMATION IVG.

CONTEXTE:
- Terme: [SA]
- Demande: [ferme / ambivalente]
- Soutien: [présent / absent]

MÉTHODE CHOISIE:
- [IVG médicamenteuse / IVG chirurgicale / à décider]

INFORMATIONS:
✓ Méthodes expliquées
✓ Déroulement détaillé
✓ Risques et complications
✓ Suivi
✓ Contraception future

DÉLAI RÉFLEXION:
- 7 jours obligatoires
- Prochaine consultation: [date] (si > 7 jours après aujourd'hui)

ENTRETIEN PSYCHO-SOCIAL:
- [Proposé / Obligatoire si mineure / Accepté / Refusé]
- RDV: [si accepté]

PRESCRIPTIONS:
- Échographie datation [si non faite]
- Groupe sanguin [si non connu]
- Contraception future: [ordonnance remise]

Patiente informée. Questions répondues.
Coordonnées centre IVG: [téléphone, adresse].
Rappel: droit de changer d'avis à tout moment.`
    }
  },

  {
    id: 'ivg-suivi-post',
    name: 'IVG - Consultation de suivi post-IVG',
    type: 'ivg',
    data: {
      type: 'ivg',
      motif: 'Consultation de suivi post-IVG',
      examenClinique: `CONSULTATION DE SUIVI POST-IVG (14-21 jours après)

RAPPEL:
- Date IVG: [JJ/MM/AAAA]
- Méthode: [médicamenteuse / chirurgicale]
- Terme: [SA]

DÉROULEMENT IVG:
[Si médicamenteuse:]
- Prise Mifépristone: [date]
- Prise Misoprostol: [date, lieu: domicile/établissement]
- Expulsion: [survenue quand, douleurs, saignements]
- Produit d'expulsion vu: [oui / non / incertain]
- Douleurs: [intensité EVA, antalgiques efficaces]
- Saignements: [abondance, durée]

[Si chirurgicale:]
- Date intervention: [JJ/MM/AAAA]
- Anesthésie: [générale / locale]
- Déroulement: [simple / difficultés]
- Suites immédiates: [simples / douleurs / saignements]

SUITES À DOMICILE:
Saignements:
- Durée totale: [jours]
- Abondance: [faibles / moyens / abondants]
- Actuellement: [terminés / en cours / spottings]
- Caillots: [oui / non]

Douleurs:
- Durée: [jours]
- Intensité: [EVA]
- Antalgiques: [efficaces / insuffisants]
- Actuellement: [aucune / légères / modérées]

Complications:
- Fièvre: [non / oui, température max, traitée]
- Hémorragie: [non / oui, consultation urgence]
- Infection: [non / suspicion]
- Autres: [préciser]

ÉTAT ACTUEL:
- État général: [bon / fatigue / autre]
- Signes grossesse: [disparus / persistants: nausées, tension seins]
- Reprise activités: [normale / progressive]

EXAMEN CLINIQUE:
- TA: [mmHg], Pouls: [bpm]
- Température: [°C]
- Abdomen: [souple, indolore / douloureux]

Examen gynécologique:
- Spéculum: col [fermé], leucorrhées [normales / anormales]
- Toucher vaginal:
  * Utérus: [involué, taille normale / augmenté]
  * Annexes: [libres / masse / douleur]
  * Mobilisation utérine: [indolore / douloureuse]

EXAMENS COMPLÉMENTAIRES:
β-HCG plasmatique:
- Taux: [UI/L]
- [< 1000: IVG complète probable]
- [> 1500: IVG incomplète, grossesse évolutive à éliminer]

Échographie pelvienne:
- Cavité utérine: [vide / rétention / sac gestationnel]
- Contenu intra-utérin: [aucun / image [mm]]
- [Si image < 15mm sans vascularisation: abstention, contrôle]
- [Si > 15mm ou vascularisée: aspiration complémentaire nécessaire]

RÉSULTAT IVG:
☐ IVG COMPLÈTE - Succès
  → Utérus involué, β-HCG < 1000, échographie normale

☐ IVG INCOMPLÈTE - Rétention
  → Nécessite aspiration complémentaire
  → Programmée le: [date]

☐ GROSSESSE ÉVOLUTIVE (échec IVG médicamenteuse)
  → IVG chirurgicale programmée le: [date]

CONTRACEPTION:
- Reprise: [oui / non]
- Méthode: [pilule / DIU / implant / autre]
- Observance: [bonne / oublis]
- Tolérance: [bonne / effets indésirables]
- [Si DIU: pose réalisée aujourd'hui / à programmer]

PRÉVENTION RHÉSUS:
- [Si Rh négatif: Rhophylac réalisé dans les 72h post-IVG]

ÉTAT PSYCHOLOGIQUE:
- Vécu IVG: [bien / difficile / culpabilité / soulagement]
- Soutien entourage: [présent / absent]
- Besoin accompagnement psy: [non / oui → orientation]
- Relation couple: [stable / fragilisée]

PRÉVENTION IST:
- Dépistage: [proposé / réalisé / refusé]
- Préservatif: [utilisation systématique conseillée]`,
      conclusion: `CONSULTATION POST-IVG à J[nombre].

RÉSULTAT:
- [IVG COMPLÈTE - Évolution favorable]
- [IVG INCOMPLÈTE - Aspiration complémentaire nécessaire]
- [ÉCHEC - Grossesse évolutive]

SUITES:
- Saignements: [normaux / absents]
- Douleurs: [nulles / minimes]
- Complications: [aucune / préciser]

β-HCG: [UI/L]
Échographie: [cavité vide / rétention [mm]]

CONTRACEPTION:
- Méthode: [préciser]
- [DIU posé aujourd'hui / Implant posé / Pilule prescrite]

ÉTAT PSYCHOLOGIQUE:
- [Sereine / Besoin soutien]
- [Orientation psychologue: oui/non]

CONDUITE À TENIR:
[Si IVG complète:]
- Surveillance terminée
- Retour règles attendu dans [4-6 semaines]
- Consultation gynéco dans [3-6 mois]
- Contraception: [poursuivre, RDV contrôle si DIU]

[Si IVG incomplète:]
- Aspiration programmée le: [date]
- Contrôle post-aspiration: [date]

[Si échec:]
- IVG chirurgicale urgente programmée

DOCUMENTS REMIS:
- Attestation fin prise en charge
- Prescription contraception
- Certificat médical si nécessaire (arrêt travail)

Patiente informée. Questions répondues.
Rappel: consultation urgente si fièvre, douleurs, hémorragie.`
    }
  },

  // ========== TEMPLATES GYNÉCO ADDITIONNELS ==========

  {
    id: 'gyneco-endometriose',
    name: 'Endométriose',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Suspicion ou suivi endométriose',
      examen_clinique: `Interrogatoire:
- Âge: [ans]
- Cycles: [réguliers/irréguliers, durée]
- Dernières règles: [date]

Douleurs pelviennes (symptôme cardinal):
- Dysménorrhée (douleurs règles):
  * Intensité: [EVA /10]
  * Début: [1er jour règles / avant règles]
  * Évolution: [progressive depuis [années] / brutale]
  * Résistance antalgiques: [paracétamol inefficace / AINS insuffisants]
  * Impact: [absentéisme scolaire/professionnel [jours/mois]]
- Douleurs pelviennes chroniques:
  * Permanentes: [oui/non]
  * Accentuation pré-menstruelle: [oui/non]
  * Localisation: [hypogastre / fosse iliaque D/G / lombaires]
- Dyspareunie (douleurs rapports):
  * Profonde: [oui/non, empêche rapports]
  * Superficielle: [oui/non]
  * Impact vie sexuelle: [majeur/modéré/absent]
- Dyschésie (douleurs défécation):
  * Période menstruelle: [oui/non, EVA /10]
  * Permanente: [oui/non]
  * Rectorragies cataméniales: [oui/non]
- Dysurie (troubles urinaires):
  * Douleurs miction: [oui/non]
  * Hématurie cataméniale: [oui/non]

Fertilité:
- Désir de grossesse: [actuel / futur / absent]
- Essais conception: [durée, résultat]
- Infertilité: [primaire/secondaire]

Antécédents:
- Gynéco: gestité [G], parité [P]
- Chirurgie abdominale: [césarienne, appendicectomie, autre]
- Familiaux: endométriose chez [mère/sœur/tante]
- Traitements essayés:
  * Antalgiques: [efficacité]
  * Contraception hormonale: [type, efficacité sur douleurs]

Examen général:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- État général: [bon / altéré par douleurs chroniques]

Examen gynécologique:
- Inspection vulve/périnée: [normale / cicatrice épisiotomie douloureuse]
- Spéculum: col [aspect normal], cul-de-sac postérieur [douloureux/nodules bleutés]
- Toucher vaginal:
  * Utérus: [taille, mobilité, position]
  * Rétroversion utérine fixée: [oui/non → signe d'adhérences]
  * Nodules ligaments utéro-sacrés: [oui/non, bilatéraux]
  * Douleur au niveau cul-de-sac Douglas: [oui/non]
  * Annexes: [masses/nodules ovariens: [oui/non, côté, taille]
  * Douleur à la mobilisation utérine: [oui/non → "cri du Douglas"]

Examen complémentaire:
- Toucher rectal (si dyschésie): [nodules palpables/non]`,
      conclusion: `ENDOMÉTRIOSE [suspectée / confirmée / en cours de traitement].

Phénotype clinique:
[Cocher ce qui correspond:]
- Endométriose superficielle péritonéale
- Endométriose ovarienne (endométriome/"kyste chocolat")
- Endométriose profonde (ligaments utéro-sacrés, cloison recto-vaginale)
- Atteinte digestive (intestin, rectum)
- Atteinte urinaire (vessie, uretères)

Score douleur:
- Dysménorrhée: [/10]
- Dyspareunie: [/10]
- Douleurs pelviennes chroniques: [/10]
- Impact qualité de vie: [majeur/modéré/léger]

EXAMENS PRESCRITS:
- Échographie pelvienne par voie endovaginale (opérateur expert endométriose)
- Si suspicion endométriose profonde: IRM pelvienne
- Bilan pré-thérapeutique: NFS (si ménorragies), bilan hépatique

TRAITEMENT PROPOSÉ:

Traitement médical 1ère intention:
[Si désir grossesse absent:]
- Contraception hormonale en continu (blocage règles):
  * Pilule œstroprogestative en continu
  * Ou progestatif seul (désogestrel, diénogest)
  * Ou DIU lévonorgestrel (Mirena®)
  * Objectif: aménorrhée, réduction douleurs

[Antalgiques:]
- AINS: ibuprofène 400mg x3/j pendant règles
- Paracétamol 1g x4/j
- Si douleurs neuropathiques: discuter gabapentine/prégabaline

Mesures associées:
- Activité physique régulière (améliore douleurs)
- Kinésithérapie périnéale/abdominale
- Sophrologie, relaxation (gestion douleur chronique)
- Soutien psychologique si retentissement majeur
- Associations de patientes: EndoFrance

[Si échec traitement médical ou endométriose profonde symptomatique:]
→ Orientation CHIRURGIE:
- Consultation chirurgien gynécologue spécialisé endométriose
- Cœlioscopie diagnostique et thérapeutique
- Résection lésions endométriosiques
- Conservation fertilité si désir grossesse

[Si infertilité associée:]
→ Orientation centre AMP (Assistance Médicale Procréation)

SURVEILLANCE:
- Consultation contrôle dans 3 mois (efficacité traitement, tolérance)
- Échographie de surveillance si endométriome
- Rappel: maladie chronique, traitements au long cours

Documents remis:
- Ordonnance traitement
- Fiche information endométriose
- Coordonnées association EndoFrance

Patiente informée. Questions répondues.
RDV: [date] pour réévaluation.`
    }
  },

  {
    id: 'gyneco-adenomyose',
    name: 'Adénomyose',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Suspicion ou suivi adénomyose',
      examen_clinique: `Interrogatoire:
- Âge: [ans] → [classiquement > 40 ans, multipare]
- Cycles: [réguliers/irréguliers]
- Dernières règles: [date]

Symptômes:
- Ménorragies (règles abondantes):
  * Durée règles: [jours, normal 3-7j]
  * Abondance: [nombre protections/jour, caillots]
  * Anémie symptomatique: [fatigue, pâleur, essoufflement]
- Dysménorrhée (douleurs règles):
  * Intensité: [EVA /10]
  * Type: [crampes, pesanteur pelvienne]
  * Survenue: [progressive avec l'âge]
  * Résistance antalgiques: [oui/non]
- Métrorragies (saignements hors règles):
  * Spotting pré-menstruel: [oui/non]
  * Saignements post-coïtaux: [oui/non]
- Douleurs pelviennes chroniques:
  * Pesanteur pelvienne: [permanente/pendant règles]
  * Dyspareunie profonde: [oui/non]

Retentissement:
- Anémie: [asthénie, pâleur, vertiges]
- Impact qualité de vie: [majeur/modéré]
- Absentéisme: [jours/mois]

Antécédents gynéco-obstétricaux:
- Gestité: [G], Parité: [P]
- Accouchements: [nombre, voie basse/césarienne]
- Curetages/IVG: [nombre] → facteur risque adénomyose
- Chirurgie utérine: [myomectomie, césariennes]
- Endométriose associée: [suspectée/diagnostiquée]

Contraception/Traitements:
- Contraception actuelle: [type]
- Traitements hormonaux essayés: [efficacité]
- Supplémentation martiale: [si anémie]

Désir de grossesse:
- Futur: [oui/non/indécis]
- Conservation utérus: [souhaite préserver / accepte hystérectomie si échec]

Examen général:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- Pâleur conjonctivale: [oui/non → anémie]
- TA: [mmHg], Pouls: [bpm]

Examen gynécologique:
- Spéculum: col [aspect], saignement [présent/absent]
- Toucher vaginal:
  * Utérus: [augmenté de volume, globuleux, "mou"]
  * Taille: [équivalent [SA] de grossesse / [cm]]
  * Sensibilité utérine: [oui/non]
  * Mobilité: [conservée/limitée]
  * Annexes: [libres/masses]
  * Paramètres: [souples]

Diagnostic différentiel:
- Fibromes utérins (utérus bosselé vs globuleux)
- Polypes endomètre
- Hyperplasie endomètre`,
      conclusion: `ADÉNOMYOSE [suspectée / probable / confirmée échographiquement].

Critères diagnostiques retrouvés:
- Âge > 40 ans, multipare
- Ménorragies + dysménorrhée progressive
- Utérus augmenté volume, globuleux, sensible
- [Échographie: myomètre hétérogène, stries linéaires, kystes myométriaux]

Retentissement:
- Qualité de vie: [altérée/très altérée]
- Anémie: [suspectée / confirmée: Hb [g/dL]]

EXAMENS PRESCRITS:
- Échographie pelvienne endovaginale (critères Morpheus: épaisseur zone jonctionnelle > 12mm)
- IRM pelvienne si doute diagnostique (gold standard)
- NFS (recherche anémie ferriprive)
- Ferritine, fer sérique (bilan martial)

TRAITEMENT PROPOSÉ:

Traitement médical 1ère intention:
[Si désir conservation utérus:]

1. Contraception hormonale:
- DIU lévonorgestrel (Mirena®) → traitement de choix
  * Réduit ménorragies 90%
  * Peut induire aménorrhée
  * Efficacité 5 ans
- Ou pilule œstroprogestative en continu
- Ou progestatifs (désogestrel, diénogest)

2. Antalgiques:
- AINS: ibuprofène 400mg x3/j pendant règles
- Paracétamol 1g x4/j
- Acide tranexamique (Exacyl®) si ménorragies importantes (réduit flux 50%)

3. Supplémentation martiale si anémie:
- Fer per os: [Tardyferon®, Timoférol®]
- Ou perfusion fer IV si anémie sévère/intolérance orale

Alternatives si échec:
- Analogues GnRH (Décapeptyl®, Enantone®):
  * Ménopause artificielle transitoire (max 6 mois)
  * Add-back therapy (œstrogènes faible dose) pour limiter effets secondaires
  * Avant chirurgie ou si contre-indication chirurgie

Traitement chirurgical:
[Si échec médical + pas désir grossesse:]
- Hystérectomie (totale ou subtotale):
  * Voie vaginale ou cœlioscopie
  * Traitement curatif définitif
  * Conservation ovaires si < 50 ans

[Si désir grossesse conservé:]
- Techniques conservatrices:
  * Résection adénomyose localisée (résultats variables)
  * Embolisation artères utérines (controversé)
  * Ultrasons focalisés haute intensité (HIFU)

SURVEILLANCE:
- Consultation contrôle 3 mois (efficacité DIU/pilule, tolérance)
- NFS contrôle après 3 mois traitement martial
- Échographie surveillance si traitement conservateur

Orientation chirurgien gynécologue si:
- Échec traitement médical bien conduit
- Anémie sévère récidivante
- Altération majeure qualité de vie
- Souhait hystérectomie

Patiente informée du caractère bénin mais chronique de la pathologie.
Documents remis: ordonnance, fiche info adénomyose.
RDV contrôle: [date].`
    }
  },

  {
    id: 'gyneco-sopk',
    name: 'SOPK (Syndrome Ovaires PolyKystiques)',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Suspicion ou suivi SOPK',
      examen_clinique: `Interrogatoire:
- Âge: [ans]
- Ménarche: [âge] ans

Troubles du cycle (critère majeur):
- Oligoménorrhée: [cycles > 35 jours, [X] cycles/an]
- Aménorrhée: [absence règles depuis [mois]]
- Cycles irréguliers: [depuis ménarche / secondaire]
- Dernières règles: [date]

Hyperandrogénie clinique:
- Hirsutisme (pilosité excessive):
  * Localisation: [visage, menton, thorax, abdomen, cuisses]
  * Score Ferriman-Gallwey: [/36, pathologique si > 8]
  * Méthodes épilation: [fréquence]
- Acné:
  * Localisation: [visage, dos, thorax]
  * Sévérité: [légère/modérée/sévère/kystique]
  * Traitements essayés: [efficacité]
- Alopécie androgénique:
  * Vertex, tempes: [oui/non]
  * Évolution: [progressive]
- Séborrhée: [oui/non]

Signes métaboliques:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- Surpoids/Obésité: [oui: IMC > 25 / non]
- Prise poids récente: [kg en [durée]]
- Répartition graisse: [androïde/abdominale > gynoïde]
- Tour de taille: [cm, pathologique si > 80cm femme]
- Acanthosis nigricans (taches brunes plis):
  * Localisation: [cou, aisselles, plis inguinaux]
  * Présence: [oui/non → insulino-résistance]

Troubles métaboliques:
- Diabète familial: [parents, fratrie]
- Symptômes diabète: [soif, polyurie, fatigue]
- Hypoglycémies réactionnelles: [fringales, malaises]
- ATCD syndrome métabolique famille: [oui/non]

Fertilité:
- Désir de grossesse: [actuel/futur/absent]
- Essais conception: [durée, échecs]
- Infertilité: [primaire/secondaire]
- Cycles ovulatoires: [courbe température, tests ovulation]

Autres symptômes:
- Troubles psychologiques:
  * Anxiété: [oui/non]
  * Dépression: [oui/non]
  * Impact image corporelle: [majeur/modéré]
- Apnées du sommeil: [ronflements, fatigue diurne]

Antécédents:
- Médicaux: [diabète, HTA, dyslipidémie]
- Familiaux: [diabète type 2, SOPK, obésité]
- Contraception: [pilule peut masquer irrégularités cycles]

Examen général:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- Tour taille: [cm]
- TA: [mmHg]
- Signes hyperandrogénie:
  * Hirsutisme score Ferriman: [/36]
  * Acné: [sévérité]
  * Alopécie: [oui/non]
  * Acanthosis nigricans: [oui/non]

Examen gynécologique:
- Spéculum: col [aspect normal]
- Toucher vaginal:
  * Utérus: [taille normale]
  * Ovaires: [augmentés de volume/normaux]`,
      conclusion: `SYNDROME OVAIRES POLYKYSTIQUES (SOPK) [suspecté / probable / confirmé].

Critères Rotterdam (2 sur 3 nécessaires):
1. Oligo/anovulation: [présente: cycles irréguliers/aménorrhée]
2. Hyperandrogénie clinique ou biologique: [présente: hirsutisme, acné, alopécie]
3. Ovaires polykystiques échographie: [à confirmer: ≥ 20 follicules/ovaire]

Phénotype SOPK:
- Phénotype A (classique): oligo/anovulation + hyperandrogénie + OPK écho
- Phénotype B: oligo/anovulation + hyperandrogénie
- Phénotype C: hyperandrogénie + OPK écho
- Phénotype D (ovulatoire): oligo/anovulation + OPK écho

Signes métaboliques associés:
- IMC: [calcul] → [normal / surpoids / obésité]
- Insulino-résistance: [suspectée: acanthosis nigricans, obésité abdominale]
- Risque cardiovasculaire: [évaluer]

EXAMENS PRESCRITS:

Bilan hormonal (en début cycle J3-J5 si cycles, ou n'importe quand si aménorrhée):
- LH, FSH (rapport LH/FSH > 2 évocateur)
- Testostérone totale et libre (hyperandrogénie)
- Delta-4-androstènedione
- SDHEA (éliminer origine surrénalienne)
- 17-OH-progestérone (éliminer hyperplasie congénitale surrénales)
- Prolactine (diagnostic différentiel)
- TSH (éliminer dysthyroïdie)

Bilan métabolique (dépistage syndrome métabolique):
- Glycémie à jeun
- Insulinémie à jeun (calcul HOMA = insulino-résistance)
- HbA1c
- Bilan lipidique: cholestérol total, HDL, LDL, triglycérides
- Transaminases (NASH si obésité)

Échographie pelvienne:
- Ovaires polykystiques: ≥ 20 follicules de 2-9mm par ovaire
- Volume ovarien > 10 mL
- Stroma ovarien hyperéchogène

TRAITEMENT PROPOSÉ:

1. Mesures hygiéno-diététiques (ESSENTIEL):
- Perte poids 5-10% (améliore cycles, fertilité, métabolisme)
- Alimentation équilibrée: index glycémique bas
- Activité physique régulière: 30min/j, 5j/semaine
- Consultation diététicienne recommandée

2. Traitement hyperandrogénie/régularisation cycles:

[Si pas désir grossesse:]
- Pilule œstroprogestative antiandrogénique:
  * Contenant acétate cyprotérone, drospirénone, ou diénogest
  * Efficace sur: acné, hirsutisme, régularisation cycles
  * Protection endomètre (risque cancer si aménorrhée prolongée)

[Si hirsutisme majeur:]
- Acétate de cyprotérone (Androcur®): 50mg/j J1-J10 + œstrogènes J1-J21
- Spironolactone 50-100mg/j (hors AMM)
- Traitements locaux: épilation laser, électrolyse

[Si acné sévère:]
- Pilule antiandrogénique
- ± Isotrétinoïne (Roaccutane®) si échec (contraception obligatoire)

3. Traitement insulino-résistance:
[Si surpoids/obésité + insulino-résistance:]
- Metformine (Glucophage®) 500mg → 1500-2000mg/j
  * Améliore cycles, ovulation, métabolisme
  * Réduit risque diabète type 2
  * Effets secondaires digestifs initiaux

4. Traitement infertilité:
[Si désir grossesse:]
- Perte poids (peut restaurer ovulation spontanée)
- Citrate de clomifène (inducteur ovulation) → orientation gynéco/AMP
- Metformine + clomifène si résistance
- FIV si échec

PRÉVENTION COMPLICATIONS:
- Dépistage diabète type 2: glycémie annuelle
- Dépistage HTA: TA chaque consultation
- Bilan lipidique tous les 2-5 ans
- Dépistage apnées sommeil si obésité
- Protection endomètre: contraception ou progestatifs (risque hyperplasie/cancer si aménorrhée prolongée)

SURVEILLANCE:
- Consultation 3 mois: efficacité traitement, tolérance, poids
- Bilan hormonal/métabolique annuel
- Échographie si aménorrhée persistante

Orientation:
- Endocrinologue si troubles métaboliques sévères
- Centre AMP si désir grossesse et infertilité

Documents remis:
- Ordonnance bilans et traitement
- Fiche info SOPK
- Coordonnées association patientes (OPK France)

Patiente informée: pathologie chronique, prise en charge au long cours.
Importance perte poids et hygiène vie.
RDV: [date].`
    }
  },

  {
    id: 'gyneco-fcs',
    name: 'FCS (Fausse Couche Spontanée précoce)',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Fausse couche spontanée (< 14 SA)',
      examen_clinique: `CONTEXTE:
- Âge: [ans]
- Date dernières règles: [DDR]
- Âge gestationnel: [SA + jours]
- Test grossesse positif le: [date]
- Grossesse: [désirée / non prévue]

CIRCONSTANCES:
- Début symptômes: [date, heure]
- Métrorragies (saignements):
  * Abondance: [minimes/modérées/abondantes, nombre protections]
  * Couleur: [rouge vif / marron / noirâtre]
  * Caillots: [oui/non, taille]
  * Tissus expulsés: [oui/non]
- Douleurs:
  * Type: [crampes/contractions]
  * Intensité: [EVA /10]
  * Localisation: [hypogastre/lombaires]
- Signes associés:
  * Nausées/vomissements: [oui/non]
  * Fièvre: [oui/non]
  * Malaise, vertiges: [oui/non]

Consultation antérieure:
- Échographie datation: [faite le [date]: activité cardiaque [présente/absente]]
- Dosage β-HCG: [[valeur] UI/L le [date]]
- Diagnostic posé: [grossesse évolutive / arrêt évolution / grossesse non visible]

Antécédents gynéco-obstétricaux:
- Gestité: [G], Parité: [P]
- Fausses couches antérieures: [nombre, dates, [SA]]
  * [Si FCS à répétition: ≥ 3 FCS → bilan étiologique]
- Grossesses menées à terme: [nombre]
- GEU (grossesse extra-utérine): [nombre]
- Curetages: [nombre]
- Infections génitales récentes: [oui/non]

Antécédents médicaux:
- Pathologies: [diabète, HTA, thrombophilie, lupus, SAPL]
- Traitements: [liste]
- Tabac: [oui/non, [PA]]
- Groupe sanguin: [groupe, rhésus]

EXAMEN CLINIQUE:

État général:
- Conscience: [normale]
- TA: [mmHg], Pouls: [bpm]
- Température: [°C]
- Pâleur: [oui/non]
- État hémodynamique: [stable/instable]

Examen abdominal:
- Défense, contracture: [absente]
- Douleur palpation: [hypogastre oui/non]
- Utérus: [non palpable si < 12 SA]

Examen gynécologique:
- Spéculum:
  * Saignement: [actif minime/modéré/abondant / tari]
  * Origine: [endocol]
  * Caillots/débris: [présents/absents]
  * Col: [fermé / entrouvert / dilaté / débris visibles]
- Toucher vaginal:
  * Utérus: [taille [SA], mou/tonique]
  * Col: [fermé/entrouvert/perméable au doigt]
  * Annexes: [libres, pas de masse]
  * Douleur à la mobilisation utérine: [oui/non]
  * Cul-de-sac Douglas: [libre/empâté]

ÉCHOGRAPHIE PELVIENNE (si disponible):
- Grossesse intra-utérine: [confirmée]
- Sac gestationnel: [visible, taille [mm]]
- Vésicule vitelline: [présente/absente]
- Embryon: [visible [mm] / non visible]
- Activité cardiaque: [présente / absente → MORT IN UTERO]
- Terme échographique: [SA] (concordance DDR: [oui/non])
- Hématome décidual: [présent/absent]
- Vacuité utérine: [oui/non → fausse couche complète]`,
      conclusion: `FAUSSE COUCHE SPONTANÉE PRÉCOCE ([SA]).

Diagnostic:
[Sélectionner:]
- GROSSESSE ARRÊTÉE (arrêt développement):
  * Sac gestationnel > 25mm sans embryon visible
  * Ou embryon > 7mm sans activité cardiaque
  * Diagnostic certain

- FAUSSE COUCHE EN COURS:
  * Saignements + col ouvert
  * ± Activité cardiaque encore présente
  * Évolution inéluctable

- FAUSSE COUCHE COMPLÈTE:
  * Expulsion complète
  * Utérus vide échographiquement
  * Saignements diminuant

- FAUSSE COUCHE INCOMPLÈTE (rétention):
  * Débris intra-utérins résiduels
  * Risque hémorragie/infection

TYPE DE PRISE EN CHARGE PROPOSÉE:

[Option 1: EXPECTATIVE (attentisme):]
Conditions:
- Patiente stable hémodynamiquement
- Fausse couche complète ou début évolution
- Surveillance possible
- Patiente informée et consentante

Surveillance:
- Dosage β-HCG à J0, puis contrôle 48-72h (doit baisser)
- Échographie contrôle J7-J10 (vérifier vacuité)
- Consignes: consultation urgence si hémorragie, fièvre, douleurs intenses
- Fausse couche complète dans 70-80% cas sous 2 semaines

[Option 2: TRAITEMENT MÉDICAL:]
Conditions:
- Grossesse < 9 SA
- Hémodynamique stable
- Pas de contre-indication (anémie sévère, troubles coagulation, DIU en place)

Protocole:
- Misoprostol (Gymiso®) 400-800 µg per os ou vaginal
- À domicile ou hôpital jour
- Expulsion sous 4-24h
- Douleurs type contractions (antalgiques prescrits)
- Saignements abondants 1-2 jours

Ordonnance:
- Misoprostol selon protocole établissement
- AINS: ibuprofène 400mg x3/j
- Paracétamol 1g x4/j
- Phloroglucinol (Spasfon®) si crampes

Surveillance:
- Échographie contrôle J7-J10
- β-HCG contrôle si doute
- Consignes surveillance

[Option 3: TRAITEMENT CHIRURGICAL (aspiration):]
Indications:
- Choix patiente
- Fausse couche incomplète avec rétention
- Échec expectative/médical
- Hémorragie abondante
- Instabilité hémodynamique
- Infection (fausse couche septique)

Technique:
- Aspiration endo-utérine sous anesthésie générale
- Hospitalisation ambulatoire ou 24h
- Efficacité > 95%

BILAN COMPLÉMENTAIRE:

Systématique:
- Dosage β-HCG quantitatif (suivi décroissance)
- Groupe sanguin, RAI (si Rh négatif)
- NFS (vérifier anémie si saignements abondants)

Si fausses couches à répétition (≥ 3):
→ Bilan étiologique couple à distance (2-3 mois):
- Caryotypes couple
- Bilan thrombophilie (anticoagulant lupique, anticorps anticardiolipine)
- Bilan immunologique (AC anti-nucléaires)
- Hystéroscopie (malformation utérine)
- Échographie utérine 3D
- Bilan hormonal thyroïde

PRÉVENTION ALLO-IMMUNISATION:
[Si rhésus négatif:]
- Injection immunoglobulines anti-D (Rhophylac®) 200 µg IM dans les 72h
- Indispensable même si fausse couche précoce

ACCOMPAGNEMENT PSYCHOLOGIQUE:
- Temps d'écoute, expression tristesse
- Deuil périnatal reconnu
- Soutien psychologique proposé si besoin
- Association de soutien: Agapa, Spama
- Certificat délivré si demande (reconnaissance deuil)

CONTRACEPTION:
- Reprise ovulation possible dès 2 semaines
- Contraception à instaurer si pas nouveau désir grossesse immédiat
- Pilule peut être débutée immédiatement
- DIU: attendre retour couches (2-4 semaines)

NOUVELLE GROSSESSE:
- Attendre retour règles normales (facilite datation)
- Pas de délai médical obligatoire si fausse couche isolée
- Supplémentation acide folique 0,4mg/j si nouveau projet grossesse
- Consultation pré-conceptionnelle si FCS à répétition

SURVEILLANCE:
- Contrôle clinique + échographie: [date]
- β-HCG contrôle: [date]
- Retour règles attendu: 4-6 semaines

Patiente informée et accompagnée.
Consignes de surveillance remises.
Soutien psychologique proposé.

Consultation urgence si:
- Hémorragie abondante (> 1 protection/heure)
- Fièvre > 38°C
- Douleurs intenses non calmées
- Malaise, vertiges

RDV contrôle: [date].`
    }
  },

  {
    id: 'gyneco-fct',
    name: 'FCT (Fausse Couche Tardive 14-22 SA)',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Fausse couche tardive (14-22 SA)',
      examen_clinique: `CONTEXTE:
- Âge: [ans]
- Date dernières règles: [DDR]
- Âge gestationnel: [SA + jours] (14-22 SA)
- Grossesse: [désirée / non prévue]
- Suivi grossesse: [régulier / irrégulier]

CIRCONSTANCES:
- Début symptômes: [date, heure]
- Mode découverte:
  * Contractions utérines: [oui/non]
  * Perte eaux (rupture membranes): [oui/non, date/heure]
  * Métrorragies: [oui/non]
  * Mouvements actifs fœtaux: [présents jusqu'à [date] / jamais perçus]
  * Diagnostic échographique: [mort in utero (MFIU) / grossesse arrêtée]

Symptômes:
- Contractions:
  * Fréquence: [/10 min]
  * Durée: [secondes]
  * Intensité: [douloureuses/non douloureuses]
  * Expulsion: [en cours/réalisée/non]
- Métrorragies:
  * Abondance: [minimes/modérées/abondantes]
  * Couleur: [rouge/brunâtre]
  * Liquide amniotique: [clair/teinté/purulent]
- Fièvre: [oui/non, T° max]
- Douleurs pelviennes: [EVA /10]

Consultation antérieure:
- Échographie T1 (12 SA): [normale / anormale]
- Échographie T2 ([SA]): [réalisée: [date], résultat]
- Mouvements actifs fœtaux perçus: [depuis [SA]]
- β-HCG: [[valeur] à [date]]
- Dépistage T21: [normal/à risque]

Antécédents gynéco-obstétricaux:
- Gestité: [G], Parité: [P]
- Fausses couches tardives antérieures: [nombre, [SA], étiologie connue]
- Fausses couches précoces: [nombre]
- Accouchements prématurés: [oui/non, [SA]]
- Cerclage: [antécédent/actuel]
- Béance col utérin: [diagnostiquée/suspectée]
- Malformations utérines: [utérus cloisonné, bicorne]
- Infections génitales: [récentes/répétées]
- Curetages, conisation: [nombre]

Antécédents médicaux:
- Pathologies: [diabète, HTA, thrombophilie, lupus, SAPL, insuffisance rénale]
- Maladies auto-immunes: [oui/non]
- Traitements: [liste]
- Tabac: [oui/non, [PA]]
- Toxiques: [alcool, drogues]
- Groupe sanguin: [groupe, rhésus]

EXAMEN CLINIQUE:

État général:
- Conscience: [normale / altérée]
- TA: [mmHg], Pouls: [bpm]
- Température: [°C]
- Pâleur: [oui/non]
- État hémodynamique: [stable/instable]
- État psychologique: [choc, sidération, pleurs]

Examen abdominal:
- Hauteur utérine: [[cm], correspond [SA]]
- Utérus: [tonique/mou]
- Contractions palpables: [oui/non, fréquence]
- Douleur provoquée: [oui/non]
- Cicatrice césarienne: [oui/non, aspect]

Examen gynécologique:
- Spéculum:
  * Métrorragies: [actives/absentes]
  * Liquide amniotique: [s'écoule / absent]
  * Aspect liquide: [clair/teinté/méconial/purulent]
  * Débris/membranes: [visibles/non]
  * Col: [fermé/entrouvert/dilaté [cm] / expulsion en cours]
- Toucher vaginal:
  * Col: [long/raccourci/effacé, dilatation [cm]]
  * Présentation: [palpable/non, [siège/céphalique]]
  * Poche des eaux: [intacte/rompue]
  * Membranes: [perçues/non]
  * Annexes: [libres]

ÉCHOGRAPHIE OBSTÉTRICALE (si disponible):
- Grossesse intra-utérine: [confirmée]
- Biométries fœtales: [conformes [SA] / petites/grandes]
- Activité cardiaque fœtale: [présente / absente → MFIU confirmée]
- Mouvements actifs fœtaux: [présents/absents]
- Liquide amniotique: [normal/oligo-hydramnios/anamnios]
- Placenta: [inséré [localisation], aspect [normal/hématome/décollement]]
- Longueur col: [mm, normal > 25mm]
- Col: [fermé/ouvert, protrusion membranes]
- Malformations fœtales: [oui/non: préciser]`,
      conclusion: `FAUSSE COUCHE TARDIVE / MORT FŒTALE IN UTERO ([SA]).

Diagnostic:
[Sélectionner:]
- MORT FŒTALE IN UTERO (MFIU) confirmée échographiquement
  * Absence activité cardiaque fœtale
  * Terme: [SA]
- FAUSSE COUCHE TARDIVE EN COURS
  * Contractions + dilatation col
  * Activité cardiaque [présente/absente]
- RUPTURE PRÉMATURÉE MEMBRANES
  * Perte liquide amniotique
  * Risque infection (chorioamniotite)
  * Expulsion spontanée sous 24-48h

Étiologie suspectée:
[Cocher possibles:]
- Béance cervico-isthmique (col incompétent)
- Infection materno-fœtale (chorioamniotite)
- Malformation fœtale
- Anomalie chromosomique
- Pathologie placentaire (hématome, décollement)
- Pathologie maternelle (HTA, diabète, SAPL)
- Cause inconnue (50% cas)

PRISE EN CHARGE IMMÉDIATE:

[Si expulsion imminente ou en cours:]
→ HOSPITALISATION IMMÉDIATE maternité
- Surveillance continue
- Antalgie (péridurale proposée)
- Accompagnement sage-femme
- Délivrance assistée
- Révision utérine si rétention

[Si MFIU diagnostiquée, pas travail spontané:]
→ DÉCLENCHEMENT TRAVAIL programmé:

Préparation:
- Consultation anesthésie
- Bilan pré-intervention:
  * NFS plaquettes (surveiller CIVD si MFIU > 4 semaines)
  * TP, TCA, fibrinogène
  * Groupe sanguin, RAI
- Information patiente/couple sur déroulement
- Temps réflexion si besoin (max 48-72h)
- Possibilité voir/tenir bébé après naissance expliquée

Protocole déclenchement (selon terme et parité):
- Maturation col: Mifépristone (Mifégyne®) 200mg per os
- Puis 36-48h après:
  * Misoprostol (prostaglandines) doses répétées jusqu'à expulsion
  * Péridurale proposée systématiquement
- Durée: variable (6h-48h)
- Hospitalisation maternité, accompagnement continu

Délivrance:
- Délivrance dirigée (ocytocine)
- Révision utérine systématique (rétention fréquente)
- Examen placenta/membranes

[Alternative si contre-indication déclenchement voie basse:]
- Hystérotomie (césarienne) sous AG
  * Indications rares: cicatrice utérine, placenta praevia

EXAMENS POST-EXPULSION:

Examens fœtus:
- Examen morphologique externe (pédiatre/sage-femme)
- Photographies (avec accord parental)
- Prélèvements:
  * Caryotype fœtal sur peau/sang cordon (recherche anomalie chromosomique)
  * Anatomo-pathologie: placenta + fœtus (recherche infection, malformation)
  * Bactériologie placenta si suspicion infection

Examens maternels:
- Prélèvements bactériologiques col/placenta (Strepto B, Listeria, E.coli...)
- Sérologies infectieuses: toxoplasmose, CMV, listériose, syphilis
- Thrombophilie si contexte évocateur

PRÉVENTION ALLO-IMMUNISATION:
[Si rhésus négatif:]
- Injection immunoglobulines anti-D (Rhophylac®) 200-300 µg IM < 72h
- Obligatoire à ce terme

BILAN ÉTIOLOGIQUE (à distance, 2-3 mois):

Si 1ère fausse couche tardive:
- Résultats caryotype fœtal
- Résultats anatomo-pathologie
- Résultats bactériologie

Si fausses couches tardives répétées (≥ 2):
→ Bilan exhaustif couple:
- Caryotypes parentaux
- Échographie pelvienne 3D (malformations utérines)
- Hystéroscopie diagnostique
- Hystérosalpingographie (col, cavité utérine)
- IRM pelvienne si doute malformation
- Bilan immunologique: SAPL (anticoagulant lupique, anticardiolipine, anti-β2GP1)
- Bilan thrombophilie (mutation facteur V Leiden, prothrombine G20210A, déficits protéine C/S)
- Bilan infectieux: prélèvements vaginaux (mycoplasme, chlamydia)
- Bilan endocrinien: TSH, glycémie

ACCOMPAGNEMENT PSYCHOLOGIQUE ET SOCIAL:

Soutien immédiat:
- Temps d'écoute, présence sage-femme/psychologue
- Reconnaissance deuil périnatal
- Possibilité voir bébé, prendre photos, empreintes mains/pieds
- Baptême ou rituel si souhaité (aumônerie)

Démarches administratives:
- Certificat médical d'accouchement (> 22 SA ou > 500g: déclaration état civil obligatoire)
- Inscription livret famille possible
- Certificat décès si > 22 SA
- Congé maternité: droits maintenus si > 22 SA
- Obsèques possibles (prise en charge CHU ou famille)

Suivi:
- Entretien post-natal sage-femme/psychologue
- Associations de soutien: Agapa, Petite Émilie, Spama, Nos Anges au Paradis
- Groupe de parole deuil périnatal

Arrêt de travail:
- Selon état psychologique et demande patiente
- Durée adaptée (minimum 15 jours)

SUIVI POST-FAUSSE COUCHE:

Consultation 6-8 semaines:
- Examen clinique: involution utérine, cicatrisation col
- Résultats examens (caryotype, anapath)
- Contraception si pas nouveau projet
- Bilan étiologique si indiqué
- État psychologique

Nouvelle grossesse:
- Attendre 2-3 mois (temps deuil, bilans)
- Supplémentation acide folique 5mg/j (si anomalie tube neural)
- Consultation pré-conceptionnelle
- Suivi grossesse rapproché
- Cerclage préventif si béance col diagnostiquée (13-15 SA grossesse suivante)
- Traitement anticoagulant si SAPL

PRÉVENTION GROSSESSE SUIVANTE:
[Si étiologie identifiée:]
- Cerclage prophylactique (béance col)
- Aspirine + héparine (SAPL, thrombophilie)
- Équilibration diabète/HTA
- Traitement malformation utérine (chirurgie)

SURVEILLANCE:
- Retour couches: 4-8 semaines
- Consultation post-natale: 6-8 semaines
- Consultation résultats bilan: [date]
- Soutien psychologique: suivi proposé

Patiente et conjoint accompagnés dans ce moment difficile.
Temps d'écoute privilégié.
Coordonnées associations remises.

Consultation urgence si:
- Hémorragie importante
- Fièvre > 38°C
- Douleurs pelviennes intenses
- Détresse psychologique aiguë

RDV post-natal: [date].
RDV consultation étiologique: [date, 2-3 mois].`
    }
  },

  {
    id: 'gyneco-metrorragies',
    name: 'Saignements hors règles (Métrorragies)',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Saignements en dehors des règles (métrorragies)',
      examen_clinique: `Interrogatoire:
- Âge: [ans]
- Cycles habituels: [réguliers/irréguliers, durée cycle]
- Dernières règles normales: [date]

Caractéristiques saignements:
- Début: [date]
- Durée: [jours]
- Abondance:
  * Spotting (taches): [oui/non]
  * Saignements modérés: [nombre protections/jour]
  * Hémorragie: [caillots, > 1 protection/heure]
- Couleur: [rouge vif / brunâtre / noirâtre]
- Moment survenue:
  * Inter-menstruel (milieu cycle): [oui/non]
  * Post-coïtal (après rapport): [oui/non]
  * Pré-menstruel: [oui/non]
  * Post-ménopausique: [oui/non → URGENT dépistage cancer]

Symptômes associés:
- Douleurs pelviennes: [oui/non, EVA /10]
- Leucorrhées (pertes): [oui/non, aspect, odeur]
- Fièvre: [oui/non]
- Signes sympathiques grossesse: [nausées, tension seins]
- Anémie: [fatigue, pâleur, essoufflement]

Contexte gynécologique:
- Contraception:
  * Pilule: [type, oublis récents]
  * DIU: [hormonal/cuivre, date pose]
  * Implant: [date pose]
  * Aucune: [oui]
- Rapports sexuels récents: [oui/non, date dernier]
- Possibilité grossesse: [oui/non]
- Traitement hormonal substitutif (THS): [oui/non, type]
- Frottis cervical: [date dernier, résultat]
- Ménopause: [oui depuis [ans] / non]

Antécédents gynéco:
- Fibromes utérins: [connus/non]
- Polypes: [antécédent/non]
- Endométriose: [oui/non]
- Adénomyose: [oui/non]
- Infections génitales: [récentes IST, mycose, vaginose]
- Dysplasie col: [CIN, traitement]
- Chirurgie gynéco: [conisation, curetage]

Antécédents obstétricaux:
- Gestité: [G], Parité: [P]
- Date dernier accouchement/fausse couche: [date]
- Curetages: [nombre]
- Post-partum: [accouchement récent < 6 semaines]

Antécédents médicaux:
- Troubles coagulation: [maladie Willebrand, thrombopénie]
- Traitements: [anticoagulants, antiagrégants, corticoïdes]
- Pathologies: [diabète, obésité, HTA, dysthyroïdie, cancer sein]

Facteurs de risque cancer endomètre:
- Âge > 50 ans
- Obésité (IMC > 30)
- SOPK
- Diabète type 2
- THS œstrogènes seuls sans progestatifs
- Tamoxifène (traitement cancer sein)
- Nulliparité

Examen général:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- TA: [mmHg], Pouls: [bpm]
- Température: [°C]
- Pâleur conjonctivale: [oui/non]
- État hémodynamique: [stable/instable si hémorragie]

Examen gynécologique:
- Inspection vulve:
  * Lésions: [condylomes, ulcérations]
  * Saignement extériorisé: [oui/non]
- Spéculum:
  * Origine saignement: [endocol / exocol / vagin / utérus]
  * Col: [aspect normal / érosion / polype / lésion suspecte / bourgeonnante]
  * Leucorrhées: [absentes / présentes: aspect, odeur]
  * Test Schiller (coloration iode): [si lésion col visible]
- Toucher vaginal:
  * Utérus: [taille normale/augmentée, régulier/bosselé]
  * Masse: [oui/non, taille, localisation]
  * Douleur mobilisation col: [oui/non]
  * Annexes: [libres / masse palpable]
  * Cul-de-sac Douglas: [libre/empâté]
- Toucher rectal: [si nécessaire: masse, rectorragies]

Prélèvements:
- Test grossesse urinaire: [si doute grossesse]
- Frottis cervico-vaginal: [réalisé si > 3 ans ou lésion suspecte]
- Prélèvements bactériologiques: [si leucorrhées/suspicion infection]`,
      conclusion: `MÉTRORRAGIES (saignements hors règles).

Origine suspectée:
[Sélectionner selon contexte:]

1. ORIGINE GÉNITALE HAUTE (utérus):
- Grossesse: [GIU évolutive/FCS/GEU]
- Polype endomètre
- Hyperplasie endomètre
- Cancer endomètre (si post-ménopause, facteurs risque)
- Fibromes utérins (surtout sous-muqueux)
- Adénomyose
- Atrophie endomètre (post-ménopause, pilule microdosée)

2. ORIGINE COL:
- Ectropion (bénin, fréquent jeune femme)
- Polype endocol
- Cervicite (infection, IST)
- Dysplasie cervicale (CIN)
- Cancer col (stade avancé)

3. ORIGINE VAGINALE:
- Vaginite atrophique (ménopause)
- Traumatisme (rapport)
- Infection (mycose, vaginose, trichomonas)

4. ORIGINE IATROGÈNE:
- Contraception hormonale (spotting sous pilule/implant/DIU)
- Oubli pilule
- DIU (saignements irréguliers 1ers mois)
- THS déséquilibré

5. ORIGINE FONCTIONNELLE:
- Anovulation (SOPK, péri-ménopause)
- Spotting ovulatoire (milieu cycle, bénin)
- Dysfonction thyroïdienne

6. ORIGINE HÉMATOLOGIQUE:
- Troubles coagulation (Willebrand, thrombopénie)

Gravité:
- Métrorragies [minimes/modérées/abondantes]
- Retentissement: [aucun / anémie / instabilité hémodynamique]
- Caractère urgent: [non / oui si hémorragie ou post-ménopause]

EXAMENS PRESCRITS:

Systématique:
- β-HCG plasmatique (éliminer grossesse si femme âge procréer)
- NFS (recherche anémie)
- Échographie pelvienne endovaginale:
  * Épaisseur endomètre (normal < 5mm post-ménopause, < 12mm pré-ménopause)
  * Recherche polype, fibrome, masse
  * Ovaires (masses, kystes)

Selon contexte:
- TSH (dysthyroïdie)
- Bilan hémostase si suspicion trouble coagulation (TP, TCA, plaquettes, Willebrand)
- Hystéroscopie diagnostique si:
  * Polype ou épaississement endomètre échographie
  * Métrorragies post-ménopausiques
  * Échec traitement médical
  → Visualisation cavité + biopsie endomètre
- Frottis cervical si non fait depuis > 3 ans
- Colposcopie si frottis anormal ou lésion col
- Prélèvements bactério (chlamydia, gonocoque) si suspicion IST

[Si métrorragies post-ménopausiques:]
→ URGENT: éliminer cancer endomètre
- Échographie endovaginale
- Hystéroscopie + biopsie endomètre SYSTÉMATIQUE

TRAITEMENT:

[Si grossesse diagnostiquée:]
→ Orientation selon localisation/viabilité (cf. protocoles grossesse)

[Si origine infectieuse:]
- Antibiothérapie selon germe:
  * Chlamydia: doxycycline 100mg x2/j 7j
  * Vaginose: métronidazole
  * Mycose: ovule antifongique
- Traitement partenaire si IST

[Si origine iatrogène (contraception):]
- Spotting sous pilule:
  * Rassurer (fréquent 3 premiers mois)
  * Vérifier observance (oublis favorisent spotting)
  * Si persistance > 3 mois: changer pilule (augmenter dose œstrogènes)
- DIU hormonal: spotting normal 3-6 premiers mois (régresse)
- Oubli pilule: rattrapage + préservatif 7 jours

[Si polype endomètre/endocol:]
- Polypectomie hystéroscopique (ambulatoire)
- Analyse anapath systématique

[Si fibrome symptomatique:]
- Traitement médical: acide tranexamique (Exacyl®), DIU lévonorgestrel
- Traitement chirurgical si échec: myomectomie, embolisation, hystérectomie

[Si hyperplasie endomètre:]
- Traitement progestatif: progestatifs 10-14j/cycle ou continu
- Hystéroscopie + biopsie contrôle
- Si hyperplasie atypique → orientation chirurgien (risque cancer)

[Si cancer diagnostiqué:]
→ Orientation urgente oncologie gynécologique

[Si saignements fonctionnels (anovulation):]
- Traitement hormonal:
  * Pilule œstroprogestative
  * Ou progestatifs J16-J25 du cycle (rétablir cycles)
- Acide tranexamique si hémorragie (Exacyl®)

TRAITEMENT SYMPTOMATIQUE hémorragie aiguë:
- Repos
- Acide tranexamique (Exacyl®) 1g x3-4/j
- Œstrogènes fortes doses (Provames® 2mg x3/j) puis relais progestatifs
- Supplémentation martiale si anémie
- Si échec: curetage hémostatique en urgence

SURVEILLANCE:
- Consultation contrôle après résultats examens: [date]
- Efficacité traitement: arrêt saignements sous 48-72h
- NFS contrôle si anémie

Consignes:
- Consultation urgence si hémorragie (> 1 protection/h), malaise, douleurs intenses
- Pas de rapports sexuels jusqu'à arrêt saignements
- Préservatifs si contraception orale perturbée

[Si métrorragies post-ménopausiques:]
→ Prise en charge URGENTE
→ Hystéroscopie programmée: [date]

Patiente informée.
Ordonnance et documents remis.
RDV: [date].`
    }
  },

  {
    id: 'gyneco-menorragies',
    name: 'Ménorragies (règles abondantes)',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Règles abondantes (ménorragies)',
      examen_clinique: `Interrogatoire:
- Âge: [ans]
- Cycles: [réguliers/irréguliers, durée]

Caractéristiques ménorragies:
- Depuis quand: [début brutal / progressif depuis [durée]]
- Durée règles: [jours, normal 3-7j]
- Abondance:
  * Nombre protections/jour: [>6 = abondant]
  * Type: [serviettes/tampons, capacité]
  * Débordements, accidents: [oui/non]
  * Caillots: [oui/non, taille]
  * Protection nocturne: [nécessaire/non]
- Évolution dans le temps: [stable/aggravation progressive]
- Score Higham (évaluation quantitative): [> 100 = ménorragies]

Retentissement:
- Anémie symptomatique:
  * Fatigue intense: [oui/non]
  * Pâleur: [oui/non]
  * Essoufflement effort: [oui/non]
  * Vertiges, malaises: [oui/non]
  * Palpitations: [oui/non]
- Impact qualité de vie:
  * Limitation activités: [sport, travail, sorties]
  * Absentéisme: [jours/mois]
  * Vie sociale perturbée: [isolement pendant règles]
  * Anxiété anticipatoire: [peur débordements]
- Impact psychologique: [majeur/modéré/léger]

Douleurs associées:
- Dysménorrhée (douleurs règles): [oui/non, EVA /10]
- Crampes pelviennes: [oui/non]

Symptômes associés:
- Métrorragies (saignements hors règles): [oui/non]
- Spotting inter-menstruel: [oui/non]
- Dyspareunie: [oui/non]
- Pesanteur pelvienne: [oui/non]

Contraception:
- Actuelle: [aucune/pilule/DIU cuivre/DIU hormonal/implant/autre]
- DIU cuivre: [majoré ménorragies chez 30%]
- Changement récent contraception: [oui/non]

Antécédents gynéco:
- Gestité: [G], Parité: [P]
- Fibromes utérins: [connus/suspectés]
- Polypes endomètre/endocol: [antécédent]
- Endométriose: [diagnostiquée/suspectée]
- Adénomyose: [diagnostiquée/suspectée]
- Hystérectomie familiale: [mère/sœurs pour ménorragies]

Antécédents médicaux:
- Troubles coagulation:
  * Maladie Willebrand: [oui/non/recherchée?]
  * Thrombopénie: [oui/non]
  * Autres: [déficit facteurs coagulation]
- Ménorragies depuis ménarche: [évoque trouble coagulation]
- Saignements anormaux autres: [épistaxis, ecchymoses faciles, gingivorragies]
- Dysthyroïdie: [hypothyroïdie favorise ménorragies]
- Hépatopathie: [cirrhose, insuffisance hépatique]
- Insuffisance rénale chronique
- Traitements: [anticoagulants, antiagrégants, AINS au long cours]

Désir de grossesse:
- Futur: [oui/non/indécis]
- Conservation fertilité: [important/non]

Examen général:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- TA: [mmHg], Pouls: [bpm]
- Pâleur:
  * Conjonctivale: [oui/non]
  * Cutanéo-muqueuse: [oui/non]
- Ecchymoses spontanées: [oui/non]
- Pétéchies: [oui/non]
- Signes dysthyroïdie: [goitre, tachycardie, tremblement]

Examen gynécologique:
- Spéculum:
  * Col: [aspect normal/ectropion/polype/autre]
  * Caillots sang: [présents/absents]
- Toucher vaginal:
  * Utérus:
    - Taille: [normale/augmentée: équivalent [SA] grossesse]
    - Forme: [régulier/bosselé = fibromes/globuleux = adénomyose]
    - Mobilité: [conservée/limitée]
    - Sensibilité: [oui/non]
  * Annexes: [libres/masse ovarienne]`,
      conclusion: `MÉNORRAGIES (règles abondantes).

Étiologie suspectée:
[Sélectionner cause probable:]

1. LÉSIONS ORGANIQUES UTÉRINES (70%):
- FIBROMES (léiomyomes):
  * Surtout sous-muqueux (cavité utérine)
  * Utérus augmenté, bosselé
- ADÉNOMYOSE:
  * Utérus globuleux, augmenté, sensible
  * Femme > 40 ans, multipare
- POLYPES ENDOMÈTRE:
  * Bénins mais symptomatiques
- HYPERPLASIE ENDOMÈTRE:
  * Facteurs risque: obésité, SOPK, THS déséquilibré
  * Risque évolution cancer

2. ORIGINE IATROGÈNE:
- DIU cuivre (cause fréquente):
  * Majoration flux 30-50%
  * Réaction inflammatoire locale
- Anticoagulants/Antiagrégants

3. TROUBLES COAGULATION (10-20%):
- Maladie Willebrand (la plus fréquente):
  * Ménorragies depuis adolescence
  * Saignements autres sites (nez, gencives)
- Thrombopénie
- Déficits facteurs coagulation

4. TROUBLES ENDOCRINIENS:
- Dysthyroïdie (hypothyroïdie)
- Hyperprolactinémie
- Anovulation (SOPK, péri-ménopause)

5. MÉNORRAGIES FONCTIONNELLES (idiopathiques):
- Aucune cause retrouvée (20%)
- Diagnostic d'élimination

Retentissement:
- Anémie: [suspectée/confirmée]
- Impact qualité vie: [majeur/modéré]

EXAMENS PRESCRITS:

Bilan sanguin systématique:
- NFS plaquettes:
  * Hb (anémie si < 12 g/dL)
  * VGM (microcytaire si carence fer)
  * Plaquettes (thrombopénie si < 150 G/L)
- Ferritine, fer sérique (bilan martial)
- TSH (dysthyroïdie)

Imagerie systématique:
- Échographie pelvienne endovaginale:
  * Épaisseur endomètre
  * Polypes (image hyperéchogène)
  * Fibromes (localisation, taille, nombre)
  * Adénomyose (myomètre hétérogène)
  * Ovaires

Si suspicion trouble coagulation:
- TP, TCA
- Dosage facteur Willebrand
- Facteurs VIII, IX
- Consultation hématologie

Examens 2ème intention (selon résultats):
- Hystéroscopie diagnostique si:
  * Polype ou épaississement endomètre
  * Échec traitement médical
  * Suspicion hyperplasie/cancer
  → Visualisation directe cavité + biopsie
- IRM pelvienne si cartographie fibromes nécessaire (avant chirurgie)

TRAITEMENT:

1. TRAITEMENT MÉDICAL (1ère intention):

[Si pas désir grossesse:]

A. DIU lévonorgestrel (Mirena®) - TRAITEMENT DE CHOIX:
- Réduit flux menstruel 90%
- Peut induire aménorrhée (50% à 1 an)
- Efficacité 5 ans
- Effets secondaires: spotting 3-6 premiers mois

B. Antifibrinolytiques:
- Acide tranexamique (Exacyl®, Spotof®):
  * 1g x3-4/j pendant règles (max 4-5j)
  * Réduit flux 50%
  * Contre-indications: ATCD thrombose, hématurie
  * Efficace même si DIU cuivre

C. AINS:
- Ibuprofène 400mg x3/j pendant règles
- Réduit flux 30% + effet antalgique
- Contre-indications: ulcère, insuffisance rénale

D. Contraception hormonale:
- Pilule œstroprogestative:
  * En continu (sans arrêt) = aménorrhée
  * Ou classique 21j/7j
- Progestatifs seuls:
  * Désogestrel (Cérazette®)
  * Diénogest
- Contre-indications: thrombose, cancer hormonodépendant, tabac > 35 ans

E. Progestatifs cycliques (si anovulation):
- Progestatifs J16-J25 cycle (régularise)

2. SUPPLÉMENTATION MARTIALE (si anémie):
- Fer per os: Tardyferon®, Timoférol® 1-2 cp/j
- Durée: 3-6 mois (reconstituer réserves)
- Effets secondaires: constipation, nausées
- Contrôle NFS + ferritine après 3 mois

3. TRAITEMENTS SPÉCIFIQUES:

[Si fibromes:]
- Traitement médical: DIU Mirena®, acide tranexamique
- Si échec ou fibromes volumineux:
  * Embolisation artères utérines (radiologie interventionnelle)
  * Myomectomie (résection fibromes, conservation utérus)
  * Hystérectomie (si pas désir grossesse, échec autres traitements)

[Si polypes:]
- Polypectomie hystéroscopique (ambulatoire)
- Curatif + analyse anapath

[Si adénomyose:]
- DIU Mirena® (très efficace)
- Pilule en continu
- Si échec: hystérectomie

[Si DIU cuivre responsable:]
- Proposition retrait + autre contraception
- Ou essai acide tranexamique + AINS
- Ou remplacement par DIU hormonal

[Si trouble coagulation:]
- Prise en charge hématologie
- Desmopressine (Willebrand)
- Traitement hormonal associé

4. TRAITEMENT CHIRURGICAL (si échec médical):

[Si pas désir grossesse:]
- Ablation endomètre (endométrectomie):
  * Destruction endomètre par électrorésection, radiofréquence, cryothérapie
  * Ambulatoire
  * Aménorrhée 40%, réduction flux 90%
  * Irréversible (stérilisant)
- Hystérectomie (totale ou subtotale):
  * Voie vaginale, cœlioscopie ou laparotomie
  * Traitement définitif
  * Conservation ovaires si < 50 ans
  * Indications: échec traitements conservateurs, pathologie associée

PRISE EN CHARGE ANÉMIE:
- Fer per os systématique
- Si anémie sévère (Hb < 8 g/dL):
  * Perfusion fer IV (Ferinject®, Vénofer®)
  * Ou transfusion sanguine si Hb < 7 g/dL

SURVEILLANCE:
- Consultation contrôle 3 mois:
  * Efficacité traitement (réduction flux, calendrier menstruel)
  * Tolérance
  * Contrôle NFS + ferritine
- Adaptation thérapeutique si échec

Orientation chirurgien gynécologue si:
- Échec traitement médical bien conduit (3-6 mois)
- Fibromes symptomatiques volumineux
- Anémie sévère récidivante
- Altération majeure qualité vie
- Souhait traitement radical

CONSEILS:
- Tenir calendrier menstruel (durée, abondance)
- Alimentation riche fer (viande rouge, légumes verts, lentilles)
- Vitamine C (favorise absorption fer)

Patiente informée.
Plan thérapeutique expliqué.
Ordonnance remise.
RDV contrôle: [date, 3 mois].`
    }
  },

  {
    id: 'gyneco-prolapsus',
    name: 'Prolapsus génital (descente organes)',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Prolapsus génital (descente organes pelviens)',
      examen_clinique: `Interrogatoire:
- Âge: [ans]
- Ménopause: [oui depuis [ans] / non]

Symptômes (peuvent être absents si prolapsus léger):
- Sensation "boule vaginale":
  * Permanente / en fin journée / lors efforts
  * Gêne: [majeure/modérée/légère]
- Sensation pesanteur pelvienne:
  * Aggravée: [station debout prolongée, port charges, fin journée]
  * Soulagée: [position allongée]
- Extériorisation tissus:
  * Visible / palpable au toucher
  * Sortie vulve: [oui lors efforts / non]
- Troubles urinaires:
  * Incontinence urinaire effort (toux, éternuement, rire): [oui/non]
  * Dysurie (difficulté uriner): [jet faible, poussée abdominale nécessaire]
  * Résidu post-mictionnel (sensation vidange incomplète): [oui/non]
  * Nécessité réintégrer prolapsus pour uriner: [oui/non]
  * Infections urinaires récidivantes: [nombre/an]
- Troubles ano-rectaux:
  * Constipation: [chronique, récente]
  * Difficultés défécation: [poussée excessive, fragmentation selles]
  * Incontinence anale: [gaz / selles liquides / solides]
  * Nécessité aide manuelle (pression vaginale) pour déféquer: [oui/non]
- Troubles sexuels:
  * Dyspareunie (douleurs rapports): [oui/non]
  * Sécheresse vaginale: [oui/non, post-ménopausique]
  * Gêne lors rapports: [oui/non]
  * Arrêt activité sexuelle: [oui/non, raison]

Retentissement qualité vie:
- Impact activités quotidiennes: [majeur/modéré/léger]
- Limitation activité physique: [sport impossible/limité]
- Restriction vie sociale: [oui/non]
- Impact psychologique: [anxiété, dépression, altération image corporelle]

Antécédents obstétricaux (facteurs risque majeurs):
- Gestité: [G], Parité: [P]
- Accouchements voie basse: [nombre]
  * Accouchements difficiles: [forceps, ventouse, déchirures périnéales]
  * Poids naissance: [macrosomes > 4kg]
  * Durée expulsion: [> 2h]
- Épisiotomie: [oui/non, nombre]
- Déchirures périnéales:
  * Grade: [1er/2e/3e/4e degré]
  * Réparation: [primaire/secondaire/non]
- Césariennes: [nombre] → protecteur
- Rééducation périnéale post-natale: [faite/non faite]

Antécédents gynéco:
- Chirurgie pelvienne:
  * Hystérectomie: [voie, date] → facteur risque
  * Colposuspension (incontinence)
  * Chirurgie prolapsus antérieure: [récidive]
- Ménopause: [âge, THS oui/non]
- Frottis cervical: [date dernier]

Facteurs de risque:
- Âge avancé
- Multiparité (≥ 3 accouchements voie basse)
- Accouchements traumatiques
- Ménopause (carence œstrogènes → atrophie tissus)
- Obésité: IMC [calcul]
- Efforts répétés: [port charges lourdes, toux chronique, constipation]
- Tabagisme: [oui/non, [PA]]
- Profession: [station debout, port charges]
- Facteurs génétiques: [mère/sœurs avec prolapsus]
- Troubles tissu conjonctif: [hyperlaxité, Ehlers-Danlos]

Antécédents médicaux:
- Obésité: IMC [calcul]
- BPCO (toux chronique)
- Constipation chronique
- Pathologies neurologiques: [sclérose plaques, Parkinson]

Examen général:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- TA: [mmHg]
- Toux: [oui/non]

Examen gynécologique:

1. Inspection vulvaire (patiente allongée puis debout/en poussée):
- Cicatrices périnéales: [épisiotomie, déchirure]
- Béance vulvaire: [oui/non]
- Extériorisation prolapsus au repos: [oui/non]
- Extériorisation lors poussée: [oui/non, stade]
- Aspect muqueuse: [rosée/atrophique blanchâtre post-ménopause]
- Ulcérations: [oui/non, si frottement prolapsus]

2. Examen au spéculum (valve):
- Spéculum retiré progressivement pour voir descente parois
- Patiente en poussée (simuler efforts)

Compartiments:
A. PROLAPSUS ANTÉRIEUR (cystocèle = vessie):
- Descente paroi vaginale antérieure
- Classification POP-Q stade:
  * Stade 0: aucun prolapsus
  * Stade 1: descente ne dépasse pas hymen (-1cm)
  * Stade 2: descente au niveau hymen (0cm)
  * Stade 3: descente au-delà hymen (+1 à +3cm)
  * Stade 4: éversion complète vagin (> +3cm)
- Stade: [0/1/2/3/4]

B. PROLAPSUS MOYEN (hystérocèle = utérus / colpocèle = voûte si hystérectomie):
- Descente col utérin
- Stade: [0/1/2/3/4]
- [Si hystérectomie: prolapsus voûte vaginale]

C. PROLAPSUS POSTÉRIEUR (rectocèle = rectum, élytrocèle = cul-de-sac Douglas):
- Descente paroi vaginale postérieure
- Stade: [0/1/2/3/4]

Prolapsus total = association plusieurs compartiments

3. Toucher vaginal:
- Tonus périnéal: [testing musculaire 0-5]
  * 0: aucune contraction
  * 5: contraction forte
- Contraction volontaire: [oui/non, tenue [secondes]]
- Utérus: [taille, position, descente]
- Annexes: [palpables/non]

4. Toucher rectal (si rectocèle):
- Rectocèle palpable
- Tonus sphincter anal: [conservé/diminué]

5. Testing fonction urinaire:
- Test à la toux (patiente vessie pleine, jambes écartées):
  * Fuite urine: [oui/non] → incontinence urinaire effort
  * Réduction prolapsus (repositionnement manuel) modifie incontinence: [oui/non]`,
      conclusion: `PROLAPSUS GÉNITAL (descente organes pelviens).

Classification POP-Q:
- Compartiment ANTÉRIEUR (cystocèle): Stade [0/1/2/3/4]
- Compartiment MOYEN (hystérocèle/colpocèle): Stade [0/1/2/3/4]
- Compartiment POSTÉRIEUR (rectocèle): Stade [0/1/2/3/4]

Stade global (le plus avancé): [1/2/3/4]
[Stade 1-2: léger à modéré / Stade 3-4: sévère]

Symptomatologie:
- Gêne fonctionnelle: [majeure/modérée/minime/asymptomatique]
- Troubles urinaires: [oui/non: incontinence, dysurie, résidu]
- Troubles ano-rectaux: [oui/non: constipation, incontinence]
- Troubles sexuels: [oui/non: dyspareunie, arrêt rapports]

Retentissement qualité vie: [majeur/modéré/léger]

EXAMENS COMPLÉMENTAIRES PRESCRITS:

Systématique:
- ECBU (recherche infection urinaire)
- Échographie pelvienne sus-pubienne:
  * Résidu post-mictionnel (normal < 50 mL)
  * Utérus, ovaires, vessie

Selon contexte:
- Bilan urodynamique (BUD) si:
  * Incontinence urinaire associée
  * Troubles mictionnels complexes
  * Avant chirurgie (obligatoire)
  → Évalue fonction vésico-sphinctérienne

- Colpo-cystogramme (radiologie) si chirurgie envisagée:
  * Visualise prolapsus lors poussée
  * Mesure angles, descente

- IRM pelvi-périnéale dynamique (2e intention):
  * Cartographie précise prolapsus multi-étages
  * Élytrocèle (anse intestinale)

- Défécographie (si troubles ano-rectaux sévères):
  * Évalue rectocèle, entérocèle
  * Dyssynergie ano-rectale

TRAITEMENT:

Prise en charge CONSERVATRICE (1ère intention):

1. RÉÉDUCATION PÉRINÉALE (rééducation pelvi-périnéale RPP):
Indications: prolapsus stade 1-2, incontinence associée, prévention aggravation

Objectifs:
- Renforcement muscles plancher pelvien
- Prise conscience périnée
- Amélioration continence

Techniques:
- Kinésithérapie périnéale (10-20 séances)
- Exercices Kegel (contractions volontaires)
- Biofeedback
- Électrostimulation

Efficacité: amélioration 50-70% stades légers

2. PESSAIRE VAGINAL:
Indications:
- Prolapsus symptomatique sans désir chirurgie
- Contre-indication chirurgie (âge, comorbidités)
- Attente chirurgie
- Test pré-opératoire (prédire résultat chirurgie)

Types:
- Pessaire anneau (le plus utilisé)
- Pessaire cube
- Pessaire Gellhorn

Pose:
- Essai différentes tailles
- Patiente garde 15-30 min, teste confort/efficacité
- Apprentissage retrait/remise en place (si autonome)

Surveillance:
- Contrôle 48h puis 1 semaine puis tous les 3-6 mois
- Retrait/nettoyage régulier (tous les 3 mois si patiente non autonome)
- Œstrogènes locaux associés (prévient ulcérations)

Effets secondaires:
- Leucorrhées
- Ulcérations muqueuses (si pessaire inadapté ou oubli)
- Infection rare

Efficacité: 50-90% satisfaction à 1 an

3. TRAITEMENT HORMONAL LOCAL (si ménopause):
- Œstrogènes locaux:
  * Crème: Trophigil®, Colpotrophine® 1 application/j 3 semaines puis 2/semaine
  * Ovules: Trophigil® 1 ovule/semaine
- Améliore trophicité muqueuse (réduit atrophie, ulcérations)
- Obligatoire si pessaire chez femme ménopausée

4. MESURES HYGIÉNO-DIÉTÉTIQUES:
- Perte poids (si obésité): réduction pression abdominale
- Traitement constipation: fibres, hydratation, laxatifs doux
- Arrêt tabac (favorise toux, altère collagène)
- Éviter port charges lourdes
- Adapter activité physique (éviter sports impact: course, tennis)
- Activités conseillées: natation, vélo, yoga, Pilates

TRAITEMENT CHIRURGICAL (si échec conservateur ou prolapsus sévère):

Indications:
- Prolapsus stade 3-4 symptomatique
- Échec rééducation + pessaire
- Gêne fonctionnelle majeure
- Troubles urinaires/rectaux sévères
- Demande patiente (qualité vie altérée)

Bilan pré-opératoire obligatoire:
- Bilan urodynamique
- Consultation anesthésie
- Accord patiente éclairé (risques, bénéfices, récidive)

Techniques chirurgicales:

A. VOIE VAGINALE (la plus utilisée):

[Prolapsus antérieur - Cystocèle:]
- Colporraphie antérieure (réparation paroi)
- ± Renfort prothèse (mesh)
- ± Colposuspension (bandelette)

[Prolapsus moyen - Hystérocèle:]
- Hystérectomie vaginale (si utérus)
- Fixation voûte vaginale (promontofixation vaginale, sacrospinofixation)

[Prolapsus postérieur - Rectocèle:]
- Colporraphie postérieure
- Myorraphie des releveurs

B. VOIE ABDOMINALE (cœlioscopie ou laparotomie):
- Promontofixation (sacro-colpopexie):
  * Gold standard prolapsus voûte vaginale
  * Suspension vagin/utérus au promontoire sacré par prothèse
  * Efficacité > 90%

C. VOIE MIXTE (selon prolapsus multi-étages)

Complications chirurgie:
- Hémorragie, infection (< 5%)
- Rétention urinaire transitoire (10-20%)
- Dyspareunie (si rétrécissement vaginal)
- Érosion prothèse (5-10% si mesh)
- Récidive prolapsus (10-30% à 10 ans)

Suites post-opératoires:
- Hospitalisation 2-5 jours
- Repos 4-6 semaines (pas port charges, pas efforts)
- Arrêt travail 4-8 semaines
- Rapports sexuels: reprise après 6 semaines
- Surveillance long terme (récidives)

CHOIX THÉRAPEUTIQUE (adapté à la patiente):

[Si prolapsus stade 1-2, peu symptomatique:]
→ Rééducation périnéale (1ère intention)
→ Pessaire si échec ou souhait

[Si prolapsus stade 2-3 symptomatique, patiente âgée ou comorbidités:]
→ Pessaire vaginal ± œstrogènes locaux

[Si prolapsus stade 3-4, gêne majeure, patiente jeune/active, échec conservateur:]
→ Chirurgie (voie vaginale ou cœlioscopie)

[Si pas désir conservation utérus:]
→ Hystérectomie vaginale + cure prolapsus

[Si désir conservation utérus:]
→ Promontohystéropexie (suspension utérus par prothèse)

PRÉVENTION AGGRAVATION:
- Rééducation post-natale systématique
- Éviter efforts excessifs
- Traiter constipation chronique
- Maintenir poids santé
- Arrêt tabac
- THS ménopause (discuter)

SURVEILLANCE:
- Consultation contrôle 3 mois (efficacité traitement)
- Contrôle pessaire tous les 3-6 mois
- Suivi long terme (aggravation possible)

Patiente informée options thérapeutiques.
Décision partagée selon âge, symptômes, désirs.
Ordonnance remise.
RDV: [date].
[Si chirurgie envisagée: RDV chirurgien gynécologue: [date]]`
    }
  },

  {
    id: 'gyneco-incontinence-urinaire',
    name: 'Incontinence urinaire',
    type: 'gyneco',
    data: {
      type: 'gyneco',
      motif: 'Incontinence urinaire',
      examen_clinique: `Interrogatoire:
- Âge: [ans]
- Ménopause: [oui depuis [ans] / non]

TYPE D'INCONTINENCE (crucial pour diagnostic):

1. INCONTINENCE URINAIRE D'EFFORT (IUE):
- Fuites lors efforts physiques:
  * Toux, éternuement: [oui/non]
  * Rire: [oui/non]
  * Port charges, soulever objets: [oui/non]
  * Changement position (se lever): [oui/non]
  * Effort physique, sport: [oui/non]
  * Rapports sexuels: [oui/non]
- Quantité fuites: [gouttes / jet / importante]
- Pas de besoin urgent
- Pas de fuites nocturnes (allongée)

2. INCONTINENCE PAR URGENTURIE (IU):
- Besoin urgent, impérieux uriner:
  * Précède fuite: [délai < 1 min]
  * Ne peut se retenir: [oui/non]
- Fuites importantes
- Pollakiurie (mictions fréquentes): [> 8/jour]
- Nycturie (réveils nocturnes): [nombre/nuit]
- Déclencheurs: [bruit eau, clé porte, froid]

3. INCONTINENCE MIXTE:
- Association IUE + urgenturie
- Symptôme prédominant: [effort / urgence]

Caractéristiques précises:
- Début: [brutal / progressif depuis [durée]]
- Fréquence: [quotidienne / hebdomadaire / occasionnelle]
- Circonstances: [diurne / nocturne / les deux]
- Quantité: [gouttes/protection suffit / jet/plusieurs protections / abondante/couche]
- Nombre protections/jour: [chiffre]
- Type protections: [protège-slip / serviette / couche]

Retentissement qualité vie:
- Gêne: [majeure/modérée/légère]
- Limitation activités:
  * Sorties, voyages: [évitées/limitées]
  * Sport: [arrêté/limité]
  * Vie sociale: [isolement]
- Vie sexuelle: [altérée/arrêtée par peur fuites]
- Impact psychologique: [honte, dépression, anxiété]
- Impact professionnel: [oui/non]

Symptômes urinaires associés:
- Pollakiurie: [mictions > 8/jour]
- Nycturie: [nombre réveils/nuit]
- Dysurie (difficultés vider vessie):
  * Jet faible, haché: [oui/non]
  * Poussée abdominale nécessaire: [oui/non]
- Sensation vidange incomplète: [oui/non]
- Brûlures mictionnelles: [oui/non → infection]
- Hématurie (sang urines): [oui/non]

Apports hydriques:
- Quantité boissons/jour: [litres]
- Type: [eau, café, thé, alcool]
- Restriction volontaire: [oui/non → aggrave problème]

Antécédents obstétricaux (facteurs risque IUE):
- Gestité: [G], Parité: [P]
- Accouchements voie basse: [nombre]
  * Accouchements difficiles: [forceps, ventouse]
  * Déchirures périnéales: [oui/non, grade]
  * Poids naissance: [macrosomes > 4kg]
  * Incontinence apparue: [post-partum immédiat / secondaire]
- Épisiotomie: [oui/non, nombre]
- Rééducation périnéale post-natale: [faite/non faite]

Antécédents gynéco:
- Chirurgie pelvienne:
  * Hystérectomie: [voie, date]
  * Chirurgie prolapsus
  * Chirurgie incontinence antérieure: [bandelette, date, résultat]
- Prolapsus génital: [connu/suspecté]
- Atrophie vaginale (ménopause): [sécheresse, dyspareunie]

Antécédents urologiques:
- Infections urinaires: [fréquentes: nombre/an]
- Cystites récidivantes: [oui/non]
- Lithiase urinaire: [calculs]
- Chirurgie urologique: [cures incontinence, autres]

Antécédents médicaux (facteurs favorisants):
- Diabète: [oui/non, équilibré/non]
- Obésité: IMC [calcul]
- BPCO, toux chronique: [oui/non]
- Constipation chronique: [oui/non, efforts défécation]
- Pathologies neurologiques:
  * Sclérose en plaques: [oui/non]
  * Parkinson: [oui/non]
  * AVC séquellaire: [oui/non]
  * Neuropathie diabétique: [oui/non]
- Troubles cognitifs: [démence, Alzheimer]
- Insuffisance cardiaque (nycturie)

Traitements (peuvent aggraver):
- Diurétiques: [oui/non, heure prise]
- Psychotropes: [benzodiazépines, antidépresseurs]
- Alphabloquants: [pour HTA]
- Anticholinergiques: [autres indications]

Facteurs favorisants:
- Tabagisme: [oui/non, [PA]] → toux chronique
- Obésité: IMC [calcul] → pression abdominale
- Profession: [port charges, station debout]
- Activités sportives: [sports impact: course, tennis, trampoline]

Traitements essayés:
- Rééducation périnéale: [faite/non, résultat]
- Médicaments: [anticholinergiques, bêta-3-agonistes, efficacité]
- Protections: [nombre/jour, type]

Examen général:
- Poids: [kg], Taille: [cm], IMC: [calcul]
- TA: [mmHg]
- Examen abdominal:
  * Globe vésical (rétention): [palpable/non]
  * Cicatrices chirurgicales: [oui/non]
- État cognitif: [orienté/confus]

Examen gynécologique:

1. Inspection vulvaire:
- Atrophie vulvo-vaginale (ménopause): [oui/non]
- Cicatrices périnéales: [épisiotomie, déchirures]
- Prolapsus extériorisé: [oui/non]

2. Test à la toux (patiente vessie pleine, jambes écartées):
- Fuite urine lors toux: [oui/non]
  * Si OUI → IUE confirmée
  * Quantité: [gouttes/jet]
  * Temps apparition: [immédiate/retardée]

3. Examen au spéculum:
- Prolapsus: [cystocèle, hystérocèle, rectocèle]
- Atrophie muqueuse: [oui/non, score atrophie]
- Col utérin: [normal]

4. Toucher vaginal:
- Testing périnéal (contraction volontaire):
  * Cotation 0-5:
    - 0: aucune contraction
    - 1: contraction faible, non soutenue
    - 2: contraction faible, soutenue
    - 3: contraction modérée
    - 4: contraction forte
    - 5: contraction forte contre résistance
  * Score: [/5]
  * Tenue contraction: [secondes]
- Réflexe toux (contraction réflexe périnée lors toux): [présent/absent]
- Prolapsus: [oui/non, stade POP-Q]
- Bandelette sous-urétrale palpable: [oui/non, si chirurgie antérieure]

5. Toucher rectal (si besoin):
- Tonus sphincter anal: [normal/diminué]
- Fécalome: [oui/non]

6. Examen neurologique (si pathologie suspectée):
- Réflexes ostéo-tendineux membres inférieurs
- Sensibilité périnéale (territoires S2-S4)
- Réflexe bulbo-caverneux (contraction anale au pincement clitoris)`,
      conclusion: `INCONTINENCE URINAIRE.

Type diagnostiqué:
[Sélectionner:]
- INCONTINENCE URINAIRE D'EFFORT (IUE):
  * Fuites lors efforts, sans besoin urgent
  * Faiblesse sphincter urétral et/ou plancher pelvien
  * Test à la toux: positif

- INCONTINENCE PAR URGENTURIE (IU):
  * Besoin impérieux, irrépressible
  * Hyperactivité vésicale (détrusor instable)
  * ± Pollakiurie, nycturie

- INCONTINENCE MIXTE:
  * Association IUE + urgenturie
  * Type prédominant: [effort/urgence]

- INCONTINENCE PAR REGORGEMENT (rare femme):
  * Rétention chronique avec trop-plein
  * Dysurie majeure, globe vésical
  * Cause: obstacle urétral, hypocontractilité vésicale

Sévérité:
- Légère: fuites occasionnelles, < 2 protections/jour
- Modérée: fuites quotidiennes, 2-4 protections/jour
- Sévère: fuites permanentes, > 4 protections/jour, couche

Retentissement qualité vie: [majeur/modéré/léger]

Facteurs favorisants identifiés:
- Prolapsus génital: [oui/non, stade]
- Faiblesse périnéale: [testing [/5]]
- Atrophie post-ménopausique: [oui/non]
- Obésité: IMC [calcul]
- Séquelles obstétricales
- [Autres: diabète, BPCO, neurologique...]

EXAMENS COMPLÉMENTAIRES:

Systématique:
- Calendrier mictionnel (3 jours):
  * Noter: heure mictions, volume uriné (si possible), fuites, circonstances
  * Apports hydriques
  * Nombre protections
  → Patiente ramène à consultation suivante

- ECBU (éliminer infection urinaire)
  * Systématique si urgenturie
  * Si infection → traiter d'abord, réévaluer après

- Échographie pelvienne sus-pubienne + résidu post-mictionnel:
  * Résidu normal: < 50 mL
  * Si > 100 mL: rétention chronique

Examens 2ème intention (si échec traitement 1ère ligne ou bilan pré-chirurgical):

- Bilan urodynamique (BUD) - GOLD STANDARD:
  * Obligatoire avant chirurgie IUE
  * Mesure pressions vésicales, débit, résidu
  * Confirme type incontinence:
    - IUE: hypermobilité urétrale, insuffisance sphinctérienne
    - Urgenturie: hyperactivité détrusor
  * Contre-indications chirurgie: hypocontractilité vésicale

- Cystoscopie (si hématurie, douleurs, infections récidivantes):
  * Visualisation vessie, urètre
  * Recherche tumeur, calcul, cystite interstitielle

- IRM pelvi-périnéale (si anatomie complexe, prolapsus, chirurgie antérieure)

TRAITEMENT:

1. MESURES GÉNÉRALES (tous types):

- Éducation, réassurance:
  * Pathologie fréquente (30-40% femmes)
  * Traitements efficaces existent
  * Pas de fatalité avec l'âge

- Adaptation apports hydriques:
  * Boire 1,5 L/jour (ni trop ni trop peu)
  * Éviter restriction (concentre urines, irrite vessie)
  * Limiter boissons excitantes vésicales: café, thé, alcool, sodas

- Perte poids si obésité:
  * Réduction 5-10% améliore incontinence 50%

- Arrêt tabac (toux chronique)

- Traitement constipation (efforts défécation aggravent)

- Mictions programmées:
  * Uriner régulièrement (toutes les 2-3h) avant besoin urgent
  * Éviter "mictions préventives" trop fréquentes

2. TRAITEMENT INCONTINENCE URINAIRE D'EFFORT:

A. Rééducation périnéale (1ère intention - ESSENTIEL):

Indications: toutes IUE légères à modérées

Objectifs:
- Renforcement muscles plancher pelvien
- Amélioration tonus sphincter urétral
- Apprentissage contraction périnée réflexe lors effort

Techniques:
- Kinésithérapie périnéale (10-20 séances):
  * Exercices Kegel (contractions volontaires)
  * Biofeedback (visualisation contraction)
  * Électrostimulation
- Travail abdomino-pelvien (méthode Pilates, hypopressifs)

Efficacité: 60-70% amélioration/guérison IUE légère-modérée

Durée: 3-6 mois
Auto-entretien: exercices quotidiens à poursuivre

B. Œstrogènes locaux (si ménopause):
- Améliore trophicité urètre et vagin
- Crème Trophigil® ou Colpotrophine®
- Amélioration partielle IUE (pas curatif seul)

C. Dispositifs médicaux:
- Tampons vaginaux anti-fuites (Contrelle®)
- Cônes vaginaux (rééducation)

D. Chirurgie (si échec rééducation ou IUE sévère):

Indications:
- IUE modérée à sévère
- Échec rééducation bien conduite (6 mois)
- Gêne majeure
- Bilan urodynamique pré-opératoire obligatoire

Techniques:

1. Bandelettes sous-urétrales (TVT/TOT):
- Gold standard IUE
- Pose bandelette synthétique sous urètre moyen
- Ambulatoire, anesthésie locale ou générale
- Efficacité: 80-90% guérison
- Complications: rétention urinaire transitoire (5-10%), érosion (< 5%), douleurs

2. Injections péri-urétrales (agents comblants):
- Si insuffisance sphinctérienne intrinsèque
- Acide hyaluronique, macroplastique
- Efficacité moindre, réinjections nécessaires

3. Sphincter artificiel (cas exceptionnels):
- IUE sévère, échecs multiples

E. Neuromodulation sacrée:
- Stimulation nerfs sacrés
- Indications limitées IUE réfractaire

3. TRAITEMENT INCONTINENCE PAR URGENTURIE:

A. Rééducation vésicale (comportementale):
- Technique "stop pipi" (renforcement sphincter)
- Mictions programmées (allonger progressivement délais)
- Distraction lors urgences (contraction périnée, respiration)

B. Rééducation périnéale:
- Biofeedback
- Inhibition réflexe détrusor par contraction périnée

C. Traitements médicamenteux:

1. Anticholinergiques (antimuscariniques):
- 1ère ligne urgenturie

Molécules:
- Oxybutynine (Ditropan®, Driptane®): 5mg x2-3/j
- Solifénacine (Vesicare®): 5-10mg/j
- Trospium (Ceris®): 20mg x2/j
- Fésotérodine (Toviaz®): 4-8mg/j

Mécanisme: inhibent contractions vésicales involontaires

Effets secondaires:
- Sécheresse buccale (fréquent)
- Constipation
- Troubles accommodation visuelle
- Troubles cognitifs (sujets âgés)

Contre-indications:
- Glaucome angle fermé
- Rétention urinaire
- Démence (prudence)

Efficacité: 60-70% réduction urgenturies

2. Bêta-3-agonistes:
- Mirabégron (Betmiga®): 25-50mg/j
- Alternative si intolérance/CI anticholinergiques
- Moins effets secondaires
- Contre-indication: HTA non contrôlée

D. Toxine botulique (Botox®) intra-vésicale:
- Si échec médicaments oraux
- Injection cystoscopie (50-100 UI)
- Efficacité 6-12 mois (réinjections possibles)
- Effets secondaires: rétention urinaire (5-10%), infections

E. Neuromodulation sacrée (Interstim®):
- Électrode implantée nerfs sacrés S3
- Stimulation continue modifie activité vésicale
- Indications: urgenturie réfractaire, vessie hyperactive sévère
- Efficacité 70-80%

4. TRAITEMENT INCONTINENCE MIXTE:
- Traiter d'abord symptôme prédominant
- Souvent: rééducation + anticholinergiques
- Chirurgie si IUE prédominante (attention: peut démasquer/aggraver urgenturies)

5. PRISE EN CHARGE SYMPTOMATIQUE (tous types):
- Protections adaptées: protège-slip, serviettes, couches
- Crèmes barrière (protection peau)
- Produits hygiène adaptés

PRÉVENTION:
- Rééducation post-natale systématique
- Maintien activité physique adaptée (Pilates, natation)
- Éviter sports impact si fragilité (course, trampoline)
- Poids santé
- Traiter constipation chronique

SURVEILLANCE:
- Consultation contrôle 3 mois:
  * Calendrier mictionnel
  * Efficacité rééducation/médicaments
  * Tolérance traitements
  * Adaptation thérapeutique

- Suivi long terme si traitements chroniques

Orientation urologue/gynécologue si:
- Échec rééducation + médicaments
- IUE sévère (indication chirurgie)
- Hématurie
- Douleurs pelviennes
- Pathologie complexe (neurologique, chirurgie multiple)

SCHÉMA THÉRAPEUTIQUE RÉSUMÉ:

[IUE légère-modérée:]
→ Rééducation périnéale (3-6 mois) + mesures générales
→ Si échec: chirurgie (bandelette)

[IUE sévère d'emblée:]
→ Rééducation + bilan urodynamique → chirurgie

[Urgenturie:]
→ Rééducation vésicale + anticholinergiques
→ Si échec: bêta-3-agonistes → toxine botulique → neuromodulation

[Incontinence mixte:]
→ Rééducation + traiter symptôme prédominant

Patiente informée options thérapeutiques.
Calendrier mictionnel remis (à compléter 3 jours).
Ordonnance remise.
RDV contrôle: [date, 3 mois].
[Si chirurgie envisagée: RDV urologue/gynécologue: [date]]`
    }
  }
]

export function getTemplatesByType(type: string): ConsultationTemplate[] {
  return TEMPLATES.filter(t => t.type === type)
}

export function getTemplateById(id: string): ConsultationTemplate | undefined {
  return TEMPLATES.find(t => t.id === id)
}
