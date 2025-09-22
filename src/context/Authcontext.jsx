import React, { createContext, useState, useEffect } from "react";
import api from "../api/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    userInfo: null,
    accessToken: null,
    refreshToken: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Load auth from localStorage
  const loadAuthFromLocalStorage = () => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  };

  // Toggle functions
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleNewPasswordVisibility = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  // API wrapper for signup/login
  const createUser = async (endpoint, userData) => {
    try {
      const response = await api.post(endpoint, userData);
      return response.data;
    } catch (error) {
      console.error(`Error in ${endpoint}:`, error);
      throw error;
    }
  };

  // Login
  const login = (userInfo, accessToken, refreshToken) => {
    if (!accessToken || !refreshToken) {
      console.error("Login failed: missing tokens!");
      return;
    }
    const newAuth = {
      isAuthenticated: true,
      userInfo,
      accessToken,
      refreshToken,
    };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  // Refresh Tokens
  const refreshTokens = async () => {
    try {
      const storedRefresh = localStorage.getItem("refreshToken");
      if (!storedRefresh) return null;

      const res = await api.post("/users/refresh-token", {
        token: storedRefresh,
      });
      const { accessToken, refreshToken } = res.data.data;

      const updatedAuth = {
        ...auth,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      };
      setAuth(updatedAuth);
      localStorage.setItem("auth", JSON.stringify(updatedAuth));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return accessToken;
    } catch (err) {
      console.error("Failed to refresh tokens:", err);
      logout(); // fallback: force logout
      return null;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/users/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setAuth({
        isAuthenticated: false,
        userInfo: null,
        accessToken: null,
        refreshToken: null,
      });
      localStorage.removeItem("auth");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  // Fetch categories and products
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    loadAuthFromLocalStorage();
    fetchCategories();
    fetchProducts();
  }, []);

  // Direct context value (no useMemo)
  const contextValue = {
    auth,
    login,
    logout,
    refreshTokens,
    createUser,
    categories,
    products,
    fetchCategories,
    fetchProducts,
    showPassword,
    showNewPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
