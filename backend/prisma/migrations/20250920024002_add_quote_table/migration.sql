-- CreateEnum
CREATE TYPE "public"."QuoteStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- AlterTable
ALTER TABLE "public"."EmailLog" ADD COLUMN     "quoteId" TEXT;

-- CreateTable
CREATE TABLE "public"."Quote" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "acceptPhone" BOOLEAN NOT NULL DEFAULT false,
    "acceptTerms" BOOLEAN NOT NULL,
    "status" "public"."QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "quoteAmount" DECIMAL(10,2),
    "quoteCurrency" TEXT DEFAULT 'EUR',
    "quoteValidUntil" TIMESTAMPTZ(6),
    "quoteDocument" TEXT,
    "processedAt" TIMESTAMPTZ(6),
    "sentAt" TIMESTAMPTZ(6),
    "respondedAt" TIMESTAMPTZ(6),
    "createdIp" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quote_contactId_idx" ON "public"."Quote"("contactId");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "public"."Quote"("status");

-- CreateIndex
CREATE INDEX "Quote_createdAt_idx" ON "public"."Quote"("createdAt");

-- CreateIndex
CREATE INDEX "Quote_status_createdAt_idx" ON "public"."Quote"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."EmailLog" ADD CONSTRAINT "EmailLog_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
