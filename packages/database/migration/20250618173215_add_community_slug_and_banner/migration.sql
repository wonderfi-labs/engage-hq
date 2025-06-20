-- AlterTable
ALTER TABLE "User" ADD COLUMN "communityBannerUrl" TEXT;
ALTER TABLE "User" ADD COLUMN "communitySlug" TEXT;
ALTER TABLE "User" ADD UNIQUE ("communitySlug");