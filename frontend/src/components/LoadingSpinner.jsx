import React from 'react';

export default function LoadingSpinner({ message = 'Cargando información...' }) {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTop: '4px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '16px',
        }}
      ></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
