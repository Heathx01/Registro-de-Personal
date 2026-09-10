import React from 'react';

export default function EmptyState({ text = 'No hay registros', icon, action }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: 'rgba(30, 41, 59, 0.4)',
        borderRadius: '12px',
        border: '1px dashed rgba(148, 163, 184, 0.2)',
        margin: '1rem 0',
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.7 }}>
        {icon || '📦'}
      </div>
      <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: action ? '1rem' : 0 }}>
        {text}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
