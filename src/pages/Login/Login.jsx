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

      // FIRST-TIME STAFF
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

      // ================= STAFF FLOW =================
      if (role === "detailer" || role === "cleaner" || role === "receptionist") {
        const profile = await axiosClient.get(
          `/users/${localStorage.getItem("user_id")}`
        );

        const user = profile.data;

        if (!user.documentUrls || user.documentUrls.length === 0) {
          navigate("/staff/upload-kyc");
          return;
        }

        // 📄 DOCUMENTS UPLOADED BUT PENDING
        if (!user.documentUrls || user.documentUrls.length === 0) {
          navigate("/staff/upload-kyc");
          return;
        }

        // ⏳ DOCUMENTS SUBMITTED → PENDING
        if (user.verificationStatus === "pending") {
          navigate("/staff/kyc-pending");
          return;
        }

        // ❌ REJECTED → RE-UPLOAD
        if (user.verificationStatus === "rejected") {
          navigate("/staff/upload-kyc");
          return;
        }

        // ✅ APPROVED → ALLOW ACCESS
        if (user.verificationStatus === "approved") {
          if (role === "receptionist") {
            navigate("/reception/dashboard");
          } else {
            navigate(`/staff/profile/${role}`);
          }
          return;
        }
      }

      // ================= NORMAL USER FLOW =================
      navigate("/profile");

    } catch (err) {
      setError(err.message || "Login failed");
    }
  }



  return (
    <>


      {/* LOGIN FORM */}
      <div className="login-container">
        <h1>LOGIN</h1>

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
