import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "../contexts/LanguageContext";
import { useCSRFToken } from "@/hooks/use-csrf";

interface ApiResponse {
	success: boolean;
	data?: {
		message?: string;
		messageId?: string;
	};
	error?: string;
	code?: string;
	details?: Array<{ field: string; message: string }> | { retryAfter?: number };
	retryAfter?: number;
	requestId?: string;
}
interface FormState {
	isSubmitting: boolean;
	hasSubmitted: boolean;
	showSuccess?: boolean;
	// Server-enforced rate limit
	rateLimitUntil?: number; // epoch ms when we can try again
	rateLimitRemaining?: number; // seconds remaining
	// Policy info (from server if available)
	policyMax?: number;
	policyWindowSeconds?: number;
}

export function ContactForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const csrf = useCSRFToken();
	const [formState, setFormState] = useState<FormState>({
		isSubmitting: false,
		hasSubmitted: false,
		showSuccess: false,
	});
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});
	const { translate } = useLanguage();

	// Public env (compile-time) for displaying policy info
	const RATE_LIMIT_MAX = Number(process.env.NEXT_PUBLIC_RATE_LIMIT_MAX ?? 5);
	const RATE_LIMIT_WINDOW_SECONDS = Number(
		process.env.NEXT_PUBLIC_RATE_LIMIT_WINDOW ?? 900
	);

	// Hide success message after 10 seconds
	useEffect(() => {
		if (formState.showSuccess) {
			const timer = setTimeout(() => {
				setFormState((prev) => ({ ...prev, showSuccess: false }));
			}, 10000);
			return () => clearTimeout(timer);
		}
	}, [formState.showSuccess]);

	// Hide success message when user starts typing again
	useEffect(() => {
		if (formState.showSuccess && (name || email || message)) {
			setFormState((prev) => ({ ...prev, showSuccess: false }));
		}
	}, [name, email, message, formState.showSuccess]);

	// Tick down the server-provided rate limit, if present
	useEffect(() => {
		if (!formState.rateLimitUntil) return;

		const tick = () => {
			const remaining = Math.max(
				0,
				Math.ceil((formState.rateLimitUntil! - Date.now()) / 1000)
			);
			setFormState((prev) => ({ ...prev, rateLimitRemaining: remaining }));
		};

		// Initial tick and interval
		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [formState.rateLimitUntil]);

	const validateForm = (): boolean => {
		const errors: Record<string, string> = {};

		if (!name.trim()) {
			errors.name = translate("nameRequired") || "Name is required";
		} else if (name.length < 2) {
			errors.name =
				translate("nameMinLength") || "Name must be at least 2 characters";
		}

		if (!email.trim()) {
			errors.email = translate("emailRequired") || "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email =
				translate("emailInvalid") || "Please enter a valid email address";
		}

		if (!message.trim()) {
			errors.message = translate("messageRequired") || "Message is required";
		} else if (message.length < 10) {
			errors.message =
				translate("messageMinLength") ||
				"Message must be at least 10 characters";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const isRateLimited =
		formState.rateLimitRemaining !== undefined &&
		formState.rateLimitRemaining > 0;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// If server says we're currently rate-limited, avoid sending
		if (isRateLimited) {
			return;
		}

		if (!validateForm()) {
			return;
		}

		setFormState((prev) => ({
			...prev,
			isSubmitting: true,
			hasSubmitted: false,
		}));

		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrf.getCSRFHeaders(),
				},
				body: JSON.stringify({ name, email, message }),
			});

			const data: ApiResponse = await response.json();

			if (response.ok && data.success) {
				// Reset form
				setName("");
				setEmail("");
				setMessage("");
				setValidationErrors({});
				setFormState({
					isSubmitting: false,
					hasSubmitted: true,
					showSuccess: true,
					rateLimitUntil: undefined,
					rateLimitRemaining: undefined,
				});
			} else {
				// Handle rate limiting from API
				if (response.status === 429) {
					// Prefer header; fallback to payload.details.retryAfter or payload.retryAfter
					const retryAfterHeader = response.headers.get("Retry-After");
					const retryAfterSeconds = Number(
						retryAfterHeader ??
							(typeof (data as any)?.details === "object" &&
								(data as any).details &&
								(data as any).details.retryAfter) ??
							data.retryAfter ??
							RATE_LIMIT_WINDOW_SECONDS
					);

					// Extract policy values if provided by API
					const detailsObj = (data as any)?.details as
						| {
								retryAfter?: number;
								rateLimitMax?: number;
								rateLimitWindow?: number;
						  }
						| undefined;
					const policyMax =
						detailsObj?.rateLimitMax ?? formState.policyMax ?? RATE_LIMIT_MAX;
					const policyWindowSeconds =
						detailsObj?.rateLimitWindow ??
						formState.policyWindowSeconds ??
						RATE_LIMIT_WINDOW_SECONDS;

					const until =
						Date.now() + Math.max(1, Math.ceil(retryAfterSeconds)) * 1000;
					setFormState((prev) => ({
						...prev,
						isSubmitting: false,
						hasSubmitted: false,
						showSuccess: false,
						rateLimitUntil: until,
						policyMax,
						policyWindowSeconds,
					}));
				} else if (
					response.status === 400 &&
					(data as any).details &&
					Array.isArray((data as any).details)
				) {
					// Handle validation errors from server
					const serverErrors: Record<string, string> = {};
					(
						(data as any).details as Array<{ field: string; message: string }>
					).forEach(({ field, message }) => {
						serverErrors[field] = message;
					});
					setValidationErrors(serverErrors);
					setFormState((prev) => ({
						...prev,
						isSubmitting: false,
						hasSubmitted: false,
					}));
				} else {
					// Generic error -> not rate limit
					setFormState((prev) => ({
						...prev,
						isSubmitting: false,
						hasSubmitted: false,
					}));
				}
			}
		} catch (error) {
			setFormState((prev) => ({
				...prev,
				isSubmitting: false,
				hasSubmitted: false,
			}));
		}
	};

	// Format a remaining time string using translations
	const formatRemaining = (totalSeconds: number): string => {
		const units = {
			hour: translate("rateLimitUnits.hour"),
			hours: translate("rateLimitUnits.hours"),
			minute: translate("rateLimitUnits.minute"),
			minutes: translate("rateLimitUnits.minutes"),
			second: translate("rateLimitUnits.second"),
			seconds: translate("rateLimitUnits.seconds"),
		};
		const hrs = Math.floor(totalSeconds / 3600);
		const mins = Math.floor((totalSeconds % 3600) / 60);
		const secs = Math.max(0, totalSeconds % 60);
		const parts: string[] = [];
		if (hrs > 0) parts.push(`${hrs} ${hrs === 1 ? units.hour : units.hours}`);
		if (mins > 0)
			parts.push(`${mins} ${mins === 1 ? units.minute : units.minutes}`);
		if (secs > 0 || parts.length === 0)
			parts.push(`${secs} ${secs === 1 ? units.second : units.seconds}`);
		return parts.join(" ");
	};

	// Format policy string like: "5 per 15 minutes"
	const formatPolicy = (): string => {
		const per = translate("rateLimitUnits.per");
		const windowSecs =
			formState.policyWindowSeconds ?? RATE_LIMIT_WINDOW_SECONDS;
		const max = formState.policyMax ?? RATE_LIMIT_MAX;
		if (windowSecs >= 3600) {
			const hours = Math.round(windowSecs / 3600);
			const unit =
				hours === 1
					? translate("rateLimitUnits.hour")
					: translate("rateLimitUnits.hours");
			return `${max} ${per} ${hours} ${unit}`;
		}
		if (windowSecs >= 60) {
			const minutes = Math.round(windowSecs / 60);
			const unit =
				minutes === 1
					? translate("rateLimitUnits.minute")
					: translate("rateLimitUnits.minutes");
			return `${max} ${per} ${minutes} ${unit}`;
		}
		const unit =
			windowSecs === 1
				? translate("rateLimitUnits.second")
				: translate("rateLimitUnits.seconds");
		return `${max} ${per} ${windowSecs} ${unit}`;
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="name" className="block text-sm font-medium mb-1">
					{translate("name")}
				</label>
				<Input
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					disabled={formState.isSubmitting}
					className={validationErrors.name ? "border-red-500" : ""}
				/>
				{validationErrors.name && (
					<p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
				)}
			</div>
			<div>
				<label htmlFor="email" className="block text-sm font-medium mb-1">
					{translate("email")}
				</label>
				<Input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={formState.isSubmitting}
					className={validationErrors.email ? "border-red-500" : ""}
				/>
				{validationErrors.email && (
					<p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
				)}
			</div>
			<div>
				<label htmlFor="message" className="block text-sm font-medium mb-1">
					{translate("message")}
				</label>
				<Textarea
					id="message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required
					disabled={formState.isSubmitting}
					className={validationErrors.message ? "border-red-500" : ""}
				/>
				{validationErrors.message && (
					<p className="text-red-500 text-sm mt-1">
						{validationErrors.message}
					</p>
				)}
			</div>
			<Button
				type="submit"
				className="w-full"
				disabled={
					formState.isSubmitting ||
					isRateLimited ||
					// In production, ensure CSRF is ready before allowing submit
					(process.env.NODE_ENV === "production" &&
						(!csrf.isValid || csrf.isLoading))
				}
			>
				{formState.isSubmitting
					? translate("sending") || "Sending..."
					: translate("send") || "Send"}
			</Button>

			{/* Success Message */}
			{formState.showSuccess && (
				<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg
								className="h-5 w-5 text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-green-800 dark:text-green-200">
								{translate("contactSuccess") ||
									"Your message has been sent successfully!"}
							</p>
							<p className="text-sm text-green-600 dark:text-green-300 mt-1">
								{translate("contactSuccessDetails") ||
									"Thank you for reaching out. I'll get back to you soon."}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Rate Limit Message */}
			{isRateLimited && (
				<div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg
								className="h-5 w-5 text-red-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l5.523 9.827c.75 1.335-.213 2.999-1.742 2.999H4.476c-1.53 0-2.493-1.664-1.743-2.999l5.524-9.827zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-red-800 dark:text-red-200">
								{translate("rateLimitExceeded")}
							</p>
							<p className="text-sm text-red-700 dark:text-red-300 mt-1">
								{translate("rateLimitDetails")}
								<strong>
									{formatRemaining(formState.rateLimitRemaining || 0)}
								</strong>
							</p>
							<p className="text-xs text-red-700/80 dark:text-red-300/80 mt-2">
								{formatPolicy()}
							</p>
						</div>
					</div>
				</div>
			)}
		</form>
	);
}
