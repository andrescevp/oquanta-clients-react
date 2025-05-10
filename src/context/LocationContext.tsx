import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Tipos de estado de permiso
export type LocationPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unavailable';

// Interfaz para las coordenadas
export interface Coordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: number;
}

// Interfaz para el contexto
interface LocationContextType {
    permissionStatus: LocationPermissionStatus;
    coordinates: Coordinates | null;
    postalCode: string | null;
    requestPermission: () => Promise<boolean>;
    setManualPostalCode: (code: string) => void;
    isWatching: boolean;
    startWatchingPosition: () => void;
    stopWatchingPosition: () => void;
    error: string | null;
}

// Constantes para localStorage
const STORAGE_KEYS = {
    COORDINATES: 'oquanta_user_coordinates',
    POSTAL_CODE: 'oquanta_user_postal_code',
    PERMISSION_STATUS: 'oquanta_location_permission',
};

// Crear el contexto
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Props del proveedor
interface LocationProviderProps {
    children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
    // Estados
    const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('prompt');
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [postalCode, setPostalCode] = useState<string | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [isWatching, setIsWatching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Verificar el estado actual del permiso
    const checkPermissionStatus = async () => {
        if (!navigator.geolocation) {
            setPermissionStatus('unavailable');
            localStorage.setItem(STORAGE_KEYS.PERMISSION_STATUS, 'unavailable');
            return;
        }

        if (navigator.permissions && navigator.permissions.query) {
            try {
                const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });

                const updatePermissionStatus = () => {
                    setPermissionStatus(result.state as LocationPermissionStatus);
                    localStorage.setItem(STORAGE_KEYS.PERMISSION_STATUS, result.state);
                };

                // Actualizar inicialmente
                updatePermissionStatus();

                // Escuchar cambios
                result.addEventListener('change', updatePermissionStatus);

                return () => {
                    result.removeEventListener('change', updatePermissionStatus);
                };
            } catch (err) {
                console.error('Error al consultar permisos:', err);
            }
        }
    };

    // Solicitar permiso de ubicación
    const requestPermission = async (): Promise<boolean> => {
        if (!navigator.geolocation) {
            setPermissionStatus('unavailable');
            setError('La geolocalización no está disponible en tu dispositivo');
            return false;
        }

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                });
            });

            const newCoordinates: Coordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
            };

            setCoordinates(newCoordinates);
            setPermissionStatus('granted');
            localStorage.setItem(STORAGE_KEYS.COORDINATES, JSON.stringify(newCoordinates));
            localStorage.setItem(STORAGE_KEYS.PERMISSION_STATUS, 'granted');
            setError(null);
            return true;
        } catch (err) {
            console.error('Error al obtener ubicación:', err);

            if (err instanceof GeolocationPositionError) {
                if (err.code === err.PERMISSION_DENIED) {
                    setPermissionStatus('denied');
                    localStorage.setItem(STORAGE_KEYS.PERMISSION_STATUS, 'denied');
                    setError('Permiso de ubicación denegado');
                } else if (err.code === err.TIMEOUT) {
                    setError('Se agotó el tiempo para obtener la ubicación');
                } else {
                    setError('No se pudo obtener la ubicación');
                }
            } else {
                setError('Error desconocido al obtener la ubicación');
            }
            return false;
        }
    };

    // Establecer código postal manualmente
    const setManualPostalCode = (code: string) => {
        setPostalCode(code);
        localStorage.setItem(STORAGE_KEYS.POSTAL_CODE, code);
    };

    // Detener seguimiento
    const stopWatchingPosition = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
            setIsWatching(false);
        }
    };

    // Iniciar seguimiento de ubicación en tiempo real
    const startWatchingPosition = () => {
        if (!navigator.geolocation) {
            setError('La geolocalización no está disponible en tu dispositivo');
            return;
        }

        if (watchId !== null) {
            // Ya estamos siguiendo la posición
            return;
        }

        const id = navigator.geolocation.watchPosition(
            position => {
                const newCoordinates: Coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                };

                setCoordinates(newCoordinates);
                localStorage.setItem(STORAGE_KEYS.COORDINATES, JSON.stringify(newCoordinates));
                setPermissionStatus('granted');
                setError(null);
            },
            err => {
                console.error('Error en el seguimiento de ubicación:', err);
                if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
                    setPermissionStatus('denied');
                    stopWatchingPosition();
                }
                setError('Error al seguir la ubicación');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            },
        );

        setWatchId(id);
        setIsWatching(true);
    };

    // Cargar datos guardados al iniciar
    useEffect(() => {
        const loadSavedData = () => {
            try {
                // Cargar coordenadas
                const savedCoordinates = localStorage.getItem(STORAGE_KEYS.COORDINATES);
                if (savedCoordinates) {
                    setCoordinates(JSON.parse(savedCoordinates));
                }

                // Cargar código postal
                const savedPostalCode = localStorage.getItem(STORAGE_KEYS.POSTAL_CODE);
                if (savedPostalCode) {
                    setPostalCode(savedPostalCode);
                }

                // Cargar estado de permiso
                const savedPermission = localStorage.getItem(
                    STORAGE_KEYS.PERMISSION_STATUS,
                ) as LocationPermissionStatus;
                if (savedPermission) {
                    setPermissionStatus(savedPermission);
                }
            } catch (err) {
                console.error('Error al cargar datos de ubicación:', err);
                // Si hay error al leer de localStorage, limpiamos todo
                localStorage.removeItem(STORAGE_KEYS.COORDINATES);
                localStorage.removeItem(STORAGE_KEYS.POSTAL_CODE);
                localStorage.removeItem(STORAGE_KEYS.PERMISSION_STATUS);
            }
        };

        loadSavedData();
        checkPermissionStatus();
    }, []);

    // Limpiar el seguimiento al desmontar el componente
    useEffect(() => {
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    // Valor del contexto
    const contextValue: LocationContextType = {
        permissionStatus,
        coordinates,
        postalCode,
        requestPermission,
        setManualPostalCode,
        isWatching,
        startWatchingPosition,
        stopWatchingPosition,
        error,
    };

    return <LocationContext.Provider value={contextValue}>{children}</LocationContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation debe ser usado dentro de un LocationProvider');
    }
    return context;
};
