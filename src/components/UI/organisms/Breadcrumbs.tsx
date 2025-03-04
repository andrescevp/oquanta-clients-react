import React from 'react';
import { Link } from 'react-router-dom';

import { useBreadcrumbs } from '../../../context/BreadcrumbsContext';
import { cn } from '../../../lib/utils';
import { IconChevronRight, IconHome } from '../Icons';

export const Breadcrumbs: React.FC = () => {
    const { breadcrumbs } = useBreadcrumbs();

    if (breadcrumbs.length === 0) {
        return (
            <nav className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Link 
                    to="/" 
                    className={cn(
                        "p-1.5 rounded-lg flex items-center justify-center",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        "hover:text-gray-900 dark:hover:text-white",
                        "transition-all duration-200"
                    )}
                    aria-label="Inicio"
                >
                    <IconHome className="w-4 h-4" />
                </Link>
            </nav>
        );
    }

    return (
        <nav className="flex items-center space-x-1.5 text-sm text-gray-600 dark:text-gray-300 overflow-x-auto scrollbar-none" aria-label="breadcrumbs">
            <Link 
                to="/" 
                className={cn(
                    "p-1.5 rounded-lg flex items-center justify-center",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "hover:text-gray-900 dark:hover:text-white", 
                    "transition-all duration-200"
                )}
                aria-label="Inicio"
            >
                <IconHome className="w-4 h-4" />
            </Link>

            {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.path}>
                    <div className="text-gray-400 dark:text-gray-500 flex items-center">
                        <IconChevronRight className="w-4 h-4" />
                    </div>
                    
                    {index === breadcrumbs.length - 1 ? (
                        <div className={cn(
                            "px-2 py-1 rounded-lg",
                            "bg-gray-100 dark:bg-gray-700/50",
                            "font-medium text-gray-900 dark:text-white"
                        )}>
                            {item.label}
                        </div>
                    ) : (
                        <Link 
                            to={item.path} 
                            className={cn(
                                "px-2 py-1 rounded-lg",
                                "hover:bg-gray-100 dark:hover:bg-gray-700",
                                "hover:text-gray-900 dark:hover:text-white",
                                "transition-all duration-200"
                            )}
                        >
                            {item.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};
