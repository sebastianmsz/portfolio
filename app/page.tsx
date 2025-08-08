"use client";

import { LanguageProvider } from "./contexts/LanguageContext";
import HomeContent from "./components/HomeContent";

function JsonLd() {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Sebastian Molina",
		url: "https://sebastianmsz.vercel.app",
		image: "https://sebastianmsz.vercel.app/profile.webp",
		sameAs: [
			"https://github.com/sebastianmsz",
			"https://linkedin.com/in/sebastianmsz",
		],
		jobTitle: "Web Developer",
		worksFor: { "@type": "Organization", name: "Freelance" },
		alumniOf: {
			"@type": "EducationalOrganization",
			name: "Atonomous University of the West",
		},
	} as const;

	return (
		<script
			type="application/ld+json"
			suppressHydrationWarning
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

function AnimatedBackground() {
	return (
		<div className="fixed inset-0 -z-50 pointer-events-none" aria-hidden>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,88,251,0.15)_0%,transparent_40%)] animate-pulse" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(96,165,250,0.1)_0%,transparent_50%)]" />
			<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent" />
			<div className="absolute inset-0">
				<div
					className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_30%,transparent)]"
					style={{
						backgroundImage:
							"linear-gradient(to right, rgba(125,88,251,0.03) 1px, transparent 1px),\n                              linear-gradient(to bottom, rgba(125,88,251,0.03) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				<div
					className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_30%,transparent)]"
					style={{
						backgroundImage:
							"linear-gradient(to right, rgba(125,88,251,0.07) 1px, transparent 1px),\n                              linear-gradient(to bottom, rgba(125,88,251,0.07) 1px, transparent 1px)",
						backgroundSize: "96px 96px",
					}}
				/>
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<>
			<JsonLd />
			<AnimatedBackground />
			<LanguageProvider>
				<HomeContent />
			</LanguageProvider>
		</>
	);
}
