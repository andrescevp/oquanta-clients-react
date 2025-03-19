import React, { createContext, useContext, useMemo } from 'react';

import { IconLogOut, IconUserCog } from '../components/UI/Icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from './AuthContext';

// Define la interfaz para los elementos del menú de usuario
export interface UserMenuItem {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick?: () => void;
  href?: string; // Para navegación con enlace
  divider?: boolean; // Para separar secciones en el menú
  roles?: string[]; // Controla qué roles pueden ver esta opción
  isThemeToggle?: boolean; // Nueva propiedad para identificar el toggle de tema
}

interface UserMenuContextValue {
  menuItems: UserMenuItem[];
}

const UserMenuContext = createContext<UserMenuContextValue | undefined>(undefined);

export const UserMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const menuItems = useMemo(() => {
    if (!user) return [];

    // Elementos comunes para todos los usuarios
    const commonItems: UserMenuItem[] = [
      // {
      //   icon: IconUser,
      //   label: 'Mi perfil',
      //   href: '/profile',
      // },
      // {
      //   icon: IconSettings,
      //   label: 'Configuración',
      //   href: '/settings',
      // },
      {
        // Elemento para cambiar el tema
        label: isDark ? 'Modo claro' : 'Modo oscuro',
        onClick: toggleTheme,
        isThemeToggle: true, // Marca este elemento como un toggle de tema
      },
      {
        divider: true,
        label: 'divider-1',
      },
      {
        icon: IconLogOut,
        label: 'Cerrar sesión',
        onClick: logout,
      },
    ];

    // Elementos específicos para administradores
    const adminItems: UserMenuItem[] = [
      // {
      //   icon: IconShield,
      //   label: 'Panel de administración',
      //   href: '/admin/dashboard',
      //   roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
      // },
      {
        icon: IconUserCog,
        label: 'Gestionar usuarios',
        href: '/admin/users',
        roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
      },
      {
        divider: true,
        label: 'divider-2',
      },
      ...commonItems,
    ];

    // Determinar qué elementos mostrar según el rol del usuario
    if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_SUPER_ADMIN')) {
      return adminItems;
    }

    return commonItems;
  }, [user, logout, isDark, toggleTheme]);

  return (
    <UserMenuContext.Provider value={{ menuItems }}>
      {children}
    </UserMenuContext.Provider>
  );
};

export const useUserMenu = () => {
  const context = useContext(UserMenuContext);
  if (context === undefined) {
    throw new Error('useUserMenu must be used within a UserMenuProvider');
  }
  return context;
};