CREATE TYPE "public"."surveillance_niveau" AS ENUM('normal', 'vigilance', 'rapprochee');--> statement-breakpoint
CREATE TYPE "public"."surveillance_raison" AS ENUM('hta', 'diabete', 'rciu', 'macrosomie', 'map', 'antecedents', 'age_maternel', 'grossesse_multiple', 'autre');--> statement-breakpoint
CREATE TABLE "patients_surveillance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"grossesse_id" uuid,
	"user_id" uuid NOT NULL,
	"niveau" "surveillance_niveau" DEFAULT 'vigilance' NOT NULL,
	"raison" "surveillance_raison" NOT NULL,
	"raison_detail" text,
	"date_debut" timestamp DEFAULT now() NOT NULL,
	"date_fin" timestamp,
	"date_prochain_controle" timestamp NOT NULL,
	"frequence_controle" integer,
	"notes_surveillance" text,
	"parametres_suivre" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "patients_surveillance" ADD CONSTRAINT "patients_surveillance_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients_surveillance" ADD CONSTRAINT "patients_surveillance_grossesse_id_grossesses_id_fk" FOREIGN KEY ("grossesse_id") REFERENCES "public"."grossesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients_surveillance" ADD CONSTRAINT "patients_surveillance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "patients_surveillance_patient_id_idx" ON "patients_surveillance" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "patients_surveillance_user_id_idx" ON "patients_surveillance" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "patients_surveillance_niveau_idx" ON "patients_surveillance" USING btree ("niveau");--> statement-breakpoint
CREATE INDEX "patients_surveillance_date_prochain_controle_idx" ON "patients_surveillance" USING btree ("date_prochain_controle");--> statement-breakpoint
CREATE INDEX "patients_surveillance_is_active_idx" ON "patients_surveillance" USING btree ("is_active");