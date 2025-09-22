import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
});

// Request Interceptor → Add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Access token expired or invalid");

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Call refresh endpoint
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/refresh-token`, {
            token: refreshToken, // ✅ match backend (expects `token`)
          });

          const { accessToken, refreshToken: newRefreshToken } = res.data.data;

          // Save new tokens
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry failed request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // logout
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        // No refresh token → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export default api;
