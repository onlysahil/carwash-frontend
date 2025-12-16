// src/pages/admin/StaffList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./StaffList.css";
import Loader from "../../components/Loader/Loader"

function StaffList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);

      const res = await axiosClient.get("/users");
      if (!Array.isArray(res.data)) throw new Error("Invalid response");

      // ONLY STAFF + DETAILER + SUPPORT
      const staffOnly = res.data.filter(
  (u) =>
    u.role === "staff" ||
    u.role === "detailer" ||
    u.role === "support" ||
    u.role === "cleaner"
);

      setUsers(staffOnly);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete?")) return;

    try {
      await axiosClient.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete staff");
    }
  };

  // ROLE FILTER
  const filteredByRole = users.filter((u) => {
    if (roleFilter === "all") return true;
    return u.role === roleFilter;
  });

  // SEARCH
  const filteredUsers = filteredByRole.filter((u) => {
    const t = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(t) ||
      u.email.toLowerCase().includes(t)
    );
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="staff-list-page">

      {/* HEADER */}
      <div className="staff-header">
        <h2>Staff & Detailer Management</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search staff name or email..."
            className="search-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* ROLE DROPDOWN */}
          <select
  className="role-dropdown"
  value={roleFilter}
  onChange={(e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  }}
>
  <option value="all">All Staff</option>
  <option value="detailer">Detailers</option>
  <option value="cleaner">Cleaners</option>
  <option value="staff">Support Staff</option>
  <option value="support">Helpers / Assistants</option>
  
</select>
        </div>
      </div>

      {/* TABLE */}
      <table className="staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>

              <td style={{ textTransform: "capitalize" }}>
                {u.role === "detailer"
                  ? "Detailer"
                  : u.role === "support"
                  ? "Support Staff"
                  : "Cleaner"}
              </td>

              <td>{new Date(u.createdAt).toLocaleString()}</td>

              <td>
                <button onClick={() => navigate(`/admin/staff/${u._id}`)}>
                  View
                </button>

                <button onClick={() => navigate(`/admin/staff/${u._id}/edit`)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}

          {paginatedUsers.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No staff found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default StaffList;
