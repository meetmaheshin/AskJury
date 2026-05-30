-- Workplace pivot: rant-about-work model.
-- Adds Company + Reaction, VENT/JUDGE post types, target types, anonymous handles,
-- and replaces the old interpersonal-dispute categories with workplace categories.
--
-- This migration is written to be safe on BOTH a fresh database and an existing
-- (already-populated) one. The UPDATE statements are no-ops on an empty DB.

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('VENT', 'JUDGE');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('COMPANY', 'PERSON', 'GENERAL');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('RELATABLE', 'BOSS_WRONG', 'OVERREACTING', 'SAME_HERE', 'RUN');

-- Remap any pre-pivot category values that no longer exist in the new enum to OTHER.
-- Runs while "category" is still the old enum type ('OTHER' is valid in both).
UPDATE "cases"
SET "category" = 'OTHER'
WHERE "category"::text NOT IN (
  'TOXIC_MANAGEMENT','BAD_BOSS','COWORKER_DRAMA','PAY_AND_PROMOTION','JOB_SECURITY',
  'WORK_LIFE_BALANCE','HR_ISSUES','OFFICE_POLITICS','RETURN_TO_OFFICE','WORK_CULTURE','OTHER'
);

-- AlterEnum
BEGIN;
CREATE TYPE "CaseCategory_new" AS ENUM ('TOXIC_MANAGEMENT', 'BAD_BOSS', 'COWORKER_DRAMA', 'PAY_AND_PROMOTION', 'JOB_SECURITY', 'WORK_LIFE_BALANCE', 'HR_ISSUES', 'OFFICE_POLITICS', 'RETURN_TO_OFFICE', 'WORK_CULTURE', 'OTHER');
ALTER TABLE "cases" ALTER COLUMN "category" TYPE "CaseCategory_new" USING ("category"::text::"CaseCategory_new");
ALTER TYPE "CaseCategory" RENAME TO "CaseCategory_old";
ALTER TYPE "CaseCategory_new" RENAME TO "CaseCategory";
DROP TYPE "CaseCategory_old";
COMMIT;

-- AlterTable: add anonymous_handle in a backfill-safe way (nullable -> backfill -> NOT NULL).
ALTER TABLE "users" ADD COLUMN "anonymous_handle" TEXT;
UPDATE "users" SET "anonymous_handle" = 'user_' || replace("id"::text, '-', '') WHERE "anonymous_handle" IS NULL;
ALTER TABLE "users" ALTER COLUMN "anonymous_handle" SET NOT NULL;

-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "post_type" "PostType" NOT NULL DEFAULT 'JUDGE',
ADD COLUMN     "target_name" TEXT,
ADD COLUMN     "target_type" "TargetType" NOT NULL DEFAULT 'GENERAL',
ALTER COLUMN "side_a_label" SET DEFAULT 'You''re valid',
ALTER COLUMN "side_b_label" SET DEFAULT 'You''re overreacting';

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "logo_url" TEXT,
    "industry" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "companies_domain_key" ON "companies"("domain");

-- CreateIndex
CREATE INDEX "companies_slug_idx" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "reactions_case_id_idx" ON "reactions"("case_id");

-- CreateIndex
CREATE INDEX "reactions_user_id_idx" ON "reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_case_id_user_id_key" ON "reactions"("case_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_anonymous_handle_key" ON "users"("anonymous_handle");

-- CreateIndex
CREATE INDEX "cases_company_id_idx" ON "cases"("company_id");

-- CreateIndex
CREATE INDEX "cases_post_type_idx" ON "cases"("post_type");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
