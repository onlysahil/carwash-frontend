import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Loader from "../components/Loader/Loader";
// import "./StaffList.css"; 

function ReceptionStaffList() {
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

  const filteredByRole = users.filter((u) => {
    if (roleFilter === "all") return true;
    return u.role === roleFilter;
  });

  const filteredUsers = filteredByRole.filter((u) => {
    const t = search.toLowerCase();
    return u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t);
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

   if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="staff-list-page">

      <div className="staff-header">
        <h2>Staff & Detailer (Reception View)</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search staff..."
            className="search-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

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
                  ? "Support"
                  : u.role === "cleaner"
                  ? "Cleaner"
                  : "Staff"}
              </td>

              <td>{new Date(u.createdAt).toLocaleString()}</td>

              <td>
                <button onClick={() => navigate(`/reception/staff/${u._id}`)}>
                  View
                </button>

                <button onClick={() => navigate(`/reception/staff/${u._id}/edit`)}>
                  Edit
                </button>

                {/* Optional — Remove delete if receptionist should not delete */}
                {/* <button onClick={() => handleDelete(u._id)}>Delete</button> */}
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

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ReceptionStaffList;