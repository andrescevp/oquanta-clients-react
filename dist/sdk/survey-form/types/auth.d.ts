export interface User {
    email: string;
    roles: string[];
}
export interface AuthState {
    user?: User;
    token?: string;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: {
        message: string;
        code: string;
    };
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}
