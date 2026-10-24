-- AlterTable
ALTER TABLE "affiliate_program_settings" ADD COLUMN     "default_affiliate_commission_rate" INTEGER NOT NULL DEFAULT 800,
ADD COLUMN     "default_affiliate_discount_type" "PromotionDiscountType" NOT NULL DEFAULT 'PERCENTAGE',
ADD COLUMN     "default_affiliate_discount_value" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "max_active_codes_per_affiliate" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "max_uses_per_customer_limit" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "self_service_code_creation_enabled" BOOLEAN NOT NULL DEFAULT true;
