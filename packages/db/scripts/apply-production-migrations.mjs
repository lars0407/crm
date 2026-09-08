import { execSync, spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dbDir = dirname(dirname(fileURLToPath(import.meta.url)));
const bun = process.env.BUN_BIN || "bun";
const isProductionDeployment = process.env.VERCEL_ENV === "production";
const directDatabaseUrl = !isProductionDeployment
	? undefined
	: process.env.DIRECT_DATABASE_URL ||
		process.env.POSTGRES_URL_NON_POOLING ||
		process.env.DATABASE_URL_UNPOOLED ||
		process.env.DATABASE_URL;

if (!process.env.VERCEL) {
	console.log("• not a Vercel build — skipping migrations");
	process.exit(0);
}

if (!isProductionDeployment) {
	console.log(
		`• ${process.env.VERCEL_ENV || "non-production"} deployment — skipping migrations, only production applies them`,
	);
	process.exit(0);
}

if (!directDatabaseUrl) {
	console.log("• no database URL at build time — skipping migrations");
	process.exit(0);
}

if (process.env.SKIP_DB_MIGRATIONS === "true") {
	console.log("• SKIP_DB_MIGRATIONS=true — skipping migrations");
	process.exit(0);
}

const dbEnv = { ...process.env, DATABASE_URL: directDatabaseUrl };

console.log("• applying migrations (prisma migrate deploy)...");
execSync(`${bun} x prisma migrate deploy`, {
	cwd: dbDir,
	stdio: "inherit",
	env: dbEnv,
});
console.log("✓ migrations applied");

console.log("• checking the deployed schema against schema.prisma...");
const drift = spawnSync(
	bun,
	[
		"x",
		"prisma",
		"migrate",
		"diff",
		"--from-config-datasource",
		"--to-schema",
		"prisma/schema.prisma",
		"--exit-code",
	],
	{ cwd: dbDir, encoding: "utf8", env: dbEnv },
);

if (drift.status === 0) {
	console.log("✓ schema matches");
} else if (drift.status === 2) {
	console.log("");
	console.log("!!  THE PRODUCTION SCHEMA DOES NOT MATCH schema.prisma  !!");
	console.log(
		"    Every migration is recorded as applied, so `migrate deploy` will keep reporting",
	);
	console.log(
		"    nothing pending while queries fail on columns that are not there. Reconcile with",
	);
	console.log(
		"    `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script`.",
	);
	console.log("");
	console.log(drift.stdout || "");
} else {
	console.log(
		`• could not compare the schema (${drift.stderr?.trim() || "unknown error"})`,
	);
}
