import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Transition } from '@headlessui/react';

import { UserInvitationAccept, UserInvitationsApi,UserInvitationValidation } from '../../api-generated/api';
import logo from '../../assets/images/oquanta.png';
import { AlertCircleIcon, IconCheck as CheckIcon, LockIcon } from '../../components/UI/Icons';
import ButtonLoader from '../../components/UI/molecules/ButtonLoder';
import { cn } from '../../lib/utils';
import { settings } from '../../settings';

type FormValues = {
  password: string;
  confirmPassword: string;
};

/**
 * Accept Invitation Page
 * Allows invited users to set their password and complete registration
 */
// eslint-disable-next-line complexity
const AcceptInvitationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch
  } = useForm<FormValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Get password value for confirmation validation
  const password = watch('password');

  // Validate invitation token when component mounts
  useEffect(() => {
    const validateInvitationToken = async () => {
      if (!token) {
        setValidatingToken(false);
        setError(t('Invalid or missing invitation token'));
        return;
      }

      try {
        const api = new UserInvitationsApi(settings.apiClientBaseConfig);
        const tokenValidation: UserInvitationValidation = { token };
        const response = await api.postApiValidateInvitationToken(tokenValidation);
        
        if (response.data.valid) {
          setTokenValid(true);
          if (response.data.userEmail) {
            setUserEmail(response.data.userEmail);
          }
        } else {
          setError(t('This invitation link is no longer valid. It may have expired or been used already.'));
        }
      } catch (err) {
        setError(t('Unable to validate invitation. The link may be invalid or expired.'));
        console.error('Invitation token validation error:', err);
      } finally {
        setValidatingToken(false);
      }
    };

    validateInvitationToken();
  }, [token, t]);

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      setError(t('Missing invitation token'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = new UserInvitationsApi(settings.apiClientBaseConfig);
      const acceptData: UserInvitationAccept = { 
        token, 
        password: data.password 
      };
      
      await api.postApiAcceptUserInvitation(acceptData);
      setSuccess(true);
      
      // Redirect to login after successful acceptance
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(t('Failed to complete registration. Please try again or request a new invitation.'));
      console.error('Invitation acceptance error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-pumpkin-orange/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-iris-purple/10 rounded-full blur-3xl" aria-hidden="true" />
        
        {/* Accept invitation card */}
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
            
            {/* Title */}
            <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {validatingToken 
                ? t('Verifying invitation')
                : success 
                  ? t('Registration complete')
                  : t('Complete your registration')}
            </h2>
            
            {/* Loading state */}
            {validatingToken && (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-12 h-12 rounded-full border-4 border-iris-purple/30 border-t-iris-purple animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">{t('Verifying your invitation...')}</p>
              </div>
            )}
            
            {/* Error state - invalid token */}
            {!validatingToken && !tokenValid && !success && (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-start gap-3 text-red-700 dark:text-red-400">
                  <AlertCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
                <div className="flex justify-center">
                  <Link to="/login" className="inline-block">
                    <ButtonLoader
                      className={cn(
                        'flex justify-center items-center py-3 px-6 rounded-xl text-base font-medium text-white',
                        'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 hover:from-pumpkin-orange hover:to-pumpkin-orange',
                        'shadow-lg shadow-pumpkin-orange/20 dark:shadow-pumpkin-orange/10',
                        'transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pumpkin-orange'
                      )}
                    >
                      {t('Go to login')}
                    </ButtonLoader>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Success state */}
            {success && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <CheckIcon className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('Your registration is now complete. You will be redirected to the login page.')}
                </p>
                <Link to="/login" className="inline-block">
                  <ButtonLoader
                    className={cn(
                      'flex justify-center items-center py-3 px-6 rounded-xl text-base font-medium text-white',
                      'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 hover:from-pumpkin-orange hover:to-pumpkin-orange',
                      'shadow-lg shadow-pumpkin-orange/20 dark:shadow-pumpkin-orange/10',
                      'transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pumpkin-orange'
                    )}
                  >
                    {t('Go to login')}
                  </ButtonLoader>
                </Link>
              </div>
            )}
            
            {/* Accept invitation form */}
            {!validatingToken && tokenValid && !success && (
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Error message */}
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
                    <p className="text-sm">{error}</p>
                  </div>
                </Transition>
                
                {/* Welcome message with user email */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('Welcome')} {userEmail ? <span className="font-medium text-iris-purple dark:text-iris-purple/90">{userEmail}</span> : ''}! {t('Please set your password to complete your registration.')}
                  </p>
                </div>
                
                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('Password')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={cn(
                        'block w-full pl-10 pr-10 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50',
                        'border border-gray-300 dark:border-gray-600 rounded-xl',
                        'focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange outline-none',
                        'transition-all duration-200 ease-in-out',
                        errors.password && 'border-red-500 dark:border-red-500 focus:ring-red-500/50 focus:border-red-500'
                      )}
                      disabled={isLoading}
                      {...register('password', { 
                        required: t('Password is required'),
                        minLength: {
                          value: 8,
                          message: t('Password must be at least 8 characters long')
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? t('Hide password') : t('Show password')}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertCircleIcon className="h-4 w-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
                
                {/* Confirm password field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('Confirm password')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={cn(
                        'block w-full pl-10 pr-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50',
                        'border border-gray-300 dark:border-gray-600 rounded-xl',
                        'focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange outline-none',
                        'transition-all duration-200 ease-in-out',
                        errors.confirmPassword && 'border-red-500 dark:border-red-500 focus:ring-red-500/50 focus:border-red-500'
                      )}
                      disabled={isLoading}
                      {...register('confirmPassword', { 
                        required: t('Please confirm your password'),
                        validate: value => 
                          value === password || t('Passwords do not match')
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertCircleIcon className="h-4 w-4" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                {/* Submit button */}
                <div className="pt-2">
                  <ButtonLoader
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                    className={cn(
                      'w-full flex justify-center items-center py-3 px-4 rounded-xl text-base font-medium text-white',
                      'bg-gradient-to-r from-iris-purple to-iris-purple/80 hover:from-iris-purple hover:to-iris-purple',
                      'shadow-lg shadow-iris-purple/20 dark:shadow-iris-purple/10',
                      'transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iris-purple',
                      'disabled:opacity-60 disabled:pointer-events-none'
                    )}
                    iconLoaderClassName="animate-spin w-5 h-5 text-white mx-auto"
                  >
                    {t('Complete registration')}
                  </ButtonLoader>
                </div>
                
                {/* Login link */}
                <div className="flex justify-center pt-2">
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-pumpkin-orange hover:text-pumpkin-orange/80 transition-colors"
                  >
                    {t('Already have an account? Login')}
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

export default AcceptInvitationPage;