-- Migration: Ajout des champs gynécologiques et obstétricaux détaillés
-- Date: 2026-01-20

-- Champs gynécologiques
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "age_menarche" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "duree_cycle" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "duree_regles" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "regularite_cycle" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "dysmenorrhee" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "dyspareunie" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "leucorrhees" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "contraception_actuelle" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "date_dernier_frottis" date;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "date_derniere_mammographie" date;

-- Champs obstétricaux détaillés
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "dates_dernieres_regles" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "gestes_parite" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "accouchements" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "cesarienne" boolean DEFAULT false;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "nombre_cesariennes" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "fausses_couches" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "ivg" integer;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "grossesse_extra_uterine" boolean DEFAULT false;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "mort_ne" boolean DEFAULT false;

-- Commentaires sur les colonnes
COMMENT ON COLUMN "patients"."age_menarche" IS 'Âge des premières règles';
COMMENT ON COLUMN "patients"."duree_cycle" IS 'Durée du cycle en jours';
COMMENT ON COLUMN "patients"."duree_regles" IS 'Durée des règles en jours';
COMMENT ON COLUMN "patients"."regularite_cycle" IS 'Régularité du cycle: regulier, irregulier, variable';
COMMENT ON COLUMN "patients"."dysmenorrhee" IS 'Intensité dysménorrhée: absente, legere, moderee, severe';
COMMENT ON COLUMN "patients"."dyspareunie" IS 'Intensité dyspareunie: absente, legere, moderee, severe';
COMMENT ON COLUMN "patients"."leucorrhees" IS 'Description des pertes blanches';
COMMENT ON COLUMN "patients"."contraception_actuelle" IS 'Contraception actuelle de la patiente';
COMMENT ON COLUMN "patients"."date_dernier_frottis" IS 'Date du dernier frottis cervico-utérin';
COMMENT ON COLUMN "patients"."date_derniere_mammographie" IS 'Date de la dernière mammographie';
COMMENT ON COLUMN "patients"."dates_dernieres_regles" IS 'Date des dernières règles';
COMMENT ON COLUMN "patients"."gestes_parite" IS 'Détails gestité/parité (ex: G3P2A1)';
COMMENT ON COLUMN "patients"."accouchements" IS 'Historique textuel des accouchements précédents';
COMMENT ON COLUMN "patients"."cesarienne" IS 'A eu une ou plusieurs césariennes';
COMMENT ON COLUMN "patients"."nombre_cesariennes" IS 'Nombre de césariennes';
COMMENT ON COLUMN "patients"."fausses_couches" IS 'Nombre de fausses couches';
COMMENT ON COLUMN "patients"."ivg" IS 'Nombre d\'IVG';
COMMENT ON COLUMN "patients"."grossesse_extra_uterine" IS 'Antécédent de grossesse extra-utérine';
COMMENT ON COLUMN "patients"."mort_ne" IS 'Antécédent de mort-né';
