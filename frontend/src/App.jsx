import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useSpotlight } from './hooks/useSpotlight';
import './App.css';

/**
 * Componente raíz refactorizado según Sección 5 Paso 1 de la Guía Docente.
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

  return <AppRoutes />;
}

export default App;
