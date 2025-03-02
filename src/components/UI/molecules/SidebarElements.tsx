import React from 'react';
import { NavLink } from 'react-router-dom';

import clsx from 'clsx';

import { MenuItem } from '../../../context/SidebarContext';

interface SidebarItemProps extends MenuItem {
    isCollapsed: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, isCollapsed }) => {
    return (
        <NavLink
            to={href}
            className={({ isActive }) =>
                clsx(
                    'flex items-center p-2 rounded-lg transition-colors',
                    isActive 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
                    isCollapsed ? 'justify-center' : 'px-4'
                )
            }
        >
            <Icon className='w-5 h-5' />
            {!isCollapsed && (
                <span className='ml-3 whitespace-nowrap'>{label}</span>
            )}
        </NavLink>
    );
};

export const SidebarHeader: React.FC<{
    isCollapsed: boolean;
    onToggle: () => void;
}> = ({ isCollapsed, onToggle }) => {
    return (
        <div className={clsx(
            'flex items-center py-4 border-b border-gray-200 dark:border-gray-700 h-16',
            isCollapsed ? 'justify-center px-2' : 'px-4 justify-between'
        )}>
            {!isCollapsed && (
                <div className='flex items-center'>
                    <span className='text-lg font-semibold text-gray-800 dark:text-white'>oQuanta</span>
                </div>
            )}
            
            <button
                onClick={onToggle}
                className={clsx(
                    'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700',
                    isCollapsed ? 'mx-auto' : ''
                )}
            >
                {isCollapsed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        </div>
    );
};