import { Link } from "react-router-dom";

export default function ReceptionSidebar() {
  return (
    <div className="reception-sidebar">
      <h3 className="reception-logo">Reception</h3>

      <ul className="reception-menu">
        <li><Link to="/reception">Dashboard</Link></li>
        <li><Link to="/reception/appointments">Appointments</Link></li>
        <li><Link to="/reception/staff">Staff</Link></li>
        <li><Link to="/reception/users">Users</Link></li>
        <li><Link to="/reception/packages">Packages</Link></li>
        <li><Link to="/reception/services">Services</Link></li>
        <li><Link to="/reception/bookings">Create Booking</Link></li>
      </ul>

      <button className="reception-sidebar-logout">Logout</button>
    </div>
  );
}
