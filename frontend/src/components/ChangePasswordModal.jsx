import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function ChangePasswordModal({ currentUser, onClose, onSave }) {
  const { t, translatePos } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Medidor de Fortaleza de Contraseña
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: t('security.weak'), color: '#ef4444' };
    if (score <= 4) return { score: 2, label: t('security.medium'), color: '#f59e0b' };
    return { score: 3, label: t('security.strong'), color: '#10b981' };
  };

  const strength = calculateStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg(t('security.tooShortError'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(t('security.mismatchError'));
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMsg(t('security.sameAsOldError'));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(currentPassword, newPassword, confirmPassword);
      setSuccessMsg(t('security.changeSuccess'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      const msg = err?.message || 'Error al actualizar la contraseña. Verifique su clave actual.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card modal-container animate-fade-in"
        style={{
          maxWidth: '540px',
          width: '100%',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Encabezado del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              🔒 {t('security.title')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>
              {t('security.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tarjeta con información del usuario autenticado */}
        {currentUser && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--indigo), var(--cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {t('security.currentUser')}
              </span>
              <h4 style={{ margin: '2px 0 0 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {currentUser.name} ({currentUser.email})
              </h4>
              <span className={`badge badge-${currentUser.role}`} style={{ marginTop: '4px', display: 'inline-block' }}>
                {translatePos(currentUser.position)}
              </span>
            </div>
          </div>
        )}

        {/* Mensajes de Alerta (Error / Éxito) */}
        {errorMsg && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid var(--rose)',
              color: '#fecdd3',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#a7f3d0',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Contraseña Actual */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
              🔑 {t('security.currentPassword')} *
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                className="input-field"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('security.currentPasswordPlaceholder')}
                style={{ width: '100%', borderRadius: '12px', paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
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
                {showCurrent ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
              ✨ {t('security.newPassword')} *
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showNew ? 'text' : 'password'}
                required
                minLength={6}
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('security.newPasswordPlaceholder')}
                style={{ width: '100%', borderRadius: '12px', paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
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
                {showNew ? '👁️' : '🔒'}
              </button>
            </div>

            {/* Medidor de Fortaleza */}
            {newPassword && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('security.strengthLabel')}:</span>
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
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
              🔁 {t('security.confirmPassword')} *
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={6}
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('security.confirmPasswordPlaceholder')}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  paddingRight: '42px',
                  borderColor: confirmPassword && newPassword !== confirmPassword ? '#ef4444' : '',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
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
                {showConfirm ? '👁️' : '🔒'}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                {t('security.mismatchError')}
              </span>
            )}
          </div>

          {/* Nota de consejo de seguridad */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              lineHeight: '1.4',
            }}
          >
            {t('security.securityHint')}
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '10px 20px', borderRadius: '10px' }}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: 800 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : t('security.submitBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
