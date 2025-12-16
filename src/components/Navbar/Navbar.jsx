// src/components/Navbar/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav-container">
      {/* Logo */}
      <div className="nav-logo">
        <Link to="/">CarWash</Link>
      </div>

      {/* Hamburger for Mobile */}
      <div
        className={`nav-hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/booking">Book Now</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      {/* Auth Buttons */}
      <div className="nav-auth">
        <Link to="/login" className="nav-btn login">Login</Link>
        <Link to="/signup" className="nav-btn signup">Signup</Link>
      </div>
    </nav>
  );
}

export default Navbar;
