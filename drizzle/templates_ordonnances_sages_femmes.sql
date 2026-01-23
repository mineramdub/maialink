-- Templates d'ordonnances pour sages-femmes
-- Tous les médicaments et protocoles qu'une sage-femme peut prescrire

-- ========================================
-- CONTRACEPTION
-- ========================================

INSERT INTO ordonnance_templates (nom, categorie, type, priorite, description, contenu, is_system_template) VALUES

-- Pilules contraceptives
('Pilule Œstroprogestative - Classique', 'contraception', 'medicament', 'recommande', 'Pilule combinée œstroprogestative',
'LEELOO Gé (Lévonorgestrel 0,1mg + Ethinylestradiol 0,02mg)
1 comprimé par jour à heure fixe pendant 21 jours, arrêt de 7 jours puis nouvelle plaquette
Durée : 3 mois renouvelable

INFORMATIONS IMPORTANTES :
- Débuter le 1er jour des règles
- En cas d''oubli < 12h : prendre immédiatement
- En cas d''oubli > 12h : contraception additionnelle pendant 7 jours
- Consulter en urgence si : douleur thoracique, essoufflement, maux de tête violents, troubles visuels
- Contre-indications : tabac après 35 ans, antécédent de phlébite, migraine avec aura',
true),

('Pilule Microprogestative', 'contraception', 'medicament', 'recommande', 'Pilule progestative seule (allaitement, contre-indication œstrogènes)',
'CERAZETTE (Désogestrel 75 µg)
1 comprimé par jour à heure fixe, en continu sans interruption
Durée : 3 mois renouvelable

INFORMATIONS :
- Pas d''interruption entre les plaquettes
- Fenêtre d''oubli : 12 heures
- Peut entraîner des saignements irréguliers
- Compatible avec l''allaitement',
true),

-- DIU
('Pose DIU Cuivre', 'contraception', 'autre', 'recommande', 'Prescription pour pose de DIU au cuivre',
'DIU CUIVRE (TT380, NT380 ou UT380 selon taille utérus)

BILAN PRÉ-POSE :
- Prélèvement vaginal (Chlamydia, gonocoque) si facteurs de risque
- Test de grossesse si doute
- Échographie pelvienne si anomalie au TV

PRÉPARATION :
- SPASFON 2 comprimés 1h avant la pose
- OU IBUPROFÈNE 400mg 1h avant

RDV de pose à prévoir
Contrôle échographique 1 mois après pose',
true),

-- Contraception d''urgence
('Contraception d''Urgence - EllaOne', 'contraception', 'medicament', 'urgent', 'Contraception d''urgence ulipristal (efficace 5 jours)',
'ELLAONE (Ulipristal acétate 30mg)
1 comprimé en prise unique le plus tôt possible (efficace jusqu''à 5 jours après le rapport)

INFORMATIONS :
- Plus efficace que Lévonorgestrel au-delà de 72h
- Peut décaler les règles
- Faire un test de grossesse si pas de règles sous 3 semaines
- Reprendre contraception habituelle dès le lendemain',
true),

('Contraception d''Urgence - Levonorgestrel', 'contraception', 'medicament', 'urgent', 'Contraception d''urgence classique (72h)',
'NORLEVO (Lévonorgestrel 1,5mg)
1 comprimé en prise unique le plus tôt possible (efficace jusqu''à 72h après le rapport)

INFORMATIONS :
- Efficacité maximale si prise dans les 12 premières heures
- Peut provoquer nausées, décalage des règles
- Test de grossesse si pas de règles sous 3 semaines
- Ne protège pas des rapports ultérieurs : reprendre contraception',
true),

-- ========================================
-- INFECTIONS GYNÉCOLOGIQUES
-- ========================================

('Mycose Vaginale', 'gynecologie', 'medicament', 'recommande', 'Traitement mycose vaginale à Candida',
'GYNOPÉVARYL LP 150mg ovule
1 ovule en intravaginal, dose unique le soir

OU

LOMEXIN 600mg capsule vaginale
1 capsule en intravaginal, dose unique le soir

+

DAKTARIN 2% crème
Application locale 2 fois par jour pendant 7 jours sur la vulve

CONSEILS :
- Toilette intime avec savon doux pH neutre
- Sous-vêtements en coton
- Éviter protège-slips et vêtements serrés
- Traiter le partenaire si symptômes (crème sur le gland)',
true),

('Vaginose Bactérienne', 'gynecologie', 'medicament', 'recommande', 'Traitement vaginose bactérienne',
'FLAGYL 500mg (Métronidazole)
1 comprimé 2 fois par jour pendant 7 jours

OU

FLAGYL ovule 500mg
1 ovule par jour le soir pendant 7 jours

INFORMATIONS :
- Effet antabuse : ÉVITER ALCOOL pendant traitement et 48h après
- Rapports sexuels protégés pendant traitement
- Partenaire : pas de traitement systématique',
true),

('IST - Chlamydia', 'gynecologie', 'medicament', 'urgent', 'Traitement infection à Chlamydia trachomatis',
'AZITHROMYCINE 250mg
4 comprimés (1g) en prise unique

OU

DOXYCYCLINE 100mg
1 comprimé 2 fois par jour pendant 7 jours

PRESCRIPTIONS ASSOCIÉES :
- Prélèvement vaginal de contrôle dans 3-4 semaines
- Sérologies VIH, VHB, VHC, Syphilis

IMPÉRATIF :
⚠️ TRAITEMENT DU/DES PARTENAIRE(S) OBLIGATOIRE
⚠️ ABSTINENCE SEXUELLE ou préservatif pendant 7 jours après traitement
⚠️ Si douleurs pelviennes intenses : CONSULTER EN URGENCE (risque salpingite)',
true),

('Infection Urinaire - Cystite', 'gynecologie', 'medicament', 'recommande', 'Traitement cystite simple chez la femme',
'MONURIL 3g (Fosfomycine-trométamol)
1 sachet en prise unique le soir, vessie vide

OU (si récidive récente)

OFLOXACINE 200mg
1 comprimé 2 fois par jour pendant 3 jours

CONSEILS :
- Boire 1,5 à 2L d''eau par jour
- Uriner après les rapports sexuels
- Ne pas se retenir d''uriner
- Essuyer d''avant en arrière
- ECBU si symptômes persistent après 48h',
true),

-- ========================================
-- GROSSESSE
-- ========================================

('Nausées de Grossesse', 'grossesse', 'medicament', 'recommande', 'Traitement nausées et vomissements gravidiques',
'VOGALÈNE 5mg (Métopimazine)
1 comprimé 3 fois par jour 15 minutes avant les repas
Durée : 7 jours, renouvelable selon évolution

OU

MOTILIUM 10mg (Dompéridone)
1 comprimé avant les 3 repas
Maximum 7 jours

+

VITAMINE B6 250mg
1 comprimé par jour

CONSEILS :
- Fractionner les repas (5-6 petites prises)
- Éviter odeurs fortes, graisses
- Gingembre (tisane, biscuits)
- Consultation si vomissements importants (risque déshydratation)',
true),

('Constipation Grossesse', 'grossesse', 'medicament', 'recommande', 'Traitement constipation pendant grossesse',
'FORLAX 10g sachets (Macrogol)
1 à 2 sachets par jour dans un grand verre d''eau
Adapter selon transit

OU

LACTULOSE sirop
10 à 20ml par jour

CONSEILS HYGIÉNO-DIÉTÉTIQUES :
- Boire 1,5L d''eau par jour minimum
- Fibres : fruits, légumes, céréales complètes
- Pruneaux, kiwis
- Activité physique régulière (marche)',
true),

