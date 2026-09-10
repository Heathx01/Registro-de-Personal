import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LeaveRequestView from '../components/LeaveRequestView';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUsers } from '../services/api';

export default function AusenciasPage() {
  const { user, permissions } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando solicitudes de ausencia...</p>
      </div>
    );
  }

  return <LeaveRequestView currentUser={user} users={users} permissions={permissions} />;
}
