-- AlterTable
ALTER TABLE "site_settings"
ADD COLUMN "threads" TEXT NOT NULL DEFAULT '',
ADD COLUMN "linkedin" TEXT NOT NULL DEFAULT '',
DROP COLUMN "twitter";

ALTER TABLE "site_settings" ALTER COLUMN "threads" DROP DEFAULT;
ALTER TABLE "site_settings" ALTER COLUMN "linkedin" DROP DEFAULT;
