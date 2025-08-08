import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextApiRequest } from "next";
import logger from "./logger";

// Rate limiter configuration
const rateLimiter = new RateLimiterMemory({
	points: parseInt(process.env.RATE_LIMIT_MAX || "5"), // Number of requests
	duration: parseInt(process.env.RATE_LIMIT_WINDOW || "900"), // Per 15 minutes (900 seconds)
});

// Helper function to get client IP
const getClientIP = (req: NextApiRequest): string => {
	return (
		(req.headers["x-forwarded-for"] as string) ||
		(req.headers["x-real-ip"] as string) ||
		req.socket.remoteAddress ||
		"unknown"
	);
};

export const checkRateLimit = async (
	req: NextApiRequest
): Promise<{ allowed: boolean; retryAfter?: number }> => {
	const clientIP = getClientIP(req);

	try {
		await rateLimiter.consume(clientIP);
		return { allowed: true };
	} catch (rejRes: any) {
		// Sliding window approach (recommended - more user-friendly)
		const retryAfterMs = Math.round(rejRes.msBeforeNext) || 1000;
		const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

		// For a fixed window approach, uncomment this instead:
		// const windowDuration = parseInt(process.env.RATE_LIMIT_WINDOW || "900");
		// const retryAfterSeconds = windowDuration;

		logger.warn("Rate limit exceeded", {
			ip: clientIP,
			retryAfterMs,
			retryAfterSeconds,
			userAgent: req.headers["user-agent"],
		});

		return {
			allowed: false,
			retryAfter: retryAfterSeconds, // Return in seconds for consistency
		};
	}
};

// IP whitelist for development/trusted sources
const TRUSTED_IPS = process.env.TRUSTED_IPS?.split(",") || [];

export const isTrustedIP = (req: NextApiRequest): boolean => {
	if (process.env.NODE_ENV === "development") {
		return true; // Skip IP checking in development
	}

	const ip = getClientIP(req);
	return TRUSTED_IPS.includes(ip);
};

// CSRF protection (simple token validation)
export const validateCSRFToken = (req: NextApiRequest): boolean => {
	// Import the secure CSRF validation here to avoid circular imports
	const { validateCSRFTokenSecure } = require("./csrf");
	return validateCSRFTokenSecure(req);
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
	return input
		.replace(/[<>]/g, "") // Remove basic HTML tags
		.trim()
		.substring(0, 2000); // Limit length
};
