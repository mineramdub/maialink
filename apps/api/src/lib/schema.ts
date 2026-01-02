import { pgTable, text, timestamp, integer, boolean, decimal, date, jsonb, uuid, pgEnum, vector } from 'drizzle-orm/pg-core'
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
export const consultationTypeEnum = pgEnum('consultation_type', ['prenatale', 'postnatale', 'gyneco', 'reeducation', 'preparation', 'monitoring', 'autre'])
export const alertSeverityEnum = pgEnum('alert_severity', ['info', 'warning', 'critical'])
export const auditActionEnum = pgEnum('audit_action', ['create', 'read', 'update', 'delete', 'login', 'logout', 'export'])

// Tables
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

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

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
})

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

  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

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
})

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
})

export const consultations = pgTable('consultations', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  grossesseId: uuid('grossesse_id').references(() => grossesses.id),

  type: consultationTypeEnum('type').notNull(),
  date: timestamp('date').notNull(),
  duree: integer('duree'), // en minutes

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
  examenClinique: text('examen_clinique'),
  conclusion: text('conclusion'),
  prescriptions: text('prescriptions'),

  // Bandelette urinaire
  proteineUrinaire: text('proteine_urinaire'),
  glucoseUrinaire: text('glucose_urinaire'),
  leucocytesUrinaires: text('leucocytes_urinaires'),
  nitritesUrinaires: text('nitrites_urinaires'),

  alertes: jsonb('alertes').$type<{ type: string; message: string; severity: string }[]>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

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
})

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
})

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
})

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
})

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
})

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

  doctolibId: text('doctolib_id'),

  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

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
})

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
})

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
})

// Protocoles PDF avec IA
export const protocols = pgTable('protocols', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),

  nom: text('nom').notNull(),
  description: text('description'),
  category: protocolCategoryEnum('category').notNull().default('autre'),

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
})

export const protocolChunks = pgTable('protocol_chunks', {
  id: uuid('id').defaultRandom().primaryKey(),
  protocolId: uuid('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),

  content: text('content').notNull(),
  chunkIndex: integer('chunk_index').notNull(),
  pageNumber: integer('page_number'),

  // Embedding vectoriel pour la recherche sémantique (768 dimensions pour Gemini)
  embedding: vector('embedding', { dimensions: 768 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Historique des conversations avec l'IA
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),

  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sourcesUsed: jsonb('sources_used').$type<{ protocolId: string; protocolName: string; chunkIds: string[] }[]>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  patients: many(patients),
  consultations: many(consultations),
  sessions: many(sessions),
  auditLogs: many(auditLogs),
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
