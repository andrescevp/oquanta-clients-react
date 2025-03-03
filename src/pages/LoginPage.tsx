import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import logo from '../assets/images/oquanta.png';
import ButtonLoader from '../components/UI/molecules/ButtonLoder';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { LoginCredentials } from '../types/auth';


type FormValues = {
    email: string;
    password: string;
};

export const LoginPage = () => {
    const { t } = useTranslation();
    const { login, error, isLoading } = useAuth();
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<FormValues>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            // El método login en AuthContext ya maneja la navegación
            // y los errores internamente
            await login(data as LoginCredentials);
        } catch (err) {
            // El error ya se maneja en el contexto de autenticación
            // No necesitamos hacer nada más aquí
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
            <div className='max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md'>
                <LazyLoadImage
                    alt={t('Logo oQuanta')}
                    src={logo} // use normal <img> attributes as props
                    className='h-10 mx-auto'
                    />
                {/* <div>
                    <h2 className='text-center text-3xl font-bold text-gray-900 dark:text-white'>
                        {t('Inicia sesión en tu cuenta')}
                    </h2>
                </div> */}

                <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)} noValidate>
                    {error && (
                        <div className='p-3 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-400'>
                            {t('Email o contraseña incorrectos')}
                        </div>
                    )}

                    <div className='space-y-4'>
                        <div>
                            <label
                                htmlFor='email'
                                className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                {t('Correo electrónico')}
                            </label>
                            <input
                                id='email'
                                type='email'
                                autoComplete='email'
                                className={cn(
                                    'mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white',
                                    'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                                    errors.email && 'border-red-500 dark:border-red-500'
                                )}
                                disabled={isLoading}
                                {...register('email', { 
                                    required: t('El correo electrónico es obligatorio'),
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: t('Ingrese un correo electrónico válido')
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor='password'
                                className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                {t('Contraseña')}
                            </label>
                            <input
                                id='password'
                                type='password'
                                autoComplete='current-password'
                                className={cn(
                                    'mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white',
                                    'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                                    errors.password && 'border-red-500 dark:border-red-500'
                                )}
                                disabled={isLoading}
                                {...register('password', { 
                                    required: t('La contraseña es obligatoria'),
                                    minLength: {
                                        value: 6,
                                        message: t('La contraseña debe tener al menos 6 caracteres')
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <ButtonLoader
                        type='submit'
                        disabled={isLoading}
                        loading={isLoading}
                        className={cn(
                            'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
                            'bg-pumpkin-orange/80 hover:bg-pumpkin-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pumpkin-orange',
                            'disabled:opacity-50 transition-colors shadow dark:shadow-pure-white/50'
                        )}
                        iconLoaderClassName="animate-spin w-5 h-5 text-white mx-auto"
                    >
                        {t('Iniciar sesión')}
                    </ButtonLoader>
                </form>
            </div>
        </div>
    );
};