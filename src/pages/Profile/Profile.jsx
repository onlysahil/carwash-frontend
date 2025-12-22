import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./Profile.css";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
  const role = localStorage.getItem("role");

  // 🚫 Staff must NOT open user profile
  if (role === "detailer" || role === "cleaner" || role === "receptionist") {
    navigate(`/staff/profile/${role}`, { replace: true });
  }
}, [navigate]);

  // -------------------- LOAD PROFILE & BOOKINGS --------------------
  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    const token = localStorage.getItem("token");

if (!token) {
  setIsLoggedIn(false);
  return;
}

    loadUserProfile(userId);
    loadUserBookings(userId);
  }, []);

  // Load user data
  const loadUserProfile = async (userId) => {
    try {
      const res = await axiosClient.get(`/users/${userId}`);

      setUser(res.data);

      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || ""
      });
    } catch (err) {
      console.log(err);
      setIsLoggedIn(false);
    }
  };

  // Load bookings
  const loadUserBookings = async (userId) => {
    try {
      const res = await axiosClient.get(`/bookings/user/${userId}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  // -------------------- VALIDATION --------------------
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- SAVE PROFILE --------------------
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const userId = localStorage.getItem("user_id");
      const res = await axiosClient.patch(`/users/${userId}`, formData);

      setUser(res.data);
      setEditing(false);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile.");
    }
  };

  // -------------------- CANCEL BOOKING --------------------
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await axiosClient.patch(`/bookings/cancel/${bookingId}`);

      alert("Booking cancelled!");

      // Reload updated bookings
      loadUserBookings(localStorage.getItem("user_id"));
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking");
    }
  };
  // -------------------- LOGOUT --------------------
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // -------------------- LOGIN BLOCKED --------------------
  if (!isLoggedIn) {
    return (
      <div className="profile-locked">
        <h2>Your Profile is Locked</h2>
        <button onClick={() => navigate("/login")} className="profile-login-btn">
          Login to Continue
        </button>
      </div>
    );
  }

  // -------------------- MAIN PAGE --------------------
  return (
    <div className="profile-container">
      <h1>My Profile</h1>

     

      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className="profile-info">
           <div className="profile-buttons">
                <button onClick={() => setEditing(true)} className="profile-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8" /></svg>
                </button>
                </div>
          {editing ? (
            <form className="edit-form" onSubmit={handleSave}>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="error-msg">{errors.name}</p>}

              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="error-msg">{errors.email}</p>}

              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <p className="error-msg">{errors.phone}</p>}

              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              {errors.address && <p className="error-msg">{errors.address}</p>}

              <div className="form-actions">
                <button type="submit" className="save-btn">Save</button>
                <button className="cancel-edit-btn" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Number:</strong> {user.phone}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p>
                <strong>Joined On:</strong>{" "}
                {new Date(user.createdAt).toDateString()}
              </p>

              <div className="profile-buttons">
                
                <button onClick={handleLogout} className="profile-btn logout-btn">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {message && <p className="profile-msg">{message}</p>}

      {/* -------------------- BOOKINGS TABLE -------------------- */}
      <div className="profile-bookings">
        <h2>My Bookings</h2>

        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Booking No.</th>
                <th>Service</th>
                <th>Vehicle Model</th>
                <th>Vehicle Number</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>

                  {/* Booking Number */}
                  <td>{b.bookingNumber || "N/A"}</td>

                  {/* Services */}
                  <td>{b.serviceIds?.map((s) => s.title).join(", ")}</td>

                  {/* Vehicle Info */}
                  <td>{b.vehicleModel || "N/A"}</td>
                  <td>{b.vehicleNumber || "N/A"}</td>

                  {/* Location */}
                  <td>{b.location || "N/A"}</td>

                  {/* Date & Time */}
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.time}</td>

                  {/* Status */}
                  <td className={`status ${b.status}`}>{b.status}</td>

                  {/* Total Amount */}
                  <td>
                    ₹{b.serviceIds?.reduce((sum, s) => sum + (s.finalPrice || 0), 0)}
                  </td>

                  {/* Cancel BTN */}
                  <td>
                    <button
                      className="cancel-btn"
                      disabled={b.status === "cancelled"}
                      onClick={() => handleCancel(b._id)}
                    >
                      Cancel
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}

export default Profile;
