import React from 'react';
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
/**
 * SearchButton component that shows a search icon and expands to show an input field when clicked
 */
export declare const SearchButton: React.FC<SearchButtonProps>;
export {};
