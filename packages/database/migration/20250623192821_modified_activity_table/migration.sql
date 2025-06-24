/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Activity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_subjectId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "subjectId",
ADD COLUMN     "communityId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
