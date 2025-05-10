import { useCallback, useState } from 'react';

import { StorageItem, UseAnyCacheInterfaceProps, UseAnyCacheInterfaceReturn } from '../types/shared';

export function useLocalStorage<T>({ key, initialValue }: UseAnyCacheInterfaceProps<T>): UseAnyCacheInterfaceReturn<T> {
    // Estado para almacenar nuestro valor
    // Pasar la función inicial al useState para que solo se ejecute una vez
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);

            if (!item) return initialValue;

            const storedItem: StorageItem<T> = JSON.parse(item);

            // Verificar si el elemento ha expirado
            if (storedItem.expiry && storedItem.expiry < Date.now()) {
                // El elemento ha expirado, eliminarlo y devolver el valor inicial
                window.localStorage.removeItem(key);
                return initialValue;
            }

            // Devolver el valor si no ha expirado
            return storedItem.value;
        } catch (error) {
            console.error('Error al leer del localStorage:', error);
            return initialValue;
        }
    });

    // Función para establecer un valor con expiración opcional
    const setValue = useCallback(
        (value: T, expirationMs?: number) => {
            try {
                // Permitir que el valor sea una función para tener la misma API que useState
                const valueToStore = value instanceof Function ? value(storedValue) : value;

                // Crear el objeto de almacenamiento con información de expiración
                const item: StorageItem<T> = {
                    value: valueToStore,
                    expiry: expirationMs ? Date.now() + expirationMs : null,
                };

                // Actualizar el estado
                setStoredValue(valueToStore);

                // Guardar en localStorage
                window.localStorage.setItem(key, JSON.stringify(item));
            } catch (error) {
                console.error('Error al escribir en localStorage:', error);
            }
        },
        [key, storedValue],
    );

    // Función para eliminar el valor del localStorage
    const deleteValue = useCallback(() => {
        try {
            // Eliminar del localStorage
            window.localStorage.removeItem(key);

            // Reestablecer el valor al inicial
            setStoredValue(initialValue);
        } catch (error) {
            console.error('Error al eliminar del localStorage:', error);
        }
    }, [key, initialValue]);

    // Función para forzar la expiración de un valor
    const expireValue = useCallback(() => {
        try {
            const item = window.localStorage.getItem(key);

            if (item) {
                const storedItem: StorageItem<T> = JSON.parse(item);

                // Establecer la expiración a una fecha anterior
                storedItem.expiry = Date.now() - 1;

                // Actualizar en localStorage
                window.localStorage.setItem(key, JSON.stringify(storedItem));

                // Reestablecer el valor al inicial
                setStoredValue(initialValue);
            }
        } catch (error) {
            console.error('Error al expirar el valor en localStorage:', error);
        }
    }, [key, initialValue]);

    return {
        storedValue,
        setValue,
        deleteValue,
        expireValue,
        key,
        initialValue,
    };
}
