const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const MOCK_USERS = [
  {
    id: 1,
    name: 'Administrador Principal',
    email: 'admin@devstudio.com',
    password: 'admin123',
    position: 'Administrador de Sistemas / IT',
    department: 'Dirección de TI',
    role: 'admin',
    phone: '+52 55 0000 0000',
    status: 'Active',
    hire_date: '2026-01-01',
    skills: ['Gestión de Usuarios', 'Seguridad de Datos', 'Administración del Sistema', 'Asignación de Privilegios'],
    bio: 'Administrador principal del sistema con potestad exclusiva para crear usuarios, asignar puestos y modificar roles y privilegios.',
    failed_attempts: 0,
    is_locked: false,
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    email: 'sales@devstudio.com',
    password: 'password123',
    position: 'Ejecutivo de Ventas y BDM',
    department: 'Ventas y Estrategia Comercial',
    role: 'sales',
    phone: '+52 55 8888 9999',
    status: 'Active',
    hire_date: '2026-03-15',
    skills: ['Prospectación de Clientes', 'Presentación de Portafolio', 'Cierre de Cotizaciones', 'Relaciones Comerciales'],
    bio: 'Encargado de prospección comercial, presentación del catálogo de plantillas a clientes y generación de propuestas de desarrollo.',
    failed_attempts: 0,
    is_locked: false,
  }
];

const MOCK_TEMPLATES = [
  {
    id: 1,
    title: 'Portal E-Commerce Omni-channel',
    category: 'E-Commerce',
    description: 'Plataforma completa de comercio electrónico con pasarela de pagos integrada, catálogo interactivo de productos, control de inventario y panel administrativo.',
    features: ['Pasarela de Pagos Stripe/PayPal', 'Catálogo con Filtros Avanzados', 'Panel de Inventario y Pedidos', 'Notificaciones por Email/WhatsApp', 'Diseño Responsive Mobile-First'],
    tech_stack: ['React', 'Laravel API', 'MySQL', 'Tailwind CSS'],
    estimated_delivery: '2 a 3 semanas',
    image_url: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?w=800&auto=format&fit=crop&q=80',
    demo_url: 'https://demo.devstudio.com/ecommerce',
    suggested_price: 3500.00,
    status: 'active',
  },
  {
    id: 2,
    title: 'Dashboard ERP & CRM Financiero',
    category: 'ERP / CRM',
    description: 'Sistema de gestión de recursos empresariales y relaciones con clientes, métricas en tiempo real, cotizador dinámico y módulos contables.',
    features: ['Gestión de Clientes y Leads', 'Facturación y Cotizaciones', 'Métricas y Gráficos Financieros', 'Roles y Permisos Granulares', 'Exportación a PDF y Excel'],
    tech_stack: ['React', 'Laravel REST API', 'Chart.js', 'PostgreSQL'],
    estimated_delivery: '3 a 4 semanas',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    demo_url: 'https://demo.devstudio.com/erp',
    suggested_price: 4800.00,
    status: 'active',
  },
  {
    id: 3,
    title: 'App Móvil de Citas y Reservas en Línea',
    category: 'Mobile App',
    description: 'Aplicación multiplataforma para reserva de citas, gestión de agenda en tiempo real, recordatorios push y pagos en línea.',
    features: ['Agenda Dinámica e Interactiva', 'Notificaciones Push Móviles', 'Recordatorios por SMS/Email', 'Perfiles de Especialistas', 'Integración con MercadoPago'],
    tech_stack: ['React Native / Flutter', 'Node.js', 'Firebase', 'MongoDB'],
    estimated_delivery: '3 semanas',
    image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
    demo_url: 'https://demo.devstudio.com/booking',
    suggested_price: 2900.00,
    status: 'active',
  },
  {
    id: 4,
    title: 'Portal SaaS & Membresías Recurrentes',
    category: 'SaaS Platform',
    description: 'Plataforma multi-tenant para servicios de suscripción mensual/anual con autenticación 2FA, pasarela de suscripciones recurrentes y dashboard del cliente.',
    features: ['Mapeo de Suscripciones Recurrentes', 'Autenticación 2FA & OAuth', 'Portal de Ajustes y Perfil de Usuario', 'Integración con Stripe Billing', 'Soporte Multilingüe i18n'],
    tech_stack: ['Next.js / Vite', 'Laravel API', 'Stripe', 'Redis'],
    estimated_delivery: '4 semanas',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    demo_url: 'https://demo.devstudio.com/saas',
    suggested_price: 5200.00,
    status: 'active',
  }
];

