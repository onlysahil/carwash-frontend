import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

function SetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosClient.post("/auth/staff/set-password", {
        token: email, // backend expects token (email-based)
        password,
      });

      if (res.status === 201) {
        setSuccess("Password set successfully! You can now login.");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error(err);
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