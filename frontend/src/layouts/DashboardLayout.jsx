import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ScrollProgressBar from '../components/ScrollProgressBar';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendPasswordChangeCode, changePassword } from '../services/api';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Mapeo de pathname actual a activeTab para compatibilidad visual con Navbar
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === '/') return 'manager';
    if (path.startsWith('/catalogos') || path.startsWith('/templates')) return 'templates';
    if (path.startsWith('/roles')) return 'roles';
    if (path.startsWith('/usuarios') || path.startsWith('/personnel')) return 'personnel';
    if (path.startsWith('/proyectos')) return 'projects';
    if (path.startsWith('/clientes')) return 'clients';
    if (path.startsWith('/tareas')) return 'tasks';
    if (path.startsWith('/organigrama')) return 'organigrama';
    if (path.startsWith('/ausencias')) return 'leave';
    return '';
  };

  const handleLogout = async () => {
    await logout();
    showToast('Sesión cerrada correctamente', 'info');
    navigate('/login', { replace: true });
  };

  const handleTabChange = (tabId) => {
    switch (tabId) {
      case 'manager':
      case 'developer':
        navigate('/');
        break;
      case 'templates':
        navigate('/catalogos');
        break;
      case 'roles':
        navigate('/roles');
        break;
      case 'personnel':
        navigate('/usuarios');
        break;
      case 'projects':
        navigate('/proyectos');
        break;
      case 'clients':
        navigate('/clientes');
        break;
      case 'tasks':
        navigate('/tareas');
        break;
      case 'organigrama':
        navigate('/organigrama');
        break;
      case 'leave':
        navigate('/ausencias');
        break;
      default:
        navigate('/');
    }
  };

  const handleSendCode = async () => {
    try {
      await sendPasswordChangeCode();
      showToast('Código de verificación enviado al correo', 'success');
      return true;
    } catch (e) {
      showToast(e.message || 'Error al solicitar código', 'error');
      return false;
    }
  };

  const handleChangePassword = async (payload) => {
    try {
      await changePassword(payload);
      showToast('Contraseña actualizada con éxito', 'success');
      setShowPasswordModal(false);
    } catch (e) {
      showToast(e.message || 'Error al cambiar contraseña', 'error');
    }
  };

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollProgressBar />

      {/* Header y Sidebar de Navegación */}
      <Navbar
        currentUser={user}
        activeTab={getActiveTabFromPath()}
        setActiveTab={handleTabChange}
        onLogout={handleLogout}
        onOpenChangePassword={() => setShowPasswordModal(true)}
      />

      {/* Área principal donde se renderizan las rutas hijas mediante <Outlet /> (Paso 8 - Sección 5) */}
      <main className="main-content" style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      {/* Modal de cambio de contraseña */}
      {showPasswordModal && (
        <ChangePasswordModal
          currentUser={user}
          onClose={() => setShowPasswordModal(false)}
          onRequestCode={handleSendCode}
          onSave={handleChangePassword}
        />
      )}

      <ScrollToTop />
    </div>
  );
}
