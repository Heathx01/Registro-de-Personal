import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ currentUser, activeTab, setActiveTab, onLogout, onOpenChangePassword }) {
  const { language, toggleLanguage, t, translatePos } = useLanguage();
  const canManageRoles = ['admin', 'lead', 'hr'].includes(currentUser?.role);
  const isDev = currentUser?.role === 'developer' || currentUser?.role === 'qa';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-logo" translate="no">Dev</div>
          <div className="brand-text">
            <h1>DevStudio HR Platform</h1>
            <p>{t('nav.brandSub')}</p>
          </div>
        </div>

        <nav className="nav-tabs">
          {canManageRoles && (
            <button
              className={`tab-btn ${activeTab === 'manager' ? 'active' : ''}`}
              onClick={() => setActiveTab('manager')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('nav.managerPanel')}
            </button>
          )}

          {isDev && (
            <button
              className={`tab-btn ${activeTab === 'developer' ? 'active' : ''}`}
              onClick={() => setActiveTab('developer')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              {t('nav.devWorkspace')}
            </button>
          )}

          <button
            className={`tab-btn ${activeTab === 'personnel' ? 'active' : ''}`}
            onClick={() => setActiveTab('personnel')}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {t('nav.personnelDb')}
          </button>

          <button
            className={`tab-btn ${activeTab === 'organigrama' ? 'active' : ''}`}
            onClick={() => setActiveTab('organigrama')}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {t('nav.organigrama')}
          </button>

          <button
            className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {t('nav.templates')}
          </button>

          {['admin', 'lead', 'sales'].includes(currentUser?.role) && (
            <button
              className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V5a2 2 0 012-2h2a2 2 0 012 2v6" />
              </svg>
              {t('nav.clients')}
            </button>
          )}

          {['admin', 'lead', 'hr'].includes(currentUser?.role) && (
            <button
              className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
              onClick={() => setActiveTab('roles')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t('nav.rolesMatrix')}
            </button>
          )}
        </nav>

        <div className="user-widget">
          {/* Botón Discreto de Cambio de Idioma */}
          <button
            onClick={toggleLanguage}
            className="btn btn-secondary"
            style={{
              padding: '4px 10px',
              fontSize: '0.72rem',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 700,
              color: 'var(--text-main)',
            }}
            title="Cambiar Idioma / Switch Language"
          >
            <span style={{ opacity: language === 'es' ? 1 : 0.4 }}>🇲🇽 ES</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ opacity: language === 'en' ? 1 : 0.4 }}>🇺🇸 EN</span>
          </button>

          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--indigo), var(--cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#ffffff',
            }}
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
          </div>
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">{translatePos(currentUser.position)}</span>
          </div>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            onClick={onOpenChangePassword}
            title="Seguridad & Cambiar Contraseña"
          >
            🔒 <span>Seguridad</span>
          </button>
          <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }} onClick={onLogout}>
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </header>
  );
}
