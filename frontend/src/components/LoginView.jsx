import React, { useState } from 'react';
import { login, emergencyUnlock } from '../services/api';

export default function LoginView({ onLoginSuccess }) {
  // Campos de Login
  const [loginEmail, setLoginEmail] = useState('admin@devstudio.com');
  const [loginPassword, setLoginPassword] = useState('admin123');

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLockedAccount, setIsLockedAccount] = useState(false);

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setIsLockedAccount(false);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.status === 'success' || res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      if (err.is_locked || err.responseStatus === 423) {
        setIsLockedAccount(true);
        setErrorMsg('🛑 CUENTA BLOQUEADA POR SEGURIDAD. Ha acumulado 3 intentos fallidos.');
      } else {
        setErrorMsg(err.message || 'Credenciales de acceso incorrectas.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, pass) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMsg('');
    setSuccessMsg('');
    setIsLockedAccount(false);
  };

  const handleUnlockClick = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await emergencyUnlock(loginEmail);
      setSuccessMsg(res.message || '✅ Cuenta desbloqueada exitosamente. Intenta iniciar sesión nuevamente.');
      setIsLockedAccount(false);
    } catch (err) {
      setErrorMsg('Error al desbloquear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.18) 0%, transparent 65%)',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px',
          boxShadow: 'var(--shadow-glow)',
          border: '1px solid var(--border-glass-accent)',
          borderRadius: '24px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            className="brand-logo"
            translate="no"
            style={{ width: '56px', height: '56px', fontSize: '1.6rem', margin: '0 auto 12px' }}
          >
            Dev
          </div>
          <h2 style={{ fontSize: '1.55rem', fontWeight: 800 }}>DevStudio HR Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Acceso Corporativo de Personal & Control de Proyectos
          </p>
        </div>

        {/* Mensaje de exito */}
        {successMsg && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid #10b981',
              color: '#a7f3d0',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Mensaje de error */}
        {errorMsg && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.18)',
              border: '1px solid var(--rose)',
              color: '#fecdd3',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Botón de desbloqueo de emergencia si la cuenta está bloqueada */}
        {isLockedAccount && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleUnlockClick}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(99, 102, 241, 0.3))',
                border: '1px solid #10b981',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              🔓 Desbloquear Cuenta de Emergencia
            </button>
          </div>
        )}

        {/* Acceso Rápido Demo / Pre-llenado de credenciales */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            ⚡ Accesos Rápido de Demostración:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@devstudio.com', 'admin123')}
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              👑 Admin (`admin123`)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('sales@devstudio.com', 'password123')}
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              💼 Ventas (`password123`)
            </button>
          </div>
        </div>

        {/* FORMULARIO DE INICIO DE SESIÓN CENTRALIZADO */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Correo Electrónico Corporativo
            </label>
            <input
              type="email"
              required
              className="search-input"
              style={{ paddingLeft: '14px', borderRadius: '12px' }}
              placeholder="nombre@devstudio.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Contraseña
            </label>
            <input
              type="password"
              required
              className="search-input"
              style={{ paddingLeft: '14px', borderRadius: '12px' }}
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ justifyContent: 'center', padding: '12px', marginTop: '6px', fontSize: '0.95rem', borderRadius: '12px' }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Desbloqueo manual en cualquier momento */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleUnlockClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            🔓 Restablecer / Desbloquear credenciales de acceso
          </button>
        </div>

        {/* Nota de seguridad institucional */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
            🔒 <strong>Acceso Restringido:</strong> El alta de cuentas y asignación de credenciales se realiza de forma centralizada por el Administrador de TI / Recursos Humanos.
          </p>
        </div>
      </div>
    </div>
  );
}
