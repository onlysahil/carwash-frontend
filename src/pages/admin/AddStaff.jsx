// src/pages/admin/AddStaff.jsx
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

import "./AddStaff.css";

function AddStaff() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("detailer"); // default role

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [staffList, setStaffList] = useState([]);

  // Fetch ALL staff: detailers + cleaners
  const loadStaff = async () => {
    try {
      const res = await axiosClient.get("/users");

      // Show only staff (detailer OR cleaner)
      const onlyStaff = res.data.filter(
        (u) => u.role === "detailer" || u.role === "cleaner"
      );

      setStaffList(onlyStaff);
    } catch (err) {
      console.error("Failed to load staff", err);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // Handle Add Staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axiosClient.post("/users/staff", {
        name,
        email,
        password,
        role, // MUST match API — "detailer" / "cleaner"
        phone: "N/A",
        address: "N/A",
      });

      if (res.status === 201 || res.status === 200) {
        setSuccess("Staff member added successfully!");

        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setRole("detailer");

        loadStaff(); // Refresh table
      }
    } catch (err) {
      console.error("Add Staff Error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to add staff");
    }
  };

  return (
    <div className="add-staff-wrapper">
      {/* ADD STAFF FORM */}
      <div className="add-staff-card">
        <h2>Add New Staff</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter staff name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="detailer">Detailer</option>
              <option value="cleaner">Cleaner</option>
            </select>
          </div>

          <button className="submit-btn" type="submit">
            + Add Staff
          </button>
        </form>
      </div>

      {/* STAFF LIST SECTION */}
      <div className="staff-list-card">
        <h3>Recently Added Staff</h3>

        {staffList.length === 0 ? (
          <p className="no-staff">No staff added yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>

            <tbody>
              {staffList.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td style={{ textTransform: "capitalize" }}>{s.role}</td>
                  <td>{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AddStaff;
