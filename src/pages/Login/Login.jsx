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
    const result = await login({
      email: form.email,
      password: form.password,
    });

    // FIRST-TIME STAFF (set password)
    if (result?.requiresPasswordSetup) {
      navigate("/staff/set-password", {
        state: {
          token: result.token,
          email: form.email,
        },
      });
      return;
    }

    const role = result.role;

    // Staff KYC
    if (result.canUploadKYC && result.verificationStatus !== "approved") {
      navigate("/staff/upload-kyc");
      return;
    }

    // Receptionist
    if (role === "receptionist") {
      navigate("/reception/dashboard");
      return;
    }

    // Staff (detailer / cleaner)
    if (role === "detailer" || role === "cleaner") {
      navigate(`/staff/profile/${role}`);
      return;
    }

    // Normal user
    navigate("/profile");

  } catch (err) {
    setError(err.message || "Login failed");
  }
}



  return (
    <>


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