('Reflux Gastrique Grossesse', 'grossesse', 'medicament', 'recommande', 'Traitement pyrosis/RGO pendant grossesse',
'GAVISCON suspension buvable
1 sachet après chaque repas et au coucher
Sans ordonnance mais remboursable si prescrit

+

Si insuffisant :

INEXIUM 20mg (Ésoméprazole)
1 comprimé le matin à jeun
Durée : 2 semaines, renouvelable

CONSEILS :
- Surélever tête de lit
- Éviter repas copieux le soir
- Fractionner alimentation
- Éviter : café, chocolat, aliments gras, agrumes',
true),

('Anémie Grossesse - Fer', 'grossesse', 'medicament', 'recommande', 'Supplémentation fer en cas d''anémie',
'TARDYFERON 80mg (Sulfate ferreux)
1 comprimé par jour le matin à jeun
Durée : selon taux d''hémoglobine (minimum 3 mois)

INFORMATIONS :
- Prendre à distance du lait, thé, café (espacer de 2h)
- Peut colorer les selles en noir (normal)
- Peut causer constipation : augmenter fibres et hydratation
- Prise avec jus d''orange (vitamine C) améliore absorption
- Contrôle biologique dans 1 mois',
true),

('Prévention Prénatale - Acide Folique', 'grossesse', 'medicament', 'recommande', 'Supplémentation acide folique pré-conceptionnelle et début grossesse',
'SPECIAFOLDINE 5mg (Acide folique)
1 comprimé par jour
Débuter idéalement 1 mois avant conception et poursuivre jusqu''à 12 SA

+

VITAMINE D
UVEDOSE 100 000 UI
1 ampoule tous les 3 mois pendant la grossesse

IMPORTANCE :
- Acide folique : prévention anomalies tube neural (spina bifida)
- Vitamine D : développement osseux fœtal et prévention rachitisme',
true),

('Menace Accouchement Prématuré', 'grossesse', 'medicament', 'urgent', 'Traitement tocolytique ambulatoire',
'LOXEN 20mg (Nicardipine)
1 gélule 3 fois par jour
Durée selon indication obstétricale

+

SPASFON LYOC 160mg
1 comprimé 3 fois par jour

REPOS STRICT
Arrêt de travail prescrit

SURVEILLANCE :
- Contractions : noter fréquence
- Pertes : surveiller pertes liquidiennes
- Mouvements fœtaux
⚠️ CONSULTER EN URGENCE si : contractions régulières, pertes liquidiennes, saignements',
true),

-- ========================================
-- POST-PARTUM
-- ========================================

('Post-Partum - Douleurs', 'postpartum', 'medicament', 'recommande', 'Antalgiques et anti-inflammatoires après accouchement',
'IBUPROFÈNE 400mg
1 comprimé 3 fois par jour pendant les repas
Durée : 5 jours

+

PARACÉTAMOL 1g
1 comprimé toutes les 6h si douleurs persistantes (max 4g/jour)

CONSEILS :
- Compatible avec allaitement
- Si douleurs intenses persistantes : consulter
- Glace sur périnée les premiers jours
- Bains de siège tièdes après 48h',
true),

('Post-Partum - Hémorroïdes', 'postpartum', 'medicament', 'recommande', 'Traitement crise hémorroïdaire post-partum',
'TITANOREINE crème
Application locale 2 à 3 fois par jour après toilette
Durée : 7 jours

+

DAFLON 500mg
2 comprimés 2 fois par jour pendant 4 jours
puis 2 comprimés par jour pendant 3 jours

CONSEILS :
- Hygiène locale soigneuse
- Éviter constipation : FORLAX si besoin
- Bains de siège tièdes
- Compatible allaitement',
true),

('Allaitement - Crevasses', 'postpartum', 'autre', 'recommande', 'Traitement crevasses du mamelon',
'CASTOR EQUI pommade
Application après chaque tétée
Rincer avant prochaine tétée

OU

LANOLINE PURE (Lansinoh)
Application après chaque tétée
Pas besoin de rincer

CONSEILS :
- Vérifier position bébé au sein
- Alterner positions allaitement
- Lait maternel sur crevasse (propriétés cicatrisantes)
- Consulter si fissures profondes ou signes infection',
true),

