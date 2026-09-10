import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ClientsView from '../components/ClientsView';
import ClientModal from '../components/ClientModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { getClients, createClient, updateClient, deleteClient } from '../services/api';

export default function ClientesPage() {
  const { user, permissions } = useAuth();
  const { showToast } = useToast();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSaveClient = async (formData) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData);
        showToast('Cliente actualizado con éxito', 'success');
      } else {
        await createClient(formData);
        showToast('Cliente registrado con éxito', 'success');
      }
      setShowModal(false);
      setEditingClient(null);
      loadClients();
    } catch (err) {
      showToast(err.message || 'Error al guardar cliente', 'error');
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('¿Confirmas que deseas eliminar este cliente?')) return;
    try {
      await deleteClient(id);
      showToast('Cliente eliminado', 'success');
      loadClients();
    } catch (err) {
      showToast(err.message || 'Error al eliminar cliente', 'error');
    }
  };

  const canAccess = ['admin', 'lead', 'sales'].includes(user?.role);
  if (!canAccess) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1.5rem' }}>
        <Alert type="error" message="403: Módulo de clientes reservado para Ventas y Dirección." />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert type="error" message={error} />}
      <ClientsView
        clients={clients}
        permissions={permissions}
        onOpenAddClient={() => {
          setEditingClient(null);
          setShowModal(true);
        }}
        onOpenEditClient={(c) => {
          setEditingClient(c);
          setShowModal(true);
        }}
        onDeleteClient={handleDeleteClient}
        onLockAccess={() => {}}
      />

      {showModal && (
        <ClientModal
          client={editingClient}
          onClose={() => {
            setShowModal(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
        />
      )}
    </div>
  );
}
