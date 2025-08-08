import { envSchema, EnvConfig } from "./validation";
import logger from "./logger";

class ConfigManager {
	private static instance: ConfigManager;
	private config: EnvConfig | null = null;
	private isInitialized = false;

	private constructor() {}

	public static getInstance(): ConfigManager {
		if (!ConfigManager.instance) {
			ConfigManager.instance = new ConfigManager();
		}
		return ConfigManager.instance;
	}

	public initialize(): EnvConfig {
		if (this.isInitialized && this.config) {
			return this.config;
		}

		try {
			const { error, value } = envSchema.validate(process.env, {
				allowUnknown: true, // Allow other environment variables
				stripUnknown: false,
			});

			if (error) {
				const errorMessage = `Configuration validation failed: ${error.details
					.map((d) => d.message)
					.join(", ")}`;
				logger.error("Configuration validation failed", {
					errors: error.details.map((d) => ({
						field: d.path,
						message: d.message,
					})),
				});
				throw new Error(errorMessage);
			}

			this.config = value as EnvConfig;
			this.isInitialized = true;

			logger.info("Configuration initialized successfully", {
				environment: this.config.NODE_ENV,
				smtpHost: this.config.SMTP_HOST,
				smtpPort: this.config.SMTP_PORT,
				hasEmailUser: !!this.config.EMAIL_USER,
				hasEmailPass: !!this.config.EMAIL_PASS,
				hasEmailReceiver: !!this.config.EMAIL_RECEIVER,
			});

			return this.config;
		} catch (error) {
			logger.error("Failed to initialize configuration", { error });
			throw error;
		}
	}

	public getConfig(): EnvConfig {
		if (!this.isInitialized || !this.config) {
			return this.initialize();
		}
		return this.config;
	}

	public reload(): EnvConfig {
		this.isInitialized = false;
		this.config = null;
		return this.initialize();
	}

	public isProduction(): boolean {
		const config = this.getConfig();
		return config.NODE_ENV === "production";
	}

	public isDevelopment(): boolean {
		const config = this.getConfig();
		return config.NODE_ENV === "development";
	}

	public getEmailConfig() {
		const config = this.getConfig();
		return {
			host: config.SMTP_HOST,
			port: config.SMTP_PORT,
			user: config.EMAIL_USER,
			pass: config.EMAIL_PASS,
			receiver: config.EMAIL_RECEIVER,
		};
	}

	public getRateLimitConfig() {
		const config = this.getConfig();
		return {
			max: config.RATE_LIMIT_MAX,
			windowMs: config.RATE_LIMIT_WINDOW,
		};
	}

	// Validate that all required environment variables are present
	public validateRequiredEnvVars(): { isValid: boolean; missing: string[] } {
		const required = ["EMAIL_USER", "EMAIL_PASS", "EMAIL_RECEIVER"];
		const missing: string[] = [];

		for (const key of required) {
			if (!process.env[key]) {
				missing.push(key);
			}
		}

		return {
			isValid: missing.length === 0,
			missing,
		};
	}
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();

// Export convenience functions
export const getConfig = () => configManager.getConfig();
export const isProduction = () => configManager.isProduction();
export const isDevelopment = () => configManager.isDevelopment();
