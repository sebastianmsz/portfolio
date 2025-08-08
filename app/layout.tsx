import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Sebastian Molina | Portfolio",
	description:
		"Welcome to Sebastian Molina's portfolio - Web Developer specializing in React, Next.js, TypeScript, and modern web technologies.",
	keywords:
		"Sebastian Molina, Web Developer, React, Next.js, TypeScript, Portfolio",
	authors: [{ name: "Sebastian Molina" }],
	robots: "index, follow",
	openGraph: {
		title: "Sebastian Molina | Web Developer Portfolio",
		description:
			"Welcome to Sebastian Molina's portfolio - Web Developer specializing in React, Next.js, TypeScript, and modern web technologies.",
		type: "website",
		images: ["/profile.webp"],
		url: "https://yourdomain.com",
	},
	twitter: {
		card: "summary_large_image",
		title: "Sebastian Molina | Web Developer Portfolio",
		description:
			"Welcome to Sebastian Molina's portfolio - Web Developer specializing in React, Next.js, TypeScript, and modern web technologies.",
		images: ["/profile.webp"],
	},
	alternates: {
		canonical: "https://sebastianmsz.vercel.app",
	},
	metadataBase: new URL("https://sebastianmsz.vercel.app"),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="es"
			suppressHydrationWarning={true}
			className={`${inter.variable} scroll-smooth`}
		>
			<head>
				<link rel="icon" href="/favicon.svg" />
				<meta
					name="format-detection"
					content="telephone=no, date=no, email=no, address=no"
				/>
			</head>
			<body suppressHydrationWarning={true}>
				<ThemeProvider>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
