import React, { createContext, JSX, useContext, useState } from 'react';

import { BreadcrumbContextType, BreadcrumbItem } from '../types/breadcrumbs';

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

interface BreadcrumbProviderProps {
    children: React.ReactNode;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({ children }): JSX.Element => {
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

    return <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>{children}</BreadcrumbContext.Provider>;
};

export const useBreadcrumbs = () => {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
        throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
    }
    return context;
};
