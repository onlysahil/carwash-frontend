import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedAdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!user.is_staff && !user.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
