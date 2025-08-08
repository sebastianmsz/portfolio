import { NextApiRequest, NextApiResponse } from "next";
import helmet from "helmet";
import logger from "./logger";
import { checkRateLimit } from "./security";
import { configManager } from "./config";

export interface ApiError {
	success: false;
	error: string;
	code?: string;
	details?: any;
	requestId: string;
}

export interface ApiSuccess<T = any> {
	success: true;
	data: T;
	requestId: string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

export interface RequestContext {
	requestId: string;
	startTime: number;
	ip: string;
	userAgent: string;
}

// Create request context
export const createRequestContext = (req: NextApiRequest): RequestContext => {
	return {
		requestId: Math.random().toString(36).substring(7),
		startTime: Date.now(),
		ip:
			(req.headers["x-forwarded-for"] as string) ||
			(req.headers["x-real-ip"] as string) ||
			req.socket.remoteAddress ||
			"unknown",
		userAgent: req.headers["user-agent"] || "unknown",
	};
};

// Security headers middleware
export const applySecurityHeaders = (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const config = configManager.getConfig();

		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					scriptSrc: ["'self'"],
					imgSrc: ["'self'", "data:", "https:"],
				},
			},
			crossOriginEmbedderPolicy: false,
			hsts:
				config.NODE_ENV === "production"
					? {
							maxAge: 31536000,
							includeSubDomains: true,
							preload: true,
					  }
					: false,
		})(req as any, res as any, (err: any) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

// CORS middleware
export const applyCORS = (req: NextApiRequest, res: NextApiResponse) => {
	const config = configManager.getConfig();
	const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["*"];

	const origin = req.headers.origin;

	if (
		allowedOrigins.includes("*") ||
		(origin && allowedOrigins.includes(origin))
	) {
		res.setHeader("Access-Control-Allow-Origin", origin || "*");
	}

	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, X-CSRF-Token"
	);
	res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
	res.setHeader("Access-Control-Allow-Credentials", "true");
};

// Method validation middleware
export const validateMethod = (
	req: NextApiRequest,
	res: NextApiResponse,
	allowedMethods: string[],
	context: RequestContext
): boolean => {
	if (!req.method || !allowedMethods.includes(req.method)) {
		logger.warn("Method not allowed", {
			requestId: context.requestId,
			method: req.method,
			allowedMethods,
			ip: context.ip,
		});

		res.status(405).json({
			success: false,
			error: "Method not allowed",
			requestId: context.requestId,
		} as ApiError);

		return false;
	}
	return true;
};

// Rate limiting middleware
export const applyRateLimit = async (
	req: NextApiRequest,
	res: NextApiResponse,
	context: RequestContext
): Promise<boolean> => {
	const rateLimitResult = await checkRateLimit(req);

	if (!rateLimitResult.allowed) {
		res.setHeader(
			"Retry-After",
			rateLimitResult.retryAfter?.toString() || "900"
		);
		res.setHeader("X-RateLimit-Limit", process.env.RATE_LIMIT_MAX || "5");
		res.setHeader("X-RateLimit-Remaining", "0");
		res.setHeader(
			"X-RateLimit-Reset",
			new Date(
				Date.now() + (rateLimitResult.retryAfter || 900) * 1000
			).toISOString()
		);

		res.status(429).json({
			success: false,
			error: "Too many requests. Please try again later.",
			code: "RATE_LIMIT_EXCEEDED",
			details: {
				retryAfter: rateLimitResult.retryAfter,
				rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "5"),
				rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "900"),
			},
			requestId: context.requestId,
		} as ApiError);

		return false;
	}
	return true;
};

// Request logging middleware
export const logRequest = (req: NextApiRequest, context: RequestContext) => {
	logger.info("API request received", {
		requestId: context.requestId,
		method: req.method,
		url: req.url,
		ip: context.ip,
		userAgent: context.userAgent,
		contentLength: req.headers["content-length"],
		referer: req.headers["referer"],
	});
};

// Response logging middleware
export const logResponse = (
	req: NextApiRequest,
	res: NextApiResponse,
	context: RequestContext,
	statusCode: number,
	error?: any
) => {
	const processingTime = Date.now() - context.startTime;

	if (error) {
		logger.error("API request failed", {
			requestId: context.requestId,
			method: req.method,
			url: req.url,
			statusCode,
			processingTime,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});
	} else {
		logger.info("API request completed", {
			requestId: context.requestId,
			method: req.method,
			url: req.url,
			statusCode,
			processingTime,
		});
	}
};

// Error response helper
export const sendError = (
	res: NextApiResponse,
	context: RequestContext,
	statusCode: number,
	error: string,
	code?: string,
	details?: any
) => {
	const errorResponse: ApiError = {
		success: false,
		error,
		requestId: context.requestId,
		...(code && { code }),
		...(details && { details }),
	};

	res.status(statusCode).json(errorResponse);
};

// Success response helper
export const sendSuccess = <T>(
	res: NextApiResponse,
	context: RequestContext,
	data: T,
	statusCode: number = 200
) => {
	const successResponse: ApiSuccess<T> = {
		success: true,
		data,
		requestId: context.requestId,
	};

	res.status(statusCode).json(successResponse);
};

// Handle preflight requests
export const handlePreflight = (
	req: NextApiRequest,
	res: NextApiResponse
): boolean => {
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return true;
	}
	return false;
};

// Generic error handler wrapper
export const withErrorHandler = (
	handler: (
		req: NextApiRequest,
		res: NextApiResponse,
		context: RequestContext
	) => Promise<void>
) => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const context = createRequestContext(req);

		try {
			await handler(req, res, context);
		} catch (error) {
			logResponse(req, res, context, 500, error);

			if (!res.headersSent) {
				sendError(res, context, 500, "Internal server error", "INTERNAL_ERROR");
			}
		}
	};
};

// Complete middleware pipeline
export const withMiddleware = (
	handler: (
		req: NextApiRequest,
		res: NextApiResponse,
		context: RequestContext
	) => Promise<void>,
	options: {
		allowedMethods?: string[];
		requireAuth?: boolean;
		skipRateLimit?: boolean;
	} = {}
) => {
	return withErrorHandler(
		async (
			req: NextApiRequest,
			res: NextApiResponse,
			context: RequestContext
		) => {
			// Log incoming request
			logRequest(req, context);

			// Apply security headers
			await applySecurityHeaders(req, res);

			// Apply CORS
			applyCORS(req, res);

			// Handle preflight requests
			if (handlePreflight(req, res)) {
				return;
			}

			// Validate HTTP method
			if (
				options.allowedMethods &&
				!validateMethod(req, res, options.allowedMethods, context)
			) {
				return;
			}

			// Apply rate limiting
			if (
				!options.skipRateLimit &&
				!(await applyRateLimit(req, res, context))
			) {
				return;
			}

			// Call the actual handler
			await handler(req, res, context);

			// Log successful response
			logResponse(req, res, context, res.statusCode);
		}
	);
};
