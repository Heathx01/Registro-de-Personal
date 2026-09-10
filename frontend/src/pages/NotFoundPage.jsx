import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '2rem',
      color: '#e2e8f0'
    }}>
      <div style={{
        fontSize: '6rem',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
        lineHeight: 1
      }}>
        404
      </div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Página no encontrada</h1>
      <p style={{ color: '#94a3b8', maxWidth: '480px', marginBottom: '2rem', fontSize: '1rem' }}>
        La ruta a la que intentas acceder no existe en el sistema o fue trasladada a otra ubicación.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Regresar al Inicio
      </Link>
    </div>
  );
}
