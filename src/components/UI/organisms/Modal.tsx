import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import { IconClose } from "../Icons";
import ModalFooter from '../molecules/ModalFooter';

interface ModalProps {
    title: string | React.ReactNode | React.ReactNode[];
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    showCLoseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({title, isOpen, onClose, children, footer, showCLoseButton = true}) => {
    const { t } = useTranslation();

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                </Transition.Child>

                {/* Modal */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white dark:bg-dark-900 rounded-lg shadow-lg overflow-hidden w-11/12 max-w-md">
                            <Dialog.Title as="div" className="bg-gray-100 dark:bg-dark-800 px-4 py-3 flex justify-between items-center">
                                <div className="font-medium">{title}</div>
                                <button
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={onClose}
                                >
                                    <IconClose />
                                </button>
                            </Dialog.Title>
                            <div className='p-4'>{children}</div>
                            <ModalFooter>
                                {showCLoseButton && (
                                    <button
                                        className='bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500 transition-colors duration-200'
                                        onClick={onClose}
                                        title={t('Close')}>
                                        <IconClose/>
                                    </button>
                                )}
                                {footer}
                            </ModalFooter>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
