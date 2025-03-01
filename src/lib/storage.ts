import { User } from '../types/auth';

const STORAGE_PREFIX = '_';

export const storage = {
    getToken: () => localStorage.getItem(`${STORAGE_PREFIX}token`),
    setToken: (token: string) => localStorage.setItem(`${STORAGE_PREFIX}token`, token),
    clearToken: () => localStorage.removeItem(`${STORAGE_PREFIX}token`),
    getUser: () => {
        const user = localStorage.getItem(`${STORAGE_PREFIX}user`);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user: User) => localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user)),
    clearUser: () => localStorage.removeItem(`${STORAGE_PREFIX}user`),
    setExpiration: (expiration: number) => localStorage.setItem(`${STORAGE_PREFIX}expiration`, expiration.toString()),
    getExpiration: () => {
        const expiration = localStorage.getItem(`${STORAGE_PREFIX}expiration`);
        return expiration ? parseInt(expiration) : undefined;
    },
    isSessionExpired: () => {
        const expiration = storage.getExpiration();
        return expiration ? expiration < Date.now() / 1000 : true;
    },
};
