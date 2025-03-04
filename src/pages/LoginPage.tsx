import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Transition } from '@headlessui/react';

import logo from '../assets/images/oquanta.png';
// Asumiendo que estos iconos están definidos en su archivo de iconos
import { AlertCircleIcon,EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '../components/UI/Icons';
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
    const [showPassword, setShowPassword] = useState(false);
    
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
            await login(data as LoginCredentials);
        } catch (err) {
            // El error se maneja en el contexto de autenticación
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
            <div className="w-full max-w-md relative">
                {/* Elementos decorativos */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-pumpkin-orange/10 rounded-full blur-3xl" aria-hidden="true" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" aria-hidden="true" />
                
                {/* Tarjeta de login */}
                <div className="relative backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 pointer-events-none" />
                    
                    <div className="relative z-10">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <LazyLoadImage
                                alt={t('Logo oQuanta')}
                                src={logo}
                                className="h-12 w-auto transform transition-transform hover:scale-105"
                                effect="opacity"
                            />
                        </div>
                        
                        {/* Título */}
                        <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                            {t('Bienvenido de vuelta')}
                        </h2>
                        
                        {/* Formulario */}
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                            {/* Alerta de error */}
                            <Transition
                                show={!!error}
                                enter="transition-opacity duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-start gap-3 text-red-700 dark:text-red-400">
                                    <AlertCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm">{t('Email o contraseña incorrectos')}</p>
                                </div>
                            </Transition>
                            
                            {/* Campo de email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('Correo electrónico')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        className={cn(
                                            'block w-full pl-10 pr-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50',
                                            'border border-gray-300 dark:border-gray-600 rounded-xl',
                                            'focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange outline-none',
                                            'transition-all duration-200 ease-in-out',
                                            errors.email && 'border-red-500 dark:border-red-500 focus:ring-red-500/50 focus:border-red-500'
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
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                        <AlertCircleIcon className="h-4 w-4" />
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            
                            {/* Campo de contraseña */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('Contraseña')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        className={cn(
                                            'block w-full pl-10 pr-10 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50',
                                            'border border-gray-300 dark:border-gray-600 rounded-xl',
                                            'focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange outline-none',
                                            'transition-all duration-200 ease-in-out',
                                            errors.password && 'border-red-500 dark:border-red-500 focus:ring-red-500/50 focus:border-red-500'
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
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? t('Ocultar contraseña') : t('Mostrar contraseña')}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                        <AlertCircleIcon className="h-4 w-4" />
                                        {errors.password.message}
                                    </p>
                                )}
                                
                                <div className="flex justify-end mt-2">
                                    <button 
                                        type="button" 
                                        className="text-sm text-pumpkin-orange hover:text-pumpkin-orange/80 font-medium transition-colors"
                                    >
                                        {t('¿Olvidaste tu contraseña?')}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Botón de envío */}
                            <div className="pt-2">
                                <ButtonLoader
                                    type="submit"
                                    disabled={isLoading}
                                    loading={isLoading}
                                    className={cn(
                                        'w-full flex justify-center items-center py-3 px-4 rounded-xl text-base font-medium text-white',
                                        'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 hover:from-pumpkin-orange hover:to-pumpkin-orange',
                                        'shadow-lg shadow-pumpkin-orange/20 dark:shadow-pumpkin-orange/10',
                                        'transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]',
                                        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pumpkin-orange',
                                        'disabled:opacity-60 disabled:pointer-events-none'
                                    )}
                                    iconLoaderClassName="animate-spin w-5 h-5 text-white mx-auto"
                                >
                                    {t('Iniciar sesión')}
                                </ButtonLoader>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};