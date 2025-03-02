import React from 'react';
import { Link } from 'react-router-dom';

import { Menu } from '@headlessui/react';

import { useAuth } from '../../../context/AuthContext';
import { useUserMenu } from '../../../context/UserMenuContext';
import { useTheme } from '../../../hooks/useTheme';
import { cn } from '../../../lib/utils';
import { IconDarkTheme, IconLightTheme, IconUser } from '../Icons';

export const UserMenu: React.FC = () => {
    const { user } = useAuth();
    const { menuItems } = useUserMenu();
    const { isDark } = useTheme();

    return (
        <Menu as='div' className='relative'>
            <Menu.Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                <div className='w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center'>
                    <IconUser className='w-4 h-4 text-indigo-600 dark:text-indigo-300' />
                </div>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>{user?.email}</span>
            </Menu.Button>
            <Menu.Items className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 focus:outline-none z-50'>
                {menuItems.map((item) => (
                    item.divider ? (
                        <div 
                            key={item.label} 
                            className="my-1 border-t border-gray-200 dark:border-gray-700"
                        />
                    ) : (
                        <Menu.Item key={item.label}>
                            {({ active }) => {
                                // Contenido especial para el toggle de tema
                                const ItemContent = item.isThemeToggle ? (
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            {isDark ? (
                                                <IconLightTheme className="w-4 h-4" />
                                            ) : (
                                                <IconDarkTheme className="w-4 h-4" />
                                            )}
                                            <span>{item.label}</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full p-0.5 ${isDark ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                            <div 
                                                className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {item.icon && <item.icon className='w-4 h-4' />}
                                        <span>{item.label}</span>
                                    </>
                                );

                                const className = cn(
                                    'w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                );

                                return item.href ? (
                                    <Link to={item.href} className={className}>
                                        {ItemContent}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={item.onClick}
                                        className={className}
                                    >
                                        {ItemContent}
                                    </button>
                                );
                            }}
                        </Menu.Item>
                    )
                ))}
            </Menu.Items>
        </Menu>
    );
};
