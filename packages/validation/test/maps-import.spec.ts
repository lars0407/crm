import { describe, expect, it } from "bun:test";
import {
	isMapsDuplicate,
	mapsImportInput,
	mapsImportKey,
} from "../src/maps-import";

function key(partial: Partial<Parameters<typeof mapsImportKey>[0]> = {}) {
	return mapsImportKey({
		id: "biz-1",
		name: "Park Inn Berlin",
		domain: "parkinn.com",
		city: "Berlin",
		phone: "+49 30 23890",
		...partial,
	});
}

describe("mapsImportInput", () => {
	it("refuses an empty batch", () => {
		expect(mapsImportInput.safeParse({ businesses: [] }).success).toBe(false);
	});
});

describe("isMapsDuplicate", () => {
	it("matches the same Google Business id", () => {
		expect(
			isMapsDuplicate(key({ domain: null, city: null, phone: null }), key()),
		).toBe(true);
	});

	it("matches the same domain", () => {
		expect(
			isMapsDuplicate(
				key({ id: "a", name: "Park Inn" }),
				key({ id: "b", name: "Park Inn Hotel" }),
			),
		).toBe(true);
	});

	it("matches the same name and city", () => {
		expect(
			isMapsDuplicate(
				key({ id: "a", domain: null, phone: null }),
				key({ id: "b", domain: null, phone: "+1 415 555 0100" }),
			),
		).toBe(true);
	});

	it("matches the same name and phone", () => {
		expect(
			isMapsDuplicate(
				key({ id: "a", domain: null, city: "Munich" }),
				key({ id: "b", domain: null, city: "Berlin" }),
			),
		).toBe(true);
	});

	it("does not match the same name in two cities without a phone", () => {
		expect(
			isMapsDuplicate(
				key({
					id: "a",
					domain: null,
					city: "Berlin",
					phone: null,
				}),
				key({
					id: "b",
					domain: null,
					city: "Munich",
					phone: null,
				}),
			),
		).toBe(false);
	});
});
