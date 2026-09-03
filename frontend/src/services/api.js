const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export function getToken() {
  return localStorage.getItem('auth_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw { responseStatus: response.status, ...data };
  }

  return data;
}

export async function login(email, password) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export async function logout() {
  setToken(null);
}

export function getMe() {
  return request('/me');
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

export function emergencyUnlock(email) {
    return Promise.reject(new Error("Función deshabilitada por seguridad."));
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

export function changePassword(userId, currentPassword, newPassword, newPasswordConfirmation, verificationCode) {
  return request('/change-password', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      current_password: currentPassword,
      verification_code: verificationCode,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation || newPassword,
    }),
  });
}

export function sendPasswordChangeCode(userId, currentPassword) {
  return request('/send-password-change-code', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, current_password: currentPassword }),
  });
}

export function resetPassword(email, currentPassword, newPassword, confirmPassword, verificationCode) {
  return request('/reset-password', {
    method: 'POST',
    body: JSON.stringify({
      email,
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword || newPassword,
      verification_code: verificationCode,
    }),
  });
}

export function sendPasswordResetCode(email) {
  return request('/send-password-reset-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
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
        restrictions: 'No puede eliminar usuarios.',
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
