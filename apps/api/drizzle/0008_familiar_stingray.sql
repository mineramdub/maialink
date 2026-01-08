CREATE TABLE "parcours_reeducation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"date_debut" date NOT NULL,
	"date_fin" date,
	"status" text DEFAULT 'en_cours' NOT NULL,
	"motif" text NOT NULL,
	"nombre_seances_prevues" integer DEFAULT 5,
	"nombre_seances_realisees" integer DEFAULT 0,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seances_reeducation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parcours_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"numero_seance" integer NOT NULL,
	"date" date,
	"status" text DEFAULT 'planifiee' NOT NULL,
	"atcd_medicaux" text,
	"atcd_chirurgicaux" text,
	"facteurs_risque" jsonb,
	"symptomes" text,
	"testing_score" integer,
	"testing_notes" text,
	"examen_clinique" text,
	"objectifs" text,
	"exercices_perineaux" jsonb,
	"exercices_abdominaux" jsonb,
	"testing_controle" integer,
	"notes_seance" text,
	"commentaire_pour_prochaine" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "parcours_reeducation" ADD CONSTRAINT "parcours_reeducation_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parcours_reeducation" ADD CONSTRAINT "parcours_reeducation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seances_reeducation" ADD CONSTRAINT "seances_reeducation_parcours_id_parcours_reeducation_id_fk" FOREIGN KEY ("parcours_id") REFERENCES "public"."parcours_reeducation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seances_reeducation" ADD CONSTRAINT "seances_reeducation_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seances_reeducation" ADD CONSTRAINT "seances_reeducation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;