"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const handleClick = React.useCallback(() => {
		// Use resolvedTheme for accuracy after mount; fallback to toggling based on current class
		const isDark =
			mounted && (resolvedTheme === "dark" || theme === "dark")
				? true
				: typeof document !== "undefined"
				? document.documentElement.classList.contains("dark")
				: false;
		setTheme(isDark ? "light" : "dark");
	}, [mounted, resolvedTheme, theme, setTheme]);

	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label="Toggle theme"
			onClick={handleClick}
			suppressHydrationWarning
		>
			<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
