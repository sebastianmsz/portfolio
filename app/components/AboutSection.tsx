import Image from "next/image";
import {
	GraduationCap,
	Code2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";

export default function AboutSection() {
	const { translate } = useLanguage();

	return (
		<section id="about" className="space-y-12 relative">
			<div className="absolute -top-32 left-0 right-0 h-[500px]" />

			<motion.h2
				className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 sm:mb-16 px-4 lg:px-8 relative"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-100px" }}
			>
				<span className="text-primary">#</span>
				{translate("sections.about")}
				<motion.span
					className="block h-1 w-24 bg-gradient-to-r from-primary to-blue-600 mt-4 rounded-full"
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				/>
			</motion.h2>

			<div className="grid md:grid-cols-2 gap-12 items-center">
				<motion.div
					className="space-y-8 relative"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
				>
					<div className="space-y-6">
						<motion.div
							className="p-6 bg-background/50 backdrop-blur-lg rounded-xl border border-muted-foreground/10 hover:border-primary/30 transition-all"
							whileHover={{ y: -5 }}
						>
							<p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
								{translate("heroDescription1")}
							</p>
						</motion.div>

						<motion.div
							className="p-6 bg-background/50 backdrop-blur-lg rounded-xl border border-muted-foreground/10 hover:border-primary/30 transition-all"
							whileHover={{ y: -5 }}
						>
							<p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
								{translate("heroDescription2")}
							</p>
						</motion.div>
					</div>

					<motion.div className="flex flex-wrap gap-4">
						<Button
							asChild
							variant="outline"
							className="rounded-full gap-2 hover:bg-primary/20 border-muted-foreground/20 backdrop-blur-lg"
						>
							<Link href="#education">
								<GraduationCap className="w-5 h-5" />
								{translate("sections.education")}
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="rounded-full gap-2 hover:bg-primary/20 border-muted-foreground/20 backdrop-blur-lg"
						>
							<Link href="#projects">
								<Code2 className="w-5 h-5" />
								{translate("sections.projects")}
							</Link>
						</Button>
					</motion.div>
				</motion.div>

				<motion.div
					className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden border border-muted-foreground/20 group"
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
				>
					<div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10" />
					<Image
						src="/selfie.webp"
						alt="About photo"
						fill
						className="object-cover group-hover:scale-105 transition-transform"
					/>
					<div className="absolute bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-lg border-t border-muted-foreground/10">
						<h3 className="text-xl font-semibold">Sebastian Molina</h3>
						<p className="text-muted-foreground">Web Developer</p>
					</div>
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,88,251,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
				</motion.div>
			</div>
		</section>
	);
}