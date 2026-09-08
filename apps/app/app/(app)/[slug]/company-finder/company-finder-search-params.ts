import {
	BUSINESS_STATUS,
	googleMapsSearchInput,
	SEARCH_LIMITS,
} from "@crm/validation/google-maps-search";
import {
	createLoader,
	createSerializer,
	parseAsArrayOf,
	parseAsBoolean,
	parseAsFloat,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";

export const companyFinderParsers = {
	query: parseAsString.withDefault(""),
	limit: parseAsInteger.withDefault(SEARCH_LIMITS.limit.fallback),
	zoom: parseAsInteger.withDefault(SEARCH_LIMITS.zoom.fallback),
	language: parseAsString.withDefault("de"),
	region: parseAsString.withDefault("de"),
	lat: parseAsFloat,
	lng: parseAsFloat,
	subtypes: parseAsString,
	status: parseAsArrayOf(
		parseAsStringLiteral(BUSINESS_STATUS),
		",",
	).withDefault([]),
	verified: parseAsBoolean.withDefault(false),
	contacts: parseAsBoolean.withDefault(false),
};

export const loadCompanyFinderParams = createLoader(companyFinderParsers);
export const serializeCompanyFinderParams =
	createSerializer(companyFinderParsers);

export type CompanyFinderValues = Awaited<
	ReturnType<typeof loadCompanyFinderParams>
>;

export function toSearchInput(values: CompanyFinderValues) {
	return googleMapsSearchInput.safeParse({
		query: values.query,
		limit: values.limit,
		zoom: values.zoom,
		language: values.language,
		region: values.region,
		lat: values.lat,
		lng: values.lng,
		subtypes: values.subtypes,
		businessStatus: values.status,
		verifiedOnly: values.verified,
		extractContacts: values.contacts,
	});
}
