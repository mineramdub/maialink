CREATE TABLE "ressources_medicales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"titre" text NOT NULL,
	"description" text,
	"categorie" text NOT NULL,
	"type" text NOT NULL,
	"url" text,
	"contenu" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ressources_medicales" ADD CONSTRAINT "ressources_medicales_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ressources_medicales_user_id_idx" ON "ressources_medicales" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ressources_medicales_categorie_idx" ON "ressources_medicales" USING btree ("categorie");