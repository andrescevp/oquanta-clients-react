import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook for managing URL query parameters without affecting other parts of the URL
 * @param paramName - The name of the query parameter to manage
 * @returns Object with methods to get, set and remove the parameter
 */
export const useQueryParams = <T extends string | number | boolean | null = string>(
  paramName: string
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Get the current value of the parameter
   */
  const getValue = useCallback(() => {
    return searchParams.get(paramName) as T | null;
  }, [paramName]);

  /**
   * Set the value of the parameter
   * @param value - The value to set
   * @param replaceState - Whether to replace the current history state (default: false)
   */
  const setValue = useCallback(
    (value: T, replaceState = false) => {
      const newParams = new URLSearchParams(searchParams);
      
      if (value === null || value === undefined || value === '') {
        newParams.delete(paramName);
      } else {
        newParams.set(paramName, String(value));
      }
      
      setSearchParams(newParams, { replace: replaceState });
    },
    [paramName]
  );

  /**
   * Remove the parameter from the URL
   * @param replaceState - Whether to replace the current history state (default: false)
   */
  const removeParam = useCallback(
    (replaceState = false) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(paramName);
      setSearchParams(newParams, { replace: replaceState });
    },
    [paramName]
  );

  /**
   * Get all current query parameters as an object
   */
  const getAllParams = useCallback(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  return {
    value: getValue(),
    setValue,
    removeParam,
    allParams: getAllParams(),
    searchParams
  };
};