# 🎨 DOCUMENTACIÓN DEL FRONTEND — Registro de Personal (DevStudio HR)
## Guía Técnica Completa para Exposición

---

## 📌 1. ¿QUÉ TECNOLOGÍAS USA EL FRONTEND?

| Tecnología | Versión | Función |
|---|---|---|
| **React** | 19.x | Librería UI (componentes reactivos) |
| **Vite** | 8.x | Bundler ultrarrápido (reemplaza Webpack) |
| **Vanilla CSS** | — | Estilos personalizados sin frameworks CSS |
| **Recharts** | 3.x | Gráficos y visualizaciones de datos |
| **JavaScript (ES6+)** | — | Lenguaje principal |

**¿Por qué Vite y no Create React App?**
Vite es mucho más rápido para desarrollo. Hot Module Replacement (HMR) actualiza la página al instante cuando guardas un archivo.

---

## 📁 2. ESTRUCTURA DE CARPETAS DEL FRONTEND

```
frontend/
├── index.html                 ← 📄 HTML raíz (punto de entrada)
├── vite.config.js             ← ⚙️ Configuración de Vite
├── package.json               ← 📦 Dependencias (react, recharts)
├── .env                       ← Variables de entorno (VITE_API_URL)
└── src/
    ├── main.jsx               ← 🚀 PUNTO DE ENTRADA de React
    ├── App.jsx                ← 🧠 COMPONENTE PRINCIPAL (cerebro de la app)
    ├── App.css                ← 🎨 Estilos de la aplicación
    ├── index.css              ← 🎨 Estilos globales y variables CSS
    ├── services/
    │   └── api.js             ← 🌐 CAPA DE COMUNICACIÓN CON EL BACKEND
    ├── context/
    │   ├── LanguageContext.jsx ← 🌍 Contexto de idioma (ES/EN)
    │   └── ToastContext.jsx   ← 🔔 Contexto de notificaciones toast
    ├── i18n/
    │   └── translations.js   ← 📝 Diccionario de traducciones ES/EN
    └── components/            ← 🧩 TODOS LOS COMPONENTES VISUALES
        ├── LoginView.jsx          (Pantalla de login)
        ├── Navbar.jsx             (Barra de navegación + sidebar)
        ├── ManagerDashboard.jsx   (Panel del administrador)
        ├── DeveloperWorkspace.jsx (Espacio del desarrollador)
        ├── PersonnelView.jsx      (Base de datos de personal)
        ├── OrganigramaView.jsx    (Organigrama jerárquico)
        ├── ProjectsView.jsx       (Lista de proyectos)
        ├── TasksView.jsx          (Lista de tareas)
        ├── ClientsView.jsx        (CRM de clientes)
        ├── TemplatesView.jsx      (Catálogo de plantillas)
        ├── RolesMatrixView.jsx    (Matriz de roles y permisos)
        ├── DashboardCharts.jsx    (Gráficos del dashboard)
        ├── LoadingSpinner.jsx     (Indicador de carga)
        ├── ConfirmModal.jsx       (Diálogo de confirmación)
        ├── EmployeeModal.jsx      (Modal para crear empleado)
        ├── ProjectModal.jsx       (Modal para crear/editar proyecto)
        ├── TaskModal.jsx          (Modal para crear/editar tarea)
        ├── ClientModal.jsx        (Modal para crear/editar cliente)
        ├── ClientAuthModal.jsx    (Modal de autenticación para clientes)
        ├── ClientDetailModal.jsx  (Modal detalle de cliente)
        ├── TemplateModal.jsx      (Modal para crear/editar plantilla)
        ├── TemplateDetailModal.jsx(Modal detalle de plantilla)
        └── ChangePasswordModal.jsx(Modal de cambio de contraseña)
```

---

## 🚀 3. PUNTO DE ENTRADA (main.jsx)

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>        ← Envuelve la app con notificaciones
      <LanguageProvider>   ← Envuelve la app con idioma ES/EN
        <App />            ← Componente principal
      </LanguageProvider>
    </ToastProvider>
  </StrictMode>
);
```

**¿Qué son los Providers?**
Son componentes que envuelven toda la aplicación y comparten datos globales usando el Context API de React. Cualquier componente hijo puede acceder a estos datos sin pasar props manualmente.

---

## 🧠 4. App.jsx — EL CEREBRO DE LA APLICACIÓN

Este es el archivo más importante. Controla:

### 4.1 Estado Principal (useState)
```
currentUser      → Usuario logueado (null si no hay sesión)
activeTab        → Vista activa ('manager', 'personnel', 'projects', etc.)
isLoadingData    → Indicador de carga
users            → Lista de empleados
clients          → Lista de clientes
templates        → Lista de plantillas
projects         → Lista de proyectos
tasks            → Lista de tareas
showEmployeeModal, showProjectModal, etc. → Controlan qué modal está abierto
```

### 4.2 Flujo de Inicio
```
App se monta → useEffect ejecuta:
  1. loadAllData()  → Llama a la API para obtener users, clients, templates, projects, tasks
  2. checkSession() → Si hay token en localStorage, valida la sesión con GET /api/me
