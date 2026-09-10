import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TasksView from '../components/TasksView';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { getTasks, getUsers, getProjects, createTask, updateTask, updateTaskStatus, deleteTask } from '../services/api';

export default function TareasPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [t, u, p] = await Promise.all([
        getTasks().catch(() => []),
        getUsers().catch(() => []),
        getProjects().catch(() => []),
      ]);
      setTasks(Array.isArray(t) ? t : []);
      setUsers(Array.isArray(u) ? u : []);
      setProjects(Array.isArray(p) ? p : []);
    } catch (err) {
      setError(err.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveTask = async (formData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        showToast('Tarea actualizada exitosamente', 'success');
      } else {
        await createTask(formData);
        showToast('Tarea creada exitosamente', 'success');
      }
      setShowModal(false);
      setEditingTask(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Error al guardar tarea', 'error');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      showToast('Estado actualizado', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Error al actualizar estado', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta tarea?')) return;
    try {
      await deleteTask(id);
      showToast('Tarea eliminada', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Error al eliminar tarea', 'error');
    }
  };

  const canAccess = ['admin', 'lead', 'developer', 'qa'].includes(user?.role);
  if (!canAccess) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1.5rem' }}>
        <Alert type="error" message="403: No tienes permisos para acceder al gestor de tareas." />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando tareas...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert type="error" message={error} />}
      <TasksView
        tasks={tasks}
        users={users}
        currentUser={user}
        onOpenAddTask={() => {
          setEditingTask(null);
          setShowModal(true);
        }}
        onEditTask={(t) => {
          setEditingTask(t);
          setShowModal(true);
        }}
        onDeleteTask={handleDeleteTask}
        onUpdateTaskStatus={handleUpdateStatus}
      />

      {showModal && (
        <TaskModal
          users={users}
          projects={projects}
          editingTask={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
