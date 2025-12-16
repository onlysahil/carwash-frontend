import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader/Loader"
import "./StaffView.css";

function StaffView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await axiosClient.get(`/users/${id}`);
      setStaff(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load staff details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!staff) return <p>No staff found</p>;

  return (
    <div className="staff-view-page">
      <div className="staff-card">
        <h2>Staff Profile</h2>

        <div className="staff-info">
          <p><strong>Name:</strong> {staff.name}</p>
          <p><strong>Email:</strong> {staff.email}</p>
          <p><strong>Role:</strong> {staff.role}</p>
          <p><strong>Created:</strong> {new Date(staff.createdAt).toLocaleString()}</p>
          <p><strong>Updated:</strong> {new Date(staff.updatedAt).toLocaleString()}</p>
        </div>

        <div className="staff-actions">
          <button
            className="edit-btn"
            onClick={() => navigate(`/admin/users/${id}/edit`)}
          >
            Edit
          </button>

          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffView;
