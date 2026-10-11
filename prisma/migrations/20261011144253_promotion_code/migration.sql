-- CreateEnum
CREATE TYPE "PromotionCodeType" AS ENUM ('COUPON', 'AFFILIATE');

-- CreateEnum
CREATE TYPE "PromotionCodeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PromotionDiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "PromotionRedemptionStatus" AS ENUM ('PENDING', 'REDEEMED', 'CANCELED', 'EXPIRED');

-- CreateTable
CREATE TABLE "promotion_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "PromotionCodeType" NOT NULL,
    "status" "PromotionCodeStatus" NOT NULL DEFAULT 'ACTIVE',
    "market_code" "MarketCode" NOT NULL,
    "discount_type" "PromotionDiscountType" NOT NULL,
    "discount_value" INTEGER NOT NULL,
    "max_uses" INTEGER,
    "max_uses_per_customer" INTEGER,
    "starts_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_redemptions" (
    "id" TEXT NOT NULL,
    "promotion_code_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "order_id" TEXT,
    "status" "PromotionRedemptionStatus" NOT NULL DEFAULT 'PENDING',
    "discount_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemed_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promotion_codes_code_key" ON "promotion_codes"("code");

-- CreateIndex
CREATE INDEX "promotion_codes_code_idx" ON "promotion_codes"("code");

-- CreateIndex
CREATE INDEX "promotion_codes_status_idx" ON "promotion_codes"("status");

-- CreateIndex
CREATE INDEX "promotion_codes_market_code_idx" ON "promotion_codes"("market_code");

-- CreateIndex
CREATE INDEX "promotion_redemptions_promotion_code_id_status_idx" ON "promotion_redemptions"("promotion_code_id", "status");

-- CreateIndex
CREATE INDEX "promotion_redemptions_promotion_code_id_user_id_status_idx" ON "promotion_redemptions"("promotion_code_id", "user_id", "status");

-- CreateIndex
CREATE INDEX "promotion_redemptions_order_id_idx" ON "promotion_redemptions"("order_id");

-- AddForeignKey
ALTER TABLE "promotion_redemptions" ADD CONSTRAINT "promotion_redemptions_promotion_code_id_fkey" FOREIGN KEY ("promotion_code_id") REFERENCES "promotion_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_redemptions" ADD CONSTRAINT "promotion_redemptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
