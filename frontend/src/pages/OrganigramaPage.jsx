import React, { useState, useEffect } from 'react';
import OrganigramaView from '../components/OrganigramaView';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUsers } from '../services/api';

export default function OrganigramaPage() {
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
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando organigrama de la empresa...</p>
      </div>
    );
  }

  return <OrganigramaView users={users} />;
}
