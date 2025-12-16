import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import "./ReceptionBookingApproval.css";
import Loader from "../components/Loader/Loader";

function ReceptionBookingApproval() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [detailers, setDetailers] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [bRes, uRes] = await Promise.all([
        axiosClient.get("/bookings"),
        axiosClient.get("/users"),
      ]);

      setBookings(bRes.data || []);
      setUsers(uRes.data || []);

      setDetailers(uRes.data.filter((u) => u.role === "detailer"));
      setCleaners(uRes.data.filter((u) => u.role === "cleaner"));
    } catch (err) {
      console.error(err);
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  const getUserName = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? user.name : "Unknown";
  };

  // ================= APPROVE =================
  async function approveBooking(id) {
    try {
      await axiosClient.patch(`/bookings/${id}/approve`);
      loadData();
      alert("Booking approved!");
    } catch (err) {
      console.error(err);
      alert("Failed to approve booking");
    }
  }

  // ================= REJECT =================
  async function rejectBooking(id) {
    try {
      await axiosClient.patch(`/bookings/cancel/${id}`);
      loadData();
      alert("Booking rejected!");
    } catch (err) {
      console.error(err);
      alert("Failed to reject booking");
    }
  }

  // ================= ASSIGN DETAILER =================
  async function assignDetailer(bookingId, detailerId) {
    if (!detailerId) return;
    try {
      await axiosClient.patch(
        `/bookings/${bookingId}/assign-detailer/${detailerId}`
      );
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to assign detailer");
    }
  }

  // ================= ASSIGN CLEANER =================
  async function assignCleaner(bookingId, cleanerId) {
    if (!cleanerId) return;
    try {
      await axiosClient.patch(
        `/bookings/${bookingId}/assign-cleaner/${cleanerId}`
      );
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to assign cleaner");
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="reception-dashboard">
      <h1>Booking Approval & Assignment</h1>

      {bookings.length === 0 ? (
        <p className="no-requests">No booking requests.</p>
      ) : (
        <table className="reception-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Time</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Approval</th>
              <th>Assign Staff</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{getUserName(b.userId)}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.time}</td>
                <td>
                  {b.vehicleModel} ({b.vehicleNumber})
                </td>

                <td className={`status ${b.status}`}>{b.status}</td>

                {/* APPROVAL */}
                <td>
                  {b.status === "pending" || b.status === "unconfirmed" ? (
                    <select
                      className="action-dropdown"
                      onChange={(e) => {
                        if (e.target.value === "approve") approveBooking(b._id);
                        if (e.target.value === "reject") rejectBooking(b._id);
                        e.target.value = "";
                      }}
                    >
                      <option value="">Choose</option>
                      <option value="approve">Approve</option>
                      <option value="reject">Reject</option>
                    </select>
                  ) : (
                    "Approved"
                  )}
                </td>

                {/* ASSIGNMENT */}
                <td>
                  <select
                    disabled={b.status !== "approved"}
                    onChange={(e) => assignDetailer(b._id, e.target.value)}
                  >
                    <option value="">Assign Detailer</option>
                    {detailers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <select
                    disabled={b.status !== "approved"}
                    onChange={(e) => assignCleaner(b._id, e.target.value)}
                  >
                    <option value="">Assign Cleaner</option>
                    {cleaners.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReceptionBookingApproval;
