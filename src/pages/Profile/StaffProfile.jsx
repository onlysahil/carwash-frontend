import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./Profile.css";

function StaffProfile() {
  const navigate = useNavigate();
  const { role } = useParams();

  const [staff, setStaff] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ================= AUTH CHECK =================
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");

    if (!storedRole || !userId) {
      navigate("/login");
      return;
    }

    if (!["detailer", "cleaner", "receptionist"].includes(storedRole)) {
      navigate("/profile", { replace: true });
      return;
    }

    if (storedRole !== role) {
      navigate(`/staff/profile/${storedRole}`, { replace: true });
      return;
    }

    loadStaffProfile(userId);
    loadStaffBookings(userId);
  }, [navigate, role]);

  // ================= LOAD PROFILE =================
  const loadStaffProfile = async (staffId) => {
    try {
      const res = await axiosClient.get(`/users/${staffId}`);
      setStaff(res.data);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
      });
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  // ================= LOAD BOOKINGS =================
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

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (!formData.phone.trim()) newErrors.phone = "Phone required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SAVE PROFILE =================
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const staffId = localStorage.getItem("user_id");
      const res = await axiosClient.patch(`/users/${staffId}`, formData);

      setStaff(res.data);
      setEditing(false);
      setMessage("✅ Profile updated successfully");
    } catch (err) {
      console.error(err);
      setMessage("❌ Update failed");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!staff) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-container">
      <h1>{role.toUpperCase()} PROFILE</h1>

      <div className="profile-info">
        {editing ? (
          <form className="edit-form" onSubmit={handleSave}>
            <label>Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}

            <label>Email</label>
            <input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            <label>Phone</label>
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <p className="error-msg">{errors.phone}</p>}

            <label>Address</label>
            <input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <div className="form-actions">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-edit-btn" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <p><strong>Name:</strong> {staff.name}</p>
            <p><strong>Email:</strong> {staff.email}</p>
            <p><strong>Role:</strong> {staff.role}</p>
            <p><strong>Phone:</strong> {staff.phone}</p>
            <p><strong>Address:</strong> {staff.address}</p>

            <div className="profile-buttons">
              <button className="profile-btn" onClick={() => setEditing(true)}>Edit</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </>
        )}
      </div>

      {message && <p className="profile-msg">{message}</p>}

      {/* BOOKINGS */}
      <div className="profile-bookings">
        <h2>Assigned Bookings</h2>

        {bookings.length === 0 ? (
          <div className="no-bookings">No bookings assigned</div>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Service</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.bookingNumber}</td>
                  <td>{b.serviceIds?.map((s) => s.title).join(", ")}</td>
                  <td>{b.vehicleModel}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td className={`status ${role === "cleaner" ? b.cleanerStatus : b.detailerStatus}`}>
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
