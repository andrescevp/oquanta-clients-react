import React from 'react';
import { MenuItem } from '../../../context/SidebarContext';
interface SidebarItemProps extends MenuItem {
    isCollapsed: boolean;
    isSubItem?: boolean;
}
export declare const SidebarItem: React.FC<SidebarItemProps>;
export declare const SidebarHeader: React.FC<{
    isCollapsed: boolean;
    onToggle: () => void;
}>;
export {};
