import React from 'react';

import { cn } from '../../../../../lib/utils';

interface DefaultLayoutProps {
    label: React.ReactNode;
    input?: React.ReactNode;
    className?: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ label, input, className }) => {
    return (
        <div className={cn('space-y-6', className)}>
            <div className='bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <h3 className='block text-sm font-medium text-gray-700 dark:text-gray-300'>{label}</h3>
                    {input}
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