```

### 4.3 Renderizado Condicional
```
¿Hay currentUser?
  ├── NO → Muestra <LoginView />
  └── SÍ → Muestra <Navbar /> + la vista según activeTab:
      ├── 'manager'    → <ManagerDashboard />
      ├── 'developer'  → <DeveloperWorkspace />
      ├── 'personnel'  → <PersonnelView />
      ├── 'organigrama'→ <OrganigramaView />
      ├── 'templates'  → <TemplatesView />
      ├── 'clients'    → <ClientsView />
      ├── 'projects'   → <ProjectsView />
      ├── 'tasks'      → <TasksView />
      └── 'roles'      → <RolesMatrixView />
```

### 4.4 Handlers (Funciones de Manejo)
Cada acción CRUD tiene su función en App.jsx que:
1. Llama a la API (api.js)
2. Actualiza el estado local de React
3. Muestra un toast de éxito/error

Ejemplos:
- `handleSaveUser(data)` → Llama `createUser(data)` → Agrega al array `users`
- `handleDeleteProject(id)` → Muestra confirmación → Llama `deleteProject(id)` → Filtra del array
- `handleUpdateTaskStatus(id, status)` → Llama `updateTaskStatus(id, status)` → Actualiza en el array

---

## 🌐 5. CAPA API (services/api.js) — CÓMO SE CONSUME EL BACKEND

### 5.1 Configuración Base
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
```
Lee la URL del backend desde el archivo `.env` del frontend, o usa el valor por defecto.

### 5.2 Función Central: `request()`
TODAS las llamadas pasan por esta función que:
```javascript
async function request(path, options = {}) {
  // 1. Obtiene el token del localStorage
  const token = getToken();
  
  // 2. Prepara los headers (JSON + Bearer token)
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`   // ← Autenticación
  };
  
  // 3. Hace el fetch a la API
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  
  // 4. Si hay error 401 (token inválido), limpia la sesión
  // 5. Si hay error 422 (validación), muestra los errores
  // 6. Si hay error 403 (sin permiso), muestra mensaje
  
  return data; // Devuelve el JSON de respuesta
}
```

### 5.3 Funciones Exportadas
Cada función es un "atajo" para llamar a la API:

**Autenticación:**
| Función | Método | Endpoint |
|---|---|---|
| `login(email, password)` | POST | `/login` |
| `logout()` | — | Limpia localStorage |
| `getMe()` | GET | `/me` |
| `registerUser(data)` | POST | `/register` |

**Empleados (Users):**
| Función | Método | Endpoint |
|---|---|---|
| `getUsers(params)` | GET | `/users` |
| `getUserDetail(id)` | GET | `/users/{id}` |
| `createUser(data)` | POST | `/users` |
| `updateUser(id, data)` | PUT | `/users/{id}` |
| `deleteUser(id)` | DELETE | `/users/{id}` |
| `unlockUser(id)` | POST | `/users/{id}/unlock` |

**Proyectos, Tareas, Clientes, Templates:**
Misma estructura CRUD: `getX()`, `createX(data)`, `updateX(id, data)`, `deleteX(id)`

### 5.4 Permisos en el Frontend: `getPermissionsForRole(role)`
Esta función define qué puede hacer cada rol SIN depender del backend:
```javascript
case 'admin':    // Todo habilitado
case 'lead':     // No puede eliminar usuarios
case 'sales':    // Solo clientes y proyectos
case 'developer':// Solo actualizar estado de tareas
case 'qa':       // Asignar tareas y actualizar estados
case 'hr':       // Solo gestión de personal
```
Se usa para mostrar/ocultar botones y secciones en la interfaz.

---

## 🧩 6. COMPONENTES Y SUS PROPS

### 6.1 Componentes de VISTA (páginas completas)

**LoginView**
```
Props recibidas:
  - onLoginSuccess: función → Se ejecuta al hacer login exitoso
