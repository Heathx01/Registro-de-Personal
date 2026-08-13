import React, { useState } from 'react';

export default function TaskModal({ users, projects, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: projects[0]?.id || '',
    assigned_to: users[0]?.id || '',
    priority: 'High',
    status: 'Pending',
    due_date: '2026-08-30',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Asignar Tarea Diaria al Personal</h3>
          <button className="btn btn-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Título de la Tarea</label>
            <input
              type="text"
              required
              className="search-input"
              style={{ paddingLeft: '12px' }}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Detalles de la Actividad / Criterios de Aceptación</label>
            <textarea
              className="search-input"
              style={{ paddingLeft: '12px', minHeight: '60px' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Proyecto Asociado</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Empleado Asignado</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.position})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nivel de Nivel Prioridad</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low (Baja)</option>
                <option value="Medium">Medium (Media)</option>
                <option value="High">High (Alta)</option>
                <option value="Critical">Critical (Urgente)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fecha Límite</label>
              <input
                type="date"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Asignar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
