# 🖥️ DOCUMENTACIÓN DEL BACKEND — Registro de Personal (DevStudio HR)
## Guía Técnica Completa para Exposición

---

## 📌 1. ¿QUÉ TECNOLOGÍAS USA EL BACKEND?

| Tecnología | Versión | Función |
|---|---|---|
| **Laravel** | 11.x | Framework PHP principal (patrón MVC) |
| **PHP** | 8.2+ | Lenguaje del servidor |
| **MySQL** | 8.x | Base de datos relacional |
| **XAMPP** | — | Servidor local (Apache + MySQL + PHP) |
| **Laravel Sanctum** | 4.x | Autenticación por tokens API |
| **Composer** | 2.x | Gestor de dependencias PHP |

**¿Qué es MVC?**  
El patrón **Modelo-Vista-Controlador** separa la aplicación en 3 capas:
- **Modelo (Model):** Representa las tablas de la base de datos y sus relaciones.
- **Vista (View):** En este caso NO se usa la vista de Laravel; el frontend React es la "vista".
- **Controlador (Controller):** Recibe las peticiones HTTP, procesa la lógica y devuelve respuestas JSON.

---

## 📁 2. ESTRUCTURA DE CARPETAS DEL BACKEND

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/                    ← 🎯 CONTROLADORES PRINCIPALES
│   │   │   │   ├── AuthController.php      (Login, Register, Password Reset)
│   │   │   │   ├── UserController.php      (CRUD de empleados + organigrama)
│   │   │   │   ├── ProjectController.php   (CRUD de proyectos)
│   │   │   │   ├── TaskController.php      (CRUD de tareas)
│   │   │   │   ├── ClientController.php    (CRUD de clientes)
│   │   │   │   └── TemplateController.php  (CRUD de plantillas)
│   │   │   └── TimeEntryController.php     (Log de horas)
│   │   └── Middleware/
│   │       └── RoleMiddleware.php      ← 🔒 Verifica el rol del usuario
│   ├── Models/                         ← 📦 MODELOS (tablas de la BD)
│   │   ├── User.php
│   │   ├── Project.php
│   │   ├── Task.php
│   │   ├── Client.php
│   │   ├── Template.php
│   │   └── TimeEntry.php
│   └── Providers/
├── config/
│   ├── cors.php                        ← 🌐 Permisos de comunicación front↔back
│   ├── database.php                    ← Configuración de la BD
│   └── sanctum.php                     ← Configuración de autenticación
├── database/
│   ├── migrations/                     ← 📊 Esquema de tablas
│   │   ├── create_users_table.php
│   │   ├── create_projects_table.php
│   │   ├── create_tasks_table.php
│   │   ├── create_clients_table.php
│   │   ├── create_templates_table.php
│   │   └── ... (13 migraciones en total)
│   └── seeders/
│       └── DatabaseSeeder.php          ← 🌱 Datos iniciales de prueba
├── routes/
│   └── api.php                         ← 🛣️ TODAS LAS RUTAS DE LA API
├── .env                                ← ⚙️ Variables de entorno (BD, keys)
└── artisan                             ← Herramienta CLI de Laravel
```

---

## 🛣️ 3. RUTAS DE LA API (archivo: `routes/api.php`)

Este archivo es el **mapa central** de toda la API. Define qué URLs existen y qué controlador las atiende.

### Rutas Públicas (sin autenticación):
| Método | URL | Controlador | Descripción |
|---|---|---|---|
| POST | `/api/login` | AuthController@login | Iniciar sesión |
| POST | `/api/register` | AuthController@register | Crear cuenta nueva |
| POST | `/api/send-password-reset-code` | AuthController@sendPasswordResetCode | Enviar código al email |
| POST | `/api/reset-password` | AuthController@resetPassword | Cambiar contraseña |
| GET | `/api/prueba` | (closure) | Test de que la API funciona |

### Rutas Protegidas (requieren token Sanctum):
| Método | URL | Controlador | Descripción |
|---|---|---|---|
| POST | `/api/logout` | AuthController@logout | Cerrar sesión |
| GET | `/api/me` | AuthController@me | Obtener usuario autenticado |
| POST | `/api/users/{id}/unlock` | AuthController@unlock | Desbloquear cuenta (solo admin/lead/hr) |
| POST | `/api/send-password-change-code` | AuthController@sendPasswordChangeCode | Solicitar código para cambiar password |
| POST | `/api/change-password` | AuthController@changePassword | Cambiar password con código |
| **CRUD Users** | | | |
| GET | `/api/users` | UserController@index | Listar empleados |
| POST | `/api/users` | UserController@store | Crear empleado |
| GET | `/api/users/{id}` | UserController@show | Ver detalle de empleado |
| PUT | `/api/users/{id}` | UserController@update | Editar empleado |
| DELETE | `/api/users/{id}` | UserController@destroy | Eliminar empleado |
| GET | `/api/organigrama` | UserController@organigrama | Estructura jerárquica |
| **CRUD Projects** | | | |
| GET | `/api/projects` | ProjectController@index | Listar proyectos |
| POST | `/api/projects` | ProjectController@store | Crear proyecto |
| PUT | `/api/projects/{id}` | ProjectController@update | Editar proyecto |
| DELETE | `/api/projects/{id}` | ProjectController@destroy | Eliminar proyecto |
| **CRUD Tasks** | | | |
| GET | `/api/tasks` | TaskController@index | Listar tareas |
| POST | `/api/tasks` | TaskController@store | Crear tarea |
| PUT | `/api/tasks/{id}` | TaskController@update | Editar tarea |
| DELETE | `/api/tasks/{id}` | TaskController@destroy | Eliminar tarea |
| PATCH | `/api/tasks/{id}/status` | TaskController@updateStatus | Cambiar estado de tarea |
| **CRUD Clients** | | | |
| GET | `/api/clients` | ClientController@index | Listar clientes |
| POST | `/api/clients` | ClientController@store | Crear cliente |
| PUT | `/api/clients/{id}` | ClientController@update | Editar cliente |
| DELETE | `/api/clients/{id}` | ClientController@destroy | Eliminar cliente |
| **CRUD Templates** | | | |
| GET | `/api/templates` | TemplateController@index | Listar plantillas activas |
| POST | `/api/templates` | TemplateController@store | Crear plantilla |
| PUT | `/api/templates/{id}` | TemplateController@update | Editar plantilla |
| DELETE | `/api/templates/{id}` | TemplateController@destroy | Eliminar plantilla |

> **Nota:** `apiResource('users', UserController::class)` genera automáticamente las 5 rutas CRUD (index, store, show, update, destroy).

---

## 📦 4. MODELOS (Las tablas de la BD en código)

Cada modelo representa una tabla en MySQL y define sus campos y relaciones.

### 4.1 User.php — Empleados del sistema
**Campos principales:** name, email, password, position, department, role, phone, status, hire_date, skills (JSON), avatar, bio, failed_attempts, is_locked, locked_until

**Relaciones:**
- `assignedTasks()` → hasMany(Task) — Tareas asignadas al usuario
- `createdTasks()` → hasMany(Task) — Tareas creadas por el usuario
- `ledProjects()` → hasMany(Project) — Proyectos que lidera

**Métodos de seguridad:**
- `recordFailedLogin()` → Suma 1 intento fallido; si llega a 3, bloquea la cuenta 15 min
- `resetLoginAttempts()` → Resetea los intentos después de un login exitoso
- `isAccountLocked()` → Verifica si la cuenta está bloqueada
- `unlockAccount()` → Desbloquea la cuenta manualmente

### 4.2 Project.php — Proyectos de software
**Campos:** name, title_es, title_en, description, category, status, tech_stack (JSON), lead_id, client_id, project_type, budget, currency, billing_status, progress, deadline

**Relaciones:**
- `lead()` → belongsTo(User) — Líder del proyecto
- `client()` → belongsTo(Client) — Cliente que contrató el proyecto
- `tasks()` → hasMany(Task) — Tareas del proyecto

### 4.3 Task.php — Tareas asignadas
**Campos:** project_id, assigned_to, created_by, title, description, priority (Low/Medium/High/Critical), status (Pending/In Progress/In Review/Completed), due_date

**Relaciones:**
- `project()` → belongsTo(Project)
- `assignee()` → belongsTo(User) — A quién se le asignó
- `creator()` → belongsTo(User) — Quién la creó

### 4.4 Client.php — Clientes corporativos
**Campos:** name, contact_person, email, phone, address, city, company_type, tax_id, status, notes

**Relaciones:**
- `projects()` → hasMany(Project) — Proyectos contratados

### 4.5 Template.php — Plantillas de servicios
**Campos:** title, category, description, features (JSON), tech_stack (JSON), estimated_delivery, image_url, demo_url, suggested_price, status

---

## 🔒 5. AUTENTICACIÓN Y SEGURIDAD

### ¿Cómo funciona el login?
1. El usuario envía email + password a `POST /api/login`
2. El AuthController busca el usuario en la BD
3. Si no existe → error 404
4. Si la cuenta está bloqueada → error 423
5. Si la contraseña es incorrecta → suma 1 intento; si llega a 3, bloquea la cuenta
6. Si es correcta → resetea intentos, genera un token Sanctum y lo devuelve

### Token Sanctum
- Al hacer login exitoso, se genera un token Bearer
- El frontend guarda ese token en `localStorage`
- Cada petición siguiente envía el header: `Authorization: Bearer {token}`
- Las rutas protegidas con `middleware('auth:sanctum')` verifican este token

### Sistema de Bloqueo de Cuentas
- **3 intentos fallidos** → la cuenta se bloquea automáticamente por 15 minutos
- Solo un usuario con rol `admin`, `lead` o `hr` puede desbloquearla manualmente
- Endpoint: `POST /api/users/{id}/unlock` (protegido con middleware `role:admin,lead,hr`)

### Cambio de Contraseña (2 flujos)
1. **Desde la app (logueado):** Solicita código → se envía al email → ingresa código + nueva password
2. **Desde el login (olvidó password):** Ingresa email → recibe código → cambia la password

---

## 🔐 6. MIDDLEWARE DE ROLES (RoleMiddleware.php)

```php
// Verifica que el usuario autenticado tenga el rol requerido
public function handle(Request $request, Closure $next, ...$roles)
{
    if (!in_array($request->user()->role, $roles)) {
        return response()->json(['message' => 'No autorizado'], 403);
    }
    return $next($request);
}
```

Se usa así en las rutas: `->middleware('role:admin,lead,hr')`

### Roles del sistema:
| Rol | Etiqueta | Permisos principales |
|---|---|---|
| `admin` | Director General / CEO | Todo sin restricciones |
| `lead` | Líder Técnico / Manager | Gestión de proyectos, no puede eliminar usuarios |
| `sales` | Ejecutivo de Ventas | Gestión de clientes y proyectos |
| `developer` | Desarrollador | Solo actualizar estado de sus tareas |
| `qa` | QA Automation Lead | Asignar tareas y actualizar estados |
| `hr` | Recursos Humanos | Gestión de personal, desbloqueo de cuentas |

---

## 🌐 7. CORS — Comunicación Frontend ↔ Backend

Archivo: `config/cors.php`
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173'],  // ← URL del frontend Vite
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```
Esto permite que el frontend (puerto 5173) haga peticiones al backend (puerto 8000).