('Allaitement - Engorgement', 'postpartum', 'medicament', 'recommande', 'Traitement engorgement mammaire',
'IBUPROFÈNE 400mg
1 comprimé 3 fois par jour pendant 3-5 jours

+

PARLODEL 2,5mg (Bromocriptine) - UNIQUEMENT si sevrage souhaité
1/2 comprimé 2 fois par jour pendant 1 jour
puis 1 comprimé 2 fois par jour pendant 14 jours

CONSEILS POUR POURSUIVRE ALLAITEMENT :
- Tétées fréquentes ou tire-lait
- Massage aréolaire avant tétée
- Froid entre tétées
- Douche chaude avant tétée

SI SEVRAGE :
- Bandage serré des seins
- Éviter stimulation
- Compresses froides',
true),

('Sevrage Allaitement', 'postpartum', 'medicament', 'recommande', 'Inhibition lactation pour sevrage',
'DOSTINEX 0,5mg (Cabergoline)
1/2 comprimé 2 fois par jour pendant 2 jours (soit 1 comprimé au total)

⚠️ À DÉBUTER DANS LES 24H APRÈS ACCOUCHEMENT OU AU MOMENT DU SEVRAGE

CONSEILS :
- Bandage serré des seins
- Éviter stimulation mammaire
- Compresses froides si douleurs
- Consultation si fièvre, seins très douloureux (risque lymphangite)',
true),

('Baby Blues / Dépression Post-Partum Débutante', 'postpartum', 'autre', 'urgent', 'Soutien et surveillance dépression post-partum',
'Pas de traitement médicamenteux en première intention

SURVEILLANCE RAPPROCHÉE
RDV hebdomadaires programmés

SOUTIEN :
- Réseau familial à mobiliser
- PMI : suivi à domicile
- Psychologue périnatale
- Groupes de parole

ÉCHELLE EPDS à refaire chaque semaine

⚠️ ORIENTATION PSYCHIATRIE si :
- Idées suicidaires
- Idées d''infanticide
- Délire
- Score EPDS > 12
- Absence d''amélioration sous 2 semaines

POSSIBILITÉ CONSULTATION PSYCHOLOGUE
Ordonnance pour consultation psychologique (remboursée)',
true),

-- ========================================
-- MÉNOPAUSE
-- ========================================

('Ménopause - Sécheresse Vaginale', 'gynecologie', 'medicament', 'recommande', 'Traitement sécheresse vaginale ménopausique',
'TROPHIGIL crème (Promestriène)
1 application intravaginale chaque soir pendant 1 mois
Puis 2 à 3 applications par semaine en entretien

OU

MONASENS gel (Acide hyaluronique)
1 application 3 fois par semaine
Traitement non hormonal

CONSEILS :
- Hydratation locale quotidienne
- Lubrifiants lors des rapports
- Consultation si saignements',
true),

-- ========================================
-- DOULEURS GYNÉCOLOGIQUES
-- ========================================

('Dysménorrhée', 'gynecologie', 'medicament', 'recommande', 'Traitement règles douloureuses',
'IBUPROFÈNE 400mg
1 comprimé 3 fois par jour pendant les repas
À débuter dès les premiers signes de règles
Durée : 3-5 jours

+

SPASFON 160mg
1 à 2 comprimés si spasmes douloureux (max 6/jour)

CONSEILS :
- Chaleur sur abdomen (bouillotte)
- Activité physique régulière
- Si douleurs invalidantes malgré traitement : consulter (endométriose ?)',
true),

('Syndrome Prémenstruel', 'gynecologie', 'medicament', 'optionnel', 'Traitement SPM (irritabilité, mastodynie, ballonnements)',
'MAGNÉSIUM 300mg
1 comprimé matin et soir
À débuter 10 jours avant les règles

+

VITAMINE B6 50mg
1 comprimé par jour

Si MASTODYNIE importante :

MASTODYNON (homéopathie)
30 gouttes 2 fois par jour
Traitement sur 3 mois

CONSEILS :
- Réduire sel, café, alcool en 2e partie de cycle
- Activité physique régulière
- Gestion du stress',
true),

