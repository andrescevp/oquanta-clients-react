import React, { ReactNode } from 'react';

import { usePermission } from '../../../context/PermissionContext';

interface RestrictedProps {
  children: ReactNode;
  roles: string[];
  fallback?: ReactNode;
}

export const Restricted: React.FC<RestrictedProps> = ({ 
  children, 
  roles, 
  fallback = null 
}) => {
  const { hasAnyRole, canAccessAdminDomain, canAccessClientDomain } = usePermission();
  
  if (roles.includes('ADMIN_DOMAIN') && canAccessAdminDomain()) {
    return <>{children}</>;
  }
  
  if (roles.includes('CLIENT_DOMAIN') && canAccessClientDomain()) {
    return <>{children}</>;
  }
  
  if (hasAnyRole(roles)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};