import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function PersonnelView({ users, currentUser, permissions, onOpenAddModal, onDeleteUser, onUpdateUser }) {
  const { t, translateDept, translatePos } = useLanguage();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const activeUsersCount = users.filter((u) => !u.is_locked && u.status !== 'Inactive').length;
  const lockedUsersCount = users.filter((u) => u.is_locked).length;

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

  return (
    <div className="animate-fade-in">
      <div className="controls-bar" style={{ marginBottom: '20px' }}>
        <div>
          <span className="badge badge-lead" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
            🏢 RECURSOS HUMANOS & EXPEDIENTES
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('personnel.title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {t('personnel.subtitle')} ({users.length} expediente(s) activo(s))
          </p>
        </div>

        {permissions.can_manage_users && (
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {t('personnel.addEmployee')}
          </button>
        )}
      </div>

      {/* KPI Analytical Summary Cards para Recursos Humanos / Admin */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '18px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))' }}>
          <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{t('personnel.totalStaff')}</h4>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>{users.length}</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--cyan)' }}>{t('personnel.totalStaffSub')}</span>
        </div>

        <div className="glass-card" style={{ padding: '18px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))' }}>
          <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{t('personnel.unlockedUsers')}</h4>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--emerald)' }}>{activeUsersCount}</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--emerald)' }}>{t('personnel.unlockedUsersSub')}</span>
        </div>

        <div className="glass-card" style={{ padding: '18px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(245,158,11,0.1))' }}>
          <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{t('personnel.lockedUsers')}</h4>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: lockedUsersCount > 0 ? 'var(--rose)' : 'var(--text-dim)' }}>{lockedUsersCount}</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t('personnel.lockedUsersSub')}</span>
        </div>

        {permissions.can_view_salaries && (
          <div className="glass-card" style={{ padding: '18px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(99,102,241,0.1))' }}>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{t('personnel.confidentialSalary')}</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--purple)' }}>
              ${(users.reduce((acc, u) => acc + (u.salary || 3800), 0)).toLocaleString()} USD
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--purple)' }}>Nómina mensual total</span>
          </div>
        )}
      </div>

      <div className="controls-bar" style={{ marginBottom: '24px' }}>
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder={t('personnel.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">{t('personnel.allDepartments')}</option>
          <option value="Dirección Ejecutiva">{translateDept('Dirección Ejecutiva')}</option>
          <option value="Ingeniería de Software">{translateDept('Ingeniería de Software')}</option>
          <option value="Calidad y Seguridad">{translateDept('Calidad y Seguridad')}</option>
          <option value="Recursos Humanos">{translateDept('Recursos Humanos')}</option>
        </select>

        <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">{t('personnel.allRoles')}</option>
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
                    >
                      <option value="admin">admin</option>
                      <option value="lead">lead</option>
                      <option value="developer">developer</option>
                      <option value="qa">qa</option>
                      <option value="hr">hr</option>
                    </select>
                  ) : (
                    <span className={`badge badge-${user.role}`}>{user.role}</span>
                  )}
                  <span className={`badge badge-${user.status.toLowerCase().replace(' ', '')}`}>
                    ● {user.status === 'Active' || user.status === 'active' ? t('common.active') : user.status}
                  </span>
                </div>
                <h3>{user.name}</h3>
                <p style={{ fontWeight: 600, color: 'var(--cyan)', marginTop: '2px' }}>{translatePos(user.position)}</p>
                <p style={{ fontSize: '0.78rem' }}>{translateDept(user.department)}</p>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div>📧 {user.email}</div>
              <div>📞 {user.phone || 'N/A'}</div>
              <div>📅 {t('personnel.hireDate')}: {user.hire_date || '2022-01-01'}</div>
            </div>

            {user.skills && user.skills.length > 0 && (
              <div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
                  {t('personnel.skills')}:
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
                📋 {t('common.details')} ➔
              </button>

              {permissions.can_delete_records && user.id !== currentUser.id && (
                <button
                  className="btn btn-danger"
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  onClick={() => onDeleteUser(user.id)}
                  title={t('common.delete')}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Expediente Completo de Recursos Humanos */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Header del Expediente */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--indigo), var(--cyan))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.7rem',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : '👤'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedUser.name}</h3>
                    <span className={`badge badge-${selectedUser.role}`}>
                      {selectedUser.role.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ color: 'var(--cyan)', fontWeight: 600, marginTop: '2px' }}>{translatePos(selectedUser.position)}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{translateDept(selectedUser.department)}</p>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                ✕
              </button>
            </div>

            {/* Grid 1: Datos de Identificación & Contacto */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t('clients.email')}</span>
                <p style={{ fontWeight: 600, fontSize: '0.82rem', wordBreak: 'break-all' }}>{selectedUser.email}</p>
              </div>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t('clients.phone')}</span>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedUser.phone || '+52 55 1234 5678'}</p>
              </div>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t('personnel.hireDate')}</span>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedUser.hire_date || '2022-01-15'}</p>
              </div>
            </div>

            {/* Bloque 2: Compensación y Salario Confidencial (Acceso exclusivo HR/Admin) */}
            {permissions.can_view_salaries && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(99,102,241,0.08))',
                  border: '1px solid rgba(168,85,247,0.25)',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple)', margin: 0 }}>
                    {t('personnel.confidentialSalary')}
                  </h4>
                  <span className="badge" style={{ background: 'rgba(168,85,247,0.2)', color: 'var(--purple)' }}>
                    Acceso Restringido HR
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.salary')}</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--emerald)' }}>
                      ${(selectedUser.salary || 3800).toLocaleString()} USD
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.contractType')}</span>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      Tiempo Completo (Indefinido)
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.benefits')}</span>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--cyan)', marginTop: '4px' }}>
                      SGMM, Vales & Fondo de Ahorro
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bloque 3: Jornada Laboral & Turno */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--cyan)', marginBottom: '12px' }}>
                ⏰ {t('personnel.workShift')}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.shiftTime')}</span>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>09:00 AM - 06:00 PM</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.weeklyHours')}</span>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>40 hrs / Semana</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.workMode')}</span>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--cyan)' }}>💻 100% Remoto</div>
                </div>
              </div>
            </div>

            {/* Bloque 4: Registro de Asistencia & Horas Trabajadas */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--emerald)', marginBottom: '12px' }}>
                ⏱️ {t('personnel.timeTracking')}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.monthlyHours')}</span>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--emerald)' }}>160 hrs</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.punctuality')}</span>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--cyan)' }}>98.5% (Excelente)</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.vacationDays')}</span>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--amber)' }}>🌴 12 Días Disponibles</div>
                </div>
              </div>
            </div>

            {/* Biografía / Notas */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('personnel.bio')}</h4>
              <p style={{ fontSize: '0.88rem', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', color: 'var(--text-main)' }}>
                {selectedUser.bio || 'Especialista en desarrollo de software con amplia trayectoria en arquitectura web, liderazgo de equipos y entregables de alta calidad.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
