import { useState, useEffect, useCallback } from "react";

interface CSRFTokenData {
	token: string;
	sessionId: string;
	expiresIn: number;
	message: string;
}

interface CSRFState {
	token: string | null;
	sessionId: string | null;
	isLoading: boolean;
	error: string | null;
	isValid: boolean;
}

const CSRF_STORAGE_KEY = "csrf_data";
const CSRF_REFRESH_BUFFER = 5 * 60 * 1000; // Refresh 5 minutes before expiry

export const useCSRFToken = () => {
	const [state, setState] = useState<CSRFState>({
		token: null,
		sessionId: null,
		isLoading: true,
		error: null,
		isValid: false,
	});

	// Load token from localStorage on mount
	useEffect(() => {
		const loadStoredToken = () => {
			try {
				const stored = localStorage.getItem(CSRF_STORAGE_KEY);
				if (stored) {
					const { token, sessionId, expiresAt } = JSON.parse(stored);
					const now = Date.now();

					if (expiresAt > now + CSRF_REFRESH_BUFFER) {
						setState((prev) => ({
							...prev,
							token,
							sessionId,
							isLoading: false,
							isValid: true,
						}));
						return true;
					} else {
						// Token expired or will expire soon
						localStorage.removeItem(CSRF_STORAGE_KEY);
					}
				}
			} catch (error) {
				console.warn("Failed to load CSRF token from storage:", error);
				localStorage.removeItem(CSRF_STORAGE_KEY);
			}
			return false;
		};

		if (!loadStoredToken()) {
			fetchToken();
		}
	}, []);

	const fetchToken = useCallback(async () => {
		setState((prev) => ({ ...prev, isLoading: true, error: null }));

		try {
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			// Include session ID if we have one
			if (state.sessionId) {
				headers["X-Session-ID"] = state.sessionId;
			}

			const response = await fetch("/api/csrf-token", {
				method: "GET",
				headers,
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch CSRF token: ${response.status}`);
			}

			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || "Failed to get CSRF token");
			}

			const tokenData: CSRFTokenData = data.data;
			const expiresAt = Date.now() + tokenData.expiresIn * 1000;

			// Store in localStorage
			localStorage.setItem(
				CSRF_STORAGE_KEY,
				JSON.stringify({
					token: tokenData.token,
					sessionId: tokenData.sessionId,
					expiresAt,
				})
			);

			setState({
				token: tokenData.token,
				sessionId: tokenData.sessionId,
				isLoading: false,
				error: null,
				isValid: true,
			});

			// Set up automatic refresh before expiry
			const refreshTime = tokenData.expiresIn * 1000 - CSRF_REFRESH_BUFFER;
			setTimeout(() => {
				if (document.visibilityState === "visible") {
					fetchToken();
				}
			}, refreshTime);
		} catch (error) {
			console.error("CSRF token fetch error:", error);
			setState((prev) => ({
				...prev,
				isLoading: false,
				error: error instanceof Error ? error.message : "Unknown error",
				isValid: false,
			}));
		}
	}, [state.sessionId]);

	const refreshToken = useCallback(() => {
		return fetchToken();
	}, [fetchToken]);

	const clearToken = useCallback(() => {
		localStorage.removeItem(CSRF_STORAGE_KEY);
		setState({
			token: null,
			sessionId: null,
			isLoading: false,
			error: null,
			isValid: false,
		});
	}, []);

	// Get headers for API requests
	const getCSRFHeaders = useCallback((): Record<string, string> => {
		const headers: Record<string, string> = {};

		if (state.token && state.sessionId) {
			headers["X-CSRF-Token"] = state.token;
			headers["X-Session-ID"] = state.sessionId;
		}

		return headers;
	}, [state.token, state.sessionId]);

	// Refresh token when page becomes visible again
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible" && state.isValid) {
				// Check if token needs refresh
				const stored = localStorage.getItem(CSRF_STORAGE_KEY);
				if (stored) {
					try {
						const { expiresAt } = JSON.parse(stored);
						const now = Date.now();

						if (expiresAt <= now + CSRF_REFRESH_BUFFER) {
							fetchToken();
						}
					} catch (error) {
						console.warn("Failed to check token expiry:", error);
					}
				}
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () =>
			document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [state.isValid, fetchToken]);

	return {
		...state,
		refreshToken,
		clearToken,
		getCSRFHeaders,
	};
};
