import React from 'react';
export interface MenuItem {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    href: string;
    roles?: string[];
    children?: MenuItem[];
    isOpen?: boolean;
}
interface SidebarContextValue {
    menuItems: MenuItem[];
}
export declare const SidebarProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useSidebar: () => SidebarContextValue;
export {};
