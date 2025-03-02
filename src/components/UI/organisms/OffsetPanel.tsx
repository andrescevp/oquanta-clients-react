import React, { useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { cn } from '../../../lib/utils';
import { IconMenu } from '../Icons';

interface OffsetPanelProps {
  children: React.ReactNode;
  position?: 'left' | 'right';
  title?: string;
  className?: string;
  buttonText?: string;
  buttonIcon?: React.ElementType;
  buttonClassName?: string;
  buttonPosition?: 'fixed' | 'inline';
}

export const OffsetPanel: React.FC<OffsetPanelProps> = ({
  children,
  position = 'right',
  title,
  className,
  buttonText = 'Abrir panel',
  buttonIcon: ButtonIcon = IconMenu,
  buttonClassName,
  buttonPosition = 'inline',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  // Calcula el ancho inicial (50% en pantallas grandes, 80% en pequeñas)
  useEffect(() => {
    if (isOpen) {
      const windowWidth = window.innerWidth;
      const initialWidth = windowWidth >= 1024 ? windowWidth * 0.5 : windowWidth * 0.8;
      setWidth(initialWidth);
    }
  }, [isOpen]);

  // Gestión del arrastre
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
      const newWidth = position === 'right' 
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

  const buttonClasses = cn(
    'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors',
    'dark:bg-blue-700 dark:hover:bg-blue-800',
    buttonPosition === 'fixed' && 'fixed bottom-4 right-4 z-10 shadow-lg dark:shadow-gray-900',
    buttonClassName
  );

  return (
    <>
      {/* Botón para abrir el panel */}
      <button type="button" onClick={openPanel} className={buttonClasses}>
        {ButtonIcon && <ButtonIcon />}
        {buttonText}
      </button>

      {/* Panel deslizable */}
      <Transition.Root show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-40" onClose={closePanel}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className={cn(
                  "fixed inset-y-0 flex max-w-full",
                  position === 'right' ? 'right-0' : 'left-0'
                )}
              >
                <Transition.Child
                  as={React.Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom={position === 'right' ? 'translate-x-full' : '-translate-x-full'}
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo={position === 'right' ? 'translate-x-full' : '-translate-x-full'}
                >
                  <Dialog.Panel 
                    className="w-screen flex" 
                    style={{ 
                      width: width ? `${width}px` : undefined,
                    }}
                  >
                    {/* Borde arrastrable */}
                    <div
                      className={cn(
                        "absolute inset-y-0 cursor-ew-resize w-1 bg-gray-300 hover:bg-blue-500 transition-colors",
                        "dark:bg-gray-600 dark:hover:bg-blue-600",
                        position === 'right' ? 'left-0' : 'right-0',
                        isDragging && 'bg-blue-600 dark:bg-blue-700'
                      )}
                      onMouseDown={handleMouseDown}
                    />
                    <div
                      ref={panelRef}
                      className={cn(
                        "flex flex-col h-full flex-1 overflow-hidden bg-white shadow-xl",
                        "dark:bg-gray-800 dark:text-gray-100",
                        className
                      )}
                    >
                      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {title || 'Panel'}
                        </Dialog.Title>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={closePanel}
                        >
                          <span className="sr-only">Cerrar panel</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="relative flex-1 overflow-auto dark:bg-gray-800 dark:text-gray-200">
                        {children}
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