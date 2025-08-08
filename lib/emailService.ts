import nodemailer from "nodemailer";
import logger from "./logger";
import { ContactFormData, EnvConfig } from "./validation";

export interface EmailServiceConfig {
	host: string;
	port: number;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	};
	maxRetries?: number;
	retryDelay?: number;
}

export class EmailService {
	private transporter: nodemailer.Transporter;
	private config: EmailServiceConfig;
	private maxRetries: number;
	private retryDelay: number;

	constructor(config: EmailServiceConfig) {
		this.config = config;
		this.maxRetries = config.maxRetries || 3;
		this.retryDelay = config.retryDelay || 1000;

		this.transporter = nodemailer.createTransport({
			host: config.host,
			port: config.port,
			secure: config.secure,
			auth: config.auth,
			pool: true, // Enable connection pooling
			maxConnections: 5,
			maxMessages: 100,
			rateDelta: 1000, // Rate limit: 1 message per second
			rateLimit: 1,
		});

		// Verify transporter configuration
		this.verifyConnection();
	}

	private async verifyConnection(): Promise<void> {
		try {
			await this.transporter.verify();
			logger.info("Email service connected successfully");
		} catch (error) {
			logger.error("Failed to connect to email service", { error });
		}
	}

	private async delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private generateEmailHTML(data: ContactFormData): string {
		return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #fff; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #007cba; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${this.escapeHtml(data.name)}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${this.escapeHtml(data.email)}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${this.escapeHtml(data.message).replace(
									/\n/g,
									"<br>"
								)}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from your portfolio contact form.</p>
              <p>Received at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;
	}

	private escapeHtml(text: string): string {
		const map: { [key: string]: string } = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#039;",
		};
		return text.replace(/[&<>"']/g, (m) => map[m]);
	}

	async sendContactEmail(
		data: ContactFormData,
		receiverEmail: string
	): Promise<{ success: boolean; messageId?: string; error?: string }> {
		const mailOptions = {
			from: `"${data.name}" <${this.config.auth.user}>`, // Use authenticated email as sender
			to: receiverEmail,
			replyTo: data.email, // Set reply-to to the actual sender
			subject: `Portfolio Contact: ${data.name}`,
			text: `
Name: ${data.name}
Email: ${data.email}
Message:
${data.message}

---
Sent from: Portfolio Contact Form
Time: ${new Date().toLocaleString()}
      `,
			html: this.generateEmailHTML(data),
			headers: {
				"X-Mailer": "Portfolio Contact Form",
				"X-Priority": "3",
				"X-MSMail-Priority": "Normal",
			},
		};

		let lastError: any;

		for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
			try {
				logger.info(`Sending email attempt ${attempt}/${this.maxRetries}`, {
					to: receiverEmail,
					from: data.email,
					subject: mailOptions.subject,
				});

				const info = await this.transporter.sendMail(mailOptions);

				logger.info("Email sent successfully", {
					messageId: info.messageId,
					response: info.response,
					attempt,
				});

				return {
					success: true,
					messageId: info.messageId,
				};
			} catch (error) {
				lastError = error;

				logger.warn(`Email sending attempt ${attempt} failed`, {
					error: error instanceof Error ? error.message : String(error),
					attempt,
					willRetry: attempt < this.maxRetries,
				});

				if (attempt < this.maxRetries) {
					await this.delay(this.retryDelay * attempt); // Exponential backoff
				}
			}
		}

		logger.error("All email sending attempts failed", {
			error: lastError instanceof Error ? lastError.message : String(lastError),
			attempts: this.maxRetries,
		});

		return {
			success: false,
			error:
				lastError instanceof Error
					? lastError.message
					: "Unknown error occurred",
		};
	}

	async close(): Promise<void> {
		this.transporter.close();
		logger.info("Email service connection closed");
	}
}

export const createEmailService = (envConfig: EnvConfig): EmailService => {
	return new EmailService({
		host: envConfig.SMTP_HOST,
		port: envConfig.SMTP_PORT,
		secure: envConfig.SMTP_PORT === 465, // true for 465, false for other ports
		auth: {
			user: envConfig.EMAIL_USER,
			pass: envConfig.EMAIL_PASS,
		},
		maxRetries: 3,
		retryDelay: 1000,
	});
};
