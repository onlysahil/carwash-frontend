// src/layouts/AdminLayout.jsx
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";


function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // const [openBookings, setOpenBookings] = useState(
  //   location.pathname.includes("/admin/bookings")
  // );

  function logoutAdmin() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_admin");

    navigate("/admin-login", { replace: true });
  }

  return (
    <div className="admin-layout">

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>

        <ul className="admin-menu">

          <li className={location.pathname.includes("/admin/dashboard") ? "active" : ""}>
            <NavLink to="/admin/dashboard">📊 Dashboard</NavLink>
          </li>

          <li className={location.pathname === "/admin/bookings" ? "active" : ""}>
            <NavLink to="/admin/bookings">📌 All Bookings</NavLink>
          </li>

          <li className={location.pathname.includes("/admin/services") ? "active" : ""}>
            <NavLink to="/admin/services">🛠️ Services</NavLink>
          </li>

          <li className={location.pathname.includes("/admin/staff") ? "active" : ""}>
            <NavLink to="/admin/staff">👤 Staff List</NavLink>
          </li>

          <li className={location.pathname.includes("/admin/users") ? "active" : ""}>
            <NavLink to="/admin/users">👤 Users List</NavLink>
          </li>

          <li className={location.pathname.includes("/admin/add-staff") ? "active" : ""}>
            <NavLink to="/admin/add-staff">👤 Add Staff</NavLink>
          </li>

          <li className={location.pathname.includes("/admin/staff-approvals") ? "active" : ""}>
            <NavLink to="/admin/staff-approvals">👤 Approve Staff</NavLink>
          </li>

          <li className={location.pathname.includes("/admin/add-package") ? "active" : ""}>
            <NavLink to="/admin/add-package">🛠️ Packages</NavLink>
          </li>

          <li className={location.pathname.includes("/admin/settings") ? "active" : ""}>
            <NavLink to="/admin/settings">⚙️ Settings</NavLink>
          </li>

        </ul>

        <button className="admin-logout-btn" onClick={logoutAdmin}>
          Logout
        </button>
      </aside>

      {/* ---------------- MAIN PANEL ---------------- */}
      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;
