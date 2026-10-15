-- CreateEnum
CREATE TYPE "AffiliateType" AS ENUM ('PROMOTER', 'RESELLER');

-- CreateEnum
CREATE TYPE "AffiliateStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateTable
CREATE TABLE "affiliates" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "AffiliateType" NOT NULL,
    "status" "AffiliateStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "affiliates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_program_settings" (
    "id" TEXT NOT NULL,
    "market_code" "MarketCode" NOT NULL,
    "min_code_lifetime_days" INTEGER NOT NULL,
    "max_code_lifetime_days" INTEGER NOT NULL,
    "attribution_window_days" INTEGER NOT NULL DEFAULT 30,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "affiliate_program_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_promotion_codes" (
    "id" TEXT NOT NULL,
    "affiliate_id" TEXT NOT NULL,
    "promotion_code_id" TEXT NOT NULL,
    "commission_rate" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "affiliate_promotion_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "affiliates_user_id_key" ON "affiliates"("user_id");

-- CreateIndex
CREATE INDEX "affiliates_status_idx" ON "affiliates"("status");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_program_settings_market_code_key" ON "affiliate_program_settings"("market_code");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_promotion_codes_promotion_code_id_key" ON "affiliate_promotion_codes"("promotion_code_id");

-- CreateIndex
CREATE INDEX "affiliate_promotion_codes_affiliate_id_idx" ON "affiliate_promotion_codes"("affiliate_id");

-- AddForeignKey
ALTER TABLE "affiliates" ADD CONSTRAINT "affiliates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_promotion_codes" ADD CONSTRAINT "affiliate_promotion_codes_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_promotion_codes" ADD CONSTRAINT "affiliate_promotion_codes_promotion_code_id_fkey" FOREIGN KEY ("promotion_code_id") REFERENCES "promotion_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
