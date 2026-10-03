-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "WorkItem" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" TEXT;

-- CreateIndex
CREATE INDEX "WorkItem_deletedAt_idx" ON "WorkItem"("deletedAt");
