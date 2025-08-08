import winston from "winston";
import fs from "fs";
import path from "path";

// Determine if can write to disk for file logging
const isReadOnlyEnv = Boolean(process.env.VERCEL);

const baseTransports: winston.transport[] = [];

if (!isReadOnlyEnv) {
	try {
		const logsDir = path.join(process.cwd(), "logs");
		if (!fs.existsSync(logsDir)) {
			fs.mkdirSync(logsDir, { recursive: true });
		}
		baseTransports.push(
			// Write all logs with importance level of `error` or less to `error.log`
			new winston.transports.File({
				filename: path.join(logsDir, "error.log"),
				level: "error",
			}),
			// Write all logs with importance level of `info` or less to `combined.log`
			new winston.transports.File({
				filename: path.join(logsDir, "combined.log"),
			})
		);
	} catch {
		// In read-only or restricted environments, fall back to console below
	}
}

const logger = winston.createLogger({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
	defaultMeta: { service: "portfolio-api" },
	transports: baseTransports,
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// Always add console logging in development. In production, add it when file logging isn't available.
if (process.env.NODE_ENV !== "production" || logger.transports.length === 0) {
	logger.add(
		new winston.transports.Console({
			format:
				process.env.NODE_ENV !== "production"
					? winston.format.simple()
					: winston.format.json(),
		})
	);
}

export default logger;
