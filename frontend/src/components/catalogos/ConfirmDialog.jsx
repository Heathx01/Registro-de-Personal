import React from 'react';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirmar Acción',
  message,
  itemName,
  isDeleting = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#111827',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '1.75rem',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          animation: 'modalSlideIn 0.25s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            ⚠️
          </div>
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', fontWeight: 600 }}>
            {title}
          </h3>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
          {message}
        </p>

        {itemName && (
          <div
            style={{
              padding: '0.6rem 0.8rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              borderLeft: '3px solid #ef4444',
              color: '#e2e8f0',
              fontWeight: 500,
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}
          >
            "{itemName}"
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'transparent',
              color: '#94a3b8',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              background: isDeleting ? '#991b1b' : '#dc2626',
              color: '#ffffff',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              transition: 'all 0.2s',
            }}
          >
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
