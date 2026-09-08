"use client";

import { Button } from "@crm/ui/components/button";
import { Checkbox } from "@crm/ui/components/checkbox";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@crm/ui/components/field";
import { Input } from "@crm/ui/components/input";
import { Switch } from "@crm/ui/components/switch";
import {
	BUSINESS_STATUS,
	SEARCH_LIMITS,
} from "@crm/validation/google-maps-search";
import { useId, useState } from "react";
import type { CompanyFinderValues } from "@/app/(app)/[slug]/company-finder/company-finder-search-params";
import { serializeCompanyFinderParams } from "@/app/(app)/[slug]/company-finder/company-finder-search-params";
import { useWorkspaceUrl } from "@/lib/use-workspace-url";

const STATUS_LABELS: Record<(typeof BUSINESS_STATUS)[number], string> = {
	OPEN: "Offen",
	CLOSED_TEMPORARILY: "Vorübergehend geschlossen",
	CLOSED: "Geschlossen",
};

export const EMPTY_SEARCH: CompanyFinderValues = {
	query: "",
	limit: SEARCH_LIMITS.limit.fallback,
	zoom: SEARCH_LIMITS.zoom.fallback,
	language: "de",
	region: "de",
	lat: null,
	lng: null,
	subtypes: null,
	status: [],
	verified: false,
	contacts: false,
};

export function CompanyFinderForm({
	initial,
	onSubmit,
}: {
	initial?: CompanyFinderValues;
	onSubmit: (href: string) => void;
}) {
	const workspaceUrl = useWorkspaceUrl();
	const queryId = useId();
	const limitId = useId();
	const zoomId = useId();
	const languageId = useId();
	const regionId = useId();
	const latId = useId();
	const lngId = useId();
	const subtypesId = useId();
	const statusId = useId();
	const [values, setValues] = useState<CompanyFinderValues>(
		initial ?? EMPTY_SEARCH,
	);

	const patch = (next: Partial<CompanyFinderValues>) => {
		setValues((current) => ({ ...current, ...next }));
	};

	return (
		<form
			className="flex flex-col gap-4"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit(
					serializeCompanyFinderParams(workspaceUrl("/company-finder"), values),
				);
			}}
		>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={queryId}>Suchbegriff</FieldLabel>
					<Input
						id={queryId}
						required
						minLength={SEARCH_LIMITS.query.min}
						maxLength={SEARCH_LIMITS.query.max}
						placeholder="Hotels in Berlin, Deutschland"
						value={values.query}
						onChange={(event) => patch({ query: event.target.value })}
					/>
					<FieldDescription>
						Ort, Branche oder Name. Zum Beispiel „Handwerker in München“.
					</FieldDescription>
				</Field>

				<div className="grid grid-cols-2 gap-3">
					<Field>
						<FieldLabel htmlFor={limitId}>Limit</FieldLabel>
						<Input
							id={limitId}
							type="number"
							min={SEARCH_LIMITS.limit.min}
							max={SEARCH_LIMITS.limit.max}
							value={values.limit}
							onChange={(event) => patch({ limit: Number(event.target.value) })}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor={zoomId}>Zoom</FieldLabel>
						<Input
							id={zoomId}
							type="number"
							min={SEARCH_LIMITS.zoom.min}
							max={SEARCH_LIMITS.zoom.max}
							value={values.zoom}
							onChange={(event) => patch({ zoom: Number(event.target.value) })}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor={languageId}>Sprache</FieldLabel>
						<Input
							id={languageId}
							maxLength={2}
							value={values.language}
							onChange={(event) =>
								patch({ language: event.target.value.toLowerCase() })
							}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor={regionId}>Region</FieldLabel>
						<Input
							id={regionId}
							maxLength={2}
							value={values.region}
							onChange={(event) =>
								patch({ region: event.target.value.toLowerCase() })
							}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor={latId}>Breitengrad</FieldLabel>
						<Input
							id={latId}
							type="number"
							step="any"
							placeholder="52.52"
							value={values.lat ?? ""}
							onChange={(event) =>
								patch({
									lat:
										event.target.value === ""
											? null
											: Number(event.target.value),
								})
							}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor={lngId}>Längengrad</FieldLabel>
						<Input
							id={lngId}
							type="number"
							step="any"
							placeholder="13.40"
							value={values.lng ?? ""}
							onChange={(event) =>
								patch({
									lng:
										event.target.value === ""
											? null
											: Number(event.target.value),
								})
							}
						/>
					</Field>
				</div>

				<Field>
					<FieldLabel htmlFor={subtypesId}>Kategorien</FieldLabel>
					<Input
						id={subtypesId}
						placeholder="Hotel,Restaurant,Bar"
						value={values.subtypes ?? ""}
						onChange={(event) =>
							patch({
								subtypes:
									event.target.value.trim() === "" ? null : event.target.value,
							})
						}
					/>
					<FieldDescription>
						Kommagetrennte Google-Business-Kategorien.
					</FieldDescription>
				</Field>

				<Field>
					<FieldLabel>Status</FieldLabel>
					<div className="flex flex-col gap-2">
						{BUSINESS_STATUS.map((status) => {
							const id = `${statusId}-${status}`;
							return (
								<div key={status} className="flex items-center gap-2 text-xs">
									<Checkbox
										id={id}
										checked={values.status.includes(status)}
										onCheckedChange={(checked) =>
											patch({
												status:
													checked === true
														? [...values.status, status]
														: values.status.filter((value) => value !== status),
											})
										}
									/>
									<FieldLabel htmlFor={id}>{STATUS_LABELS[status]}</FieldLabel>
								</div>
							);
						})}
					</div>
				</Field>

				<Field orientation="horizontal">
					<Switch
						checked={values.verified}
						onCheckedChange={(verified) => patch({ verified })}
					/>
					<FieldLabel>Nur verifizierte Unternehmen</FieldLabel>
				</Field>

				<Field orientation="horizontal">
					<Switch
						checked={values.contacts}
						onCheckedChange={(contacts) => patch({ contacts })}
					/>
					<div>
						<FieldLabel>E-Mails und Kontakte laden</FieldLabel>
						<FieldDescription>
							Kostet extra Credits. Du fügst Treffer danach selbst zur CRM
							hinzu.
						</FieldDescription>
					</div>
				</Field>
			</FieldGroup>

			<Button type="submit">Suche starten</Button>
		</form>
	);
}
