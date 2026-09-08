"use client";

import { useMountEffect } from "@crm/ui/hooks/use-mount-effect";
import type { FoundBusiness } from "@crm/validation/google-maps-search";
import type { Map as LeafletMap } from "leaflet";
import { type MutableRefObject, useRef } from "react";
import { GOOGLE_MAPS_SEARCH } from "@/lib/google-maps-config";
import "leaflet/dist/leaflet.css";

export function CompanyFinderMap({
	businesses,
	selectedId,
	onSelect,
	flyToRef,
}: {
	businesses: FoundBusiness[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	flyToRef: MutableRefObject<((lat: number, lng: number) => void) | null>;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<LeafletMap | null>(null);
	const onSelectRef = useRef(onSelect);
	onSelectRef.current = onSelect;

	useMountEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let cancelled = false;
		let map: LeafletMap | null = null;

		void import("leaflet").then((leaflet) => {
			if (cancelled || !containerRef.current) return;

			const L = leaflet.default;
			const center =
				firstPoint(businesses) ?? GOOGLE_MAPS_SEARCH.map.fallbackCenter;

			map = L.map(container, {
				zoomControl: true,
				attributionControl: true,
			}).setView(
				[center.lat, center.lng],
				firstPoint(businesses)
					? GOOGLE_MAPS_SEARCH.map.focusZoom
					: GOOGLE_MAPS_SEARCH.map.fallbackZoom,
			);

			L.tileLayer(GOOGLE_MAPS_SEARCH.map.tileUrl, {
				attribution: GOOGLE_MAPS_SEARCH.map.attribution,
			}).addTo(map);

			for (const business of businesses) {
				if (business.lat === null || business.lng === null) continue;

				const marker = L.circleMarker([business.lat, business.lng], {
					radius: 8,
					weight: 2,
					color: business.id === selectedId ? "#006B4F" : "#ffffff",
					fillColor: "#006B4F",
					fillOpacity: 1,
				}).addTo(map);

				marker.on("click", () => onSelectRef.current(business.id));
			}

			mapRef.current = map;
			flyToRef.current = (lat, lng) => {
				map?.flyTo([lat, lng], GOOGLE_MAPS_SEARCH.map.focusZoom);
			};
			map.invalidateSize();
		});

		return () => {
			cancelled = true;
			flyToRef.current = null;
			map?.remove();
			mapRef.current = null;
		};
	});

	return (
		<div
			ref={containerRef}
			className="size-full grayscale-[40%]"
			role="presentation"
		/>
	);
}

function firstPoint(
	businesses: FoundBusiness[],
): { lat: number; lng: number } | null {
	for (const business of businesses) {
		if (business.lat !== null && business.lng !== null) {
			return { lat: business.lat, lng: business.lng };
		}
	}

	return null;
}
