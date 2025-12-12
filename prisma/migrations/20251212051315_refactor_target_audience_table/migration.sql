/*
  Warnings:

  - You are about to drop the column `targetAudience` on the `AdRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdRequest" DROP COLUMN "targetAudience";

-- CreateTable
CREATE TABLE "TargetAudience" (
    "id" TEXT NOT NULL,
    "adRequestId" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TargetAudience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TargetAudience" ADD CONSTRAINT "TargetAudience_adRequestId_fkey" FOREIGN KEY ("adRequestId") REFERENCES "AdRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
