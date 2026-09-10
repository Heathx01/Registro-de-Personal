import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogosApi, getClients, createProject } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TemplatesView from '../components/TemplatesView';
import TemplateModal from '../components/TemplateModal';
import TemplateDetailModal from '../components/TemplateDetailModal';
import CatalogoTable from '../components/catalogos/CatalogoTable';
import ConfirmDialog from '../components/catalogos/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';

export default function CatalogosPage() {
  const { can, permissions, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Estados de la interfaz (Sección 6, Paso 9: LOADING, EMPTY, ERROR, SAVING, SUCCESS, FORBIDDEN)
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Showcase) | 'table' (Rúbrica)

  // Modales
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [activeDetailTemplate, setActiveDetailTemplate] = useState(null);

  // Estados de eliminación y diálogo de confirmación
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Cargar datos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setForbidden(false);

      const [data, clientsData] = await Promise.all([
        catalogosApi.list().catch((err) => {
          if (err.status === 403 || err.responseStatus === 403) {
            setForbidden(true);
          }
          throw err;
        }),
        getClients().catch(() => []),
      ]);

      setItems(Array.isArray(data) ? data : data?.data || []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (err) {
      if (err.status === 403 || err.responseStatus === 403) {
        setForbidden(true);
        setError('No tienes permisos suficientes para visualizar el catálogo.');
      } else {
        setError(err.message || 'Error al conectar con la API de Catálogos.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Guardar plantilla desde modal
  const handleSaveTemplate = async (templateData) => {
    try {
      if (editingTemplate) {
        await catalogosApi.update(editingTemplate.id, templateData);
        showToast('Plantilla actualizada exitosamente', 'success');
      } else {
        await catalogosApi.create(templateData);
        showToast('Plantilla creada exitosamente (HTTP 201)', 'success');
      }
      setShowTemplateModal(false);
      setEditingTemplate(null);
      await loadData();
    } catch (err) {
      if (err.status === 422 || err.responseStatus === 422) {
        showToast('Error 422: Datos de validación rechazados por Laravel', 'error');
      } else if (err.status === 403 || err.responseStatus === 403) {
        showToast('Error 403: No tienes autorización para realizar esta acción.', 'error');
      } else {
        showToast(err.message || 'Error al guardar la plantilla.', 'error');
      }
    }
  };

  // Crear proyecto a partir de plantilla
  const handleConfirmCreateProject = async (template, clientId) => {
    try {
      await createProject({
        name: `${template.title} - Cliente`,
        description: template.description,
        client_id: clientId,
        category: template.category,
        budget: template.suggested_price || 0,
        status: 'Active',
      });
      showToast('¡Proyecto generado exitosamente a partir de la plantilla!', 'success');
      setActiveDetailTemplate(null);
    } catch (e) {
      showToast(e.message || 'Error al generar proyecto', 'error');
    }
  };

  // Eliminar con confirmación y manejo de 403
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
    <div className="animate-fade-in" style={{ padding: '10px 0' }}>
      {/* Alertas de error y permisos */}
      {forbidden && (
        <Alert
          type="warning"
          message="403 Prohibido: Tu rol actual no tiene autorización para consultar este catálogo."
        />
      )}
      {error && !forbidden && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Selector de modo de vista (Cuadrícula Showcase / Tabla Rúbrica) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Modo de Vista:</span>
        <button
          type="button"
          className={`role-switch-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          title="Vista de Tarjetas Showcase (Diseño Visual)"
        >
          🎴 Cuadrícula
        </button>
        <button
          type="button"
          className={`role-switch-btn ${viewMode === 'table' ? 'active' : ''}`}
          onClick={() => setViewMode('table')}
          title="Vista de Tabla (Criterios Rúbrica)"
        >
          📋 Tabla
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Cargando catálogo...</p>
        </div>
      ) : viewMode === 'grid' ? (
        <TemplatesView
          templates={items}
          permissions={permissions}
          onOpenAddTemplate={() => {
            setEditingTemplate(null);
            setShowTemplateModal(true);
          }}
          onOpenEditTemplate={(tmpl) => {
            setEditingTemplate(tmpl);
            setShowTemplateModal(true);
          }}
          onDeleteTemplate={(id) => {
            const itm = items.find((x) => x.id === id);
            if (itm) setItemToDelete(itm);
          }}
          onSelectTemplateForClient={(tmpl) => setActiveDetailTemplate(tmpl)}
        />
      ) : (
        <div className="animate-fade-in">
          <div className="controls-bar" style={{ marginBottom: '24px' }}>
            <div>
              <span className="badge badge-developer" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
                SECCIONES 5 Y 6 · CRUD
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                Catálogo de Soluciones (Vista Tabla)
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Listado tabular para evaluación académica con rutas dinámicas :id y validación en 2 capas.
              </p>
            </div>

            {can('catalogos.create') && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setEditingTemplate(null);
                  setShowTemplateModal(true);
                }}
              >
                + Nuevo Registro
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon="📂"
              text="No se encontraron registros en el catálogo."
              action={
                can('catalogos.create') ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingTemplate(null);
                      setShowTemplateModal(true);
                    }}
                  >
                    Crear primer elemento
                  </button>
                ) : null
              }
            />
          ) : (
            <CatalogoTable
              items={items}
              loading={loading}
              onDelete={(item) => setItemToDelete(item)}
              can={can}
            />
          )}
        </div>
      )}

      {/* Modal de Creación / Edición Completa de Plantilla */}
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

      {/* Modal de Personalización para Cliente */}
      {activeDetailTemplate && (
        <TemplateDetailModal
          template={activeDetailTemplate}
          clients={clients}
          onClose={() => setActiveDetailTemplate(null)}
          onConfirmCreateProject={handleConfirmCreateProject}
        />
      )}

      {/* Diálogo de Confirmación para Eliminar (ConfirmDialog) */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Eliminar Registro de Catálogo"
        message="¿Estás seguro de que deseas eliminar este elemento del catálogo? Esta acción no se puede deshacer y será verificada por el backend en Laravel."
        itemName={itemToDelete?.title}
        isDeleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
