import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
	join(
		import.meta.dir,
		"../prisma/migrations/20260908120000_company_google_business_id/migration.sql",
	),
	"utf8",
);

describe("company googleBusinessId migration", () => {
	it("adds the column when it is missing", () => {
		expect(migration).toContain(
			'ADD COLUMN IF NOT EXISTS "googleBusinessId" TEXT',
		);
	});

	it("adds the unique index when it is missing", () => {
		expect(migration).toContain(
			'CREATE UNIQUE INDEX IF NOT EXISTS "company_google_business_active_key"',
		);
	});
});
