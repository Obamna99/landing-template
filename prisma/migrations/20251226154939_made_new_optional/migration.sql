-- AlterTable
ALTER TABLE "candidates" ALTER COLUMN "date_of_birth" DROP NOT NULL,
ALTER COLUMN "employment_status" DROP NOT NULL,
ALTER COLUMN "over_100_reserve_days" DROP NOT NULL,
ALTER COLUMN "was_officer" DROP NOT NULL;
