-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "posts_pinned_idx" ON "posts"("pinned");
