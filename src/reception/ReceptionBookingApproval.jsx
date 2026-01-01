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

  const getValidAssignedId = (assignedId, activeList) => {
    return activeList.some((u) => u._id === assignedId)
      ? assignedId
      : "";
  };


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

      const allUsers = uRes.data || [];

      setBookings(bRes.data || []);
      setUsers(allUsers);

      // ✅ ONLY ACTIVE STAFF
      setDetailers(
        allUsers.filter(
          (u) => u.role === "detailer" && u.isActive === true
        )
      );

      setCleaners(
        allUsers.filter(
          (u) => u.role === "cleaner" && u.isActive === true
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  const getUserName = (id, booking) => {
    if (!id) return booking.customerName || "Guest";
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
      const res = await axiosClient.patch(
        `/bookings/${bookingId}/assign-detailer/${detailerId}`
      );

      const updatedBooking = res.data.booking;

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? updatedBooking : b))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to assign detailer");
    }
  }

  // ================= ASSIGN CLEANER =================
  async function assignCleaner(bookingId, cleanerId) {
    if (!cleanerId) return;

    try {
      const res = await axiosClient.patch(
        `/bookings/${bookingId}/assign-cleaner/${cleanerId}`
      );

      const updatedBooking = res.data.booking;

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? updatedBooking : b))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to assign cleaner");
    }
  }

  // ✅ LOADER
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
                <td>{getUserName(b.userId, b)}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.time}</td>
                <td>
                  {b.vehicleModel} ({b.vehicleNumber})
                </td>

                {/* STATUS */}
                <td className={`status ${b.bookingStatus}`}>
                  {b.bookingStatus === "confirmed"
                    ? "Confirmed"
                    : b.bookingStatus}
                </td>

                {/* APPROVAL */}
                <td>
                  {b.bookingStatus === "pending" ? (
                    <select
                      className="action-dropdown"
                      onChange={(e) => {
                        if (e.target.value === "approve")
                          approveBooking(b._id);
                        if (e.target.value === "reject")
                          rejectBooking(b._id);
                        e.target.value = "";
                      }}
                    >
                      <option value="">Choose</option>
                      <option value="approve">Approve</option>
                      <option value="reject">Reject</option>
                    </select>
                  ) : (
                    "Confirmed"
                  )}
                </td>

                {/* ASSIGNMENT */}
                <td className="assign-cell">
                  <select
                    value={getValidAssignedId(b.assignedDetailer, detailers)}
                    disabled={b.bookingStatus !== "confirmed"}

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
                    value={getValidAssignedId(b.assignedCleaner, cleaners)}
                    disabled={b.bookingStatus !== "confirmed"}

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
