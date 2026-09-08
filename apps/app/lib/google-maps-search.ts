import "server-only";

import {
	type FoundBusiness,
	type GoogleMapsSearchInput,
	parseGoogleMapsSearch,
	UnreadableSearchResponse,
} from "@crm/validation/google-maps-search";
import { GOOGLE_MAPS_SEARCH } from "@/lib/google-maps-config";

export type SearchOutcome =
	| { outcome: "found"; businesses: FoundBusiness[] }
	| { outcome: "unconfigured" }
	| { outcome: "failed"; reason: string };

export function googleMapsSearchConfigured(): boolean {
	return Boolean(process.env.RAPIDAPI_KEY?.trim());
}

export async function searchBusinesses(
	input: GoogleMapsSearchInput,
): Promise<SearchOutcome> {
	const key = process.env.RAPIDAPI_KEY?.trim();

	if (!key) return { outcome: "unconfigured" };

	const url = new URL(
		GOOGLE_MAPS_SEARCH.path,
		`https://${GOOGLE_MAPS_SEARCH.host}`,
	);

	url.searchParams.set("query", input.query);
	url.searchParams.set("limit", String(input.limit));
	url.searchParams.set("zoom", String(input.zoom));
	url.searchParams.set("language", input.language);
	url.searchParams.set("region", input.region);

	if (input.lat !== null) url.searchParams.set("lat", String(input.lat));
	if (input.lng !== null) url.searchParams.set("lng", String(input.lng));
	if (input.subtypes) url.searchParams.set("subtypes", input.subtypes);
	if (input.verifiedOnly) url.searchParams.set("verified", "true");
	if (input.businessStatus.length > 0) {
		url.searchParams.set("business_status", input.businessStatus.join(","));
	}
	if (input.extractContacts) {
		url.searchParams.set("extract_emails_and_contacts", "true");
	}

	try {
		const response = await fetch(url, {
			headers: {
				"x-rapidapi-host": GOOGLE_MAPS_SEARCH.host,
				"x-rapidapi-key": key,
			},
			signal: AbortSignal.timeout(GOOGLE_MAPS_SEARCH.timeoutMs),
			cache: "no-store",
		});

		if (!response.ok) {
			return { outcome: "failed", reason: describeStatus(response.status) };
		}

		return {
			outcome: "found",
			businesses: parseGoogleMapsSearch(await response.json()),
		};
	} catch (error) {
		if (error instanceof UnreadableSearchResponse) {
			return {
				outcome: "failed",
				reason: "Die Suchantwort ist unlesbar.",
			};
		}

		if (error instanceof Error && error.name === "TimeoutError") {
			return {
				outcome: "failed",
				reason:
					"Die Suche dauert zu lange. Grenze sie ein und versuche es erneut.",
			};
		}

		return {
			outcome: "failed",
			reason: error instanceof Error ? error.message : String(error),
		};
	}
}

function describeStatus(status: number): string {
	if (status === 401 || status === 403) {
		return "RapidAPI hat den Schlüssel abgelehnt. Prüfe RAPIDAPI_KEY und das Local-Business-Data-Abo.";
	}

	if (status === 429) {
		return "Das RapidAPI-Kontingent ist aufgebraucht.";
	}

	return `Der Suchanbieter antwortet mit ${status}.`;
}
