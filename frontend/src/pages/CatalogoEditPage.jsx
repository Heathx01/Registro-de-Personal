import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { catalogosApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import CatalogoForm from '../components/catalogos/CatalogoForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/ui/Alert';

export default function CatalogoEditPage() {
  const { id } = useParams(); // Captura dinámica del parámetro :id (Paso 9 y 12)
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Cargar el recurso con useEffect y el ID de la URL
  useEffect(() => {
    let ignore = false;

    async function loadItem() {
      try {
        setLoading(true);
        setError('');
        const data = await catalogosApi.get(id);
        if (!ignore) {
          setItem(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'No se pudo cargar el elemento solicitado.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadItem();
    return () => {
      ignore = true;
    };
  }, [id]);

  // Guardar cambios con PATCH/PUT y redirigir con useNavigate (Paso 10 y 12)
  const handleUpdateSubmit = async (formData) => {
    setSaving(true);
    setFormErrors({});
    try {
      await catalogosApi.update(id, formData);
      showToast('Registro actualizado exitosamente', 'success');
      navigate('/catalogos'); // Redirección SPA tras guardar
    } catch (err) {
      if (err.status === 422 || err.responseStatus === 422) {
        setFormErrors(err.errors || {});
      } else if (err.status === 403 || err.responseStatus === 403) {
        showToast('Acceso denegado: No tienes autorización para editar este registro.', 'error');
      } else {
        showToast(err.message || 'Error al actualizar el registro.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto', padding: '10px 0' }}>
      {/* Navegación y encabezado */}
      <div className="controls-bar" style={{ marginBottom: '24px' }}>
        <div>
          <Link
            to="/catalogos"
            className="role-switch-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              marginBottom: '10px',
              fontSize: '0.85rem',
            }}
          >
            ← Volver al Catálogo
          </Link>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            Editar Registro de Catálogo #{id}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Ruta dinámica con parámetro <code>:id</code> y precarga de datos con useEffect (Secciones 5 y 6).
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Cargando información del registro...</p>
        </div>
      ) : item ? (
        <div className="glass-card" style={{ padding: '32px', borderRadius: '20px' }}>
          <CatalogoForm
            initialData={item}
            onSubmit={handleUpdateSubmit}
            onCancel={() => navigate('/catalogos')}
            isSaving={saving}
            apiErrors={formErrors}
          />
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          El registro #{id} no fue encontrado o no está disponible.
        </div>
      )}
    </div>
  );
}
