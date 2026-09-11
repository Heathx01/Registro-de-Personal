import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import CatalogosPage from '../pages/CatalogosPage';
import CatalogoEditPage from '../pages/CatalogoEditPage';
import RolesPage from '../pages/RolesPage';
import UsuariosPage from '../pages/UsuariosPage';
import ProyectosPage from '../pages/ProyectosPage';
import ClientesPage from '../pages/ClientesPage';
import TareasPage from '../pages/TareasPage';
import OrganigramaPage from '../pages/OrganigramaPage';
import AusenciasPage from '../pages/AusenciasPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas por sesión */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Ruta índice (Dashboard) */}
          <Route index element={<DashboardPage />} />

          {/* Rutas del módulo Catálogos*/}
          <Route path="catalogos" element={<CatalogosPage />} />
          <Route path="catalogos/:id" element={<CatalogoEditPage />} />
          <Route path="templates" element={<CatalogosPage />} />
          <Route path="templates/:id" element={<CatalogoEditPage />} />

          {/* Rutas de administración y roles */}
          <Route path="roles" element={<RolesPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="personnel" element={<UsuariosPage />} />

          {/* Demás módulos del sistema */}
          <Route path="proyectos" element={<ProyectosPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="tareas" element={<TareasPage />} />
          <Route path="organigrama" element={<OrganigramaPage />} />
          <Route path="ausencias" element={<AusenciasPage />} />
        </Route>
      </Route>

      {/* Ruta comodín 404 para atender URLs no reconocidas */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
