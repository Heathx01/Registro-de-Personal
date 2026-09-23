import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useSpotlight } from './hooks/useSpotlight';
import './App.css';

/**
 * Componente raíz refactorizado según Sección 5 de la Guía Docente.
 * La lógica de navegación, rutas, layouts y peticiones ha sido desacoplada en:
 * - src/routes/AppRoutes.jsx
 * - src/layouts/DashboardLayout.jsx
 * - src/context/AuthContext.jsx
 * - src/pages/*
 * - src/components/catalogos/*
 */
function App() {
  useScrollReveal();
  useSpotlight();

  const [apiRequestCount, setApiRequestCount] = useState(0);

  useEffect(() => {
    const handleRequestStart = () => setApiRequestCount((count) => count + 1);
    const handleRequestEnd = () => setApiRequestCount((count) => Math.max(0, count - 1));

    window.addEventListener('api:request-start', handleRequestStart);
    window.addEventListener('api:request-end', handleRequestEnd);

    return () => {
      window.removeEventListener('api:request-start', handleRequestStart);
      window.removeEventListener('api:request-end', handleRequestEnd);
    };
  }, []);

  return (
    <>
      {apiRequestCount > 0 && (
        <div className="api-progress-bar" aria-label="Procesando solicitud" role="progressbar" />
      )}
      <AppRoutes />
    </>
  );
}

export default App;
