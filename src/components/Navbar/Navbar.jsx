





import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
 
export default function Navbar() {
  const [open, setOpen] = useState(false);
 
  return (
   <div className="navbar-container">
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src="./images/logo.png" alt="RSW Logo" />
      </div>
 
      {/* Desktop Links */}
      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/booking">Book Now</Link></li>
        {/* <li><Link to="/profile">Profile</Link></li> */}
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li> <Link to="/signup" >Signup</Link></li>
      </ul>
 
      {/* User Icon */}
    <Link to="/profile" className="user-icon">
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
</Link>
 
      {/* Mobile Menu Icon */}
      <div className="nav-icon" onClick={() => setOpen(!open)}>
        <span>☰</span>
      </div>
    </nav></div>
  );
}