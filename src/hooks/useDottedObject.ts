type Primitive = string | number | boolean | symbol | null | undefined;
type DottedKeys<T, Prefix extends string = ''> = {
    [K in keyof T]: T[K] extends Primitive
        ? `${Prefix}${Extract<K, string>}`
        : T[K] extends Array<any>
          ? `${Prefix}${Extract<K, string>}`
          : T[K] extends object
            ? `${Prefix}${Extract<K, string>}` | DottedKeys<T[K], `${Prefix}${Extract<K, string>}.`>
            : never;
}[keyof T];

type DottedAccess<T> = {
    [K in DottedKeys<T>]: any;
} & {
    [key: string]: any; // fallback to avoid TS7053
};

export function useDottedObject<T extends object>(input: T): DottedAccess<T> {
    const result: Record<string, any> = {};

    const build = (obj: any, prefix = '') => {
        for (const key in obj) {
            const value = obj[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;

            result[fullKey] = value;

            if (value && typeof value === 'object' && !Array.isArray(value)) {
                build(value, fullKey);
            }
        }
    };

    build(input);
    return result as DottedAccess<T>;
}
