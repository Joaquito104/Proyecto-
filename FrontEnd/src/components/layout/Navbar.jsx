import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../App";

export default function Navbar({ onToggleSidebar }) {
  const { theme } = useContext(ThemeContext);
  const dark = theme === "dark";

  const navBg = dark ? "#13202a" : "#f2f2f2";
  const navColor = dark ? "#e6eef8" : "#0b1220";

  return (
    <nav
      style={{
        padding: "12px 20px",
        background: navBg,
        color: navColor,
        display: "flex",
        gap: "12px",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(2,6,23,0.08)",
      }}
    >
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          style={{
            position: "absolute",
            left: 12,
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          ☰
        </button>
      )}

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/" style={{ color: navColor, textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/iniciar-sesion" style={{ color: navColor, textDecoration: "none" }}>
          Iniciar sesión
        </Link>

        <Link
          to="/certificates-upload"
          style={{ color: navColor, textDecoration: "none" }}
        >
          Certificados
        </Link>
        <Link
          to="/tax-management"
          style={{ color: navColor, textDecoration: "none" }}
        >
          Gestión tributaria
        </Link>
        <Link
          to="/audit-panel"
          style={{ color: navColor, textDecoration: "none" }}
        >
          Auditoría
        </Link>
        <Link
          to="/system-settings"
          style={{ color: navColor, textDecoration: "none" }}
        >
          Ajustes
        </Link>

        {/* 🔵 NUEVO BOTÓN: REGISTROS */}
        <Link
          to="/registros"
          style={{
            color: navColor,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Registros
        </Link>
      </div>
    </nav>
  );
}
