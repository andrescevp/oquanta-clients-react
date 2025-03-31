import React, { ReactNode } from 'react';
interface RestrictedProps {
    children: ReactNode;
    roles: string[];
    fallback?: ReactNode;
}
export declare const Restricted: React.FC<RestrictedProps>;
export {};
