import { Outlet, NavLink, useNavigate, Navigate } from "react-router-dom";
import "../layouts/AdminLayout.css"; 
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ReceptionLayout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  

  function logoutReception() {
    logout();                 // 🔥 clears EVERYTHING
    navigate("/", { replace: true });
  }

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div
          className="admin-logo"
          onClick={() => navigate("/reception/dashboard")}
        >
          <img src="/images/logo.png" alt="Reception Logo" />
        </div>

        <ul className="admin-menu">
          <li><NavLink to="/reception/dashboard" end>Dashboard</NavLink></li>
          <li><NavLink to="/reception/approvals">Appointments</NavLink></li>
          <li><NavLink to="/reception/staff">Staff</NavLink></li>
          <li><NavLink to="/reception/users">Users</NavLink></li>
          <li><NavLink to="/reception/packages">Packages</NavLink></li>
          <li><NavLink to="/reception/services">Services</NavLink></li>
          <li><NavLink to="/reception/bookings">Create Booking</NavLink></li>
        </ul>

        <button className="admin-logout-btn" onClick={logoutReception}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
}