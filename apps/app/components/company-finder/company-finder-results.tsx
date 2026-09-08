"use client";

import { Badge } from "@crm/ui/components/badge";
import { Link } from "@crm/ui/components/link";
import { cn } from "@crm/ui/lib/utils";
import type { FoundBusiness } from "@crm/validation/google-maps-search";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const CompanyFinderMap = dynamic(
	() => import("./company-finder-map").then((mod) => mod.CompanyFinderMap),
	{ ssr: false },
);

export function CompanyFinderResults({
	businesses,
	query,
}: {
	businesses: FoundBusiness[];
	query: string;
}) {
	const [selectedId, setSelectedId] = useState<string | null>(
		businesses[0]?.id ?? null,
	);
	const flyToRef = useRef<((lat: number, lng: number) => void) | null>(null);
	const mapped = businesses.filter(
		(business) => business.lat !== null && business.lng !== null,
	);

	const select = (id: string) => {
		setSelectedId(id);
		const business = businesses.find((item) => item.id === id);
		if (business?.lat !== null && business?.lng !== null && business) {
			flyToRef.current?.(business.lat, business.lng);
		}
	};

	return (
		<div className="grid min-h-0 flex-1 overflow-hidden rounded-lg border lg:grid-cols-2">
			<div className="min-h-0 overflow-y-auto border-b lg:border-b-0 lg:border-r">
				<p className="sticky top-0 z-10 border-b bg-background px-4 py-2 text-muted-foreground text-xs">
					{businesses.length} Treffer für „{query}“ · nicht in der CRM
					gespeichert
				</p>
				<div className="grid gap-3 p-3 sm:grid-cols-2">
					{businesses.map((business) => (
						<BusinessCard
							key={business.id}
							business={business}
							selected={business.id === selectedId}
							onSelect={() => select(business.id)}
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
	onSelect,
}: {
	business: FoundBusiness;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"flex flex-col overflow-hidden rounded-lg border bg-card text-left outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/60",
				selected && "border-primary ring-2 ring-primary/30",
			)}
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
			<div className="flex flex-1 flex-col gap-2 p-3">
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
	);
}
