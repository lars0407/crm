import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Impressum",
	description: "Impressum und Angaben gemäß § 5 TMG",
};

export default function ImpressumPage() {
	return (
		<article className="prose prose-invert max-w-none">
			<h1>Impressum</h1>

			<h2>Angaben gemäß § 5 TMG</h2>
			<p>
				[Firmenname]
				<br />
				[Straße und Hausnummer]
				<br />
				[PLZ Ort]
				<br />
				Deutschland
			</p>

			<h2>Vertreten durch</h2>
			<p>[Geschäftsführer / Inhaber Name]</p>

			<h2>Kontakt</h2>
			<p>
				Telefon: [Telefonnummer]
				<br />
				E-Mail: [E-Mail-Adresse]
			</p>

			<h2>Registereintrag</h2>
			<p>
				Eintragung im Handelsregister.
				<br />
				Registergericht: [Amtsgericht Ort]
				<br />
				Registernummer: [HRB XXXXX]
			</p>

			<h2>Umsatzsteuer-ID</h2>
			<p>
				Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
				<br />
				[DE XXXXXXXXX]
			</p>

			<h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
			<p>
				[Name]
				<br />
				[Straße und Hausnummer]
				<br />
				[PLZ Ort]
			</p>

			<h2>EU-Streitschlichtung</h2>
			<p>
				Die Europäische Kommission stellt eine Plattform zur
				Online-Streitbeilegung (OS) bereit:{" "}
				<a
					href="https://ec.europa.eu/consumers/odr/"
					target="_blank"
					rel="noopener noreferrer"
				>
					https://ec.europa.eu/consumers/odr/
				</a>
				<br />
				Unsere E-Mail-Adresse finden Sie oben im Impressum.
			</p>

			<h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
			<p>
				Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
				vor einer Verbraucherschlichtungsstelle teilzunehmen.
			</p>
		</article>
	);
}
