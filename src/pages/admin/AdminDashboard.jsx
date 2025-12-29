import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
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
    const [bookingRes, usersRes, paymentsRes] = await Promise.all([
      axiosClient.get("/bookings"),
      axiosClient.get("/users"),
      axiosClient.get("/payments"),
    ]);

    const bookings =
      bookingRes.data.data || bookingRes.data.bookings || [];

    const users =
      usersRes.data.data || usersRes.data.users || [];

    const payments =
      paymentsRes.data.data || paymentsRes.data.payments || [];

    const today = new Date().toISOString().split("T")[0];

    const totalBookings = bookings.length;

    const completedBookings = bookings.filter(
      (b) => b.status === "completed"
    ).length;

    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;

    const todayBookings = bookings.filter(
      (b) =>
        (b.createdAt || b.date)?.startsWith(today)
    ).length;

    const todayCompletedBookings = bookings.filter(
      (b) =>
        b.status === "completed" &&
        (b.createdAt || b.date)?.startsWith(today)
    ).length;

    const todayPendingBookings = bookings.filter(
      (b) =>
        b.status === "pending" &&
        (b.createdAt || b.date)?.startsWith(today)
    ).length;

    const totalCustomers = users.filter(
      (u) => u.role === "customer"
    ).length;

    const totalRevenue = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    setStats({
      totalBookings,
      todayBookings,
      pendingBookings: todayPendingBookings,
      completedBookings: todayCompletedBookings,
      totalRevenue,
      totalCustomers,
    });
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