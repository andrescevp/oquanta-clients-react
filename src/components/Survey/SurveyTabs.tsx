import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

import { cn } from '../../lib/utils';

/**
 * TabItem interface representing a single tab with name and content
 */
interface TabItem {
    name: string;
    component: React.ReactNode;
}

/**
 * SurveyTabs component props
 */
interface SurveyTabsProps {
    tabs: TabItem[];
    className?: string;
}

/**
 * SurveyTabs component for displaying tabbed content
 * 
 * Displays a horizontal tab navigation with content panels
 * that follow oQuanta design system guidelines
 */
export const SurveyTabs: React.FC<SurveyTabsProps> = ({ tabs, className }) => {
    const { t } = useTranslation();

    return (
        <div className={cn("w-full", className)}>
            <TabGroup>
                <TabList className="flex space-x-1 overflow-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 border-b border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-t-xl px-1 h-full">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.name}
                            className={({ selected }) =>
                                cn(
                                    'px-4 py-3 text-sm font-medium focus:outline-none transition-all duration-200 ease-in-out',
                                    'border-b-2 -mb-[2px] whitespace-nowrap',
                                    'first:ml-1 last:mr-1 hover:text-pumpkin-orange',
                                    selected
                                        ? 'border-pumpkin-orange text-pumpkin-orange bg-gradient-to-b from-pumpkin-orange/10 to-transparent'
                                        : 'border-transparent text-gray-700 dark:text-gray-300 hover:border-pumpkin-orange/40'
                                )
                            }
                        >
                            {t(tab.name)}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-4">
                    {tabs.map((tab) => (
                        <TabPanel
                            key={tab.name}
                            className={cn(
                                'focus:outline-none rounded-xl',
                                'transition-opacity duration-200 ease-in-out',
                                'animate-fadeIn'
                            )}
                        >
                            {tab.component}
                        </TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default SurveyTabs;