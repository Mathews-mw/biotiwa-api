-- CreateEnum
CREATE TYPE "ShippingQuoteStatus" AS ENUM ('ACTIVE', 'SELECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ShippingProvider" AS ENUM ('MELHOR_ENVIO');

-- CreateTable
CREATE TABLE "shipping_quotes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "market_code" "MarketCode" NOT NULL,
    "destination_postal_code" TEXT NOT NULL,
    "cart_fingerprint" TEXT NOT NULL,
    "status" "ShippingQuoteStatus" NOT NULL DEFAULT 'ACTIVE',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "request_payload" JSONB,
    "response_payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "shipping_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_quote_rates" (
    "id" TEXT NOT NULL,
    "shipping_quote_id" TEXT NOT NULL,
    "provider" "ShippingProvider" NOT NULL,
    "service_id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "carrier_name" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "estimated_days" INTEGER,
    "raw_payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipping_quote_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_shipping_rates" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "shipping_quote_id" TEXT,
    "shipping_quote_rate_id" TEXT,
    "provider" "ShippingProvider" NOT NULL,
    "service_id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "carrier_name" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "estimated_days" INTEGER,
    "raw_payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "order_shipping_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shipping_quotes_user_id_idx" ON "shipping_quotes"("user_id");

-- CreateIndex
CREATE INDEX "shipping_quotes_cart_id_idx" ON "shipping_quotes"("cart_id");

-- CreateIndex
CREATE INDEX "shipping_quotes_status_idx" ON "shipping_quotes"("status");

-- CreateIndex
CREATE INDEX "shipping_quotes_expires_at_idx" ON "shipping_quotes"("expires_at");

-- CreateIndex
CREATE INDEX "shipping_quote_rates_shipping_quote_id_idx" ON "shipping_quote_rates"("shipping_quote_id");

-- CreateIndex
CREATE INDEX "shipping_quote_rates_provider_idx" ON "shipping_quote_rates"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "order_shipping_rates_order_id_key" ON "order_shipping_rates"("order_id");

-- AddForeignKey
ALTER TABLE "shipping_quotes" ADD CONSTRAINT "shipping_quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_quotes" ADD CONSTRAINT "shipping_quotes_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_quote_rates" ADD CONSTRAINT "shipping_quote_rates_shipping_quote_id_fkey" FOREIGN KEY ("shipping_quote_id") REFERENCES "shipping_quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shipping_rates" ADD CONSTRAINT "order_shipping_rates_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
