import { useEffect, useState } from "react";
import bookingsApi from "../../api/bookings";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  // Load bookings on page load
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingsApi.getBookings();
      console.log("Fetched bookings:", res.data);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setMessage("❌ Failed to load bookings.");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await bookingsApi.cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
      setMessage("✅ Booking cancelled successfully!");
    } catch (err) {
      console.error("Cancel error:", err);
      setMessage("❌ Failed to cancel booking.");
    }
  };

  return (
    <div className="mybookings-container">
      <h1>My Bookings</h1>

      {message && <p className="msg">{message}</p>}

      <table className="mybookings-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Service</th>
            <th>Car Type</th>
            <th>Location</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b.token}>
                <td>{b.token}</td>

                <td>{b.service?.name || b.service_name || "N/A"}</td>
                <td>{b.car_type?.name || b.car_type_name || "N/A"}</td>
                <td>{b.location?.name || b.location_name || "N/A"}</td>

                {/* PHONE NUMBER */}
                <td>{b.user?.phone || b.phone || b.user_phone || "N/A"}</td>

                {/* DATE */}
                <td>
                  {new Date(b.start_datetime).toLocaleDateString("en-IN")}
                </td>

                {/* TIME */}
                <td>
                  {new Date(b.start_datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(b.end_datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td>₹{b.price}</td>

                <td className={`status ${b.status?.toLowerCase()}`}>
                  {b.status}
                </td>

                <td>
                  {b.status === "cancelled" ? (
                    <span className="cancelled">Cancelled</span>
                  ) : (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyBookings;
