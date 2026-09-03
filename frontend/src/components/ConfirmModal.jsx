import React from 'react';

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }) {
  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚠️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>{title}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
            {cancelText}
          </button>
          <button className="btn btn-danger" onClick={onConfirm} style={{ flex: 1 }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
