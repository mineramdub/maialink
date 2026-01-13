CREATE TABLE "mensurations_bebe" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bebe_id" uuid NOT NULL,
	"consultation_id" uuid,
	"date" timestamp DEFAULT now() NOT NULL,
	"age_jours" integer,
	"poids" integer,
	"taille" integer,
	"perimetre_cranien" integer,
	"percentile_poids" integer,
	"percentile_taille" integer,
	"percentile_pc" integer,
	"alertes" jsonb,
	"status_global" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "bebe_id" uuid;--> statement-breakpoint
ALTER TABLE "mensurations_bebe" ADD CONSTRAINT "mensurations_bebe_bebe_id_bebes_id_fk" FOREIGN KEY ("bebe_id") REFERENCES "public"."bebes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mensurations_bebe" ADD CONSTRAINT "mensurations_bebe_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mensurations_bebe_bebe_id_idx" ON "mensurations_bebe" USING btree ("bebe_id");--> statement-breakpoint
CREATE INDEX "mensurations_bebe_date_idx" ON "mensurations_bebe" USING btree ("date");--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_bebe_id_bebes_id_fk" FOREIGN KEY ("bebe_id") REFERENCES "public"."bebes"("id") ON DELETE no action ON UPDATE no action;