import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../App";

export default function Sidebar({ isOpen = true }) {
  const { theme } = useContext(ThemeContext);
  const dark = theme === "dark";

  const bg = dark ? "#071422" : "#eaeaea";
  const color = dark ? "#dbeafe" : "#08121a";

  if (!isOpen) return null;

  return (
    <aside
      style={{
        width: "230px",
        padding: "18px",
        background: bg,
        color,
        minHeight: "100vh",
        boxShadow: "2px 0 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Panel</h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ padding: "10px 0" }}>
          <Link to="/" style={{ color, textDecoration: "none" }}>
            Inicio
          </Link>
        </li>

        <li style={{ padding: "10px 0" }}>
          <Link to="/dashboard" style={{ color, textDecoration: "none" }}>
            Dashboard
          </Link>
        </li>

        {/* 🔵 MÓDULO NUEVO */}
        <li style={{ padding: "10px 0" }}>
          <Link to="/registros" style={{ color, textDecoration: "none" }}>
            Registros
          </Link>
        </li>
      </ul>
    </aside>
  );
}
