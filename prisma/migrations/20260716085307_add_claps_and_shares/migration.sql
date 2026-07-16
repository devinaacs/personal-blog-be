-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "clapCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shareCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "claps" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,

    CONSTRAINT "claps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shares" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,

    CONSTRAINT "shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "claps_postId_idx" ON "claps"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "claps_postId_readerId_key" ON "claps"("postId", "readerId");

-- CreateIndex
CREATE INDEX "shares_postId_idx" ON "shares"("postId");

-- AddForeignKey
ALTER TABLE "claps" ADD CONSTRAINT "claps_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares" ADD CONSTRAINT "shares_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
