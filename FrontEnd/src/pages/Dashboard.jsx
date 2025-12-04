import { useContext } from "react";
import { ThemeContext } from "../App";

export default function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const dark = theme === 'dark';
  const bg = dark ? '#0f1720' : '#f8fafc';
  const text = dark ? '#e6eef8' : '#0b1220';

  return (
    <div style={{ background: bg, color: text, minHeight: 'calc(100vh - 56px)', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 800, width: '100%', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 12px 0', fontSize: 32 }}>Dashboard</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px 0' }}>Contenido en desarrollo para conectar con backend.</p>
      </div>
    </div>
  );
}
