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
  const [saving, setSaving] = useState(false);

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
    padding: '10px 14px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-card)',
    border: `1px solid ${errors[fieldName] ? 'var(--rose)' : 'var(--border-glass)'}`,
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  });

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.84rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
  };

  return (
    <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {/* Campo Título */}
        <div>
          <label style={labelStyle}>Título del Catálogo / Modelo *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="search-input"
            placeholder="Ej: SaaS ERP de Finanzas"
            style={inputStyle('title')}
          />
          {/* Mensaje de error 422 junto al campo (Paso 11) */}
          {errors.title && (
            <small className="error" style={{ color: 'var(--rose)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
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
            className="filter-select"
            style={inputStyle('category')}
          >
            <option value="web">Desarrollo Web & SaaS</option>
            <option value="mobile">Aplicación Móvil (iOS/Android)</option>
            <option value="enterprise">Sistema Empresarial (ERP/CRM)</option>
            <option value="ecommerce">E-Commerce & Pagos</option>
            <option value="ai">Inteligencia Artificial & Datos</option>
          </select>
          {errors.category && (
            <small className="error" style={{ color: 'var(--rose)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
              ⚠️ {errors.category[0]}
            </small>
          )}
        </div>
      </div>

      {/* Campo Descripción */}
      <div style={{ marginBottom: '16px' }}>
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
          <small className="error" style={{ color: 'var(--rose)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
            ⚠️ {errors.description[0]}
          </small>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
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
            <small className="error" style={{ color: 'var(--rose)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
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
            placeholder="Ej: 2 a 3 semanas"
            style={inputStyle('estimated_delivery')}
          />
        </div>

        {/* Campo Estado */}
        <div>
          <label style={labelStyle}>Estado de Disponibilidad</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="filter-select"
            style={inputStyle('status')}
          >
            <option value="active">Activo (Disponible)</option>
            <option value="inactive">Inactivo (Oculto)</option>
          </select>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        {onCancel && (
          <button
            type="button"
            disabled={isSaving}
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? 'Guardando cambios...' : initialData ? 'Actualizar Registro' : 'Crear Registro'}
        </button>
      </div>
    </form>
  );
}
