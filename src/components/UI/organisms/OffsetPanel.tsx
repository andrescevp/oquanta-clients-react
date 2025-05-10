import React, { Suspense, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { useQueryParams } from '../../../hooks/useQueryParams';
import { cn } from '../../../lib/utils';
import { IconChevronLeft, IconClose, IconMenu } from '../Icons';

interface OffsetPanelProps {
    children: React.ReactNode;
    position?: 'left' | 'right';
    title?: string;
    className?: string;
    buttonText?: string;
    buttonIcon?: React.ElementType;
    buttonClassName?: string;
    buttonPosition?: 'fixed' | 'inline';
    buttonIconClassName?: string;
    /**
     * Unique identifier for this panel in URL params
     * @default "panel"
     */
    panelId?: string;
    /**
     * Whether to persist panel state in URL
     * @default true
     */
    persistState?: boolean;
    /**
     * Default state when no URL parameter exists
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Callback function executed when panel opens
     */
    onOpen?: () => void;
    /**
     * Callback function executed when panel closes
     */
    onClose?: () => void;
    /**
     * Whether to lazily load panel content
     * @default true
     */
    lazy?: boolean;
}

// eslint-disable-next-line complexity
export const OffsetPanel: React.FC<OffsetPanelProps> = ({
    children,
    position = 'right',
    title,
    className,
    buttonText,
    buttonIcon: ButtonIcon = IconMenu,
    buttonClassName,
    buttonPosition = 'inline',
    buttonIconClassName = 'w-5 h-5',
    panelId = 'panel',
    persistState = true,
    defaultOpen = false,
    onOpen,
    onClose,
    lazy = true,
}) => {
    // Use useQueryParams to manage state in URL
    const { value: panelStateParam, setValue: setPanelState } = useQueryParams<string>(`${panelId}_open`);

    // Determine initial state based on URL or defaultOpen
    const initialIsOpen = persistState
        ? panelStateParam === 'true' || (panelStateParam === null && defaultOpen)
        : defaultOpen;

    const [isOpen, setIsOpen] = useState(initialIsOpen);
    const [width, setWidth] = useState<number | undefined>(undefined);
    const [isDragging, setIsDragging] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const startPosRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);
    const previousIsOpenRef = useRef(initialIsOpen);

    // Sync state changes with URL
    useEffect(() => {
        if (persistState) {
            setPanelState(isOpen ? 'true' : 'false', true); // true for replaceState
        }

        // Execute callbacks when state changes
        if (isOpen !== previousIsOpenRef.current) {
            if (isOpen && onOpen) {
                onOpen();
            } else if (!isOpen && onClose) {
                onClose();
            }
            previousIsOpenRef.current = isOpen;
        }
    }, [isOpen, persistState, setPanelState, onOpen, onClose]);

    const openPanel = () => setIsOpen(true);
    const closePanel = () => setIsOpen(false);

    // Calculate initial width (50% on large screens, 80% on small)
    useEffect(() => {
        if (isOpen && !width) {
            const windowWidth = window.innerWidth;
            const initialWidth = windowWidth >= 1024 ? windowWidth * 0.5 : windowWidth * 0.8;
            setWidth(initialWidth);
        }
    }, [isOpen, width]);

    // Drag handling
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startPosRef.current = position === 'right' ? e.clientX : -e.clientX;
        startWidthRef.current = width || 0;
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const currentPos = position === 'right' ? e.clientX : -e.clientX;
            const delta = startPosRef.current - currentPos;
            const newWidth =
                position === 'right'
                    ? Math.max(300, Math.min(window.innerWidth * 0.9, startWidthRef.current + delta))
                    : Math.max(300, Math.min(window.innerWidth * 0.9, startWidthRef.current - delta));

            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, position]);

    // Handle changes to defaultOpen prop
    useEffect(() => {
        if (defaultOpen !== isOpen) {
            setIsOpen(defaultOpen);
        }
    }, [defaultOpen]);

    return (
        <>
            {/* Button to open panel */}
            <button
                type='button'
                onClick={openPanel}
                className={cn(
                    'btn btn-outline inline-flex items-center justify-center gap-2',
                    'text-sm font-medium transition-all duration-200 ease-in-out',
                    'text-white shadow-lg',
                    'hover:translate-y-[-2px] hover:shadow-xl',
                    'focus:outline-none focus:ring-2 focus:ring-pumpkin-orange/50',
                    'active:translate-y-[1px] active:shadow-md',
                    buttonPosition === 'fixed' ? 'fixed z-10' : '',
                    isOpen && 'bg-gradient-to-r from-iris-purple to-iris-purple/80 shadow-iris-purple/20',
                    buttonClassName,
                )}
                aria-label={buttonText || 'Open panel'}>
                {ButtonIcon && <ButtonIcon className={buttonIconClassName} />}
                {buttonText}
            </button>

            {/* Sliding panel */}
            <Transition.Root show={isOpen} as={React.Fragment}>
                <Dialog as='div' className='relative z-40' onClose={closePanel}>
                    <Transition.Child
                        as={React.Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'>
                        <div className='fixed inset-0 bg-gray-500/75 dark:bg-black/80 backdrop-blur-sm transition-opacity' />
                    </Transition.Child>

                    <div className='fixed inset-0 overflow-hidden'>
                        <div className='absolute inset-0 overflow-hidden'>
                            <div
                                className={cn(
                                    'fixed inset-y-0 flex max-w-full',
                                    position === 'right' ? 'right-0' : 'left-0',
                                )}>
                                <Transition.Child
                                    as={React.Fragment}
                                    enter='transform transition ease-in-out duration-500'
                                    enterFrom={position === 'right' ? 'translate-x-full' : '-translate-x-full'}
                                    enterTo='translate-x-0'
                                    leave='transform transition ease-in-out duration-500'
                                    leaveFrom='translate-x-0'
                                    leaveTo={position === 'right' ? 'translate-x-full' : '-translate-x-full'}>
                                    <Dialog.Panel
                                        className='w-screen flex'
                                        style={{
                                            width: width ? `${width}px` : undefined,
                                        }}>
                                        {/* Draggable border/handle */}
                                        <div
                                            className={cn(
                                                'absolute inset-y-0 cursor-ew-resize w-1.5 z-10',
                                                'transition-all duration-200 ease-in-out',
                                                position === 'right' ? 'left-0' : 'right-0',
                                                isDragging
                                                    ? 'bg-pumpkin-orange shadow-lg shadow-pumpkin-orange/20'
                                                    : 'bg-gradient-to-r from-gray-300/60 to-gray-300/80 dark:from-gray-600/60 dark:to-gray-600/80 hover:bg-iris-purple hover:shadow-md',
                                            )}
                                            onMouseDown={handleMouseDown}
                                            title='Resize panel'
                                        />
                                        <div
                                            ref={panelRef}
                                            className={cn(
                                                'flex flex-col h-full flex-1 overflow-hidden',
                                                'bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg',
                                                'border-gray-200 dark:border-gray-700',
                                                position === 'right' ? 'border-l' : 'border-r',
                                                'shadow-2xl',
                                                className,
                                            )}>
                                            <div
                                                className={cn(
                                                    'flex justify-between items-center p-4',
                                                    'border-b border-gray-200 dark:border-gray-700',
                                                    'bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30',
                                                )}>
                                                <Dialog.Title className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                                                    {position === 'left' ? (
                                                        <IconChevronLeft className='w-5 h-5 text-pumpkin-orange' />
                                                    ) : (
                                                        <IconChevronLeft className='w-5 h-5 text-pumpkin-orange transform rotate-180' />
                                                    )}
                                                    {title || 'Panel'}
                                                </Dialog.Title>
                                                <button
                                                    type='button'
                                                    className={cn(
                                                        'p-2 rounded-xl inline-flex items-center justify-center',
                                                        'text-gray-500 hover:text-pumpkin-orange dark:text-gray-400 dark:hover:text-pumpkin-orange',
                                                        'hover:bg-gray-100 dark:hover:bg-gray-700/50',
                                                        'focus:outline-none focus:ring-2 focus:ring-pumpkin-orange/50',
                                                        'transition-all duration-200 ease-in-out',
                                                        'hover:translate-y-[-1px]',
                                                    )}
                                                    onClick={closePanel}
                                                    aria-label='Close panel'>
                                                    <IconClose className='h-5 w-5' />
                                                </button>
                                            </div>
                                            <div className='relative flex-1 overflow-auto p-4 dark:bg-gray-800/90 dark:text-gray-200'>
                                                {lazy ? (
                                                    <Suspense
                                                        fallback={
                                                            <div className='flex items-center justify-center h-full'>
                                                                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pumpkin-orange'></div>
                                                            </div>
                                                        }>
                                                        {children}
                                                    </Suspense>
                                                ) : (
                                                    children
                                                )}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
};

export default OffsetPanel;
