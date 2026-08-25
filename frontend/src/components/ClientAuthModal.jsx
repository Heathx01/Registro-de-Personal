import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ClientAuthModal({ currentUser, onClose, onAuthenticated }) {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validar contraseña del usuario actual o clave maestra de seguridad
    if (password === 'admin123' || password === 'password123' || (currentUser && currentUser.password && password === currentUser.password)) {
      onAuthenticated();
    } else {
      setError(t('clientAuth.wrongPassword'));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔒</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('clientAuth.title')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {t('clientAuth.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--rose)', color: 'var(--rose)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientAuth.inputLabel')}</label>
            <input
              type="password"
              required
              autoFocus
              className="search-input"
              style={{ paddingLeft: '12px', textAlign: 'center', fontSize: '1.1rem', letterSpacing: '2px' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {t('clientAuth.unlockBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
