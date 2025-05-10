import * as React from 'react';

import { Transition } from '@headlessui/react';

import { cn } from '../../../lib/utils';
import { AlertCircleIcon } from '../Icons';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    resizable?: boolean;
}

/**
 * Textarea component for multiline text input
 * Follows the same styling patterns as Input component
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    // eslint-disable-next-line complexity
    (props: TextareaProps, ref) => {
        const { className, error, icon, iconPosition = 'left', resizable = true, rows = 3, ...rest } = props;

        const hasError = error !== undefined && error !== false;

        return (
            <div className='w-full space-y-1.5'>
                <div className='relative'>
                    {icon && iconPosition === 'left' && (
                        <div className='absolute left-3 top-3 text-gray-500 dark:text-gray-400'>{icon}</div>
                    )}

                    <textarea
                        className={cn(
                            'w-full bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm',
                            'border border-gray-300 dark:border-gray-600',
                            'rounded-xl transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:border-pumpkin-orange',
                            icon && iconPosition === 'left' ? 'pl-10 pr-4' : 'px-4',
                            icon && iconPosition === 'right' ? 'pr-10 pl-4' : 'px-4',
                            'py-2.5',
                            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800/50',
                            !resizable && 'resize-none',
                            hasError
                                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                                : 'focus:ring-pumpkin-orange/50',
                            className,
                        )}
                        ref={ref}
                        rows={rows}
                        {...rest}
                    />

                    {icon && iconPosition === 'right' && (
                        <div className='absolute right-3 top-3 text-gray-500 dark:text-gray-400'>{icon}</div>
                    )}

                    {hasError && typeof error === 'boolean' && (
                        <div className='absolute right-3 top-3 text-red-500'>
                            <AlertCircleIcon className='h-5 w-5' />
                        </div>
                    )}
                </div>

                <Transition
                    show={hasError && error !== true}
                    enter='transition-opacity duration-200'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='transition-opacity duration-150'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <div className='flex items-start space-x-1.5 text-red-600 dark:text-red-400 text-sm mt-1'>
                        <AlertCircleIcon className='h-4 w-4 mt-0.5 flex-shrink-0' />
                        <span>{error}</span>
                    </div>
                </Transition>
            </div>
        );
    },
);

Textarea.displayName = 'Textarea';

export default Textarea;
