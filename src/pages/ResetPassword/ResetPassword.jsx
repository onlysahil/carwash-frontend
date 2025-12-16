import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const { resetPassword } = useContext(AuthContext);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // get token from URL

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPass !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await resetPassword(token, newPass, confirmPass);
      setMessage(res.message || "Password reset successful!");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="rp-container">
      <h1>Reset Password</h1>

      <form className="rp-form" onSubmit={handleSubmit}>
        <label>New Password</label>
        <input
          type="password"
          value={newPass}
          placeholder="Enter new password"
          onChange={(e) => setNewPass(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPass}
          placeholder="Confirm new password"
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>

        {message && <p className="rp-success">{message}</p>}
        {error && <p className="rp-error">{error}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
