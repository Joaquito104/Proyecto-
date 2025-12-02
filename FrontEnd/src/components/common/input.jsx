import { useContext } from "react";
import { ThemeContext } from "../../App";

export default function Input({ label, ...props }) {
  const { theme } = useContext(ThemeContext);
  const dark = theme === 'dark';
  const labelColor = dark ? '#e6eef8' : '#0b1220';
  const inputBg = dark ? '#0f1720' : '#ffffff';
  const inputColor = dark ? '#e6eef8' : '#0b1220';
  const inputBorder = dark ? '#1e3a4c' : '#ccc';

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ color: labelColor, display: 'block', marginBottom: '6px', fontWeight: '500' }}>{label}</label>
      <input 
        {...props} 
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          borderRadius: "6px",
          border: `1px solid ${inputBorder}`,
          background: inputBg,
          color: inputColor,
          fontSize: '14px',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}
