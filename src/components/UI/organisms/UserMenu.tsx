import React from 'react';

import { Menu } from '@headlessui/react';
import { LogOut, User } from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';

export const UserMenu: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <Menu as='div' className='relative'>
            <Menu.Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                <div className='w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center'>
                    <User className='w-4 h-4 text-indigo-600 dark:text-indigo-300' />
                </div>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>{user?.email}</span>
            </Menu.Button>
            <Menu.Items className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 focus:outline-none'>
                <Menu.Item>
                    {({ active }) => (
                        <button
                            onClick={logout}
                            className={`${
                                active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                        >
                            <LogOut className='w-4 h-4' />
                            Sign out
                        </button>
                    )}
                </Menu.Item>
            </Menu.Items>
        </Menu>
    );
};
