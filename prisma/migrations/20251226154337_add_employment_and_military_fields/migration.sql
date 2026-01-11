-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "date_of_birth" DATE,
ADD COLUMN     "employment_status" VARCHAR(50),
ADD COLUMN     "over_100_reserve_days" BOOLEAN,
ADD COLUMN     "was_officer" BOOLEAN,
ADD COLUMN     "workplace" VARCHAR(255);
