import { useState, useEffect } from "react";
import "./Login.css";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const isEmail = form.identifier.includes("@");

      // 🔹 Staff first login → EMAIL ONLY
      const payload = isEmail
        ? { email: form.identifier }
        : { phone: form.identifier, password: form.password };

      const userData = await login(payload);

      setForm({ identifier: "", password: "" });

      // 🔹 Role-based redirect
      if (userData.role === "receptionist") {
        navigate("/reception/approvals");
      } else if (userData.role === "detailer") {
        navigate("/staff/detailer");
      } else if (userData.role === "cleaner") {
        navigate("/staff/cleaner");
      } else {
        navigate("/profile");
      }

    } catch (err) {
  const data = err?.response?.data;

  if (
    data?.message === "Password not set. Please set your password first." &&
    data?.token
  ) {
    navigate("/staff/set-password", {
      state: {
        token: data.token,
        email: form.identifier,
      },
    });
    return;
  }

  setError("Invalid login credentials");
}
  }

  useEffect(() => {
    const el = document.querySelector(".scroll-animate");

    function reveal() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 120) {
        el.classList.add("visible");
      }
    }

    window.addEventListener("scroll", reveal);
    reveal();

    return () => window.removeEventListener("scroll", reveal);
  }, []);

  const isEmail = form.identifier.includes("@");

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
          <label>Email or Phone Number</label>
          <input
            type="text"
            value={form.identifier}
            onChange={(e) =>
              setForm({ ...form, identifier: e.target.value })
            }
            required
          />

          {/* 🔹 PASSWORD ONLY FOR NON-EMAIL LOGIN */}
          {!isEmail && (
            <>
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </>
          )}

          {/* 🔹 HELPER TEXT FOR STAFF */}
          {isEmail && (
            <p className="login-hint">
              First-time staff login does not require a password.
            </p>
          )}

          <button type="submit" className="login-btn">
            Login
          </button>

          {error && <p className="login-error">{error}</p>}

          {!isEmail && (
            <p className="forgot-pass">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
          )}

          <p className="login-signup-text">
            Don’t have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* PREMIUM SECTION */}
      <div className="premium-middle-section">
        <div className="premium-bg"></div>

        <div className="premium-bubbles">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        <div className="premium-content scroll-animate">
          <h2 className="premium-title">Experience Premium Car Care</h2>
          <p className="premium-desc">
            Discover fast, secure and personalized services tailored for your car.
          </p>

          <button className="premium-btn shimmer">
            Explore Services
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;