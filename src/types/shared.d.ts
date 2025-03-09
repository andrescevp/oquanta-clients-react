export interface SelectOption {
    value: string;
    label: string;
}

export interface UseAnyCacheInterfaceReturn<T> {
    storedValue: T;
    setValue: (value: T, expirationMs?: number) => void;
    deleteValue: () => void;
    expireValue: () => void;
    key: string;
    initialValue: T;
  }

export interface UseAnyCacheInterfaceProps<T> {
    key: string, 
    initialValue: T
}

export interface StorageItem<T> {
    value: T;
    expiry?: number | null; // timestamp de expiración o null si no expira
  }