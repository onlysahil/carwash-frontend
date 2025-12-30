import { useState } from "react";
import "./Login.css";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // 👁️
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({
        email: form.email,
        password: form.password,
      });

      const role = result.role;

      // ================= ROLE BASED REDIRECT =================
      if (role === "admin") {
        navigate("/admin/dashboard");
      } 
      else if (role === "receptionist") {
        navigate("/reception/dashboard");
      } 
      else if (role === "detailer") {
        navigate("/staff/profile/detailer");
      } 
      else if (role === "cleaner") {
        navigate("/staff/profile/cleaner");
      } 
      else {
        // normal customer
        navigate("/profile");
      }

    } catch (err) {
      const backendMessage =
        err.response?.data?.message || "Invalid email or password";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h1>LOGIN</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        {/* EMAIL */}
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        {/* PASSWORD */}
        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          {/* 👁️ EYE BUTTON */}
          <span
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="login-error">{error}</p>}

        <p className="forgot-pass">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p className="login-signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;