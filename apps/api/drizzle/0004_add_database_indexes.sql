CREATE TABLE "practitioner_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"cabinet_address" text NOT NULL,
	"cabinet_postal_code" text,
	"cabinet_city" text,
	"cabinet_phone" text,
	"cabinet_email" text,
	"signature_image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "practitioner_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "protocols" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "protocols" ALTER COLUMN "category" SET DEFAULT 'Autre';--> statement-breakpoint
ALTER TABLE "practitioner_settings" ADD CONSTRAINT "practitioner_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accouchements_grossesse_id_idx" ON "accouchements" USING btree ("grossesse_id");--> statement-breakpoint
CREATE INDEX "accouchements_patient_id_idx" ON "accouchements" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "accouchements_user_id_idx" ON "accouchements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "accouchements_date_idx" ON "accouchements" USING btree ("date_accouchement");--> statement-breakpoint
CREATE INDEX "ai_conversations_user_id_idx" ON "ai_conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_conversations_created_at_idx" ON "ai_conversations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "alertes_patient_id_idx" ON "alertes" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "alertes_grossesse_id_idx" ON "alertes" USING btree ("grossesse_id");--> statement-breakpoint
CREATE INDEX "alertes_consultation_id_idx" ON "alertes" USING btree ("consultation_id");--> statement-breakpoint
CREATE INDEX "alertes_user_id_idx" ON "alertes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "alertes_is_read_idx" ON "alertes" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "alertes_severity_idx" ON "alertes" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "alertes_created_at_idx" ON "alertes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "appointments_patient_id_idx" ON "appointments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "appointments_user_id_idx" ON "appointments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "appointments_start_time_idx" ON "appointments" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "appointments_status_idx" ON "appointments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_table_name_idx" ON "audit_logs" USING btree ("table_name");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "bebes_grossesse_id_idx" ON "bebes" USING btree ("grossesse_id");--> statement-breakpoint
CREATE INDEX "bebes_patient_id_idx" ON "bebes" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "consultations_patient_id_idx" ON "consultations" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "consultations_user_id_idx" ON "consultations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "consultations_grossesse_id_idx" ON "consultations" USING btree ("grossesse_id");--> statement-breakpoint
CREATE INDEX "consultations_date_idx" ON "consultations" USING btree ("date");--> statement-breakpoint
CREATE INDEX "consultations_type_idx" ON "consultations" USING btree ("type");--> statement-breakpoint
CREATE INDEX "documents_patient_id_idx" ON "documents" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "documents_user_id_idx" ON "documents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "documents_consultation_id_idx" ON "documents" USING btree ("consultation_id");--> statement-breakpoint
CREATE INDEX "documents_type_idx" ON "documents" USING btree ("type");--> statement-breakpoint
CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "examens_prenataux_grossesse_id_idx" ON "examens_prenataux" USING btree ("grossesse_id");--> statement-breakpoint
CREATE INDEX "examens_prenataux_user_id_idx" ON "examens_prenataux" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "examens_prenataux_date_realisee_idx" ON "examens_prenataux" USING btree ("date_realisee");--> statement-breakpoint
CREATE INDEX "grossesses_patient_id_idx" ON "grossesses" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "grossesses_user_id_idx" ON "grossesses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "grossesses_status_idx" ON "grossesses" USING btree ("status");--> statement-breakpoint
CREATE INDEX "grossesses_dpa_idx" ON "grossesses" USING btree ("dpa");--> statement-breakpoint
CREATE INDEX "invoices_patient_id_idx" ON "invoices" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "invoices_user_id_idx" ON "invoices" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invoices_consultation_id_idx" ON "invoices" USING btree ("consultation_id");--> statement-breakpoint
CREATE INDEX "invoices_date_idx" ON "invoices" USING btree ("date");--> statement-breakpoint
CREATE INDEX "invoices_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "patients_user_id_idx" ON "patients" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "patients_status_idx" ON "patients" USING btree ("status");--> statement-breakpoint
CREATE INDEX "patients_updated_at_idx" ON "patients" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "protocol_chunks_protocol_id_idx" ON "protocol_chunks" USING btree ("protocol_id");--> statement-breakpoint
CREATE INDEX "protocols_user_id_idx" ON "protocols" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "protocols_category_idx" ON "protocols" USING btree ("category");--> statement-breakpoint
CREATE INDEX "protocols_is_processed_idx" ON "protocols" USING btree ("is_processed");--> statement-breakpoint
CREATE INDEX "reeducation_seances_patient_id_idx" ON "reeducation_seances" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "reeducation_seances_user_id_idx" ON "reeducation_seances" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reeducation_seances_date_idx" ON "reeducation_seances" USING btree ("date");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "suivi_gyneco_patient_id_idx" ON "suivi_gyneco" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "suivi_gyneco_user_id_idx" ON "suivi_gyneco" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "suivi_gyneco_date_idx" ON "suivi_gyneco" USING btree ("date");--> statement-breakpoint
CREATE INDEX "suivi_post_partum_patient_id_idx" ON "suivi_post_partum" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "suivi_post_partum_grossesse_id_idx" ON "suivi_post_partum" USING btree ("grossesse_id");--> statement-breakpoint
CREATE INDEX "suivi_post_partum_user_id_idx" ON "suivi_post_partum" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "suivi_post_partum_date_idx" ON "suivi_post_partum" USING btree ("date");