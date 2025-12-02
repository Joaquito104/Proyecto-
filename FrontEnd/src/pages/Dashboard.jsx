import { useContext } from "react";
import { ThemeContext } from "../App";

export default function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const dark = theme === 'dark';
  const bg = dark ? '#0f1720' : '#f8fafc';
  const text = dark ? '#e6eef8' : '#0b1220';
  const card = dark ? '#13202a' : '#ffffff';
  const muted = dark ? '#97a6b2' : '#6b7280';

  return (
    <div style={{ background: bg, color: text, minHeight: 'calc(100vh - 56px)', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 800, width: '100%', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 12px 0', fontSize: 32 }}>Panel de Control</h1>
        <p style={{ color: muted, margin: '0 0 32px 0' }}>Bienvenido al dashboard.</p>

        <div style={{ background: card, padding: '24px', borderRadius: '8px', boxShadow: dark ? 'none' : '0 6px 18px rgba(15,23,42,0.06)', marginTop: '20px' }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>Funcionalidades principales</h2>
          <ul style={{ color: muted, textAlign: 'left', display: 'inline-block' }}>
            <li style={{ marginBottom: '8px' }}>Monitoreo en tiempo real</li>
            <li style={{ marginBottom: '8px' }}>Control remoto básico</li>
            <li>Historial y métricas de rendimiento</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
