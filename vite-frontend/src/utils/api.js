import axios from "axios";
import { toast } from "react-toastify";

console.info(
  "[api] initializing, baseURL =",
  import.meta.env.VITE_APP_API_ENDPOINT
);

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("access_token");
      if (token && !config?.skipAuth) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.debug("[api] request ->", {
        method: config.method,
        url: config.url,
        skipAuth: !!config.skipAuth,  
      });
    } catch (e) {
      console.warn("[api] request interceptor error (ignored):", e);
    }
    return config;
  },
  (err) => {
    console.error("[api] request interceptor failed", err);
    return Promise.reject(err);
  }
);

function buildAndReject(response, message) {
  const err = new Error(message || "API Error");
  err.response = response;
  return Promise.reject(err);
}
api.interceptors.response.use(
  (response) => {
    // Debug log
    console.debug("[api] response <-", {
      url: response?.config?.url,
      status: response?.status,
      data: response?.data,
    });
    const data = response?.data;
    const hasAppError =
      data &&
      (data.error === true ||
        (typeof data.status === "number" && data.status >= 400));

    if (hasAppError) {
      const msg = (data && (data.message || data.error)) || "An error occurred";
      const isUnauthorized =
        (data && data.status === 401) ||
        String(msg).toLowerCase().includes("unauthor") ||
        String(msg).toLowerCase().includes("invalid session") ||
        String(msg).toLowerCase().includes("invalid token") ||
        String(msg).toLowerCase().includes("expired");

      if (isUnauthorized) {
        try {
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        } catch (e) {}
      }
      toast.error(msg);
      return buildAndReject(response, msg);
    }

    return response;
  },
  async (error) => {
    try {
      console.error(
        "[api] interceptor caught error:",
        error && (error.message || error.toString())
      );
      console.debug("[api] error.config:", error?.config);
      console.debug("[api] error.request:", error?.request);

      const { response } = error;

      if (response) {
        console.error("API Error Response:", response);

        const data = response.data || {};
        const msg =
          data.message ||
          data.error ||
          response.statusText ||
          "An error occurred";

        toast.error(msg);

        if (response.status === 401 || (data && data.status === 401)) {
          try {
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
          } catch (e) {}
        }
        return buildAndReject(response, msg);
      } else {
        const networkMsg = "Network error: please check your connection.";
        toast.error(networkMsg);
        const err = new Error(networkMsg);
        err.original = error;
        return Promise.reject(err);
      }
    } catch (loggingError) {
      console.error("[api] error while handling an error:", loggingError);
      return Promise.reject(error);
    }
  }
);

export default api;
