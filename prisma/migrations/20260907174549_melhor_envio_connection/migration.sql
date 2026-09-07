-- CreateEnum
CREATE TYPE "MelhorEnvioConnectionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'ERROR');

-- CreateTable
CREATE TABLE "melhor_envio_connections" (
    "id" TEXT NOT NULL,
    "status" "MelhorEnvioConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "scope" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "melhor_envio_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "melhor_envio_oauth_states" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "melhor_envio_oauth_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "melhor_envio_connections_status_idx" ON "melhor_envio_connections"("status");

-- CreateIndex
CREATE UNIQUE INDEX "melhor_envio_oauth_states_state_key" ON "melhor_envio_oauth_states"("state");

-- CreateIndex
CREATE INDEX "melhor_envio_oauth_states_expires_at_idx" ON "melhor_envio_oauth_states"("expires_at");
