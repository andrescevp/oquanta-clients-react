import React from 'react';
import { Configuration } from '../api-generated';
import { AuthContextType, LoginCredentials, User } from '../types/auth';
export declare const AuthContext: React.Context<AuthContextType | undefined>;
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
    navigate: (path: string) => void;
}>;
export declare const AuthProviderWithRouter: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => {
    configuration: Configuration | undefined;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    user?: User | undefined;
    token?: string | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: {
        message: string;
        code: string;
    } | undefined;
};
export declare const useUser: () => {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    user?: User | undefined;
    token?: string | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: {
        message: string;
        code: string;
    } | undefined;
};
