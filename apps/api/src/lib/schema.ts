import { pgTable, text, timestamp, integer, boolean, decimal, date, jsonb, uuid, pgEnum, vector, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'sage_femme', 'secretaire'])
export const protocolCategoryEnum = pgEnum('protocol_category', ['grossesse', 'post_partum', 'gynecologie', 'reeducation', 'pediatrie', 'autre'])
export const patientStatusEnum = pgEnum('patient_status', ['active', 'inactive', 'archived'])
export const pregnancyStatusEnum = pgEnum('pregnancy_status', ['en_cours', 'terminee', 'fausse_couche', 'ivg', 'img'])
export const appointmentStatusEnum = pgEnum('appointment_status', ['planifie', 'confirme', 'en_cours', 'termine', 'annule', 'absent'])
export const invoiceStatusEnum = pgEnum('invoice_status', ['brouillon', 'envoyee', 'payee', 'impayee', 'annulee'])
export const paymentMethodEnum = pgEnum('payment_method', ['especes', 'cheque', 'carte', 'virement', 'tiers_payant'])
export const documentTypeEnum = pgEnum('document_type', ['ordonnance', 'certificat', 'courrier', 'declaration_grossesse', 'compte_rendu', 'autre'])
export const consultationTypeEnum = pgEnum('consultation_type', ['prenatale', 'postnatale', 'gyneco', 'reeducation', 'preparation', 'monitoring', 'ivg', 'autre'])
export const alertSeverityEnum = pgEnum('alert_severity', ['info', 'warning', 'critical'])
export const auditActionEnum = pgEnum('audit_action', ['create', 'read', 'update', 'delete', 'login', 'logout', 'export'])
export const ordonnanceTypeEnum = pgEnum('ordonnance_type', ['medicament', 'biologie', 'echographie', 'autre'])
export const ordonnancePrioriteEnum = pgEnum('ordonnance_priorite', ['urgent', 'recommande', 'optionnel'])
export const frottisResultatEnum = pgEnum('frottis_resultat', ['normal', 'ascus', 'lsil', 'hsil', 'agc', 'carcinome', 'autre', 'en_attente'])
export const contraceptifTypeEnum = pgEnum('contraceptif_type', ['sterilet_cuivre', 'sterilet_hormonal', 'implant'])
export const resultatStatutEnum = pgEnum('resultat_statut', ['en_attente', 'recupere', 'transmis'])
export const surveillanceNiveauEnum = pgEnum('surveillance_niveau', ['normal', 'vigilance', 'rapprochee'])
export const surveillanceRaisonEnum = pgEnum('surveillance_raison', ['hta', 'diabete', 'rciu', 'macrosomie', 'map', 'antecedents', 'age_maternel', 'grossesse_multiple', 'autre'])
export const shareTypeEnum = pgEnum('share_type', ['patient', 'grossesse', 'documents', 'synthetic_pdf'])
export const shareActionEnum = pgEnum('share_action', ['access_granted', 'access_denied', 'data_read', 'data_modified', 'revoked'])
export const practiceActionTypeEnum = pgEnum('practice_action_type', ['prescription', 'examen', 'conseil', 'diagnostic', 'orientation'])
export const practiceContextTypeEnum = pgEnum('practice_context_type', ['consultation_prenatale', 'consultation_postnatale', 'consultation_gyneco', 'reeducation', 'monitoring'])

// Tables
export const patientsSurveillance = pgTable('patients_surveillance', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  grossesseId: uuid('grossesse_id').references(() => grossesses.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Surveillance
  niveau: surveillanceNiveauEnum('niveau').notNull().default('vigilance'),
  raison: surveillanceRaisonEnum('raison').notNull(),
  raisonDetail: text('raison_detail'), // Détail supplémentaire

  // Dates
  dateDebut: timestamp('date_debut').notNull().defaultNow(),
  dateFin: timestamp('date_fin'), // Si surveillance terminée
  dateProchainControle: timestamp('date_prochain_controle').notNull(),

  // Suivi
  frequenceControle: integer('frequence_controle'), // En jours
  notesSurveillance: text('notes_surveillance'),
  parametresSuivre: jsonb('parametres_suivre').$type<string[]>(), // ['TA', 'HU', 'Glycémie']

  // Status
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('patients_surveillance_patient_id_idx').on(table.patientId),
  userIdIdx: index('patients_surveillance_user_id_idx').on(table.userId),
  niveauIdx: index('patients_surveillance_niveau_idx').on(table.niveau),
  dateProchainControleIdx: index('patients_surveillance_date_prochain_controle_idx').on(table.dateProchainControle),
  isActiveIdx: index('patients_surveillance_is_active_idx').on(table.isActive),
}))

export const consultationTemplates = pgTable('consultation_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Identification du template
  templateId: text('template_id').notNull(), // ex: "prenatal-t1"
  name: text('name').notNull(),
  description: text('description'),
  type: consultationTypeEnum('type').notNull(),

  // Plages SA pour templates prénataux
  saMin: integer('sa_min'),
  saMax: integer('sa_max'),

  // Contenu du template
  data: jsonb('data').notNull().$type<{
    motif?: string
    examenClinique?: string
    conclusion?: string
  }>(),

  // Métadonnées
  isCustom: boolean('is_custom').default(true).notNull(), // true = personnalisé par l'utilisateur
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('consultation_templates_user_id_idx').on(table.userId),
  templateIdIdx: index('consultation_templates_template_id_idx').on(table.templateId),
  typeIdx: index('consultation_templates_type_idx').on(table.type),
}))

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: userRoleEnum('role').notNull().default('sage_femme'),
  rpps: text('rpps'),
  adeli: text('adeli'),
  phone: text('phone'),
  twoFactorSecret: text('two_factor_secret'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const practitionerSettings = pgTable('practitioner_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  cabinetAddress: text('cabinet_address').notNull(),
  cabinetPostalCode: text('cabinet_postal_code'),
  cabinetCity: text('cabinet_city'),
  cabinetPhone: text('cabinet_phone'),
  cabinetEmail: text('cabinet_email'),
  signatureImageUrl: text('signature_image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const calendarIntegrations = pgTable('calendar_integrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),

  // Google Calendar OAuth
  googleAccessToken: text('google_access_token'),
  googleRefreshToken: text('google_refresh_token'),
  googleTokenExpiresAt: timestamp('google_token_expires_at'),
  googleCalendarId: text('google_calendar_id'), // ID du calendrier Google à synchroniser
  googleEmail: text('google_email'),

  // Sync settings
  syncEnabled: boolean('sync_enabled').default(false),
  syncDirection: text('sync_direction').default('bidirectional'), // 'import', 'export', 'bidirectional'
  lastSyncAt: timestamp('last_sync_at'),
  syncFrequency: integer('sync_frequency').default(15), // minutes

  // Doctolib detection
  doctolibCalendarName: text('doctolib_calendar_name'), // Nom du calendrier Doctolib dans Google Calendar

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
  expiresAtIdx: index('sessions_expires_at_idx').on(table.expiresAt),
}))

