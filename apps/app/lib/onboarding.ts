import type { NextRequest } from "next/server";
import { z } from "zod";
import { API_URL } from "@/lib/env";
import { ONBOARDING_GATE } from "@/lib/onboarding-gate-config";

export const ONBOARDING_PATH = "/onboarding";

export const RESEARCH_PATH = "/onboarding/research";

export type Gate = "settled" | "required" | "unknown";

export type WorkspaceGate = { gate: Gate; slug: string | null };

type CacheEntry<T> = { value: T; expiresAt: number };

const workspaceCache = new Map<string, CacheEntry<WorkspaceGate>>();

const researchCache = new Map<string, CacheEntry<Gate>>();

const procedureResult = z
	.object({ result: z.object({ data: z.json() }).catch({ data: null }) })
	.catch({ result: { data: null } });

const workspaceAnswer = z
	.object({
		onboarded: z.boolean().nullable().catch(null),
		canRename: z.boolean().nullable().catch(null),
		slug: z.string().min(1).nullable().catch(null),
	})
	.catch({ onboarded: null, canRename: null, slug: null });

const researchKeyAnswer = z
	.object({ configured: z.boolean().nullable().catch(null) })
	.catch({ configured: null });

export function clearOnboardingGateCache() {
	workspaceCache.clear();
	researchCache.clear();
}

function readCache<T>(map: Map<string, CacheEntry<T>>, key: string): T | null {
	const entry = map.get(key);

	if (!entry) return null;

	if (Date.now() >= entry.expiresAt) {
		map.delete(key);
		return null;
	}

	return entry.value;
}

function writeSettledCache<T>(
	map: Map<string, CacheEntry<T>>,
	key: string,
	value: T,
) {
	map.set(key, {
		value,
		expiresAt: Date.now() + ONBOARDING_GATE.cache.ttlMs,
	});
}

async function read(request: NextRequest, procedure: string) {
	const cookie = request.headers.get("cookie");

	if (!cookie) return null;

	try {
		const response = await fetch(`${API_URL}/api/trpc/${procedure}`, {
			headers: { cookie },
			cache: "no-store",
			signal: AbortSignal.timeout(ONBOARDING_GATE.timeoutMs),
		});

		if (!response.ok) return null;

		return procedureResult.parse(await response.json()).result.data;
	} catch {
		return null;
	}
}

export async function readWorkspaceGate(
	request: NextRequest,
): Promise<WorkspaceGate> {
	const cookie = request.headers.get("cookie");

	if (cookie) {
		const hit = readCache(workspaceCache, cookie);
		if (hit) return hit;
	}

	const workspace = workspaceAnswer.parse(await read(request, "workspace.get"));

	const slug = workspace.slug;

	if (workspace.onboarded === null) {
		return { gate: "unknown", slug };
	}

	const result: WorkspaceGate = {
		gate:
			workspace.onboarded || workspace.canRename !== true
				? "settled"
				: "required",
		slug,
	};

	if (cookie && result.gate === "settled") {
		writeSettledCache(workspaceCache, cookie, result);
	}

	return result;
}

export async function readResearchGate(request: NextRequest): Promise<Gate> {
	const cookie = request.headers.get("cookie");

	if (cookie) {
		const hit = readCache(researchCache, cookie);
		if (hit) return hit;
	}

	const { configured } = researchKeyAnswer.parse(
		await read(request, "settings.researchKey"),
	);

	if (configured === null) return "unknown";

	const result: Gate = configured ? "settled" : "required";

	if (cookie && result === "settled") {
		writeSettledCache(researchCache, cookie, result);
	}

	return result;
}
