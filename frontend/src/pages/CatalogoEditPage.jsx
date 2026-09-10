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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Navegación y encabezado */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/catalogos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#a5b4fc',
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginBottom: '0.75rem',
            fontWeight: 500,
          }}
        >
          ← Volver al Catálogo
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
          Editar Elemento #{id}
        </h1>
        <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
          Ruta dinámica con parámetro <code>:id</code> y precarga de datos con useEffect.
        </p>
      </div>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando información del registro...</p>
        </div>
      ) : item ? (
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            padding: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <CatalogoForm
            initialData={item}
            onSubmit={handleUpdateSubmit}
            onCancel={() => navigate('/catalogos')}
            isSaving={saving}
            apiErrors={formErrors}
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          El registro #{id} no fue encontrado o no está disponible.
        </div>
      )}
    </div>
  );
}
