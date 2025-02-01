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
				<meta name="description" content="Sebastian Molina Portfolio" />
				<meta name="author" content="Sebastian Molina" />
				<link rel="icon" href="/favicon.svg" />
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
