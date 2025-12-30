// src/pages/admin/AddStaff.jsx
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import "./AddStaff.css";

function AddStaff() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("receptionist");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ✅ KYC
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [documentUrls, setDocumentUrls] = useState("");

  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD STAFF ----------------
  const loadStaff = async () => {
    try {
      const res = await axiosClient.get("/users");
      const onlyStaff = res.data.filter((u) =>
        ["receptionist", "detailer", "cleaner"].includes(u.role)
      );
      setStaffList(onlyStaff);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // ---------------- ADD STAFF (SINGLE API) ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axiosClient.post("/users/staff", {
        name,
        email,
        password,
        role,
        phone,
        address,
        aadhaarNumber,
        panNumber,
        documentUrls: documentUrls
          ? documentUrls.split(",").map((d) => d.trim())
          : [],
      });

      setSuccess(
        `✅ Staff created successfully

Login Email: ${email}
Password: ${password}`
      );

      // RESET FORM
      setName("");
      setEmail("");
      setPassword("");
      setRole("receptionist");
      setPhone("");
      setAddress("");
      setAadhaarNumber("");
      setPanNumber("");
      setDocumentUrls("");

      loadStaff();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-staff-wrapper">

      {/* ---------------- ADD STAFF FORM ---------------- */}
      <div className="add-staff-card">
        <h2>Add New Staff</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <pre className="success-msg">{success}</pre>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="text"
              placeholder="Set login password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="receptionist">Receptionist</option>
              <option value="detailer">Detailer</option>
              <option value="cleaner">Cleaner</option>
            </select>
          </div>

          {/* ---------------- KYC ---------------- */}
          <h4 className="kyc-title">KYC Details (Admin)</h4>

          <div className="input-group">
            <label>Aadhaar Number</label>
            <input value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>PAN Number</label>
            <input value={panNumber} onChange={(e) => setPanNumber(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Document URLs (comma separated)</label>
            <input
              placeholder="https://doc1, https://doc2"
              value={documentUrls}
              onChange={(e) => setDocumentUrls(e.target.value)}
            />
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "+ Add Staff"}
          </button>
        </form>
      </div>

      {/* ---------------- STAFF LIST ---------------- */}
      <div className="staff-list-card">
        <h3>Staff Members</h3>

        {staffList.length === 0 ? (
          <p>No staff added yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>KYC</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.role}</td>
                  <td>✅ Completed</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
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