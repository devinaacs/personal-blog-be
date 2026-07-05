-- AlterTable
ALTER TABLE "site_settings"
ALTER COLUMN "github" DROP NOT NULL,
ALTER COLUMN "threads" DROP NOT NULL,
ALTER COLUMN "linkedin" DROP NOT NULL;

-- Treat empty strings as "not set"
UPDATE "site_settings" SET "threads" = NULL WHERE "threads" = '';
UPDATE "site_settings" SET "linkedin" = NULL WHERE "linkedin" = '';
UPDATE "site_settings" SET "github" = NULL WHERE "github" = '';
