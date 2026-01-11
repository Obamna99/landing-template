/*
  Warnings:

  - Made the column `date_of_birth` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `employment_status` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `over_100_reserve_days` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `was_officer` on table `candidates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "candidates" ALTER COLUMN "date_of_birth" SET NOT NULL,
ALTER COLUMN "employment_status" SET NOT NULL,
ALTER COLUMN "over_100_reserve_days" SET NOT NULL,
ALTER COLUMN "was_officer" SET NOT NULL;
