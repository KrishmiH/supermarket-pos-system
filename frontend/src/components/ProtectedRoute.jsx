import { Navigate } from "react-router-dom";
import { getAuth } from "../services/auth";

export default function ProtectedRoute({ children, roles }) {
  const auth = getAuth();

  if (!auth?.token) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0 && !roles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
