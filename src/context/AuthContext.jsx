
import React, { createContext, useState, useEffect } from "react";
import authApi from "../api/auth";
import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await authApi.getProfile();
      setUser(res.data.user || res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      logout();
    }
  };

  
  const login = async (credentials) => {
  const res = await authApi.login(credentials);

  const token = res.data.token;
  if (!token) throw new Error("Token missing in response");

  // Save token
  localStorage.setItem("token", token);
  localStorage.setItem("access_token", token);

  // 🔥 THIS WAS MISSING
  setToken(token);

  // Decode
  const decoded = jwtDecode(token);

  localStorage.setItem("user_id", decoded.id);
  localStorage.setItem("email", decoded.email);
  localStorage.setItem("role", decoded.role);

  setUser(decoded);

  return decoded;
};

  
  const register = async (data) => {
    return axiosClient.post("/auth/signup", {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address
    });
  };



  const forgotPassword = async (email) => {
    try {
      const res = await authApi.forgotPassword(email);
      return res.data;
    } catch (err) {
      throw err;
    }
  };



  const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
      const response = await axiosClient.put("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };


 const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("email");
  localStorage.removeItem("role");

  setUser(null);
  setToken(null);
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};


