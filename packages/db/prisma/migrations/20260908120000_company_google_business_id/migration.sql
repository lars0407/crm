-- AlterTable
ALTER TABLE "company" ADD COLUMN "googleBusinessId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "company_google_business_active_key" ON "company"("googleBusinessId") WHERE ("archivedAt" IS NULL);
