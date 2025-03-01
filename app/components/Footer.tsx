import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLanguage } from "../contexts/LanguageContext";
import { Github, Linkedin, Mail } from "lucide-react";

import { motion } from "framer-motion";

const socialLinks = [
	{ icon: Github, href: "https://github.com/sebastianmsz" },
	{ icon: Linkedin, href: "https://linkedin.com/in/sebastianmsz" },
	{ icon: Mail, href: "mailto:sevas.molina2004@gmail.com" },
];


export default function Footer() {
	const { translate } = useLanguage();
	const { theme, resolvedTheme } = useTheme();

	if (!theme && !resolvedTheme) {
		return null;
	}

	return (
		<footer className="border-t bg-background/80 backdrop-blur-lg mt-32">
			<div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
		<motion.div
					className="flex flex-col md:flex-row justify-between items-center gap-6"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
				>
					<div className="flex items-center gap-4">
						<Link href="/" className="hover:opacity-80 transition-opacity">
							<Image
								src={theme === "dark" || resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
								alt="Logo"
								width={140}
								height={32}
								className="h-8 w-auto"
							/>
						</Link>
						<p className="text-sm text-muted-foreground">
							© {new Date().getFullYear()} {translate("footerRights")}
						</p>
					</div>

					<div className="flex items-center gap-6">
						{socialLinks.map((link, index) => (
							<motion.div
								key={index}
								whileHover={{ scale: 1.2 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href={link.href}
									target="_blank"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									<link.icon className="w-5 h-5" />
								</Link>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</footer>
	);
}