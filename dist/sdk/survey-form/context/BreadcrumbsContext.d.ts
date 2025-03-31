import React from 'react';
import { BreadcrumbContextType } from '../types/breadcrumbs';
interface BreadcrumbProviderProps {
    children: React.ReactNode;
}
export declare const BreadcrumbProvider: React.FC<BreadcrumbProviderProps>;
export declare const useBreadcrumbs: () => BreadcrumbContextType;
export {};
