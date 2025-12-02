import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/common/ThemeToggle'

const Home = () => {
  const [dark, setDark] = useState(() => {
    try {
      return document.documentElement.classList.contains('theme-dark')
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('theme-dark'))
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const bg = dark ? '#0f1720' : '#f8fafc'
  const text = dark ? '#e6eef8' : '#0b1220'
  const card = dark ? '#13202a' : '#ffffff'
  const muted = dark ? '#97a6b2' : '#6b7280'

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, transition: 'background 200ms, color 200ms' }}>
      <ThemeToggle />
      <main style={{ padding: '48px 24px', maxWidth: 980, margin: '0 auto', fontFamily: 'Inter, Arial, sans-serif' }}>
        <section style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 32 }}>Bienvenido a EV3-Pi</h1>
          <p style={{ color: muted, marginTop: 8 }}>
            Panel de control para tu proyecto 
          </p>
          <div style={{ marginTop: 18 }}>
            <Link to="/dashboard" style={{ marginRight: 12, padding: '10px 16px', background: '#007bff', color: '#fff', borderRadius: 8, textDecoration: 'none', boxShadow: '0 6px 18px rgba(3,102,214,0.12)' }}>
              Ir al Dashboard
            </Link>
            <Link to="/login" style={{ padding: '10px 16px', background: '#6c757d', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
              Iniciar sesión
            </Link>
          </div>
        </section>

        <section style={{ background: card, padding: 18, borderRadius: 8, boxShadow: dark ? 'none' : '0 6px 18px rgba(15,23,42,0.06)' }}>
          <h2 style={{ marginTop: 0 }}>Resumen</h2>
          <p style={{ color: muted }}>Monitorea, controla y visualiza datos de tu EV3 desde la interfaz web.</p>
          <ul style={{ color: muted }}>
            <li>Monitoreo en tiempo real</li>
            <li>Control remoto básico</li>
            <li>Historial y métricas</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Home