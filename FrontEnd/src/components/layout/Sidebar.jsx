import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext, AuthContext } from "../../App";

export default function Sidebar({ isOpen = true }) {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  if (!isOpen) return null;

  const dark = theme === "dark";
  const bg = dark ? "#071422" : "#eaeaea";
  const color = dark ? "#dbeafe" : "#08121a";

  const rol = user?.rol;

  return (
    <aside
      style={{
        width: 230,
        padding: 18,
        background: bg,
        color,
        minHeight: "100vh",
        boxShadow: "2px 0 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Panel</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/">Inicio</Link></li>

        {(rol === "CORREDOR" || rol === "TI") && (
          <li><Link to="/certificates-upload">Certificados</Link></li>
        )}

        {(rol === "ANALISTA" || rol === "AUDITOR" || rol === "TI") && (
          <li><Link to="/tax-management">Gestión tributaria</Link></li>
        )}

        {/* 🅱️ VALIDACIÓN */}
        {(rol === "ANALISTA" || rol === "TI") && (
          <li><Link to="/validacion">Validación</Link></li>
        )}

        {(rol === "AUDITOR" || rol === "TI") && (
          <li><Link to="/audit-panel">Auditoría</Link></li>
        )}

        {rol === "TI" && (
          <li><Link to="/system-settings">Administración</Link></li>
        )}

        <li><Link to="/registros">Registros</Link></li>
      </ul>
    </aside>
  );
}
