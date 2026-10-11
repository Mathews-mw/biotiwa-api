/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `promotion_redemptions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `order_id` on table `promotion_redemptions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "promotion_redemptions_order_id_idx";

-- AlterTable
ALTER TABLE "promotion_redemptions" ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "expired_at" TIMESTAMP(3),
ADD COLUMN     "reserved_until" TIMESTAMP(3),
ALTER COLUMN "order_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "order_promotions" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "source_promotion_code_id" TEXT,
    "code" TEXT NOT NULL,
    "type" "PromotionCodeType" NOT NULL,
    "discount_type" "PromotionDiscountType" NOT NULL,
    "discount_value" INTEGER NOT NULL,
    "discount_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "order_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_promotions_order_id_key" ON "order_promotions"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_redemptions_order_id_key" ON "promotion_redemptions"("order_id");

-- AddForeignKey
ALTER TABLE "order_promotions" ADD CONSTRAINT "order_promotions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_redemptions" ADD CONSTRAINT "promotion_redemptions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