export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Identité
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  maidenName: text('maiden_name'),
  birthDate: date('birth_date').notNull(),
  birthPlace: text('birth_place'),
  socialSecurityNumber: text('social_security_number'),

  // Contact
  email: text('email'),
  phone: text('phone'),
  mobilePhone: text('mobile_phone'),
  address: text('address'),
  postalCode: text('postal_code'),
  city: text('city'),

  // Médical
  bloodType: text('blood_type'),
  rhesus: text('rhesus'),
  allergies: text('allergies'),
  antecedentsMedicaux: jsonb('antecedents_medicaux').$type<string[]>(),
  antecedentsChirurgicaux: jsonb('antecedents_chirurgicaux').$type<string[]>(),
  antecedentsFamiliaux: jsonb('antecedents_familiaux').$type<string[]>(),
  traitementEnCours: text('traitement_en_cours'),

  // Antécédents gynécologiques détaillés
  antecedentsGynecologiques: jsonb('antecedents_gynecologiques').$type<{
    dateReglesMenarches?: string // Age ou date des premières règles
    dureeCycle?: number // en jours
    dureeRegles?: number // en jours
    dysmenorrhees?: boolean
    dysmenorrheesDetails?: string
    dyspareunies?: boolean
    dyspareuniesDétails?: string
    contraception?: string
    contraceptionDetails?: string
    dateDernierFrottis?: string
    resultatDernierFrottis?: string
    pathologiesGyneco?: string[] // Liste des pathologies gynéco
    chirurgiesGyneco?: string[] // Liste des chirurgies gynéco avec dates
    autres?: string
  }>(),

  // Obstétrique
  gravida: integer('gravida').default(0),
  para: integer('para').default(0),
  antecedentsObstetricaux: text('antecedents_obstetricaux'), // Détails des grossesses précédentes

  // Assurance
  mutuelle: text('mutuelle'),
  numeroMutuelle: text('numero_mutuelle'),
  medecinTraitant: text('medecin_traitant'),

  // Professionnel référent
  personneConfiance: text('personne_confiance'),
  telephoneConfiance: text('telephone_confiance'),

  // Consentements RGPD
  consentementRGPD: boolean('consentement_rgpd').default(false),
  dateConsentement: timestamp('date_consentement'),

  status: patientStatusEnum('status').default('active'),
  notes: text('notes'),
  notesNextConsultation: text('notes_next_consultation'),
  doctolibId: text('doctolib_id'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('patients_user_id_idx').on(table.userId),
  statusIdx: index('patients_status_idx').on(table.status),
  updatedAtIdx: index('patients_updated_at_idx').on(table.updatedAt),
}))

export const grossesses = pgTable('grossesses', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Dates clés
  ddr: date('ddr').notNull(), // Date des dernières règles
  dpa: date('dpa').notNull(), // Date prévue d'accouchement
  dateConception: date('date_conception'),

  // Statut
  status: pregnancyStatusEnum('status').default('en_cours'),
  grossesseMultiple: boolean('grossesse_multiple').default(false),
  nombreFoetus: integer('nombre_foetus').default(1),

  // Antécédents obstétricaux
  gestite: integer('gestite').default(1),
  parite: integer('parite').default(0),

  // Résultat
  dateAccouchement: date('date_accouchement'),
  termeSemaines: integer('terme_semaines'),
  termeJours: integer('terme_jours'),
  modeAccouchement: text('mode_accouchement'),
  lieuAccouchement: text('lieu_accouchement'),

  // Facteurs de risque
  facteursRisque: jsonb('facteurs_risque').$type<string[]>(),

  // Suivi partagé
  suiviPartageGyneco: boolean('suivi_partage_gyneco').default(false).notNull(),
  nomGyneco: text('nom_gyneco'),

  // Récapitulatif médical grossesse
  recapMedical: jsonb('recap_medical').$type<{
    groupeSanguin?: string
    rhesus?: string
    toxoplasmose?: string
    rubeole?: string
    syphilis?: string
    vhb?: string
    vhc?: string
    vih?: string
    gaj?: string
    hgpo?: string
    echoT1?: boolean
    echoT2?: boolean
    echoT3?: boolean
    rai?: string
    nfs6mois?: string
    vitD?: boolean
    vaccinCoqueluche?: boolean
    pvStreptoB?: string
  }>(),

  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('grossesses_patient_id_idx').on(table.patientId),
  userIdIdx: index('grossesses_user_id_idx').on(table.userId),
  statusIdx: index('grossesses_status_idx').on(table.status),
  dpaIdx: index('grossesses_dpa_idx').on(table.dpa),
}))

// Table des comptes rendus d'accouchement
export const accouchements = pgTable('accouchements', {
  id: uuid('id').defaultRandom().primaryKey(),
  grossesseId: uuid('grossesse_id').notNull().references(() => grossesses.id, { onDelete: 'cascade' }),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Informations générales
  dateAccouchement: timestamp('date_accouchement').notNull(),
  lieuAccouchement: text('lieu_accouchement'), // Maternité, domicile, etc.
  termeSemaines: integer('terme_semaines'),
  termeJours: integer('terme_jours'),

  // Travail
  dateDebutTravail: timestamp('date_debut_travail'),
  dureeTravailHeures: integer('duree_travail_heures'),
  dureeTravailMinutes: integer('duree_travail_minutes'),

  // Poche des eaux
  ruptureMembranes: text('rupture_membranes'), // spontanée, artificielle, avant travail
  dateRuptureMembranes: timestamp('date_rupture_membranes'),
  aspectLiquideAmniotique: text('aspect_liquide_amniotique'), // clair, teinté, méconial

  // Analgésie
  apd: boolean('apd').default(false), // Analgésie péridurale
  dateApd: timestamp('date_apd'),
  autreAnalgesie: text('autre_analgesie'),

  // Accouchement
  modeAccouchement: text('mode_accouchement').notNull(), // voie basse, césarienne, instrumental
  typeInstrumental: text('type_instrumental'), // forceps, ventouse, spatules
  indicationInstrumental: text('indication_instrumental'),
  indicationCesarienne: text('indication_cesarienne'),

  // Présentation et position
  presentation: text('presentation'), // céphalique, siège, transverse
  variete: text('variete'), // OIGA, OIDA, etc.

  // Périnée
  perinee: text('perinee'), // intact, déchirure, épisiotomie
  degre: text('degre'), // 1er, 2ème, 3ème, 4ème degré
  suture: boolean('suture'),
  typeFilSuture: text('type_fil_suture'),

  // Délivrance
  typeDelivrance: text('type_delivrance'), // spontanée, dirigée, artificielle, révision utérine
  dureeDelivranceMinutes: integer('duree_delivrance_minutes'),
  placentaComplet: boolean('placenta_complet'),
  poidsPlacenta: integer('poids_placenta'), // en grammes
  anomaliesPlacenta: text('anomalies_placenta'),

  // Hémorragie
  perteSanguine: integer('perte_sanguine'), // en mL
  hemorragie: boolean('hemorragie').default(false),
  traitementHemorragie: text('traitement_hemorragie'),

  // Post-partum immédiat
  examenPostPartum: text('examen_post_partum'),
  complications: text('complications'),

  // Observations et notes
  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  grossesseIdIdx: index('accouchements_grossesse_id_idx').on(table.grossesseId),
  patientIdIdx: index('accouchements_patient_id_idx').on(table.patientId),
  userIdIdx: index('accouchements_user_id_idx').on(table.userId),
  dateIdx: index('accouchements_date_idx').on(table.dateAccouchement),
}))

