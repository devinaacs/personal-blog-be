-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "establishedYear" INTEGER NOT NULL,
    "bio" TEXT[],
    "currentlyUsing" TEXT[],
    "otherInterests" TEXT[],
    "email" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "twitter" TEXT NOT NULL,
    "footerBlurb" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
