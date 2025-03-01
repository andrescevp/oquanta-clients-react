import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { jwtDecode } from 'jwt-decode';

import { AuthApi, Configuration } from '../api-generated';
import { storage } from '../lib/storage';
import { AuthContextType, AuthState, LoginCredentials, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);
    const navigate = useNavigate();
    const api = new AuthApi({
        basePath: process.env.REACT_APP_BACKEND_API_URL || '',
        isJsonMime: () => true,
    });
    const isSessionExpired = storage.isSessionExpired();

    useLayoutEffect(() => {
        if (isSessionExpired) {
            storage.clearToken();
            storage.clearUser();
            navigate('/login');
        }
    }, [isSessionExpired]);

    useEffect(() => {
        const initializeAuth = () => {
            const token = storage.getToken();
            const user = storage.getUser();

            setState({
                user,
                token,
                isAuthenticated: Boolean(token && user),
                isLoading: false,
            });
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        api.getAuthToken({
            email: credentials.email,
            password: credentials.password,
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Login failed');
                }

                const { token } = response.data;
                if (!token) {
                    throw new Error('Token not found');
                }
                const { exp } = jwtDecode(token);
                const user: User = { email: credentials.email };
                storage.setToken(token);
                storage.setUser(user);
                storage.setExpiration(exp || 0);

                setState({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });
                navigate('/');
            })
            .catch(error => {
                console.error('Login error:', error);
                throw error;
            });
    };

    const logout = () => {
        storage.clearToken();
        storage.clearUser();
        setState({
            ...initialState,
            isLoading: false,
        });
        navigate('/login');
    };

    if (state.isLoading) {
        return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
    }

    return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const configuration = context.token
        ? new Configuration({
              basePath: process.env.REACT_APP_BACKEND_API_URL,
              accessToken: context.token,
              baseOptions: {
                  headers: {
                      Accept: 'application/json, application/problem+json, application/ld+json',
                  },
              },
          })
        : undefined;

    return { ...context, configuration };
};
