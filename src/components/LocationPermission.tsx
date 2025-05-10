import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Dialog, Transition } from '@headlessui/react';

import { useUserLocation } from '../hooks/useUserLocation';

interface LocationPermissionProps {
    onPermissionGranted?: () => void;
    onPermissionDenied?: () => void;
    onPostalCodeSet?: (code: string) => void;
    showDialog?: boolean;
}

export const LocationPermission: React.FC<LocationPermissionProps> = ({
    onPermissionGranted,
    onPermissionDenied,
    onPostalCodeSet,
    showDialog: externalShowDialog,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { permissionStatus, requestPermission, setManualPostalCode, error } = useUserLocation();

    const [postalCode, setPostalCode] = useState('');
    const [postalCodeError, setPostalCodeError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [showPostalCodeForm, setShowPostalCodeForm] = useState(false);

    // Determinar si mostrar el diálogo basado en props externas o estado interno
    const showDialog = externalShowDialog !== undefined ? externalShowDialog : isOpen;

    // Detectar cuando el permiso cambia a denegado
    useEffect(() => {
        if (permissionStatus === 'denied') {
            setShowPostalCodeForm(true);
        }
    }, [permissionStatus]);

    // Manejar la solicitud de permiso
    const handleRequestPermission = async () => {
        const granted = await requestPermission();

        if (granted) {
            setIsOpen(false);
            onPermissionGranted?.();
        } else {
            setShowPostalCodeForm(true);
        }
    };

    // Validar y guardar el código postal
    const handlePostalCodeSubmit = () => {
        const trimmedCode = postalCode.trim();

        if (!trimmedCode || trimmedCode.length < 4) {
            setPostalCodeError(t('Por favor, introduce un código postal válido'));
            return;
        }

        setManualPostalCode(trimmedCode);
        setPostalCodeError(null);
        setIsOpen(false);

        if (onPostalCodeSet) {
            onPostalCodeSet(trimmedCode);
        }

        // Redirigir a la página del catálogo con el código postal
        navigate('/postal-catalog', { state: { postalCode: trimmedCode } });
    };

    // Manejar el rechazo definitivo
    const handleFinalDenial = () => {
        setIsOpen(false);
        onPermissionDenied?.();
        // Redirigir a la página del catálogo de todos modos
        navigate('/postal-catalog');
    };

    return (
        <Transition appear show={showDialog} as={Fragment}>
            <Dialog
                as='div'
                className='relative z-50'
                onClose={() => {
                    console.log('closed');
                }}
                static>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <div className='fixed inset-0 bg-black/50' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'>
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                    {showPostalCodeForm || permissionStatus === 'denied'
                                        ? t('Ubicación necesaria')
                                        : t('Permitir acceso a la ubicación')}
                                </Dialog.Title>

                                <div className='mt-4'>
                                    {showPostalCodeForm || permissionStatus === 'denied' ? (
                                        <div>
                                            <p className='text-sm text-gray-600 mb-4'>
                                                {t(
                                                    'Has denegado el acceso a tu ubicación. Por favor, introduce tu código postal para poder ofrecerte servicios cercanos.',
                                                )}
                                            </p>

                                            <div className='mt-2'>
                                                <input
                                                    type='text'
                                                    value={postalCode}
                                                    onChange={e => setPostalCode(e.target.value)}
                                                    placeholder={t('Ingresa tu código postal')}
                                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                />
                                                {postalCodeError && (
                                                    <p className='mt-1 text-xs text-red-600'>{postalCodeError}</p>
                                                )}
                                            </div>

                                            <div className='mt-4 flex justify-between'>
                                                <button
                                                    type='button'
                                                    onClick={handleFinalDenial}
                                                    className='inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500'>
                                                    {t('Omitir')}
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={handlePostalCodeSubmit}
                                                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'>
                                                    {t('Continuar')}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className='text-sm text-gray-600'>
                                                {t(
                                                    'Necesitamos acceso a tu ubicación para mostrarte servicios cercanos. Tu ubicación será almacenada localmente y solo será utilizada para mejorar tu experiencia.',
                                                )}
                                            </p>

                                            {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}

                                            <div className='mt-4 flex justify-end space-x-3'>
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        setShowPostalCodeForm(true);
                                                    }}
                                                    className='inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500'>
                                                    {t('No permitir')}
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={handleRequestPermission}
                                                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'>
                                                    {t('Permitir acceso')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
