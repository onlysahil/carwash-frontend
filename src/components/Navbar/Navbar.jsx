import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";



export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

 const handleProfileClick = () => {
  if (!user || !user.role) {
    navigate("/login");
    return;
  }

  if (user.role === "admin") {
    navigate("/admin/dashboard");
  } else if (user.role === "receptionist") {
    navigate("/reception/dashboard");
  } else if (user.role === "detailer") {
    navigate("/staff/profile/detailer");
  } else if (user.role === "cleaner") {
    navigate("/staff/profile/cleaner");
  } else {
    navigate("/profile");
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

        {/* 👤 USER ICON */}
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
