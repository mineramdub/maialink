-- Migration: Création de la table resultats_labo
-- Date: 2026-01-22

-- Créer la table resultats_labo
CREATE TABLE IF NOT EXISTS "resultats_labo" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "patient_id" UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES "users"("id"),

  -- Type et identification
  "type" TEXT NOT NULL,
  "nom" TEXT NOT NULL,

  -- Dates
  "date_analyse" DATE,
  "date_reception" DATE,

  -- Résultats
  "resultat_manuel" TEXT,
  "fichier_url" TEXT,
  "fichier_nom" TEXT,

  -- Interprétation
  "normal" BOOLEAN,
  "commentaire" TEXT,

  -- Métadonnées
  "laboratoire" TEXT,
  "prescripteur" TEXT,

  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Créer les index
CREATE INDEX IF NOT EXISTS "idx_resultats_labo_patient" ON "resultats_labo"("patient_id");
CREATE INDEX IF NOT EXISTS "idx_resultats_labo_user" ON "resultats_labo"("user_id");
CREATE INDEX IF NOT EXISTS "idx_resultats_labo_date" ON "resultats_labo"("date_analyse");

-- Commentaires
COMMENT ON TABLE "resultats_labo" IS 'Résultats de laboratoire avec PDF et saisie manuelle';
COMMENT ON COLUMN "resultats_labo"."type" IS 'Type d''examen: nfs, biochimie, serologie, hormonologie, autre';
COMMENT ON COLUMN "resultats_labo"."nom" IS 'Nom de l''examen: NFS, TSH, Sérologie toxoplasmose, etc.';
COMMENT ON COLUMN "resultats_labo"."fichier_url" IS 'URL du PDF uploadé sur Vercel Blob';
COMMENT ON COLUMN "resultats_labo"."resultat_manuel" IS 'Saisie manuelle des résultats (texte libre ou JSON)';
COMMENT ON COLUMN "resultats_labo"."normal" IS 'true=normal, false=anormal, null=non interprété';
