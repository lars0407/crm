"use client";

import { Button } from "@crm/ui/components/button";
import { Link } from "@crm/ui/components/link";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@crm/ui/components/popover";
import {
	CalendarIcon,
	LinkedinIcon,
	MailIcon,
	MessageCircleIcon,
	PhoneIcon,
	XIcon,
} from "lucide-react";
import { useState } from "react";

type ContactInfo = {
	name: string;
	title: string;
	email?: string;
	phone?: string;
	linkedin?: string;
	calendly?: string;
	avatarUrl?: string;
};

const CONTACT: ContactInfo = {
	name: "[Name eintragen]",
	title: "[Position eintragen]",
	email: "kontakt@example.com",
	phone: "+49 123 456789",
	linkedin: "https://linkedin.com/in/example",
	calendly: "https://calendly.com/example",
};

export function ContactBubble() {
	const [open, setOpen] = useState(false);

	return (
		<div className="fixed right-6 bottom-6 z-50">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						size="lg"
						className="size-14 rounded-full shadow-lg"
						aria-label="Kontakt öffnen"
					>
						{open ? (
							<XIcon className="size-6" />
						) : (
							<MessageCircleIcon className="size-6" />
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					side="top"
					align="end"
					sideOffset={12}
					className="w-80 p-0"
				>
					<div className="flex flex-col">
						<div className="border-b border-border bg-muted/50 px-4 py-3">
							<p className="font-medium text-sm">Fragen? Wir helfen gerne!</p>
							<p className="text-muted-foreground text-xs">
								Sprechen Sie direkt mit unserem Team
							</p>
						</div>

						<div className="p-4">
							<div className="flex items-start gap-3">
								{CONTACT.avatarUrl ? (
									<img
										src={CONTACT.avatarUrl}
										alt={CONTACT.name}
										className="size-12 rounded-full object-cover"
									/>
								) : (
									<div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-lg">
										{CONTACT.name
											.split(" ")
											.map((n) => n[0])
											.join("")
											.slice(0, 2)}
									</div>
								)}
								<div className="flex-1 min-w-0">
									<p className="font-medium text-sm">{CONTACT.name}</p>
									<p className="text-muted-foreground text-xs">
										{CONTACT.title}
									</p>
								</div>
							</div>

							<div className="mt-4 flex flex-col gap-2">
								{CONTACT.email && (
									<Link
										href={`mailto:${CONTACT.email}`}
										variant="quiet"
										className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
									>
										<MailIcon className="size-4 text-muted-foreground" />
										<span className="truncate">{CONTACT.email}</span>
									</Link>
								)}

								{CONTACT.phone && (
									<Link
										href={`tel:${CONTACT.phone}`}
										variant="quiet"
										className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
									>
										<PhoneIcon className="size-4 text-muted-foreground" />
										<span>{CONTACT.phone}</span>
									</Link>
								)}

								{CONTACT.linkedin && (
									<Link
										href={CONTACT.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										variant="quiet"
										className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
									>
										<LinkedinIcon className="size-4 text-muted-foreground" />
										<span>LinkedIn Profil</span>
									</Link>
								)}
							</div>

							{CONTACT.calendly && (
								<div className="mt-4 pt-4 border-t border-border">
									<Button asChild className="w-full" size="sm">
										<Link
											href={CONTACT.calendly}
											target="_blank"
											rel="noopener noreferrer"
										>
											<CalendarIcon className="size-4 mr-2" />
											Termin vereinbaren
										</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
