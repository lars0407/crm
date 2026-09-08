import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@crm/ui/components/empty";
import type { GoogleMapsSearchInput } from "@crm/validation/google-maps-search";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
	loadCompanyFinderParams,
	toSearchInput,
} from "@/app/(app)/[slug]/company-finder/company-finder-search-params";
import { CompanyFinderSearchButton } from "@/components/company-finder/company-finder-dialog";
import { CompanyFinderResults } from "@/components/company-finder/company-finder-results";
import {
	PageShell,
	PageShellActions,
	PageShellContent,
	PageShellDescription,
	PageShellHeader,
	PageShellHeading,
	PageShellLoading,
	PageShellTitle,
} from "@/components/page-shell";
import {
	googleMapsSearchConfigured,
	searchBusinesses,
} from "@/lib/google-maps-search";
import { requireSession } from "@/lib/session";
import { workspaceUrl } from "@/lib/workspace-url";

export const metadata: Metadata = {
	title: "Unternehmen finden",
};

export default function CompanyFinderPage({
	params,
	searchParams,
}: PageProps<"/[slug]/company-finder">) {
	return (
		<PageShell className="min-h-0" contained>
			<Suspense fallback={<PageShellLoading />}>
				<CompanyFinder params={params} searchParams={searchParams} />
			</Suspense>
		</PageShell>
	);
}

async function CompanyFinder({
	params,
	searchParams,
}: Pick<PageProps<"/[slug]/company-finder">, "params" | "searchParams">) {
	const [{ slug }, values] = await Promise.all([
		params,
		loadCompanyFinderParams(searchParams),
	]);
	await requireSession();

	const parsed = toSearchInput(values);
	const configured = googleMapsSearchConfigured();

	return (
		<>
			<PageShellHeader>
				<PageShellHeading>
					<PageShellTitle>Unternehmen auf Google Maps</PageShellTitle>
					<PageShellDescription>
						<Link
							href={workspaceUrl(slug, "/chat")}
							className="underline-offset-4 hover:underline"
						>
							Zurück zum Chat
						</Link>
						{" · "}
						Treffer bleiben auf dem Bildschirm. Du kannst sie in die CRM
						übernehmen.
					</PageShellDescription>
				</PageShellHeading>
				<PageShellActions>
					<CompanyFinderSearchButton initial={values} />
				</PageShellActions>
			</PageShellHeader>
			<PageShellContent className="min-h-0">
				{!configured ? (
					<SetupEmpty />
				) : !parsed.success ? (
					<Empty className="border">
						<EmptyHeader>
							<EmptyTitle>Suchbegriff fehlt</EmptyTitle>
							<EmptyDescription>
								Öffne das Formular und starte eine Suche.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<SearchResults input={parsed.data} query={values.query} />
				)}
			</PageShellContent>
		</>
	);
}

async function SearchResults({
	input,
	query,
}: {
	input: GoogleMapsSearchInput;
	query: string;
}) {
	const result = await searchBusinesses(input);

	if (result.outcome === "unconfigured") return <SetupEmpty />;

	if (result.outcome === "failed") {
		return (
			<Empty className="border">
				<EmptyHeader>
					<EmptyTitle>Suche fehlgeschlagen</EmptyTitle>
					<EmptyDescription>{result.reason}</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	if (result.businesses.length === 0) {
		return (
			<Empty className="border">
				<EmptyHeader>
					<EmptyTitle>Keine Treffer</EmptyTitle>
					<EmptyDescription>
						Kein Unternehmen passt zu „{query}“.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return <CompanyFinderResults businesses={result.businesses} query={query} />;
}

function SetupEmpty() {
	return (
		<Empty className="border">
			<EmptyHeader>
				<EmptyTitle>Suche ist nicht eingerichtet</EmptyTitle>
				<EmptyDescription>
					Setze RAPIDAPI_KEY, dann startet die Suche gegen Local Business Data.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
