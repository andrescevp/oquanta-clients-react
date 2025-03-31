import { User } from '../types/auth';
export declare const storage: {
    getToken: () => string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
    getUser: () => any;
    setUser: (user: User) => void;
    clearUser: () => void;
    setExpiration: (expiration: number) => void;
    getExpiration: () => number | undefined;
    isSessionExpired: () => boolean;
};
