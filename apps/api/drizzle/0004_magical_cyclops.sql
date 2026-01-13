CREATE TYPE "public"."ordonnance_priorite" AS ENUM('urgent', 'recommande', 'optionnel');--> statement-breakpoint
CREATE TYPE "public"."ordonnance_type" AS ENUM('medicament', 'biologie', 'echographie', 'autre');--> statement-breakpoint
CREATE TABLE "ordonnance_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"nom" text NOT NULL,
	"categorie" text NOT NULL,
	"type" "ordonnance_type" NOT NULL,
	"priorite" "ordonnance_priorite" DEFAULT 'recommande' NOT NULL,
	"contenu" text NOT NULL,
	"description" text,
	"source" text,
	"version" text,
	"date_validite" date,
	"is_active" boolean DEFAULT true,
	"is_system_template" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ordonnance_templates" ADD CONSTRAINT "ordonnance_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ordonnance_templates_categorie_idx" ON "ordonnance_templates" USING btree ("categorie");--> statement-breakpoint
CREATE INDEX "ordonnance_templates_type_idx" ON "ordonnance_templates" USING btree ("type");--> statement-breakpoint
CREATE INDEX "ordonnance_templates_is_active_idx" ON "ordonnance_templates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "ordonnance_templates_user_id_idx" ON "ordonnance_templates" USING btree ("user_id");