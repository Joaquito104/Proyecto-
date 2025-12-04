import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../App';

export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const dark = theme === 'dark';
  const bg = dark ? '#0a0f18' : '#f3f4f6';
  const text = dark ? '#e6eef8' : '#0b1220';
  const muted = dark ? '#97a6b2' : '#6b7280';
  const accent = '#3b82f6';
  const border = dark ? '#1f2937' : '#e5e7eb';

  return (
    <footer style={{ background: bg, color: muted, borderTop: `1px solid ${border}`, padding: '32px 24px', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
        {/* Licencia */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontWeight: '600', color: text }}>Licencia</h4>
          <p style={{ margin: 0, fontSize: 13 }}>Nuam © 2025. Todos los derechos reservados.</p>
          <p style={{ margin: '8px 0 0 0', fontSize: 13 }}>Licencia: MIT (Open Source)</p>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, opacity: 0.8 }}>Desarrollado para fines educativos y comerciales.</p>
        </div>

        {/* Atención al Cliente */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontWeight: '600', color: text }}>Atención al Cliente</h4>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 13 }}>
            <li style={{ marginBottom: 8 }}><span style={{ color: accent, textDecoration: 'none' }}>Correo: (Próximamente)</span></li>

          </ul>
        </div>

        {/* Enlaces útiles */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontWeight: '600', color: text }}>Enlaces Útiles</h4>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 13 }}>
            <li style={{ marginBottom: 8 }}><Link to="/" style={{ color: accent, textDecoration: 'none' }}>Inicio</Link></li>
            <li style={{ marginBottom: 8 }}><Link to="/certificates-upload" style={{ color: accent, textDecoration: 'none' }}>Certificados</Link></li>
            <li><Link to="/system-settings" style={{ color: accent, textDecoration: 'none' }}>Configuración</Link></li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria y créditos */}
      <div style={{ borderTop: `1px solid ${border}`, paddingTop: 16, textAlign: 'center', fontSize: 12, opacity: 0.7 }}>
        <p style={{ margin: 0 }}>Plataforma de Auditoría y Gestión Tributaria</p>
      </div>
    </footer>
  );
}
