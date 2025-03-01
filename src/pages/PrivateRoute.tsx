import React from 'react';
import { Navigate } from 'react-router';

import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
}

/**
 * @component PrivateRoute
 * @description A component that protects routes by checking if the user is authenticated.
 * If the user is not authenticated, it redirects them to the login page.
 * @param {PrivateRouteProps} props - The props for the PrivateRoute component.
 * @returns {React.ReactNode} - The children components if the user is authenticated, otherwise redirects to the login page.
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return <>{children}</>;
};