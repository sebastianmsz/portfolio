import { NextApiRequest, NextApiResponse } from "next";
import {
	withMiddleware,
	sendError,
	sendSuccess,
	RequestContext,
} from "../../lib/middleware";
import {
	generateCSRFToken,
	generateSessionId,
	storeCSRFToken,
	getCSRFToken,
} from "../../lib/csrf";
import logger from "../../lib/logger";

const csrfTokenHandler = async (
	req: NextApiRequest,
	res: NextApiResponse,
	context: RequestContext
) => {
	try {
		// Generate or retrieve session ID
		let sessionId = req.headers["x-session-id"] as string;
		let isNewSession = false;

		if (!sessionId) {
			sessionId = generateSessionId(req);
			isNewSession = true;
		}

		// Check if we have a valid existing token for this session
		let token = getCSRFToken(sessionId);

		if (!token) {
			// Generate new token
			token = generateCSRFToken();
			storeCSRFToken(sessionId, token, req);
			isNewSession = true;
		}

		logger.info("CSRF token generated", {
			requestId: context.requestId,
			sessionId: sessionId.substring(0, 8) + "...", // Log only first 8 chars for security
			isNewSession,
			ip: context.ip,
		});

		// Set security headers
		res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
		res.setHeader("Pragma", "no-cache");
		res.setHeader("Expires", "0");

		sendSuccess(res, context, {
			token,
			sessionId,
			expiresIn: 3600, // 1 hour in seconds
			message: isNewSession
				? "New CSRF token generated"
				: "Existing CSRF token retrieved",
		});
	} catch (error) {
		logger.error("Error generating CSRF token", {
			requestId: context.requestId,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});

		sendError(
			res,
			context,
			500,
			"Failed to generate CSRF token",
			"CSRF_GENERATION_FAILED"
		);
	}
};

// Export the handler with middleware
export default withMiddleware(csrfTokenHandler, {
	allowedMethods: ["GET"],
	requireAuth: false,
	skipRateLimit: true, // CSRF token generation should not be rate limited
});
