-- DropIndex
DROP INDEX IF EXISTS "Quote_quoteAmount_idx";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN IF EXISTS "quoteAmount",
DROP COLUMN IF EXISTS "quoteCurrency",
DROP COLUMN IF EXISTS "createdIp";
