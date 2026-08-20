import axios from "axios";

import { getToken } from "../utils/auth.js";


const DEFAULT_API_URL = "http://127.0.0.1:8000/api";
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
const API_BASE_URL = `${(
    import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL
).replace(/\/+$/, "")}/`;


class ApiError extends Error {
    constructor(
        message,
        {
            status = null,
            code = null,
            details = null,
            isNetworkError = false,
        } = {},
    ) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.details = details;
        this.isNetworkError = isNetworkError;
    }
}


function _getCookie(name) {
    if (typeof document === "undefined") {
        return null;
    }

    const prefix = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith(prefix));

    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}


function _extractMessage(details, statusCode) {
    if (typeof details === "string" && details.trim()) {
        return details;
    }
    if (details?.detail) {
        return details.detail;
    }
    if (details && typeof details === "object") {
        const firstValue = Object.values(details)[0];
        if (Array.isArray(firstValue) && firstValue.length > 0) {
            return String(firstValue[0]);
        }
        if (typeof firstValue === "string") {
            return firstValue;
        }
    }
    if (statusCode === 404) {
        return "The requested resource was not found.";
    }
    if (statusCode && statusCode >= 500) {
        return "The server could not complete the request. Please try again.";
    }

    return "The request could not be completed.";
}


function _normalizeError(error) {
    if (error instanceof ApiError) {
        return error;
    }

    if (!axios.isAxiosError(error)) {
        return new ApiError(
            error?.message || "An unexpected application error occurred.",
        );
    }

    if (error.code === "ERR_CANCELED") {
        return new ApiError("The request was canceled.", {
            code: error.code,
        });
    }

    if (!error.response) {
        const timedOut = ["ECONNABORTED", "ETIMEDOUT"].includes(error.code);
        return new ApiError(
            timedOut
                ? "The request timed out. Please try again."
                : "Unable to connect to the server. Check your network.",
            {
                code: error.code,
                isNetworkError: true,
            },
        );
    }

    const { data, status } = error.response;
    return new ApiError(_extractMessage(data, status), {
        status,
        code: error.code,
        details: data,
    });
}


const API_CLIENT = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
    transitional: {
        clarifyTimeoutError: true,
    },
});

API_CLIENT.interceptors.request.use(
    (config) => {
        const method = config.method?.toUpperCase() || "GET";
        if (!SAFE_METHODS.includes(method)) {
            const csrfToken = _getCookie("csrftoken");
            if (csrfToken) {
                config.headers.set("X-CSRFToken", csrfToken);
            }
        }

        const accessToken = getToken();
        if (accessToken) {
            config.headers.set("Authorization", `Bearer ${accessToken}`);
        }

        return config;
    },
    (error) => Promise.reject(_normalizeError(error)),
    { synchronous: true },
);

API_CLIENT.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(_normalizeError(error)),
);


export { ApiError };
export default API_CLIENT;
