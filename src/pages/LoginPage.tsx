import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types/auth';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(credentials);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
            <div className='max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md'>
                <div>
                    <h2 className='text-center text-3xl font-bold text-gray-900 dark:text-white'>
                        Sign in to your account
                    </h2>
                </div>

                <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
                    {error && <div className='text-red-500 text-sm text-center'>{error}</div>}

                    <div className='space-y-4'>
                        <div>
                            <label
                                htmlFor='email'
                                className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Email address
                            </label>
                            <input
                                id='email'
                                name='email'
                                type='email'
                                autoComplete='email'
                                required
                                value={credentials.email}
                                onChange={handleChange}
                                className='mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='password'
                                className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Password
                            </label>
                            <input
                                id='password'
                                name='password'
                                type='password'
                                autoComplete='current-password'
                                required
                                value={credentials.password}
                                onChange={handleChange}
                                className='mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'>
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};
