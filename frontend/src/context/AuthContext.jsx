import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getToken,
  setToken,
  getMe,
  login as apiLogin,
  logout as apiLogout,
  getPermissionsForRole,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario autenticado en el arranque
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const userData = await getMe();
        if (isMounted) {
          setUser(userData);
        }
      } catch (err) {
        console.error('Error al verificar sesión:', err);
        setToken(null);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.warn('Error al cerrar sesión en API:', e);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  // Verificación de permisos según rol (Frontend orienta, Backend autoriza)
  const can = (permission) => {
    if (!user) return false;
    const role = user.role;

    // Reglas de permisos para la navegación y acciones (Paso 11 y 15)
    switch (permission) {
      case 'catalogos.view':
      case 'templates.view':
        return ['admin', 'lead', 'developer', 'sales'].includes(role);

      case 'catalogos.create':
      case 'templates.create':
        return ['admin', 'lead', 'developer', 'sales'].includes(role);

      case 'catalogos.edit':
      case 'templates.edit':
        return ['admin', 'lead', 'developer'].includes(role);

      case 'catalogos.delete':
      case 'templates.delete':
        return ['admin', 'lead'].includes(role);

      case 'roles.view':
        return ['admin', 'lead', 'hr'].includes(role);

      case 'usuarios.view':
      case 'personnel.view':
        return ['admin', 'lead', 'hr'].includes(role);

      case 'projects.view':
        return ['admin', 'lead', 'developer'].includes(role);

      case 'clients.view':
        return ['admin', 'lead', 'sales'].includes(role);

      case 'tasks.view':
        return ['admin', 'lead', 'developer', 'qa'].includes(role);

      default:
        // Si no se especifica permiso, permitir
        return true;
    }
  };

  const permissions = user ? getPermissionsForRole(user.role) : {};

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        token: getToken(),
        loading,
        login,
        logout,
        can,
        permissions,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
