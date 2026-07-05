-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN "workspaceImageUrl" TEXT;

-- Preserve the image currently hardcoded on the frontend as the initial value
UPDATE "site_settings"
SET "workspaceImageUrl" = 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
WHERE "id" = 'singleton';
