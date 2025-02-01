"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es";

type TranslationValue = string | Record<string, TranslationValue>;
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
			"Do you have any questions or proposals? Don't hesitate to contact me. I'll be happy to listen and respond as soon as possible.",
		name: "Name",
		email: "Email",
		message: "Message",
		send: "Send Message",
		footer: "All rights reserved.",
		CV: "Download CV",
		heroDescription1:
			"I'm a passionate web developer and graphic designer with a keen eye for detail and a love for creating engaging user experiences. My journey in tech began with a curiosity for how things work and quickly evolved into a passion for building and designing for the web.",
		heroDescription2:
			"With a diverse skill set encompassing both front-end development and graphic design, I enjoy crafting visually appealing and functional applications that solve real-world problems. I'm continuously learning and exploring new technologies to expand my capabilities and deliver exceptional results.",
		promptCentralDescription:
			"A platform for sharing and discovering prompts for AI models. Built with Next.js, Tailwind CSS, and MongoDB.",
		project2Description: "A second project description in English.",
		project3Description: "A third project description in English.",
		project4Description: "A fourth project description in English.",
		senaDescription:
			"Focused on hardware, networks and basic programming, provided a foundation for my tech understanding.",
		uocInformaticDescription:
			"My computer engineering studies allowed me to explore software development, databases and algorithms, refining my technical expertise.",
		uocGraphicDescription:
			"This program is enhancing my ability to bring creative visions to life with visual and digital design skills.",
		odinDescription:
			"This intensive course solidified my web development skills by covering HTML, CSS, JavaScript, Node.js, and React.",
		systemsTechnician: "Systems Technician",
		informaticsEngineering: "Informatics Engineering Undergraduate",
		graphicDesign: "Graphic Design Undergraduate",
		webDevelopmentFoundations: "Web Development Foundations",
		contactSuccess: "Thank you for contacting me. I'll respond soon.",
		contactError:
			"There was an error sending your message. Please try again later.",
		contactFormTitle: "Contact Me",
		about: "About me",
		contact: "Contact",
		skills: "Skills",
		sections: {
			about: "About",
			skills: "Skills",
			projects: "Recent Projects",
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
				description: "A Disney+ clone built with React and Firebase.",
			},
			portfolio: {
				title: "Portfolio",
				description: "My personal portfolio website.",
			},
		},
		education: {
			systemsTechnician: {
				title: "Systems Technician",
				institution: "SENA: National Learning Service",
				year: "2016 - 2021",
				description:
					"Technical training in systems, including hardware maintenance, networks, and basic programming.",
			},
			informaticsEngineering: {
				title: "Computer Engineering",
				institution: "Autonomous University of the West",
				year: "2022 - Present",
				description:
					"Computer engineering studies with a focus on software development, databases, and algorithms.",
			},
			graphicDesign: {
				title: "Graphic Design",
				institution: "Autonomous University of the West",
				year: "2022 - Present",
				description:
					"Graphic design program focused on visual creation, digital design, and visual communication.",
			},
			odin: {
				title: "Full Stack JavaScript",
				institution: "The Odin Project",
				year: "2021",
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
			"¿Tienes alguna pregunta o propuesta? No dudes en contactarme. Estaré encantado de escucharte y responder lo antes posible.",
		name: "Nombre",
		email: "Correo electrónico",
		message: "Mensaje",
		send: "Enviar Mensaje",
		footer: "Con todos los derechos reservados.",
		CV: "Descargar CV",
		heroDescription1:
			"Soy un desarrollador web y diseñador gráfico apasionado, con un gran ojo para los detalles y un amor por crear experiencias de usuario atractivas. Mi trayectoria en la tecnología comenzó con la curiosidad de cómo funcionan las cosas y rápidamente evolucionó en una pasión por construir y diseñar para la web.",
		heroDescription2:
			"Con un conjunto de habilidades diverso que abarca tanto el desarrollo front-end como el diseño gráfico, disfruto creando aplicaciones funcionales y visualmente atractivas que resuelvan problemas del mundo real. Estoy continuamente aprendiendo y explorando nuevas tecnologías para expandir mis capacidades y ofrecer resultados excepcionales.",
		promptCentralDescription:
			"Una plataforma para compartir y descubrir prompts para modelos de IA. Construido con Next.js, Tailwind CSS y MongoDB.",
		project2Description: "Una segunda descripción del proyecto en español.",
		project3Description: "Una tercera descripción del proyecto en español.",
		project4Description: "Una cuarta descripción del proyecto en español.",
		senaDescription:
			"Centrado en hardware, redes y programación básica, proporcionó una base para mi comprensión tecnológica.",
		uocInformaticDescription:
			"Mis estudios de ingeniería informática me permitieron explorar el desarrollo de software, bases de datos y algoritmos, refinando mi experiencia técnica.",
		uocGraphicDescription:
			"Este programa está mejorando mi capacidad para dar vida a visiones creativas con habilidades de diseño visual y digital.",
		odinDescription:
			"Este curso intensivo consolidó mis habilidades de desarrollo web al cubrir HTML, CSS, JavaScript, Node.js y React.",
		systemsTechnician: "Técnico en Sistemas",
		informaticsEngineering: "Pregrado Ingeniería Informática",
		graphicDesign: "Pregrado Diseño Gráfico",
		webDevelopmentFoundations: "Fundamentos de Desarrollo Web",
		contactSuccess: "Gracias por contactarme. Te responderé pronto.",
		contactError:
			"Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.",
		contactFormTitle: "Contáctame",
		about: "Sobre mí",
		contact: "Contacto",
		skills: "Habilidades",
		sections: {
			about: "Sobre mí",
			skills: "Habilidades",
			projects: "Proyectos Recientes",
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
				description: "Un clon de Disney+ construido con React y Firebase.",
			},
			portfolio: {
				title: "Portafolio",
				description: "Mi sitio web personal.",
			},
		},
		education: {
			systemsTechnician: {
				title: "Técnico en Sistemas",
				institution: "SENA",
				year: "2016 - 2021",
				description:
					"Formación técnica en sistemas, incluyendo mantenimiento de hardware, redes y programación básica",
			},
			informaticsEngineering: {
				title: "Ingeniería Informática",
				institution: "Universidad Autónoma de Occidente",
				year: "2022 - Presente",
				description:
					"Estudios en ingeniería informática con enfoque en desarrollo de software, bases de datos y algoritmos.",
			},
			graphicDesign: {
				title: "Diseño Gráfico",
				institution: "Universidad Autónoma de Occidente",
				year: "2022 - Presente",
				description:
					"Programa de diseño gráfico centrado en la creación visual, diseño digital y comunicación visual.",
			},
			odin: {
				title: "Full Stack JavaScript",
				institution: "The Odin Project",
				year: "2021",
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
	const [language, setLanguage] = useState<Language>("en");

	const translate = (key: string): string => {
		const keys = key.split(".");
		return getNestedValue(translations[language], keys);
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, translate }}>
			{children}
		</LanguageContext.Provider>
	);
};

export default LanguageProvider;
