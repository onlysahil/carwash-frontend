import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = async () => {
    const userId = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");

    // 🔐 Not logged in
    if (!userId || !role) {
      navigate("/login");
      return;
    }

    try {
      const res = await axiosClient.get(`/users/${userId}`);
      const user = res.data;

      // ================= STAFF FLOW =================
      if (["cleaner", "detailer", "receptionist"].includes(role)) {

        // ❌ No KYC submitted
        if (!user.documentUrls || user.documentUrls.length === 0) {
          navigate("/staff/upload-kyc");
          return;
        }

        // ⏳ Pending approval
        if (user.verificationStatus === "pending") {
          navigate("/staff/kyc-pending");
          return;
        }

        // ❌ Rejected
        if (user.verificationStatus === "rejected") {
          navigate("/staff/upload-kyc");
          return;
        }

        // ✅ Approved
        if (user.verificationStatus === "approved") {
          if (role === "receptionist") {
            navigate("/reception/dashboard");
          } else {
            navigate(`/staff/profile/${role}`);
          }
          return;
        }
      }

      // ================= NORMAL USER =================
      navigate("/profile");

    } catch (err) {
      console.error("Profile redirect failed", err);
      navigate("/login");
    }
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">

        {/* Logo */}
        <div className="logo">
          <img src="/images/logo.png" alt="RSW Logo" />
        </div>

        {/* Desktop Links */}
        <ul className={`nav-links ${open ? "open" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/booking">Book Now</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </ul>

        {/* ✅ SAFE USER ICON */}
        <button
          type="button"
          className="user-icon"
          onClick={handleProfileClick}
          aria-label="Profile"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </button>

        {/* Mobile Menu Icon */}
        <div className="nav-icon" onClick={() => setOpen(!open)}>
          <span>☰</span>
        </div>

      </nav>
    </div>
  );
}
