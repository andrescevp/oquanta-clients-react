import React, { createContext, ReactNode,useContext, useEffect, useState } from 'react';

import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Interfaces
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

// Crear el contexto
const DebugBarContext = createContext<DebugBarContextType | undefined>(undefined);

export const useDebugBar = () => {
  const context = useContext(DebugBarContext);
  if (!context) {
    throw new Error('useDebugBar debe ser usado dentro de un DebugBarProvider');
  }
  return context;
};

interface DebugBarProviderProps {
  children: ReactNode;
}

export const DebugBarProvider: React.FC<DebugBarProviderProps> = ({ children }) => {
  const [requests, setRequests] = useState<DebugRequest[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const toggleVisibility = () => setVisible(prev => !prev);
  const clearRequests = () => setRequests([]);

  useEffect(() => {
    if (!isDevelopment) return;

    // Interceptor de solicitud
    const requestInterceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Añadir timestamp de inicio para calcular duración
        (config as any).meta = { ...(config as any).meta, requestTimestamp: Date.now() };
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de respuesta
    const responseInterceptor = axios.interceptors.response.use(
      (response: AxiosResponse) => {
        
        const { config } = response;
        const requestTimestamp = (config as any).meta?.requestTimestamp;
        const duration = requestTimestamp ? Date.now() - requestTimestamp : undefined;
        // Verificar si existen los headers de debug de Symfony
        const debugToken = response.headers['x-debug-token'];
        const debugTokenLink = response.headers['x-debug-token-link'];

        // Solo registrar si hay token de debug
        if (debugToken) {
          const newRequest: DebugRequest = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            method: config.method?.toUpperCase() || 'UNKNOWN',
            url: config.url || 'unknown',
            token: debugToken,
            tokenLink: debugTokenLink,
            duration,
            status: response.status,
            responseSize: JSON.stringify(response.data).length,
            requestData: config.data,
            responseData: response.data,
            headers: config.headers as Record<string, string>,
            responseHeaders: response.headers as unknown as Record<string, string>
          };

          setRequests(prev => [newRequest, ...prev].slice(0, 50)); // Limitamos a 50 entradas
        }

        return response;
      },
      (error) => {
        // También capturamos errores para mostrarlos en la barra de debug
        if (error.response) {
          const { config } = error;
          const requestTimestamp = config.meta?.requestTimestamp;
          const duration = requestTimestamp ? Date.now() - requestTimestamp : undefined;
          
          // Verificar si existen los headers de debug de Symfony en errores
          const debugToken = error.response.headers?.['x-debug-token'];
          const debugTokenLink = error.response.headers?.['x-debug-token-link'];
          
          if (debugToken) {
            const newRequest: DebugRequest = {
              id: Math.random().toString(36).substring(2, 9),
              timestamp: Date.now(),
              method: config.method?.toUpperCase() || 'UNKNOWN',
              url: config.url || 'unknown',
              token: debugToken,
              tokenLink: debugTokenLink,
              duration,
              status: error.response.status,
              responseSize: error.response.data ? JSON.stringify(error.response.data).length : 0,
              requestData: config.data,
              responseData: error.response.data,
              headers: config.headers as Record<string, string>,
              responseHeaders: error.response.headers as unknown as Record<string, string>
            };
            
            setRequests(prev => [newRequest, ...prev].slice(0, 50));
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Limpiar interceptores al desmontar
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [isDevelopment]);

  // Si no estamos en desarrollo, simplemente renderizar los hijos
  if (!isDevelopment) {
    return <>{children}</>;
  }

  return (
    <DebugBarContext.Provider value={{ requests, visible, toggleVisibility, clearRequests }}>
      {children}
    </DebugBarContext.Provider>
  );
};