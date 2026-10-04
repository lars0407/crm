import { Skeleton } from "@crm/ui/components/skeleton";
import {
	PageShell,
	PageShellActions,
	PageShellContent,
	PageShellDescription,
	PageShellHeader,
	PageShellHeading,
	PageShellTitle,
} from "@/components/page-shell";

export default function Loading() {
	return (
		<PageShell className="min-h-0" contained aria-busy="true">
			<PageShellHeader>
				<PageShellHeading>
					<PageShellTitle>Unternehmen auf Google Maps</PageShellTitle>
					<PageShellDescription>
						Treffer bleiben auf dem Bildschirm. Du kannst sie in die CRM
						übernehmen.
					</PageShellDescription>
				</PageShellHeading>
				<PageShellActions>
					<Skeleton className="h-9 w-32" />
				</PageShellActions>
			</PageShellHeader>
			<PageShellContent className="min-h-0">
				<div
					className="grid min-h-0 flex-1 overflow-hidden rounded-lg border lg:grid-cols-2"
					aria-hidden="true"
				>
					<div className="min-h-0 overflow-hidden border-b lg:border-b-0 lg:border-r">
						<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-7 w-24" />
						</div>
						<div className="grid gap-3 p-3 sm:grid-cols-2">
							{Array.from({ length: 6 }, (_, index) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
									key={index}
									className="flex flex-col overflow-hidden rounded-lg border"
								>
									<Skeleton className="h-32 w-full rounded-none" />
									<div className="flex flex-col gap-2 p-3">
										<Skeleton className="h-3 w-16" />
										<Skeleton className="h-4 w-3/4" />
										<Skeleton className="h-3 w-full" />
										<Skeleton className="mt-2 h-7 w-20" />
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="relative min-h-[360px] lg:min-h-0">
						<Skeleton className="absolute inset-0 rounded-none" />
					</div>
				</div>
				<span role="status" className="sr-only">
					Suche läuft…
				</span>
			</PageShellContent>
		</PageShell>
	);
}
