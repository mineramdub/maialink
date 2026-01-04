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
  }
]

export function getTemplatesByType(type: string): ConsultationTemplate[] {
  return TEMPLATES.filter(t => t.type === type)
}

export function getTemplateById(id: string): ConsultationTemplate | undefined {
  return TEMPLATES.find(t => t.id === id)
}
