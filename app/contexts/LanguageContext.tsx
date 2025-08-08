"use client";

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

type Language = "en" | "es";

type TranslationValue =
	| string
	| { [key: string]: string | { [key: string]: string } };
type TranslationType = Record<string, TranslationValue>;

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	translate: (key: string) => string;
}

interface LanguageProviderProps {
	children: ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

const translations: Record<Language, TranslationType> = {
	en: {
		hello: "Hello, I'm Sebastian",
		role: "Web Developer and Graphic Designer. From Cali, Colombia",
		passion: "Passionate about curiosity and endless learning.",
		viewCode: "View Code",
		viewDemo: "View Demo",
		contactMe: "Contact Me",
		contactText:
			"Do you have any questions, proposals, or just want to check this nice form? Don't hesitate to say hi. I'll be happy to respond as soon as possible.",
		name: "Name",
		email: "Email",
		message: "Message",
		sending: "Sending...",
		nameRequired: "Name is required",
		nameMinLength: "Name must be at least 2 characters",
		emailRequired: "Email is required",
		emailInvalid: "Please enter a valid email address",
		messageRequired: "Message is required",
		messageMinLength: "Message must be at least 10 characters",
		send: "Send Message",
		CV: "Download CV",
		heroDescription1:
			"I'm a passionate web developer and graphic designer with a keen eye for detail and a love for creating engaging user experiences. My journey in tech began with a curiosity for how things work and quickly evolved into a passion for building and designing for the web.",
		heroDescription2:
			"With a diverse skill set encompassing both front-end development and graphic design, I enjoy crafting visually appealing and functional applications that solve real-world problems. I'm continuously learning and exploring new technologies to expand my capabilities and deliver exceptional results.",
		contactSuccess: "Thank you for contacting me. I'll respond soon.",
		contactSuccessDetails:
			"Thank you for reaching out. I'll get back to you soon.",
		contactError:
			"There was an error sending your message. Please try again later.",
		rateLimitExceeded: "Message limit exceeded",
		rateLimitDetails: "Please wait before sending another message: ",
		rateLimitUnits: {
			hour: "hour",
			hours: "hours",
			minute: "minute",
			minutes: "minutes",
			second: "second",
			seconds: "seconds",
			per: "per",
		},
		contactFormTitle: "Contact Me",
		about: "About me",
		contact: "Contact",
		skills: "Skills",
		sections: {
			about: "About",
			skills: "Skills",
			projects: "Projects",
			education: "Education",
			contact: "Contact",
		},
		projects: {
			promptCentral: {
				title: "Prompt-Central",
				description:
					"A platform for sharing and discovering prompts for AI models.",
			},
			disneyPlus: {
				title: "Disney+ Clone",
				description: "A Disney+ clone built with React and TypeScript.",
			},
			portfolio: {
				title: "Portfolio",
				description: "My personal portfolio website.",
			},
			solary: {
				title: "Solary",
				description:
					"Application to consult the weather details of any place in the world.",
			},
			akiraSignUpPage: {
				title: "Akira Sign Up Page",
				description:
					"A registration page built with HTML and CSS with a sharp and vibrant design.",
			},
			comingSoonPortfolio3D: {
				title: "Portfolio 3D (Coming Soon)",
				description:
					"A new portfolio experience with 3D elements, interactivity, and much more personality. Stay tuned!",
			},
		},
		education: {
			systemsTechnician: {
				title: "Systems Technician",
				institution: "SENA: National Learning Service",
				year: "Jan 2016 - Dec 2021",
				description:
					"Technical training in systems, including hardware maintenance, networks, and basic programming.",
			},
			informaticsEngineering: {
				title: "Computer Engineering",
				institution: "Autonomous University of the West",
				year: "Jan 2022 - Dec 2022",
				description:
					"Computer engineering studies with a focus on software development, databases, and algorithms.",
			},
			graphicDesign: {
				title: "Graphic Design",
				institution: "Autonomous University of the West",
				year: "Jan 2022 - Dec 2026",
				description:
					"Graphic design program focused on visual creation, digital design, and visual communication.",
			},
			odin: {
				title: "Full Stack JavaScript",
				institution: "The Odin Project",
				year: "Jan 2024 - Dec 2024",
				description:
					"Intensive course in full stack web development, covering HTML, CSS, JavaScript, Node.js, and React.",
			},
		},
		footerRights: "All rights reserved.",
		seeMoreProjects: "See More Projects",
	},
	es: {
		hello: "Hola, soy Sebastian",
		role: "Desarrollador Web y Diseñador gráfico. De Cali, Colombia",
		passion: "Apasionado por la curiosidad y el aprendizaje interminable.",
		viewCode: "Ver Código",
		viewDemo: "Ver Demo",
		contactMe: "Contáctame",
		contactText:
			"¿Tienes alguna pregunta o propuesta, o simplemente quieres probar este bonito formulario? No dudes en saludar. Estaré encantado de responder lo antes posible.",
		name: "Nombre",
		email: "Correo electrónico",
		message: "Mensaje",
		sending: "Enviando...",
		nameRequired: "El nombre es obligatorio",
		nameMinLength: "El nombre debe tener al menos 2 caracteres",
		emailRequired: "El correo es obligatorio",
		emailInvalid: "Por favor ingresa un correo válido",
		messageRequired: "El mensaje es obligatorio",
		messageMinLength: "El mensaje debe tener al menos 10 caracteres",
		send: "Enviar Mensaje",
		CV: "Descargar HV",
		heroDescription1:
			"Soy un desarrollador web y diseñador gráfico apasionado, con un gran ojo para los detalles y un amor por crear experiencias de usuario atractivas. Mi trayectoria en la tecnología comenzó con la curiosidad de cómo funcionan las cosas y rápidamente evolucionó en una pasión por construir y diseñar para la web.",
		heroDescription2:
			"Con un conjunto de habilidades diverso que abarca tanto el desarrollo front-end como el diseño gráfico, disfruto creando aplicaciones funcionales y visualmente atractivas que resuelvan problemas del mundo real. Estoy continuamente aprendiendo y explorando nuevas tecnologías para expandir mis capacidades y ofrecer resultados excepcionales.",
		contactSuccess: "Gracias por contactarme. Te responderé pronto.",
		contactSuccessDetails:
			"Tu mensaje fue enviado exitosamente. Pronto recibirás una respuesta.",
		contactError:
			"Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.",
		rateLimitExceeded: "Límite de mensajes excedido",
		rateLimitDetails: "Por favor espera antes de enviar otro mensaje: ",
		rateLimitUnits: {
			hour: "hora",
			hours: "horas",
			minute: "minuto",
			minutes: "minutos",
			second: "segundo",
			seconds: "segundos",
			per: "por",
		},
		contactFormTitle: "Contáctame",
		about: "Sobre mí",
		contact: "Contacto",
		skills: "Habilidades",
		sections: {
			about: "Sobre mí",
			skills: "Habilidades",
			projects: "Proyectos",
			education: "Educación",
			contact: "Contacto",
		},
		projects: {
			promptCentral: {
				title: "Prompt-Central",
				description: "Una plataforma para compartir prompts de IA.",
			},
			disneyPlus: {
				title: "Clon de Disney+",
				description: "Un clon de Disney+ construido con React y TypeScript",
			},
			portfolio: {
				title: "Portafolio",
				description: "Mi sitio web personal.",
			},
			solary: {
				title: "Solary",
				description:
					"Aplicación para consultar los detalles climaticos de cualquier lugar del mundo.",
			},
			akiraSignUpPage: {
				title: "Página de Registro de Akira",
				description:
					"Página de registro construida con HTML y CSS con un diseño afilado y vibrante.",
			},
			comingSoonPortfolio3D: {
				title: "Portafolio 3D (Próximamente)",
				description:
					"Una nueva experiencia de portafolio con elementos 3D, interactividad y mucha más personalidad. ¡Muy pronto!",
			},
		},
		education: {
			systemsTechnician: {
				title: "Técnico en Sistemas",
				institution: "SENA: Servicio Nacional de Aprendizaje",
				year: "Ene 2016 - Dic 2021",
				description:
					"Formación técnica en sistemas, incluyendo mantenimiento de hardware, redes y programación básica",
			},
			informaticsEngineering: {
				title: "Ingeniería Informática",
				institution: "Universidad Autónoma de Occidente",
				year: "Ene 2022 - Dic 2022",
				description:
					"Estudios en ingeniería informática con enfoque en desarrollo de software, bases de datos y algoritmos.",
			},
			graphicDesign: {
				title: "Diseño Gráfico",
				institution: "Universidad Autónoma de Occidente",
				year: "Ene 2022 - Dic 2026",
				description:
					"Programa de diseño gráfico centrado en la creación visual, diseño digital y comunicación visual.",
			},
			odin: {
				title: "Full Stack JavaScript",
				institution: "The Odin Project",
				year: "Ene 2024 - Dic 2024",
				description:
					"Curso intensivo en desarrollo web full stack, cubriendo HTML, CSS, JavaScript, Node.js y React.",
			},
		},
		footerRights: "Con todos los derechos reservados.",
		seeMoreProjects: "Ver más proyectos",
	},
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};

const getNestedValue = (obj: TranslationType, path: string[]): string => {
	let current: any = obj;
	for (const key of path) {
		if (current === undefined) return path.join(".");
		current = current[key];
	}
	return typeof current === "string" ? current : path.join(".");
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	children,
}) => {
	// Default to a stable value on both server and first client render
	const [language, setLanguage] = useState<Language>("en");

	// After mount, load user's preference or browser language
	useEffect(() => {
		try {
			const stored =
				typeof window !== "undefined"
					? (localStorage.getItem("language") as Language | null)
					: null;
			if (stored === "es" || stored === "en") {
				setLanguage(stored);
				return;
			}

			if (typeof window !== "undefined") {
				const browserLang = window.navigator.language.split("-")[0];
				const supportedLang: Language = browserLang === "es" ? "es" : "en";
				localStorage.setItem("language", supportedLang);
				setLanguage(supportedLang);
			}
		} catch {
			// Ignore errors (e.g., private mode restrictions)
		}
	}, []);

	const handleSetLanguage = (lang: Language) => {
		setLanguage(lang);
		try {
			if (typeof window !== "undefined") {
				localStorage.setItem("language", lang);
			}
		} catch {
			// ignore
		}
	};

	const translate = (key: string): string => {
		const keys = key.split(".");
		return getNestedValue(translations[language], keys);
	};

	return (
		<LanguageContext.Provider
			value={{ language, setLanguage: handleSetLanguage, translate }}
		>
			{children}
		</LanguageContext.Provider>
	);
};

export default LanguageProvider;
