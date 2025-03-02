import { usePermission } from '../context/PermissionContext';

export const useRolePermissions = () => {
  const { hasRole, hasAnyRole, isAdmin, isSuperAdmin, canAccessAdminDomain } = usePermission();
  
  const canManageUsers = (): boolean => {
    return isAdmin() || isSuperAdmin();
  };
  
  const canManageOrganizations = (): boolean => {
    return isAdmin() || isSuperAdmin();
  };
  
  const canDeleteData = (): boolean => {
    return isSuperAdmin();
  };
  
  return {
    hasRole,
    hasAnyRole,
    canManageUsers,
    canManageOrganizations,
    canDeleteData,
    canAccessAdminDomain
  };
};