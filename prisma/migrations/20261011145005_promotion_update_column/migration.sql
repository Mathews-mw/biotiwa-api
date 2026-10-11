-- AlterTable
ALTER TABLE "promotion_codes" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "promotion_redemptions" ALTER COLUMN "updated_at" DROP NOT NULL;
