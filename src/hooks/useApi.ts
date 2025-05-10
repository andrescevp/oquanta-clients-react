import { useState } from 'react';

import { Configuration } from '../api-generated';
import { BaseAPI } from '../api-generated/base';
import { useAuth } from '../context/AuthContext';

// Tipos auxiliares para inferir tipos de retorno y parámetros
type ApiMethod<T, K extends keyof T> = T[K];
type ApiMethodReturn<T, K extends keyof T> = ApiMethod<T, K> extends (...args: any[]) => Promise<infer R> ? R : never;
type ApiMethodParams<T, K extends keyof T> = ApiMethod<T, K> extends (...args: infer P) => any ? P : never;

export function useApi<T extends BaseAPI>(api: new (configuration?: Configuration) => T) {
    const { configuration } = useAuth();
    const apiClient = new api(configuration) as T;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Llama a un método de la API con inferencia de tipos automática
     * @param apiMethod - El método de la API a llamar (autocompletado disponible)
     * @param args - Los argumentos para el método (tipados según el método)
     * @returns Una promesa con el resultado tipado según el método
     */
    const call = async <K extends keyof T>(
        apiMethod: K,
        ...args: ApiMethodParams<T, K>
    ): Promise<ApiMethodReturn<T, K>> => {
        if (!apiClient[apiMethod]) {
            throw new Error(`Method ${String(apiMethod)} not found on api`);
        }

        try {
            setIsLoading(true);
            setError(null);

            // Obtenemos el método de la API y lo invocamos con los argumentos proporcionados
            const method = apiClient[apiMethod] as (...args: any[]) => Promise<ApiMethodReturn<T, K>>;
            const result = await method.apply(apiClient, args);
            return result;
        } catch (err) {
            const callError = err instanceof Error ? err : new Error(String(err));
            setError(callError);
            throw callError;
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setIsLoading(false);
        setError(null);
    };

    return {
        call,
        isLoading,
        error,
        reset,
        client: apiClient,
    };
}
