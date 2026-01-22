-- Création table resultats_labo
CREATE TABLE IF NOT EXISTS "resultats_labo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"nom" text NOT NULL,
	"date_analyse" date,
	"date_reception" date,
	"resultat_manuel" text,
	"fichier_url" text,
	"fichier_nom" text,
	"normal" boolean,
	"commentaire" text,
	"laboratoire" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Indexes pour resultats_labo
CREATE INDEX IF NOT EXISTS "idx_resultats_labo_patient" ON "resultats_labo" ("patient_id");
CREATE INDEX IF NOT EXISTS "idx_resultats_labo_date" ON "resultats_labo" ("date_analyse");

-- Foreign keys pour resultats_labo
ALTER TABLE "resultats_labo" ADD CONSTRAINT "resultats_labo_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "resultats_labo" ADD CONSTRAINT "resultats_labo_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;

-- Extension table patients - Champs gynécologiques
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "age_menarche" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "duree_cycle" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "duree_regles" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "regularite_cycle" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "dysmenorrhee" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "dyspareunie" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "leucorrhees" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "contraception_actuelle" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "date_dernier_frottis" date;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "date_derniere_mammographie" date;

-- Extension table patients - Champs obstétriques détaillés
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "dates_dernieres_regles" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "gestes_parite" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "accouchements" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "cesarienne" boolean DEFAULT false;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "nombre_cesariennes" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "fausses_couches" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "ivg" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "grossesse_extra_uterine" boolean DEFAULT false;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "mort_ne" boolean DEFAULT false;
