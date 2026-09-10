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
    setUser(userData);
    navigate('/', { replace: true });
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} />;
}
