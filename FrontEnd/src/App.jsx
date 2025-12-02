import React, { createContext, useEffect, useState } from "react";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";

export const ThemeContext = createContext();

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('ev3pi-theme') || 'light'
    } catch (e) {
      return 'light'
    }
  });

  useEffect(() => {
    try { localStorage.setItem('ev3pi-theme', theme) } catch (e) {}
    if (theme === 'dark') document.documentElement.classList.add('theme-dark')
    else document.documentElement.classList.remove('theme-dark')
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}
