import React from 'react';
import { Outlet } from 'react-router-dom';

import { ProtectedRoute } from '../components/UI/molecules/ProtectedRoute';
import { Dashboard } from '../components/UI/templates/Dashboard';

const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
      <Dashboard>
        <Outlet />
      </Dashboard>
    </ProtectedRoute>
  );
}

export default AdminLayout;