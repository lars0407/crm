"use client";

import { useMountEffect } from "@crm/ui/hooks/use-mount-effect";
import type { FoundBusiness } from "@crm/validation/google-maps-search";
import type { CircleMarker, Map as LeafletMap } from "leaflet";
import { type MutableRefObject, useRef } from "react";
import { GOOGLE_MAPS_SEARCH } from "@/lib/google-maps-config";
import "leaflet/dist/leaflet.css";

type FlyTo = (lat: number, lng: number, id: string) => void;

export function CompanyFinderMap({
	businesses,
	selectedId,
	onSelect,
	flyToRef,
}: {
	businesses: FoundBusiness[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	flyToRef: MutableRefObject<FlyTo | null>;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
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

			const leafletMap = L.map(container, {
				zoomControl: true,
				attributionControl: true,
			}).setView(
				[center.lat, center.lng],
				firstPoint(businesses)
					? GOOGLE_MAPS_SEARCH.map.focusZoom
					: GOOGLE_MAPS_SEARCH.map.fallbackZoom,
			);
			map = leafletMap;

			if (cancelled) {
				leafletMap.remove();
				return;
			}

			L.tileLayer(GOOGLE_MAPS_SEARCH.map.tileUrl, {
				attribution: GOOGLE_MAPS_SEARCH.map.attribution,
			}).addTo(leafletMap);

			const markers = new Map<string, CircleMarker>();

			for (const business of businesses) {
				if (business.lat === null || business.lng === null) continue;

				const marker = L.circleMarker(
					[business.lat, business.lng],
					markerOptions(business.id === selectedId),
				).addTo(leafletMap);

				marker.on("click", () => onSelectRef.current(business.id));
				markers.set(business.id, marker);
			}

			flyToRef.current = (lat, lng, id) => {
				paintSelection(markers, id);
				leafletMap.flyTo([lat, lng], GOOGLE_MAPS_SEARCH.map.focusZoom);
			};
			leafletMap.invalidateSize();
		});

		return () => {
			cancelled = true;
			flyToRef.current = null;
			map?.remove();
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

function markerOptions(selected: boolean) {
	const ring = selected
		? GOOGLE_MAPS_SEARCH.marker.selected
		: GOOGLE_MAPS_SEARCH.marker.idle;

	return {
		radius: ring.radius,
		weight: ring.weight,
		color: ring.color,
		fillColor: GOOGLE_MAPS_SEARCH.marker.fill,
		fillOpacity: 1,
	};
}

function paintSelection(markers: Map<string, CircleMarker>, id: string) {
	for (const [markerId, marker] of markers) {
		const selected = markerId === id;
		marker.setStyle(markerOptions(selected));
		if (selected) marker.bringToFront();
	}
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