Funcionalidades:
  - Formulario de login (email + password)
  - Formulario de reset de contraseña (con código por email)
  - Medidor de fortaleza de contraseña
  - Alerta de cuenta bloqueada
```

**Navbar**
```
Props recibidas:
  - currentUser: objeto → Usuario logueado
  - activeTab: string → Vista actual
  - setActiveTab: función → Cambiar de vista
  - onLogout: función → Cerrar sesión
  - onOpenChangePassword: función → Abrir modal de contraseña
Funcionalidades:
  - Barra superior con marca, usuario, botones
  - Sidebar deslizable con menú categorizado
  - Switch de idioma ES/EN
  - Renderizado condicional de menú según el rol
```

**ManagerDashboard**
```
Props recibidas:
  - users: array → Lista de empleados
  - projects: array → Lista de proyectos
  - tasks: array → Lista de tareas
  - currentUser: objeto → Manager logueado
  - onUnlockUser: función → Desbloquear cuenta
  - onAssignTask: función → Asignar tarea rápida
Funcionalidades:
  - 4 tarjetas KPI (Total Tareas, Completadas, Proyectos Activos, Tareas Críticas)
  - Gráficos con Recharts (DashboardCharts)
  - Lista del equipo con opción de desbloqueo
  - Formulario de asignación rápida de tareas
  - Tabla de estado de todas las tareas
```

**DeveloperWorkspace**
```
Props recibidas:
  - tasks: array → Tareas del sistema
  - currentUser: objeto → Desarrollador logueado
  - onUpdateTaskStatus: función → Cambiar estado de tarea
Funcionalidades:
  - Muestra solo las tareas asignadas al developer actual
  - Permite cambiar el estado (Pending → In Progress → Completed)
```

**PersonnelView**
```
Props recibidas:
  - users: array → Lista de empleados
  - currentUser: objeto → Usuario logueado
  - permissions: objeto → Permisos del rol
  - onOpenAddModal: función → Abrir modal de nuevo empleado
  - onDeleteUser: función → Eliminar empleado
  - onUpdateUser: función → Editar empleado
```

**ProjectsView, TasksView, ClientsView, TemplatesView**
```
Mismo patrón: reciben los datos (array), permisos, y funciones para
abrir modales de crear/editar y funciones de eliminar.
```

**OrganigramaView**
```
Props: users (array)
Genera automáticamente un organigrama visual jerárquico agrupando
a los usuarios por su rol (dirección → líderes → desarrollo → QA → HR)
```

### 6.2 Componentes MODAL (ventanas flotantes)

| Modal | Props principales | Función |
|---|---|---|
| EmployeeModal | onClose, onSave | Crear nuevo empleado |
| ProjectModal | users, clients, editingProject, onClose, onSave | Crear/editar proyecto |
| TaskModal | users, projects, editingTask, onClose, onSave | Crear/editar tarea |
| ClientModal | client, onClose, onSave | Crear/editar cliente |
| TemplateModal | template, onClose, onSave | Crear/editar plantilla |
| TemplateDetailModal | template, clients, onClose, onConfirmCreateProject | Ver plantilla y crear proyecto desde ella |
| ClientAuthModal | currentUser, onClose, onAuthenticated | Autenticación extra para ver clientes |
| ChangePasswordModal | currentUser, onClose, onRequestCode, onSave | Cambio de contraseña seguro |
| ConfirmModal | title, message, onConfirm, onCancel | Confirmación antes de eliminar |

---

## 🌍 7. SISTEMA DE INTERNACIONALIZACIÓN (i18n)

### LanguageContext.jsx
Provee a toda la app:
- `language` → Estado actual ('es' o 'en')
- `toggleLanguage()` → Alterna entre ES y EN
- `t(key)` → Traduce una clave, ej: `t('nav.projects')` → "Proyectos" o "Projects"
- `translateDept(name)` → Traduce departamentos
- `translatePos(name)` → Traduce puestos de trabajo
- Persiste la selección en `localStorage`

### translations.js
Diccionario con ~500+ claves organizadas por sección:
```javascript
{
  es: {
    nav: { projects: 'Proyectos', tasks: 'Tareas', ... },
    manager: { title: 'Panel del Manager', ... },
    departments: { 'Ingeniería de Software': 'Ingeniería de Software', ... },
    positions: { 'Software Engineer': 'Ingeniero de Software', ... },
  },
  en: {
    nav: { projects: 'Projects', tasks: 'Tasks', ... },
    ...
  }
}
```

---

## 🔔 8. SISTEMA DE NOTIFICACIONES (ToastContext.jsx)

```javascript
// Cualquier componente puede mostrar notificaciones:
const { showToast } = useToast();
showToast('Proyecto creado exitosamente', 'success');  // verde
showToast('Error al guardar', 'error');                 // rojo
showToast('Tarea eliminada', 'info');                   // azul
showToast('Atención requerida', 'warning');             // amarillo
```
Las notificaciones aparecen en la esquina inferior derecha y desaparecen automáticamente después de 4 segundos.

---

## 🔄 9. FLUJO COMPLETO: DEL CLICK AL DATO

**Ejemplo: El manager crea un nuevo proyecto**

```
1. 👆 El usuario hace click en "Nuevo Proyecto" en ProjectsView

