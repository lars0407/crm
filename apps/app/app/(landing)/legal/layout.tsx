import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";

export default function LegalLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="dark flex min-h-svh w-full flex-col items-center bg-background font-sans text-foreground">
			<LandingNav />
			<main className="flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
				{children}
			</main>
			<LandingFooter />
		</div>
	);
}
