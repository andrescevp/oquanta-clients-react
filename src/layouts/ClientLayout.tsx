import React from 'react';

import { ProtectedRoute } from '../components/UI/molecules/ProtectedRoute';
import { Dashboard } from '../components/UI/templates/Dashboard';

const ClientLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
      <ProtectedRoute requiredRoles={['ROLE_USER']}>
        <Dashboard>
          {children}
        </Dashboard>
      </ProtectedRoute>
  );
}

export default ClientLayout;
