CREATE TYPE "public"."alert_severity" AS ENUM('info', 'warning', 'critical');--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('planifie', 'confirme', 'en_cours', 'termine', 'annule', 'absent');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('create', 'read', 'update', 'delete', 'login', 'logout', 'export');--> statement-breakpoint
CREATE TYPE "public"."consultation_type" AS ENUM('prenatale', 'postnatale', 'gyneco', 'reeducation', 'preparation', 'monitoring', 'autre');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('ordonnance', 'certificat', 'courrier', 'declaration_grossesse', 'compte_rendu', 'autre');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('brouillon', 'envoyee', 'payee', 'impayee', 'annulee');--> statement-breakpoint
CREATE TYPE "public"."patient_status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('especes', 'cheque', 'carte', 'virement', 'tiers_payant');--> statement-breakpoint
CREATE TYPE "public"."pregnancy_status" AS ENUM('en_cours', 'terminee', 'fausse_couche', 'ivg', 'img');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'sage_femme', 'secretaire');--> statement-breakpoint
CREATE TABLE "alertes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"grossesse_id" uuid,
	"consultation_id" uuid,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"severity" "alert_severity" DEFAULT 'info',
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"is_dismissed" boolean DEFAULT false,
	"dismissed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" "consultation_type" NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" "appointment_status" DEFAULT 'planifie',
	"location" text,
	"is_home_visit" boolean DEFAULT false,
	"doctolib_id" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" "audit_action" NOT NULL,
	"table_name" text,
	"record_id" text,
	"old_data" jsonb,
	"new_data" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bebes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grossesse_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"prenom" text,
	"sexe" text,
	"date_naissance" date,
	"heure_naissance" text,
	"poids" integer,
	"taille" integer,
	"perimetre_cranien" integer,
	"apgar_1" integer,
	"apgar_5" integer,
	"apgar_10" integer,
	"allaitement" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consultations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"grossesse_id" uuid,
	"type" "consultation_type" NOT NULL,
	"date" timestamp NOT NULL,
	"duree" integer,
	"poids" numeric(5, 2),
	"taille" integer,
	"tension_systolique" integer,
	"tension_diastolique" integer,
	"pouls" integer,
	"temperature" numeric(3, 1),
	"sa_term" integer,
	"sa_jours" integer,
	"hauteur_uterine" integer,
	"bdc" integer,
	"mouvements_foetaux" boolean,
	"presentation_foetale" text,
	"motif" text,
	"examen_clinique" text,
	"conclusion" text,
	"prescriptions" text,
	"proteine_urinaire" text,
	"glucose_urinaire" text,
	"leucocytes_urinaires" text,
	"nitrites_urinaires" text,
	"alertes" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cotations_ngap" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"libelle" text NOT NULL,
	"coefficient" numeric(4, 2) NOT NULL,
	"lettre_cle" text NOT NULL,
	"tarif_base" numeric(10, 2) NOT NULL,
	"categorie" text,
	"actif" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cotations_ngap_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "document_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" "document_type" NOT NULL,
	"nom" text NOT NULL,
	"contenu" text NOT NULL,
	"variables" jsonb,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"consultation_id" uuid,
	"type" "document_type" NOT NULL,
	"titre" text NOT NULL,
	"contenu" text,
	"fichier_url" text,
	"signe" boolean DEFAULT false,
	"date_signe" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "examens_prenataux" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grossesse_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"nom" text NOT NULL,
	"sa_prevue" integer,
	"date_recommandee" date,
	"date_realisee" date,
	"resultat" text,
	"fichier_url" text,
	"normal" boolean,
	"alertes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grossesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"ddr" date NOT NULL,
	"dpa" date NOT NULL,
	"date_conception" date,
	"status" "pregnancy_status" DEFAULT 'en_cours',
	"grossesse_multiple" boolean DEFAULT false,
	"nombre_foetus" integer DEFAULT 1,
	"gestite" integer DEFAULT 1,
	"parite" integer DEFAULT 0,
	"date_accouchement" date,
	"terme_semaines" integer,
	"terme_jours" integer,
	"mode_accouchement" text,
	"lieu_accouchement" text,
	"facteurs_risque" jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" text NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"consultation_id" uuid,
	"date" date NOT NULL,
	"date_echeance" date,
	"montant_ht" numeric(10, 2) NOT NULL,
	"montant_ttc" numeric(10, 2) NOT NULL,
	"montant_paye" numeric(10, 2) DEFAULT '0',
	"cotations" jsonb,
	"status" "invoice_status" DEFAULT 'brouillon',
	"payment_method" "payment_method",
	"date_paiement" date,
	"tiers_part" numeric(10, 2),
	"patient_part" numeric(10, 2),
	"telettransmise" boolean DEFAULT false,
	"date_teletransmission" timestamp,
	"retour_noemie" jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_numero_unique" UNIQUE("numero")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"maiden_name" text,
	"birth_date" date NOT NULL,
	"birth_place" text,
	"social_security_number" text,
	"email" text,
	"phone" text,
	"mobile_phone" text,
	"address" text,
	"postal_code" text,
	"city" text,
	"blood_type" text,
	"rhesus" text,
	"allergies" text,
	"antecedents_medicaux" jsonb,
	"antecedents_chirurgicaux" jsonb,
	"antecedents_familiaux" jsonb,
	"traitement_en_cours" text,
	"gravida" integer DEFAULT 0,
	"para" integer DEFAULT 0,
	"mutuelle" text,
	"numero_mutuelle" text,
	"medecin_traitant" text,
	"personne_confiance" text,
	"telephone_confiance" text,
	"consentement_rgpd" boolean DEFAULT false,
	"date_consentement" timestamp,
	"status" "patient_status" DEFAULT 'active',
	"notes" text,
	"notes_next_consultation" text,
	"doctolib_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reeducation_seances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"numero_seance" integer NOT NULL,
	"date" timestamp NOT NULL,
	"testing_perineal" integer,
	"testing_abdominaux" integer,
	"exercices_realises" jsonb,
	"biofeedback" boolean,
	"electrostimulation" boolean,
	"observations" text,
	"evolution" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "suivi_gyneco" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"motif" text,
	"date_dernieres_regles" date,
	"duree_regles" integer,
	"duree_cycle" integer,
	"regularite" text,
	"contraception_actuelle" text,
	"date_debut_contraception" date,
	"date_dernier_frottis" date,
	"resultat_frottis" text,
	"hpv" text,
	"examen_seins" text,
	"examen_gynecologique" text,
	"prescriptions" text,
	"observations" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suivi_post_partum" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"grossesse_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"jours_post_partum" integer,
	"etat_general" text,
	"involution_uterine" text,
	"lochies" text,
	"cicatrisation" text,
	"seins" text,
	"allaitement" text,
	"difficultes_allaitement" text,
	"baby_blues" boolean,
	"depression_post_partum" boolean,
	"score_epds" integer,
	"prise_poids_bebe" integer,
	"cordon_ombilical" text,
	"ictere" boolean,
	"observations" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"role" "user_role" DEFAULT 'sage_femme' NOT NULL,
	"rpps" text,
	"adeli" text,
	"phone" text,
	"two_factor_secret" text,
	"two_factor_enabled" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "alertes" ADD CONSTRAINT "alertes_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alertes" ADD CONSTRAINT "alertes_grossesse_id_grossesses_id_fk" FOREIGN KEY ("grossesse_id") REFERENCES "public"."grossesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alertes" ADD CONSTRAINT "alertes_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alertes" ADD CONSTRAINT "alertes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bebes" ADD CONSTRAINT "bebes_grossesse_id_grossesses_id_fk" FOREIGN KEY ("grossesse_id") REFERENCES "public"."grossesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bebes" ADD CONSTRAINT "bebes_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_grossesse_id_grossesses_id_fk" FOREIGN KEY ("grossesse_id") REFERENCES "public"."grossesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_templates" ADD CONSTRAINT "document_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examens_prenataux" ADD CONSTRAINT "examens_prenataux_grossesse_id_grossesses_id_fk" FOREIGN KEY ("grossesse_id") REFERENCES "public"."grossesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examens_prenataux" ADD CONSTRAINT "examens_prenataux_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grossesses" ADD CONSTRAINT "grossesses_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grossesses" ADD CONSTRAINT "grossesses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reeducation_seances" ADD CONSTRAINT "reeducation_seances_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reeducation_seances" ADD CONSTRAINT "reeducation_seances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suivi_gyneco" ADD CONSTRAINT "suivi_gyneco_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suivi_gyneco" ADD CONSTRAINT "suivi_gyneco_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suivi_post_partum" ADD CONSTRAINT "suivi_post_partum_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suivi_post_partum" ADD CONSTRAINT "suivi_post_partum_grossesse_id_grossesses_id_fk" FOREIGN KEY ("grossesse_id") REFERENCES "public"."grossesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suivi_post_partum" ADD CONSTRAINT "suivi_post_partum_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;