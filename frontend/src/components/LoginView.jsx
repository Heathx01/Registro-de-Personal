import React, { useState } from 'react';
import { login, resetPassword, sendPasswordResetCode, emergencyUnlock } from '../services/api';

export default function LoginView({ onLoginSuccess }) {
  // En desarrollo local se precargan las credenciales del administrador creado
  // por el seeder de Laravel. En producción los campos permanecen vacíos.
  const defaultAdminEmail = import.meta.env.DEV ? 'admin@devstudio.com' : '';
  const defaultAdminPassword = import.meta.env.DEV ? 'admin123' : '';

  // Modo de la pantalla: 'login' o 'reset'
  const [isResetMode, setIsResetMode] = useState(false);

  // Campos de Login
  const [loginEmail, setLoginEmail] = useState(defaultAdminEmail);
  const [loginPassword, setLoginPassword] = useState(defaultAdminPassword);

  // Campos para Cambio / Reestablecimiento de Contraseña
  const [resetEmail, setResetEmail] = useState(defaultAdminEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLockedAccount, setIsLockedAccount] = useState(false);

  // Fortaleza de la clave
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: '⚠️ Débil', color: '#ef4444' };
    if (score <= 4) return { score: 2, label: '🟡 Aceptable / Media', color: '#f59e0b' };
    return { score: 3, label: '🟢 Excelente / Muy Segura', color: '#10b981' };
  };

  const strength = calculateStrength(newPassword);

  // Submit de Login tradicional
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

  // Submit de Cambio de Contraseña (estilo Facebook/Instagram/X)
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!resetCodeSent) {
      setLoading(true);
      try {
        const res = await sendPasswordResetCode(resetEmail);
        setResetCodeSent(true);
        setSuccessMsg(res.message || 'Revisa tu correo electrónico para ver tu código de verificación.');
      } catch (err) {
        setErrorMsg(err.message || 'No se pudo enviar el código de verificación.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!/^\d{4}$/.test(verificationCode)) {
      setErrorMsg('Ingresa el código de verificación de 4 dígitos que recibiste en tu correo.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('⚠️ La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('❌ Las contraseñas ingresadas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(resetEmail, null, newPassword, confirmPassword, verificationCode);
      setSuccessMsg(res.message || '✅ Tu contraseña se ha actualizado correctamente. Ya puedes iniciar sesión.');
      setNewPassword('');
      setConfirmPassword('');
      setVerificationCode('');
      setResetCodeSent(false);
      // Después de 2 segundos volver al formulario de login con la nueva clave prellenada
      setTimeout(() => {
        setLoginEmail(resetEmail);
        setLoginPassword(newPassword);
        setIsResetMode(false);
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo actualizar la contraseña. Verifique el correo electrónico.');
    } finally {
      setLoading(false);
    }
  };

  // Desbloqueo directo de emergencia
  const handleUnlockClick = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const targetEmail = isResetMode ? resetEmail : loginEmail;
      const res = await emergencyUnlock(targetEmail);
      setSuccessMsg(res.message || '✅ Cuenta desbloqueada exitosamente.');
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
          <h2 style={{ fontSize: '1.55rem', fontWeight: 800 }}>
            {isResetMode ? '🔑 Reestablecer Contraseña' : 'DevStudio HR Portal'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            {isResetMode
              ? 'Ingresa tu correo corporativo para cambiar tu clave personal de acceso'
              : 'Acceso Corporativo de Personal & Control de Proyectos'}
          </p>
        </div>

        {/* Mensaje de éxito */}
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

        {/* Alerta de cuenta bloqueada */}
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

        {/* VISTA 1: FORMULARIO DE LOGIN TRADICIONAL */}
        {!isResetMode ? (
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
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setResetEmail(e.target.value);
                }}
              />
            </div>

            <div>
              <div style={{ marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                  Contraseña
                </label>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  required
                  className="search-input"
                  style={{ paddingLeft: '14px', paddingRight: '42px', borderRadius: '12px', width: '100%' }}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  aria-label={showLoginPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  title={showLoginPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  👁️
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ justifyContent: 'center', padding: '12px', marginTop: '6px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 800 }}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>

            {/* Enlace secundario en la parte inferior */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                🔒 ¿Deseas personalizar o cambiar tu contraseña inicial?
              </button>
            </div>
          </form>
        ) : (
          /* VISTA 2: FORMULARIO DE CAMBIO / REESTABLECIMIENTO DE CONTRASEÑA */
          <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Correo Electrónico de la Cuenta *
              </label>
              <input
                type="email"
                required
                className="search-input"
                style={{ paddingLeft: '14px', borderRadius: '12px' }}
                placeholder="nombre@devstudio.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>

            {resetCodeSent && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Código recibido por correo *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={4}
                  pattern="[0-9]{4}"
                  className="search-input"
                  style={{ paddingLeft: '14px', borderRadius: '12px', width: '100%', letterSpacing: '0.25em' }}
                  placeholder="1234"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '6px 0 0' }}>
                  Revisa tu correo electrónico e ingresa el código de 4 dígitos.
                </p>
              </div>
            )}

            {/* Nueva Contraseña */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Nueva Contraseña *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required={resetCodeSent}
                  minLength={6}
                  className="search-input"
                  style={{ paddingLeft: '14px', paddingRight: '42px', borderRadius: '12px', width: '100%' }}
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  aria-label={showNewPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  title={showNewPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  👁️
                </button>
              </div>

              {/* Medidor de Fortaleza */}
              {newPassword && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fortaleza de la clave:</span>
                    <strong style={{ color: strength.color }}>{strength.label}</strong>
                  </div>
                  <div style={{ height: '5px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(strength.score / 3) * 100}%`,
                        backgroundColor: strength.color,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Confirmar Nueva Contraseña *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required={resetCodeSent}
                  minLength={6}
                  className="search-input"
                  style={{
                    paddingLeft: '14px',
                    paddingRight: '42px',
                    borderRadius: '12px',
                    width: '100%',
                    borderColor: confirmPassword && newPassword !== confirmPassword ? '#ef4444' : '',
                  }}
                  placeholder="Repite tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  aria-label={showConfirmPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  title={showConfirmPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  👁️
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                  ❌ Las contraseñas no coinciden.
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ justifyContent: 'center', padding: '12px', marginTop: '6px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 800 }}
            >
              {loading ? (resetCodeSent ? 'Guardando...' : 'Enviando código...') : (resetCodeSent ? '🔒 Guardar Nueva Contraseña' : '📧 Enviar código al correo')}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="btn btn-secondary"
              style={{ justifyContent: 'center', padding: '10px', fontSize: '0.85rem', borderRadius: '12px' }}
            >
              ← Volver al Inicio de Sesión
            </button>
          </form>
        )}

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
