// /hooks/useAuth.jsx  (replace existing content)
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useQuery } from "@tanstack/react-query";

const AuthContext = createContext();

const fetchAuthStatus = async (token) => {
  // If there's no token, return nulls — don't throw
  if (!token) {
    return { user: null, token: null };
  }

  // Validate token with backend; if invalid this will throw
  await api.get("/user/check");
  const storedUser = localStorage.getItem("user");
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token,
  };
};

export const AuthProvider = ({ children }) => {
  // initialise from localStorage synchronously so pages know auth state immediately
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || null);
  const [loadingAction, setLoadingAction] = useState(false);
  const isLoadingInitial = !!token ? false : false; // we'll use query loading separately
  const isLoading = isLoadingInitial || loadingAction;
  const [error, setError] = useState(null);

  // run validation only when token exists
  const {
    data,
    isLoading: queryLoading,
    error: queryError,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["auth-status", token],
    queryFn: () => fetchAuthStatus(token),
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // When the background validation returns, update local state
  useEffect(() => {
    if (data) {
      setUser(data.user);
      setToken(data.token);
    }
  }, [data]);

  const login = async (creds) => {
    setLoadingAction(true);
    setError(null);
    try {
      const response = await api.post("/user/login", creds, { skipAuth: true });
      const respData = response.data;
      // Save immediately so other parts of app can read
      localStorage.setItem("user", JSON.stringify(respData.data.user));
      localStorage.setItem("access_token", respData.data.accessToken);

      // update provider state synchronously
      setUser(respData.data.user);
      setToken(respData.data.accessToken);

      // validate token in background (optional)
      try {
        await refetch();
      } catch (e) {
        // if background validation fails, we'll surface it later
        console.warn("Background token validation failed:", e?.message);
      }

      return respData;
    } catch (err) {
      const message = err?.message || "Login failed.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoadingAction(false);
    }
  };

  const verifyOtp = async (otpToken, code) => {
    const data = await api.post("/user/verify-otp", { otpToken, code }, { skipAuth: true });
    return data.data;
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  }, []);

  const value = {
    user,
    token,
    login,
    verifyOtp,
    logout,
    loading: queryLoading || loadingAction,
    error: error || (isError ? queryError?.message : null),
    isAuthenticated: !!token,
    refetchAuth: refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
