-- Add practitioner_settings table for storing practitioner office information
CREATE TABLE IF NOT EXISTS "practitioner_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL UNIQUE,
	"cabinet_address" text NOT NULL,
	"cabinet_postal_code" text,
	"cabinet_city" text,
	"cabinet_phone" text,
	"cabinet_email" text,
	"signature_image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "practitioner_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS "practitioner_settings_user_id_idx" ON "practitioner_settings" ("user_id");
