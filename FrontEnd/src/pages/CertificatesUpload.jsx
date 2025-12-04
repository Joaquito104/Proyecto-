import React, { useState } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../App';

export default function CertificatesUpload() {
  const { theme } = useContext(ThemeContext);
  const dark = theme === 'dark';
  const bg = dark ? '#0f1720' : '#f8fafc';
  const text = dark ? '#e6eef8' : '#0b1220';
  const card = dark ? '#13202a' : '#ffffff';
  const border = dark ? '#374151' : '#e5e7eb';
  const muted = dark ? '#97a6b2' : '#6b7280';

  const [files, setFiles] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);

  function handleFiles(e) {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  }

  async function handleParseFirstFile() {
    if (!files[0]) return;
    const text = await files[0].text();
    const rows = text
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(0, 10)
      .map((r) => r.split(','));
    setPreviewRows(rows);
  }

  return (
    <div style={{ padding: 24, background: bg, color: text, minHeight: 'calc(100vh - 56px)' }}>
      <h1 style={{ marginTop: 0 }}>Carga masiva de certificados</h1>
      <p style={{ color: muted }}>Sube archivos CSV o ZIP con certificados. Aquí se muestra una vista previa del primer archivo.</p>

      <div style={{ marginTop: 12 }}>
        <input type="file" multiple onChange={handleFiles} accept=".csv,.zip" style={{ color: text }} />
        <button onClick={handleParseFirstFile} style={{ marginLeft: 12, padding: '8px 16px', borderRadius: 4, border: `1px solid ${border}`, background: card, color: text, cursor: 'pointer' }}>Previsualizar primer archivo</button>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 16, background: card, padding: 12, borderRadius: 6, border: `1px solid ${border}` }}>
          <strong>Archivos seleccionados:</strong>
          <ul style={{ color: text }}>
            {files.map((f, i) => (
              <li key={i}>{f.name} — {Math.round(f.size/1024)} KB</li>
            ))}
          </ul>
        </div>
      )}

      {previewRows.length > 0 && (
        <div style={{ marginTop: 16, background: card, padding: 16, borderRadius: 6, border: `1px solid ${border}` }}>
          <h3 style={{ marginTop: 0 }}>Vista previa (primeros 10 registros)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                {previewRows.map((r, ri) => (
                  <tr key={ri}>
                    {r.map((c, ci) => (
                      <td key={ci} style={{ border: `1px solid ${border}`, padding: 6 }}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
