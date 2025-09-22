import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise = null;

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

// Response Interceptor → Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if this is a 401 error and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If we're already refreshing, wait for that to complete
      if (isRefreshing) {
        try {
          await refreshPromise;
          // Retry with the new token
          const newToken = localStorage.getItem("accessToken");
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken && !isRefreshing) {
        isRefreshing = true;
        
        // Create a promise for the refresh operation
        refreshPromise = refreshTokens(refreshToken);
        
        try {
          const newTokens = await refreshPromise;
          
          if (newTokens) {
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return api(originalRequest);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          handleLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      } else {
        handleLogout();
      }
    }

    return Promise.reject(error);
  }
);

// Separate function to handle token refresh
const refreshTokens = async (refreshToken) => {
  try {
    // Use axios directly instead of api to avoid interceptor loops
    const response = await api.post(
      "/users/refresh-token",
      { token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Update localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    // Update auth context in localStorage
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      authData.accessToken = accessToken;
      authData.refreshToken = newRefreshToken;
      localStorage.setItem("auth", JSON.stringify(authData));
    }

    console.log("Tokens refreshed successfully");
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error("Failed to refresh tokens:", error);
    throw error;
  }
};

// Handle logout
const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("auth");
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('tokenExpired'));
  
  // Redirect to login
  if (window.location.pathname !== '/login') {
    window.location.href = "/login";
  }
};

export default api;