import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tab } from '@headlessui/react';
import clsx from 'clsx';

interface TabItem {
    name: string;
    component: React.ReactNode;
}

interface SurveyTabsProps {
    tabs: TabItem[];
}

export const Tabs: React.FC<SurveyTabsProps> = ({ tabs }) => {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <Tab.Group>
                <Tab.List className="flex border-b border-gray-200">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.name}
                            className={({ selected }) =>
                                clsx(
                                    'px-4 py-2 text-sm font-medium focus:outline-none',
                                    'border-b-2 -mb-[2px]',
                                    selected
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-900 hover:text-gray-700 hover:border-gray-300'
                                )
                            }
                        >
                            {t(tab.name)}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-4">
                    {tabs.map((tab) => (
                        <Tab.Panel
                            key={tab.name}
                            className={clsx(
                                'focus:outline-none'
                            )}
                        >
                            {tab.component}
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};