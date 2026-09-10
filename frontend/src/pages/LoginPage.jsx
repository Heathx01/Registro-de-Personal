import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginView from '../components/LoginView';

export default function LoginPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLoginSuccess = (userData) => {
    const userObj = userData?.user || userData;
    setUser(userObj);
    if (userObj?.role === 'qa') {
      navigate('/tareas', { replace: true });
    } else if (userObj?.role === 'sales') {
      navigate('/clientes', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} />;
}
