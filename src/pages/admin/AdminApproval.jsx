import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./AdminApproval.css";
import Loader from "../../components/Loader/Loader"

function AdminApproval() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
  try {
    setLoading(true);

    const [bRes, uRes] = await Promise.all([
      axiosClient.get("/bookings"),
      axiosClient.get("/users"),
    ]);

    const pending = bRes.data.filter(
      (b) => b.status === "pending" || b.status === "unconfirmed"
    );

    setBookings(pending);
    setUsers(uRes.data || []);
  } catch (err) {
    console.error(err);
    alert("Error loading bookings");
  } finally {
    setLoading(false);
  }
}
const getUserName = (id) => {
  const user = users.find((u) => u._id === id);
  return user ? user.name : "Unknown";
};

  // APPROVE BOOKING
  async function approveBooking(id) {
    try {
      await axiosClient.patch(`/bookings/${id}/approve`);
      loadBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to approve booking");
    }
  }

  // REJECT BOOKING
  async function rejectBooking(id) {
    try {
      await axiosClient.patch(`/bookings/cancel/${id}`);
      loadBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to reject booking");
    }
  }
  if (loading) return <Loader />;


  return (
    <div className="approval-page">
      <h1>Booking Approval Requests</h1>

      {bookings.length === 0 ? (
        <p className="noreq">No approval requests.</p>
      ) : (
        <table className="approval-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Time</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{getUserName(b.userId)}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>
                  {b.vehicleModel} ({b.vehicleNumber})
                </td>

                <td className="pending-status">Pending</td>

                <td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminApproval;
