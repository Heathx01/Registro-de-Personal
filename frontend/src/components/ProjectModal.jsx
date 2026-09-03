import React, { useState, useEffect } from 'react';

export default function ProjectModal({ users, clients = [], editingProject = null, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Cloud SaaS Platform',
    status: 'Active',
    client_id: clients[0]?.id || '',
    project_type: 'Desarrollo Web',
    budget: 15000,
    currency: 'USD',
    billing_status: 'deposit_paid',
    tech_stackText: 'React, Node.js, PostgreSQL',
    lead_id: users[0]?.id || '',
    progress: 10,
    deadline: '2026-12-31',
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name || '',
        description: editingProject.description || '',
        category: editingProject.category || 'Cloud SaaS Platform',
        status: editingProject.status || 'Active',
        client_id: editingProject.client_id || (clients[0]?.id || ''),
        project_type: editingProject.project_type || 'Desarrollo Web',
        budget: editingProject.budget || 0,
        currency: editingProject.currency || 'USD',
        billing_status: editingProject.billing_status || 'deposit_paid',
        tech_stackText: Array.isArray(editingProject.tech_stack)
          ? editingProject.tech_stack.join(', ')
          : 'React, Node.js',
        lead_id: editingProject.lead_id || (users[0]?.id || ''),
        progress: editingProject.progress || 0,
        deadline: editingProject.deadline || '2026-12-31',
      });
    }
  }, [editingProject, clients, users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tech_stack = formData.tech_stackText.split(',').map((s) => s.trim()).filter(Boolean);
    onSave({
      ...formData,
      tech_stack,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {editingProject ? 'Editar Proyecto de Software' : 'Crear Nuevo Proyecto de Software'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Asignación técnica, líder de proyecto y vinculación comercial con cliente.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nombre del Proyecto *</label>
            <input
              type="text"
              required
              className="search-input"
              style={{ paddingLeft: '12px' }}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cliente / Empresa Asociada *</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              >
                <option value="">-- Sin Cliente Asignado --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    🏢 {c.name} ({c.company_type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tipo de Proyecto</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.project_type}
                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
              >
                <option value="Desarrollo Web">Desarrollo Web</option>
                <option value="App Móvil">App Móvil</option>
                <option value="SaaS Enterprise">SaaS Enterprise</option>
                <option value="Mantenimiento & Soporte">Mantenimiento & Soporte</option>
                <option value="Consultoría / Arquitectura">Consultoría / Arquitectura</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Descripción del Producto</label>
            <textarea
              className="search-input"
              style={{ paddingLeft: '12px', minHeight: '60px' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Presupuesto / Costo</label>
              <input
                type="number"
                min="0"
                step="500"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Moneda</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="USD">USD ($)</option>
                <option value="MXN">MXN ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estado de Cobro</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.billing_status}
                onChange={(e) => setFormData({ ...formData, billing_status: e.target.value })}
              >
                <option value="pending">Pendiente</option>
                <option value="deposit_paid">Anticipo 50% Pagado</option>
                <option value="invoiced">Facturado</option>
                <option value="paid">Totalmente Pagado</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Categoría</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Cloud SaaS Platform">Cloud SaaS Platform</option>
                <option value="Mobile Fintech App">Mobile Fintech App</option>
                <option value="Web App / Internal Tool">Web App / Internal Tool</option>
                <option value="AI Engine & Analytics">AI Engine & Analytics</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Líder de Proyecto (Lead)</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.lead_id}
                onChange={(e) => setFormData({ ...formData, lead_id: e.target.value })}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.position})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stack Tecnológico (Separados por coma)</label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '12px' }}
              value={formData.tech_stackText}
              onChange={(e) => setFormData({ ...formData, tech_stackText: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avance (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fecha Límite (Deadline)</label>
              <input
                type="date"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
