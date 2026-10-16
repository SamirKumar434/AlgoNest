import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const url = originalRequest.url || "";
      const path = window.location.pathname;

      // Auth check and login/signup requests should just fail quietly
      if (
        url.includes("/user/check") ||
        url.includes("/user/login") ||
        url.includes("/user/register")
      ) {
        return Promise.reject(error);
      }

      if (url.includes("/logout")) {
        window.location.href = "/";
        return Promise.reject(error);
      }

      if (path !== "/login" && path !== "/signup") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
export default axiosClient;
