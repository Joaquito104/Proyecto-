import React, { createContext, useEffect, useState } from "react";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";

// Contextos
export const ThemeContext = createContext();
export const AuthContext = createContext();

export default function App() {
  // -------------------------
  //  THEME
  // -------------------------
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('ev3pi-theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ev3pi-theme', theme);
    } catch (e) {}

    if (theme === "dark") document.documentElement.classList.add("theme-dark");
    else document.documentElement.classList.remove("theme-dark");
  }, [theme]);

  // -------------------------
  //  AUTH
  // -------------------------
  const [user, setUser] = useState(null); // contiene: id, username, rol
  const [loading, setLoading] = useState(true);

  // Cargar token y datos del usuario al inicio
  useEffect(() => {
    const token = localStorage.getItem("ev3pi-token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Llamar backend para obtener perfil
    fetch("http://127.0.0.1:8000/api/perfil/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Token inválido");
        const data = await res.json();
        setUser(data);
      })
      .catch(() => {
        // Si el token expiró → limpiar
        localStorage.removeItem("ev3pi-token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Función login
  function login(token, userData) {
    localStorage.setItem("ev3pi-token", token);
    setUser(userData);
  }

  // Función logout
  function logout() {
    localStorage.removeItem("ev3pi-token");
    setUser(null);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
