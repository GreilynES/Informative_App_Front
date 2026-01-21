import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const apiConfig = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
});

// Helper token (si ya tenés getToken, usalo)
function getToken() {
  return localStorage.getItem("authToken");
}

// Utilidad simple para rate limit headers
function parseRateLimitFromHeaders(h: any) {
  const remaining = Number(h?.["x-ratelimit-remaining"]);
  const retryAfter = Number(h?.["retry-after"]); // segundos
  const reset = Number(h?.["x-ratelimit-reset"]);
  const now = Date.now();

  const msFromRetryAfter = Number.isFinite(retryAfter) ? retryAfter * 1000 : undefined;
  const msFromReset = Number.isFinite(reset)
    ? reset > 10_000_000
      ? reset * 1000 - now
      : reset * 1000
    : undefined;

  const msUntilReset = msFromRetryAfter ?? msFromReset ?? undefined;

  return {
    remaining: Number.isFinite(remaining) ? remaining : undefined,
    msUntilReset,
  };
}

apiConfig.interceptors.request.use(
  (config) => {
    const token = getToken();

    config.headers = config.headers ?? {};

    if (token) config.headers.Authorization = `Bearer ${token}`;

    // OJO: axios setea multipart solo si NO forzás Content-Type.
    // Entonces solo seteamos JSON si no viene seteado.
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    config.headers["Cache-Control"] = "no-cache";
    return config;
  },
  (err) => Promise.reject(err)
);

apiConfig.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 429) {
      const rl = parseRateLimitFromHeaders(error.response.headers || {});
      return Promise.reject({
        isRateLimited: true,
        status: 429,
        message: "Demasiados intentos. Intenta nuevamente más tarde.",
        ...rl,
        original: error,
      });
    }
    return Promise.reject(error);
  }
);

export default apiConfig;
export { apiUrl };
