import React, { useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { useQueryParams } from '../../../hooks/useQueryParams';
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
}

// eslint-disable-next-line complexity
export const OffsetPanel: React.FC<OffsetPanelProps> = ({
  children,
  position = 'right',
  title,
  className,
  buttonText = 'Abrir panel',
  buttonIcon: ButtonIcon = IconMenu,
  buttonClassName,
  buttonPosition = 'inline',
  buttonIconClassName = 'w-5 h-5',
  panelId = 'panel',
  persistState = true,
  defaultOpen = false,
}) => {
  // Usar useQueryParams para gestionar el estado en la URL
  const { value: panelStateParam, setValue: setPanelState } = useQueryParams<string>(
    `${panelId}_open`
  );
  
  // Determinar estado inicial basado en URL o defaultOpen
  const initialIsOpen = persistState 
    ? panelStateParam === 'true' || (panelStateParam === null && defaultOpen)
    : defaultOpen;
  
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  
  // Sincronizar cambios de estado con URL
  useEffect(() => {
    if (persistState) {
      setPanelState(isOpen ? 'true' : 'false', true); // true para replaceState
    }
  }, [isOpen, persistState, setPanelState]);

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  // Calcula el ancho inicial (50% en pantallas grandes, 80% en pequeñas)
  useEffect(() => {
    if (isOpen && !width) {
      const windowWidth = window.innerWidth;
      const initialWidth = windowWidth >= 1024 ? windowWidth * 0.5 : windowWidth * 0.8;
      setWidth(initialWidth);
    }
  }, [isOpen, width]);

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

  return (
    <>
      {/* Botón para abrir el panel */}
      <button 
        type="button" 
        onClick={openPanel} 
        className={cn(
          buttonClassName || 'btn',
          isOpen && 'bg-blue-50 text-blue-600 dark:bg-black dark:text-white'
        )}
      >
        {ButtonIcon && <ButtonIcon className={buttonIconClassName} />}
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-black dark:bg-opacity-80 transition-opacity" />
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
                        "absolute inset-y-0 cursor-ew-resize w-1 bg-gray-300 hover:bg-iris-purple transition-colors",
                        "dark:bg-gray-600 dark:hover:bg-iris-purple",
                        position === 'right' ? 'left-0' : 'right-0',
                        isDragging && 'bg-blue-600 dark:bg-blue-700'
                      )}
                      onMouseDown={handleMouseDown}
                    />
                    <div
                      ref={panelRef}
                      className={cn(
                        "flex flex-col h-full flex-1 overflow-hidden bg-white shadow-xl",
                        "dark:bg-black-90 dark:text-gray-100",
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
                      <div className="relative flex-1 overflow-auto dark:bg-black-90 dark:text-gray-200">
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