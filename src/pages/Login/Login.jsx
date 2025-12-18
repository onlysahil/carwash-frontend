import { useState } from "react";
import "./Login.css";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

 async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  try {
    const payload = { email: form.email, password: form.password };
    const res = await axiosClient.post("/auth/login", payload);

    // ✅ Normal login
    localStorage.setItem("token", res.data.token);

    if (res.data.canUploadKYC) {
      navigate("/staff/upload-kyc");
      return;
    }

    navigate("/profile");

  } catch (err) {
  const data = err.response?.data;

  // FIRST-TIME STAFF → REDIRECT TO SET PASSWORD
  if (
    err.response?.status === 401 &&
    data?.message === "Password not set. Please set your password first."
  ) {
    navigate("/staff/set-password", {
      state: {
        token: data.token, // make sure backend sends this
        email: form.email,
      },
    });
    return;
  }

  setError(data?.message || "Login failed");
}
}



  return (
    <>
      {/* HERO BANNER */}
      <section className="cw-banner">
        <div className="cw-banner-overlay"></div>

        <div className="cw-banner-content">
          <h1 className="cw-banner-title">Welcome Back</h1>
          <p className="cw-banner-subtitle">
            Login to continue your premium car care
          </p>

          <div className="cw-bubbles">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </section>

      {/* LOGIN FORM */}
      <div className="login-container">
        <h1>Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
<input
  type="email"
  value={form.email}
  onChange={(e) => setForm({ ...form, email: e.target.value })}
/>

{form.password !== null && (
  <>
    <label>Password</label>
    <input
      type="password"
      value={form.password}
      onChange={(e) => setForm({ ...form, password: e.target.value })}
    />
  </>
)}

          <button type="submit" className="login-btn">
            Login
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
    </>
  );
}

export default Login;
