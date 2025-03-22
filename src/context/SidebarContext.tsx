import React, { createContext, useContext, useMemo } from 'react';

import {
  IconFiles,
  IconSettings,
  IconUsers,
  // Importa iconos adicionales que puedas necesitar
} from '../components/UI/Icons';
import { useAuth } from './AuthContext';

// Define el tipo para los elementos del menú
export interface MenuItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  roles?: string[]; // Roles que pueden ver este elemento
  children?: MenuItem[]; // Para menús anidados si es necesario
  isOpen?: boolean; // Para menús anidados si es necesario
}

interface SidebarContextValue {
  menuItems: MenuItem[];
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Define los menús específicos para admin
  const adminMenuItems: MenuItem[] = [
    { icon: IconUsers, label: 'Usuarios', href: '/admin/users' },
    { icon: IconSettings, label: 'Organizaciones', href: '/admin/organization' },
    { icon: IconFiles, label: 'Negocios Locales', href: '/admin/local-place' },
    { icon: IconFiles, label: 'Encuestas', href: '/admin/surveys' },
  ];

  // Define los menús específicos para clientes
  const clientMenuItems: MenuItem[] = [
  ];

  // Determina qué menú mostrar basado en los roles del usuario
  const menuItems = useMemo(() => {
    if (!user) return [];
    
    // Si el usuario tiene rol de administrador o super admin
    if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_SUPER_ADMIN')) {
      return adminMenuItems;
    }
    
    // Si es un usuario regular
    if (user.roles.includes('ROLE_USER')) {
      return clientMenuItems;
    }
    
    return [];
  }, [user]);

  return (
    <SidebarContext.Provider value={{ menuItems }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};