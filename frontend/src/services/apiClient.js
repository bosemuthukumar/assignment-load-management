import axios from "axios";

// Set base URL depending on environment
const API_URL =
  process.env.REACT_APP_API_URL || // e.g., "http://localhost:4000/api"
  (process.env.NODE_ENV === "production"
    ? "https://assignment-load-management-in38.vercel.app/api"
    : "http://localhost:4000/api");

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // only enable if your backend uses cookies
});

// Add auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 (unauthorized) globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove stored user/token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page
      window.location.href = "/login";
    }
    // Return the full error so services can handle it
    return Promise.reject(error);
  },
);

export default apiClient;

// import axios from "axios";

// const API_URL =
//   process.env.REACT_APP_API_URL ||
//   "/api";

// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );

// export default apiClient;
