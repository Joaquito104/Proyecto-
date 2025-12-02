import { useContext } from "react";
import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import useForm from "../hooks/useForm";
import { ThemeContext } from "../App";

const Login = () => {
  const { form, handleChange } = useForm({ username: "", password: "" });
  const { theme } = useContext(ThemeContext);
  const dark = theme === 'dark';
  const bg = dark ? '#0f1720' : '#f8fafc';
  const text = dark ? '#e6eef8' : '#0b1220';
  const cardBg = dark ? '#13202a' : '#ffffff';
  const mutedText = dark ? '#97a6b2' : '#6b7280';

  return (
    <div style={{ background: bg, color: text, minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: "400px", width: '100%', background: cardBg, padding: '30px', borderRadius: '8px', boxShadow: dark ? 'none' : '0 6px 18px rgba(15,23,42,0.06)' }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Iniciar sesión</h2>

        <Input 
          label="Usuario" 
          name="username"
          value={form.username}
          onChange={handleChange}
        />

        <Input 
          label="Contraseña" 
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <Button label="Ingresar" style={{ width: '100%', marginTop: '16px' }} />

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link to="/" style={{ color: mutedText, textDecoration: 'none', fontSize: '14px' }}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login