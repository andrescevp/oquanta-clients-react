import React from 'react';

import { PrivateRoute } from '../../../pages/PrivateRoute';
import { Dashboard, DashboardLayoutProps } from './Dashboard';

export const PrivateDashboard: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <PrivateRoute>
            <Dashboard>{children}</Dashboard>
        </PrivateRoute>
    );
};
