/*
  Warnings:

  - You are about to drop the column `email` on the `candidates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "email",
ADD COLUMN     "city" VARCHAR(100);
