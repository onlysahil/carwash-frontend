import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,

    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,

    cleaner: 0,
    detailer: 0,
    customer: 0,
    receptionist: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      const [
        revenueRes,
        statusRes,
        roleRes
      ] = await Promise.all([
        axiosClient.get("/bookings/Booking/Revenue/dashboard-stats"),
        axiosClient.get("/bookings/stats/status-count"),
        axiosClient.get("/users/stats/role-counts"),
      ]);

      setStats({
        totalBookings: revenueRes.data.totalBookings || 0,
        totalRevenue: revenueRes.data.totalRevenue || 0,

        pending: statusRes.data.pending || 0,
        confirmed: statusRes.data.confirmed || 0,
        completed: statusRes.data.completed || 0,
        cancelled: statusRes.data.cancelled || 0,

        cleaner: roleRes.data.cleaner || 0,
        detailer: roleRes.data.detailer || 0,
        customer: roleRes.data.customer || 0,
        receptionist: roleRes.data.receptionist || 0,
      });
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading dashboard...</p>;
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

      {/* BOOKINGS OVERVIEW */}
      <h3 className="section-title">Bookings Overview</h3>
      <div className="card-grid">
        <StatCard title="Total Bookings" value={stats.totalBookings} bg="purple" />
        <StatCard title="Pending Bookings" value={stats.pending} bg="orange" />
        <StatCard title="Confirmed Bookings" value={stats.confirmed} bg="blue" />
        <StatCard title="Completed Bookings" value={stats.completed} bg="green" />
        <StatCard title="Cancelled Bookings" value={stats.cancelled} bg="red" />
      </div>

      {/* REVENUE */}
      <h3 className="section-title">Revenue</h3>
      <div className="card-grid">
        <StatCard title="Total Revenue" value={`₹ ${stats.totalRevenue}`} bg="mint" />
      </div>

      {/* USERS */}
      <h3 className="section-title">Users</h3>
      <div className="card-grid">
        <StatCard title="Customers" value={stats.customer} bg="blue" />
        <StatCard title="Receptionists" value={stats.receptionist} bg="purple" />
        <StatCard title="Cleaners" value={stats.cleaner} bg="orange" />
        <StatCard title="Detailers" value={stats.detailer} bg="green" />
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