const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'Portal Interno de Registro de Personal',
    description: 'Sistema corporativo para control de personal, roles, privilegios y asignación de tareas.',
    category: 'Web App / System Admin',
    status: 'Active',
    tech_stack: ['Laravel API', 'Vite React', 'Vanilla CSS', 'MySQL'],
    lead_id: 1,
    lead: MOCK_USERS[0],
    progress: 85,
    deadline: '2026-10-15',
  }
];

const MOCK_TASKS = [
  {
    id: 1,
    project_id: 1,
    assigned_to: 1,
    title: 'Gestión y Creación del Personal Inicial',
    description: 'Registrar a los integrantes del equipo y otorgarles sus puestos y niveles de privilegios correspondientes.',
    priority: 'High',
    status: 'In Progress',
    due_date: '2026-08-30',
    assignee: MOCK_USERS[0],
    project: MOCK_PROJECTS[0],
  }
];

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { responseStatus: response.status, ...data };
    }

    return data;
  } catch (error) {
    if (error.responseStatus) {
      throw error;
    }
    console.warn(`[API Fallback Activated] ${path}:`, error.message);
    return mockHandler(path, options);
  }
}

function mockHandler(path, options) {
  const method = (options.method || 'GET').toUpperCase();

  if (path === '/register' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const existing = MOCK_USERS.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase());
    if (existing) {
      throw { responseStatus: 422, message: 'El correo electrónico ya se encuentra registrado.' };
    }
    const newUser = {
      id: Date.now(),
      name: body.name,
      email: body.email,
      position: body.position || 'Desarrollador de Software',
      department: body.department || 'Ingeniería de Software',
      role: body.role || 'developer',
      phone: body.phone || null,
      status: 'Active',
      hire_date: new Date().toISOString().split('T')[0],
      skills: ['React', 'JavaScript'],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Nuevo empleado registrado.',
      failed_attempts: 0,
      is_locked: false,
    };
    MOCK_USERS.unshift(newUser);
    return {
      status: 'success',
      message: 'Cuenta registrada exitosamente',
      user: newUser,
      permissions: getPermissionsForRole(newUser.role),
      token: 'demo_token_' + Date.now()
    };
  }

  if (path === '/login' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase());

    if (!user) {
      throw { responseStatus: 404, message: 'El correo electrónico no está registrado. Crea tu cuenta en la pestaña "Registrarse".' };
    }

    if (user.is_locked) {
      throw { responseStatus: 423, is_locked: true, message: '🛑 CUENTA BLOQUEADA POR SEGURIDAD. Ha acumulado 3 intentos fallidos. Puedes presionar el botón "Desbloquear de Emergencia" abajo para ingresar.' };
    }

    const inputPass = body.password || '';
    const userPass = user.password || (user.role === 'admin' ? 'admin123' : 'password123');

    // Claves válidas: la clave asignada/cambiada, o claves maestras de demo (admin123, password123, 123456)
    const isValid = inputPass === userPass || inputPass === 'admin123' || inputPass === 'password123' || inputPass === '123456';

    if (!isValid) {
      user.failed_attempts = (user.failed_attempts || 0) + 1;
      if (user.failed_attempts >= 3) {
        user.is_locked = true;
        throw { responseStatus: 423, is_locked: true, failed_attempts: 3, remaining_attempts: 0, message: '🛑 CUENTA BLOQUEADA POR SEGURIDAD. Ha acumulado 3 intentos fallidos.' };
      }
      const remaining = 3 - user.failed_attempts;
      throw { responseStatus: 401, failed_attempts: user.failed_attempts, remaining_attempts: remaining, message: `Contraseña incorrecta. Le quedan ${remaining} intento(s).` };
    }

    user.failed_attempts = 0;
    user.is_locked = false;

    return {
      status: 'success',
      user,
      permissions: getPermissionsForRole(user.role),
      token: 'demo_token_' + Date.now()
    };
  }

  if (path === '/emergency-unlock' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase());
    if (user) {
      user.is_locked = false;
      user.failed_attempts = 0;
      return { status: 'success', message: `✅ La cuenta de ${user.name} ha sido desbloqueada exitosamente.`, user };
    } else {
      // Desbloquear todos si no se pasa correo específico
      MOCK_USERS.forEach(u => {
        u.is_locked = false;
        u.failed_attempts = 0;
      });
      return { status: 'success', message: '✅ Todas las cuentas de usuario han sido desbloqueadas.' };
    }
  }

  if (path.includes('/unlock') && method === 'POST') {
    const userId = parseInt(path.split('/')[2]);
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      user.failed_attempts = 0;
      user.is_locked = false;
      return { message: `La cuenta de ${user.name} ha sido desbloqueada.`, user };
    }
  }

  if (path === '/change-password' && method === 'POST') {
    const body = JSON.parse(options.body);
    const user = MOCK_USERS.find(u => String(u.id) === String(body.user_id));
    if (!user) {
      throw { responseStatus: 404, message: 'Usuario no encontrado.' };
    }
    const validPass = user.password || 'password123';
    if (body.current_password !== validPass && body.current_password !== 'password123') {
      throw { responseStatus: 400, message: '🔒 La contraseña actual ingresada es incorrecta. Por favor verifíquela.' };
    }
    user.password = body.new_password;
    return {
      status: 'success',
      message: '✅ Tu contraseña ha sido actualizada exitosamente. Usa tu nueva clave en tu próximo inicio de sesión.',
      user,
    };
  }

  if (path.startsWith('/users')) {
    if (method === 'GET') return MOCK_USERS;
    if (method === 'POST') {
      const newUser = { id: Date.now(), failed_attempts: 0, is_locked: false, ...JSON.parse(options.body) };
      MOCK_USERS.unshift(newUser);
      return { message: 'Empleado registrado', user: newUser };
    }
  }

  if (path === '/organigrama') {
    return {
      direccion: MOCK_USERS.filter(u => u.role === 'admin'),
      lideres: MOCK_USERS.filter(u => u.role === 'lead'),
      desarrollo: MOCK_USERS.filter(u => u.role === 'developer'),
      calidad: MOCK_USERS.filter(u => u.role === 'qa'),
      recursos_humanos: MOCK_USERS.filter(u => u.role === 'hr'),
      ventas: MOCK_USERS.filter(u => u.role === 'sales'),
    };
  }

  if (path.startsWith('/templates')) {
    if (method === 'GET') return MOCK_TEMPLATES;
    if (method === 'POST') {
      const newTmpl = { id: Date.now(), status: 'active', ...JSON.parse(options.body) };
      MOCK_TEMPLATES.unshift(newTmpl);
      return { message: 'Plantilla creada', template: newTmpl };
    }
  }

  if (path.startsWith('/projects')) {
    if (method === 'GET') return MOCK_PROJECTS;
    if (method === 'POST') {
      const newProj = { id: Date.now(), ...JSON.parse(options.body) };
      MOCK_PROJECTS.unshift(newProj);
      return { message: 'Proyecto creado', project: newProj };
    }
  }

  if (path.startsWith('/tasks')) {
    if (method === 'GET') return MOCK_TASKS;
    if (method === 'POST') {
      const newTask = { id: Date.now(), ...JSON.parse(options.body) };
      MOCK_TASKS.unshift(newTask);
      return { message: 'Tarea creada', task: newTask };
    }
  }

  return [];
}

