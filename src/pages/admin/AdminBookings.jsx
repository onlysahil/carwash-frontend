import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./AdminBookings.css";
import Loader from "../../components/Loader/Loader"

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [bRes, uRes, sRes] = await Promise.all([
        axiosClient.get("/bookings"),
        axiosClient.get("/users"),
        axiosClient.get("/services"),
      ]);

      setBookings(bRes.data || []);
      setUsers(uRes.data || []);
      setServices(sRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch bookings");
    } finally {
      setLoading(false);
    }
  }

  // Get User Name
  const getUserName = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? user.name : "Unknown";
  };

  // Get Service List
  const getServices = (idList) => {
    return idList.map((id) => {
      const srv = services.find((s) => s._id === id);
      return srv ? `${srv.title} — ₹${srv.price}` : "Unknown service";
    });
  };

  // ******* UPDATE STATUS (Completed Only) *******
  async function markCompleted(id) {
    try {
      await axiosClient.put(`/bookings/${id}`, { status: "completed" });
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to mark as completed");
    }
  }

  // ******* CANCEL BOOKING (Correct NGROK API) *******
  async function cancelBooking(id) {
    try {
      await axiosClient.patch(`/bookings/cancel/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  }

   if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-bookings-container">
      <h1>All Bookings</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Services</th>
            <th>Date</th>
            <th>Time</th>
            <th>Vehicle</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No bookings found</td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b._id}>
                <td>{getUserName(b.userId)}</td>

                <td>
                  {getServices(b.serviceIds).map((s, i) => (
                    <div key={i}>{s}</div>
                  ))}
                </td>

                <td>{b.date}</td>
                <td>{b.time}</td>

                <td>{b.vehicleModel} ({b.vehicleNumber})</td>

                <td>₹{b.totalAmount}</td>

                <td className={`status ${b.status.toLowerCase()}`}>{b.status}</td>

                <td>
                  {b.status !== "completed" && b.status !== "cancelled" && (
                    <button
                      className="admin-btn"
                      onClick={() => markCompleted(b._id)}
                    >
                      Mark Completed
                    </button>
                  )}

                  {b.status !== "cancelled" && (
                    <button
                      className="admin-btn danger"
                      onClick={() => cancelBooking(b._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookings;
