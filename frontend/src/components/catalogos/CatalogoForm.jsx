import React, { useState, useEffect } from 'react';

export default function CatalogoForm({
  initialData = null,
  onSubmit,
  onCancel,
  isSaving = false,
  apiErrors = {},
}) {
  const defaultState = {
    title: '',
    category: 'web',
    description: '',
    suggested_price: '',
    estimated_delivery: '',
    demo_url: '',
    image_url: '',
    status: 'active',
  };

  // Estados separados del formulario (Paso 2 - Sección 6)
  const [form, setForm] = useState(defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        category: initialData.category || 'web',
        description: initialData.description || '',
        suggested_price: initialData.suggested_price || '',
        estimated_delivery: initialData.estimated_delivery || '',
        demo_url: initialData.demo_url || '',
        image_url: initialData.image_url || '',
        status: initialData.status || 'active',
      });
    }
  }, [initialData]);

  // Sincronizar errores 422 recibidos de la API
  useEffect(() => {
    if (apiErrors && Object.keys(apiErrors).length > 0) {
      setErrors(apiErrors);
    }
  }, [apiErrors]);

  // Manejador unificado de cambios para inputs controlados (Paso 1 - Sección 6)
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Limpiar error del campo modificado para mejorar la UX
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: `1px solid ${errors[fieldName] ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  const labelStyle = {
    display: 'block',
    marginBottom: '0.35rem',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#cbd5e1',
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        {/* Campo Título */}
        <div>
          <label style={labelStyle}>Título del Catálogo / Modelo *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ej: SaaS ERP de Finanzas"
            style={inputStyle('title')}
          />
          {/* Mensaje de error 422 junto al campo (Paso 11) */}
          {errors.title && (
            <small className="error" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>
              ⚠️ {errors.title[0]}
            </small>
          )}
        </div>

        {/* Campo Categoría */}
        <div>
          <label style={labelStyle}>Categoría *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={inputStyle('category')}
          >
            <option value="web">Desarrollo Web & SaaS</option>
            <option value="mobile">Aplicación Móvil (iOS/Android)</option>
            <option value="enterprise">Sistema Empresarial (ERP/CRM)</option>
            <option value="ecommerce">E-Commerce & Pagos</option>
            <option value="ai">Inteligencia Artificial & Datos</option>
          </select>
          {errors.category && (
            <small className="error" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>
              ⚠️ {errors.category[0]}
            </small>
          )}
        </div>
      </div>

      {/* Campo Descripción */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Descripción detallada *</label>
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe la solución técnica, valor y componentes incluidos..."
          style={{ ...inputStyle('description'), resize: 'vertical' }}
        />
        {errors.description && (
          <small className="error" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>
            ⚠️ {errors.description[0]}
          </small>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Campo Precio */}
        <div>
          <label style={labelStyle}>Precio Sugerido ($ USD)</label>
          <input
            type="number"
            step="0.01"
            name="suggested_price"
            value={form.suggested_price}
            onChange={handleChange}
            placeholder="Ej: 2500.00"
            style={inputStyle('suggested_price')}
          />
          {errors.suggested_price && (
            <small className="error" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>
              ⚠️ {errors.suggested_price[0]}
            </small>
          )}
        </div>

        {/* Campo Tiempo Estimado */}
        <div>
          <label style={labelStyle}>Tiempo Estimado de Entrega</label>
          <input
            type="text"
            name="estimated_delivery"
            value={form.estimated_delivery}
            onChange={handleChange}
            placeholder="Ej: 3-4 semanas"
            style={inputStyle('estimated_delivery')}
          />
          {errors.estimated_delivery && (
            <small className="error" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>
              ⚠️ {errors.estimated_delivery[0]}
            </small>
          )}
        </div>

        {/* Campo Estado */}
        <div>
          <label style={labelStyle}>Estado de Disponibilidad</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={inputStyle('status')}
          >
            <option value="active">Activo (Disponible)</option>
            <option value="inactive">Inactivo (Oculto)</option>
          </select>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        {onCancel && (
          <button
            type="button"
            disabled={isSaving}
            onClick={onCancel}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          style={{
            padding: '0.65rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            background: isSaving ? '#4338ca' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#ffffff',
            fontWeight: 600,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          }}
        >
          {isSaving ? 'Guardando cambios...' : initialData ? 'Actualizar Registro' : 'Crear Registro'}
        </button>
      </div>
    </form>
  );
}
