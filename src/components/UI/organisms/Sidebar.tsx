import React from 'react';
import { useTranslation } from 'react-i18next';

import { Transition } from '@headlessui/react';

import { useSidebar } from '../../../context/SidebarContext';
import { cn } from '../../../lib/utils';
import { IconChevronLeft } from '../Icons';
import { SidebarItem } from '../molecules/SidebarElements';

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
    const { t } = useTranslation();
    const { menuItems } = useSidebar();

    return (
        <aside
            className={cn(
                "h-screen fixed left-0 top-0 z-40",
                "bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg",
                "border-r border-gray-200 dark:border-gray-700",
                "shadow-lg shadow-black/5 dark:shadow-black/20",
                "transition-all duration-300 ease-in-out",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex flex-col h-full">
                {/* Header with logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                    <Transition
                        show={!isCollapsed}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="font-semibold bg-gradient-to-r from-pumpkin-orange to-iris-purple bg-clip-text text-transparent">
                            oQuanta
                        </div>
                    </Transition>
                    
                    <button 
                        onClick={toggleSidebar}
                        className={cn(
                            "p-1.5 rounded-xl", 
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "focus:ring-2 focus:ring-pumpkin-orange/50 focus:outline-none",
                            "transition-all duration-200 ease-in-out",
                            "border border-gray-200 dark:border-gray-700",
                            "hover:shadow-md hover:translate-y-[-1px]",
                            !isCollapsed && "ml-auto"
                        )}
                        aria-label={isCollapsed ? t('Expandir menú') : t('Colapsar menú')}
                    >
                        <IconChevronLeft 
                            className={cn(
                                "w-4 h-4 text-gray-500 dark:text-gray-400",
                                "transition-transform duration-300",
                                isCollapsed && "transform rotate-180"
                            )} 
                        />
                    </button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <ul className="space-y-1.5 px-3">
                        {menuItems.map((item, index) => (
                            <li key={item.label || index} className="group">
                                <SidebarItem 
                                    {...item} 
                                    isCollapsed={isCollapsed} 
                                />
                                
                                {/* Submenu items if any */}
                                {item.children && !isCollapsed && (
                                    <Transition
                                        show={item.isOpen}
                                        enter="transition-max-height duration-300 ease-out"
                                        enterFrom="max-h-0 overflow-hidden opacity-0"
                                        enterTo="max-h-96 overflow-hidden opacity-100"
                                        leave="transition-max-height duration-200 ease-in"
                                        leaveFrom="max-h-96 overflow-hidden opacity-100"
                                        leaveTo="max-h-0 overflow-hidden opacity-0"
                                    >
                                        <ul className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                                            {item.children.map(subItem => (
                                                <li key={subItem.label}>
                                                    <SidebarItem 
                                                        {...subItem} 
                                                        isCollapsed={false}
                                                        isSubItem={true} 
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </Transition>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                
                {/* Footer section with additional info */}
                <div className={cn(
                    "p-4 border-t border-gray-200 dark:border-gray-700",
                    "text-xs text-gray-500 dark:text-gray-400",
                    "bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30",
                    isCollapsed ? "text-center" : ""
                )}>
                    {isCollapsed ? (
                        <div className="text-2xl" title={t('oQuanta v2.3')}>•</div>
                    ) : (
                        <div>{t('oQuanta v2.3')}</div>
                    )}
                </div>
            </div>
        </aside>
    );
};
