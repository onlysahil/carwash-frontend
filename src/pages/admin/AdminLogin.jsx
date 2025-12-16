import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; 

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");     
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://dentiled-halley-asyndetically.ngrok-free.dev/auth/admin-login",
        {
          email,
          password,
        }
      );

  
      if (res.data.token) {
        localStorage.setItem("access_token", res.data.token);
      }

      localStorage.setItem("is_admin", "true");

      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-box" onSubmit={handleLogin}>
        <h2 className="admin-login-title">Admin Login</h2>

        {error && <p className="admin-error">{error}</p>}

        <input
          type="email"
          className="admin-input"
          placeholder="Enter Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="admin-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="admin-login-btn">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import "./AdminLogin.css";

// function AdminLogin() {
//   const { adminLogin } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const admin = await adminLogin({ email, password });

//       if (admin.role === "admin") {
//         navigate("/admin/dashboard", { replace: true });
//       } else {
//         setError("Not an admin account");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Admin login failed");
//     }
//   };

//   return (
//     <div className="admin-login-page">
//       <form className="admin-login-box" onSubmit={handleLogin}>
//         <h2>Admin Login</h2>

//         {error && <p className="admin-error">{error}</p>}

//         <input
//           type="email"
//           placeholder="Admin Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default AdminLogin;