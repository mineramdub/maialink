export interface ConsultationTemplate {
  id: string
  name: string
  description: string
  type: string
  data: {
    duree?: number
    motif?: string
    examenClinique?: string
    conclusion?: string
  }
}

export const consultationTemplates: ConsultationTemplate[] = [
  // Consultations prénatales
  {
    id: 'prenatale_mensuelle',
    name: 'Consultation prénatale mensuelle',
    description: 'Suivi de grossesse standard avec mesures et auscultation',
    type: 'prenatale',
    data: {
      duree: 30,
      motif: 'Suivi de grossesse mensuel',
      examenClinique: `Examen général:
- État général: bon
- Poids: [à compléter] kg (prise de poids: [à calculer] kg)
- TA: [à compléter] / [à compléter] mmHg
- Protéinurie: négative

Examen obstétrical:
- Hauteur utérine: [à compléter] cm
- Présentation: [à compléter]
- BDC: [à compléter] bpm, régulier
- Mouvements actifs fœtaux: présents
- Tonus utérin: normal
- Col: fermé, long et postérieur

Membres inférieurs:
- Pas d'œdème
- Réflexes ostéotendineux: normaux`,
      conclusion: `Grossesse évolutive, suivi régulier.
Rendez-vous de suivi dans 4 semaines.
Prescrire: NFS, glycémie à jeun, albuminurie.`
    }
  },
  {
    id: 'prenatale_t1',
    name: 'Consultation T1 (11-14 SA)',
    description: 'Première consultation avec déclaration de grossesse',
    type: 'prenatale',
    data: {
      duree: 45,
      motif: 'Première consultation de grossesse T1',
      examenClinique: `Interrogatoire:
- DDR: [à compléter]
- Antécédents: [à compléter]
- Traitements en cours: [à compléter]
- Allergies: [à compléter]

Examen général:
- État général: bon
- Poids: [à compléter] kg
- Taille: [à compléter] cm
- IMC: [à calculer]
- TA: [à compléter] / [à compléter] mmHg

Examen obstétrical:
- Utérus augmenté de volume
- BDC: [à compléter] bpm
- Col: fermé

Examen des seins:
- Seins souples, pas de masse palpable`,
      conclusion: `Grossesse évolutive de [X] SA.
Déclaration de grossesse remise.
Ordonnance: échographie T1 (11-14 SA), bilan sanguin complet T1.
Supplémentation: acide folique 400µg/j, vitamine D.
Rendez-vous: consultation + échographie T2 (20-24 SA).`
    }
  },

  // Consultations post-natales
  {
    id: 'postnatale_precoce',
    name: 'Visite post-natale précoce (J8-J10)',
    description: 'Première visite après accouchement',
    type: 'postnatale',
    data: {
      duree: 30,
      motif: 'Visite post-natale précoce',
      examenClinique: `État général:
- Fatigue: [à évaluer]
- Sommeil: [à évaluer]
- Moral: [à évaluer]

Examen physique:
- TA: [à compléter] / [à compléter] mmHg
- Température: [à compléter]°C
- Seins: [à évaluer] (montée laiteuse, crevasses, engorgement)
- Involution utérine: [à évaluer]
- Lochies: [couleur et abondance]
- Périnée/Cicatrice: [à évaluer]

Allaitement:
- Type: [maternel/artificiel/mixte]
- Difficultés: [à noter]

Nouveau-né:
- Poids: [à compléter]
- Ictère: [oui/non]
- Comportement: [à noter]`,
      conclusion: `Suites de couches simples.
Conseils: repos, hydratation, alimentation équilibrée.
Consultation de contrôle à prévoir à 6-8 semaines.
Contraception à discuter lors de la consultation postnatale.`
    }
  },
  {
    id: 'postnatale_tardive',
    name: 'Consultation post-natale (6-8 semaines)',
    description: 'Consultation obligatoire 6-8 semaines après accouchement',
    type: 'postnatale',
    data: {
      duree: 45,
      motif: 'Consultation post-natale obligatoire',
      examenClinique: `État général:
- Moral: [à évaluer] (dépister baby blues/dépression post-partum)
- Fatigue: [à évaluer]
- Reprise activité: [à noter]

Examen physique:
- Poids: [à compléter] kg
- TA: [à compléter] / [à compléter] mmHg
- Seins: [à évaluer]
- Involution utérine: complète/incomplète
- Lochies: absentes/présentes
- Cicatrice périnéale/césarienne: [état]

Examen gynécologique:
- Col: [état]
- Utérus: [involution]
- Périnée: tonicité [à évaluer]

Testing périnéal: [score/5]

Contraception:
- Souhait: [à discuter]
- Prescription: [à noter]`,
      conclusion: `Suites de couches [simples/compliquées].
Rééducation périnéale: [nécessaire/non nécessaire] - ordonnance remise.
Contraception: [méthode choisie].
Frottis cervico-vaginal si > 3 ans.`
    }
  },

  // Préparation à la naissance
  {
    id: 'preparation_accouchement',
    name: 'Séance de préparation à l\'accouchement',
    description: 'Cours de préparation individuel ou en groupe',
    type: 'preparation',
    data: {
      duree: 60,
      motif: 'Séance de préparation à la naissance',
      examenClinique: `Thème de la séance: [à préciser]

Sujets abordés:
- [Anatomie/physiologie de la grossesse]
- [Travail et accouchement]
- [Respiration et relaxation]
- [Positions d'accouchement]
- [Gestion de la douleur]
- [Allaitement]
- [Soins du nouveau-né]
- [Retour à domicile]

Exercices pratiques:
- Respiration abdominale
- Respiration soufflante
- Positions antalgiques
- Poussée

Questions/préoccupations:
[à noter]`,
      conclusion: `Séance [numéro X/8] de préparation à la naissance.
Patiente active et réceptive.
Prochaine séance: [thème] dans 1 semaine.`
    }
  },

  // Consultations gynécologiques
  {
    id: 'gyneco_controle',
    name: 'Consultation gynécologique de contrôle',
    description: 'Suivi gynécologique annuel',
    type: 'gyneco',
    data: {
      duree: 30,
      motif: 'Consultation gynécologique de contrôle',
      examenClinique: `Interrogatoire:
- Date des dernières règles: [à compléter]
- Cycles: [réguliers/irréguliers]
- Dysménorrhée: [oui/non]
- Contraception: [type]
- Dernier frottis: [date]

Examen des seins:
- Inspection: symétrique, pas de rétraction
- Palpation: seins souples, pas de masse palpable
- Aisselles: pas d'adénopathie

Examen gynécologique:
- Vulve: normale
- Spéculum: col [aspect], leucorrhées [aspect]
- Toucher vaginal: utérus AVF mobile indolore, annexes libres
- Frottis cervico-vaginal: [réalisé/non réalisé]`,
      conclusion: `Examen gynécologique normal.
[Si frottis réalisé: Résultats dans 3 semaines]
Contraception adaptée.
Prochain contrôle dans 1 an.`
    }
  },
  {
    id: 'gyneco_contraception',
    name: 'Consultation contraception',
    description: 'Conseil et prescription contraceptive',
    type: 'gyneco',
    data: {
      duree: 30,
      motif: 'Consultation pour contraception',
      examenClinique: `Interrogatoire:
- Antécédents personnels: [à compléter]
- Antécédents familiaux: [à compléter]
- Contraception antérieure: [à noter]
- Souhait actuel: [à discuter]
- Contre-indications: [à vérifier]

Examen physique:
- Poids: [à compléter] kg
- Taille: [à compléter] cm
- IMC: [à calculer]
- TA: [à compléter] / [à compléter] mmHg

Discussion:
- Méthodes disponibles présentées
- Avantages/inconvénients
- Choix de la patiente: [méthode]`,
      conclusion: `Prescription: [contraceptif choisi]
Surveillance: bilan biologique à [X] mois si nécessaire
Consultation de contrôle à [X] mois
Information sur l'utilisation remise`
    }
  },
]

export function getTemplatesByType(type: string): ConsultationTemplate[] {
  return consultationTemplates.filter(t => t.type === type)
}

export function getTemplateById(id: string): ConsultationTemplate | undefined {
  return consultationTemplates.find(t => t.id === id)
}
