CREATE TABLE "resultats_laboratoire" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"grossesse_id" uuid,
	"user_id" uuid NOT NULL,
	"fichier_url" text NOT NULL,
	"fichier_name" text NOT NULL,
	"fichier_size" integer,
	"mime_type" text DEFAULT 'application/pdf',
	"date_examen" date NOT NULL,
	"laboratoire" text,
	"prescripteur" text,
	"donnees_extraites" jsonb,
	"is_processed" boolean DEFAULT false NOT NULL,
	"processing_error" text,
	"notes" text,
	"is_validated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resultats_laboratoire" ADD CONSTRAINT "resultats_laboratoire_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resultats_laboratoire" ADD CONSTRAINT "resultats_laboratoire_grossesse_id_grossesses_id_fk" FOREIGN KEY ("grossesse_id") REFERENCES "public"."grossesses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resultats_laboratoire" ADD CONSTRAINT "resultats_laboratoire_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "resultats_laboratoire_patient_id_idx" ON "resultats_laboratoire" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "resultats_laboratoire_date_examen_idx" ON "resultats_laboratoire" USING btree ("date_examen");--> statement-breakpoint
CREATE INDEX "resultats_laboratoire_is_processed_idx" ON "resultats_laboratoire" USING btree ("is_processed");