export const bebes = pgTable('bebes', {
  id: uuid('id').defaultRandom().primaryKey(),
  grossesseId: uuid('grossesse_id').notNull().references(() => grossesses.id, { onDelete: 'cascade' }),
  patientId: uuid('patient_id').notNull().references(() => patients.id),

  prenom: text('prenom'),
  sexe: text('sexe'),
  dateNaissance: date('date_naissance'),
  heureNaissance: text('heure_naissance'),

  poids: integer('poids'), // en grammes
  taille: integer('taille'), // en cm
  perimetreCranien: integer('perimetre_cranien'), // en mm

  apgar1: integer('apgar_1'),
  apgar5: integer('apgar_5'),
  apgar10: integer('apgar_10'),

  allaitement: text('allaitement'), // maternel, artificiel, mixte

  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  grossesseIdIdx: index('bebes_grossesse_id_idx').on(table.grossesseId),
  patientIdIdx: index('bebes_patient_id_idx').on(table.patientId),
}))

export const mensurationsBebe = pgTable('mensurations_bebe', {
  id: uuid('id').defaultRandom().primaryKey(),
  bebeId: uuid('bebe_id').notNull().references(() => bebes.id, { onDelete: 'cascade' }),
  consultationId: uuid('consultation_id').references(() => consultations.id),

  date: timestamp('date').notNull().defaultNow(),
  ageJours: integer('age_jours'), // Âge en jours au moment de la mesure

  poids: integer('poids'), // en grammes
  taille: integer('taille'), // en cm
  perimetreCranien: integer('perimetre_cranien'), // en mm

  // Percentiles calculés
  percentilePoids: integer('percentile_poids'),
  percentileTaille: integer('percentile_taille'),
  percentilePC: integer('percentile_pc'),

  // Alertes
  alertes: jsonb('alertes').$type<string[]>(),
  statusGlobal: text('status_global'), // normal, surveillance, pathologique

  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  bebeIdIdx: index('mensurations_bebe_bebe_id_idx').on(table.bebeId),
  dateIdx: index('mensurations_bebe_date_idx').on(table.date),
}))

export const consultations = pgTable('consultations', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  grossesseId: uuid('grossesse_id').references(() => grossesses.id),
  bebeId: uuid('bebe_id').references(() => bebes.id), // Pour consultations post-natales

  type: consultationTypeEnum('type').notNull(),
  date: timestamp('date').notNull(),
  duree: integer('duree'), // en minutes
  templateId: text('template_id'), // ID du template utilisé (ex: "prenatal-t1")

  // Données cliniques
  poids: decimal('poids', { precision: 5, scale: 2 }),
  taille: integer('taille'),
  tensionSystolique: integer('tension_systolique'),
  tensionDiastolique: integer('tension_diastolique'),
  pouls: integer('pouls'),
  temperature: decimal('temperature', { precision: 3, scale: 1 }),

  // Grossesse spécifique
  saTerm: integer('sa_term'),
  saJours: integer('sa_jours'),
  hauteurUterine: integer('hauteur_uterine'),
  bdc: integer('bdc'), // Battements du coeur fœtal
  mouvementsFoetaux: boolean('mouvements_foetaux'),
  presentationFoetale: text('presentation_foetale'),

  // Examen
  motif: text('motif'),
  sousTypeGyneco: text('sous_type_gyneco'), // instauration, suivi, depistage, infection, autre
  examenClinique: text('examen_clinique'),
  conclusion: text('conclusion'),
  prescriptions: text('prescriptions'),
  resumeCourt: text('resume_court'), // Résumé succinct pour affichage dans listes

  // Bandelette urinaire
  proteineUrinaire: text('proteine_urinaire'),
  glucoseUrinaire: text('glucose_urinaire'),
  leucocytesUrinaires: text('leucocytes_urinaires'),
  nitritesUrinaires: text('nitrites_urinaires'),

  alertes: jsonb('alertes').$type<{ type: string; message: string; severity: string }[]>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('consultations_patient_id_idx').on(table.patientId),
  userIdIdx: index('consultations_user_id_idx').on(table.userId),
  grossesseIdIdx: index('consultations_grossesse_id_idx').on(table.grossesseId),
  dateIdx: index('consultations_date_idx').on(table.date),
  typeIdx: index('consultations_type_idx').on(table.type),
}))

export const reeducationSeances = pgTable('reeducation_seances', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  numeroSeance: integer('numero_seance').notNull(),
  date: timestamp('date').notNull(),

  // Bilan périnéal
  testingPerineal: integer('testing_perineal'), // 0 à 5
  testingAbdominaux: integer('testing_abdominaux'),

  // Contenu de la séance
  exercicesRealises: jsonb('exercices_realises').$type<string[]>(),
  biofeedback: boolean('biofeedback'),
  electrostimulation: boolean('electrostimulation'),

  observations: text('observations'),
  evolution: text('evolution'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('reeducation_seances_patient_id_idx').on(table.patientId),
  userIdIdx: index('reeducation_seances_user_id_idx').on(table.userId),
  dateIdx: index('reeducation_seances_date_idx').on(table.date),
}))

export const suiviPostPartum = pgTable('suivi_post_partum', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  grossesseId: uuid('grossesse_id').notNull().references(() => grossesses.id),
  userId: uuid('user_id').notNull().references(() => users.id),

  date: timestamp('date').notNull(),
  joursPostPartum: integer('jours_post_partum'),

  // État maternel
  etatGeneral: text('etat_general'),
  involutionUterine: text('involution_uterine'),
  lochies: text('lochies'),
  cicatrisation: text('cicatrisation'),
  seins: text('seins'),

  // Allaitement
  allaitement: text('allaitement'),
  difficultesAllaitement: text('difficultes_allaitement'),

  // Psychologique
  babyBlues: boolean('baby_blues'),
  depressionPostPartum: boolean('depression_post_partum'),
  scoreEPDS: integer('score_epds'),

  // Bébé
  prisePoidsBebe: integer('prise_poids_bebe'),
  cordonOmbilical: text('cordon_ombilical'),
  ictere: boolean('ictere'),

  observations: text('observations'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('suivi_post_partum_patient_id_idx').on(table.patientId),
  grossesseIdIdx: index('suivi_post_partum_grossesse_id_idx').on(table.grossesseId),
  userIdIdx: index('suivi_post_partum_user_id_idx').on(table.userId),
  dateIdx: index('suivi_post_partum_date_idx').on(table.date),
}))

export const suiviGyneco = pgTable('suivi_gyneco', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  date: timestamp('date').notNull(),
  motif: text('motif'),

  // Cycle
  dateDernieresRegles: date('date_dernieres_regles'),
  dureeRegles: integer('duree_regles'),
  dureeCycle: integer('duree_cycle'),
  regularite: text('regularite'),

  // Contraception
  contraceptionActuelle: text('contraception_actuelle'),
  dateDebutContraception: date('date_debut_contraception'),

  // Dépistage
  dateDernierFrottis: date('date_dernier_frottis'),
  resultatFrottis: text('resultat_frottis'),
  hpv: text('hpv'),

  // Examen
  examenSeins: text('examen_seins'),
  examenGynecologique: text('examen_gynecologique'),

  prescriptions: text('prescriptions'),
  observations: text('observations'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('suivi_gyneco_patient_id_idx').on(table.patientId),
  userIdIdx: index('suivi_gyneco_user_id_idx').on(table.userId),
  dateIdx: index('suivi_gyneco_date_idx').on(table.date),
}))

