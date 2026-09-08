import { z } from "zod";

export const BUSINESS_STATUS = [
	"OPEN",
	"CLOSED_TEMPORARILY",
	"CLOSED",
] as const;

export const SEARCH_LIMITS = {
	query: { min: 2, max: 200 },
	limit: { min: 1, max: 100, fallback: 20 },
	zoom: { min: 3, max: 21, fallback: 13 },
} as const;

export const googleMapsSearchInput = z.object({
	query: z
		.string()
		.trim()
		.min(SEARCH_LIMITS.query.min)
		.max(SEARCH_LIMITS.query.max),
	limit: z
		.number()
		.int()
		.min(SEARCH_LIMITS.limit.min)
		.max(SEARCH_LIMITS.limit.max)
		.default(SEARCH_LIMITS.limit.fallback),
	zoom: z
		.number()
		.int()
		.min(SEARCH_LIMITS.zoom.min)
		.max(SEARCH_LIMITS.zoom.max)
		.default(SEARCH_LIMITS.zoom.fallback),
	language: z.string().trim().length(2).default("de"),
	region: z.string().trim().length(2).default("de"),
	lat: z.number().min(-90).max(90).nullable().default(null),
	lng: z.number().min(-180).max(180).nullable().default(null),
	subtypes: z.string().trim().max(200).nullable().default(null),
	businessStatus: z.array(z.enum(BUSINESS_STATUS)).default([]),
	verifiedOnly: z.boolean().default(false),
	extractContacts: z.boolean().default(false),
});

export type GoogleMapsSearchInput = z.infer<typeof googleMapsSearchInput>;

const text = z.string().nullish().catch(null);
const number = z.number().nullish().catch(null);

const emailsAndContacts = z
	.object({
		emails: z.array(z.string()).nullish().catch(null),
		phone_numbers: z.array(z.string()).nullish().catch(null),
		linkedin: text,
		facebook: text,
		instagram: text,
		twitter: text,
		website: text,
	})
	.nullish()
	.catch(null);

const localBusiness = z.object({
	business_id: z.string(),
	name: text,
	phone_number: text,
	latitude: number,
	longitude: number,
	full_address: text,
	street_address: text,
	city: text,
	zipcode: text,
	state: text,
	country: text,
	district: text,
	review_count: number,
	rating: number,
	website: text,
	verified: z.boolean().nullish().catch(null),
	place_link: text,
	business_status: text,
	type: text,
	subtypes: z.array(z.string()).nullish().catch(null),
	photos_sample: z
		.array(z.object({ photo_url: text, photo_url_large: text }))
		.nullish()
		.catch(null),
	emails_and_contacts: emailsAndContacts,
});

const localBusinessSearchResponse = z.object({
	status: z.string().nullish().catch(null),
	request_id: text,
	data: z.array(localBusiness).nullish().catch(null),
});

export type LocalBusiness = z.infer<typeof localBusiness>;

export type FoundBusiness = {
	id: string;
	name: string;
	address: string | null;
	city: string | null;
	country: string | null;
	phone: string | null;
	website: string | null;
	domain: string | null;
	email: string | null;
	linkedin: string | null;
	rating: number | null;
	reviewCount: number | null;
	verified: boolean;
	status: string | null;
	category: string | null;
	photoUrl: string | null;
	mapsUrl: string | null;
	lat: number | null;
	lng: number | null;
};

export class UnreadableSearchResponse extends Error {
	constructor(readonly issues: string) {
		super(`The Google Maps search response is unreadable: ${issues}`);
		this.name = "UnreadableSearchResponse";
	}
}

export function parseGoogleMapsSearch(value: unknown): FoundBusiness[] {
	const parsed = localBusinessSearchResponse.safeParse(value);

	if (!parsed.success) {
		throw new UnreadableSearchResponse(
			parsed.error.issues
				.map(
					(issue) => `${issue.path.join(".") || "response"} ${issue.message}`,
				)
				.join("; "),
		);
	}

	return (parsed.data.data ?? []).map(toFoundBusiness);
}

function toFoundBusiness(business: LocalBusiness): FoundBusiness {
	const website =
		business.website ?? business.emails_and_contacts?.website ?? null;

	return {
		id: business.business_id,
		name: business.name ?? "Unnamed business",
		address: business.full_address ?? business.street_address ?? null,
		city: business.city ?? null,
		country: business.country ?? null,
		phone:
			business.phone_number ??
			business.emails_and_contacts?.phone_numbers?.[0] ??
			null,
		website,
		domain: domainOf(website),
		email: business.emails_and_contacts?.emails?.[0] ?? null,
		linkedin: business.emails_and_contacts?.linkedin ?? null,
		rating: business.rating ?? null,
		reviewCount: business.review_count ?? null,
		verified: business.verified === true,
		status: business.business_status ?? null,
		category: business.type ?? business.subtypes?.[0] ?? null,
		photoUrl: business.photos_sample?.[0]?.photo_url ?? null,
		mapsUrl: business.place_link ?? null,
		lat: business.latitude ?? null,
		lng: business.longitude ?? null,
	};
}

function domainOf(website: string | null): string | null {
	if (!website) return null;

	try {
		return new URL(website).hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
}
