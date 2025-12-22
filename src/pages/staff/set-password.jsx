import { useState, React } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

import "./SetPassword.css";

function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ read from URL

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!token) {
    setError("Invalid or missing token");
    return;
  }

  try {
    const res = await axiosClient.post("/auth/staff/set-password", {
      token, // pass token in body
      password,
    });

    if (res.status === 201) {
      setSuccess("Password set successfully! You can now login.");
      setTimeout(() => navigate("/login"), 1500);
    }
  } catch (err) {
    setError(err.response?.data?.message || "Failed to set password");
  }
};
  return (
    <div className="set-password-container">
      <h2>Set Your Password</h2>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Set Password</button>
      </form>
    </div>
  );
}

export default SetPassword;
