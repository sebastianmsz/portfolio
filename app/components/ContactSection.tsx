import { useLanguage } from "../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { ContactForm } from "../components/ContactForm";

const contacts = [
	{
		icon: Mail,
		label: "Email",
		value: "sevas.molina2004@gmail.com",
		href: "mailto:sevas.molina2004@gmail.com",
		external: false,
	},
	{
		icon: Linkedin,
		label: "LinkedIn",
		value: "linkedin.com/in/sebastianmsz",
		href: "https://linkedin.com/in/sebastianmsz",
		external: true,
	},
	{
		icon: Github,
		label: "GitHub",
		value: "github.com/sebastianmsz",
		href: "https://github.com/sebastianmsz",
		external: true,
	},

]


export default function ContactSection() {
	const { translate } = useLanguage();

	return (
		<section id="contact" className="relative space-y-12">
			<div className="absolute -top-32 left-0 right-0 h-[500px]" />

			<motion.h2
				className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 sm:mb-16 px-4 lg:px-8 relative"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-100px" }}
			>
				<span className="text-primary">#</span>
				{translate("sections.contact")}
				<motion.span
					className="block h-1 w-24 bg-gradient-to-r from-primary to-blue-600 mt-4 rounded-full"
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				/>
			</motion.h2>

			<div className="grid md:grid-cols-2 gap-12">
				<motion.div
					className="space-y-8"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
				>
					<motion.div
						className="p-6 bg-background/50 backdrop-blur-lg rounded-xl border border-muted-foreground/10"
						whileHover={{ scale: 1.02 }}
					>
						<p className="text-base sm:text-lg text-muted-foreground">
							{translate("contactText")}
						</p>
					</motion.div>

					<div className="grid gap-4">
						{contacts.map((contact, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Link
									href={contact.href}
									className="flex items-center gap-4 p-4 rounded-xl border hover:border-primary/30 transition-all bg-background/50 backdrop-blur-lg group"
								>
									<span className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
										<contact.icon className="w-6 h-6 text-primary" />
									</span>
									<div>
										<p className="font-medium">{contact.label}</p>
										<p className="text-muted-foreground text-sm">
											{contact.value}
										</p>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</motion.div>

				<motion.div
					className="sticky top-24 h-fit"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
				>
					<Card className="border-primary/20 bg-background/50 backdrop-blur-lg relative overflow-hidden">
						<div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
						<CardHeader>
							<CardTitle className="text-2xl">
								<span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
									{translate("contactFormTitle")}
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ContactForm />
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}