import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!token || !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}


