import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProtectedRoute() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#090d16',
        color: '#94a3b8'
      }}>
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Verificando credenciales de acceso...</p>
      </div>
    );
  }

  // Si no hay token o usuario autenticado, redirigir a /login (Prueba T2 de la guía)
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
