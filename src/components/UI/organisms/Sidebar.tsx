import React from 'react';

import { Transition } from '@headlessui/react';

import {
    IconAnalytics,
    IconDashboard,
    IconFiles,
    IconSettings,
    IconUsers
} from "../Icons";
import { SidebarHeader, SidebarItem } from '../molecules/SidebarElements';

const menuItems = [
    {icon: IconDashboard, label: 'Dashboard', href: '#'},
    {icon: IconUsers, label: 'Users', href: '#'},
    {icon: IconAnalytics, label: 'Analytics', href: '#'},
    {icon: IconFiles, label: 'Documents', href: '#'},
    {icon: IconSettings, label: 'Settings', href: '#'},
];

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
    return (
        <Transition.Root show={true} as={React.Fragment}>
            <aside
                className={`${
                    isCollapsed ? 'w-16' : 'w-64'
                } h-screen fixed left-0 top-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out`}
            >
                <div className='flex flex-col h-full'>
                    <SidebarHeader 
                        isCollapsed={isCollapsed} 
                        onToggle={toggleSidebar} 
                    />
                    
                    <nav className='flex-1 overflow-y-auto py-4'>
                        <ul className='space-y-2 px-3'>
                            {menuItems.map(item => (
                                <li key={item.label}>
                                    <SidebarItem 
                                        {...item} 
                                        isCollapsed={isCollapsed} 
                                    />
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
        </Transition.Root>
    );
};
