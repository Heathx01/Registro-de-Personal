import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ManagerDashboard from '../components/ManagerDashboard';
import DeveloperWorkspace from '../components/DeveloperWorkspace';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  getUsers,
  getProjects,
  getTasks,
  unlockUser,
  createTask,
  updateTaskStatus,
} from '../services/api';
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
  const { user, permissions } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const usersData = await getUsers().catch(() => []);
      const projectsData = await getProjects().catch(() => []);
      const tasksData = await getTasks().catch(() => []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) {
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUnlockUser = async (userId) => {
    try {
      await unlockUser(userId);
      showToast('Usuario desbloqueado con éxito', 'success');
      loadData();
    } catch (e) {
      showToast(e.message || 'Error al desbloquear usuario', 'error');
    }
  };

  const handleQuickAssignTask = async (taskPayload) => {
    try {
      await createTask(taskPayload);
      showToast('Tarea asignada exitosamente', 'success');
      loadData();
    } catch (e) {
      showToast(e.message || 'Error asignando tarea', 'error');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      showToast('Estado de tarea actualizado', 'success');
      loadData();
    } catch (e) {
      showToast(e.message || 'Error actualizando tarea', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando panel principal...</p>
      </div>
    );
  }

  // Vista según el rol del usuario autenticado
  const isManagerOrAdmin = ['admin', 'lead', 'hr'].includes(user?.role);

  if (isManagerOrAdmin) {
    return (
      <ManagerDashboard
        currentUser={user}
        users={users}
        projects={projects}
        tasks={tasks}
        permissions={permissions}
        onUnlockUser={handleUnlockUser}
        onAssignTask={handleQuickAssignTask}
      />
    );
  }

  return (
    <DeveloperWorkspace
      currentUser={user}
      tasks={tasks}
      projects={projects}
      onUpdateTaskStatus={handleUpdateTaskStatus}
    />
  );
}