export const examensPrenataux = pgTable('examens_prenataux', {
  id: uuid('id').defaultRandom().primaryKey(),
  grossesseId: uuid('grossesse_id').notNull().references(() => grossesses.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  type: text('type').notNull(), // echo_t1, echo_t2, echo_t3, prise_sang, glycemie, etc.
  nom: text('nom').notNull(),
  saPrevue: integer('sa_prevue'),
  dateRecommandee: date('date_recommandee'),
  dateRealisee: date('date_realisee'),
  resultat: text('resultat'),
  fichierUrl: text('fichier_url'),
  normal: boolean('normal'),
  alertes: text('alertes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  grossesseIdIdx: index('examens_prenataux_grossesse_id_idx').on(table.grossesseId),
  userIdIdx: index('examens_prenataux_user_id_idx').on(table.userId),
  dateRealiseeIdx: index('examens_prenataux_date_realisee_idx').on(table.dateRealisee),
}))

export const alertes = pgTable('alertes', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  grossesseId: uuid('grossesse_id').references(() => grossesses.id),
  consultationId: uuid('consultation_id').references(() => consultations.id),
  userId: uuid('user_id').notNull().references(() => users.id),

  type: text('type').notNull(),
  message: text('message').notNull(),
  severity: alertSeverityEnum('severity').default('info'),

  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  isDismissed: boolean('is_dismissed').default(false),
  dismissedAt: timestamp('dismissed_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('alertes_patient_id_idx').on(table.patientId),
  grossesseIdIdx: index('alertes_grossesse_id_idx').on(table.grossesseId),
  consultationIdIdx: index('alertes_consultation_id_idx').on(table.consultationId),
  userIdIdx: index('alertes_user_id_idx').on(table.userId),
  isReadIdx: index('alertes_is_read_idx').on(table.isRead),
  severityIdx: index('alertes_severity_idx').on(table.severity),
  createdAtIdx: index('alertes_created_at_idx').on(table.createdAt),
}))

export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  title: text('title').notNull(),
  type: consultationTypeEnum('type').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),

  status: appointmentStatusEnum('status').default('planifie'),

  location: text('location'),
  isHomeVisit: boolean('is_home_visit').default(false),

  // External integrations
  doctolibId: text('doctolib_id'),
  googleCalendarEventId: text('google_calendar_event_id'),

  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('appointments_patient_id_idx').on(table.patientId),
  userIdIdx: index('appointments_user_id_idx').on(table.userId),
  startTimeIdx: index('appointments_start_time_idx').on(table.startTime),
  statusIdx: index('appointments_status_idx').on(table.status),
  googleCalendarEventIdIdx: index('appointments_google_calendar_event_id_idx').on(table.googleCalendarEventId),
}))

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  numero: text('numero').notNull().unique(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  consultationId: uuid('consultation_id').references(() => consultations.id),

  date: date('date').notNull(),
  dateEcheance: date('date_echeance'),

  // Montants
  montantHT: decimal('montant_ht', { precision: 10, scale: 2 }).notNull(),
  montantTTC: decimal('montant_ttc', { precision: 10, scale: 2 }).notNull(),
  montantPaye: decimal('montant_paye', { precision: 10, scale: 2 }).default('0'),

  // Cotations NGAP
  cotations: jsonb('cotations').$type<{ code: string; coefficient: number; montant: number }[]>(),

  status: invoiceStatusEnum('status').default('brouillon'),
  paymentMethod: paymentMethodEnum('payment_method'),
  datePaiement: date('date_paiement'),

  // Tiers payant
  tiersPart: decimal('tiers_part', { precision: 10, scale: 2 }),
  patientPart: decimal('patient_part', { precision: 10, scale: 2 }),

  // Télétransmission
  telettransmise: boolean('telettransmise').default(false),
  dateTeletransmission: timestamp('date_teletransmission'),
  retourNoemie: jsonb('retour_noemie'),

  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('invoices_patient_id_idx').on(table.patientId),
  userIdIdx: index('invoices_user_id_idx').on(table.userId),
  consultationIdIdx: index('invoices_consultation_id_idx').on(table.consultationId),
  dateIdx: index('invoices_date_idx').on(table.date),
  statusIdx: index('invoices_status_idx').on(table.status),
}))

export const cotationsNGAP = pgTable('cotations_ngap', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  libelle: text('libelle').notNull(),
  coefficient: decimal('coefficient', { precision: 4, scale: 2 }).notNull(),
  lettreCle: text('lettre_cle').notNull(),
  tarifBase: decimal('tarif_base', { precision: 10, scale: 2 }).notNull(),
  categorie: text('categorie'),
  actif: boolean('actif').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  consultationId: uuid('consultation_id').references(() => consultations.id),

  type: documentTypeEnum('type').notNull(),
  titre: text('titre').notNull(),
  contenu: text('contenu'),
  fichierUrl: text('fichier_url'),

  signe: boolean('signe').default(false),
  dateSigne: timestamp('date_signe'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('documents_patient_id_idx').on(table.patientId),
  userIdIdx: index('documents_user_id_idx').on(table.userId),
  consultationIdIdx: index('documents_consultation_id_idx').on(table.consultationId),
  typeIdx: index('documents_type_idx').on(table.type),
  createdAtIdx: index('documents_created_at_idx').on(table.createdAt),
}))

export const documentTemplates = pgTable('document_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),

  type: documentTypeEnum('type').notNull(),
  nom: text('nom').notNull(),
  contenu: text('contenu').notNull(),
  variables: jsonb('variables').$type<string[]>(),
  isDefault: boolean('is_default').default(false),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),

  action: auditActionEnum('action').notNull(),
  tableName: text('table_name'),
  recordId: text('record_id'),

  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),

  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  tableNameIdx: index('audit_logs_table_name_idx').on(table.tableName),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}))

// Templates d'ordonnances
export const ordonnanceTemplates = pgTable('ordonnance_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // null = template système

  nom: text('nom').notNull(),
  categorie: text('categorie').notNull(), // contraception, infection, grossesse, gynecologie, etc.
  type: ordonnanceTypeEnum('type').notNull(),
  priorite: ordonnancePrioriteEnum('priorite').notNull().default('recommande'),

  contenu: text('contenu').notNull(), // Contenu du template avec checkboxes
  description: text('description'), // Description courte

  source: text('source'), // HAS, CNGOF, etc.
  version: text('version'), // Version du template (ex: "2024.1")
  dateValidite: date('date_validite'), // Date d'expiration des recommandations

  isActive: boolean('is_active').default(true),
  isSystemTemplate: boolean('is_system_template').default(false), // Templates par défaut non modifiables

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  categorieIdx: index('ordonnance_templates_categorie_idx').on(table.categorie),
  typeIdx: index('ordonnance_templates_type_idx').on(table.type),
  isActiveIdx: index('ordonnance_templates_is_active_idx').on(table.isActive),
  userIdIdx: index('ordonnance_templates_user_id_idx').on(table.userId),
}))

// Protocoles PDF avec IA
export const protocols = pgTable('protocols', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),

  nom: text('nom').notNull(),
  description: text('description'),
  category: text('category').notNull().default('Autre'),

  // Stockage du fichier
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(), // en bytes
  pageCount: integer('page_count'),

  // Statut de traitement
  isProcessed: boolean('is_processed').default(false),
  processingError: text('processing_error'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('protocols_user_id_idx').on(table.userId),
  categoryIdx: index('protocols_category_idx').on(table.category),
  isProcessedIdx: index('protocols_is_processed_idx').on(table.isProcessed),
}))

