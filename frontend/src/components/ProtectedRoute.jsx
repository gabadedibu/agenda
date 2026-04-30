import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role, logout } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!role) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "department_head") {
      return <Navigate to="/head" replace />;
    }

    logout();
    return <Navigate to="/login" replace />;
  }

  return children;
}