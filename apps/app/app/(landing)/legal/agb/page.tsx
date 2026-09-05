import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Allgemeine Geschäftsbedingungen",
	description: "Allgemeine Geschäftsbedingungen (AGB)",
};

export default function AGBPage() {
	return (
		<article className="prose prose-invert max-w-none">
			<h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

			<h2>§ 1 Geltungsbereich</h2>
			<p>
				(1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten
				für alle Verträge zwischen
			</p>
			<p>
				[Firmenname]
				<br />
				[Straße und Hausnummer]
				<br />
				[PLZ Ort]
				<br />
				(nachfolgend „Anbieter")
			</p>
			<p>
				und dem Kunden (nachfolgend „Kunde") über die Nutzung der
				Software-as-a-Service-Lösung [Produktname] (nachfolgend „Dienst").
			</p>
			<p>
				(2) Abweichende, entgegenstehende oder ergänzende Allgemeine
				Geschäftsbedingungen des Kunden werden nur dann Vertragsbestandteil,
				wenn der Anbieter ihrer Geltung ausdrücklich schriftlich zugestimmt hat.
			</p>

			<h2>§ 2 Vertragsgegenstand</h2>
			<p>
				(1) Der Anbieter stellt dem Kunden eine webbasierte
				Software-as-a-Service-Lösung zur Verfügung. Der genaue Leistungsumfang
				ergibt sich aus der jeweiligen Leistungsbeschreibung.
			</p>
			<p>
				(2) Der Anbieter erbringt seine Leistungen nach dem jeweiligen Stand der
				Technik. Er ist berechtigt, den Dienst weiterzuentwickeln und
				anzupassen.
			</p>
			<p>[Weitere Details zum Leistungsumfang eintragen]</p>

			<h2>§ 3 Vertragsschluss</h2>
			<p>
				(1) Der Vertrag kommt durch die Registrierung des Kunden und die
				Bestätigung des Anbieters zustande.
			</p>
			<p>
				(2) Mit der Registrierung bestätigt der Kunde, dass er diese AGB gelesen
				hat und mit ihrer Geltung einverstanden ist.
			</p>

			<h2>§ 4 Nutzungsrechte</h2>
			<p>
				(1) Der Anbieter räumt dem Kunden für die Dauer des Vertrages ein
				einfaches, nicht übertragbares Recht zur Nutzung des Dienstes ein.
			</p>
			<p>
				(2) Der Kunde darf den Dienst nur für eigene geschäftliche Zwecke
				nutzen. Eine Unterlizenzierung oder Weitergabe an Dritte ist nicht
				gestattet.
			</p>
			<p>
				(3) Der Kunde erhält keinen Anspruch auf Überlassung des Quellcodes.
			</p>

			<h2>§ 5 Pflichten des Kunden</h2>
			<p>(1) Der Kunde verpflichtet sich:</p>
			<ul>
				<li>
					seine Zugangsdaten geheim zu halten und vor dem Zugriff Dritter zu
					schützen;
				</li>
				<li>
					den Dienst nicht missbräuchlich zu nutzen oder Dritten eine
					missbräuchliche Nutzung zu ermöglichen;
				</li>
				<li>keine rechtswidrigen Inhalte über den Dienst zu verbreiten;</li>
				<li>
					den Anbieter unverzüglich zu informieren, wenn Anhaltspunkte für eine
					missbräuchliche Nutzung seines Zugangs vorliegen.
				</li>
			</ul>

			<h2>§ 6 Vergütung und Zahlung</h2>
			<p>
				(1) Die Vergütung richtet sich nach der zum Zeitpunkt des
				Vertragsschlusses gültigen Preisliste des Anbieters.
			</p>
			<p>
				(2) Alle Preise verstehen sich zuzüglich der gesetzlichen Umsatzsteuer.
			</p>
			<p>(3) Die Rechnungsstellung erfolgt [monatlich / jährlich] im Voraus.</p>
			<p>[Weitere Zahlungsdetails eintragen]</p>

			<h2>§ 7 Verfügbarkeit</h2>
			<p>
				(1) Der Anbieter bemüht sich um eine möglichst hohe Verfügbarkeit des
				Dienstes. Eine Verfügbarkeit von 100% ist technisch nicht realisierbar.
			</p>
			<p>
				(2) Als Ausfallzeiten gelten nicht: geplante Wartungsarbeiten,
				Störungen, die auf höherer Gewalt oder auf Handlungen Dritter beruhen.
			</p>
			<p>[Details zur garantierten Verfügbarkeit (SLA) eintragen]</p>

			<h2>§ 8 Datenschutz und Datensicherheit</h2>
			<p>
				(1) Der Anbieter verarbeitet personenbezogene Daten des Kunden nur im
				Rahmen der Datenschutzerklärung und der geltenden
				Datenschutzvorschriften.
			</p>
			<p>
				(2) Soweit der Anbieter im Auftrag des Kunden personenbezogene Daten
				verarbeitet, schließen die Parteien einen Auftragsverarbeitungsvertrag.
			</p>

			<h2>§ 9 Haftung</h2>
			<p>
				(1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des
				Lebens, des Körpers oder der Gesundheit sowie für vorsätzlich oder grob
				fahrlässig verursachte Schäden.
			</p>
			<p>
				(2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung
				wesentlicher Vertragspflichten. Die Haftung ist in diesen Fällen auf den
				vertragstypischen, vorhersehbaren Schaden begrenzt.
			</p>
			<p>(3) Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.</p>

			<h2>§ 10 Vertragslaufzeit und Kündigung</h2>
			<p>
				(1) Der Vertrag wird auf unbestimmte Zeit geschlossen und kann von
				beiden Seiten mit einer Frist von [X Wochen / Monaten] zum Ende des
				[Abrechnungszeitraums] gekündigt werden.
			</p>
			<p>
				(2) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt
				unberührt.
			</p>
			<p>(3) Die Kündigung bedarf der Textform (E-Mail genügt).</p>

			<h2>§ 11 Änderungen der AGB</h2>
			<p>
				(1) Der Anbieter behält sich vor, diese AGB mit Wirkung für die Zukunft
				zu ändern. Der Anbieter wird den Kunden über Änderungen mindestens [4
				Wochen] vor deren Inkrafttreten informieren.
			</p>
			<p>
				(2) Widerspricht der Kunde nicht innerhalb von [4 Wochen] nach Zugang
				der Änderungsmitteilung, gelten die Änderungen als genehmigt.
			</p>

			<h2>§ 12 Schlussbestimmungen</h2>
			<p>
				(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
				des UN-Kaufrechts.
			</p>
			<p>
				(2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts
				oder öffentlich-rechtliches Sondervermögen, ist ausschließlicher
				Gerichtsstand für alle Streitigkeiten aus diesem Vertrag [Ort].
			</p>
			<p>
				(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden,
				bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
			</p>

			<p className="mt-8 text-muted-foreground">Stand: [Datum eintragen]</p>
		</article>
	);
}