export function getPermissionsForRole(role) {
  switch (role) {
    case 'admin':
      return {
        label: 'Director General / CEO',
        can_manage_users: true,
        can_unlock_users: true,
        can_manage_projects: true,
        can_manage_clients: true,
        can_view_clients: true,
        can_view_templates: true,
        can_manage_templates: true,
        can_create_proposal: true,
        can_view_salaries: true,
        can_assign_tasks: true,
        can_view_organigrama: true,
        can_delete_records: true,
        restrictions: 'Sin restricciones.',
      };
    case 'lead':
      return {
        label: 'Líder Técnico / Manager',
        can_manage_users: false,
        can_unlock_users: true,
        can_manage_projects: true,
        can_manage_clients: true,
        can_view_clients: true,
        can_view_templates: true,
        can_manage_templates: true,
        can_create_proposal: true,
        can_view_salaries: true,
        can_assign_tasks: true,
        can_view_organigrama: true,
        can_delete_records: false,
        restrictions: 'No puede eliminar usuarios ni modificar salarios administrativos.',
      };
    case 'sales':
      return {
        label: 'Ejecutivo de Ventas & BDM',
        can_manage_users: false,
        can_unlock_users: false,
        can_manage_projects: true,
        can_manage_clients: true,
        can_view_clients: true,
        can_view_templates: true,
        can_manage_templates: false,
        can_create_proposal: true,
        can_view_salaries: false,
        can_assign_tasks: false,
        can_view_organigrama: true,
        can_delete_records: false,
        restrictions: 'Demostración de catálogo a clientes, alta de clientes y propuestas de proyectos.',
      };
    case 'developer':
      return {
        label: 'Desarrollador de Software',
        can_manage_users: false,
        can_unlock_users: false,
        can_manage_projects: false,
        can_manage_clients: false,
        can_view_clients: false,
        can_view_templates: true,
        can_manage_templates: false,
        can_create_proposal: false,
        can_view_salaries: false,
        can_assign_tasks: false,
        can_update_task_status: true,
        can_view_organigrama: true,
        can_delete_records: false,
        restrictions: 'Gestión de tareas asignadas y lectura de catálogo.',
      };
    case 'qa':
      return {
        label: 'QA Automation Lead',
        can_manage_users: false,
        can_unlock_users: false,
        can_manage_projects: false,
        can_manage_clients: false,
        can_view_clients: false,
        can_view_templates: true,
        can_manage_templates: false,
        can_create_proposal: false,
        can_view_salaries: false,
        can_assign_tasks: true,
        can_update_task_status: true,
        can_view_organigrama: true,
        can_delete_records: false,
        restrictions: 'Pruebas de calidad y lectura de catálogo.',
      };
    case 'hr':
      return {
        label: 'Recursos Humanos (HR)',
        can_manage_users: true,
        can_unlock_users: true,
        can_manage_projects: false,
        can_manage_clients: false,
        can_view_clients: false,
        can_view_templates: false,
        can_manage_templates: false,
        can_create_proposal: false,
        can_view_salaries: false,
        can_assign_tasks: false,
        can_view_organigrama: true,
        can_delete_records: false,
        restrictions: 'Gestión de personal.',
      };
    default:
      return {
        label: 'Empleado',
        can_manage_users: false,
        can_view_clients: false,
        can_view_salaries: false,
        restrictions: 'Lectura.',
      };
  }
}

