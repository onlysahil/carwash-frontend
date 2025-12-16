// src/pages/admin/UserEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader/Loader"
import "./UserDetails.css";

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Check where the page is opened from (admin OR reception)
  const isReception = window.location.pathname.startsWith("/reception");

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await axiosClient.get(`/users/${id}`);
      setForm({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.patch(`/users/${id}`, form);
      alert("User updated successfully");

      // Redirect based on dashboard
      navigate(
        isReception
          ? `/reception/users/${id}`
          : `/admin/users/${id}`
      );

    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="user-edit-page">
      <h2>Edit User</h2>

      <form onSubmit={handleSubmit}>

        <label>Name:</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email:</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Role:</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Update User</button>
      </form>

      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
}

export default UserEdit;
