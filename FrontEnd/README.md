# EV3-Pi FrontEnd — Resumen de Desarrollo

> Documentación actualizada con todas las páginas y funcionalidades desarrolladas hasta la fecha.

## Resumen General

Se ha desarrollado un panel de administración modular con enrutamiento completo, sistema de auditoría con gráficos interactivos, y componentes base listos para conectar con backend.

## Páginas Desarrolladas

Todas las páginas se encuentran en `src/pages/` y están integradas en el router con `LayoutWrapper` (que incluye Navbar, ThemeToggle y contenido):

### 1. **Home** (`/`)
- Página de bienvenida con hero section centrado.
- 3 cajas de funcionalidades (actualmente vacías, estructura lista para expandir).
- Sección "¿Cómo Funciona?" con 3 pasos numerados.
- Sección de retroalimentación con textarea y botón.
- Footer integrado al pie de la página.
- Tema adaptable (claro/oscuro).
- Branding: Título actualizado a "Nuam".

### 2. **Login** (`/login`)
- Formulario de autenticación con usuario y contraseña.
- Usa hook `useForm` y componentes `Input`/`Button` personalizados.
- Tema claro/oscuro automáticamente adaptado.
- Enlace de retorno a home.

### 3. **Dashboard** (`/dashboard`)
- Página base vacía lista para conectar con backend.
- Estructura preparada con colores tema claro/oscuro.
- Nota: `/dashboard` apunta a `AuditPanel` (Dashboard.jsx disponible como fallback).

### 4. **AuditPanel** (`/audit-panel` y `/dashboard`)
- **Panel de auditoría completo** con 3 secciones:
  
  **DIV 1 — Estadísticas y Gráficos:**
  - 4 cajas de resumen: Total eventos, Exitosos, Consultas, Errores.
  - Botones de período: **1 día**, **1 semana**, **1 mes** (con indicador visual del seleccionado).
  - Gráfico de barras: Eventos por tipo (Acceso, Actualización, Eliminación, Exportación).
  - Gráfico de torta: Distribución de acciones (Operaciones Exitosas, Consultas, Modificaciones, Errores) con porcentajes.
  
  **DIV 2 — Filtros:**
  - Selector de período (1 día / 7 días / 30 días).
  - Campo de búsqueda por usuario, acción o detalle.
  
  **DIV 3 — Registro de Eventos:**
  - Tabla con columnas: Fecha, Usuario, Acción, Estado, Detalles.
  - Estados con badges de color (verde=Exitoso, rojo=Error, amarillo=Consulta/Modificación).
  - Paginación (10 registros por página).
  - Tabla actualmente vacía — lista para conectar API.

### 5. **CertificatesUpload** (`/certificates-upload`)
- Interfaz para carga masiva de certificados.
- Soporta `.csv` y `.zip`.
- Vista previa del primer archivo cargado en tabla.
- Listado de archivos seleccionados con tamaño en KB.
- Tema claro/oscuro integrado.

### 6. **TaxManagement** (`/tax-management`)
- Panel de gestión tributaria con selector de año.
- Cálculo simulado de activos e impuestos estimados.
- Estructura preparada para conectar API de datos tributarios.
- Tema claro/oscuro integrado.

### 7. **SystemSettings** (`/system-settings`)
- Página de configuración del sistema.
- Inputs para nombre del sitio y toggle de modo mantenimiento.
- Botón guardar con feedback (simulado).
- Tema claro/oscuro integrado. 

## Componentes Base

### Ubicación: `src/components/`

**Layout** (`layout/`):
- `Navbar.jsx` — Barra de navegación con enlaces a todas las 7 páginas.
- `Footer.jsx` — Pie de página global visible en todas las páginas (excepto Home que lo maneja internamente).
  - 3 columnas: Licencia (MIT), Atención al Cliente (email, chat), Enlaces útiles.
  - Adaptado automáticamente a tema claro/oscuro.
  - Posicionado al pie mediante `marginTop: auto`.
