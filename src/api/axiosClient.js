import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://dentiled-halley-asyndetically.ngrok-free.dev";

// -----------------------------------------
// FIX: Add ngrok skip header globally
// -----------------------------------------
const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",   // ⭐ REQUIRED FIX
  },
});

// -----------------------------------------
// Token attach
// -----------------------------------------
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -----------------------------------------
// Error handling
// -----------------------------------------
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
