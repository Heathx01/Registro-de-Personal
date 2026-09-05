import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ currentUser, activeTab, setActiveTab, onLogout, onOpenChangePassword }) {
  const { language, toggleLanguage, t, translatePos } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const storageKey = `devstudio_notifications_${currentUser?.id || 'guest'}`;

  useEffect(() => {
    const checkUnread = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const list = JSON.parse(saved);
          const count = list.filter((n) => !n.read).length;
          setUnreadCount(count);
        } else {
          setUnreadCount(3);
        }
      } catch {
        setUnreadCount(0);
      }
    };
    checkUnread();
    const interval = setInterval(checkUnread, 1000);
    return () => clearInterval(interval);
  }, [storageKey, isNotificationOpen]);

  const canManageRoles = ['admin', 'lead', 'hr'].includes(currentUser?.role);
  // Cada variable controla la visibilidad de un módulo de navegación según el rol.
  // Esto mejora la experiencia, pero la autorización definitiva está en el backend.
  const isDev = currentUser?.role === 'developer' || currentUser?.role === 'qa';
  const canViewProjects = ['admin', 'lead', 'developer'].includes(currentUser?.role);
  const canViewTasks = ['admin', 'lead', 'developer', 'qa'].includes(currentUser?.role);
  const canViewClients = ['admin', 'lead', 'sales'].includes(currentUser?.role);
  const canViewTemplates = ['admin', 'lead', 'developer', 'sales'].includes(currentUser?.role);
  const canViewPersonnel = ['admin', 'lead', 'hr'].includes(currentUser?.role);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  // Helper to map tab id to readable label and icon
  const getTabDetails = (id) => {
    switch (id) {
      case 'manager':
        return { label: t('nav.managerPanel'), icon: '📊' };
      case 'developer':
        return { label: t('nav.devWorkspace'), icon: '🎯' };
      case 'personnel':
        return { label: t('nav.personnelDb'), icon: '👥' };
      case 'organigrama':
        return { label: t('nav.organigrama'), icon: '🌳' };
      case 'templates':
        return { label: t('nav.templates'), icon: '📑' };
      case 'projects':
        return { label: t('nav.projects'), icon: '🚀' };
      case 'tasks':
        return { label: t('nav.tasks'), icon: '📋' };
      case 'clients':
        return { label: t('nav.clients'), icon: '🏢' };
      case 'roles':
        return { label: t('nav.rolesMatrix'), icon: '🛡️' };
      case 'leave':
        return { label: t('nav.leaveRequests'), icon: '🏖️' };
      default:
        return { label: '', icon: '📌' };
    }
  };

  const currentTabInfo = getTabDetails(activeTab);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Left section: Hamburger button & Brand */}
          <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-expanded={isSidebarOpen}
              aria-controls="main-navigation"
              className="btn btn-secondary"
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: isSidebarOpen ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                border: isSidebarOpen ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                color: isSidebarOpen ? 'var(--cyan)' : 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'all 0.2s ease',
              }}
              title="Abrir Menú de Navegación"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hide-mobile">{t('nav.menu')}</span>
            </button>

            <div
              className="brand"
              role="button"
              tabIndex="0"
              aria-label="Ir al panel principal"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (canManageRoles) handleTabClick('manager');
                else if (currentUser?.role === 'developer') handleTabClick('developer');
                else if (currentUser?.role === 'qa') handleTabClick('tasks');
                else if (currentUser?.role === 'sales') handleTabClick('clients');
                else if (canViewPersonnel) handleTabClick('personnel');
                else handleTabClick('organigrama');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.currentTarget.click();
                }
              }}
            >
              <div className="brand-logo" translate="no">Dev</div>
              <div className="brand-text">
                <h1>DevStudio HR</h1>
                <p>{t('nav.brandSub')}</p>
              </div>
            </div>
          </div>

          {/* Center section: Active view breadcrumb pill */}
          <div
            className="hide-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-glass-accent)',
              boxShadow: '0 0 15px rgba(59,130,246,0.1)',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>{currentTabInfo.icon}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {currentTabInfo.label}
            </span>
          </div>

          {/* Right section: Controls & User info */}
          <div className="user-widget">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="btn btn-secondary"
              style={{
                padding: '5px 12px',
                fontSize: '0.74rem',
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

            {/* Notification Bell & Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                aria-label={t('notifications.title') || 'Notificaciones'}
                aria-expanded={isNotificationOpen}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '7px',
                  borderRadius: '50%',
                  background: isNotificationOpen ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.04)',
                  border: isNotificationOpen ? '1px solid var(--cyan)' : '1px solid var(--border-glass)',
                  color: isNotificationOpen ? 'var(--cyan)' : 'var(--text-main)',
                  transition: 'all 0.2s ease',
                  boxShadow: isNotificationOpen ? '0 0 12px rgba(6, 182, 212, 0.3)' : 'none',
                }}
                title={t('notifications.title') || 'Notificaciones'}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: 'linear-gradient(135deg, var(--rose), #e11d48)',
                      color: 'white',
                      fontSize: '0.58rem',
                      fontWeight: 'bold',
                      padding: '2px 5px',
                      borderRadius: '10px',
                      boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                currentUser={currentUser}
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* User Avatar & Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '4px' }}>
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
                  boxShadow: '0 0 10px rgba(6,182,212,0.2)',
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div className="user-info hide-mobile">
                <span className="user-name">{currentUser?.name}</span>
                <span className="user-role">{translatePos(currentUser?.position)}</span>
              </div>
            </div>

            {/* Security & Logout buttons */}
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={onOpenChangePassword}
              title="Seguridad & Cambiar Contraseña"
            >
              🔒 <span className="hide-mobile">Seguridad</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
              onClick={onLogout}
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for sidebar */}
      {isSidebarOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            animation: 'fadeIn 0.2s ease-out',
          }}
        />
      )}

      {/* Collapsible Slide-over Sidebar Drawer */}
      <aside
        id="main-navigation"
        aria-label="Navegación principal"
        aria-hidden={!isSidebarOpen}
        inert={!isSidebarOpen}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '310px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-glass-accent)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-glass)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-logo" translate="no" style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>Dev</div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>DevStudio HR</h2>
              <span style={{ fontSize: '0.7rem', color: 'var(--cyan)', fontWeight: 600 }}>Enterprise Suite</span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Cerrar menú de navegación"
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Sidebar Body: Categorized Menu Items */}
        <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Categoría 1: GESTIÓN & ANALÍTICA */}
          <div>
            <h4 style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '12px' }}>
              {t('nav.catManagement')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {canManageRoles && (
                <SidebarMenuItem
                  icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                  label={t('nav.managerPanel')}
                  isActive={activeTab === 'manager'}
                  onClick={() => handleTabClick('manager')}
                />
              )}

              {isDev && (
                <SidebarMenuItem
                  icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                  label={t('nav.devWorkspace')}
                  isActive={activeTab === 'developer'}
                  onClick={() => handleTabClick('developer')}
                />
              )}
            </div>
          </div>

          {/* Categoría 2: PROYECTOS & OPERACIONES */}
          <div>
            <h4 style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '12px' }}>
              {t('nav.catProjects')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {canViewProjects && (
                <SidebarMenuItem
                  icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                  label={t('nav.projects')}
                  isActive={activeTab === 'projects'}
                  onClick={() => handleTabClick('projects')}
                />
              )}

              {canViewTasks && (
                <SidebarMenuItem
                  icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                  label={t('nav.tasks')}
                  isActive={activeTab === 'tasks'}
                  onClick={() => handleTabClick('tasks')}
                />
              )}

              {canViewClients && (
                <SidebarMenuItem
                  icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V5a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>}
                  label={t('nav.clients')}
                  isActive={activeTab === 'clients'}
                  onClick={() => handleTabClick('clients')}
                />
              )}

              {canViewTemplates && (
                <SidebarMenuItem
                  icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                  label={t('nav.templates')}
                  isActive={activeTab === 'templates'}
                  onClick={() => handleTabClick('templates')}
                />
              )}
            </div>
          </div>

          {/* Categoría 3: RECURSOS HUMANOS */}
          <div>
            <h4 style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '12px' }}>
              {t('nav.catHr')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {canViewPersonnel && (
                <SidebarMenuItem
                  icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                  label={t('nav.personnelDb')}
                  isActive={activeTab === 'personnel'}
                  onClick={() => handleTabClick('personnel')}
                />
              )}

              <SidebarMenuItem
                icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                label={t('nav.organigrama')}
                isActive={activeTab === 'organigrama'}
                onClick={() => handleTabClick('organigrama')}
              />

              <SidebarMenuItem
                icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                label={t('nav.leaveRequests')}
                isActive={activeTab === 'leave'}
                onClick={() => handleTabClick('leave')}
              />

              {canManageRoles && (
                <SidebarMenuItem
                  icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  label={t('nav.rolesMatrix')}
                  isActive={activeTab === 'roles'}
                  onClick={() => handleTabClick('roles')}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: User Card */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-glass)',
            background: 'rgba(3, 7, 18, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
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
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentUser?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--cyan)' }}>{translatePos(currentUser?.position)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              aria-label="Cambiar contraseña"
              onClick={onOpenChangePassword}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                color: 'var(--text-main)',
              }}
              title="Cambiar Contraseña"
            >
              🔒
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Subcomponent for Sidebar Items
function SidebarMenuItem({ icon, label, isActive, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: '10px',
        border: 'none',
        background: isActive ? 'linear-gradient(90deg, rgba(59,130,246,0.18) 0%, rgba(6,182,212,0.08) 100%)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--cyan)' : '3px solid transparent',
        color: isActive ? '#ffffff' : 'var(--text-muted)',
        fontWeight: isActive ? 700 : 500,
        fontSize: '0.88rem',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.color = '#ffffff';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-muted)';
        }
      }}
    >
      <span style={{ color: isActive ? 'var(--cyan)' : 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {isActive && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
      )}
    </button>
  );
}