---

## 🌱 8. BASE DE DATOS Y SEEDERS

### Conexión (archivo .env):
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE="Registro de Personal"
DB_USERNAME=root
DB_PASSWORD=
```

### Migraciones (13 archivos):
Las migraciones crean las tablas automáticamente con `php artisan migrate`.

### Seeder (DatabaseSeeder.php):
Crea datos iniciales de prueba:
- **1 Admin:** admin@devstudio.com / admin123
- **3 Clientes:** TechCorp Solutions, Fintech Innovators, Grupo Logístico del Norte
- **2 Proyectos:** Portal de Personal, App de Pagos
- **1 Tarea** de administración
- **3 Plantillas** de servicios (E-Commerce, ERP/CRM, App de Citas)

Comando: `php artisan db:seed`

---

## 🔄 9. FLUJO DE UNA PETICIÓN (Ejemplo: Crear Tarea)

```
1. Frontend llama: POST http://127.0.0.1:8000/api/tasks
   Headers: { Authorization: Bearer abc123, Content-Type: application/json }
   Body: { title: "Implementar Login", assigned_to: 2, priority: "High", ... }

2. Laravel recibe la petición en routes/api.php
   → Route::apiResource('tasks', TaskController::class)
   → Método POST matchea con TaskController@store

3. Middleware auth:sanctum verifica el token Bearer
   → Si es válido, continúa; si no, devuelve 401

4. TaskController@store ejecuta:
   a) Valida los datos con $request->validate(...)
   b) Crea el registro: Task::create($validated)
   c) Carga relaciones: $task->load(['project', 'assignee'])
   d) Devuelve JSON: { message: "Tarea asignada", task: {...} }

5. Frontend recibe el JSON y actualiza el estado de React
```

---

## 📋 10. COMANDOS ESENCIALES DEL BACKEND

```bash
# Iniciar el servidor Laravel
php artisan serve

# Ejecutar migraciones (crear tablas)
php artisan migrate

# Ejecutar seeder (datos de prueba)
php artisan db:seed

# Resetear BD y re-seedear
php artisan migrate:fresh --seed

# Ver todas las rutas registradas
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear
```

---

*Documento generado para exposición del proyecto "Registro de Personal — DevStudio HR"*
*Fecha: Septiembre 2026*
