import React from 'react';
import { Link } from 'react-router-dom';

import { Menu, Transition } from '@headlessui/react';

import { useAuth } from '../../../context/AuthContext';
import { UserMenuItem, useUserMenu } from '../../../context/UserMenuContext';
import { useTheme } from '../../../hooks/useTheme';
import { cn } from '../../../lib/utils';
import { IconChevronDown, IconDarkTheme, IconLightTheme } from '../Icons';

export const UserMenu: React.FC = () => {
    const { user } = useAuth();
    const { menuItems } = useUserMenu();
    const { isDark, toggleTheme } = useTheme();

    // Extract initials from email for avatar
    const getInitials = () => {
        if (!user?.email) return '';
        return user.email.split('@')[0].substring(0, 2).toUpperCase();
    };

    const getItem =
        (item: UserMenuItem) =>
        // eslint-disable-next-line complexity, react/display-name
        ({ active }: { active: boolean }) => {
            // Contenido especial para el toggle de tema
            const ItemContent = item.isThemeToggle ? (
                <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-2'>
                        {isDark ? <IconLightTheme className='w-4 h-4' /> : <IconDarkTheme className='w-4 h-4' />}
                        <span>{item.label}</span>
                    </div>
                    <div
                        className={cn(
                            'w-11 h-6 rounded-full p-0.5 transition-colors duration-200',
                            isDark ? 'bg-pumpkin-orange' : 'bg-gray-300 dark:bg-gray-600',
                        )}>
                        <div
                            className={cn(
                                'w-5 h-5 rounded-full bg-white shadow-sm',
                                'transform transition-transform duration-300',
                                isDark ? 'translate-x-5' : 'translate-x-0',
                            )}
                        />
                    </div>
                </div>
            ) : (
                <div className='flex items-center gap-2.5'>
                    {item.icon && (
                        <div
                            className={cn(
                                'flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center',
                                active ? 'text-pumpkin-orange' : 'text-gray-500 dark:text-gray-400',
                            )}>
                            <item.icon className='w-4 h-4' />
                        </div>
                    )}
                    <span>{item.label}</span>
                </div>
            );

            const className = cn(
                'w-full flex items-center gap-2 px-4 py-2.5 text-sm',
                'text-gray-700 dark:text-gray-200 transition-all duration-200 ease-in-out',
                active ? 'bg-gray-100/80 dark:bg-black/50 text-pumpkin-orange dark:text-pumpkin-orange' : '',
                'hover:translate-y-[-1px]',
            );

            return item.href ? (
                <Link to={item.href} className={className}>
                    {ItemContent}
                </Link>
            ) : (
                <button onClick={item.onClick || (item.isThemeToggle ? toggleTheme : undefined)} className={className}>
                    {ItemContent}
                </button>
            );
        };

    return (
        <Menu as='div' className='relative'>
            {({ open }) => (
                <>
                    <Menu.Button
                        className={cn(
                            'group flex items-center gap-2 p-2 rounded-xl',
                            'bg-white dark:bg-gray-800/90 shadow-sm',
                            'hover:shadow-md hover:translate-y-[-2px] active:translate-y-[1px]',
                            'border border-gray-200 dark:border-gray-700',
                            'transition-all duration-200 ease-in-out',
                            open ? 'ring-2 ring-pumpkin-orange/50' : '',
                        )}>
                        <div className='relative'>
                            <div
                                className={cn(
                                    'w-9 h-9 rounded-xl overflow-hidden',
                                    'bg-gradient-to-br from-iris-purple to-pumpkin-orange',
                                    'flex items-center justify-center text-white font-medium',
                                    'shadow-inner',
                                )}>
                                {getInitials()}
                            </div>
                            <div
                                className={cn(
                                    'absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full',
                                    'bg-green-500 border-2 border-white dark:border-gray-800',
                                )}
                            />
                        </div>
                        <span className='text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[120px] truncate'>
                            {user?.email?.split('@')[0]}
                        </span>
                        <IconChevronDown
                            className={cn(
                                'w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200',
                                open ? 'transform rotate-180' : '',
                            )}
                        />
                    </Menu.Button>

                    <Transition
                        enter='transition duration-200 ease-out'
                        enterFrom='transform scale-95 opacity-0'
                        enterTo='transform scale-100 opacity-100'
                        leave='transition duration-150 ease-in'
                        leaveFrom='transform scale-100 opacity-100'
                        leaveTo='transform scale-95 opacity-0'>
                        <Menu.Items
                            className={cn(
                                'absolute right-0 mt-3 w-56 origin-top-right',
                                'bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg',
                                'rounded-2xl shadow-xl py-1.5',
                                'border border-gray-200 dark:border-gray-700',
                                'focus:outline-none z-50 overflow-hidden',
                                'divide-y divide-gray-100 dark:divide-gray-700',
                            )}>
                            {/* User info section */}
                            <div className='px-4 py-3'>
                                <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>Sesión como</p>
                                <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                                    {user?.email}
                                </p>
                            </div>

                            {/* Menu items */}
                            <div className='py-1.5'>
                                {menuItems.map(menuItem =>
                                    menuItem.divider ? (
                                        <div
                                            key={menuItem.label}
                                            className='my-1.5 border-t border-gray-200 dark:border-gray-700'
                                        />
                                    ) : (
                                        <Menu.Item key={menuItem.label}>{getItem(menuItem)}</Menu.Item>
                                    ),
                                )}
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};
