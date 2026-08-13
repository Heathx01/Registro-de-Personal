import React, { useState } from 'react';
import { login, registerUser } from '../services/api';

export default function LoginView({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);

  // Campos de Login (Administrador Único Inicial)
  const [loginEmail, setLoginEmail] = useState('admin@devstudio.com');
  const [loginPassword, setLoginPassword] = useState('admin123');

  // Campos de Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPosition, setRegPosition] = useState('Desarrollador de Software');
  const [regDepartment, setRegDepartment] = useState('Ingeniería de Software');
  const [regRole, setRegRole] = useState('developer');

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.status === 'success' || res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      if (err.is_locked || err.responseStatus === 423) {
        setErrorMsg('🛑 CUENTA BLOQUEADA POR SEGURIDAD. Ha acumulado 3 intentos fallidos. Solicite al Manager el desbloqueo.');
      } else {
        setErrorMsg(err.message || 'Credenciales de acceso incorrectas.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        position: regPosition,
        department: regDepartment,
        role: regRole,
      });

      if (res.status === 'success' || res.user) {
        setSuccessMsg('🎉 ¡Cuenta registrada con éxito! Iniciando sesión...');
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al registrar la cuenta. Intenta de nuevo.');
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
          maxWidth: '480px',
          padding: '36px',
          boxShadow: 'var(--shadow-glow)',
          border: '1px solid var(--border-glass-accent)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            className="brand-logo"
            style={{ width: '52px', height: '52px', fontSize: '1.5rem', margin: '0 auto 12px' }}
          >
            Dev
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>DevStudio HR Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Sistema de Registro de Personal y Gestión de Equipos
          </p>
        </div>

        {/* Pestañas Iniciar Sesión / Registrarse */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-glass)',
            marginBottom: '24px',
          }}
        >
          <button
            type="button"
            className={`tab-btn ${!isRegister ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`tab-btn ${isRegister ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Mensajes de error o éxito */}
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

        {successMsg && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid var(--emerald)',
              color: '#a7f3d0',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {successMsg}
          </div>
        )}

        {/* FORMULARIO 1: INICIAR SESIÓN */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Correo Electrónico
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

            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '10px' }}>
              ¿Aún no tienes tu cuenta?{' '}
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg('');
                }}
              >
                Regístrate aquí
              </button>
            </p>
          </form>
        ) : (
          /* FORMULARIO 2: REGISTRARSE */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Nombre Completo
              </label>
              <input
                type="text"
                required
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="Ej. Juan Pérez"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Correo Empresarial
              </label>
              <input
                type="email"
                required
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="juan@devstudio.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Puesto Inicial Solicitado
                </label>
                <input
                  type="text"
                  required
                  className="search-input"
                  style={{ paddingLeft: '12px' }}
                  placeholder="Ej. Frontend Developer"
                  value={regPosition}
                  onChange={(e) => setRegPosition(e.target.value)}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
                🔒 <em>Nota de seguridad: Los nuevos autoregistros se inician como Desarrollador. Únicamente el Administrador puede modificar puestos o conceder más privilegios.</em>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ justifyContent: 'center', padding: '12px', marginTop: '8px', fontSize: '0.95rem' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta e Iniciar Sesión'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              ¿Ya tienes cuenta activa?{' '}
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg('');
                }}
              >
                Inicia sesión aquí
              </button>
            </p>
          </form>
        )}

        {/* Footer simple con credencial del Administrador Único */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔑 Administrador Principal: <strong style={{ color: 'var(--cyan)' }}>admin@devstudio.com</strong> | Clave: <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
