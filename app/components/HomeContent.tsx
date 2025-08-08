"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "next-themes";

import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./MobileMenu";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "../contexts/LanguageContext";
import HeroSection from "./HeroSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import AboutSection from "./AboutSection";
import EducationSection from "./EducationSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

export default function HomeContent() {
	// Keep hook usage but do not gate initial render
	const { theme, resolvedTheme } = useTheme();
	const { translate } = useLanguage();
	const targetRef = useRef<HTMLDivElement | null>(null);
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start start", "end start"],
	});

	const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

	return (
		<div className="min-h-screen text-foreground" ref={targetRef}>
			<motion.div className="fixed inset-0 -z-10" style={{ opacity, scale }} />

			<header
				className="sticky top-0 z-50 w-full border-b bg-background/50 backdrop-blur-xl"
				role="banner"
			>
				<div className="container mx-auto max-w-7xl px-4 sm:px-6 py-3">
					<nav
						className="flex justify-between items-center"
						aria-label="Main Navigation"
					>
						{/* Logo: render both to avoid SSR/CSR divergence */}
						<Link
							href="/"
							aria-label="Homepage"
							className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
						>
							<span className="relative h-8 w-[140px] block">
								<Image
									src="/logo-light.svg"
									alt="Logo light"
									fill
									sizes="140px"
									className="h-8 w-auto block dark:hidden object-contain"
									priority
								/>
								<Image
									src="/logo-dark.svg"
									alt="Logo dark"
									fill
									sizes="140px"
									className="h-8 w-auto hidden dark:block object-contain"
									priority
								/>
							</span>
						</Link>

						<div className="hidden md:flex items-center gap-8">
							{["projects", "skills", "about", "contact"].map((item) => (
								<motion.div key={item} whileHover={{ scale: 1.05 }}>
									<Link
										href={`#${item}`}
										className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
									>
										{translate(`sections.${item}`)}
										<span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
									</Link>
								</motion.div>
							))}
						</div>

						<div className="flex items-center gap-4">
							<div className="hidden md:flex items-center gap-3">
								<ThemeToggle />
								<LanguageToggle />
							</div>
							<MobileMenu />
						</div>
					</nav>
				</div>
			</header>

			<main className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-32 py-16 md:py-0">
				<HeroSection />
				<SkillsSection />
				<ProjectsSection />
				<AboutSection />
				<EducationSection />
				<ContactSection />
			</main>

			<Footer />
		</div>
	);
}
