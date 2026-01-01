import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader/Loader";

import "./StaffProfile.css";

function StaffProfile() {
  const navigate = useNavigate();
  const { role } = useParams();

  const [loading, setLoading] = useState(true);


  const [staff, setStaff] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const loggedInRole = localStorage.getItem("role");
  const loggedInUserId = localStorage.getItem("user_id");

  const normalizedRole = role?.toLowerCase();
  const storedRole = loggedInRole?.toLowerCase();




  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!loggedInUserId || !loggedInRole) return;

    if (!["detailer", "cleaner"].includes(storedRole)) {
      navigate("/profile", { replace: true });
      return;
    }

    if (normalizedRole !== storedRole) {
      navigate(`/staff/profile/${storedRole}`, { replace: true });
      return;
    }

    loadInitialData(loggedInUserId);

    const interval = setInterval(() => {
      loadInitialData(loggedInUserId);
    }, 15000);

    return () => clearInterval(interval);
  }, [loggedInUserId, loggedInRole, normalizedRole, storedRole]);

  const loadInitialData = async (staffId) => {
    setLoading(true);

    try {
      const results = await Promise.allSettled([
        axiosClient.get(`/users/${staffId}`),

        axiosClient.get(
          storedRole === "cleaner"
            ? `/bookings/assigned/cleaner/${staffId}`
            : `/bookings/assigned/detailer/${staffId}`
        ),

        axiosClient.get("/packages"),
        axiosClient.get("/addons"),
      ]);

      /* ===== PROFILE (MUST LOAD) ===== */
      if (results[0].status === "fulfilled") {
        const profile = results[0].value.data;
        setStaff(profile);

        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
        });
      } else {
        throw new Error("Profile API failed");
      }

      /* ===== BOOKINGS ===== */
      if (results[1].status === "fulfilled") {
        const bookingData = results[1].value.data;
setBookings(
  Array.isArray(bookingData)
    ? bookingData
    : bookingData?.bookings || []
);
      } else {
        setBookings([]);
      }

      /* ===== PACKAGES ===== */
      if (results[2].status === "fulfilled") {
        setPackages(results[2].value.data || []);
      }

      /* ===== ADDONS ===== */
      if (results[3].status === "fulfilled") {
        setAddons(results[3].value.data || []);
      }

    } catch (err) {
      console.error("Profile load failed", err);
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);   // 🔥 ALWAYS stop loader
    }
  };



  const toggleStaffStatus = async () => {
    try {
      const res = await axiosClient.patch(
        `/users/staff/${loggedInUserId}/Activate-Deactivate`,
        { isActive: !staff.isActive }
      );
      setStaff(res.data.staff);
      setMessage(res.data.message);
    } catch {
      setMessage("❌ Failed to update status");
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name required";
    if (!formData.email.trim()) e.email = "Email required";
    if (!formData.phone.trim()) e.phone = "Phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axiosClient.patch(`/users/${loggedInUserId}`, formData);
      setStaff(res.data);
      setEditing(false);
      setMessage("✅ Profile updated successfully");
    } catch {
      setMessage("❌ Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return <Loader />;



  return (
    <div className="sp-container">
      <div className="sp-card">
        <div className="sp-header">
          <span className="sp-role">
            {role === "detailer" ? "Detailer" : "Cleaner"}
          </span>
        </div>

        <div className="sp-body">
          <h2 className="sp-name">{staff.name}</h2>

          <p className="sp-line"><strong>Phone:</strong> {staff.phone}</p>
          <p className="sp-line"><strong>Email:</strong> {staff.email}</p>

          <div className="sp-status">
            <span>Working Status</span>
            <span className={staff.isActive ? "sp-active" : "sp-inactive"}>
              {staff.isActive ? "Online" : "Offline"}
            </span>
          </div>

          {editing && (
            <form className="sp-form" onSubmit={handleSave}>
              <input value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
              />
              {errors.name && <p className="sp-error">{errors.name}</p>}

              <input value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
              />

              <input value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone"
              />

              <input value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
              />

              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditing(false)}>Cancel</button>
            </form>
          )}



          {!editing && (
            <div className="sp-actions">
              <button onClick={() => setEditing(true)}>Edit</button>

              <button
                className={staff.isActive ? "sp-deactivate" : "sp-activate"}
                onClick={toggleStaffStatus}
              >
                {staff.isActive ? "Go Offline" : "Go Online"}
              </button>

              <button className="sp-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

          {/* ===== ASSIGNED BOOKINGS ===== */}
          <div className="sp-bookings">
            <h3 className="sp-bookings-title">Today’s Bookings</h3>

            {bookings.length === 0 && (
              <p className="sp-no-bookings">No bookings assigned</p>
            )}

            {bookings.map((booking) => (
              <div className="sp-booking-card" key={booking._id}>
                <div className="sp-booking-left">
                  <h4>
                    Booking #{booking.bookingNumber}
                    <span> ({booking.vehicleType})</span>
                  </h4>

                  <p className="sp-booking-address">
                    📍 {booking.location || booking.address || "Location not available"}
                  </p>

                  <div className="sp-booking-time">
                    {booking.time}
                  </div>

                  <button
                    className="sp-view-btn"
                    onClick={() => navigate(`/booking/${booking._id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>






      {/* {message && <p className="sp-message">{message}</p>} */}
    </div>
  );
}

export default StaffProfile;
