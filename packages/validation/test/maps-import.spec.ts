import { describe, expect, it } from "bun:test";
import {
	isMapsDuplicate,
	mapsImportBusiness,
	mapsImportInput,
	mapsImportKey,
	toMapsImportBusiness,
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

	it("turns blank optional fields into null", () => {
		const parsed = mapsImportBusiness.parse({
			id: "biz-1",
			name: "Park Inn Berlin",
			address: "  ",
			city: "",
			country: null,
			phone: null,
			website: null,
			domain: null,
			email: "   ",
			linkedin: null,
			category: null,
			mapsUrl: null,
		});

		expect(parsed.address).toBeNull();
		expect(parsed.city).toBeNull();
		expect(parsed.email).toBeNull();
	});

	it("accepts a Maps result with blank city for import", () => {
		const business = toMapsImportBusiness({
			id: "biz-blank-city",
			name: "Café Mitte",
			address: null,
			city: "",
			country: "DE",
			phone: null,
			website: null,
			domain: null,
			email: null,
			linkedin: null,
			rating: null,
			reviewCount: null,
			verified: false,
			status: null,
			category: "Café",
			photoUrl: null,
			mapsUrl: null,
			lat: 52.5,
			lng: 13.4,
		});

		expect(business.city).toBeNull();
		expect(business.country).toBe("DE");
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
