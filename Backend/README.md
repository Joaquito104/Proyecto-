1. Arquitectura General Implementada

Se desarrolló un sistema web completo con arquitectura Frontend + Backend + Base de Datos

El proyecto se compone de:

Backend: Django + Django REST Framework

Frontend: React.js con rutas protegidas

Base de Datos: SQLite (incluye migraciones y modelos)

2. Funcionalidades Implementadas (Resumen General)
2.1. Sistema de Autenticación con JWT

Se implementó inicio de sesión profesional usando JSON Web Tokens.
Incluye:

Generación de tokens (access y refresh)

Validación automática de sesión

Peticiones protegidas a la API

Logout seguro

2.2. Sistema de Roles de Usuario (RBAC)

Se creó un modelo adicional llamado PerfilUsuario que se asocia directamente a cada usuario del sistema.

Los roles implementados son:

TI (Administrador del sistema)

Analista

Auditor

Corredor

Cada uno tiene permisos diferentes sobre las rutas y las funcionalidades.

2.3. CRUD completo del módulo "Registros"

Se desarrolló un módulo de gestión de registros que incluye:

Crear registros

Listar registros

Editar registros

Eliminar registros

Filtrado automático según el rol del usuario

Ejemplo:

El Corredor solo ve sus registros.

TI, Analista y Auditor ven todos los registros.

2.4. Vistas protegidas según rol

El Frontend usa un componente ProtectedRoute que permite controlar el acceso visual a cada opción del menú.

Por ejemplo:

/system-settings → solo TI

/audit-panel → Auditor y TI

/tax-management → Analista, Auditor y TI

/registros → todos los roles, pero con filtros

Si un usuario intenta entrar a una ruta no autorizada:

→ Es redirigido automáticamente a la página “No Autorizado”.

2.5. Página de Inicio de Sesión moderna y funcional

La página de login:

Se conecta al backend.

Valida credenciales.

Guarda token y datos en el contexto global.

Redirige automáticamente según el rol.

Muestra mensajes de error amigables.

2.6. Barra de navegación con control de acceso

El menú muestra u oculta opciones dependiendo del rol del usuario.

Ejemplo:

Un corredor no ve “Ajustes del Sistema”.

Un analista sí ve “Gestión Tributaria”.

Todos ven sus opciones correspondientes.

2.7. Contexto global de autenticación

El Frontend tiene un AuthContext que guarda:

Token

Usuario

Rol

Estado de carga

Esto permite que toda la aplicación use la sesión de forma transparente.

2.8. Panel de administración Django

El backend incluye un Admin Panel profesional, donde se puede:

Crear usuarios

Asignar roles

Ver datos en la base

Gestionar registros

Este panel fue configurado correctamente.

3. Bases de Datos – Modelos Implementados
Modelo Registro

Incluye:

Título

Descripción

Fecha

Usuario (FK → User)

Modelo PerfilUsuario

Incluye:

Usuario (OneToOneField)

Rol

El sistema usa correctamente relaciones 1:N y 1:1.

4. ¿Cómo funciona la lógica del sistema? 
4.1. Autenticación

El usuario envía username y password.

El backend valida y devuelve JWT.

El frontend guarda el token.

Todas las peticiones posteriores usan Authorization: Bearer <token>.

4.2. Validación de roles

Cada ruta tiene un arreglo de roles permitidos:

<ProtectedRoute roles={["TI", "AUDITOR"]}>


Si el usuario no pertenece a uno:

→ Se bloquea el acceso.

4.3. CRUD de registros

El backend controla lo que cada usuario puede ver.

Ejemplo:

if rol == "CORREDOR":
    return Registro.objects.filter(usuario=user)


Esto garantiza seguridad desde el servidor.

5. ¿Cómo ejecutar el sistema? (Guía para cualquier persona)
5.1. Ejecutar el Backend (Django)
1) Instalar dependencias
cd Backend
pip install -r requirements.txt

2) Ejecutar migraciones
python manage.py migrate

3) Iniciar servidor
python manage.py runserver

5.2. Ejecutar el Frontend (React)
1) Instalar dependencias
cd frontend
npm install

2) Ejecutar el servidor web
npm run dev

3) Abrir en navegador
http://localhost:5173/

6. ¿Cómo se usa la aplicación? (Modo usuario)
1) Entrar a la URL del frontend

http://localhost:5173

2) Iniciar sesión

En /iniciar-sesion con un usuario creado en Django Admin.

3) El sistema redirige automáticamente según el rol

Ejemplo:

TI → Ajustes del Sistema

Analista → Gestión Tributaria

Auditor → Panel de Auditoría

Corredor → Registros

4) Usar el módulo de "Registros"

Crear registros

Editar

Eliminar

Ver solo lo permitido según el rol
