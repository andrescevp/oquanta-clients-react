import React from 'react';
import { Link } from 'react-router';

import { Disclosure, Transition } from '@headlessui/react';

import { IconChevronLeft, IconChevronRight } from '../Icons';

type SidebarHeaderProps = {
    isCollapsed: boolean;
    onToggle: () => void;
};

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed, onToggle }) => (
    <div className='h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700'>
        <Transition
            show={!isCollapsed}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <span className='text-xl font-bold text-gray-800 dark:text-white'>Dashboard</span>
        </Transition>
        <button
            onClick={onToggle}
            className='p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
        >
            {isCollapsed ? (
                <IconChevronRight className='w-5 h-5 text-gray-600 dark:text-gray-300'/>
            ) : (
                <IconChevronLeft className='w-5 h-5 text-gray-600 dark:text-gray-300'/>
            )}
        </button>
    </div>
);

type SidebarItemProps = {
    icon: React.FC<{ className?: string }>;
    label: string;
    href: string;
    isCollapsed: boolean;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, isCollapsed }) => (
    <Disclosure as="div" className="w-full">
        {({ open }) => (
            <Link
                to={href}
                className='flex items-center gap-x-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            >
                <Icon className='w-5 h-5 shrink-0'/>
                <Transition
                    show={!isCollapsed}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <span>{label}</span>
                </Transition>
            </Link>
        )}
    </Disclosure>
);