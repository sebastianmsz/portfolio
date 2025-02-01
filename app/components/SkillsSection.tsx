import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

export default function SkillsSection() {
	const { translate } = useLanguage();
	const skills = [
		"HTML",
		"CSS",
		"JavaScript",
		"TypeScript",
		"React",
		"Nextjs",
		"Tailwind",
		"MongoDB",
		"Git",
		"NPM",
		"Jest",
		"Vercel",
		"Figma",
		"Adobe Suite",
	];

	return (
		<section id="skills" className="relative">
			<div className="absolute inset-0" />

			<motion.h2
				className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 sm:mb-16 px-4 lg:px-8 relative"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-100px" }}
			>
				<span className="text-primary">#</span>
				{translate("skills")}
				<motion.span
					className="block h-1 w-24 bg-gradient-to-r from-primary to-blue-600 mt-4 rounded-full"
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				/>
			</motion.h2>

			<div className="container px-4 lg:px-8 mx-auto">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{skills.map((skill, index) => (
						<motion.div
							key={skill}
							className="group relative p-4 bg-background/50 border rounded-xl hover:border-primary/30 transition-all shadow-sm hover:shadow-md overflow-hidden backdrop-blur-lg"
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true, margin: "0px 0px -50px 0px" }}
							transition={{ delay: index * 0.05 }}
						>
							<div className="flex flex-col items-center gap-3">
								<motion.div
									className="relative w-12 h-12"
									whileHover={{ scale: 1.1 }}
								>
									<Image
										src={`/skills/${skill
											.toLowerCase()
											.replace(/[^a-zA-Z0-9]/g, "")}.svg`}
										alt={skill}
										fill
										className="object-contain transition-transform"
									/>
								</motion.div>
								<span className="text-sm font-medium text-muted-foreground group-hover:text-foreground bg-gradient-to-r from-foreground/80 to-foreground/60 bg-clip-text text-transparent">
									{skill}
								</span>
							</div>
							<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(125,88,251,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}