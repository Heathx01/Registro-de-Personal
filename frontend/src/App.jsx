import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import ManagerDashboard from './components/ManagerDashboard';
import DeveloperWorkspace from './components/DeveloperWorkspace';
import PersonnelView from './components/PersonnelView';
import OrganigramaView from './components/OrganigramaView';
import ProjectsView from './components/ProjectsView';
import TasksView from './components/TasksView';
import RolesMatrixView from './components/RolesMatrixView';
import EmployeeModal from './components/EmployeeModal';
import ProjectModal from './components/ProjectModal';
import TaskModal from './components/TaskModal';

import {
  getUsers,
  createUser,
  deleteUser,
  unlockUser,
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
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const usersData = await getUsers();
      const projectsData = await getProjects();
      const tasksData = await getTasks();

      if (Array.isArray(usersData) && usersData.length > 0) setUsers(usersData);
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

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSwitchRole = (user) => {
    setCurrentUser(user);
    if (user.role === 'developer') {
      setActiveTab('developer');
    } else {
      setActiveTab('manager');
    }
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

  const handleSaveProject = async (newProjData) => {
    try {
      const result = await createProject(newProjData);
      const created = result.project || { id: Date.now(), ...newProjData };

      const leadUser = users.find((u) => String(u.id) === String(created.lead_id));
      created.lead = leadUser;

      setProjects([created, ...projects]);
      setShowProjectModal(false);
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

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} MOCK_USERS={users} />;
  }

  const permissions = getPermissionsForRole(currentUser.role);

  return (
    <div className="app-container">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        MOCK_USERS={users}
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
          />
        )}

        {activeTab === 'organigrama' && <OrganigramaView users={users} />}

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

        {activeTab === 'roles' && <RolesMatrixView />}
      </main>

      {/* Modales de Gestión */}
      {showEmployeeModal && (
        <EmployeeModal onClose={() => setShowEmployeeModal(false)} onSave={handleSaveUser} />
      )}

      {showProjectModal && (
        <ProjectModal users={users} onClose={() => setShowProjectModal(false)} onSave={handleSaveProject} />
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
