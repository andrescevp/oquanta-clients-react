import React, { ReactNode } from 'react';
interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: string[];
    redirectPath?: string;
}
export declare const ProtectedRoute: React.FC<ProtectedRouteProps>;
export {};
