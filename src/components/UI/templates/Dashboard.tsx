import React, { useEffect,useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Transition } from '@headlessui/react';

import { cn } from '../../../lib/utils';
import { IconMenu } from '../Icons';
import { Breadcrumbs } from '../organisms/Breadcrumbs';
import { Sidebar } from '../organisms/Sidebar';
import { UserMenu } from '../organisms/UserMenu';

export interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const Dashboard: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { t } = useTranslation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

    // Responsive handler
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50/90 to-gray-100/90 dark:from-black/75 dark:to-black/95 overflow-hidden backdrop-blur-[2px]">
            {/* Desktop Sidebar */}
            <Transition
                show={!isMobile}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="hidden lg:block">
                    <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                </div>
            </Transition>

            {/* Mobile Sidebar */}
            <Transition
                show={isMobile && showMobileMenu}
                enter="transition-transform duration-300 ease-out"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition-transform duration-300 ease-in"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
            >
                <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm">
                    <div className="w-3/4 max-w-xs h-full" onClick={(e) => e.stopPropagation()}>
                        <Sidebar isCollapsed={false} toggleSidebar={toggleMobileMenu} />
                    </div>
                    <div className="absolute inset-0 -z-10" onClick={toggleMobileMenu}></div>
                </div>
            </Transition>

            <div 
                className={cn(
                    "min-h-screen transition-all duration-300 ease-in-out",
                    {
                        "ml-0": isMobile,
                        "ml-16": !isMobile && isCollapsed,
                        "ml-64": !isMobile && !isCollapsed
                    }
                )}
            >
                <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-black/95  backdrop-blur-md border-b border-gray-200/70 dark:border-gray-700/70 flex items-center justify-between px-4 lg:px-6 shadow-sm">
                    <div className="flex items-center gap-2">
                        {isMobile && (
                            <button 
                                onClick={toggleMobileMenu} 
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label={t('Abrir menú')}
                            >
                                <IconMenu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                            </button>
                        )}
                        <Breadcrumbs />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <UserMenu />
                    </div>
                </header>
                
                <main className="h-[calc(100vh-4rem)] overflow-auto p-4 lg:p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <div className="max-w-[2000px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
