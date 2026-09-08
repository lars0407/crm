import type { Db } from "./client";

const COMPANY_GOOGLE_BUSINESS_LOCK_CLASS = 4120;
const COMPANY_GOOGLE_BUSINESS_LOCK_ID = 918_337;

export async function ensureCompanyGoogleBusinessColumn(db: Db): Promise<void> {
	await db.$queryRaw`SELECT pg_advisory_lock(${COMPANY_GOOGLE_BUSINESS_LOCK_CLASS}, ${COMPANY_GOOGLE_BUSINESS_LOCK_ID})`;
	try {
		await db.$executeRaw`
			ALTER TABLE "company" ADD COLUMN IF NOT EXISTS "googleBusinessId" TEXT`;
		await db.$executeRaw`
			CREATE UNIQUE INDEX IF NOT EXISTS "company_google_business_active_key"
			ON "company"("googleBusinessId")
			WHERE ("archivedAt" IS NULL)`;
	} finally {
		await db.$queryRaw`SELECT pg_advisory_unlock(${COMPANY_GOOGLE_BUSINESS_LOCK_CLASS}, ${COMPANY_GOOGLE_BUSINESS_LOCK_ID})`;
	}
}
