import React, { useState } from 'react';
import { login } from '../services/api';

export default function LoginView({ onLoginSuccess }) {
  // Campos de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.status === 'success' || res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      if (err.is_locked || err.responseStatus === 423) {
        setErrorMsg('🛑 CUENTA BLOQUEADA POR SEGURIDAD. Ha acumulado 3 intentos fallidos. Solicite al Administrador el desbloqueo.');
      } else {
        setErrorMsg(err.message || 'Credenciales de acceso incorrectas.');
      }
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
        background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px',
          boxShadow: 'var(--shadow-glow)',
          border: '1px solid var(--border-glass-accent)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            className="brand-logo"
            style={{ width: '52px', height: '52px', fontSize: '1.5rem', margin: '0 auto 12px' }}
          >
            Dev
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>DevStudio HR Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Acceso Corporativo de Personal & Control de Proyectos
          </p>
        </div>

        {/* Mensaje de error */}
        {errorMsg && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.18)',
              border: '1px solid var(--rose)',
              color: '#fecdd3',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </div>
        )}

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
              style={{ paddingLeft: '14px' }}
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
              style={{ paddingLeft: '14px' }}
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ justifyContent: 'center', padding: '12px', marginTop: '6px', fontSize: '0.95rem' }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Nota de seguridad institucional */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
            🔒 <strong>Acceso Restringido:</strong> El alta de cuentas y asignación de credenciales se realiza de forma centralizada por el Administrador de TI / Recursos Humanos.
          </p>
        </div>
      </div>
    </div>
  );
}

