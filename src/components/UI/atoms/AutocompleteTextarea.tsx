import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Transition } from '@headlessui/react';

import { cn } from '../../../lib/utils';

export interface PlaceholderInitializer {
  start: string;
  stop: string;
  placeholders: string[];
}

export interface AutocompleteTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: boolean | string | React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  resizable?: boolean;
  initializers?: PlaceholderInitializer[];
  placeholderColors?: Record<string, string>;
}

/**
 * Enhanced textarea component that supports autocomplete for placeholders
 * Detects initializer sequences (like ${) and shows a dropdown of available placeholders
 * Highlights placeholders in custom colors throughout the text
 */
const AutocompleteTextarea = React.forwardRef<HTMLTextAreaElement, AutocompleteTextareaProps>(
  // eslint-disable-next-line complexity
  (props, ref) => {
    const {
      className,
      error,
      icon,
      iconPosition = 'left',
      resizable = true,
      rows = 3,
      initializers = [],
      placeholderColors = {},
      onChange,
      ...rest
    } = props;

    const hasError = error !== undefined && error !== false;
    
    // Use internal ref if external not provided
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;
    
    // Ref for the dropdown menu
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // State for autocomplete functionality
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
    const [currentInitializer, setCurrentInitializer] = useState<PlaceholderInitializer | null>(null);
    const [filteredPlaceholders, setFilteredPlaceholders] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [filterText, setFilterText] = useState<string>('');
    
    // Used to store the original text with syntax highlighting
    const [highlightedText, setHighlightedText] = useState<React.ReactNode>(null);
    
    // Update the dropdown position based on cursor position
    const updateDropdownPosition = () => {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      
      // Create temp element to measure text dimensions
      const temp = document.createElement('div');
      temp.style.position = 'absolute';
      temp.style.visibility = 'hidden';
      temp.style.whiteSpace = 'pre-wrap';
      temp.style.wordBreak = 'break-word';
      temp.style.width = getComputedStyle(textarea).width;
      temp.style.font = getComputedStyle(textarea).font;
      temp.style.padding = getComputedStyle(textarea).padding;
      temp.style.lineHeight = getComputedStyle(textarea).lineHeight;
      temp.textContent = textBeforeCursor;
      
      // Create a span for cursor position
      const span = document.createElement('span');
      span.textContent = '|';
      temp.appendChild(span);
      
      document.body.appendChild(temp);
      
      // Get positions
      const { top, left } = span.getBoundingClientRect();
      const textareaRect = textarea.getBoundingClientRect();
      
      // Calculate position relative to textarea
      const posTop = top - textareaRect.top + textarea.scrollTop;
      const posLeft = left - textareaRect.left;
      
      document.body.removeChild(temp);
      
      setDropdownPosition({
        top: posTop + 20, // Add space below cursor
        left: Math.min(posLeft, textareaRect.width - 200) // Ensure dropdown is visible
      });
    };
    
    // Get color for a placeholder
    const getPlaceholderColor = (placeholder: string): string => {
      // Check custom colors first
      if (placeholderColors[placeholder]) {
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
    
    // Update highlighted text with colored placeholders
    const updateHighlightedText = (value: string) => {
      if (!value || initializers.length === 0) {
        setHighlightedText(null);
        return;
      }
      
      // Array of text chunks with highlighting info
      const chunks: { text: string; color?: string }[] = [];
      let lastIndex = 0;
      
      // Process all initializers
      initializers.forEach(initializer => {
        const { start, stop } = initializer;
        let startIdx = value.indexOf(start);
        
        while (startIdx !== -1) {
          // Add text before this placeholder
          if (startIdx > lastIndex) {
            chunks.push({ text: value.substring(lastIndex, startIdx) });
          }
          
          // Look for the closing delimiter
          const endIdx = value.indexOf(stop, startIdx + start.length);
          
          if (endIdx !== -1) {
            // Found complete placeholder
            const placeholder = value.substring(startIdx + start.length, endIdx);
            const color = getPlaceholderColor(placeholder);
            
            // Add the complete placeholder with styling
            chunks.push({
              text: value.substring(startIdx, endIdx + stop.length),
              color
            });
            
            lastIndex = endIdx + stop.length;
          } else {
            // No closing delimiter, just add as normal text
            chunks.push({ text: value.substring(startIdx) });
            lastIndex = value.length;
            break;
          }
          
          startIdx = value.indexOf(start, lastIndex);
        }
      });
      
      // Add any remaining text
      if (lastIndex < value.length) {
        chunks.push({ text: value.substring(lastIndex) });
      }
      
      // Create React elements for highlighting
      const highlighted = chunks.map((chunk, i) => (
        <span key={i} style={chunk.color ? { color: chunk.color, fontWeight: 500 } : undefined}>
          {chunk.text}
        </span>
      ));
      
      setHighlightedText(highlighted);
    };
    
    // Select and insert a placeholder from the dropdown
    const handleSelectPlaceholder = (placeholder: string) => {
      if (!textareaRef.current || !currentInitializer) return;
      
      const textarea = textareaRef.current;
      const value = textarea.value;
      const cursorPos = textarea.selectionStart;
      
      // Find the position of the last initializer before cursor
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastInitializerPos = textBeforeCursor.lastIndexOf(currentInitializer.start);
      
      if (lastInitializerPos !== -1) {
        // Build new value with placeholder and closing delimiter
        const newValue = 
          value.substring(0, lastInitializerPos + currentInitializer.start.length) + 
          placeholder + 
          currentInitializer.stop + 
          value.substring(cursorPos);
        
        // Set new value
        textarea.value = newValue;
        
        // Position cursor after the inserted placeholder
        const newCursorPos = lastInitializerPos + currentInitializer.start.length + 
                            placeholder.length + currentInitializer.stop.length;
        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;
        
        // Update highlighted text
        updateHighlightedText(newValue);
        
        // Trigger onChange event
        if (onChange) {
          const event = new Event('input', { bubbles: true }) as any;
          event.simulated = true;
          event.target = textarea;
          event.currentTarget = textarea;
          event.target.value = newValue;
          onChange(event);
        }
      }
      
      // Close the dropdown
      setShowAutocomplete(false);
    };
    
    // Handle keyboard navigation
    // eslint-disable-next-line complexity
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showAutocomplete && filteredPlaceholders.length > 0) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredPlaceholders.length);
            return;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredPlaceholders.length) % filteredPlaceholders.length);
            return;
          case 'Enter':
            if (showAutocomplete) {
              e.preventDefault();
              handleSelectPlaceholder(filteredPlaceholders[selectedIndex]);
              return;
            }
            break;
          case 'Escape':
            e.preventDefault();
            setShowAutocomplete(false);
            return;
          case 'Tab':
            if (showAutocomplete) {
              e.preventDefault();
              handleSelectPlaceholder(filteredPlaceholders[selectedIndex]);
              return;
            }
            break;
        }
      }

      // Run the original onKeyDown handler if provided
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    // Handle input change to detect initializers
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      const value = textarea.value;
      const cursorPos = textarea.selectionStart;
      
      setCursorPosition(cursorPos);

      // Check for initializers
      if (showAutocomplete && currentInitializer) {
        // We're already in autocomplete mode - update filtering
        const textBeforeCursor = value.substring(0, cursorPos);
        const lastInitializerPos = textBeforeCursor.lastIndexOf(currentInitializer.start);
        
        if (lastInitializerPos !== -1) {
          // Get the text typed after the initializer
          const filterTextValue = textBeforeCursor.substring(lastInitializerPos + currentInitializer.start.length);
          setFilterText(filterTextValue);

          // Filter placeholders based on text
          const filtered = currentInitializer.placeholders.filter(p => 
            p.toLowerCase().includes(filterTextValue.toLowerCase())
          );
          setFilteredPlaceholders(filtered);
          setSelectedIndex(0);
          
          // Close dropdown if no matches or user completed the placeholder
          if (filtered.length === 0 || 
              value.substring(cursorPos - currentInitializer.stop.length, cursorPos) === currentInitializer.stop) {
            setShowAutocomplete(false);
          }
        } else {
          setShowAutocomplete(false);
        }
      } else {
        // Check if user just typed an initializer
        for (const initializer of initializers) {
          const textBeforeCursor = value.substring(0, cursorPos);
          if (textBeforeCursor.endsWith(initializer.start)) {
            setCurrentInitializer(initializer);
            setFilteredPlaceholders(initializer.placeholders);
            setShowAutocomplete(true);
            setSelectedIndex(0);
            setFilterText('');
            break;
          }
        }
      }
      
      // Update dropdown position
      updateDropdownPosition();
      
      // Update highlighted text
      updateHighlightedText(value);
      
      // Call original onChange
      if (onChange) {
        onChange(e);
      }
    };
    
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          dropdownRef.current && 
          !dropdownRef.current.contains(e.target as Node) && 
          textareaRef.current !== e.target
        ) {
          setShowAutocomplete(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialize highlighted text on mount
    useEffect(() => {
      if (textareaRef.current) {
        updateHighlightedText(textareaRef.current.value);
      }
    }, []);
    
    return (
      <>
          {/* Hidden overlay with highlighted text */}
          {highlightedText && (
            <div 
              aria-hidden="true"
              className={cn(
                "absolute inset-0 pointer-events-none overflow-hidden",
                "w-full bg-transparent font-mono",
                "rounded-xl",
                icon && iconPosition === 'left' ? 'pl-10 pr-4' : 'px-4',
                icon && iconPosition === 'right' ? 'pr-10 pl-4' : 'px-4',
                'py-2.5'
              )}
              style={{
                fontFamily: 'inherit',
                fontSize: 'inherit',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 'inherit'
              }}
            >
              {highlightedText}
            </div>
          )}
          
          <textarea
            className={cn(
              "w-full bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm h-fit",
              "border border-gray-300 dark:border-gray-600",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:border-pumpkin-orange",
              icon && iconPosition === 'left' ? 'pl-10 pr-4' : 'px-4',
              icon && iconPosition === 'right' ? 'pr-10 pl-4' : 'px-4',
              'py-2.5',
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800/50",
              !resizable && "resize-none",
              hasError ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" : "focus:ring-pumpkin-orange/50",
              highlightedText ? "bg-transparent text-transparent caret-black dark:caret-white" : "",
              className
            )}
            ref={textareaRef}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onClick={() => setCursorPosition(textareaRef.current?.selectionStart || 0)}
            rows={rows}
            {...rest}
          />
          
          {/* Autocomplete dropdown */}
          <Transition
            show={showAutocomplete && filteredPlaceholders.length > 0}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div 
              ref={dropdownRef}
              className={cn(
                "absolute z-50",
                "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
                "border border-gray-200 dark:border-gray-700",
                "rounded-lg shadow-lg",
                "max-h-64 overflow-y-auto",
                "min-w-[180px] max-w-[300px]"
              )}
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`
              }}
            >
              <ul className="py-1">
                {filteredPlaceholders.map((placeholder, index) => (
                  <li
                    key={placeholder}
                    className={cn(
                      "px-3 py-2 cursor-pointer",
                      "hover:bg-gray-100 dark:hover:bg-gray-700/70",
                      "transition-colors duration-100",
                      "text-sm font-medium",
                      selectedIndex === index ? 
                        "bg-gray-100 dark:bg-gray-700/70 text-pumpkin-orange" : ""
                    )}
                    onClick={() => handleSelectPlaceholder(placeholder)}
                    style={{
                      color: selectedIndex === index ? 
                        getPlaceholderColor(placeholder) : undefined
                    }}
                  >
                    {placeholder}
                  </li>
                ))}
              </ul>
            </div>
          </Transition>
      </>
    );
  }
);

AutocompleteTextarea.displayName = 'AutocompleteTextarea';

export default AutocompleteTextarea;