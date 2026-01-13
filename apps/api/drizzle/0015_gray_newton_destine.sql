CREATE TYPE "public"."share_action" AS ENUM('access_granted', 'access_denied', 'data_read', 'data_modified', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."share_type" AS ENUM('patient', 'grossesse', 'documents', 'synthetic_pdf');--> statement-breakpoint
CREATE TABLE "shared_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"share_type" "share_type" NOT NULL,
	"patient_id" uuid,
	"grossesse_id" uuid,
	"document_ids" jsonb,
	"share_token" text NOT NULL,
	"access_code_hash" text NOT NULL,
	"permissions" jsonb NOT NULL,
	"recipient_name" text,
	"recipient_email" text,
	"recipient_note" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"revoked_at" timestamp,
	"revoked_by" uuid,
	"revocation_reason" text,
	"expires_at" timestamp,
	"max_access_count" integer,
	"current_access_count" integer DEFAULT 0 NOT NULL,
	"last_access_at" timestamp,
	"failed_attempts_count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shared_access_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
CREATE TABLE "shared_access_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shared_access_id" uuid NOT NULL,
	"action" "share_action" NOT NULL,
	"resource_type" text,
	"resource_id" text,
	"old_data" jsonb,
	"new_data" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shared_access" ADD CONSTRAINT "shared_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_access" ADD CONSTRAINT "shared_access_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_access" ADD CONSTRAINT "shared_access_grossesse_id_grossesses_id_fk" FOREIGN KEY ("grossesse_id") REFERENCES "public"."grossesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_access" ADD CONSTRAINT "shared_access_revoked_by_users_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_access_logs" ADD CONSTRAINT "shared_access_logs_shared_access_id_shared_access_id_fk" FOREIGN KEY ("shared_access_id") REFERENCES "public"."shared_access"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shared_access_token_idx" ON "shared_access" USING btree ("share_token");--> statement-breakpoint
CREATE INDEX "shared_access_user_id_idx" ON "shared_access" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shared_access_patient_id_idx" ON "shared_access" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "shared_access_is_active_idx" ON "shared_access" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "shared_access_logs_shared_access_id_idx" ON "shared_access_logs" USING btree ("shared_access_id");--> statement-breakpoint
CREATE INDEX "shared_access_logs_action_idx" ON "shared_access_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "shared_access_logs_created_at_idx" ON "shared_access_logs" USING btree ("created_at");