const SECOND_MS = 1_000;

export const GOOGLE_MAPS_SEARCH = {
	host: "local-business-data.p.rapidapi.com",
	path: "/search",
	timeoutMs: 45 * SECOND_MS,
	map: {
		tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
		fallbackCenter: { lat: 51.1657, lng: 10.4515 },
		fallbackZoom: 5,
		focusZoom: 15,
	},
	marker: {
		fill: "#006B4F",
		selected: { radius: 10, weight: 3, color: "#006B4F" },
		idle: { radius: 8, weight: 2, color: "#ffffff" },
	},
} as const;
