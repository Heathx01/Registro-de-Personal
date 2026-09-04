import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import ManagerDashboard from './components/ManagerDashboard';
import DeveloperWorkspace from './components/DeveloperWorkspace';
import PersonnelView from './components/PersonnelView';
import OrganigramaView from './components/OrganigramaView';
import ProjectsView from './components/ProjectsView';
import ClientsView from './components/ClientsView';
import TemplatesView from './components/TemplatesView';
import TasksView from './components/TasksView';
import RolesMatrixView from './components/RolesMatrixView';
import EmployeeModal from './components/EmployeeModal';
import ProjectModal from './components/ProjectModal';
import ClientModal from './components/ClientModal';
import ClientAuthModal from './components/ClientAuthModal';
import TemplateModal from './components/TemplateModal';
import TemplateDetailModal from './components/TemplateDetailModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import TaskModal from './components/TaskModal';
import ConfirmModal from './components/ConfirmModal';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  unlockUser,
  changePassword,
  sendPasswordChangeCode,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getPermissionsForRole,
  getMe,
  getToken,
  logout as apiLogout,
} from './services/api';
import { useToast } from './context/ToastContext';

import './App.css';

import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('manager');
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showClientAuthModal, setShowClientAuthModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [activeDetailTemplate, setActiveDetailTemplate] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isClientUnlocked, setIsClientUnlocked] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showConfirm = (title, message, onConfirm) => {
    setConfirmDialog({ title, message, onConfirm });
  };

  const closeConfirm = () => setConfirmDialog(null);

  useEffect(() => {
    loadAllData();
    checkSession();
  }, []);

  const checkSession = async () => {
    if (getToken()) {
      try {
        const response = await getMe();
        if (response.user) {
          handleLoginSuccess(response.user);
        }
      } catch (err) {
        console.error('Session expired or invalid', err);
        apiLogout();
      }
    }
  };

  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const usersData = await getUsers();
      const clientsData = await getClients();
      const templatesData = await getTemplates();
      const projectsData = await getProjects();
      const tasksData = await getTasks();

      if (Array.isArray(usersData)) setUsers(usersData);
      if (Array.isArray(clientsData)) setClients(clientsData);
      if (Array.isArray(templatesData)) setTemplates(templatesData);
      if (Array.isArray(projectsData)) setProjects(projectsData);
      if (Array.isArray(tasksData)) setTasks(tasksData);
    } catch (err) {
      console.error('Error cargando datos del sistema:', err);
      showToast('Error cargando datos del backend', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (['admin', 'lead', 'hr'].includes(user.role)) {
      setActiveTab('manager');
    } else if (user.role === 'developer') {
      setActiveTab('developer');
    } else if (user.role === 'qa') {
      setActiveTab('tasks');
    } else if (user.role === 'sales') {
      setActiveTab('clients');
    } else {
      setActiveTab('personnel'); // default fallback
    }
  };

  const handleTabSelect = (tab) => {
    if (tab === 'clients' && !isClientUnlocked) {
      setShowClientAuthModal(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleClientAuthSuccess = () => {
    setIsClientUnlocked(true);
    setShowClientAuthModal(false);
    setActiveTab('clients');
  };

  const handleLogout = () => {
    apiLogout();
    setCurrentUser(null);
    setIsClientUnlocked(false);
  };

  const handleUnlockUser = async (id) => {
    try {
      await unlockUser(id);
      setUsers(
        users.map((u) => (u.id === id ? { ...u, is_locked: false, failed_attempts: 0 } : u))
      );
      showToast('🔓 Cuenta desbloqueada exitosamente por el Manager.', 'success');
    } catch (err) {
      console.error('Error al desbloquear usuario:', err);
      showToast('Error al desbloquear usuario', 'error');
    }
  };

  const handleSaveUser = async (newUserData) => {
    try {
      const result = await createUser(newUserData);
      const created = result.user || { id: Date.now(), ...newUserData };
      setUsers([created, ...users]);
      setShowEmployeeModal(false);
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      throw err;
    }
  };

  const handleDeleteUser = async (id) => {
    showConfirm('Eliminar Personal', '¿Estás seguro de eliminar este registro de personal?', async () => {
      try {
        await deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
        showToast('Empleado eliminado correctamente', 'info');
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
        showToast('Error al eliminar usuario', 'error');
      }
      closeConfirm();
    });
  };

  const handleUpdateUser = async (id, updatedFields) => {
    try {
      await updateUser(id, updatedFields);
      setUsers(users.map((u) => (u.id === id ? { ...u, ...updatedFields } : u)));
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  // --- Gestión de Clientes ---
  const handleSaveClient = async (clientData) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, clientData);
        setClients(
          clients.map((c) => (c.id === editingClient.id ? { ...c, ...clientData } : c))
        );
      } else {
        const result = await createClient(clientData);
        const created = result.client || { id: Date.now(), ...clientData, projects: [] };
        setClients([created, ...clients]);
      }
      setShowClientModal(false);
      setEditingClient(null);
    } catch (err) {
      console.error('Error al guardar cliente:', err);
    }
  };

  const handleDeleteClient = async (id) => {
    showConfirm('Eliminar Cliente', '¿Estás seguro de eliminar este cliente?', async () => {
      try {
        await deleteClient(id);
        setClients(clients.filter((c) => c.id !== id));
        showToast('Cliente eliminado correctamente', 'info');
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
        showToast('Error al eliminar cliente', 'error');
      }
      closeConfirm();
    });
  };

  const handleSaveProject = async (newProjData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, newProjData);
        setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...newProjData } : p)));
        showToast('Proyecto actualizado exitosamente', 'success');
      } else {
        const result = await createProject(newProjData);
        const created = result.project || { id: Date.now(), ...newProjData };

        const leadUser = users.find((u) => String(u.id) === String(created.lead_id));
        const clientObj = clients.find((c) => String(c.id) === String(created.client_id));
        created.lead = leadUser;
        created.client = clientObj;

        setProjects([created, ...projects]);
        showToast('Proyecto creado exitosamente', 'success');
      }
      setShowProjectModal(false);
      setEditingProject(null);
      loadAllData();
    } catch (err) {
      console.error('Error al guardar proyecto:', err);
      showToast('Error al guardar el proyecto', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    showConfirm('Eliminar Proyecto', '¿Estás seguro de eliminar este proyecto?', async () => {
      try {
        await deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
        showToast('Proyecto eliminado', 'info');
      } catch (err) {
        console.error('Error al eliminar proyecto:', err);
        showToast('Error al eliminar el proyecto', 'error');
      }
      closeConfirm();
    });
  };

  const handleSaveTask = async (newTaskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, newTaskData);
        setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...newTaskData } : t)));
        showToast('Tarea actualizada exitosamente', 'success');
      } else {
        const result = await createTask(newTaskData);
        const created = result.task || { id: Date.now(), ...newTaskData };

        const assigneeUser = users.find((u) => String(u.id) === String(created.assigned_to));
        const projectObj = projects.find((p) => String(p.id) === String(created.project_id));
        created.assignee = assigneeUser;
        created.project = projectObj;

        setTasks([created, ...tasks]);
        showToast('Tarea asignada exitosamente', 'success');
      }
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Error al guardar tarea:', err);
      showToast('Error al guardar la tarea', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    showConfirm('Eliminar Tarea', '¿Estás seguro de eliminar esta tarea?', async () => {
      try {
        await deleteTask(id);
        setTasks(tasks.filter((t) => t.id !== id));
        showToast('Tarea eliminada', 'info');
      } catch (err) {
        console.error('Error al eliminar tarea:', err);
        showToast('Error al eliminar la tarea', 'error');
      }
      closeConfirm();
    });
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
      showToast(`Estado cambiado a ${newStatus}`, 'info');
    } catch (err) {
      console.error('Error al actualizar estado de la tarea:', err);
      showToast('Error al actualizar estado', 'error');
    }
  };

  const handleSaveTemplate = async (templateData) => {
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, templateData);
        setTemplates(templates.map((t) => (t.id === editingTemplate.id ? { ...t, ...templateData } : t)));
      } else {
        const result = await createTemplate(templateData);
        const created = result.template || { id: Date.now(), ...templateData };
        setTemplates([created, ...templates]);
      }
      setShowTemplateModal(false);
      setEditingTemplate(null);
    } catch (err) {
      console.error('Error al guardar plantilla:', err);
    }
  };

  const handleDeleteTemplate = async (id) => {
    showConfirm('Eliminar Plantilla', '¿Estás seguro de eliminar esta plantilla del catálogo?', async () => {
      try {
        await deleteTemplate(id);
        setTemplates(templates.filter((t) => t.id !== id));
        showToast('Plantilla eliminada exitosamente', 'info');
      } catch (err) {
        console.error('Error al eliminar plantilla:', err);
        showToast('Error al eliminar plantilla', 'error');
      }
      closeConfirm();
    });
  };

  const handleConfirmCreateProjectFromTemplate = async (template, clientId) => {
    const clientObj = clients.find((c) => String(c.id) === String(clientId));
    const newProjData = {
      name: `Proyecto ${template.title} - ${clientObj ? clientObj.name : 'Cliente'}`,
      description: template.description,
      category: template.category,
      status: 'In Progress',
      tech_stack: template.tech_stack,
      client_id: clientId,
      client: clientObj,
      budget: template.suggested_price || 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    try {
      const result = await createProject(newProjData);
      const created = result.project || { id: Date.now(), ...newProjData };
      setProjects([created, ...projects]);
      setActiveDetailTemplate(null);
      setActiveTab('projects');
      showToast(`🚀 ¡Proyecto creado exitosamente para ${clientObj ? clientObj.name : 'el cliente'} basado en la plantilla "${template.title}"!`, 'success');
    } catch (err) {
      console.error('Error al crear proyecto desde plantilla:', err);
      showToast('Error al crear el proyecto desde plantilla', 'error');
    }
  };

  const handleChangePassword = async (currentPassword, newPassword, confirmPassword, verificationCode) => {
    if (!currentUser) return;
    await changePassword(currentUser.id, currentPassword, newPassword, confirmPassword, verificationCode);
    setCurrentUser({ ...currentUser, password: newPassword });
  };

  const handleSendPasswordChangeCode = (currentPassword) => {
    if (!currentUser) return Promise.reject(new Error('Usuario no autenticado.'));
    return sendPasswordChangeCode(currentUser.id, currentPassword);
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} MOCK_USERS={users} />;
  }

  const permissions = getPermissionsForRole(currentUser.role);
  const canManageRoles = ['admin', 'lead', 'hr'].includes(currentUser.role);

  return (
    <div className="app-container">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleTabSelect}
        onLogout={handleLogout}
        onOpenChangePassword={() => setShowChangePasswordModal(true)}
      />

      <main className="main-content">
        {isLoadingData ? (
          <LoadingSpinner message="Sincronizando información del servidor..." />
        ) : (
          <>
            {activeTab === 'manager' && (
              canManageRoles ? (
                <ManagerDashboard
                  users={users}
                  projects={projects}
                  tasks={tasks}
                  currentUser={currentUser}
                  permissions={permissions}
                  onUnlockUser={handleUnlockUser}
                  onAssignTask={handleSaveTask}
                />
              ) : (
                <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '540px' }}>
                  <h3 style={{ color: 'var(--rose)', fontSize: '1.25rem', marginBottom: '10px' }}>
                    🛑 Acceso Restringido
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Este panel es de uso exclusivo para Administradores y Líderes Técnicos.
                  </p>
                </div>
              )
            )}

            {activeTab === 'developer' && (
              <DeveloperWorkspace
                tasks={tasks}
                currentUser={currentUser}
                onUpdateTaskStatus={handleUpdateTaskStatus}
              />
            )}

            {activeTab === 'personnel' && (
              ['admin', 'lead', 'hr'].includes(currentUser.role) ? (
                <PersonnelView
                  users={users}
                  currentUser={currentUser}
                  permissions={permissions}
                  onOpenAddModal={() => setShowEmployeeModal(true)}
                  onDeleteUser={handleDeleteUser}
                  onUpdateUser={handleUpdateUser}
                />
              ) : (
                <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '540px' }}>
                  <h3 style={{ color: 'var(--rose)', fontSize: '1.25rem', marginBottom: '10px' }}>
                    🛑 Acceso Restringido
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    La Base de Datos de Personal es de acceso confidencial exclusivo para Recursos Humanos, Directores y Líderes de Área.
                  </p>
                </div>
              )
            )}

            {activeTab === 'organigrama' && <OrganigramaView users={users} />}

            {activeTab === 'templates' && (
              ['admin', 'lead', 'developer', 'sales'].includes(currentUser.role) ? (
                <TemplatesView
                  templates={templates}
                  permissions={permissions}
                  onOpenAddTemplate={() => {
                    setEditingTemplate(null);
                    setShowTemplateModal(true);
                  }}
                  onOpenEditTemplate={(tmpl) => {
                    setEditingTemplate(tmpl);
                    setShowTemplateModal(true);
                  }}
                  onDeleteTemplate={handleDeleteTemplate}
                  onSelectTemplateForClient={(tmpl) => setActiveDetailTemplate(tmpl)}
                />
              ) : (
                <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '540px' }}>
                  <h3 style={{ color: 'var(--rose)', fontSize: '1.25rem', marginBottom: '10px' }}>
                    🛑 Acceso Restringido
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    El catálogo de plantillas está reservado para equipos técnicos y de ventas.
                  </p>
                </div>
              )
            )}

            {activeTab === 'clients' && (
              <ClientsView
                clients={clients}
                permissions={permissions}
                onOpenAddClient={() => {
                  setEditingClient(null);
                  setShowClientModal(true);
                }}
                onOpenEditClient={(client) => {
                  setEditingClient(client);
                  setShowClientModal(true);
                }}
                onDeleteClient={handleDeleteClient}
                onLockAccess={() => {
                  setIsClientUnlocked(false);
                  setActiveTab('manager');
                }}
              />
            )}

            {activeTab === 'projects' && (
              ['admin', 'lead', 'developer'].includes(currentUser.role) ? (
                <ProjectsView
                  projects={projects}
                  permissions={permissions}
                  onOpenAddProject={() => {
                    setEditingProject(null);
                    setShowProjectModal(true);
                  }}
                  onEditProject={(proj) => {
                    setEditingProject(proj);
                    setShowProjectModal(true);
                  }}
                  onDeleteProject={handleDeleteProject}
                />
              ) : (
                <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '540px' }}>
                  <h3 style={{ color: 'var(--rose)', fontSize: '1.25rem', marginBottom: '10px' }}>
                    🛑 Acceso Restringido
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    La gestión de proyectos está restringida a los equipos de desarrollo y directivos.
                  </p>
                </div>
              )
            )}

            {activeTab === 'tasks' && (
              ['admin', 'lead', 'developer', 'qa'].includes(currentUser.role) ? (
                <TasksView
                  tasks={tasks}
                  users={users}
                  currentUser={currentUser}
                  permissions={permissions}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onOpenAddTask={() => {
                    setEditingTask(null);
                    setShowTaskModal(true);
                  }}
                  onEditTask={(task) => {
                    setEditingTask(task);
                    setShowTaskModal(true);
                  }}
                  onDeleteTask={handleDeleteTask}
                />
              ) : (
                <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '540px' }}>
                  <h3 style={{ color: 'var(--rose)', fontSize: '1.25rem', marginBottom: '10px' }}>
                    🛑 Acceso Restringido
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    El tablero de tareas de desarrollo es de uso exclusivo para equipos de ingeniería y QA.
                  </p>
                </div>
              )
            )}

            {activeTab === 'roles' && (
              canManageRoles ? (
                <RolesMatrixView />
              ) : (
                <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '540px' }}>
                  <h3 style={{ color: 'var(--rose)', fontSize: '1.25rem', marginBottom: '10px' }}>
                    🛑 Acceso Restringido
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    La Matriz de Roles y Permisos sólo está disponible para Administradores y Líderes encargados de asignar privilegios de seguridad.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Modales de Gestión y Autenticación */}
      {showClientAuthModal && (
        <ClientAuthModal
          currentUser={currentUser}
          onClose={() => setShowClientAuthModal(false)}
          onAuthenticated={handleClientAuthSuccess}
        />
      )}

      {showEmployeeModal && (
        <EmployeeModal onClose={() => setShowEmployeeModal(false)} onSave={handleSaveUser} />
      )}

      {showClientModal && (
        <ClientModal
          client={editingClient}
          onClose={() => {
            setShowClientModal(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
        />
      )}

      {showTemplateModal && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => {
            setShowTemplateModal(false);
            setEditingTemplate(null);
          }}
          onSave={handleSaveTemplate}
        />
      )}

      {activeDetailTemplate && (
        <TemplateDetailModal
          template={activeDetailTemplate}
          clients={clients}
          permissions={permissions}
          onClose={() => setActiveDetailTemplate(null)}
          onConfirmCreateProject={handleConfirmCreateProjectFromTemplate}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          users={users}
          clients={clients}
          editingProject={editingProject}
          onClose={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
        />
      )}

      {showTaskModal && (
        <TaskModal
          users={users}
          projects={projects}
          editingTask={editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          currentUser={currentUser}
          onClose={() => setShowChangePasswordModal(false)}
          onRequestCode={handleSendPasswordChangeCode}
          onSave={handleChangePassword}
        />
      )}

      {confirmDialog && (
        <ConfirmModal
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
}

export default App;