export const protocolChunks = pgTable('protocol_chunks', {
  id: uuid('id').defaultRandom().primaryKey(),
  protocolId: uuid('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),

  content: text('content').notNull(),
  chunkIndex: integer('chunk_index').notNull(),
  pageNumber: integer('page_number'),

  // Embedding vectoriel pour la recherche sémantique (768 dimensions pour Gemini)
  embedding: vector('embedding', { dimensions: 768 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  protocolIdIdx: index('protocol_chunks_protocol_id_idx').on(table.protocolId),
}))

// Historique des conversations avec l'IA
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),

  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sourcesUsed: jsonb('sources_used').$type<{ protocolId: string; protocolName: string; chunkIds: string[] }[]>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('ai_conversations_user_id_idx').on(table.userId),
  createdAtIdx: index('ai_conversations_created_at_idx').on(table.createdAt),
}))

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  patients: many(patients),
  consultations: many(consultations),
  sessions: many(sessions),
  auditLogs: many(auditLogs),
  calendarIntegration: one(calendarIntegrations, {
    fields: [users.id],
    references: [calendarIntegrations.userId],
  }),
}))

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, {
    fields: [patients.userId],
    references: [users.id],
  }),
  grossesses: many(grossesses),
  consultations: many(consultations),
  suiviGyneco: many(suiviGyneco),
  appointments: many(appointments),
  invoices: many(invoices),
  documents: many(documents),
  alertes: many(alertes),
  accouchements: many(accouchements),
}))

