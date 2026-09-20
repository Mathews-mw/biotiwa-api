-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BEING_DEFINED', 'PIX', 'CREDIT', 'DEBIT', 'PAYMENT_SLIPS_OR_SIMILAR');

-- CreateEnum
CREATE TYPE "BlingConnectionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'ERROR');

-- CreateEnum
CREATE TYPE "BlingOrderSyncStatus" AS ENUM ('PENDING', 'PROCESSING', 'SYNCED', 'FAILED');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "payment_type" "PaymentType" NOT NULL DEFAULT 'BEING_DEFINED';

-- CreateTable
CREATE TABLE "bling_connections" (
    "id" TEXT NOT NULL,
    "status" "BlingConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "scope" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "bling_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bling_order_syncs" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "status" "BlingOrderSyncStatus" NOT NULL DEFAULT 'PENDING',
    "bling_order_id" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error_message" TEXT,
    "request_payload" JSONB,
    "response_payload" JSONB,
    "synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "bling_order_syncs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bling_order_syncs_order_id_key" ON "bling_order_syncs"("order_id");

-- CreateIndex
CREATE INDEX "bling_order_syncs_status_idx" ON "bling_order_syncs"("status");

-- AddForeignKey
ALTER TABLE "bling_order_syncs" ADD CONSTRAINT "bling_order_syncs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
