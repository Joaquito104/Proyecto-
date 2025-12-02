import { useContext } from "react";
import { ThemeContext } from "../../App";

export default function Button({ label, onClick, style = {} }) {
  const { theme } = useContext(ThemeContext);
  const dark = theme === 'dark';

  return (
    <button 
      onClick={onClick} 
      style={{
        padding: "10px 15px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        cursor: "pointer",
        borderRadius: "6px",
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: dark ? 'none' : '0 2px 6px rgba(0,123,255,0.2)',
        ...style
      }}
    >
      {label}
    </button>
  );
}
