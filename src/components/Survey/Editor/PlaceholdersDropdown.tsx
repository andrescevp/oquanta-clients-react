import * as React from 'react';
import { useEffect, useMemo, useRef,useState } from 'react';

import { PlusCircleIcon, SearchIcon } from '../../../components/UI/Icons';
import { cn } from '../../../lib/utils';
import { MDCommandChildrenHandle } from './CreatePlaceholdersCommand';

export interface PlaceholderInitializer {
    start: string;
    stop: string;
    placeholders: string[];
}

interface PlaceholdersDropdownProps {
    handle: MDCommandChildrenHandle;
    initializers: PlaceholderInitializer[];
    placeholderColors?: Record<string, string>;
    onSelectPlaceholder: (initializer: PlaceholderInitializer, placeholder: string) => void;
    onUnmount?: () => void;
}

/**
 * Dropdown component for placeholder selection
 * Shows a searchable list of placeholders grouped by initializer type
 */
export const PlaceholdersDropdown: React.FC<PlaceholdersDropdownProps> = ({
    handle,
    initializers,
    placeholderColors,
    onSelectPlaceholder,
    onUnmount,
}) => {
    const [searchText, setSearchText] = useState('');
    const [activeInitializerIndex, setActiveInitializerIndex] = useState(0);
    const [filteredPlaceholders, setFilteredPlaceholders] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    // Process initializers with useMemo to avoid recalculation on every render
    const validInitializers = useMemo(() => {
        return initializers.filter(init => init.placeholders && init.placeholders.length > 0) || [];
    }, [initializers]);
    
    // Determine current initializer safely
    const currentInitializer = useMemo(() => {
        if (validInitializers.length === 0) return { start: '', stop: '', placeholders: [] };
        return validInitializers[activeInitializerIndex] || validInitializers[0];
    }, [validInitializers, activeInitializerIndex]);

    // All useEffects must be called in the same order on every render
    useEffect(() => {
        // Reset search text when initializer changes
        setSearchText('');
    }, [activeInitializerIndex]);
    
    useEffect(() => {
        return () => {
            if (onUnmount) {
                onUnmount();
                setFilteredPlaceholders([]);
            }
        };
    }, [onUnmount]);
    
    useEffect(() => {
        if (searchText === '') {
            setFilteredPlaceholders(currentInitializer.placeholders);
            return;
        }
        
        const placeholders = currentInitializer.placeholders
            .filter(p => p.toLowerCase().includes(searchText.toLowerCase()));
        setFilteredPlaceholders(placeholders);
    }, [searchText, currentInitializer.placeholders]);

    // Focus search input on mount
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    // Handle click outside of the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                handle.close();
                setFilteredPlaceholders([]);
                setActiveInitializerIndex(0);
                setSearchText('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handle]);

    // Get color for a placeholder
    const getPlaceholderColor = (placeholder: string): string => {
        // Check custom colors first
        if (placeholderColors && placeholderColors[placeholder]) {
            return placeholderColors[placeholder];
        }

        // Default colors
        const defaultColors = [
            '#0ea5e9', // sky-500
            '#8b5cf6', // violet-500
            '#ec4899', // pink-500
            '#f59e0b', // amber-500
            '#10b981', // emerald-500
        ];

        // Use hash to assign consistent colors
        const hash = placeholder.split('').reduce((acc, char) => {
            return acc + char.charCodeAt(0);
        }, 0);

        return defaultColors[hash % defaultColors.length];
    };

    // Set selected placeholder and trigger execution
    const insertPlaceholder = (placeholder: string) => {
        onSelectPlaceholder(currentInitializer, placeholder);
        handle.execute();
        handle.close();
    };

    // Use conditional rendering instead of early return
    // if (validInitializers.length === 0) {
    //     return (
    //         <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
    //             No placeholders available
    //         </div>
    //     );
    // }

    return (
        <div 
            ref={dropdownRef}
            className="w-72 p-2 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
        >
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                <div className="flex justify-between items-center px-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Insert Placeholder</h3>
                    <button
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        onClick={() => handle.close()}
                        aria-label="Close dropdown"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search input */}
                <div className="relative rounded-xl mb-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        className="w-full bg-gray-50 dark:bg-gray-700/50 focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange block pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl"
                        placeholder="Search placeholders..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                {/* Initializer tabs (if more than one) */}
                {validInitializers.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {validInitializers.map((init, idx) => (
                            <button
                                key={`${init.start}-${idx}`}
                                className={cn(
                                    'px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all duration-200',
                                    idx === activeInitializerIndex
                                        ? 'bg-pumpkin-orange/10 text-pumpkin-orange'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
                                )}
                                onClick={() => {
                                    setActiveInitializerIndex(idx);
                                }}
                            >
                                {init.start}...{init.stop}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Placeholder list */}
            <div className="max-h-64 overflow-y-auto">
                {filteredPlaceholders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1">
                        {filteredPlaceholders.map((placeholder) => (
                            <button
                                key={placeholder}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-left text-sm transition-all duration-200"
                                onClick={() => insertPlaceholder(placeholder)}
                                style={{ color: getPlaceholderColor(placeholder) }}
                            >
                                <PlusCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="font-medium truncate">{placeholder}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="py-3 px-4 text-sm text-center text-gray-500 dark:text-gray-400">
                        No matching placeholders found
                    </div>
                )}
            </div>
        </div>
    );
};