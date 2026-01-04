ALTER TYPE "public"."consultation_type" ADD VALUE 'ivg' BEFORE 'autre';--> statement-breakpoint
CREATE TABLE "calendar_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"google_access_token" text,
	"google_refresh_token" text,
	"google_token_expires_at" timestamp,
	"google_calendar_id" text,
	"google_email" text,
	"sync_enabled" boolean DEFAULT false,
	"sync_direction" text DEFAULT 'bidirectional',
	"last_sync_at" timestamp,
	"sync_frequency" integer DEFAULT 15,
	"doctolib_calendar_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "calendar_integrations_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "google_calendar_event_id" text;--> statement-breakpoint
ALTER TABLE "calendar_integrations" ADD CONSTRAINT "calendar_integrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appointments_google_calendar_event_id_idx" ON "appointments" USING btree ("google_calendar_event_id");