import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';

import { v4 as uuidv4 } from 'uuid';

import { cn } from '../../../lib/utils';
import { IconCheck, IconX } from '../Icons';

interface ConfirmationTooltipProps {
    /**
     * ID for the tooltip, automatically generated if not provided
     */
    id?: string;
    /**
     * The content to wrap with the confirmation tooltip
     */
    children: React.ReactNode;
    /**
     * Message to display in the confirmation tooltip
     */
    confirmationMessage: string;
    /**
     * Function to execute when the user confirms the action
     */
    onConfirm: () => void;
    /**
     * Text for the confirm button
     */
    confirmText?: string;
    /**
     * Text for the cancel button
     */
    cancelText?: string;
    /**
     * Optional class name for the tooltip content
     */
    tooltipClassName?: string;
    /**
     * Optional class name for the confirm button
     */
    confirmButtonClassName?: string;
    /**
     * Optional class name for the cancel button
     */
    cancelButtonClassName?: string;
    /**
     * Tooltip placement
     */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * Function to execute when the user cancels the action
     */
    onCancel?: () => void;
    /**
     * Whether to disable the tooltip functionality
     */
    disabled?: boolean;
}

/**
 * ConfirmationTooltip component that wraps content with a confirmation tooltip
 * Uses react-tooltip to display a confirmation dialog before executing an action
 */
export const ConfirmationTooltip: React.FC<ConfirmationTooltipProps> = ({
    id,
    children,
    confirmationMessage,
    onConfirm,
    confirmText,
    cancelText,
    tooltipClassName,
    confirmButtonClassName,
    cancelButtonClassName,
    placement = 'top',
    onCancel,
    disabled = false,
}) => {
    const { t } = useTranslation();
    const [tooltipId] = useState(`confirmation-tooltip-${id || uuidv4()}`);
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        onConfirm();
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        if (onCancel) onCancel();
    };

    const handleClick = (e: React.MouseEvent) => {
        if (disabled) return;
        e.stopPropagation(); // Aseguramos que no propague el clic
        e.preventDefault();
        setIsOpen(true); // Abre el tooltip
    };

    return (
        <>
            {/* Wrapper con el trigger del tooltip */}
            <span data-tooltip-id={tooltipId} onClick={handleClick} className={disabled ? undefined : 'cursor-pointer'}>
                {children}
            </span>

            {/* Tooltip de confirmación */}
            <Tooltip
                id={tooltipId}
                isOpen={isOpen}
                place={placement}
                clickable={true}
                className={cn(
                    'max-w-xs bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg p-0 border border-gray-200 dark:border-gray-700',
                    tooltipClassName,
                )}
                setIsOpen={setIsOpen}
                noArrow={false}
                openOnClick={true}
                opacity={1}
                style={{
                    zIndex: 9999,
                }}>
                <div className='p-3'>
                    <p className='mb-3 font-medium'>{confirmationMessage}</p>
                    <div className='flex justify-end space-x-2'>
                        <button
                            type='button'
                            onClick={handleCancel}
                            className={cn(
                                'flex items-center px-3 py-1.5 rounded-md text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                                cancelButtonClassName,
                            )}>
                            <IconX className='w-4 h-4 mr-1' />
                            {cancelText || t('Cancelar')}
                        </button>

                        <button
                            type='button'
                            onClick={handleConfirm}
                            className={cn(
                                'flex items-center px-3 py-1.5 rounded-md text-sm text-white bg-red-500 hover:bg-red-600 transition-colors',
                                confirmButtonClassName,
                            )}>
                            <IconCheck className='w-4 h-4 mr-1' />
                            {confirmText || t('Confirmar')}
                        </button>
                    </div>
                </div>
            </Tooltip>
        </>
    );
};
