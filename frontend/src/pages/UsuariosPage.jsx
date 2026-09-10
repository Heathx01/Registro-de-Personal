import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PersonnelView from '../components/PersonnelView';
import EmployeeModal from '../components/EmployeeModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

export default function UsuariosPage() {
  const { user, permissions } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar personal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSaveUser = async (formData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        showToast('Empleado actualizado exitosamente', 'success');
      } else {
        await createUser(formData);
        showToast('Empleado registrado exitosamente', 'success');
      }
      setShowModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      showToast(err.message || 'Error al guardar empleado', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Confirmas que deseas eliminar este empleado del sistema?')) return;
    try {
      await deleteUser(userId);
      showToast('Empleado eliminado con éxito', 'success');
      loadUsers();
    } catch (err) {
      showToast(err.message || 'Error al eliminar empleado', 'error');
    }
  };

  const canAccess = ['admin', 'lead', 'hr'].includes(user?.role);

  if (!canAccess) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1.5rem' }}>
        <Alert
          type="error"
          message="403 Prohibido: El directorio de personal es de acceso confidencial exclusivo para Recursos Humanos, Directores y Líderes."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando directorio de personal...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert type="error" message={error} />}
      <PersonnelView
        users={users}
        currentUser={user}
        permissions={permissions}
        onOpenAddModal={() => {
          setEditingUser(null);
          setShowModal(true);
        }}
        onDeleteUser={handleDeleteUser}
        onUpdateUser={(u) => {
          setEditingUser(u);
          setShowModal(true);
        }}
      />

      {showModal && (
        <EmployeeModal
          employee={editingUser}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
