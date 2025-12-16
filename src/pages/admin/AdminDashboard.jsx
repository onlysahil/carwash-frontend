import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.get("http://localhost:8000/api/admin/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);

    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
  }

  return (
    <div className="admin-dashboard">

      <h2 className="dash-title">📊 Admin Dashboard</h2>

      <div className="dashboard-grid">

        <div className="dash-card">
          <h3>Total Revenue</h3>
          <p className="dash-value">₹ {stats.totalRevenue}</p>
        </div>

        <div className="dash-card">
          <h3>Total Bookings</h3>
          <p className="dash-value">{stats.totalBookings}</p>
        </div>

        <div className="dash-card">
          <h3>Today's Bookings</h3>
          <p className="dash-value">{stats.todayBookings}</p>
        </div>

        <div className="dash-card">
          <h3>Pending Bookings</h3>
          <p className="dash-value pending">{stats.pendingBookings}</p>
        </div>

        <div className="dash-card">
          <h3>Completed Bookings</h3>
          <p className="dash-value completed">{stats.completedBookings}</p>
        </div>

        <div className="dash-card">
          <h3>Total Customers</h3>
          <p className="dash-value">{stats.totalCustomers}</p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
