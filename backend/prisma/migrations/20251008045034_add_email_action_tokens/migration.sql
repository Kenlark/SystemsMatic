-- CreateTable
CREATE TABLE "public"."EmailActionToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMPTZ(6),
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailActionToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailActionToken_token_key" ON "public"."EmailActionToken"("token");

-- CreateIndex
CREATE INDEX "EmailActionToken_token_idx" ON "public"."EmailActionToken"("token");

-- CreateIndex
CREATE INDEX "EmailActionToken_type_entityId_idx" ON "public"."EmailActionToken"("type", "entityId");

-- CreateIndex
CREATE INDEX "EmailActionToken_expiresAt_idx" ON "public"."EmailActionToken"("expiresAt");
