import crypto from "crypto";
import { NextApiRequest } from "next";

// CSRF token store (in production, use Redis or database)
const csrfTokens = new Map<
	string,
	{ token: string; expires: number; ip: string }
>();

// Token configuration
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Cleanup expired tokens periodically
setInterval(() => {
	const now = Date.now();
	for (const [sessionId, data] of csrfTokens.entries()) {
		if (data.expires < now) {
			csrfTokens.delete(sessionId);
		}
	}
}, CLEANUP_INTERVAL);

// Generate a secure random token
export const generateCSRFToken = (): string => {
	return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
};

// Generate a session ID based on IP and user agent
export const generateSessionId = (req: NextApiRequest): string => {
	const ip = getClientIP(req);
	const userAgent = req.headers["user-agent"] || "";
	const timestamp = Date.now().toString();

	return crypto
		.createHash("sha256")
		.update(`${ip}:${userAgent}:${timestamp}`)
		.digest("hex");
};

// Get client IP (shared with security.ts)
const getClientIP = (req: NextApiRequest): string => {
	return (
		(req.headers["x-forwarded-for"] as string) ||
		(req.headers["x-real-ip"] as string) ||
		req.socket.remoteAddress ||
		"unknown"
	);
};

// Store a CSRF token
export const storeCSRFToken = (
	sessionId: string,
	token: string,
	req: NextApiRequest
): void => {
	const ip = getClientIP(req);
	const expires = Date.now() + CSRF_TOKEN_EXPIRY;

	csrfTokens.set(sessionId, {
		token,
		expires,
		ip,
	});
};

// Validate a CSRF token
export const validateCSRFTokenSecure = (
	req: NextApiRequest,
	sessionId?: string
): boolean => {
	// Skip CSRF validation in development
	if (process.env.NODE_ENV === "development") {
		return true;
	}

	const token = req.headers["x-csrf-token"] as string;
	const providedSessionId =
		sessionId || (req.headers["x-session-id"] as string);

	if (!token || !providedSessionId) {
		return false;
	}

	const storedData = csrfTokens.get(providedSessionId);
	if (!storedData) {
		return false;
	}

	const now = Date.now();
	if (storedData.expires < now) {
		csrfTokens.delete(providedSessionId);
		return false;
	}

	// Verify IP matches (optional security measure)
	const currentIP = getClientIP(req);
	if (storedData.ip !== currentIP) {
		return false;
	}

	// Verify token matches
	if (storedData.token !== token) {
		return false;
	}

	// Token is valid, optionally rotate it
	if (process.env.CSRF_ROTATE_ON_USE === "true") {
		const newToken = generateCSRFToken();
		storeCSRFToken(providedSessionId, newToken, req);
	}

	return true;
};

// Get token for a session (if exists and valid)
export const getCSRFToken = (sessionId: string): string | null => {
	const storedData = csrfTokens.get(sessionId);
	if (!storedData) {
		return null;
	}

	const now = Date.now();
	if (storedData.expires < now) {
		csrfTokens.delete(sessionId);
		return null;
	}

	return storedData.token;
};

// Clean up expired tokens (can be called manually)
export const cleanupExpiredTokens = (): number => {
	const now = Date.now();
	let cleaned = 0;

	for (const [sessionId, data] of csrfTokens.entries()) {
		if (data.expires < now) {
			csrfTokens.delete(sessionId);
			cleaned++;
		}
	}

	return cleaned;
};

// Get token statistics (for monitoring)
export const getCSRFStats = () => {
	return {
		totalTokens: csrfTokens.size,
		expiredTokens: cleanupExpiredTokens(),
	};
};
