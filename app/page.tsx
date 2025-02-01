"use client";

import Image from "next/image";
import { ThemeToggle } from "./components/theme-toggle";
import { MobileMenu } from "./components/MobileMenu";
import { LanguageToggle } from "./components/LanguageToggle";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "next-themes";
import HeroSection from "./components/HeroSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import AboutSection from "./components/AboutSection";
import EducationSection from "./components/EducationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
	return (
		<>
			<div className="fixed inset-0 -z-50 pointer-events-none">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,88,251,0.15)_0%,transparent_40%)] animate-pulse" />

				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(96,165,250,0.1)_0%,transparent_50%)]" />

				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent" />

				<div className="absolute inset-0">
					<div
						className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_30%,transparent)]"
						style={{
							backgroundImage: `linear-gradient(to right, rgba(125,88,251,0.03) 1px, transparent 1px),
										linear-gradient(to bottom, rgba(125,88,251,0.03) 1px, transparent 1px)`,
							backgroundSize: "24px 24px"
						}}
					/>
					<div
						className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_30%,transparent)]"
						style={{
							backgroundImage: `linear-gradient(to right, rgba(125,88,251,0.07) 1px, transparent 1px),
										linear-gradient(to bottom, rgba(125,88,251,0.07) 1px, transparent 1px)`,
							backgroundSize: "96px 96px",
						}}
					/>
				</div>
			</div>
			<LanguageProvider>
				<HomeContent />
			</LanguageProvider>
		</>
	);
}

function HomeContent() {
	const { theme, resolvedTheme } = useTheme();

	if (!theme && !resolvedTheme) {
		return null;
	}

	const { translate } = useLanguage();
	const targetRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start start", "end start"],
	});

	const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

	return (
		<div className="min-h-screen text-foreground" ref={targetRef}>
			<motion.div className="fixed inset-0 -z-10" style={{ opacity, scale }} />

			<header className="sticky top-0 z-50 w-full border-b bg-background/50 backdrop-blur-xl">
  <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-3">
    <nav className="flex justify-between items-center">
      <Link
        href="/"
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <Image
          src={theme === "dark" || resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
          alt="Logo"
          width={140}
          height={32}
          className="h-8 w-auto"
          priority
        />
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

			<main className="container max-w-7xl mx-auto px-4 sm:px-6 space-y-32 py-16 md:py-0">
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