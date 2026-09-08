import { describe, expect, it } from "bun:test";
import {
	googleMapsSearchInput,
	parseGoogleMapsSearch,
	UnreadableSearchResponse,
} from "../src/google-maps-search";

describe("googleMapsSearchInput", () => {
	it("fills defaults for a query", () => {
		expect(googleMapsSearchInput.parse({ query: "Hotels in Berlin" })).toEqual({
			query: "Hotels in Berlin",
			limit: 20,
			zoom: 13,
			language: "de",
			region: "de",
			lat: null,
			lng: null,
			subtypes: null,
			businessStatus: [],
			verifiedOnly: false,
			extractContacts: false,
		});
	});

	it("refuses a blank query", () => {
		expect(googleMapsSearchInput.safeParse({ query: " " }).success).toBe(false);
	});
});

describe("parseGoogleMapsSearch", () => {
	it("maps a business into the found shape", () => {
		const businesses = parseGoogleMapsSearch({
			status: "OK",
			data: [
				{
					business_id: "biz-1",
					name: "Hilton San Francisco",
					phone_number: "+14154336600",
					latitude: 37.795,
					longitude: -122.404,
					full_address: "750 Kearny St, San Francisco, CA 94108",
					city: "San Francisco",
					country: "US",
					review_count: 4627,
					rating: 3.9,
					website: "https://www.hilton.com/hotel",
					verified: true,
					place_link: "https://maps.google.com/?cid=1",
					business_status: "OPEN",
					type: "Hotel",
					photos_sample: [{ photo_url: "https://example.com/photo.jpg" }],
				},
			],
		});

		expect(businesses).toEqual([
			{
				id: "biz-1",
				name: "Hilton San Francisco",
				address: "750 Kearny St, San Francisco, CA 94108",
				city: "San Francisco",
				country: "US",
				phone: "+14154336600",
				website: "https://www.hilton.com/hotel",
				domain: "hilton.com",
				email: null,
				linkedin: null,
				rating: 3.9,
				reviewCount: 4627,
				verified: true,
				status: "OPEN",
				category: "Hotel",
				photoUrl: "https://example.com/photo.jpg",
				mapsUrl: "https://maps.google.com/?cid=1",
				lat: 37.795,
				lng: -122.404,
			},
		]);
	});

	it("returns an empty list when data is missing", () => {
		expect(parseGoogleMapsSearch({ status: "OK" })).toEqual([]);
	});

	it("throws when the payload is not an object", () => {
		expect(() => parseGoogleMapsSearch("nope")).toThrow(
			UnreadableSearchResponse,
		);
	});
});
