import { useEffect } from 'react';

import { Coordinates,useLocation } from '../context/LocationContext';

interface UseUserLocationOptions {
  autoWatch?: boolean;
  onLocationChange?: (coords: Coordinates) => void;
  onError?: (error: string) => void;
}

export const useUserLocation = (options: UseUserLocationOptions = {}) => {
  const { 
    permissionStatus, 
    coordinates, 
    postalCode,
    requestPermission, 
    setManualPostalCode,
    isWatching,
    startWatchingPosition,
    stopWatchingPosition,
    error
  } = useLocation();

  // Iniciar seguimiento automático si se solicita
  useEffect(() => {
    if (options.autoWatch && permissionStatus === 'granted' && !isWatching) {
      startWatchingPosition();
    }
    
    return () => {
      if (isWatching) {
        stopWatchingPosition();
      }
    };
  }, [options.autoWatch, permissionStatus, isWatching]);

  // Notificar cambios en las coordenadas
  useEffect(() => {
    if (coordinates && options.onLocationChange) {
      options.onLocationChange(coordinates);
    }
  }, [coordinates, options.onLocationChange]);

  // Notificar errores
  useEffect(() => {
    if (error && options.onError) {
      options.onError(error);
    }
  }, [error, options.onError]);

  return {
    permissionStatus,
    coordinates,
    postalCode,
    requestPermission,
    setManualPostalCode,
    isWatching,
    startWatchingPosition,
    stopWatchingPosition,
    error,
    hasLocation: !!coordinates || !!postalCode
  };
};