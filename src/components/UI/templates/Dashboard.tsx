import React from 'react';

import {ThemeToggle} from '../molecules/ThemeToggle';
import {Breadcrumbs} from '../organisms/Breadcrumbs';
import {Sidebar} from '../organisms/Sidebar';
import {UserMenu} from '../organisms/UserMenu';

export interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const Dashboard: React.FC<DashboardLayoutProps> = ({children}) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden'>
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}/>
            <div className={`min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
                <header
                    className='h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6'>
                    <Breadcrumbs/>
                    <div className='flex items-center gap-4'>
                        <ThemeToggle/>
                        <UserMenu/>
                    </div>
                </header>

                <main className='h-[calc(100vh_-_4rem)] overflow-hidden'>{children}</main>
            </div>
        </div>
    );
};
