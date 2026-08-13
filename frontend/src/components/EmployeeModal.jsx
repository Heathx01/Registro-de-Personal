import React, { useState } from 'react';

export default function EmployeeModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    position: 'Junior Fullstack Engineer',
    department: 'Ingeniería de Software',
    role: 'developer',
    phone: '+52 55 ',
    status: 'Active',
    hire_date: new Date().toISOString().split('T')[0],
    skillsText: 'React, Node.js, Git',
    avatar: null,
    bio: 'Nuevo integrante del equipo de desarrollo de software.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const skills = formData.skillsText.split(',').map((s) => s.trim()).filter(Boolean);
    onSave({
      ...formData,
      skills,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Registrar Nuevo Empleado en la Empresa</h3>
          <button className="btn btn-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nombre Completo</label>
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
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Correo Empresarial</label>
              <input
                type="email"
                required
                className="search-input"
                style={{ paddingLeft: '12px' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Teléfono</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Puesto / Titulo del Empleo</label>
              <input
                type="text"
                required
                className="search-input"
                style={{ paddingLeft: '12px' }}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Departamento</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Dirección Ejecutiva">Dirección Ejecutiva</option>
                <option value="Ingeniería de Software">Ingeniería de Software</option>
                <option value="Calidad y Seguridad">Calidad y Seguridad</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rol de Acceso y Privilegios</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="admin">Director General (Admin)</option>
                <option value="lead">Líder Técnico (Tech Lead)</option>
                <option value="developer">Desarrollador (Dev)</option>
                <option value="qa">QA Specialist</option>
                <option value="hr">Recursos Humanos (HR)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estado Inicial</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active (Presencial)</option>
                <option value="Remote">Remote (Remoto)</option>
                <option value="In Meeting">In Meeting</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Habilidades / Stack Tecnológico (Separados por coma)</label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '12px' }}
              value={formData.skillsText}
              onChange={(e) => setFormData({ ...formData, skillsText: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Breve Descripción / Biografía</label>
            <textarea
              className="search-input"
              style={{ paddingLeft: '12px', minHeight: '60px' }}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar y Otorgar Accesos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
