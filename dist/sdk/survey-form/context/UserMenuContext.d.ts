import React from 'react';
export interface UserMenuItem {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    onClick?: () => void;
    href?: string;
    divider?: boolean;
    roles?: string[];
    isThemeToggle?: boolean;
}
interface UserMenuContextValue {
    menuItems: UserMenuItem[];
}
export declare const UserMenuProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useUserMenu: () => UserMenuContextValue;
export {};
