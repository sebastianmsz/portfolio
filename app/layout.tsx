"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<html
			lang="es"
			suppressHydrationWarning={true}
			className={`${inter.variable} scroll-smooth`}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="description" content="Welcome to Sebastian Molina's portfolio - Web Developer specializing in React, Next.js, TypeScript, and modern web technologies. Explore my projects and professional experience." />
				<meta name="keywords" content="Sebastian Molina, Web Developer, Web Developer, React, Next.js, TypeScript, Portfolio" />
				<meta name="author" content="Sebastian Molina" />
				<meta name="robots" content="index, follow" />
				
				{/* OpenGraph Meta Tags */}
				<meta property="og:title" content="Sebastian Molina | Web Developer Portfolio" />
				<meta property="og:description" content="Welcome to Sebastian Molina's portfolio - Web Developer specializing in React, Next.js, TypeScript, and modern web technologies." />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="/profile.webp" />
				<meta property="og:url" content="https://yourdomain.com" />
				
				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Sebastian Molina | Web Developer Portfolio" />
				<meta name="twitter:description" content="Welcome to Sebastian Molina's portfolio - Web Developer specializing in React, Next.js, TypeScript, and modern web technologies." />
				<meta name="twitter:image" content="/profile.webp" />
				
				<link rel="icon" href="/favicon.svg" />
				<link rel="canonical" href="https://yourdomain.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<title>Sebastian Molina | Portfolio</title>
			</head>
			<body suppressHydrationWarning={true}>
				{mounted && (					
					<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				)}
			</body>
		</html>
	);
}
