import React, { useState } from 'react';

export default function PersonnelView({ users, currentUser, permissions, onOpenAddModal, onDeleteUser, onUpdateUser }) {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.position.toLowerCase().includes(search.toLowerCase()) ||
      (user.skills && user.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())));

    const matchesDept = departmentFilter ? user.department === departmentFilter : true;
    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesDept && matchesRole;
  });

  const handleRoleChange = (userId, newRole) => {
    if (onUpdateUser) {
      onUpdateUser(userId, { role: newRole });
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    }
  };

  const handleUpdatePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordNotice('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (onUpdateUser && selectedUser) {
      onUpdateUser(selectedUser.id, { password: newPassword });
      setPasswordNotice('✅ Contraseña actualizada correctamente.');
      setNewPassword('');
      setTimeout(() => setPasswordNotice(''), 4000);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="controls-bar">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Base de Datos del Personal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Registro oficial de desarrolladores, ingenieros, líderes técnicos y personal administrativo ({users.length} miembros).
          </p>
        </div>

        {permissions.can_manage_users && (
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Registrar Nuevo Empleado
          </button>
        )}
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, correo, puesto o habilidad (React, PHP, Docker)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">Todos los Departamentos</option>
          <option value="Dirección Ejecutiva">Dirección Ejecutiva</option>
          <option value="Ingeniería de Software">Ingeniería de Software</option>
          <option value="Calidad y Seguridad">Calidad y Seguridad</option>
          <option value="Recursos Humanos">Recursos Humanos</option>
        </select>

        <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">Todos los Roles</option>
          <option value="admin">Director / Admin</option>
          <option value="lead">Tech Lead</option>
          <option value="developer">Developer</option>
          <option value="qa">QA Specialist</option>
          <option value="hr">Recursos Humanos</option>
        </select>
      </div>

      <div className="personnel-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="glass-card employee-card">
            <div className="card-top">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--indigo), var(--cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div className="card-details" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  {permissions.can_manage_users ? (
                    <select
                      className="filter-select"
                      style={{ padding: '2px 6px', fontSize: '0.75rem', height: '26px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid var(--cyan)', color: '#fff', borderRadius: '6px' }}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      title="Cambiar rol y privilegios de este usuario"
                    >
                      <option value="admin">admin (Director)</option>
                      <option value="lead">lead (Tech Lead)</option>
                      <option value="developer">developer (Dev)</option>
                      <option value="qa">qa (QA Lead)</option>
                      <option value="hr">hr (Recursos Humanos)</option>
                    </select>
                  ) : (
                    <span className={`badge badge-${user.role}`}>{user.role}</span>
                  )}
                  <span className={`badge badge-${user.status.toLowerCase().replace(' ', '')}`}>
                    ● {user.status}
                  </span>
                </div>
                <h3>{user.name}</h3>
                <p style={{ fontWeight: 600, color: 'var(--cyan)', marginTop: '2px' }}>{user.position}</p>
                <p style={{ fontSize: '0.78rem' }}>{user.department}</p>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div>📧 {user.email}</div>
              <div>📞 {user.phone || 'N/A'}</div>
              <div>📅 Ingreso: {user.hire_date || '2022-01-01'}</div>
            </div>

            {user.skills && user.skills.length > 0 && (
              <div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
                  STACK TÉCNICO / HABILIDADES:
                </p>
                <div className="skills-list">
                  {user.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.78rem', justifyContent: 'center' }}
                onClick={() => setSelectedUser(user)}
              >
                Ver Ficha Completa
              </button>

              {permissions.can_delete_records && user.id !== currentUser.id && (
                <button
                  className="btn btn-danger"
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  onClick={() => onDeleteUser(user.id)}
                  title="Eliminar empleado"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ficha Completa de Empleado */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, var(--indigo), var(--cyan))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.6rem',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : '👤'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedUser.name}</h3>
                  <p style={{ color: 'var(--cyan)', fontWeight: 600 }}>{selectedUser.position}</p>
                  <span className={`badge badge-${selectedUser.role}`} style={{ marginTop: '6px' }}>
                    {selectedUser.role.toUpperCase()}
                  </span>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>DEPARTAMENTO</span>
                <p style={{ fontWeight: 600 }}>{selectedUser.department}</p>
              </div>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ESTADO OPERATIVO</span>
                <p style={{ fontWeight: 600, color: 'var(--emerald)' }}>● {selectedUser.status}</p>
              </div>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>CORREO CORPORATIVO</span>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedUser.email}</p>
              </div>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TELÉFONO DE CONTACTO</span>
                <p style={{ fontWeight: 600 }}>{selectedUser.phone || '+52 55 0000 0000'}</p>
              </div>
            </div>

            {permissions.can_manage_users && (
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid var(--cyan)',
                  padding: '14px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <h4 style={{ fontSize: '0.88rem', color: 'var(--cyan)', fontWeight: 700 }}>
                  ⚙️ GESTIÓN DE CREDENCIALES Y PRIVILEGIOS (Acceso Administrador)
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '120px' }}>Asignar Rol:</label>
                  <select
                    className="filter-select"
                    style={{ flex: 1, background: 'rgba(15, 23, 42, 0.9)' }}
                    value={selectedUser.role}
                    onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                  >
                    <option value="admin">admin - Director General (Privilegios Totales)</option>
                    <option value="lead">lead - Tech Lead (Gestión de Proyectos y Tareas)</option>
                    <option value="developer">developer - Desarrollador (Acceso Base a Tareas)</option>
                    <option value="qa">qa - QA Specialist (Control de Calidad)</option>
                    <option value="hr">hr - Recursos Humanos (Gestión de Talento)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '120px' }}>Nueva Contraseña:</label>
                  <input
                    type="password"
                    placeholder="Establecer nueva contraseña..."
                    className="search-input"
                    style={{ flex: 1, paddingLeft: '12px' }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                    onClick={handleUpdatePassword}
                  >
                    Actualizar Contraseña
                  </button>
                </div>

                {passwordNotice && (
                  <span style={{ fontSize: '0.8rem', color: passwordNotice.includes('✅') ? 'var(--emerald)' : '#f87171' }}>
                    {passwordNotice}
                  </span>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>BIOGRAFÍA & PERFIL PROFESIONAL</h4>
              <p style={{ fontSize: '0.88rem', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                {selectedUser.bio || 'Desarrollador enfocado en soluciones de software de alto rendimiento.'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>DOMINIO DE TECNOLOGÍAS</h4>
              <div className="skills-list">
                {selectedUser.skills && selectedUser.skills.map((s, i) => (
                  <span key={i} className="skill-tag" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
