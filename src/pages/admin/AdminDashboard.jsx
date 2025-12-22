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

      const res = await axios.get(
        "http://localhost:8000/api/admin/dashboard/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
  }

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="admin-topbar">
        <h2>Admin Dashboard</h2>

        <div className="admin-search">
          <input type="text" placeholder="Search" />
        </div>
      </div>

      {/* TODAY DATA */}
      <h3 className="section-title">Today’s Data</h3>
      <div className="card-grid">
        <StatCard title="Today's Booking" value={stats.todayBookings} bg="purple" />
        <StatCard title="Today's Completed Booking" value={stats.completedBookings} bg="green" />
        <StatCard title="Today's Pending Booking" value={stats.pendingBookings} bg="orange" />
      </div>

      {/* TOTAL DATA */}
      <h3 className="section-title">Total Data</h3>
      <div className="card-grid">
        <StatCard title="Total Revenue" value={`₹ ${stats.totalRevenue}`} bg="mint" />
        <StatCard title="Completed Booking" value={stats.completedBookings} bg="green" />
        <StatCard title="Pending Booking" value={stats.pendingBookings} bg="orange" />
        <StatCard title="Total Booking" value={stats.totalBookings} bg="purple" />
        <StatCard title="Total Customers" value={stats.totalCustomers} bg="blue" />
      </div>

    </div>
  );
}

function StatCard({ title, value, bg }) {
  return (
    <div className={`stat-card ${bg}`}>
      <p className="stat-title">{title}</p>
      <h2 className="stat-value">{value}</h2>
    </div>
  );
}

export default AdminDashboard;