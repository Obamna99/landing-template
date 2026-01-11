/*
  Warnings:

  - You are about to drop the column `department` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `candidates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "department",
DROP COLUMN "position",
ADD COLUMN     "linkedin_username" VARCHAR(255);
