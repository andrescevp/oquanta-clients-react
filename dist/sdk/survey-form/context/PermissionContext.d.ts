import React, { ReactNode } from 'react';
interface PermissionContextType {
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    isAdmin: () => boolean;
    isSuperAdmin: () => boolean;
    isUser: () => boolean;
    canAccessAdminDomain: () => boolean;
    canAccessClientDomain: () => boolean;
}
interface PermissionProviderProps {
    children: ReactNode;
}
export declare const PermissionProvider: React.FC<PermissionProviderProps>;
export declare const usePermission: () => PermissionContextType;
export {};
