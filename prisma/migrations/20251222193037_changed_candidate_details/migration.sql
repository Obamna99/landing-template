/*
  Warnings:

  - You are about to drop the column `city` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `emergency_contact_name` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `emergency_contact_phone` on the `candidates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "city",
DROP COLUMN "date_of_birth",
DROP COLUMN "emergency_contact_name",
DROP COLUMN "emergency_contact_phone",
ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "zip_code" VARCHAR(20);
