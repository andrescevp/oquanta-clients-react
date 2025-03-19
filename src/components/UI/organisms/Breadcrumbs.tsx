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
                        "p-1.5 rounded-xl flex items-center justify-center",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        "hover:text-pumpkin-orange dark:hover:text-pumpkin-orange",
                        "focus:ring-2 focus:ring-pumpkin-orange/50 focus:outline-none",
                        "transition-all duration-200 ease-in-out",
                        "hover:shadow-sm hover:translate-y-[-1px]"
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
                    "p-1.5 rounded-xl flex items-center justify-center",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "hover:text-pumpkin-orange dark:hover:text-pumpkin-orange",
                    "focus:ring-2 focus:ring-pumpkin-orange/50 focus:outline-none",
                    "transition-all duration-200 ease-in-out",
                    "hover:shadow-sm hover:translate-y-[-1px]"
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
                            "px-2 py-1 rounded-xl",
                            "bg-gradient-to-r from-pumpkin-orange/10 to-pumpkin-orange/5 dark:from-pumpkin-orange/20 dark:to-pumpkin-orange/10",
                            "font-medium text-gray-900 dark:text-white",
                            "border border-pumpkin-orange/10 dark:border-pumpkin-orange/20",
                            "shadow-sm"
                        )}>
                            {item.label}
                        </div>
                    ) : (
                        <Link 
                            to={item.path} 
                            className={cn(
                                "px-2 py-1 rounded-xl",
                                "hover:bg-gray-100 dark:hover:bg-gray-700",
                                "hover:text-pumpkin-orange dark:hover:text-pumpkin-orange",
                                "focus:ring-2 focus:ring-pumpkin-orange/50 focus:outline-none",
                                "transition-all duration-200 ease-in-out",
                                "hover:shadow-sm hover:translate-y-[-1px]"
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
