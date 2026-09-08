-- AlterTable
ALTER TABLE "company" ADD COLUMN IF NOT EXISTS "googleBusinessId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "company_google_business_active_key" ON "company"("googleBusinessId") WHERE ("archivedAt" IS NULL);
