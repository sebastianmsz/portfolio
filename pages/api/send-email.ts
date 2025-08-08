import { NextApiRequest, NextApiResponse } from "next";
import { contactFormSchema, ContactFormData } from "../../lib/validation";
import { sanitizeInput, validateCSRFToken } from "../../lib/security";
import { createEmailService } from "../../lib/emailService";
import { configManager } from "../../lib/config";
import {
	withMiddleware,
	sendError,
	sendSuccess,
	RequestContext,
} from "../../lib/middleware";
import logger from "../../lib/logger";

// Initialize configuration and email service
const config = configManager.getConfig();
const emailService = createEmailService(config);

const sendEmailHandler = async (
	req: NextApiRequest,
	res: NextApiResponse,
	context: RequestContext
) => {
	try {
		// Validate CSRF token (in production)
		if (!validateCSRFToken(req)) {
			logger.warn("CSRF token validation failed", {
				requestId: context.requestId,
			});
			sendError(res, context, 403, "Invalid CSRF token", "CSRF_TOKEN_INVALID");
			return;
		}

		// Validate request body structure
		if (!req.body || typeof req.body !== "object") {
			logger.warn("Invalid request body", {
				requestId: context.requestId,
				body: req.body,
			});
			sendError(res, context, 400, "Invalid request body", "INVALID_BODY");
			return;
		}

		// Sanitize input data
		const sanitizedData = {
			name: sanitizeInput(req.body.name || ""),
			email: sanitizeInput(req.body.email || ""),
			message: sanitizeInput(req.body.message || ""),
		};

		// Validate input data with Joi
		const { error, value } = contactFormSchema.validate(sanitizedData);
		if (error) {
			logger.warn("Input validation failed", {
				requestId: context.requestId,
				errors: error.details.map((d) => ({
					field: d.path,
					message: d.message,
				})),
			});

			sendError(res, context, 400, "Validation failed", "VALIDATION_ERROR", {
				details: error.details.map((d) => ({
					field: d.path.join("."),
					message: d.message,
				})),
			});
			return;
		}

		const validatedData: ContactFormData = value;

		// Log the email sending attempt
		logger.info("Attempting to send email", {
			requestId: context.requestId,
			senderEmail: validatedData.email,
			senderName: validatedData.name,
		});

		// Send email
		const emailResult = await emailService.sendContactEmail(
			validatedData,
			config.EMAIL_RECEIVER
		);

		if (emailResult.success) {
			logger.info("Email sent successfully", {
				requestId: context.requestId,
				messageId: emailResult.messageId,
			});

			sendSuccess(res, context, {
				message: "Email sent successfully",
				messageId: emailResult.messageId,
			});
		} else {
			logger.error("Failed to send email", {
				requestId: context.requestId,
				error: emailResult.error,
			});

			sendError(
				res,
				context,
				500,
				"Failed to send email. Please try again later.",
				"EMAIL_SEND_FAILED"
			);
		}
	} catch (error) {
		logger.error("Unexpected error in send-email handler", {
			requestId: context.requestId,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});

		sendError(res, context, 500, "Internal server error", "INTERNAL_ERROR");
	}
};

// Export the handler with middleware
export default withMiddleware(sendEmailHandler, {
	allowedMethods: ["POST"],
	requireAuth: false,
	skipRateLimit: false,
});
