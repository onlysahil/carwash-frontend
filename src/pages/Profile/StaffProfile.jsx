import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./Profile.css";

function StaffProfile() {
  const navigate = useNavigate();
  const { role } = useParams(); // URL param: detailer / cleaner

  const [staff, setStaff] = useState(null);
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
    const storedRole = localStorage.getItem("role");

    // 🔒 Not logged in
    if (!storedRole) {
      navigate("/login");
      return;
    }

    // ❌ User trying to access staff page
    if (!["detailer", "cleaner", "receptionist"].includes(storedRole)) {
      navigate("/profile", { replace: true });
      return;
    }

    // ❌ URL role mismatch
    if (storedRole !== role) {
      navigate(`/staff/profile/${storedRole}`, { replace: true });
    }
  }, [navigate, role]);

  // -------------------- LOAD STAFF & BOOKINGS --------------------
  useEffect(() => {
    const staffId = localStorage.getItem("user_id");

    if (!staffId || staffId === "undefined") {
      setIsLoggedIn(false);
      return;
    }

    loadStaffProfile(staffId);
    loadStaffBookings(staffId);
  }, []);

  // Load staff data
  const loadStaffProfile = async (staffId) => {
    try {
      const res = await axiosClient.get(`/users/${staffId}`);

      // 🚫 BLOCK UNAPPROVED STAFF
      if (res.data.verificationStatus !== "approved") {
        navigate("/staff/kyc-pending", { replace: true });
        return;
      }

      setStaff(res.data);

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

  // Load bookings assigned to staff
  const loadStaffBookings = async (staffId) => {
    try {
      const endpoint =
        role === "cleaner"
          ? `/bookings/assigned/cleaner/${staffId}`
          : `/bookings/assigned/detailer/${staffId}`;

      const res = await axiosClient.get(endpoint);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  // -------------------- VALIDATION --------------------
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- SAVE PROFILE --------------------
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const staffId = localStorage.getItem("user_id");
      const res = await axiosClient.patch(`/users/${staffId}`, formData);

      

      setStaff(res.data);
      setEditing(false);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile.");
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
      <h1>{role?.charAt(0).toUpperCase() + role?.slice(1)} Profile</h1>

      {!staff ? (
        <p>Loading...</p>
      ) : (
        <div className="profile-info">
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
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              <p><strong> Full Name:</strong> {staff.name}</p>
              <p><strong>Email:</strong> {staff.email}</p>
              <p><strong>Role:</strong> {staff.role}</p>
              <p><strong>Number:</strong> {staff.phone}</p>
              <p><strong>Address:</strong> {staff.address}</p>
              <p><strong>Joined On:</strong> {new Date(staff.createdAt).toDateString()}</p>

              <div className="profile-buttons">
                <button onClick={() => setEditing(true)} className="profile-btn">Edit</button>
                <button onClick={handleLogout} className="profile-btn logout-btn">Logout</button>
              </div>
            </>
          )}
        </div>
      )}

      {message && <p className="profile-msg">{message}</p>}

      {/* -------------------- BOOKINGS TABLE -------------------- */}
      <div className="profile-bookings">
        <h2>Assigned Bookings</h2>

        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings assigned</p>
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
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.bookingNumber}</td>
                  <td>{b.serviceIds?.map((s) => s.title).join(", ")}</td>
                  <td>{b.vehicleModel}</td>
                  <td>{b.vehicleNumber}</td>
                  <td>{b.location}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.time}</td>
                  <td className="status">
                    {role === "cleaner" ? b.cleanerStatus : b.detailerStatus}
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

export default StaffProfile;