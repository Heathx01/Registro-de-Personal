import React, { useState } from 'react';

export default function EmployeeModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (window.confirm('¿Deseas salir? Los datos no guardados en el formulario se perderán.')) {
        onClose();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const skills = formData.skillsText.split(',').map((s) => s.trim()).filter(Boolean);
      await onSave({
        ...formData,
        skills,
      });
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      const msg = err?.message || (err?.errors ? Object.values(err.errors).flat().join(', ') : 'Error al intentar guardar el usuario. Por favor verifique los campos.');
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Registrar Nuevo Empleado en la Empresa</h3>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.18)',
              border: '1px solid var(--rose)',
              color: '#fecdd3',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

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
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contraseña Inicial de Acceso</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="search-input"
                  style={{ paddingLeft: '12px', paddingRight: '40px', width: '100%' }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Puesto / Título del Empleo</label>
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
                <option value="Ventas y Estrategia Comercial">Ventas y Estrategia Comercial</option>
              </select>
            </div>
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
                <option value="sales">Ejecutivo de Ventas & BDM (Sales)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fecha de Contratación</label>
              <input
                type="date"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
              />
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
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar y Otorgar Accesos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
