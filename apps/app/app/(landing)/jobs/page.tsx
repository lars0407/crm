import { Button } from "@crm/ui/components/button";
import { Link } from "@crm/ui/components/link";
import {
	ArrowRightIcon,
	BriefcaseIcon,
	ClockIcon,
	MapPinIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";

export const metadata: Metadata = {
	title: "Jobs",
	description: "Karriere bei uns — Offene Stellen und Möglichkeiten",
};

type Job = {
	id: string;
	title: string;
	department: string;
	location: string;
	type: "Vollzeit" | "Teilzeit" | "Freelance" | "Praktikum";
	description: string;
};

const JOBS: Job[] = [
	{
		id: "1",
		title: "[Stellentitel]",
		department: "[Abteilung]",
		location: "[Standort oder Remote]",
		type: "Vollzeit",
		description: "[Kurze Beschreibung der Stelle und Hauptaufgaben]",
	},
];

const BENEFITS = [
	{
		title: "Flexibles Arbeiten",
		description:
			"Remote-first oder Hybrid — du entscheidest, wo du am besten arbeitest.",
	},
	{
		title: "Weiterbildung",
		description: "Budget für Konferenzen, Kurse und persönliche Entwicklung.",
	},
	{
		title: "Moderne Ausstattung",
		description:
			"MacBook, ergonomischer Arbeitsplatz und alle Tools, die du brauchst.",
	},
	{
		title: "Team Events",
		description: "Regelmäßige Team-Events und jährliche Offsites.",
	},
];

function JobCard({ job }: { job: Job }) {
	return (
		<div className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h3 className="font-semibold text-lg">{job.title}</h3>
					<p className="text-muted-foreground text-sm">{job.department}</p>
				</div>
				<Button asChild size="sm" variant="outline" className="shrink-0">
					<Link
						href={`mailto:jobs@example.com?subject=Bewerbung: ${job.title}`}
					>
						Bewerben
						<ArrowRightIcon className="ml-2 size-4" />
					</Link>
				</Button>
			</div>

			<p className="text-muted-foreground text-sm">{job.description}</p>

			<div className="flex flex-wrap gap-4 text-muted-foreground text-xs">
				<span className="flex items-center gap-1.5">
					<MapPinIcon className="size-3.5" />
					{job.location}
				</span>
				<span className="flex items-center gap-1.5">
					<ClockIcon className="size-3.5" />
					{job.type}
				</span>
				<span className="flex items-center gap-1.5">
					<BriefcaseIcon className="size-3.5" />
					{job.department}
				</span>
			</div>
		</div>
	);
}

function BenefitCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col gap-2 rounded-lg border border-border bg-card/50 p-5">
			<h3 className="font-medium text-sm">{title}</h3>
			<p className="text-muted-foreground text-xs">{description}</p>
		</div>
	);
}

export default function JobsPage() {
	return (
		<div className="dark flex min-h-svh w-full flex-col items-center bg-background font-sans text-foreground">
			<LandingNav />

			<main className="flex w-full max-w-4xl flex-1 flex-col px-6 py-16">
				<div className="mb-12 text-center">
					<h1 className="mb-4 font-bold text-4xl tracking-tight">
						Werde Teil unseres Teams
					</h1>
					<p className="mx-auto max-w-2xl text-muted-foreground text-lg">
						Wir suchen talentierte Menschen, die mit uns die Zukunft gestalten
						wollen. Schau dir unsere offenen Stellen an.
					</p>
				</div>

				<section className="mb-16">
					<h2 className="mb-6 font-semibold text-xl">Offene Stellen</h2>

					{JOBS.length > 0 ? (
						<div className="flex flex-col gap-4">
							{JOBS.map((job) => (
								<JobCard key={job.id} job={job} />
							))}
						</div>
					) : (
						<div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
							<p className="text-muted-foreground">
								Aktuell keine offenen Stellen. Schau später wieder vorbei oder
								sende uns eine Initiativbewerbung.
							</p>
							<Button asChild className="mt-4" variant="outline">
								<Link href="mailto:jobs@example.com?subject=Initiativbewerbung">
									Initiativbewerbung senden
								</Link>
							</Button>
						</div>
					)}
				</section>

				<section className="mb-16">
					<h2 className="mb-6 font-semibold text-xl">Was wir bieten</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{BENEFITS.map((benefit) => (
							<BenefitCard key={benefit.title} {...benefit} />
						))}
					</div>
				</section>

				<section className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
					<h2 className="mb-2 font-semibold text-xl">
						Keine passende Stelle dabei?
					</h2>
					<p className="mb-4 text-muted-foreground">
						Wir freuen uns immer über Initiativbewerbungen von motivierten
						Talenten.
					</p>
					<Button asChild>
						<Link href="mailto:jobs@example.com?subject=Initiativbewerbung">
							Initiativbewerbung senden
						</Link>
					</Button>
				</section>
			</main>

			<LandingFooter />
		</div>
	);
}
