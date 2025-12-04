import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requireRole }) {
  const token = localStorage.getItem("access");
  const rol = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/iniciar-sesion" />;
  }

  if (requireRole && rol !== requireRole) {
    return <Navigate to="/no-autorizado" />;
  }

  return children;
}
