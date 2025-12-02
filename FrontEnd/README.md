# EV3-Pi FrontEnd — Resumen y pasos rápidos

> Nota: README actualizado parcialmente — esperando tus instrucciones para más cambios.

Breve resumen de los cambios realizados y cómo poner en marcha el frontend. (Hasta Ahora)

**Qué se hizo (resumido)**
- Agregada navegación con `react-router-dom` y rutas: `/`, `/login`, `/dashboard`.
- Implementadas páginas: `Home`, `Login`, `Dashboard` con estilos simples.
- `Navbar.jsx` y `Sidebar.jsx` en `src/components/layout/` (solo `Navbar` se muestra por defecto).
- Implementado toggle de tema (claro/oscuro) como componente `src/components/common/ThemeToggle.jsx` (flotante, esquina superior derecha). Preferencia guardada en `localStorage` bajo `ev3pi-theme`.
- Refactorizaciones: layouts simplificados, componentes modularizados (`LayoutWrapper` en `router.jsx`).
- Formularios básicos (hook `useForm`) y componentes comunes `Input` y `Button` adaptados al tema.
- Limpieza: eliminados layouts redundantes y simplificado `layout/` para dejar `Navbar.jsx` y `Sidebar.jsx`.

**Comandos para preparar y ejecutar**
- Instalar dependencias (usa la carpeta `FrontEnd`):

- - npm install


**Módulos (dependencias principales)**
- Producción:
  - `react`
  - `react-dom`
  - `react-router-dom`

- Desarrollo / build / lint:
  - `vite`
  - `@vitejs/plugin-react`
  - `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

Nota: el proyecto ya contiene `package.json` con las dependencias listadas; ejecutar `npm install` instalará todo lo necesario.

