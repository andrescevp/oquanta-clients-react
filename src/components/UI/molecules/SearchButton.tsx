import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Transition } from '@headlessui/react';

import { cn } from '../../../lib/utils';
import { IconSearch, IconX } from '../Icons';

interface SearchButtonProps {
  /**
   * Value for the search input
   */
  value: string | null;
  /**
   * Function called when search value changes
   */
  onChange: (value: string | null) => void;
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * CSS class for the container
   */
  className?: string;
  /**
   * Function to call on search submit
   */
  onSubmit?: () => void;
  /**
   * Direction for the search input to expand
   * @default "right"
   */
  expandDirection?: 'left' | 'right';
}

type FormValues = {
  searchQuery: string;
};

/**
 * SearchButton component that shows a search icon and expands to show an input field when clicked
 */
// eslint-disable-next-line complexity
export const SearchButton: React.FC<SearchButtonProps> = ({
  value,
  onChange,
  placeholder,
  className,
  onSubmit,
  expandDirection = 'right'
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(!!value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue: setFormValue,
    watch,
    reset,
    formState
  } = useForm<FormValues>({
    defaultValues: {
      searchQuery: value || ''
    }
  });

  const watchedQuery = watch('searchQuery');

  // Sincronizar el valor externo con el formulario
  useEffect(() => {
    setFormValue('searchQuery', value || '');
  }, [value, setFormValue]);

  // Focus input cuando se expande
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isExpanded]);
  
  // Manejar clicks fuera para colapsar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) && 
        !(event.target as Element).closest('[data-search-button]')
      ) {
        if (isExpanded && !watchedQuery) {
          setIsExpanded(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, watchedQuery]);

  const handleButtonClick = () => {
    if (isExpanded && value) {
      // Si está expandido y tiene valor, limpiar el input
      onChange(null);
      reset({ searchQuery: '' });
      if (onSubmit) onSubmit();
    } else {
      // Toggle estado expandido
      setIsExpanded(!isExpanded);
    }
  };

  const onSubmitForm = (data: FormValues) => {
    if (onSubmit) {
      onSubmit();
    }
  };

  // Registrar el input con manejadores de eventos personalizados
  const { ref, ...inputProps } = register('searchQuery', {
    onChange: (e) => {
      const newValue = e.target.value;
      onChange(newValue !== '' ? newValue : null);
    }
  });

  // Configuraciones de animación según dirección
  const animationClasses = {
    right: {
      enterFrom: "opacity-0 scale-95 -translate-x-4",
      enterTo: "opacity-100 scale-100 translate-x-0",
      leaveFrom: "opacity-100 scale-100 translate-x-0",
      leaveTo: "opacity-0 scale-95 -translate-x-4"
    },
    left: {
      enterFrom: "opacity-0 scale-95 translate-x-4",
      enterTo: "opacity-100 scale-100 translate-x-0", 
      leaveFrom: "opacity-100 scale-100 translate-x-0",
      leaveTo: "opacity-0 scale-95 translate-x-4"
    }
  };

  const animation = animationClasses[expandDirection];

  return (
    <div className={cn(
      "relative flex items-center h-11",
      expandDirection === 'left' ? 'flex-row-reverse' : 'flex-row',
      className
    )}>
      <div className="flex-shrink-0">
        <button 
          type="button"
          data-search-button
          className={cn(
            "flex items-center justify-center btn btn-outline",
            "hover:shadow-md active:scale-95",
            isExpanded && expandDirection === 'right' && "mr-2",
            isExpanded && expandDirection === 'left' && "ml-2"
          )}
          onClick={handleButtonClick}
          title={isExpanded && value ? t('Limpiar búsqueda') : t('Buscar')}
        >
          {isExpanded && value ? (
            <IconX className='w-5 h-5' />
          ) : (
            <IconSearch className='w-5 h-5' />
          )}
        </button>
      </div>

      <Transition
        show={isExpanded}
        enter="transition-all duration-300 ease-out"
        enterFrom={animation.enterFrom}
        enterTo={animation.enterTo}
        leave="transition-all duration-200 ease-in"
        leaveFrom={animation.leaveFrom}
        leaveTo={animation.leaveTo}
      >
        <div className="w-full">
          <form 
            onSubmit={handleSubmit(onSubmitForm)}
            className="relative w-full"
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <IconSearch className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />
            </div>
            
            <input
              {...inputProps}
              ref={(e) => {
                ref(e);
                if (e) inputRef.current = e;
              }}
              type="text"
              className={cn(
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700", 
                "text-gray-900 dark:text-gray-100 text-sm rounded-xl shadow-sm", 
                "focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/70",
                "block w-full pl-10 pr-10 py-2.5 transition-all duration-200"
              )}
              placeholder={placeholder || t('Buscar...')}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsExpanded(false);
                  reset({ searchQuery: '' });
                  onChange(null);
                } else if (e.key === 'Enter' && onSubmit) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />

            {watchedQuery && (
              <button
                type="button"
                onClick={() => {
                  reset({ searchQuery: '' });
                  onChange(null);
                  if (onSubmit) onSubmit();
                  if (inputRef.current) inputRef.current.focus();
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <IconX className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              </button>
            )}
          </form>
        </div>
      </Transition>
    </div>
  );
};