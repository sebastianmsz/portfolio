import Joi from "joi";

// Contact form validation schema
export const contactFormSchema = Joi.object({
	name: Joi.string()
		.min(2)
		.max(100)
		.pattern(/^[a-zA-Z\s'-]+$/)
		.required()
		.messages({
			"string.base": "Name must be a string",
			"string.empty": "Name is required",
			"string.min": "Name must be at least 2 characters long",
			"string.max": "Name must not exceed 100 characters",
			"string.pattern.base":
				"Name can only contain letters, spaces, hyphens, and apostrophes",
			"any.required": "Name is required",
		}),

	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: true } })
		.max(254)
		.required()
		.messages({
			"string.email": "Please provide a valid email address",
			"string.max": "Email must not exceed 254 characters",
			"any.required": "Email is required",
		}),

	message: Joi.string().min(10).max(2000).required().messages({
		"string.base": "Message must be a string",
		"string.empty": "Message is required",
		"string.min": "Message must be at least 10 characters long",
		"string.max": "Message must not exceed 2000 characters",
		"any.required": "Message is required",
	}),
});

// Environment variables validation schema
export const envSchema = Joi.object({
	EMAIL_USER: Joi.string().email().required(),
	EMAIL_PASS: Joi.string().required(),
	EMAIL_RECEIVER: Joi.string().email().required(),
	SMTP_HOST: Joi.string().default("smtp.gmail.com"),
	SMTP_PORT: Joi.number().default(587),
	RATE_LIMIT_MAX: Joi.number().default(5),
	RATE_LIMIT_WINDOW: Joi.number().default(900), // 15 minutes in seconds
	NODE_ENV: Joi.string()
		.valid("development", "production", "test")
		.default("development"),
	CSRF_ROTATE_ON_USE: Joi.string().valid("true", "false").default("false"),
	TRUSTED_IPS: Joi.string().optional(),
});

export interface ContactFormData {
	name: string;
	email: string;
	message: string;
}

export interface EnvConfig {
	EMAIL_USER: string;
	EMAIL_PASS: string;
	EMAIL_RECEIVER: string;
	SMTP_HOST: string;
	SMTP_PORT: number;
	RATE_LIMIT_MAX: number;
	RATE_LIMIT_WINDOW: number;
	NODE_ENV: string;
	CSRF_ROTATE_ON_USE: string;
	TRUSTED_IPS?: string;
}
