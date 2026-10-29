import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor request
apiClient.interceptors.request.use((config) => {
  // add token to header
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// interceptor response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Timeout session");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth:unauthorized"));
      } else if (error.response.status === 500) {
        console.error("Internal server error");
      }
    } else if (error.request) {
      console.error("No response from server");
    }
    return Promise.reject(error);
  }
);