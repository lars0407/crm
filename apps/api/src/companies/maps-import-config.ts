import { PRIORITY } from "@crm/db/agent-tasks";

export const MAPS_IMPORT = {
	research: {
		brand: {
			kind: "brand",
			reason: "New company",
			priority: PRIORITY.brand,
			budget: 2,
		},
		companyProfile: {
			kind: "company-profile",
			reason: "New company",
			priority: PRIORITY.companyProfile,
			budget: 4,
		},
	},
} as const;
