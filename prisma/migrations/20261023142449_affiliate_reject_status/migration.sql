-- CreateEnum
CREATE TYPE "AffiliateCommissionStatus" AS ENUM ('PENDING', 'AVAILABLE', 'PAID', 'CANCELED');

-- AlterEnum
ALTER TYPE "AffiliateStatus" ADD VALUE 'REJECT';

-- AlterTable
ALTER TABLE "order_promotions" ADD COLUMN     "affiliate_commission_rate" INTEGER,
ADD COLUMN     "affiliate_id" TEXT,
ADD COLUMN     "affiliate_promotion_code_id" TEXT;

-- CreateTable
CREATE TABLE "affiliate_commissions" (
    "id" TEXT NOT NULL,
    "affiliate_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "promotion_code" TEXT NOT NULL,
    "commission_base_amount" INTEGER NOT NULL,
    "commission_rate" INTEGER NOT NULL,
    "commission_amount" INTEGER NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "status" "AffiliateCommissionStatus" NOT NULL DEFAULT 'PENDING',
    "available_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "affiliate_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_commissions_order_id_key" ON "affiliate_commissions"("order_id");

-- CreateIndex
CREATE INDEX "affiliate_commissions_affiliate_id_status_idx" ON "affiliate_commissions"("affiliate_id", "status");

-- CreateIndex
CREATE INDEX "affiliate_commissions_status_idx" ON "affiliate_commissions"("status");

-- AddForeignKey
ALTER TABLE "affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
