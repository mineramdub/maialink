CREATE TABLE "traitements_habituels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"nom" text NOT NULL,
	"dci" text,
	"dosage" text,
	"forme" text,
	"posologie" text NOT NULL,
	"voie_administration" text,
	"date_debut" date,
	"date_fin" date,
	"renouvellement_auto" boolean DEFAULT false,
	"categorie" text,
	"indication" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_chronique" boolean DEFAULT false,
	"notes" text,
	"prescripteur" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "traitements_habituels" ADD CONSTRAINT "traitements_habituels_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traitements_habituels" ADD CONSTRAINT "traitements_habituels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "traitements_habituels_patient_id_idx" ON "traitements_habituels" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "traitements_habituels_is_active_idx" ON "traitements_habituels" USING btree ("is_active");