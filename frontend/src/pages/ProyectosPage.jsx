import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProjectsView from '../components/ProjectsView';
import ProjectModal from '../components/ProjectModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { getProjects, getUsers, getClients, createProject, updateProject, deleteProject } from '../services/api';

export default function ProyectosPage() {
  const { user, permissions } = useAuth();
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const p = await getProjects().catch(() => []);
      const u = await getUsers().catch(() => []);
      const c = await getClients().catch(() => []);
      setProjects(Array.isArray(p) ? p : []);
      setUsers(Array.isArray(u) ? u : []);
      setClients(Array.isArray(c) ? c : []);
    } catch (err) {
      setError(err.message || 'Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProject = async (formData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
        showToast('Proyecto actualizado exitosamente', 'success');
      } else {
        await createProject(formData);
        showToast('Proyecto registrado exitosamente', 'success');
      }
      setShowModal(false);
      setEditingProject(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Error al guardar proyecto', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('¿Deseas eliminar este proyecto técnico?')) return;
    try {
      await deleteProject(id);
      showToast('Proyecto eliminado exitosamente', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Error al eliminar proyecto', 'error');
    }
  };

  const canAccess = ['admin', 'lead', 'developer'].includes(user?.role);
  if (!canAccess) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1.5rem' }}>
        <Alert type="error" message="403: No tienes permisos para gestionar proyectos." />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert type="error" message={error} />}
      <ProjectsView
        projects={projects}
        permissions={permissions}
        onOpenAddProject={() => {
          setEditingProject(null);
          setShowModal(true);
        }}
        onEditProject={(p) => {
          setEditingProject(p);
          setShowModal(true);
        }}
        onDeleteProject={handleDeleteProject}
      />

      {showModal && (
        <ProjectModal
          users={users}
          clients={clients}
          editingProject={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
}
