# 🚀 DevStudio HR Platform & Control de Proyectos

Plataforma Web Fullstack enterprise de **Registro de Personal, Control de Proyectos de Software y Gestión Comercial de Clientes**.

Diseñada con una arquitectura de **API REST decoupled en Laravel 12** y una **Single Page Application (SPA) en React con Vite**, estilizada mediante CSS Vanilla moderno con estética *Dark Mode*, *Glassmorphic Effects* e *Internacionalización (i18n)* completa.

---

## 🛠️ Tecnologías del Proyecto

### Backend
- **Framework**: Laravel 12.x
- **Autenticación**: Laravel Sanctum (Tokens Bearer)
- **Base de Datos**: MySQL (XAMPP / MariaDB)
- **ORM**: Eloquent con Seeders y Migraciones relacionales
- **Seguridad**: Middleware RBAC (`RoleMiddleware`), CORS restringido

### Frontend
- **Framework**: React 18.x + Vite
- **Estilos**: Vanilla CSS con variables CSS3, animaciones y diseño adaptable
- **Estado Global**: React Context (`ToastContext` para notificaciones, `LanguageContext` para i18n)
- **Iconografía**: SVG Inline vectorial

---

## 🌟 Módulos y Funcionalidades Clave

1. **🔐 Autenticación & Control de Acceso basado en Roles (RBAC)**:
   - Roles integrados: `admin` (CEO/Director), `lead` (Líder Técnico), `developer` (Desarrollador), `qa` (Especialista QA), `hr` (Recursos Humanos), `sales` (Ejecutivo de Ventas).
   - Bloqueo automático de cuentas tras 3 intentos fallidos de contraseña y desbloqueo seguro desde la vista del Manager.
   - Cambio de contraseña seguro con validación de fortaleza y código de verificación.

2. **📊 Panel del Manager (Supervisión y Asignación)**:
   - Asignación rápida de tareas en tiempo real a programadores.
   - Lista de desarrolladores a cargo con controles de seguridad (bloqueo/desbloqueo).

3. **📌 Tablero de Tareas Kanban (Developer Workspace)**:
   - Columnas interactivos: *Pendiente (Backlog)*, *En Progreso*, *En Revisión QA*, *Completado*.
   - Filtros dinámicos por usuario asignado.

4. **💼 Control de Proyectos & Clientes (CRM / ERP)**:
   - Registro de proyectos técnicos con presupuesto, stack tecnológico, líder a cargo y porcentaje de avance.
   - Expedientes comerciales de clientes protegidos por modal de seguridad de clave de administración.

5. **📖 Catálogo de Plantillas & Soluciones (Showcase)**:
   - Publicación de modelos de software con su propuesta de valor, tecnologías y tiempo estimado.
   - Generación de proyectos automáticos vinculados a clientes desde plantillas comercializables.

6. **👥 Organigrama & Base de Datos de Personal**:
   - Visualización jerárquica corporativa.
   - Directorio de empleados con salarios confidenciales (restringidos por rol admin).

7. **🌐 Internacionalización Bilingüe (Español / Inglés)**:
   - Cambio de idioma dinámico instantáneo sin recargar la página.

8. **🔔 Sistema Toast de Notificaciones**:
   - Notificaciones flotantes tipo *Toast* para feedback en tiempo real.

---

## ⚙️ Requisitos del Sistema

- **PHP**: >= 8.2
- **Composer**: >= 2.x
- **Node.js**: >= 18.x
- **MySQL / MariaDB** (XAMPP preconfigurado)

---

## 🚀 Guía de Instalación y Configuración

### 1. Clonar o Abrir el Repositorio
```bash
cd "c:/xampp/htdocs/Registro de Personal"
```

### 2. Configurar el Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```
Asegúrate de que la base de datos `registro_personal` existe en tu MySQL (XAMPP). Luego ejecuta:
```bash
php artisan migrate:fresh --seed
php artisan serve
```
El servidor backend iniciará en: `http://127.0.0.1:8000`.

### 3. Configurar el Frontend (React + Vite)
En otra consola terminal:
```bash
cd frontend
npm install
npm run dev
```
La aplicación frontend estará disponible en: `http://localhost:5173`.

---

## 🔑 Credenciales de Prueba (Demo Users)

Todas las cuentas iniciales cuentan con la contraseña: **`password123`**

| Rol | Correo Electrónico | Puesto |
|---|---|---|
| **Admin (CEO)** | `admin@devstudio.com` | Director General |
| **Tech Lead** | `lead@devstudio.com` | Líder Técnico |
| **Developer** | `dev@devstudio.com` | Desarrolladora Senior |
| **QA Specialist** | `qa@devstudio.com` | QA Automation Lead |
| **HR Manager** | `hr@devstudio.com` | Human Resources |
| **Sales Executive** | `sales@devstudio.com` | BDM / Ventas |

---

## 📡 Endpoints Principales de la API REST

- `POST /api/login` - Autenticación y obtención de token Sanctum.
- `GET /api/me` - Usuario autenticado actual.
- `POST /api/logout` - Revocación de token.
- `GET|POST /api/users` - Lista y registro de personal.
- `PUT|DELETE /api/users/{id}` - Edición y eliminación de empleados.
- `POST /api/users/{id}/unlock` - Desbloqueo de cuentas.
- `GET|POST /api/projects` - Lista y creación de proyectos.
- `PUT|DELETE /api/projects/{id}` - Actualización y eliminación de proyectos.
- `GET|POST /api/tasks` - Lista y asignación de tareas.
- `PUT|PATCH|DELETE /api/tasks/{id}` - Edición, cambio de estado y eliminación de tareas.
- `GET|POST /api/clients` - Gestión de cartera de clientes.
- `GET|POST /api/templates` - Catálogo de plantillas comercializables.
