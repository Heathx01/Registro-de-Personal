import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function PersonnelView({ users, currentUser, permissions, onOpenAddModal, onDeleteUser, onUpdateUser }) {
  const { t } = useLanguage();
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
      setPasswordNotice('⚠️ Password must be at least 6 characters.');
      return;
    }
    if (onUpdateUser && selectedUser) {
      onUpdateUser(selectedUser.id, { password: newPassword });
      setPasswordNotice('✅ Password updated successfully.');
      setNewPassword('');
      setTimeout(() => setPasswordNotice(''), 4000);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="controls-bar">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('personnel.title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {t('personnel.subtitle')} ({users.length})
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

      <div className="controls-bar">
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
          <option value="Dirección Ejecutiva">Dirección Ejecutiva</option>
          <option value="Ingeniería de Software">Ingeniería de Software</option>
          <option value="Calidad y Seguridad">Calidad y Seguridad</option>
          <option value="Recursos Humanos">Recursos Humanos</option>
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
                <p style={{ fontWeight: 600, color: 'var(--cyan)', marginTop: '2px' }}>{user.position}</p>
                <p style={{ fontSize: '0.78rem' }}>{user.department}</p>
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
                {t('common.details')} ➔
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
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('login.department')}</span>
                <p style={{ fontWeight: 600 }}>{selectedUser.department}</p>
              </div>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('common.status')}</span>
                <p style={{ fontWeight: 600, color: 'var(--emerald)' }}>● {selectedUser.status}</p>
              </div>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.email')}</span>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedUser.email}</p>
              </div>
              <div className="glass-card" style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('personnel.phone')}</span>
                <p style={{ fontWeight: 600 }}>{selectedUser.phone || 'N/A'}</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('personnel.bio')}</h4>
              <p style={{ fontSize: '0.88rem', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                {selectedUser.bio || 'Developer focused on high performance software solutions.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
