CREATE TYPE "public"."contraceptif_type" AS ENUM('sterilet_cuivre', 'sterilet_hormonal', 'implant');--> statement-breakpoint
CREATE TYPE "public"."frottis_resultat" AS ENUM('normal', 'ascus', 'lsil', 'hsil', 'agc', 'carcinome', 'autre', 'en_attente');--> statement-breakpoint
CREATE TYPE "public"."resultat_statut" AS ENUM('en_attente', 'recupere', 'transmis');--> statement-breakpoint
CREATE TABLE "consultation_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"template_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "consultation_type" NOT NULL,
	"sa_min" integer,
	"sa_max" integer,
	"data" jsonb NOT NULL,
	"is_custom" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contraceptifs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "contraceptif_type" NOT NULL,
	"date_pose" date NOT NULL,
	"date_expiration" date NOT NULL,
	"numero_lot" text,
	"marque" text,
	"modele" text,
	"rappel_envoye" boolean DEFAULT false,
	"date_rappel" date,
	"date_retrait" date,
	"raison_retrait" text,
	"notes" text,
	"actif" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "frottis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"date_realisation" date NOT NULL,
	"date_resultat" date,
	"resultat" "frottis_resultat" DEFAULT 'en_attente',
	"notes" text,
	"date_prochain_frottis" date,
	"rappel_envoye" boolean DEFAULT false,
	"patiente_prevenu" boolean DEFAULT false,
	"resultat_recupere" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resultats_a_recuperer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type_examen" text NOT NULL,
	"description" text NOT NULL,
	"date_examen" date,
	"laboratoire" text,
	"statut" "resultat_statut" DEFAULT 'en_attente',
	"date_recuperation" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "template_id" text;--> statement-breakpoint
ALTER TABLE "consultation_templates" ADD CONSTRAINT "consultation_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contraceptifs" ADD CONSTRAINT "contraceptifs_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contraceptifs" ADD CONSTRAINT "contraceptifs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frottis" ADD CONSTRAINT "frottis_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frottis" ADD CONSTRAINT "frottis_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resultats_a_recuperer" ADD CONSTRAINT "resultats_a_recuperer_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resultats_a_recuperer" ADD CONSTRAINT "resultats_a_recuperer_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "consultation_templates_user_id_idx" ON "consultation_templates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "consultation_templates_template_id_idx" ON "consultation_templates" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "consultation_templates_type_idx" ON "consultation_templates" USING btree ("type");