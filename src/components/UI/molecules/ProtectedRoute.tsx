import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { usePermission } from '../../../context/PermissionContext';
import { PrivateRoute } from './PrivateRoute';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: string[];
    redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles = [],
    redirectPath = '/login',
}) => {
    const { hasAnyRole, canAccessAdminDomain, canAccessClientDomain } = usePermission();

    // Si no hay roles requeridos específicos pero hay restricción de dominio
    if (requiredRoles.includes('ADMIN_DOMAIN') && !canAccessAdminDomain()) {
        return <Navigate to={redirectPath} replace />;
    }

    if (requiredRoles.includes('CLIENT_DOMAIN') && !canAccessClientDomain()) {
        return <Navigate to={redirectPath} replace />;
    }

    // Verificar roles específicos si están definidos
    if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes('ADMIN_DOMAIN') &&
        !requiredRoles.includes('CLIENT_DOMAIN') &&
        !hasAnyRole(requiredRoles)
    ) {
        return <Navigate to={redirectPath} replace />;
    }

    return <PrivateRoute>{children}</PrivateRoute>;
};
