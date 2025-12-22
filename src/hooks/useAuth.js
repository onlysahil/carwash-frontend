import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../api/axiosClient";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // Load User Profile (/users/:id)
  // ================================
  const loadProfile = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await axiosClient.get(`/users/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.error("Profile load error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================================
  // Validate token on mount
  // ================================
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Token expired?
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        setUser(null);
        setLoading(false);
        return;
      }

      // Save decoded user info
      localStorage.setItem("user_id", decoded.id);
      localStorage.setItem("email", decoded.email);
      localStorage.setItem("role", decoded.role);

      loadProfile();
    } catch (err) {
      console.error("Token decode error:", err);
      localStorage.clear();
      setUser(null);
      setLoading(false);
    }
  }, [loadProfile]);

  // ================================
  // Login Function
  // ================================
 const login = async (credentials) => {
  const res = await axiosClient.post("/auth/login", credentials);

  // 🔴 FIRST-TIME STAFF → SET PASSWORD FLOW
  // FIRST-TIME PASSWORD SET
if (
  res.data.message === "Password not set. Please set your password first." &&
  res.data.token
) {
  return {
    requiresPasswordSetup: true,
    token: res.data.token,
  };
}

// KYC UPLOAD FLOW
if (
  res.data.message === "Login allowed for KYC upload" &&
  res.data.token
) {
  localStorage.setItem("token", res.data.token);

  const decoded = jwtDecode(res.data.token);
  localStorage.setItem("user_id", decoded.id);
  localStorage.setItem("role", decoded.role);

  return {
    canUploadKYC: true,
    verificationStatus: "pending",
    role: decoded.role,
  };
}


  // ✅ NORMAL LOGIN FLOW
  const token = res.data.token;
  if (!token) throw new Error("No token returned");

  // Save auth token
  localStorage.setItem("token", token);
  localStorage.setItem("access_token", token);

  // Decode token
  const decoded = jwtDecode(token);

  localStorage.setItem("user_id", decoded.id);
  localStorage.setItem("email", decoded.email);
  localStorage.setItem("role", decoded.role);

  // Load full profile
  await loadProfile();

  return {
  role: decoded.role,
};
};

  // ================================
  // Logout
  // ================================
  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return { user, loading, login, logout, loadProfile };
}

export default useAuth;
