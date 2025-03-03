import React, { useEffect,useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
}

/**
 * SearchButton component that shows a search icon and expands to show an input field when clicked
 */
export const SearchButton: React.FC<SearchButtonProps> = ({
  value,
  onChange,
  placeholder,
  className,
  onSubmit
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  // Handle clicks outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('button')) {
        if (isExpanded && !value) {
          setIsExpanded(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, value]);

  const handleButtonClick = () => {
    if (isExpanded && value) {
      // If expanded and has value, clear the input
      onChange(null);
    } else {
      // Toggle expand state
      setIsExpanded(!isExpanded);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      onChange(null);
    }
  };

  return (
    <div className={cn("relative flex items-center h-11 justify-start", className)}>      
        <button 
            className={cn(
                "btn",
                isExpanded ? "mr-2" : "text-gray-600 hover:text-blue-600 "
            )}
            onClick={handleButtonClick}
            title={isExpanded ? t('Limpiar búsqueda') : t('Buscar')}
            >
            {isExpanded && value ? (
                <IconX className='w-5 h-5' />
            ) : (
                <IconSearch className='w-5 h-5' />
            )}
        </button>
      {isExpanded && (
        <div className="relative animate-fadeIn w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder={placeholder || t('Buscar...')}
            value={value || ''}
            onChange={(e) => onChange(e.target.value !== '' ? e.target.value : null)}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </div>
  );
};