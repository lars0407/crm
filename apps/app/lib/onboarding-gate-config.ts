const SECOND_MS = 1_000;

export const ONBOARDING_GATE = {
	timeoutMs: 2 * SECOND_MS,
	cache: {
		ttlMs: 30 * SECOND_MS,
	},
} as const;
