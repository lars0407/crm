import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { db } from "@crm/db";
import { AgentQueueService } from "../src/agent/agent-queue.service";
import { AgentTriggerService } from "../src/agent/agent-trigger.service";
import { CompaniesService } from "../src/companies/companies.service";
import { FaviconService } from "../src/companies/favicon.service";
import { ActivityStampService } from "../src/crm/activity-stamp.service";
import { ConversionService } from "../src/currency/conversion.service";
import { FieldsService } from "../src/fields/fields.service";
import { withDiscardedCrmEvents } from "./agent-trigger.stub";

const suffix = process.env.TEST_RUN_ID ?? "maps-import-spec";
const mapsId = `maps-${suffix}-1`;
const mapsIdTwo = `maps-${suffix}-2`;
const domain = `maps-${suffix}.test`;

const agent = {
	contactCreated: async () => true,
	companyCreated: async () => undefined,
	withCrmEvents: withDiscardedCrmEvents,
	companyRequested: async () => true,
} as unknown as AgentTriggerService;

const companies = new CompaniesService(
	db,
	agent,
	new AgentQueueService(db),
	{ backfill: async () => undefined } as unknown as FaviconService,
	new ActivityStampService(db),
	new ConversionService(db),
	new FieldsService(db, agent),
);

function business(
	partial: Partial<{
		id: string;
		name: string;
		city: string | null;
		phone: string | null;
		website: string | null;
		domain: string | null;
	}> = {},
) {
	return {
		id: mapsId,
		name: `Maps Import ${suffix}`,
		address: "Alexanderplatz 1, Berlin",
		city: "Berlin",
		country: "DE",
		phone: "+49 30 111111",
		website: `https://${domain}`,
		domain,
		email: `hello@${domain}`,
		linkedin: null,
		category: "Hotel",
		mapsUrl: "https://maps.google.com/?cid=1",
		...partial,
	};
}

async function clean() {
	await db.company.deleteMany({
		where: {
			OR: [
				{ googleBusinessId: { in: [mapsId, mapsIdTwo] } },
				{ domain },
				{ name: { startsWith: `Maps Import ${suffix}` } },
			],
		},
	});
}

beforeAll(clean);
afterAll(clean);

describe("importFromMaps", () => {
	it("adds a new company with the Maps fields", async () => {
		const result = await companies.importFromMaps({
			businesses: [business()],
		});

		expect(result.added).toHaveLength(1);
		expect(result.skipped).toHaveLength(0);
		const created = result.added[0];
		if (!created) throw new Error("expected an added company");

		const row = await db.company.findUnique({
			where: { id: created.companyId },
		});
		expect(row?.googleBusinessId).toBe(mapsId);
		expect(row?.domain).toBe(domain);
		expect(row?.phone).toBe("+49 30 111111");
		expect(row?.city).toBe("Berlin");
		expect(row?.countryCode).toBe("DE");
		expect(row?.industry).toBe("Hotel");
		expect(row?.source).toBe("IMPORT");
	});

	it("skips the same Google Business id", async () => {
		const result = await companies.importFromMaps({
			businesses: [business({ website: null, domain: null })],
		});

		expect(result.added).toHaveLength(0);
		expect(result.skipped).toEqual([
			expect.objectContaining({
				mapsId,
				reason: "duplicate",
			}),
		]);
	});

	it("skips a second Maps place with the same domain", async () => {
		const result = await companies.importFromMaps({
			businesses: [
				business({
					id: mapsIdTwo,
					name: `Maps Import ${suffix} Twin`,
				}),
			],
		});

		expect(result.added).toHaveLength(0);
		expect(result.skipped[0]?.reason).toBe("duplicate");
	});

	it("skips a duplicate inside the same batch", async () => {
		await clean();

		const result = await companies.importFromMaps({
			businesses: [
				business({ id: mapsId }),
				business({
					id: mapsIdTwo,
					name: `Maps Import ${suffix} Twin`,
				}),
			],
		});

		expect(result.added).toHaveLength(1);
		expect(result.skipped).toHaveLength(1);
		expect(result.skipped[0]?.mapsId).toBe(mapsIdTwo);
	});
});
