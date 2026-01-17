import { Navigate } from "react-router-dom";
import { getAuth } from "../services/auth";

export default function ProtectedRoute({ children, roles }) {
  const auth = getAuth();

  // Not logged in → login page
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed
  if (roles && roles.length > 0 && !roles.includes(auth.role)) {
    // Redirect based on role
    if (auth.role === "Cashier") {
      return <Navigate to="/pos" replace />;
    }

    // Admin / Manager fallback
    return <Navigate to="/" replace />;
  }

  return children;
}
