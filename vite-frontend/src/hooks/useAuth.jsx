import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    const response = await api.post("/user/login", data, { skipAuth: true });
    const respData = response.data;
    console.log("Login response:", response);
    localStorage.setItem("user", JSON.stringify(respData.data.user));
    localStorage.setItem("access_token", respData.data.accessToken);
    setUser(respData.data.user);
    return respData;
  };

  const verifyOtp = async (otpToken, code) => {
    const data = await api.post(
      "/user/verify-otp",
      { otpToken, code },
      { skipAuth: true }
    );
    return data.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  };

  const value = {
    user,
    token,
    login,
    verifyOtp,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