2. 📂 ProjectsView ejecuta: onOpenAddProject()
   → En App.jsx esto hace: setShowProjectModal(true)

3. 🪟 Se renderiza <ProjectModal /> con props:
   - users (para seleccionar líder)
   - clients (para seleccionar cliente)
   - editingProject=null (modo creación)

4. ✍️ El usuario llena el formulario y da click en "Guardar"

5. 📤 ProjectModal ejecuta: onSave(formData)
   → En App.jsx esto llama a handleSaveProject(formData)

6. 🌐 handleSaveProject llama a la API:
   const result = await createProject(formData)
   → api.js hace: fetch('http://127.0.0.1:8000/api/projects', {
       method: 'POST',
       headers: { Authorization: 'Bearer token123', ... },
       body: JSON.stringify(formData)
     })

7. 🖥️ Laravel recibe en ProjectController@store:
   → Valida datos → Project::create($validated)
   → Devuelve JSON: { project: { id: 5, name: "..." } }

8. 📥 El frontend recibe la respuesta:
   → Agrega el proyecto al array: setProjects([created, ...projects])
   → Cierra el modal: setShowProjectModal(false)
   → Muestra toast: showToast('Proyecto creado exitosamente', 'success')

9. ✅ React re-renderiza la lista de proyectos con el nuevo dato
```

---

## 🎨 10. DISEÑO VISUAL

### Variables CSS (index.css)
```css
--primary: #3b82f6;        /* Azul principal */
--cyan: #06b6d4;           /* Cian para acentos */
--emerald: #10b981;        /* Verde para éxito */
--rose: #f43f5e;           /* Rojo para errores */
--purple: #8b5cf6;         /* Púrpura para badges */
--bg-dark: #0f172a;        /* Fondo oscuro principal */
```

### Clases Clave
- `.glass-card` → Tarjetas con efecto glassmorphism (transparencia + blur)
- `.animate-fade-in` → Animación de entrada suave
- `.btn-primary`, `.btn-secondary`, `.btn-danger` → Botones estilizados
- `.badge-active`, `.badge-lead`, `.badge-developer` → Insignias de estado/rol
- `.search-input`, `.filter-select` → Inputs y selects estilizados

---

## 📋 11. COMANDOS ESENCIALES DEL FRONTEND

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 5173)
npm run dev

# Construir para producción
npm run build

# Vista previa del build
npm run preview
```

---

## 🗺️ 12. DIAGRAMA RESUMEN DE LA ARQUITECTURA

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │              FRONTEND (React + Vite)              │  │
│  │                 localhost:5173                     │  │
│  │                                                   │  │
│  │  main.jsx                                         │  │
│  │    └─ ToastProvider → LanguageProvider → App.jsx  │  │
│  │         └─ Navbar + Vista Activa + Modales        │  │
│  │                                                   │  │
│  │  api.js ←→ fetch() con Bearer Token               │  │
│  └──────────────────┬────────────────────────────────┘  │
│                     │ HTTP (JSON)                       │
│                     ▼                                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │             BACKEND (Laravel API)                 │  │
│  │              localhost:8000                        │  │
│  │                                                   │  │
│  │  routes/api.php → Controllers → Models → MySQL    │  │
│  │                                                   │  │
│  │  Middleware: auth:sanctum + role:admin,lead,hr     │  │
│  └──────────────────┬────────────────────────────────┘  │
│                     │ SQL Queries                       │
│                     ▼                                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │           BASE DE DATOS (MySQL)                   │  │
│  │        "Registro de Personal"                     │  │
│  │                                                   │  │
│  │  Tablas: users, projects, tasks, clients,         │  │
│  │          templates, time_entries,                  │  │
│  │          personal_access_tokens, sessions          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

*Documento generado para exposición del proyecto "Registro de Personal — DevStudio HR"*
*Fecha: Septiembre 2026*
