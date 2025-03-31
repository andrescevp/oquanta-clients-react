/**
 * Hook for managing URL query parameters without affecting other parts of the URL
 * @param paramName - The name of the query parameter to manage
 * @returns Object with methods to get, set and remove the parameter
 */
export declare const useQueryParams: <T extends string | number | boolean | null = string>(paramName: string) => {
    value: T | null;
    setValue: (value: T, replaceState?: boolean) => void;
    removeParam: (replaceState?: boolean) => void;
    allParams: Record<string, string>;
    searchParams: URLSearchParams;
};
