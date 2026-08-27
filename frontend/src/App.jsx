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
import TaskModal from './components/TaskModal';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  unlockUser,
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
  getTasks,
  createTask,
  updateTaskStatus,
  getPermissionsForRole,
} from './services/api';

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('manager');

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showClientAuthModal, setShowClientAuthModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [activeDetailTemplate, setActiveDetailTemplate] = useState(null);
  const [isClientUnlocked, setIsClientUnlocked] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const usersData = await getUsers();
      const clientsData = await getClients();
      const templatesData = await getTemplates();
      const projectsData = await getProjects();
      const tasksData = await getTasks();

      if (Array.isArray(usersData) && usersData.length > 0) setUsers(usersData);
      if (Array.isArray(clientsData) && clientsData.length > 0) setClients(clientsData);
      if (Array.isArray(templatesData) && templatesData.length > 0) setTemplates(templatesData);
      if (Array.isArray(projectsData) && projectsData.length > 0) setProjects(projectsData);
      if (Array.isArray(tasksData) && tasksData.length > 0) setTasks(tasksData);
    } catch (err) {
      console.error('Error cargando datos del sistema:', err);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'developer') {
      setActiveTab('developer');
    } else {
      setActiveTab('manager');
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
    setCurrentUser(null);
    setIsClientUnlocked(false);
  };

  const handleUnlockUser = async (id) => {
    try {
      await unlockUser(id);
      setUsers(
        users.map((u) => (u.id === id ? { ...u, is_locked: false, failed_attempts: 0 } : u))
      );
      alert('🔓 Cuenta desbloqueada exitosamente por el Manager.');
    } catch (err) {
      console.error('Error al desbloquear usuario:', err);
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
    if (window.confirm('¿Estás seguro de eliminar este registro de personal?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
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
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteClient(id);
        setClients(clients.filter((c) => c.id !== id));
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
      }
    }
  };

  const handleSaveProject = async (newProjData) => {
    try {
      const result = await createProject(newProjData);
      const created = result.project || { id: Date.now(), ...newProjData };

      const leadUser = users.find((u) => String(u.id) === String(created.lead_id));
      const clientObj = clients.find((c) => String(c.id) === String(created.client_id));
      created.lead = leadUser;
      created.client = clientObj;

      setProjects([created, ...projects]);
      setShowProjectModal(false);
      loadAllData(); // Recargar relaciones cliente-proyecto
    } catch (err) {
      console.error('Error al crear proyecto:', err);
    }
  };

  const handleSaveTask = async (newTaskData) => {
    try {
      const result = await createTask(newTaskData);
      const created = result.task || { id: Date.now(), ...newTaskData };

      const assigneeUser = users.find((u) => String(u.id) === String(created.assigned_to));
      const projectObj = projects.find((p) => String(p.id) === String(created.project_id));
      created.assignee = assigneeUser;
      created.project = projectObj;

      setTasks([created, ...tasks]);
      setShowTaskModal(false);
    } catch (err) {
      console.error('Error al asignar tarea:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    } catch (err) {
      console.error('Error al actualizar estado de la tarea:', err);
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
    if (window.confirm('¿Estás seguro de eliminar esta plantilla del catálogo?')) {
      try {
        await deleteTemplate(id);
        setTemplates(templates.filter((t) => t.id !== id));
      } catch (err) {
        console.error('Error al eliminar plantilla:', err);
      }
    }
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
      alert(`🚀 ¡Proyecto creado exitosamente para ${clientObj ? clientObj.name : 'el cliente'} basado en la plantilla "${template.title}"!`);
    } catch (err) {
      console.error('Error al crear proyecto desde plantilla:', err);
    }
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
      />

      <main className="main-content">
        {activeTab === 'manager' && (
          <ManagerDashboard
            users={users}
            projects={projects}
            tasks={tasks}
            currentUser={currentUser}
            onUnlockUser={handleUnlockUser}
            onAssignTask={handleSaveTask}
          />
        )}

        {activeTab === 'developer' && (
          <DeveloperWorkspace
            tasks={tasks}
            currentUser={currentUser}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}

        {activeTab === 'personnel' && (
          <PersonnelView
            users={users}
            currentUser={currentUser}
            permissions={permissions}
            onOpenAddModal={() => setShowEmployeeModal(true)}
            onDeleteUser={handleDeleteUser}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {activeTab === 'organigrama' && <OrganigramaView users={users} />}

        {activeTab === 'templates' && (
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
          <ProjectsView
            projects={projects}
            permissions={permissions}
            onOpenAddProject={() => setShowProjectModal(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            users={users}
            currentUser={currentUser}
            permissions={permissions}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onOpenAddTask={() => setShowTaskModal(true)}
          />
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
          onClose={() => setActiveDetailTemplate(null)}
          onConfirmCreateProject={handleConfirmCreateProjectFromTemplate}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          users={users}
          clients={clients}
          onClose={() => setShowProjectModal(false)}
          onSave={handleSaveProject}
        />
      )}

      {showTaskModal && (
        <TaskModal
          users={users}
          projects={projects}
          onClose={() => setShowTaskModal(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

export default App;
