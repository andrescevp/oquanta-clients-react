import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

import { Transition } from '@headlessui/react';

import { PasswordResetApi } from '../../api-generated/api';
// Import your logo
import logo from '../../assets/images/oquanta.png';
import { AlertCircleIcon, MailIcon } from '../../components/UI/Icons';
import ButtonLoader from '../../components/UI/molecules/ButtonLoder';
import { cn } from '../../lib/utils';
import { settings } from '../../settings';

type FormValues = {
    email: string;
};

/**
 * Request Password Reset page
 * Allows users to request a password reset link via email
 */
export const RequestPasswordReset: React.FC = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const api = new PasswordResetApi(settings.apiClientBaseConfig);
            await api.postApiResetPasswordRequest({ email: data.email });
            setSuccess(true);
        } catch (err) {
            // For security, we show the same message even if email doesn't exist
            setError(t('Error sending reset link. Please verify your email address and try again.'));
            console.error('Password reset request error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-12'>
            <div className='w-full max-w-md relative'>
                {/* Decorative elements */}
                <div
                    className='absolute -top-10 -left-10 w-32 h-32 bg-pumpkin-orange/10 rounded-full blur-3xl'
                    aria-hidden='true'
                />
                <div
                    className='absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl'
                    aria-hidden='true'
                />

                {/* Request reset card */}
                <div className='relative backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 pointer-events-none' />

                    <div className='relative z-10'>
                        {/* Logo */}
                        <div className='flex justify-center mb-8'>
                            <LazyLoadImage
                                alt={t('Logo oQuanta')}
                                src={logo}
                                className='h-12 w-auto transform transition-transform hover:scale-105'
                                effect='opacity'
                            />
                        </div>

                        {/* Title */}
                        <h2 className='text-center text-2xl font-semibold text-gray-900 dark:text-white mb-6'>
                            {success ? t('Check your email') : t('Reset your password')}
                        </h2>

                        {/* Success message or form */}
                        {success ? (
                            <div className='text-center'>
                                <p className='text-gray-600 dark:text-gray-300 mb-6'>
                                    {t("If an account exists with that email, we've sent password reset instructions.")}
                                </p>
                                <Link to='/login' className='inline-block'>
                                    <ButtonLoader
                                        className={cn(
                                            'flex justify-center items-center py-3 px-6 rounded-xl text-base font-medium text-white',
                                            'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 hover:from-pumpkin-orange hover:to-pumpkin-orange',
                                            'shadow-lg shadow-pumpkin-orange/20 dark:shadow-pumpkin-orange/10',
                                            'transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]',
                                            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pumpkin-orange',
                                        )}>
                                        {t('Return to login')}
                                    </ButtonLoader>
                                </Link>
                            </div>
                        ) : (
                            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)} noValidate>
                                {/* Error message */}
                                <Transition
                                    show={!!error}
                                    enter='transition-opacity duration-300'
                                    enterFrom='opacity-0'
                                    enterTo='opacity-100'
                                    leave='transition-opacity duration-200'
                                    leaveFrom='opacity-100'
                                    leaveTo='opacity-0'>
                                    <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-start gap-3 text-red-700 dark:text-red-400'>
                                        <AlertCircleIcon className='h-5 w-5 flex-shrink-0 mt-0.5' />
                                        <p className='text-sm'>{error}</p>
                                    </div>
                                </Transition>

                                {/* Instructions */}
                                <p className='text-gray-600 dark:text-gray-300'>
                                    {t(
                                        "Enter your email address below and we'll send you instructions to reset your password.",
                                    )}
                                </p>

                                {/* Email field */}
                                <div>
                                    <label
                                        htmlFor='email'
                                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        {t('Email address')}
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <MailIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                        </div>
                                        <input
                                            id='email'
                                            type='email'
                                            autoComplete='email'
                                            className={cn(
                                                'block w-full pl-10 pr-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50',
                                                'border border-gray-300 dark:border-gray-600 rounded-xl',
                                                'focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange outline-none',
                                                'transition-all duration-200 ease-in-out',
                                                errors.email &&
                                                    'border-red-500 dark:border-red-500 focus:ring-red-500/50 focus:border-red-500',
                                            )}
                                            disabled={isLoading}
                                            {...register('email', {
                                                required: t('Email address is required'),
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: t('Please enter a valid email address'),
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className='mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5'>
                                            <AlertCircleIcon className='h-4 w-4' />
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit button */}
                                <div className='pt-2'>
                                    <ButtonLoader
                                        type='submit'
                                        disabled={isLoading}
                                        loading={isLoading}
                                        className={cn(
                                            'w-full flex justify-center items-center py-3 px-4 rounded-xl text-base font-medium text-white',
                                            'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 hover:from-pumpkin-orange hover:to-pumpkin-orange',
                                            'shadow-lg shadow-pumpkin-orange/20 dark:shadow-pumpkin-orange/10',
                                            'transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]',
                                            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pumpkin-orange',
                                            'disabled:opacity-60 disabled:pointer-events-none',
                                        )}
                                        iconLoaderClassName='animate-spin w-5 h-5 text-white mx-auto'>
                                        {t('Send reset link')}
                                    </ButtonLoader>
                                </div>

                                {/* Back to login link */}
                                <div className='flex justify-center pt-2'>
                                    <Link
                                        to='/login'
                                        className='text-sm font-medium text-pumpkin-orange hover:text-pumpkin-orange/80 transition-colors'>
                                        {t('Back to login')}
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestPasswordReset;
