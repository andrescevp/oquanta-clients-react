import React, { ReactNode } from 'react';
export interface DebugRequest {
    id: string;
    timestamp: number;
    method: string;
    url: string;
    token?: string;
    tokenLink?: string;
    duration?: number;
    status?: number;
    responseSize?: number;
    requestData?: any;
    responseData?: any;
    headers?: Record<string, string>;
    responseHeaders?: Record<string, string>;
}
interface DebugBarContextType {
    requests: DebugRequest[];
    visible: boolean;
    toggleVisibility: () => void;
    clearRequests: () => void;
}
export declare const useDebugBar: () => DebugBarContextType;
interface DebugBarProviderProps {
    children: ReactNode;
}
export declare const DebugBarProvider: React.FC<DebugBarProviderProps>;
export {};
