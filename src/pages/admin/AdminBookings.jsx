import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./AdminBookings.css";
import Loader from "../../components/Loader/Loader";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [bRes, uRes, pRes, aRes] = await Promise.all([
        axiosClient.get("/bookings"),
        axiosClient.get("/users"),
        axiosClient.get("/packages"),
        axiosClient.get("/addons"),
      ]);

      setBookings(Array.isArray(bRes.data) ? bRes.data : []);
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);
      setPackages(Array.isArray(pRes.data) ? pRes.data : []);
      setAddons(Array.isArray(aRes.data) ? aRes.data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch bookings");
    } finally {
      setLoading(false);
    }
  }

  /* =============================
     HELPERS
  ============================== */

  const getUserName = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? user.name : "Unknown";
  };

  const getPackageTitle = (id) => {
    const pkg = packages.find((p) => p._id === id);
    return pkg ? pkg.title : "Unknown Package";
  };

  const getAddonTitles = (ids = []) => {
    if (!Array.isArray(ids)) return [];
    return ids.map((id) => {
      const addon = addons.find((a) => a._id === id);
      return addon ? addon.title : "Unknown Add-on";
    });
  };

  /* =============================
     STATUS ACTIONS
  ============================== */

  async function markCompleted(id) {
    try {
      await axiosClient.put(`/bookings/${id}`, {
        bookingStatus: "completed",
      });
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to mark as completed");
    }
  }

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
            <th>Package & Add-ons</th>
            <th>Date</th>
            <th>Time</th>
            <th>Vehicle</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No bookings found
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.customerName || getUserName(b.userId)}</td>

                <td>
                  <strong>{getPackageTitle(b.packageId)}</strong>

                  {Array.isArray(b.addOnIds) && b.addOnIds.length > 0 && (
                    <ul className="addon-list">
                      {getAddonTitles(b.addOnIds).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </td>

                <td>{b.date}</td>
                <td>{b.time}</td>

                <td>
                  {b.vehicleModel} ({b.vehicleNumber})
                </td>

                <td>₹{b.totalAmount}</td>

                <td className={`status ${b.bookingStatus?.toLowerCase()}`}>
                  {b.bookingStatus}
                </td>

                {/* ACTIONS (optional) */}
                {/* 
                <td>
                  {b.bookingStatus !== "completed" &&
                    b.bookingStatus !== "cancelled" && (
                      <button
                        className="admin-btn"
                        onClick={() => markCompleted(b._id)}
                      >
                        Mark Completed
                      </button>
                    )}
                </td>
                */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookings;
