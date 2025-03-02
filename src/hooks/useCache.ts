import { useCallback } from 'react';

// Prefijo para todas las claves almacenadas por este hook para evitar colisiones
const CACHE_PREFIX = 'oquanta_cache_';

// Estructura de los datos almacenados en caché
interface CacheItem<T> {
  value: T;
  expiry?: number; // timestamp en milisegundos
}

/**
 * Hook para almacenar y recuperar datos de localStorage con soporte para expiración
 */
export function useCache() {
  /**
   * Almacena un valor en la caché con una clave específica
   * @param key - Clave única para identificar el dato
   * @param value - Valor a almacenar
   * @param expirationInSeconds - Tiempo de expiración en segundos (opcional)
   */
  const setCache = useCallback(<T>(key: string, value: T, expirationInSeconds?: number): void => {
    try {
      const cacheKey = CACHE_PREFIX + key;
      const item: CacheItem<T> = {
        value
      };

      // Si se especificó un tiempo de expiración, calcular la fecha/hora de expiración
      if (expirationInSeconds) {
        item.expiry = Date.now() + (expirationInSeconds * 1000);
      }

      // Serializar y guardar en localStorage
      localStorage.setItem(cacheKey, JSON.stringify(item));
    } catch (error) {
      console.error('Error al almacenar datos en caché:', error);
    }
  }, []);

  /**
   * Recupera un valor de la caché por su clave
   * @param key - Clave del dato a recuperar
   * @returns El valor almacenado o null si no existe o ha expirado
   */
  const getCache = useCallback(<T>(key: string): T | null => {
    try {
      const cacheKey = CACHE_PREFIX + key;
      const itemStr = localStorage.getItem(cacheKey);
      
      // Si no existe el elemento, retornar null
      if (!itemStr) {
        return null;
      }

      // Deserializar el elemento
      const item: CacheItem<T> = JSON.parse(itemStr);
      
      // Verificar si el elemento ha expirado
      if (item.expiry && Date.now() > item.expiry) {
        // Si ha expirado, eliminar y retornar null
        localStorage.removeItem(cacheKey);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error al recuperar datos de caché:', error);
      return null;
    }
  }, []);

  /**
   * Verifica si una clave existe en la caché y no ha expirado
   * @param key - Clave a verificar
   * @returns true si la clave existe y no ha expirado, false en caso contrario
   */
  const hasCache = useCallback((key: string): boolean => {
    try {
      const cacheKey = CACHE_PREFIX + key;
      const itemStr = localStorage.getItem(cacheKey);
      
      // Si no existe el elemento, retornar false
      if (!itemStr) {
        return false;
      }

      // Deserializar el elemento
      const item: CacheItem<unknown> = JSON.parse(itemStr);
      
      // Verificar si el elemento ha expirado
      if (item.expiry && Date.now() > item.expiry) {
        // Si ha expirado, eliminar y retornar false
        localStorage.removeItem(cacheKey);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al verificar existencia en caché:', error);
      return false;
    }
  }, []);

  /**
   * Elimina un elemento específico de la caché
   * @param key - Clave del elemento a eliminar
   */
  const removeCache = useCallback((key: string): void => {
    try {
      const cacheKey = CACHE_PREFIX + key;
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error al eliminar dato de caché:', error);
    }
  }, []);

  /**
   * Limpia todos los elementos almacenados por este hook
   */
  const clearCache = useCallback((): void => {
    try {
      // Eliminar solo las claves que corresponden a este hook
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error al limpiar caché:', error);
    }
  }, []);

  return {
    setCache,
    getCache,
    hasCache,
    removeCache,
    clearCache
  };
}