export const grossessesRelations = relations(grossesses, ({ one, many }) => ({
  patient: one(patients, {
    fields: [grossesses.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [grossesses.userId],
    references: [users.id],
  }),
  bebes: many(bebes),
  examens: many(examensPrenataux),
  consultations: many(consultations),
  suiviPostPartum: many(suiviPostPartum),
  accouchements: many(accouchements),
}))

export const examensPrenatauxRelations = relations(examensPrenataux, ({ one }) => ({
  grossesse: one(grossesses, {
    fields: [examensPrenataux.grossesseId],
    references: [grossesses.id],
  }),
  user: one(users, {
    fields: [examensPrenataux.userId],
    references: [users.id],
  }),
}))

export const reeducationSeancesRelations = relations(reeducationSeances, ({ one }) => ({
  patient: one(patients, {
    fields: [reeducationSeances.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [reeducationSeances.userId],
    references: [users.id],
  }),
}))

export const suiviPostPartumRelations = relations(suiviPostPartum, ({ one }) => ({
  patient: one(patients, {
    fields: [suiviPostPartum.patientId],
    references: [patients.id],
  }),
  grossesse: one(grossesses, {
    fields: [suiviPostPartum.grossesseId],
    references: [grossesses.id],
  }),
  user: one(users, {
    fields: [suiviPostPartum.userId],
    references: [users.id],
  }),
}))

export const suiviGynecoRelations = relations(suiviGyneco, ({ one }) => ({
  patient: one(patients, {
    fields: [suiviGyneco.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [suiviGyneco.userId],
    references: [users.id],
  }),
}))

export const consultationsRelations = relations(consultations, ({ one }) => ({
  patient: one(patients, {
    fields: [consultations.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [consultations.userId],
    references: [users.id],
  }),
  grossesse: one(grossesses, {
    fields: [consultations.grossesseId],
    references: [grossesses.id],
  }),
}))

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
}))

export const alertesRelations = relations(alertes, ({ one }) => ({
  patient: one(patients, {
    fields: [alertes.patientId],
    references: [patients.id],
  }),
  grossesse: one(grossesses, {
    fields: [alertes.grossesseId],
    references: [grossesses.id],
  }),
  consultation: one(consultations, {
    fields: [alertes.consultationId],
    references: [consultations.id],
  }),
  user: one(users, {
    fields: [alertes.userId],
    references: [users.id],
  }),
}))

export const invoicesRelations = relations(invoices, ({ one }) => ({
  patient: one(patients, {
    fields: [invoices.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  consultation: one(consultations, {
    fields: [invoices.consultationId],
    references: [consultations.id],
  }),
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  patient: one(patients, {
    fields: [documents.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
  consultation: one(consultations, {
    fields: [documents.consultationId],
    references: [consultations.id],
  }),
}))

export const bebesRelations = relations(bebes, ({ one }) => ({
  grossesse: one(grossesses, {
    fields: [bebes.grossesseId],
    references: [grossesses.id],
  }),
  patient: one(patients, {
    fields: [bebes.patientId],
    references: [patients.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}))

export const accouchementsRelations = relations(accouchements, ({ one }) => ({
  grossesse: one(grossesses, {
    fields: [accouchements.grossesseId],
    references: [grossesses.id],
  }),
  patient: one(patients, {
    fields: [accouchements.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [accouchements.userId],
    references: [users.id],
  }),
}))

export const protocolsRelations = relations(protocols, ({ one, many }) => ({
  user: one(users, {
    fields: [protocols.userId],
    references: [users.id],
  }),
  chunks: many(protocolChunks),
}))

export const protocolChunksRelations = relations(protocolChunks, ({ one }) => ({
  protocol: one(protocols, {
    fields: [protocolChunks.protocolId],
    references: [protocols.id],
  }),
}))

export const aiConversationsRelations = relations(aiConversations, ({ one }) => ({
  user: one(users, {
    fields: [aiConversations.userId],
    references: [users.id],
  }),
}))

export const ordonnanceTemplatesRelations = relations(ordonnanceTemplates, ({ one }) => ({
  user: one(users, {
    fields: [ordonnanceTemplates.userId],
    references: [users.id],
  }),
}))

export const calendarIntegrationsRelations = relations(calendarIntegrations, ({ one }) => ({
  user: one(users, {
    fields: [calendarIntegrations.userId],
    references: [users.id],
  }),
}))

// Parcours de rééducation
export const parcoursReeducation = pgTable('parcours_reeducation', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Informations générales
  dateDebut: date('date_debut').notNull(),
  dateFin: date('date_fin'),
  status: text('status').notNull().default('en_cours'), // 'en_cours', 'termine', 'abandonne'
  motif: text('motif').notNull(), // 'post_partum', 'incontinence', 'autre'

  // Nombre de séances
  nombreSeancesPrevues: integer('nombre_seances_prevues').default(5),
  nombreSeancesRealisees: integer('nombre_seances_realisees').default(0),

  // Notes générales
  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Séances de rééducation
export const seancesReeducation = pgTable('seances_reeducation', {
  id: uuid('id').defaultRandom().primaryKey(),
  parcoursId: uuid('parcours_id').notNull().references(() => parcoursReeducation.id, { onDelete: 'cascade' }),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Informations séance
  numeroSeance: integer('numero_seance').notNull(), // 1, 2, 3, 4, 5
  date: date('date'),
  status: text('status').notNull().default('planifiee'), // 'planifiee', 'realisee', 'annulee'

  // Consultation 1 - Bilan initial
  // Interrogatoire
  atcdMedicaux: text('atcd_medicaux'),
  atcdChirurgicaux: text('atcd_chirurgicaux'),
  facteursRisque: jsonb('facteurs_risque').$type<string[]>(),
  symptomes: text('symptomes'),

  // Testing périnéal
  testingScore: integer('testing_score'), // Score 0-5
  testingNotes: text('testing_notes'),

  // Examen clinique
  examenClinique: text('examen_clinique'),

  // Objectifs
  objectifs: text('objectifs'),

  // Consultations 2-5 - Séances d'exercices
  // Exercices périnéaux
  exercicesPerineaux: jsonb('exercices_perineaux').$type<{
    nom: string
    series?: number
    repetitions?: number
    duree?: string
    notes?: string
  }[]>(),

  // Exercices abdominaux
  exercicesAbdominaux: jsonb('exercices_abdominaux').$type<{
    nom: string
    series?: number
    repetitions?: number
    duree?: string
    notes?: string
  }[]>(),

  // Testing de contrôle (évolution)
  testingControle: integer('testing_controle'), // Score lors des séances suivantes

  // Notes de séance
  notesSeance: text('notes_seance'),

  // Commentaire pour la prochaine séance
  commentairePourProchaine: text('commentaire_pour_prochaine'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Frottis
export const frottis = pgTable('frottis', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  dateRealisation: date('date_realisation').notNull(),
  dateResultat: date('date_resultat'),
  resultat: frottisResultatEnum('resultat').default('en_attente'),
  notes: text('notes'),

  // Rappel automatique (3 ans après un frottis normal)
  dateProchainFrottis: date('date_prochain_frottis'),
  rappelEnvoye: boolean('rappel_envoye').default(false),

  // Suivi du résultat
  patientePrevenu: boolean('patiente_prevenu').default(false),
  resultatRecupere: boolean('resultat_recupere').default(false),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Contraceptifs (stérilets/implants)
export const contraceptifs = pgTable('contraceptifs', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  type: contraceptifTypeEnum('type').notNull(),
  datePose: date('date_pose').notNull(),
  dateExpiration: date('date_expiration').notNull(),

  // Informations du dispositif
  numeroLot: text('numero_lot'),
  marque: text('marque'),
  modele: text('modele'),

  // Rappel automatique (2 semaines avant expiration)
  rappelEnvoye: boolean('rappel_envoye').default(false),
  dateRappel: date('date_rappel'), // Calculé automatiquement: dateExpiration - 14 jours

  // Retrait
  dateRetrait: date('date_retrait'),
  raisonRetrait: text('raison_retrait'),

  notes: text('notes'),
  actif: boolean('actif').default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Résultats à récupérer
export const resultatsARecuperer = pgTable('resultats_a_recuperer', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  typeExamen: text('type_examen').notNull(), // "Biologie", "Échographie", "Anatomopathologie", etc.
  description: text('description').notNull(),
  categorie: text('categorie').default('gyneco').notNull(), // "obstetrique" ou "gyneco"
  dateExamen: date('date_examen'),
  laboratoire: text('laboratoire'),

  statut: resultatStatutEnum('statut').default('en_attente'),
  dateRecuperation: date('date_recuperation'),
  notes: text('notes'),
  fichierUrl: text('fichier_url'),
  fichierNom: text('fichier_nom'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Traitements habituels du patient
export const traitementsHabituels = pgTable('traitements_habituels', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Informations médicament
  nom: text('nom').notNull(), // Nom commercial
  dci: text('dci'), // Dénomination Commune Internationale
  dosage: text('dosage'), // ex: "500mg", "1g"
  forme: text('forme'), // ex: "comprimé", "gélule", "sirop"

  // Posologie
  posologie: text('posologie').notNull(), // ex: "1 comprimé matin et soir"
  voieAdministration: text('voie_administration'), // ex: "orale", "injectable", "cutanée"

  // Durée et renouvellement
  dateDebut: date('date_debut'),
  dateFin: date('date_fin'), // Si traitement limité dans le temps
  renouvellementAuto: boolean('renouvellement_auto').default(false), // Pour traitement chronique

  // Classification
  categorie: text('categorie'), // ex: "Antihypertenseur", "Antidiabétique", "Supplémentation"
  indication: text('indication'), // Raison de la prescription

  // Statut
  isActive: boolean('is_active').default(true).notNull(),
  isChronique: boolean('is_chronique').default(false), // Traitement de fond vs ponctuel

  // Notes
  notes: text('notes'), // Instructions particulières, effets secondaires observés
  prescripteur: text('prescripteur'), // Nom du praticien qui a initialement prescrit

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('traitements_habituels_patient_id_idx').on(table.patientId),
  isActiveIdx: index('traitements_habituels_is_active_idx').on(table.isActive),
}))

// Résultats de laboratoire avec PDF et extraction automatique
export const resultatsLaboratoire = pgTable('resultats_laboratoire', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  grossesseId: uuid('grossesse_id').references(() => grossesses.id, { onDelete: 'set null' }),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Métadonnées fichier
  fichierUrl: text('fichier_url').notNull(),
  fichierName: text('fichier_name').notNull(),
  fichierSize: integer('fichier_size'),
  mimeType: text('mime_type').default('application/pdf'),

  // Métadonnées examen
  dateExamen: date('date_examen').notNull(),
  laboratoire: text('laboratoire'),
  prescripteur: text('prescripteur'),

  // Données extraites structurées par catégorie
  donneesExtraites: jsonb('donnees_extraites').$type<{
    hematologie?: Array<{
      nom: string
      valeur: string
      unite?: string
      reference?: string
      statut: 'normal' | 'anormal' | 'critique'
    }>
    biochimie?: Array<{
      nom: string
      valeur: string
      unite?: string
      reference?: string
      statut: 'normal' | 'anormal' | 'critique'
    }>
    serologies?: Array<{
      nom: string
      valeur: string
      unite?: string
      reference?: string
      statut: 'normal' | 'anormal' | 'critique'
    }>
    hormones?: Array<{
      nom: string
      valeur: string
      unite?: string
      reference?: string
      statut: 'normal' | 'anormal' | 'critique'
    }>
    autres?: Array<{
      nom: string
      valeur: string
      unite?: string
      reference?: string
      statut: 'normal' | 'anormal' | 'critique'
    }>
  }>(),

  // Statut de traitement
  isProcessed: boolean('is_processed').default(false).notNull(),
  processingError: text('processing_error'),

  // Notes et validation
  notes: text('notes'),
  isValidated: boolean('is_validated').default(false).notNull(),

  // Surlignages personnalisés (catégorie + index du test + couleur)
  highlights: jsonb('highlights').$type<Array<{
    category: string // hematologie, biochimie, etc.
    testIndex: number // index du test dans la catégorie
    color: string // couleur hex comme #FFFF00
  }>>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index('resultats_laboratoire_patient_id_idx').on(table.patientId),
  dateExamenIdx: index('resultats_laboratoire_date_examen_idx').on(table.dateExamen),
  isProcessedIdx: index('resultats_laboratoire_is_processed_idx').on(table.isProcessed),
}))

export const sharedAccess = pgTable('shared_access', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Propriétaire du partage
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Type et ressources partagées (relation polymorphique)
  shareType: shareTypeEnum('share_type').notNull(),
  patientId: uuid('patient_id').references(() => patients.id, { onDelete: 'cascade' }),
  grossesseId: uuid('grossesse_id').references(() => grossesses.id, { onDelete: 'cascade' }),
  documentIds: jsonb('document_ids').$type<string[]>(),

  // Sécurité d'accès
  shareToken: text('share_token').notNull().unique(),        // Token long (32 bytes, 43 chars)
  accessCodeHash: text('access_code_hash').notNull(),        // Hash bcrypt du PIN 6 chiffres

  // Permissions
  permissions: jsonb('permissions').notNull().$type<{
    read: boolean
    write: boolean
    download: boolean
  }>(),

  // Informations destinataire (optionnel)
  recipientName: text('recipient_name'),
  recipientEmail: text('recipient_email'),
  recipientNote: text('recipient_note'),           // Note interne

  // Gestion du cycle de vie
  isActive: boolean('is_active').default(true).notNull(),
  revokedAt: timestamp('revoked_at'),
  revokedBy: uuid('revoked_by').references(() => users.id),
  revocationReason: text('revocation_reason'),

  // Contraintes de sécurité
  expiresAt: timestamp('expires_at'),                       // NULL = permanent
  maxAccessCount: integer('max_access_count'),              // NULL = illimité
  currentAccessCount: integer('current_access_count').default(0).notNull(),

  // Protection anti brute-force
  lastAccessAt: timestamp('last_access_at'),
  failedAttemptsCount: integer('failed_attempts_count').default(0).notNull(),
  lockedUntil: timestamp('locked_until'),                   // Verrouillage temporaire

  // Métadonnées
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tokenIdx: index('shared_access_token_idx').on(table.shareToken),
  userIdIdx: index('shared_access_user_id_idx').on(table.userId),
  patientIdIdx: index('shared_access_patient_id_idx').on(table.patientId),
  isActiveIdx: index('shared_access_is_active_idx').on(table.isActive),
}))

export const sharedAccessLogs = pgTable('shared_access_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  sharedAccessId: uuid('shared_access_id').notNull().references(() => sharedAccess.id, { onDelete: 'cascade' }),

  action: shareActionEnum('action').notNull(),

  // Ressource accédée/modifiée
  resourceType: text('resource_type'),              // 'patient', 'consultation', 'document'
  resourceId: text('resource_id'),

  // Suivi des modifications (pour write)
  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),

  // Contexte de la requête
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  sharedAccessIdIdx: index('shared_access_logs_shared_access_id_idx').on(table.sharedAccessId),
  actionIdx: index('shared_access_logs_action_idx').on(table.action),
  createdAtIdx: index('shared_access_logs_created_at_idx').on(table.createdAt),
}))

// Tables d'apprentissage de la pratique
export const practicePatterns = pgTable('practice_patterns', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Type d'action pratiquée
  actionType: practiceActionTypeEnum('action_type').notNull(),

  // Contexte anonymisé (sans données d'identification patient)
  context: jsonb('context').notNull().$type<{
    consultationType?: string    // Type de consultation
    sa?: number                  // Semaines d'aménorrhée (si applicable)
    motif?: string              // Motif anonymisé
    ageGroupe?: string          // Tranche d'âge patient (ex: "20-30", "30-40")
    parite?: number             // Parité
    antecedents?: string[]      // Liste antécédents génériques
    trimestre?: number          // Si grossesse
  }>(),

  // Données de l'action (anonymisées)
  actionData: jsonb('action_data').notNull().$type<{
    prescription?: {
      medicament?: string
      dosage?: string
      duree?: string
    }
    examen?: {
      type?: string
      libelle?: string
    }
    conseil?: string
    autre?: any
  }>(),

  // Statistiques d'utilisation
  frequency: integer('frequency').default(1).notNull(),
  lastUsed: timestamp('last_used').defaultNow().notNull(),

  // Pattern associés (co-occurrences)
  associatedActions: jsonb('associated_actions').$type<Array<{
    actionType: string
    actionData: any
    cooccurrenceRate: number
  }>>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('practice_patterns_user_id_idx').on(table.userId),
  actionTypeIdx: index('practice_patterns_action_type_idx').on(table.actionType),
  frequencyIdx: index('practice_patterns_frequency_idx').on(table.frequency),
  lastUsedIdx: index('practice_patterns_last_used_idx').on(table.lastUsed),
}))

export const smartSuggestions = pgTable('smart_suggestions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  patternId: uuid('pattern_id').references(() => practicePatterns.id, { onDelete: 'cascade' }),

  // Type de suggestion
  suggestionType: text('suggestion_type').notNull(), // 'prescription', 'examen', 'conseil', 'template'

  // Contexte déclencheur de la suggestion
  triggerContext: jsonb('trigger_context').notNull().$type<{
    consultationType?: string
    sa?: number
    motif?: string
    patientProfile?: any
  }>(),

  // Contenu de la suggestion
  suggestedAction: jsonb('suggested_action').notNull().$type<{
    type: string
    data: any
    confidence: number    // Score de confiance (0-1)
    explanation?: string  // Explication pour l'utilisateur
  }>(),

  // Métriques d'acceptation
  timesShown: integer('times_shown').default(0).notNull(),
  timesAccepted: integer('times_accepted').default(0).notNull(),
  timesRejected: integer('times_rejected').default(0).notNull(),
  acceptanceRate: decimal('acceptance_rate', { precision: 5, scale: 2 }).default('0'),

  // Gestion
  isActive: boolean('is_active').default(true).notNull(),
  lastShownAt: timestamp('last_shown_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('smart_suggestions_user_id_idx').on(table.userId),
  patternIdIdx: index('smart_suggestions_pattern_id_idx').on(table.patternId),
  suggestionTypeIdx: index('smart_suggestions_suggestion_type_idx').on(table.suggestionType),
  acceptanceRateIdx: index('smart_suggestions_acceptance_rate_idx').on(table.acceptanceRate),
  isActiveIdx: index('smart_suggestions_is_active_idx').on(table.isActive),
}))

export const practiceLearningEvents = pgTable('practice_learning_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  suggestionId: uuid('suggestion_id').references(() => smartSuggestions.id, { onDelete: 'set null' }),

  // Événement
  eventType: text('event_type').notNull(), // 'suggestion_shown', 'suggestion_accepted', 'suggestion_rejected', 'pattern_detected'

  // Contexte de l'événement (anonymisé)
  context: jsonb('context').$type<{
    consultationType?: string
    sa?: number
    actionType?: string
  }>(),

  // Métadonnées
  metadata: jsonb('metadata').$type<{
    confidence?: number
    alternativeActions?: any[]
    userFeedback?: string
  }>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('practice_learning_events_user_id_idx').on(table.userId),
  suggestionIdIdx: index('practice_learning_events_suggestion_id_idx').on(table.suggestionId),
  eventTypeIdx: index('practice_learning_events_event_type_idx').on(table.eventType),
  createdAtIdx: index('practice_learning_events_created_at_idx').on(table.createdAt),
}))

// Relations
export const parcoursReeducationRelations = relations(parcoursReeducation, ({ one, many }) => ({
  patient: one(patients, {
    fields: [parcoursReeducation.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [parcoursReeducation.userId],
    references: [users.id],
  }),
  seances: many(seancesReeducation),
}))

export const seancesReeducationRelations = relations(seancesReeducation, ({ one }) => ({
  parcours: one(parcoursReeducation, {
    fields: [seancesReeducation.parcoursId],
    references: [parcoursReeducation.id],
  }),
  patient: one(patients, {
    fields: [seancesReeducation.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [seancesReeducation.userId],
    references: [users.id],
  }),
}))

export const frottisRelations = relations(frottis, ({ one }) => ({
  patient: one(patients, {
    fields: [frottis.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [frottis.userId],
    references: [users.id],
  }),
}))

export const contraceptifsRelations = relations(contraceptifs, ({ one }) => ({
  patient: one(patients, {
    fields: [contraceptifs.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [contraceptifs.userId],
    references: [users.id],
  }),
}))

export const resultatsARecupererRelations = relations(resultatsARecuperer, ({ one }) => ({
  patient: one(patients, {
    fields: [resultatsARecuperer.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [resultatsARecuperer.userId],
    references: [users.id],
  }),
}))

export const traitementsHabituelsRelations = relations(traitementsHabituels, ({ one }) => ({
  patient: one(patients, {
    fields: [traitementsHabituels.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [traitementsHabituels.userId],
    references: [users.id],
  }),
}))

export const resultatsLaboratoireRelations = relations(resultatsLaboratoire, ({ one }) => ({
  patient: one(patients, {
    fields: [resultatsLaboratoire.patientId],
    references: [patients.id],
  }),
  grossesse: one(grossesses, {
    fields: [resultatsLaboratoire.grossesseId],
    references: [grossesses.id],
  }),
  user: one(users, {
    fields: [resultatsLaboratoire.userId],
    references: [users.id],
  }),
}))

export const sharedAccessRelations = relations(sharedAccess, ({ one, many }) => ({
  user: one(users, {
    fields: [sharedAccess.userId],
    references: [users.id],
  }),
  patient: one(patients, {
    fields: [sharedAccess.patientId],
    references: [patients.id],
  }),
  grossesse: one(grossesses, {
    fields: [sharedAccess.grossesseId],
    references: [grossesses.id],
  }),
  revokedByUser: one(users, {
    fields: [sharedAccess.revokedBy],
    references: [users.id],
  }),
  logs: many(sharedAccessLogs),
}))

export const sharedAccessLogsRelations = relations(sharedAccessLogs, ({ one }) => ({
  sharedAccess: one(sharedAccess, {
    fields: [sharedAccessLogs.sharedAccessId],
    references: [sharedAccess.id],
  }),
}))

export const practicePatternsRelations = relations(practicePatterns, ({ one, many }) => ({
  user: one(users, {
    fields: [practicePatterns.userId],
    references: [users.id],
  }),
  suggestions: many(smartSuggestions),
}))

export const smartSuggestionsRelations = relations(smartSuggestions, ({ one, many }) => ({
  user: one(users, {
    fields: [smartSuggestions.userId],
    references: [users.id],
  }),
  pattern: one(practicePatterns, {
    fields: [smartSuggestions.patternId],
    references: [practicePatterns.id],
  }),
  events: many(practiceLearningEvents),
}))

export const practiceLearningEventsRelations = relations(practiceLearningEvents, ({ one }) => ({
  user: one(users, {
    fields: [practiceLearningEvents.userId],
    references: [users.id],
  }),
  suggestion: one(smartSuggestions, {
    fields: [practiceLearningEvents.suggestionId],
    references: [smartSuggestions.id],
  }),
}))

// Ressources médicales
export const ressourcesMedicales = pgTable('ressources_medicales', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  titre: text('titre').notNull(),
  description: text('description'),
  categorie: text('categorie').notNull(), // protocoles, references, scores, urgences, medicaments, autres
  type: text('type').notNull(), // lien, fichier, calculateur, memo
  url: text('url'),
  contenu: text('contenu'),
  tags: jsonb('tags').$type<string[]>().default([]),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('ressources_medicales_user_id_idx').on(table.userId),
  categorieIdx: index('ressources_medicales_categorie_idx').on(table.categorie),
}))

// Numéros utiles (urgences, collègues, laboratoires, etc.)
export const numerosUtiles = pgTable('numeros_utiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  nom: text('nom').notNull(), // Nom du contact ou service
  description: text('description'), // Description optionnelle
  categorie: text('categorie').notNull(), // urgences, collegues, laboratoires, maternites, pharmacies, autres
  telephone: text('telephone'), // Numéro de téléphone
  email: text('email'), // Email optionnel
  adresse: text('adresse'), // Adresse optionnelle
  notes: text('notes'), // Notes supplémentaires
  favori: boolean('favori').default(false), // Marquer comme favori
  ordre: integer('ordre').default(0), // Ordre d'affichage personnalisé

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('numeros_utiles_user_id_idx').on(table.userId),
  categorieIdx: index('numeros_utiles_categorie_idx').on(table.categorie),
  favoriIdx: index('numeros_utiles_favori_idx').on(table.favori),
}))

// Types exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Patient = typeof patients.$inferSelect
export type NewPatient = typeof patients.$inferInsert
export type Grossesse = typeof grossesses.$inferSelect
export type NewGrossesse = typeof grossesses.$inferInsert
export type Consultation = typeof consultations.$inferSelect
export type NewConsultation = typeof consultations.$inferInsert
export type Appointment = typeof appointments.$inferSelect
export type Invoice = typeof invoices.$inferSelect
export type Document = typeof documents.$inferSelect
export type AuditLog = typeof auditLogs.$inferSelect
export type Protocol = typeof protocols.$inferSelect
export type NewProtocol = typeof protocols.$inferInsert
export type ProtocolChunk = typeof protocolChunks.$inferSelect
export type AiConversation = typeof aiConversations.$inferSelect
export type OrdonnanceTemplate = typeof ordonnanceTemplates.$inferSelect
export type NewOrdonnanceTemplate = typeof ordonnanceTemplates.$inferInsert
export type CalendarIntegration = typeof calendarIntegrations.$inferSelect
export type NewCalendarIntegration = typeof calendarIntegrations.$inferInsert
export type ParcoursReeducation = typeof parcoursReeducation.$inferSelect
export type NewParcoursReeducation = typeof parcoursReeducation.$inferInsert
export type SeanceReeducation = typeof seancesReeducation.$inferSelect
export type NewSeanceReeducation = typeof seancesReeducation.$inferInsert
export type Frottis = typeof frottis.$inferSelect
export type NewFrottis = typeof frottis.$inferInsert
export type Contraceptif = typeof contraceptifs.$inferSelect
export type NewContraceptif = typeof contraceptifs.$inferInsert
export type ResultatARecuperer = typeof resultatsARecuperer.$inferSelect
export type NewResultatARecuperer = typeof resultatsARecuperer.$inferInsert
export type TraitementHabituel = typeof traitementsHabituels.$inferSelect
export type NewTraitementHabituel = typeof traitementsHabituels.$inferInsert
export type ResultatLaboratoire = typeof resultatsLaboratoire.$inferSelect
export type NewResultatLaboratoire = typeof resultatsLaboratoire.$inferInsert
export type SharedAccess = typeof sharedAccess.$inferSelect
export type NewSharedAccess = typeof sharedAccess.$inferInsert
export type SharedAccessLog = typeof sharedAccessLogs.$inferSelect
export type NewSharedAccessLog = typeof sharedAccessLogs.$inferInsert
export type PracticePattern = typeof practicePatterns.$inferSelect
export type NewPracticePattern = typeof practicePatterns.$inferInsert
export type SmartSuggestion = typeof smartSuggestions.$inferSelect
export type NewSmartSuggestion = typeof smartSuggestions.$inferInsert
export type PracticeLearningEvent = typeof practiceLearningEvents.$inferSelect
export type NewPracticeLearningEvent = typeof practiceLearningEvents.$inferInsert
export type NumeroUtile = typeof numerosUtiles.$inferSelect
export type NewNumeroUtile = typeof numerosUtiles.$inferInsert
