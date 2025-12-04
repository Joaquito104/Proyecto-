import React, { useState } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../App';

export default function SystemSettings() {
  const { theme } = useContext(ThemeContext);
  const dark = theme === 'dark';
  const bg = dark ? '#0f1720' : '#f8fafc';
  const text = dark ? '#e6eef8' : '#0b1220';
  const card = dark ? '#13202a' : '#ffffff';
  const border = dark ? '#374151' : '#d1d5db';
  const muted = dark ? '#97a6b2' : '#6b7280';

  const [siteName, setSiteName] = useState('EV3-Pi');
  const [maintenance, setMaintenance] = useState(false);

  function handleSave() {
    // placeholder: persist settings via API
    alert('Configuración guardada (simulada)');
  }

  return (
    <div style={{ padding: 24, background: bg, color: text, minHeight: 'calc(100vh - 56px)' }}>
      <h1 style={{ marginTop: 0 }}>Configuración del sistema</h1>
      <p style={{ color: muted }}>Ajustes generales y de mantenimiento.</p>

      <div style={{ marginTop: 12, maxWidth: 600, background: card, padding: 24, borderRadius: 6, border: `1px solid ${border}` }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, color: text, fontWeight: '600' }}>Nombre del sitio</label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: `1px solid ${border}`, background: dark ? '#1f2937' : '#fff', color: text, boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ color: text }}>
            <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} />{' '}
            <span style={{ marginLeft: 8 }}>Modo mantenimiento</span>
          </label>
        </div>

        <div>
          <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: 4, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
