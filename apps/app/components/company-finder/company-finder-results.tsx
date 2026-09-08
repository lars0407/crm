"use client";

import { Badge } from "@crm/ui/components/badge";
import { Button } from "@crm/ui/components/button";
import { Link } from "@crm/ui/components/link";
import { Spinner } from "@crm/ui/components/spinner";
import { cn } from "@crm/ui/lib/utils";
import type { FoundBusiness } from "@crm/validation/google-maps-search";
import {
	type MapsImportResult,
	toMapsImportBusiness,
} from "@crm/validation/maps-import";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useOpenRecord } from "@/components/crm/record-sheet/record-stack";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

const CompanyFinderMap = dynamic(
	() => import("./company-finder-map").then((mod) => mod.CompanyFinderMap),
	{ ssr: false },
);

type ImportStatus = "added" | "duplicate";

export function CompanyFinderResults({
	businesses,
	query,
}: {
	businesses: FoundBusiness[];
	query: string;
}) {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const openRecord = useOpenRecord();
	const [selectedId, setSelectedId] = useState<string | null>(
		businesses[0]?.id ?? null,
	);
	const [status, setStatus] = useState<Record<string, ImportStatus>>({});
	const flyToRef = useRef<
		((lat: number, lng: number, id: string) => void) | null
	>(null);
	const mapped = businesses.filter(
		(business) => business.lat !== null && business.lng !== null,
	);
	const pending = businesses.filter((business) => !status[business.id]);

	const importMaps = useMutation(
		trpc.companies.importFromMaps.mutationOptions({
			onSuccess: async (result, variables) => {
				await cache.company();
				setStatus((current) => applyImportStatus(current, result));
				toastImport(result);
				const added = result.added[0];
				if (variables.businesses.length === 1 && added) {
					openRecord({ kind: "company", id: added.companyId });
				}
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	const select = (id: string) => {
		setSelectedId(id);
		const business = businesses.find((item) => item.id === id);
		if (business?.lat !== null && business?.lng !== null && business) {
			flyToRef.current?.(business.lat, business.lng, id);
		}
	};

	const importBusinesses = (rows: FoundBusiness[]) => {
		if (rows.length === 0 || importMaps.isPending) return;
		importMaps.mutate({ businesses: rows.map(toMapsImportBusiness) });
	};

	return (
		<div className="grid min-h-0 flex-1 overflow-hidden rounded-lg border lg:grid-cols-2">
			<div className="min-h-0 overflow-y-auto border-b lg:border-b-0 lg:border-r">
				<div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background px-4 py-2">
					<p className="text-muted-foreground text-xs">
						{businesses.length} Treffer für „{query}“
					</p>
					<Button
						size="xs"
						disabled={pending.length === 0 || importMaps.isPending}
						onClick={() => importBusinesses(pending)}
					>
						{importMaps.isPending ? <Spinner /> : null}
						Alle hinzufügen
					</Button>
				</div>
				<div className="grid gap-3 p-3 sm:grid-cols-2">
					{businesses.map((business) => (
						<BusinessCard
							key={business.id}
							business={business}
							selected={business.id === selectedId}
							status={status[business.id]}
							pending={importMaps.isPending}
							onSelect={() => select(business.id)}
							onImport={() => importBusinesses([business])}
						/>
					))}
				</div>
			</div>
			<div className="relative min-h-[360px] lg:min-h-0">
				<CompanyFinderMap
					businesses={mapped}
					selectedId={selectedId}
					onSelect={select}
					flyToRef={flyToRef}
				/>
				<p className="pointer-events-none absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] text-muted-foreground ring-1 ring-border">
					{mapped.length} auf der Karte
				</p>
			</div>
		</div>
	);
}

function BusinessCard({
	business,
	selected,
	status,
	pending,
	onSelect,
	onImport,
}: {
	business: FoundBusiness;
	selected: boolean;
	status?: ImportStatus;
	pending: boolean;
	onSelect: () => void;
	onImport: () => void;
}) {
	return (
		<article
			className={cn(
				"flex flex-col overflow-hidden rounded-lg border bg-card text-left outline-none transition-colors hover:border-primary/40",
				selected && "border-primary ring-2 ring-primary/30",
			)}
		>
			<button
				type="button"
				onClick={onSelect}
				className="flex flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
			>
				{business.photoUrl ? (
					<div
						aria-hidden="true"
						className="h-32 bg-muted bg-cover bg-center"
						style={{
							backgroundImage: `url(${JSON.stringify(business.photoUrl)})`,
						}}
					/>
				) : (
					<div className="h-32 bg-muted" />
				)}
				<div className="flex flex-1 flex-col gap-2 p-3 pb-0">
					<div className="flex items-start justify-between gap-2">
						<p className="min-w-0 truncate text-muted-foreground text-xs">
							{business.city ?? business.country ?? "—"}
						</p>
						{business.rating !== null ? (
							<p className="shrink-0 text-xs">
								{business.rating.toFixed(1)}
								{business.reviewCount !== null
									? ` · ${business.reviewCount}`
									: null}
							</p>
						) : null}
					</div>
					<p className="font-medium text-sm leading-snug">{business.name}</p>
					{business.address ? (
						<p className="line-clamp-2 text-muted-foreground text-xs">
							{business.address}
						</p>
					) : null}
					<div className="mt-auto flex flex-wrap gap-1 pt-1">
						{business.category ? (
							<Badge variant="outline">{business.category}</Badge>
						) : null}
						{business.verified ? (
							<Badge variant="secondary">Verifiziert</Badge>
						) : null}
						{business.status ? (
							<Badge variant="ghost">{business.status}</Badge>
						) : null}
						{status === "added" ? <Badge>In der CRM</Badge> : null}
						{status === "duplicate" ? (
							<Badge variant="secondary">Bereits vorhanden</Badge>
						) : null}
					</div>
					{business.website || business.phone || business.mapsUrl ? (
						<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
							{business.website ? (
								<Link
									href={business.website}
									target="_blank"
									rel="noreferrer"
									onClick={(event) => event.stopPropagation()}
								>
									Website
								</Link>
							) : null}
							{business.phone ? (
								<Link
									href={`tel:${business.phone}`}
									onClick={(event) => event.stopPropagation()}
								>
									{business.phone}
								</Link>
							) : null}
							{business.mapsUrl ? (
								<Link
									href={business.mapsUrl}
									target="_blank"
									rel="noreferrer"
									onClick={(event) => event.stopPropagation()}
								>
									Google Maps
								</Link>
							) : null}
						</div>
					) : null}
				</div>
			</button>
			<div className="p-3 pt-2">
				<Button
					size="xs"
					variant="outline"
					disabled={Boolean(status) || pending}
					onClick={onImport}
				>
					{pending ? <Spinner /> : null}
					Hinzufügen
				</Button>
			</div>
		</article>
	);
}

function applyImportStatus(
	current: Record<string, ImportStatus>,
	result: MapsImportResult,
) {
	const next = { ...current };
	for (const row of result.added) next[row.mapsId] = "added";
	for (const row of result.skipped) next[row.mapsId] = "duplicate";
	return next;
}

function toastImport(result: MapsImportResult) {
	if (result.added.length > 0 && result.skipped.length > 0) {
		toast.success(
			`${result.added.length} hinzugefügt, ${result.skipped.length} schon in der CRM.`,
		);
		return;
	}

	const added = result.added[0];
	if (added && result.added.length === 1) {
		toast.success(`${added.name} hinzugefügt.`);
		return;
	}

	if (result.added.length > 1) {
		toast.success(`${result.added.length} Unternehmen hinzugefügt.`);
		return;
	}

	toast.success("Diese Unternehmen sind schon in der CRM.");
}
