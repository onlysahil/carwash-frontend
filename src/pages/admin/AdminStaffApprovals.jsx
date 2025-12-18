import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./AdminStaffApprovals.css";


function AdminStaffApprovals() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch pending staff
  const fetchPendingStaff = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/users?role=detailer&verificationStatus=pending");
      setStaffList(res.data || []);
    } catch (err) {
      setError("Failed to load staff requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingStaff();
  }, []);

  // Approve staff
  const approveStaff = async (id) => {
    if (!window.confirm("Approve this staff member?")) return;

    try {
      await axiosClient.patch(`/users/staff/${id}/verify`);
      fetchPendingStaff();
    } catch (err) {
      alert("Approval failed");
    }
  };

  // Reject staff (soft reject)
  const rejectStaff = async (id) => {
    if (!window.confirm("Reject this staff member?")) return;

    try {
      await axiosClient.patch(`/users/staff/${id}/reject`);
      fetchPendingStaff();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  return (
    <div className="admin-approval-page">
      <h1>Staff KYC Approvals</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && staffList.length === 0 && (
        <p>No pending requests</p>
      )}

      <div className="approval-table">
        {staffList.map((staff) => (
          <div key={staff._id} className="approval-card">
            <div className="info">
              <p><b>Name:</b> {staff.name}</p>
              <p><b>Email:</b> {staff.email}</p>
              <p><b>Role:</b> {staff.role}</p>
              <p><b>Aadhaar:</b> {staff.aadhaarNumber}</p>
              <p><b>PAN:</b> {staff.panNumber}</p>
            </div>

            <div className="documents">
              {staff.documentUrls?.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Document {i + 1}
                </a>
              ))}
            </div>

            <div className="actions">
              <button
                className="approve-btn"
                onClick={() => approveStaff(staff._id)}
              >
                Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => rejectStaff(staff._id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminStaffApprovals;