import {
	GraduationCap,
	Building,
	Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const education = [
	{
		id: "systemsTechnician",
		title: "Técnico en Sistemas",
		institution: "Sena: Servicio Nacional de Aprendizaje",
		year: "2016 - 2021",
	},
	{
		id: "informaticsEngineering",
		title: "Pregrado Ingeniería Informatica",
		institution: "Universidad Autónoma de Occidente",
		year: "2022 - Presente",
	},
	{
		id: "graphicDesign",
		title: "Pregrado Diseño Gráfico",
		institution: "Universidad Autónoma de Occidente",
		year: "2023 - Presente",
	},
	{
		id: "odin",
		title: "Foundations of Web Development / Full Stack JavaScript",
		institution: "The Odin Project",
		year: "2024",
	},
];

export default function EducationSection() {
	const { translate } = useLanguage();

	return (
		<section id="education" className="space-y-12">
			<motion.h2
				className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 sm:mb-16 px-4 lg:px-8 relative"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-100px" }}
			>
				<span className="text-primary">#</span>
				{translate("sections.education")}
				<motion.span
					className="block h-1 w-24 bg-gradient-to-r from-primary to-blue-600 mt-4 rounded-full"
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				/>
			</motion.h2>

			<div className="relative">
				<div className="hidden sm:block absolute left-8 top-0 bottom-0 w-px bg-muted-foreground/20" />

				<div className="space-y-8">
					{education.map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="relative sm:pl-14"
						>
							<div className="absolute left-8 top-5 -ml-[4.5px] w-3 h-3 rounded-full bg-primary hidden sm:block" />
							<motion.div
								className="p-6 bg-background/50 backdrop-blur-lg rounded-xl border border-muted-foreground/10 hover:border-primary/30 transition-all"
								whileHover={{ scale: 1.02 }}
							>
								<div className="flex items-center gap-4 mb-4">
									<div className="p-3 bg-primary/10 rounded-xl">
										<GraduationCap className="w-6 h-6 text-primary" />
									</div>
									<h3 className="text-xl font-semibold">
										{translate(`education.${item.id}.title`)}
									</h3>
								</div>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span className="flex items-center gap-2">
										<Building className="w-4 h-4" />
										{item.institution}
									</span>
									<span className="flex items-center gap-2">
										<Calendar className="w-4 h-4" />
										{item.year}
									</span>
								</div>
								<p className="mt-4 text-muted-foreground">
									{translate(`education.${item.id}.description`)}
								</p>
							</motion.div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}