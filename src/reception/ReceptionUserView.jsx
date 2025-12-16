import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Loader from "../components/Loader/Loader";
// import "../admin/UserDetails.css";

export default function ReceptionUserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await axiosClient.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      alert("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

   if (loading) return <Loader />;
  if (!user) return <p>No user found</p>;

  return (
    <div className="user-view-page">
      <h2>User Details</h2>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
      <p><b>Created At:</b> {new Date(user.createdAt).toLocaleString()}</p>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
