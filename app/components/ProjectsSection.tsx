import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const projects = [
	{
		id: "portfolio",
		title: "Portfolio Website",
		repo: "https://github.com/sebastianmsz/portfolio",
		liveDemo: "https://sebastianmsz.vercel.app",
		tech: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn/ui"],
	},
	{
		id: "promptCentral",
		title: "Prompt-Central",
		repo: "https://github.com/sebastianmsz/promptcentral",
		liveDemo: "https://promptcentral.vercel.app",
		tech: ["Next.js", "Tailwind CSS", "TypeScript", "MongoDB", "NextAuth.js"],
	},
	{
		id: "disneyPlus",
		title: "Disney+ Clone",
		repo: "https://github.com/sebastianmsz/disney-plus-clone",
		liveDemo: "https://sebastianmsz.github.io/disney-plus-clone",
		tech: ["React", "Tailwind CSS", "TypeScript", "Vite", "Axios"],
	},
	{
		id: "solary",
		title: "Solary",
		repo: "https://github.com/sebastianmsz/solary",
		liveDemo: "https://sebastianmsz.github.io/solary",
		tech: ["Webpack", "JavaScript", "HTML", "CSS"],
	},
	{
		id: "akiraSignUpPage",
		title: "Akira Sign Up Page",
		repo: "https://github.com/sebastianmsz/akira-signup-page",
		liveDemo: "https://sebastianmsz.github.io/akira-signup-page/",
		tech: ["HTML", "CSS", "JavaScript"],
	},
	{
		id: "comingSoonPortfolio3D",
		title: "Portfolio 3D (Coming Soon)",
		repo: "#", // No repo yet
		liveDemo: "#", // No live demo yet
		tech: ["Next.js", "TypeScript", "Tailwind CSS"],
	},
];

export default function ProjectsSection() {
	const { translate } = useLanguage();

	return (
		<section id="projects" className="space-y-12 relative">
			<motion.h2
				className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 sm:mb-16 px-4 lg:px-8 relative"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-100px" }}
			>
				<span className="text-primary">#</span>
				{translate("sections.projects")}
				<motion.span
					className="block h-1 w-24 bg-gradient-to-r from-primary to-blue-600 mt-4 rounded-full"
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				/>
			</motion.h2>

			<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{projects.map((project, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.1 }}
					>
						<Card className="group hover:border-primary/30 transition-all hover:-translate-y-2 h-full relative overflow-hidden">
							<CardContent className="p-0">
								<div className="relative aspect-video overflow-hidden rounded-t-lg">
									<Image
										src={`/projects/${project.id
											.toLowerCase()
											.replace(/[^a-zA-Z0-9]/g, "")}.webp`}
										alt={project.title}
										fill
										className="object-cover group-hover:scale-105 transition-transform"
									/>

									<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-4 bg-background/10 backdrop-blur-lg border-t border-muted-foreground/10">
										<h3 className="text-xl font-semibold">{project.title}</h3>
									</div>
								</div>
								<div className="p-6 space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex gap-2 flex-wrap">
											{project.tech.map((tech, i) => (
												<Badge
													key={i}
													variant="secondary"
													className="bg-primary/10 text-primary/80 border-primary/20 text-xs"
												>
													{tech}
												</Badge>
											))}
										</div>
									</div>
									<p className="text-muted-foreground line-clamp-3">
										{translate(`projects.${project.id}.description`)}
									</p>
									<div className="flex gap-3 mt-4">
										<Button
											asChild
											variant="ghost"
											size="sm"
											className="gap-2 hover:bg-primary/20 text-muted-foreground"
										>
											<Link href={project.repo} target="_blank">
												<Github className="w-4 h-4" />
												{translate("viewCode")}
											</Link>
										</Button>
										<Button
											asChild
											size="sm"
											className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary"
										>
											<Link href={project.liveDemo} target="_blank">
												<ExternalLink className="w-4 h-4" />
												{translate("viewDemo")}
											</Link>
										</Button>
									</div>
								</div>
							</CardContent>
							<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(125,88,251,0.05)_0%,transparent_60%)] group-hover:opacity-100 opacity-0 transition-opacity" />
						</Card>
					</motion.div>
				))}
			</div>

			<motion.div
				className="flex justify-center mt-12"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
			>
				<Button
					asChild
					className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-8 py-6 text-lg transition-all"
				>
					<Link
						href="https://github.com/sebastianmsz?tab=repositories"
						target="_blank"
					>
						<Github className="w-5 h-5" />
						{translate("seeMoreProjects")}
					</Link>
				</Button>
			</motion.div>
		</section>
	);
}
