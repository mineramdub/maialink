CREATE TYPE "public"."practice_action_type" AS ENUM('prescription', 'examen', 'conseil', 'diagnostic', 'orientation');--> statement-breakpoint
CREATE TYPE "public"."practice_context_type" AS ENUM('consultation_prenatale', 'consultation_postnatale', 'consultation_gyneco', 'reeducation', 'monitoring');--> statement-breakpoint
CREATE TABLE "practice_learning_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"suggestion_id" uuid,
	"event_type" text NOT NULL,
	"context" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action_type" "practice_action_type" NOT NULL,
	"context" jsonb NOT NULL,
	"action_data" jsonb NOT NULL,
	"frequency" integer DEFAULT 1 NOT NULL,
	"last_used" timestamp DEFAULT now() NOT NULL,
	"associated_actions" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smart_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pattern_id" uuid,
	"suggestion_type" text NOT NULL,
	"trigger_context" jsonb NOT NULL,
	"suggested_action" jsonb NOT NULL,
	"times_shown" integer DEFAULT 0 NOT NULL,
	"times_accepted" integer DEFAULT 0 NOT NULL,
	"times_rejected" integer DEFAULT 0 NOT NULL,
	"acceptance_rate" numeric(5, 2) DEFAULT '0',
	"is_active" boolean DEFAULT true NOT NULL,
	"last_shown_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "practice_learning_events" ADD CONSTRAINT "practice_learning_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_learning_events" ADD CONSTRAINT "practice_learning_events_suggestion_id_smart_suggestions_id_fk" FOREIGN KEY ("suggestion_id") REFERENCES "public"."smart_suggestions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_patterns" ADD CONSTRAINT "practice_patterns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smart_suggestions" ADD CONSTRAINT "smart_suggestions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smart_suggestions" ADD CONSTRAINT "smart_suggestions_pattern_id_practice_patterns_id_fk" FOREIGN KEY ("pattern_id") REFERENCES "public"."practice_patterns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "practice_learning_events_user_id_idx" ON "practice_learning_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "practice_learning_events_suggestion_id_idx" ON "practice_learning_events" USING btree ("suggestion_id");--> statement-breakpoint
CREATE INDEX "practice_learning_events_event_type_idx" ON "practice_learning_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "practice_learning_events_created_at_idx" ON "practice_learning_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "practice_patterns_user_id_idx" ON "practice_patterns" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "practice_patterns_action_type_idx" ON "practice_patterns" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "practice_patterns_frequency_idx" ON "practice_patterns" USING btree ("frequency");--> statement-breakpoint
CREATE INDEX "practice_patterns_last_used_idx" ON "practice_patterns" USING btree ("last_used");--> statement-breakpoint
CREATE INDEX "smart_suggestions_user_id_idx" ON "smart_suggestions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "smart_suggestions_pattern_id_idx" ON "smart_suggestions" USING btree ("pattern_id");--> statement-breakpoint
CREATE INDEX "smart_suggestions_suggestion_type_idx" ON "smart_suggestions" USING btree ("suggestion_type");--> statement-breakpoint
CREATE INDEX "smart_suggestions_acceptance_rate_idx" ON "smart_suggestions" USING btree ("acceptance_rate");--> statement-breakpoint
CREATE INDEX "smart_suggestions_is_active_idx" ON "smart_suggestions" USING btree ("is_active");