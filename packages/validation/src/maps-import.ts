import { z } from "zod";
import { type FoundBusiness, SEARCH_LIMITS } from "./google-maps-search";

const text = z.string().trim().min(1).max(2000).nullable();

export const mapsImportBusiness = z.object({
	id: z.string().trim().min(1).max(200),
	name: z.string().trim().min(1).max(200),
	address: text,
	city: text,
	country: text,
	phone: text,
	website: text,
	domain: text,
	email: z.string().trim().max(320).nullable(),
	linkedin: text,
	category: text,
	mapsUrl: text,
});

export const mapsImportInput = z.object({
	businesses: z.array(mapsImportBusiness).min(1).max(SEARCH_LIMITS.limit.max),
});

export type MapsImportBusiness = z.infer<typeof mapsImportBusiness>;
export type MapsImportInput = z.infer<typeof mapsImportInput>;

export const mapsImportSkipReason = z.enum(["duplicate"]);

export const mapsImportResult = z.object({
	added: z.array(
		z.object({
			mapsId: z.string(),
			companyId: z.string(),
			name: z.string(),
		}),
	),
	skipped: z.array(
		z.object({
			mapsId: z.string(),
			companyId: z.string().nullable(),
			name: z.string(),
			reason: mapsImportSkipReason,
		}),
	),
});

export type MapsImportResult = z.infer<typeof mapsImportResult>;

export function toMapsImportBusiness(
	business: FoundBusiness,
): MapsImportBusiness {
	return mapsImportBusiness.parse({
		id: business.id,
		name: business.name,
		address: business.address,
		city: business.city,
		country: business.country,
		phone: business.phone,
		website: business.website,
		domain: business.domain,
		email: business.email,
		linkedin: business.linkedin,
		category: business.category,
		mapsUrl: business.mapsUrl,
	});
}

export type MapsImportKey = {
	googleBusinessId: string;
	domain: string | null;
	nameKey: string;
	cityKey: string | null;
	phoneKey: string | null;
};

export function mapsImportKey(input: {
	id?: string | null;
	name: string;
	domain?: string | null;
	city?: string | null;
	phone?: string | null;
}): MapsImportKey {
	return {
		googleBusinessId: input.id?.trim() ?? "",
		domain: blankToNull(input.domain?.trim().toLowerCase()),
		nameKey: normalizeName(input.name),
		cityKey: blankToNull(normalizeName(input.city ?? "")),
		phoneKey: normalizePhone(input.phone),
	};
}

export function isMapsDuplicate(left: MapsImportKey, right: MapsImportKey) {
	if (
		left.googleBusinessId &&
		left.googleBusinessId === right.googleBusinessId
	) {
		return true;
	}

	if (left.domain && left.domain === right.domain) return true;

	if (
		left.nameKey &&
		left.nameKey === right.nameKey &&
		left.cityKey &&
		left.cityKey === right.cityKey
	) {
		return true;
	}

	if (
		left.nameKey &&
		left.nameKey === right.nameKey &&
		left.phoneKey &&
		left.phoneKey === right.phoneKey
	) {
		return true;
	}

	return false;
}

function normalizeName(value: string) {
	return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePhone(value: string | null | undefined) {
	if (!value) return null;
	const digits = value.replace(/\D/g, "");
	return digits.length >= 6 ? digits : null;
}

function blankToNull(value: string | null | undefined) {
	if (!value) return null;
	return value.length > 0 ? value : null;
}
