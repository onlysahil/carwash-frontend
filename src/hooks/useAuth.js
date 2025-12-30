import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../api/axiosClient";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const res = await axiosClient.get(`/users/${userId}`);
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        setLoading(false);
        return;
      }

      localStorage.setItem("user_id", decoded.id);
      localStorage.setItem("role", decoded.role);

      loadProfile();
    } catch {
      localStorage.clear();
    }
  }, [loadProfile]);

  const login = async (credentials) => {
    const res = await axiosClient.post("/auth/login", credentials);
    const token = res.data.token;

    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    localStorage.setItem("user_id", decoded.id);
    localStorage.setItem("role", decoded.role);

    await loadProfile();

    return { role: decoded.role };
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return { user, loading, login, logout };
}

export default useAuth;