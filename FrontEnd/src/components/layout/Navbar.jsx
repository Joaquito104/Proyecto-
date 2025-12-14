import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext, AuthContext } from "../../App";
import ThemeToggle from "../common/ThemeToggle";

export default function Navbar() {
  const { theme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  const dark = theme === "dark";
  const navBg = dark ? "#13202a" : "#f2f2f2";
  const navColor = dark ? "#e6eef8" : "#0b1220";
  const activeBg = dark ? "#1e3a4c" : "#e0e0e0";
  const btnBg = dark ? "#0b1220" : "#111827";
  const danger = "#ef4444";

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: navColor,
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 6,
    background: isActive(path) ? activeBg : "transparent",
    fontWeight: isActive(path) ? 700 : 500,
  });

  const goDashboard = () => {
    if (!user) return "/";
    if (user.rol === "CORREDOR") return "/dashboard/corredor";
    if (user.rol === "ANALISTA") return "/dashboard/analista";
    if (user.rol === "AUDITOR") return "/dashboard/auditor";
    if (user.rol === "TI") return "/dashboard/admin-ti";
    return "/";
  };

  const handleLogout = () => {
    logout();
    navigate("/iniciar-sesion", { replace: true });
  };

  return (
    <nav
      style={{
        padding: "12px 20px",
        background: navBg,
        color: navColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(2,6,23,0.08)",
      }}
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/" style={linkStyle("/")}>Home</Link>

        {user && (
          <Link to={goDashboard()} style={linkStyle(goDashboard())}>
            📊 Dashboard
          </Link>
        )}

        {user?.rol === "CORREDOR" && (
          <Link to="/certificates-upload" style={linkStyle("/certificates-upload")}>
            Certificados
          </Link>
        )}

        {["ANALISTA", "AUDITOR", "TI"].includes(user?.rol) && (
          <Link to="/tax-management" style={linkStyle("/tax-management")}>
            Gestión Tributaria
          </Link>
        )}

        {["AUDITOR", "TI"].includes(user?.rol) && (
          <Link to="/validacion" style={linkStyle("/validacion")}>
            Validación
          </Link>
        )}

        {["AUDITOR", "TI"].includes(user?.rol) && (
          <Link to="/audit-panel" style={linkStyle("/audit-panel")}>
            Auditoría
          </Link>
        )}

        {user && (
          <Link to="/registros" style={linkStyle("/registros")}>
            Registros
          </Link>
        )}

        {user && (
          <Link to="/feedback" style={linkStyle("/feedback")}>
            Feedback
          </Link>
        )}

        {user?.is_superuser && (
          <Link to="/system-settings" style={linkStyle("/system-settings")}>
            Administración Nuam
          </Link>
        )}

        {user?.is_superuser && (
          <Link
            to="/admin-global"
            style={{
              ...linkStyle("/admin-global"),
              background: danger,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            🚨 Admin Global
          </Link>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ThemeToggle variant="inline" />

        {!user ? (
          <>
            <Link to="/iniciar-sesion">Iniciar sesión</Link>
            <Link to="/registro" style={{ fontWeight: 700 }}>
              Registrarse
            </Link>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMostrarDropdown(!mostrarDropdown)}
              style={{
                background: btnBg,
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              👤 {user.username} {mostrarDropdown ? "▲" : "▼"}
            </button>

            {mostrarDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: navBg,
                  border: `1px solid ${activeBg}`,
                  borderRadius: 8,
                  minWidth: 200,
                  marginTop: 8,
                  zIndex: 1000,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                <Link
                  to="/perfil"
                  onClick={() => setMostrarDropdown(false)}
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    color: navColor,
                    textDecoration: "none",
                    borderBottom: `1px solid ${activeBg}`,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = activeBg)}
                  onMouseLeave={(e) => (e.target.style.background = "transparent")}
                >
                  ⚙️ Configuración de Perfil
                </Link>
                <Link
                  to="/perfil"
                  onClick={() => setMostrarDropdown(false)}
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    color: navColor,
                    textDecoration: "none",
                    borderBottom: `1px solid ${activeBg}`,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = activeBg)}
                  onMouseLeave={(e) => (e.target.style.background = "transparent")}
                >
                  👤 Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    setMostrarDropdown(false);
                    handleLogout();
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 16px",
                    color: danger,
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = activeBg)}
                  onMouseLeave={(e) => (e.target.style.background = "transparent")}
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