- `Sidebar.jsx` — Sidebar (disponible para expandir si es necesario).

**Common** (`common/`):
- `ThemeToggle.jsx` — Botón flotante (esquina superior derecha) para cambiar tema claro/oscuro.
- `Input.jsx` — Input personalizado con label integrado.
- `Button.jsx` — Botón personalizado con estilos adaptativos.

## Patrón de Layout

Se utiliza `LayoutWrapper` en todas las páginas (excepto Home) que:
- Incluye Navbar, ThemeToggle, contenido principal y Footer.
- Asegura footer siempre al pie (diseño Flexbox con `flex: 1`).
- Mantiene consistencia visual en todas las páginas.

## Rutas Disponibles

```
/                    → Home
/login               → Login
/dashboard           → AuditPanel (Dashboard vacío disponible en src/pages/Dashboard.jsx)
/audit-panel         → AuditPanel (idéntico a /dashboard)
/certificates-upload → CertificatesUpload
/tax-management      → TaxManagement
/system-settings     → SystemSettings
```

## Herramientas y Librerías

### Dependencias Principales
- `react` (^19.2.0)
- `react-dom` (^19.2.0)
- `react-router-dom` (^7.10.0)
- `recharts` (para gráficos interactivos en AuditPanel)

### Herramientas de Desarrollo
- `vite` (bundler y dev server)
- `eslint` (linter)
- `@vitejs/plugin-react`
- Babel plugin para React Compiler

## Cómo Ejecutar

```bash
cd FrontEnd
npm install          # Instalar dependencias (incluyendo Recharts)
npm run dev          # Inicia servidor de desarrollo en http://localhost:5173
npm run build        # Build para producción
npm run lint         # Ejecutar ESLint
```

## Sistema de Temas

- Toggle en esquina superior derecha.
- Preferencia guardada en `localStorage` bajo clave `ev3pi-theme`.
- Colores adaptables: fondos, textos, cards, según tema (claro/oscuro).

## Funcionalidades Listas para Backend

1. **AuditPanel** — Estructura lista para conectar API de auditoría:
   - Filtrado por período.
   - Búsqueda dinámmica.
   - Paginación.
   - Gráficos actualizables con datos reales.

2. **Dashboard** — Página base vacía para contenido personalizado desde backend.

3. **CertificatesUpload** — Interfaz para recibir y procesar certificados desde backend.

4. **TaxManagement** — Estructura para mostrar datos tributarios desde backend.

## Estructura de Carpetas

```
FrontEnd/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AuditPanel.jsx
│   │   ├── CertificatesUpload.jsx
│   │   ├── TaxManagement.jsx
│   │   └── SystemSettings.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── common/
│   │       ├── ThemeToggle.jsx
│   │       ├── Input.jsx
│   │       └── Button.jsx
│   ├── hooks/
│   │   └── useForm.js
│   ├── App.jsx
│   ├── router.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## Notas Importantes

- **Desarrollo en `FrontEnd/src/pages/`**: Todas las páginas se encuentran en esta carpeta (regla establecida).
- **Carpeta `Prototipes/`**: Eliminada del proyecto (ya está en `.gitignore`).
- **Home.jsx**: Maneja su propio layout (no usa LayoutWrapper). Incluye Navbar, ThemeToggle y Footer internamente.
- **AuditPanel**:
  - Tabla de eventos inicia vacía — se pobla desde API.
  - Gráficos usan `recharts` y son completamente responsivos.
  - Filtrado y búsqueda listos para conectar backend.
- **Modo oscuro**:
  - Sistema de temas aplicado globalmente a través de `ThemeContext` en `App.jsx`.
  - Preferencia guardada en `localStorage` bajo clave `ev3pi-theme`.
  - Todas las páginas y componentes responden automáticamente.
- **3 cajas en Home**: Estructura lista para agregar iconos/imágenes/contenido futuro.
- **Branding**: Proyecto renombrado a "Nuam" en Home.jsx (título y secciones).

