import React, { createContext, ReactNode,useContext } from 'react';

import { useAuth } from './AuthContext';


interface PermissionContextType {
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isUser: () => boolean;
  canAccessAdminDomain: () => boolean;
  canAccessClientDomain: () => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };
  
  const hasAnyRole = (roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.some(role => user.roles.includes(role));
  };
  
  const isAdmin = (): boolean => {
    return hasRole('ROLE_ADMIN');
  };
  
  const isSuperAdmin = (): boolean => {
    return hasRole('ROLE_SUPER_ADMIN');
  };
  
  const isUser = (): boolean => {
    return hasRole('ROLE_USER');
  };
  
  const canAccessAdminDomain = (): boolean => {
    return isAdmin() || isSuperAdmin();
  };
  
  const canAccessClientDomain = (): boolean => {
    return !!user; // Cualquier usuario autenticado
  };
  
  const value = {
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
    isUser,
    canAccessAdminDomain,
    canAccessClientDomain
  };
  
  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};