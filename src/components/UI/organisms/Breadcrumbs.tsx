import React from 'react';
import { Link } from 'react-router-dom';

import { ChevronRight, Home } from 'lucide-react';

import { useBreadcrumbs } from '../../../context/BreadcrumbsContext';

export const Breadcrumbs: React.FC = () => {
    const { breadcrumbs } = useBreadcrumbs();

    if (breadcrumbs.length === 0) {
        return (
            <nav className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300'>
                <Link to='/' className='flex items-center hover:text-gray-900 dark:hover:text-white transition-colors'>
                    <Home className='w-4 h-4' />
                </Link>
            </nav>
        );
    }

    return (
        <nav className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300'>
            <Link to='/' className='flex items-center hover:text-gray-900 dark:hover:text-white transition-colors'>
                <Home className='w-4 h-4' />
            </Link>

            {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.path}>
                    <ChevronRight className='w-4 h-4 text-gray-400' />
                    {index === breadcrumbs.length - 1 ? (
                        <span className='font-medium text-gray-900 dark:text-white'>{item.label}</span>
                    ) : (
                        <Link to={item.path} className='hover:text-gray-900 dark:hover:text-white transition-colors'>
                            {item.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};
