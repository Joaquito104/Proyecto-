import React, { useContext } from 'react'
import { ThemeContext } from '../../App'

export default function Sidebar({ isOpen = true }) {
  const { theme } = useContext(ThemeContext);
  const dark = theme === 'dark';

  const bg = dark ? '#071422' : '#eaeaea';
  const color = dark ? '#dbeafe' : '#08121a';

  if (!isOpen) return null;

  return (
    <aside style={{ width: "200px", padding: "12px", background: bg, color, minHeight: '100vh', transition: 'all 200ms' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ padding: '8px 6px', cursor: 'pointer' }}>Inicio</li>
        <li style={{ padding: '8px 6px', cursor: 'pointer' }}>Dashboard</li>
      </ul>
    </aside>
  );
}