// Exportación de funciones API
export function login(email, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser(userData) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export function unlockUser(id) {
  return request(`/users/${id}/unlock`, {
    method: 'POST',
  });
}

export function getUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/users${query ? `?${query}` : ''}`);
}

export function getUserDetail(id) {
  return request(`/users/${id}`);
}

export function createUser(userData) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export function updateUser(id, userData) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

export function deleteUser(id) {
  return request(`/users/${id}`, {
    method: 'DELETE',
  });
}

export function getOrganigrama() {
  return request('/organigrama');
}

// --- Clientes API (CRM/SaaS) ---
export function getClients() {
  return request('/clients');
}

export function createClient(clientData) {
  return request('/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
}

export function updateClient(id, clientData) {
  return request(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
}

export function deleteClient(id) {
  return request(`/clients/${id}`, {
    method: 'DELETE',
  });
}

export function getProjects() {
  return request('/projects');
}

export function createProject(project) {
  return request('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });
}

export function updateProject(id, project) {
  return request(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  });
}

export function deleteProject(id) {
  return request(`/projects/${id}`, {
    method: 'DELETE',
  });
}

export function getTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/tasks${query ? `?${query}` : ''}`);
}

export function createTask(taskData) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

export function updateTaskStatus(id, status) {
  return request(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

// --- Catálogo de Plantillas API ---
export function getTemplates() {
  return request('/templates');
}

export function createTemplate(templateData) {
  return request('/templates', {
    method: 'POST',
    body: JSON.stringify(templateData),
  });
}

export function updateTemplate(id, templateData) {
  return request(`/templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(templateData),
  });
}

export function deleteTemplate(id) {
  return request(`/templates/${id}`, {
    method: 'DELETE',
  });
}

export function changePassword(userId, currentPassword, newPassword, newPasswordConfirmation) {
  return request('/change-password', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation || newPassword,
    }),
  });
}

export function emergencyUnlock(email) {
  return request('/emergency-unlock', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

