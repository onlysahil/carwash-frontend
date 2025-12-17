// src/pages/admin/AddStaff.jsx
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import "./AddStaff.css";

function AddStaff() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("detailer");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [staffList, setStaffList] = useState([]);

  // Fetch ALL staff
  const loadStaff = async () => {
    try {
      const res = await axiosClient.get("/users");

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

  // Add Staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axiosClient.post("/users/staff", {
        name,
        email,
        role,
        phone: "N/A",
        address: "N/A",
      });

      if (res.status === 201) {
        setSuccess("Staff member added successfully!");

        setName("");
        setEmail("");
        setRole("detailer");

        loadStaff();
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

        <p className="info-text">
          Login credentials will be generated automatically.
        </p>
      </div>

      {/* STAFF LIST */}
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
