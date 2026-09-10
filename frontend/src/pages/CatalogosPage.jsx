import React, { useState, useEffect, useCallback } from 'react';
import { catalogosApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CatalogoTable from '../components/catalogos/CatalogoTable';
import CatalogoForm from '../components/catalogos/CatalogoForm';
import ConfirmDialog from '../components/catalogos/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';

export default function CatalogosPage() {
  const { can } = useAuth();
  const { showToast } = useToast();

  // Estados de la interfaz (Sección 6, Paso 9: LOADING, EMPTY, ERROR, SAVING, SUCCESS, FORBIDDEN)
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  // Estados de creación y formulario
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Estados de eliminación y diálogo de confirmación
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Cargar datos con useEffect y limpieza de ciclo de vida (Paso 8 - Sección 6)
  const loadData = useCallback(async () => {
    let ignore = false;
    try {
      setLoading(true);
      setError('');
      setForbidden(false);

      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const data = await catalogosApi.list(params);
      if (!ignore) {
        setItems(Array.isArray(data) ? data : data?.data || []);
      }
    } catch (err) {
      if (!ignore) {
        if (err.status === 403 || err.responseStatus === 403) {
          setForbidden(true);
          setError('No tienes permisos suficientes para visualizar el catálogo.');
        } else {
          setError(err.message || 'Error al conectar con la API de Catálogos.');
        }
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
    return () => {
      ignore = true;
    };
  }, [categoryFilter, searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Crear registro desde React (Paso 7 - Sección 6)
  const handleCreateSubmit = async (formData) => {
    setSaving(true);
    setFormErrors({});
    try {
      await catalogosApi.create(formData);
      showToast('Registro de catálogo creado exitosamente', 'success');
      setShowCreateModal(false);
      await loadData();
    } catch (err) {
      if (err.status === 422 || err.responseStatus === 422) {
        setFormErrors(err.errors || {});
      } else if (err.status === 403 || err.responseStatus === 403) {
        showToast('Acceso denegado: No tienes permiso para registrar en el catálogo.', 'error');
      } else {
        showToast(err.message || 'Error al guardar el registro.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  // Eliminar con confirmación y manejo de 403 (Paso 13 y 15 - Sección 6)
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await catalogosApi.remove(itemToDelete.id);
      showToast(`"${itemToDelete.title}" eliminado correctamente`, 'success');
      setItems((prev) => prev.filter((x) => x.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (err) {
      if (err.status === 403 || err.responseStatus === 403) {
        showToast('Error 403: No estás autorizado para eliminar este registro en Laravel.', 'error');
      } else {
        showToast(err.message || 'Error al eliminar el registro.', 'error');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header del módulo */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
            Catálogo de Soluciones y Modelos
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>
            Módulo CRUD con validación de dos capas, Form Requests y React Router SPA.
          </p>
        </div>

        {/* Botón condicional por permiso (Paso 5 y 15) */}
        {can('catalogos.create') && (
          <button
            type="button"
            onClick={() => {
              setFormErrors({});
              setShowCreateModal(true);
            }}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span>
            Nuevo Registro
          </button>
        )}
      </div>

      {/* Barra de Filtros */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          background: 'rgba(30, 41, 59, 0.5)',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <input
          type="text"
          placeholder="Buscar por título o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1 1 240px',
            padding: '0.6rem 0.85rem',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: '#fff',
            fontSize: '0.9rem',
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '0.6rem 0.85rem',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: '#fff',
            fontSize: '0.9rem',
          }}
        >
          <option value="all">Todas las Categorías</option>
          <option value="web">Web & SaaS</option>
          <option value="mobile">Móvil</option>
          <option value="enterprise">Empresarial</option>
          <option value="ecommerce">E-Commerce</option>
          <option value="ai">Inteligencia Artificial</option>
        </select>
      </div>

      {/* Manejo de estados de interfaz: ERROR y FORBIDDEN */}
      {forbidden && (
        <Alert
          type="warning"
          message="403 Prohibido: Tu rol actual no tiene autorización para consultar este catálogo."
        />
      )}
      {error && !forbidden && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Estado LOADING */}
      {loading && (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando registros del catálogo...</p>
        </div>
      )}

      {/* Estado EMPTY */}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon="📂"
          text="No se encontraron registros en el catálogo."
          action={
            can('catalogos.create') ? (
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Crear el primer elemento
              </button>
            ) : null
          }
        />
      )}

      {/* Lista de Registros con CatalogoTable */}
      {!loading && items.length > 0 && (
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            padding: '0.5rem',
          }}
        >
          <CatalogoTable
            items={items}
            loading={loading}
            onDelete={(item) => setItemToDelete(item)}
            can={can}
          />
        </div>
      )}

      {/* Modal de Creación con CatalogoForm */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#111827',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.35rem' }}>
                Nuevo Registro de Catálogo
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <CatalogoForm
              onSubmit={handleCreateSubmit}
              onCancel={() => setShowCreateModal(false)}
              isSaving={saving}
              apiErrors={formErrors}
            />
          </div>
        </div>
      )}

      {/* Diálogo de Confirmación para Eliminar (ConfirmDialog) */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        title="Eliminar Registro de Catálogo"
        message="¿Estás seguro de que deseas eliminar este elemento del catálogo? Esta acción no se puede deshacer y será validada por Laravel."
        itemName={itemToDelete?.title}
        isDeleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
