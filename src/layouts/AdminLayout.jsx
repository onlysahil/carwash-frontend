// src/layouts/AdminLayout.jsx
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import AdminTopbar from "../pages/admin/AdminTopbar";

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
      <div className="admin-logo" onClick={() => navigate("/admin/dashboard")}>
  <img src="/images/logo.png" alt="Admin Logo" />
</div>

        <ul className="admin-menu">

          <li>
            <NavLink to="/admin/dashboard" end>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentcolor" d="M13 8V4q0-.425.288-.712T14 3h6q.425 0 .713.288T21 4v4q0 .425-.288.713T20 9h-6q-.425 0-.712-.288T13 8M3 12V4q0-.425.288-.712T4 3h6q.425 0 .713.288T11 4v8q0 .425-.288.713T10 13H4q-.425 0-.712-.288T3 12m10 8v-8q0-.425.288-.712T14 11h6q.425 0 .713.288T21 12v8q0 .425-.288.713T20 21h-6q-.425 0-.712-.288T13 20M3 20v-4q0-.425.288-.712T4 15h6q.425 0 .713.288T11 16v4q0 .425-.288.713T10 21H4q-.425 0-.712-.288T3 20m2-9h4V5H5zm10 8h4v-6h-4zm0-12h4V5h-4zM5 19h4v-2H5zm4-2" /></svg> Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/bookings">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentcolor" d="M14.102 2.664c.628-.416 1.692-.713 2.495.09l4.647 4.648c.806.804.508 1.868.091 2.495a2.95 2.95 0 0 1-.863.85c-.334.213-.756.374-1.211.35a9 9 0 0 1-.658-.071l-.068-.01a9 9 0 0 0-.707-.073c-.504-.025-.698.06-.76.12l-2.49 2.491c-.08.08-.18.258-.256.6c-.073.33-.105.736-.113 1.186c-.007.432.008.874.024 1.3l.001.047c.015.423.03.855.009 1.194c-.065 1.031-.868 1.79-1.658 2.141c-.79.35-1.917.437-2.7-.347l-2.25-2.25L3.53 21.53a.75.75 0 1 1-1.06-1.06l4.104-4.105l-2.25-2.25c-.783-.784-.697-1.91-.346-2.7c.35-.79 1.11-1.593 2.14-1.658c.34-.021.772-.006 1.195.009l.047.001c.426.015.868.031 1.3.024c.45-.008.856-.04 1.186-.113c.342-.076.52-.177.6-.257l2.49-2.49c.061-.061.146-.256.12-.76a9 9 0 0 0-.073-.707l-.009-.068a9 9 0 0 1-.071-.658c-.025-.455.136-.877.348-1.211c.216-.34.515-.64.851-.863" /></svg> All Bookings
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/services">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentcolor" d="m29.338 19.934l-7.732-2.779l-3.232-4.058A2.99 2.99 0 0 0 16.054 12H8.058a3 3 0 0 0-2.48 1.312l-2.712 3.983A5 5 0 0 0 2 20.107V26a1 1 0 0 0 1 1h2.142a3.98 3.98 0 0 0 7.716 0h6.284a3.98 3.98 0 0 0 7.716 0H29a1 1 0 0 0 1-1v-5.125a1 1 0 0 0-.662-.941M9 28a2 2 0 1 1 2-2a2.003 2.003 0 0 1-2 2m14 0a2 2 0 1 1 2-2a2.003 2.003 0 0 1-2 2m5-3h-1.142a3.98 3.98 0 0 0-7.716 0h-6.284a3.98 3.98 0 0 0-7.716 0H4v-4.893a3 3 0 0 1 .52-1.688l2.711-3.981A1 1 0 0 1 8.058 14h7.996a1 1 0 0 1 .764.355l3.4 4.268a1 1 0 0 0 .444.318L28 21.578zm0-23h-4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2m0 2v2h-4V4zm-4 8V8h4v4z" /></svg> Services
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/staff">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentcolor" d="M152 80a8 8 0 0 1 8-8h88a8 8 0 0 1 0 16h-88a8 8 0 0 1-8-8m96 40h-88a8 8 0 0 0 0 16h88a8 8 0 0 0 0-16m0 48h-64a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16m-138.71-26a48 48 0 1 0-58.58 0c-20.62 8.73-36.87 26.3-42.46 48A8 8 0 0 0 16 200h128a8 8 0 0 0 7.75-10c-5.59-21.71-21.84-39.28-42.46-48" /></svg> Staff List
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/users">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentcolor"><path fill-rule="evenodd" d="M8 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8m0-2a2 2 0 1 0 0-4a2 2 0 0 0 0 4" clip-rule="evenodd" /><path d="M11 14a1 1 0 0 1 1 1v6h2v-6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v6h2v-6a1 1 0 0 1 1-1zm11-3h-6v2h6zm-6 4h6v2h-6zm6-8h-6v2h6z" /></g></svg> Users List
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/add-staff">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentcolor" d="M0 22.5h24M13.5 20v-6S11 12.5 7 12.5S.5 14 .5 14v6m17-18.5v3h-3v3h3v3h3v-3h3v-3h-3v-3zm-10.756 9S3.999 8.752 3.999 6.566c0-1.691 1.344-3.062 3.002-3.062s2.995 1.371 2.995 3.062C9.996 8.75 7.26 10.5 7.26 10.5z" stroke-width="1" /></svg> Add Staff
            </NavLink>
          </li>

          

          <li>
            <NavLink to="/admin/add-package">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentcolor" d="m3.005 7l8.445-5.63a1 1 0 0 1 1.11 0L21.005 7v14a1 1 0 0 1-1 1h-16a1 1 0 0 1-1-1zm9 4a2 2 0 1 0 0-4a2 2 0 0 0 0 4" /></svg> Packages
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentcolor" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5" /></svg> Settings
            </NavLink>
          </li>

        </ul>

        <button className="admin-logout-btn" onClick={logoutAdmin}>
          Logout
        </button>
      </aside>

      {/* ---------------- MAIN PANEL ---------------- */}
      <main className="admin-main">
         <AdminTopbar />
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;
