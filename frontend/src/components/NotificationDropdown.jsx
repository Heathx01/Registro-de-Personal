import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationDropdown({ currentUser, isOpen, onClose, setActiveTab }) {
  const { t } = useLanguage();
  const dropdownRef = useRef(null);

  // Key for localStorage persistence per user
  const storageKey = `devstudio_notifications_${currentUser?.id || 'guest'}`;

  // Default initial notifications list
  const getInitialNotifications = () => {
    const isDev = currentUser?.role === 'developer' || currentUser?.role === 'qa';
    const isManager = ['admin', 'lead', 'hr'].includes(currentUser?.role);

    return [
      {
        id: 'notif-1',
        title: isDev ? 'Nueva Tarea Asignada' : 'Tarea del Equipo Actualizada',
        message: isDev
          ? 'Se te ha asignado la tarea: "Optimizar consultas SQL en reportes HR".'
          : 'El desarrollador ha actualizado el estado de una tarea crítica.',
        time: 'Hace 10 min',
        type: 'task',
        read: false,
        linkTab: isDev ? 'developer' : 'tasks',
      },
      {
        id: 'notif-2',
        title: 'Inicio de Sesión Detectado',
        message: `Autenticación exitosa desde el navegador web para ${currentUser?.name || 'Usuario'}.`,
        time: 'Hace 45 min',
        type: 'security',
        read: false,
      },
      {
        id: 'notif-3',
        title: 'Avance de Proyecto',
        message: 'El proyecto "DevStudio HR Platform" alcanzó el 85% de entregables.',
        time: 'Hace 2 horas',
        type: 'project',
        read: false,
        linkTab: 'projects',
      },
      {
        id: 'notif-4',
        title: 'Recordatorio del Sistema',
        message: 'Revisión trimestral de políticas de seguridad y desempeño de equipo.',
        time: 'Ayer',
        type: 'info',
        read: true,
      },
    ];
  };

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : getInitialNotifications();
    } catch {
      return getInitialNotifications();
    }
  });

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'system'

  // Persist notifications to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications to localStorage:', e);
    }
  }, [notifications, storageKey]);

  // Click outside to close listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notif) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    // If notification has a link tab, navigate to it
    if (notif.linkTab && setActiveTab) {
      setActiveTab(notif.linkTab);
      onClose();
    }
  };

  // Filtered list
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'system') return n.type === 'security' || n.type === 'info';
    return true;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'task':
        return { icon: '📋', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' };
      case 'security':
        return { icon: '🔒', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' };
      case 'project':
        return { icon: '🚀', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.3)' };
      default:
        return { icon: 'ℹ️', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)' };
    }
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: '0',
        width: '380px',
        maxWidth: '92vw',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(24px)',
        borderRadius: '16px',
        border: '1px solid var(--border-glass-accent)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(6, 182, 212, 0.15)',
        zIndex: 1000,
        animation: 'fadeIn 0.2s ease-out',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(30, 41, 59, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>🔔</span>
          <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t('notifications.title') || 'Centro de Notificaciones'}
          </h3>
          {unreadCount > 0 && (
            <span
              style={{
                background: 'linear-gradient(135deg, var(--rose), #e11d48)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                boxShadow: '0 0 8px rgba(244, 63, 94, 0.4)',
              }}
            >
              {unreadCount} {t('notifications.unreadBadge') || 'sin leer'}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            fontSize: '1rem',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
          }}
          title="Cerrar"
        >
          ✕
        </button>
      </div>

      {/* Control Buttons & Tabs */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.5)',
        }}
      >
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'all', label: t('notifications.tabAll') || 'Todas' },
            { id: 'unread', label: t('notifications.tabUnread') || 'No leídas' },
            { id: 'system', label: t('notifications.tabSystem') || 'Sistema' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: filter === tab.id ? 'var(--cyan)' : 'transparent',
                color: filter === tab.id ? '#0f172a' : 'var(--text-muted)',
                fontWeight: filter === tab.id ? 800 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-glass)',
                color: 'var(--cyan)',
                fontSize: '0.72rem',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              title="Marcar todas como leídas"
            >
              ✓ {t('notifications.markAllRead') || 'Marcar leídas'}
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                fontSize: '0.72rem',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              title="Limpiar todas las notificaciones"
            >
              🗑️ {t('notifications.clearAll') || 'Limpiar'}
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div
        style={{
          maxHeight: '340px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5 }}>🔕</div>
            {filter === 'unread'
              ? t('notifications.emptyUnread') || 'No tienes notificaciones sin leer.'
              : t('notifications.empty') || 'No tienes notificaciones en este momento.'}
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const badge = getTypeBadge(item.type);
            return (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  background: !item.read ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = !item.read
                    ? 'rgba(59, 130, 246, 0.14)'
                    : 'rgba(255, 255, 255, 0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = !item.read
                    ? 'rgba(59, 130, 246, 0.08)'
                    : 'transparent';
                }}
              >
                {/* Category Icon Badge */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {badge.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '3px',
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        fontWeight: item.read ? 600 : 800,
                        color: item.read ? 'var(--text-main)' : '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </h4>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', flexShrink: 0 }}>
                      {item.time}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      lineHeight: '1.35',
                    }}
                  >
                    {item.message}
                  </p>

                  {item.linkTab && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '6px',
                        fontSize: '0.7rem',
                        color: 'var(--cyan)',
                        fontWeight: 600,
                      }}
                    >
                      Ver en el módulo ➔
                    </span>
                  )}
                </div>

                {/* Action Controls (Read toggle / Delete) */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    marginLeft: '4px',
                  }}
                >
                  {!item.read && (
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--cyan)',
                        boxShadow: '0 0 8px var(--cyan)',
                      }}
                      title="No leída"
                    />
                  )}
                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      opacity: 0.6,
                      padding: '2px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                    title="Eliminar notificación"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(30, 41, 59, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          <span>{t('notifications.systemSync') || 'Sincronizado con DevStudio Cloud'}</span>
        </div>
        <span>{notifications.length} total</span>
      </div>
    </div>
  );
}
