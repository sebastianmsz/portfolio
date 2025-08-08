import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../lib/logger";

interface HealthStatus {
	status: "healthy" | "degraded" | "unhealthy";
	timestamp: string;
	uptime: number;
	version: string;
	environment: string;
	checks: {
		database?: boolean;
		email?: boolean;
		memory?: {
			used: number;
			free: number;
			total: number;
		};
	};
}

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<HealthStatus | { error: string }>
) => {
	try {
		// Only allow GET requests
		if (req.method !== "GET") {
			res.status(405).json({ error: "Method not allowed" });
			return;
		}

		const startTime = Date.now();
		const checks: HealthStatus["checks"] = {};

		// Memory check
		if (typeof process !== "undefined" && process.memoryUsage) {
			const memUsage = process.memoryUsage();
			checks.memory = {
				used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
				free: Math.round(
					(memUsage.heapTotal - memUsage.heapUsed) / 1024 / 1024
				), // MB
				total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
			};
		}

		// Email service check (basic validation)
		checks.email = !!(
			process.env.EMAIL_USER &&
			process.env.EMAIL_PASS &&
			process.env.EMAIL_RECEIVER
		);

		// Determine overall health status
		let status: HealthStatus["status"] = "healthy";

		if (!checks.email) {
			status = "degraded";
		}

		if (checks.memory && checks.memory.used > 500) {
			// More than 500MB
			status = "degraded";
		}

		const healthStatus: HealthStatus = {
			status,
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			version: process.env.npm_package_version || "1.0.0",
			environment: process.env.NODE_ENV || "development",
			checks,
		};

		const processingTime = Date.now() - startTime;

		logger.info("Health check completed", {
			status,
			processingTime,
			checks,
		});

		res.status(status === "healthy" ? 200 : 503).json(healthStatus);
	} catch (error) {
		logger.error("Health check failed", { error });
		res.status(500).json({ error: "Health check failed" });
	}
};

export default handler;
