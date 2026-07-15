-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "posts_archived_idx" ON "posts"("archived");