-- ========================================
-- INFECTIONS URINAIRES
-- ========================================

('Cystite Récidivante - Traitement', 'gynecologie', 'medicament', 'recommande', 'Traitement cystite récidivante avec prévention',
'TRAITEMENT DE LA CYSTITE :
MONURIL 3g
1 sachet en prise unique

+

PRÉVENTION DES RÉCIDIVES :
FEMANNOSE N (D-Mannose)
1 sachet par jour pendant 3 mois
Puis 1 sachet après chaque rapport sexuel

OU

CANNEBERGE (Cranberry) 36mg PAC
1 gélule par jour pendant 3 mois

CONSEILS :
- Uriner après chaque rapport
- Boire 1,5L/jour minimum
- Ne pas se retenir
- ECBU si > 4 épisodes/an',
true),

-- ========================================
-- SEVRAGE TABAC
-- ========================================

('Sevrage Tabac - Substituts Nicotiniques', 'gynecologie', 'medicament', 'recommande', 'Substitution nicotinique pour arrêt tabac',
'NICORETTE 2mg gommes
1 gomme toutes les 1-2h (max 30/jour)
Mâcher lentement, garder en bouche
Durée : 3 mois puis réduction progressive

OU

NIQUITIN 21mg patchs
1 patch par jour pendant 6 semaines
Puis NIQUITIN 14mg pendant 2 semaines
Puis NIQUITIN 7mg pendant 2 semaines

⚠️ COMPATIBLE GROSSESSE ET ALLAITEMENT
Bénéfice largement supérieur aux risques du tabac

SOUTIEN :
- Tabac Info Service : 39 89
- Consultation de tabacologie si besoin',
true),

-- ========================================
-- PRÉVENTION ET VACCINS
-- ========================================

('Vaccination HPV - Gardasil 9', 'gynecologie', 'autre', 'recommande', 'Vaccination contre papillomavirus',
'GARDASIL 9
Schéma vaccinal selon âge :
- 11-14 ans : 2 doses à 6 mois d''intervalle
- 15-19 ans : 3 doses (M0, M2, M6)
- Rattrapage possible jusqu''à 19 ans révolus (26 ans si HSH)

INFORMATIONS :
- Prévention cancer col utérus, vulve, vagin, anus
- Prévention condylomes
- Efficacité maximale avant début vie sexuelle
- Ne dispense pas du dépistage par frottis',
true),

-- ========================================
-- DERMATOLOGIE GYNÉCOLOGIQUE
-- ========================================

('Condylomes Génitaux', 'gynecologie', 'medicament', 'recommande', 'Traitement condylomes acuminés',
'ALDARA 5% crème (Imiquimod)
Application locale sur les lésions 3 fois par semaine au coucher
Laisser 8h puis rincer
Durée : jusqu''à disparition (max 16 semaines)

OU traitement par cryothérapie en consultation

INFORMATIONS :
- IST due au HPV
- Traitement du partenaire à vérifier
- Préservatifs recommandés
- Contrôle colposcopique
- Vaccination HPV du partenaire si < 26 ans',
true),

('Bartholinite', 'gynecologie', 'medicament', 'urgent', 'Traitement infection glande de Bartholin',
'AUGMENTIN 1g (Amoxicilline + Acide clavulanique)
1 comprimé 3 fois par jour pendant 7 jours

+

IBUPROFÈNE 400mg
1 comprimé 3 fois par jour pendant 5 jours

+

BAINS DE SIÈGE tièdes 3 fois par jour

⚠️ CONSULTATION EN URGENCE SI :
- Fièvre élevée
- Douleur intense
- Abcès volumineux
→ Nécessité drainage chirurgical possible',
true);
