import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./ForgotPassword.css";

function ForgotPassword() {
  const { forgotPassword } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await forgotPassword(email);
      setMessage(res.message || "Password reset link sent!");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="fp-container">
      <h1>Forgot Password</h1>

      <form onSubmit={handleSubmit} className="fp-form">
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Link</button>

        {message && <p className="fp-success">{message}</p>}
        {error && <p className="fp-error">{error}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
