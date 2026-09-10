import React from 'react';
import { useAuth } from '../context/AuthContext';
import RolesMatrixView from '../components/RolesMatrixView';

export default function RolesPage() {
  const { user } = useAuth();
  return <RolesMatrixView currentUser={user} />;
}
