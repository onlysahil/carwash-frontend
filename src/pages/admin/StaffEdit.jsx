import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader/Loader"
import "./StaffEdit.css";

function StaffEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState({
    name: "",
    email: "",
    role: "staff",
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccess("");

    try {
      await axiosClient.patch(`/users/${id}`, staff);
      setSuccess("Staff updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

   if (loading) return <Loader />;

  return (
    <div className="staff-edit-page">
      <form className="staff-edit-form" onSubmit={handleUpdate}>
        <h2>Edit Staff</h2>

        {success && <p className="success">{success}</p>}

        <input
          type="text"
          value={staff.name}
          onChange={(e) => setStaff({ ...staff, name: e.target.value })}
          placeholder="Name"
          required
        />

        <input
          type="email"
          value={staff.email}
          onChange={(e) => setStaff({ ...staff, email: e.target.value })}
          placeholder="Email"
          required
        />

        <select
          value={staff.role}
          onChange={(e) => setStaff({ ...staff, role: e.target.value })}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="save-btn">Save Changes</button>

        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default StaffEdit;
