import Image from "next/image";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

export default function HeroSection() {
	const { language, translate } = useLanguage();
	return (
		<section className="flex flex-col md:flex-row items-center justify-between gap-12 min-h-[90vh] relative">
			<div className="absolute inset-0" />

			<motion.div
				className="flex-1 space-y-8 relative z-10"
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className="space-y-6">
				<motion.h1 
            className="text-5xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {translate("hello")}
            </span>
			<div className="mt-4 text-4xl md:text-5xl font-medium text-foreground/80">
				<Typewriter
					key={language} // Force re-render on language change
					words={[translate("role")]} // Wrap translated string in array
					loop={1} // Type only once
					cursor
					cursorStyle="|"
					typeSpeed={70}
					deleteSpeed={50}
				/>
			</div>
          </motion.h1>

					<motion.p
						className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						{translate("passion")}
					</motion.p>
				</div>

				<motion.div
					className="flex flex-wrap gap-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
				>
					<Button
						asChild
						className="rounded-full gap-2 px-6 h-12 bg-primary/10 hover:bg-primary/20 border border-primary/20 backdrop-blur-lg"
					>
						<Link href="https://linkedin.com/in/sebastianmsz" target="_blank">
							<Linkedin className="w-5 h-5 text-primary" />
							<span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
								LinkedIn
							</span>
						</Link>
					</Button>
					<Button
						asChild
						variant="secondary"
						className="rounded-full gap-2 px-6 h-12 border border-muted-foreground/20 hover:border-primary/30 backdrop-blur-lg"
					>
						<Link href="https://github.com/sebastianmsz" target="_blank">
							<Github className="w-5 h-5" />
							GitHub
						</Link>
					</Button>
					<Button
						asChild
						variant="secondary"
						className="rounded-full gap-2 px-6 h-12 border border-muted-foreground/20 hover:border-primary/30 backdrop-blur-lg"
						>
						<a href="/SebastianMolinaCV.pdf" download>
							<Download className="w-5 h-5" />
							Download CV
						</a>
					</Button>
				</motion.div>
			</motion.div>

			<motion.div
				className="relative flex-1 max-w-xl aspect-square mt-12 md:mt-0"
				initial={{ scale: 0, rotate: 15 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ type: "spring", stiffness: 100 }}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse" />
				<div className="relative z-10 rounded-full border-4 border-primary/20 shadow-2xl overflow-hidden hover:shadow-primary/20 transition-shadow">
					<Image
						src="/profile.webp"
						alt="Profile picture"
						width={600}
						height={600}
						className="w-full h-full object-cover hover:scale-105 transition-transform"
						priority
					/>
				</div>
			</motion.div>
		</section>
	);
}