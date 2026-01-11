-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "citizenship" JSONB,
ADD COLUMN     "education" VARCHAR(100),
ADD COLUMN     "marital_status" VARCHAR(50);
