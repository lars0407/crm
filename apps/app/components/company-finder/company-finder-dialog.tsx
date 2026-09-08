"use client";

import { Button } from "@crm/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@crm/ui/components/dialog";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import type { CompanyFinderValues } from "@/app/(app)/[slug]/company-finder/company-finder-search-params";
import { CompanyFinderForm } from "./company-finder-form";

export function CompanyFinderDialog({
	trigger,
	initial,
	open: openProp,
	onOpenChange,
}: {
	trigger?: ReactNode;
	initial?: CompanyFinderValues;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const router = useRouter();
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const open = openProp ?? uncontrolledOpen;
	const setOpen = onOpenChange ?? setUncontrolledOpen;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
			<DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Unternehmen auf Google Maps finden</DialogTitle>
					<DialogDescription>
						Die Treffer bleiben auf dem Bildschirm. Du kannst einzelne oder alle
						in die CRM schreiben.
					</DialogDescription>
				</DialogHeader>
				<CompanyFinderForm
					key={open ? "open" : "closed"}
					initial={initial}
					onSubmit={(href) => {
						setOpen(false);
						router.push(href);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}

export function CompanyFinderCard() {
	return (
		<CompanyFinderDialog
			trigger={
				<button
					type="button"
					className="flex w-full flex-col gap-2 rounded-lg border border-border bg-card p-3 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/60"
				>
					<div className="flex items-start gap-2">
						<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<svg
								aria-hidden="true"
								viewBox="0 0 24 24"
								className="size-4 fill-current"
							>
								<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5" />
							</svg>
						</span>
						<div className="min-w-0 flex-1">
							<div className="flex items-start justify-between gap-2">
								<p className="font-medium text-sm">
									Unternehmen Finden auf Google Maps
								</p>
								<span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
									Maps
								</span>
							</div>
							<p className="line-clamp-2 text-muted-foreground text-xs">
								Suche lokale Unternehmen nach Ort, Branche oder Name und zeige
								sie auf einer Karte.
							</p>
						</div>
					</div>
				</button>
			}
		/>
	);
}

export function CompanyFinderSearchButton({
	initial,
}: {
	initial: CompanyFinderValues;
}) {
	return (
		<CompanyFinderDialog
			initial={initial}
			trigger={<Button variant="outline">Suche anpassen</Button>}
		/>
	);
}
