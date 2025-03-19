import { ClassNamesConfig } from 'react-select';

import { cn } from '../../lib/utils';

/**
 * Custom theme configuration for React Select components
 * Following oQuanta design system guidelines for both light and dark modes
 */
const selectClassNames: ClassNamesConfig = {
  // Main container
  container: ({ isFocused }) => cn(
    'text-gray-900 dark:text-white rounded-xl',
    isFocused ? 'ring-2 ring-pumpkin-orange/50 dark:ring-pumpkin-orange/40' : ''
  ),

  // Main input control
  control: ({ isFocused, isDisabled, menuIsOpen }) => cn(
    'border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50',
    'hover:border-pumpkin-orange dark:hover:border-pumpkin-orange transition-all duration-200 ease-in-out',
    isFocused ? 'border-pumpkin-orange dark:border-pumpkin-orange shadow-sm shadow-pumpkin-orange/20 dark:shadow-pumpkin-orange/10' : '',
    menuIsOpen ? 'border-b-0 rounded-b-none' : '',
    isDisabled ? 'bg-gray-100 dark:bg-gray-800 opacity-70 cursor-not-allowed' : ''
  ),

  // Dropdown menu
  menu: () => cn(
    'mt-0 rounded-b-xl overflow-hidden backdrop-blur-sm',
    'bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 border-t-0',
    'shadow-xl shadow-black/10 dark:shadow-black/20 z-50'
  ),
  
  // Options list inside menu
  menuList: () => cn(
    'py-1 bg-transparent scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'
  ),
  
  // Individual option
  option: ({ isDisabled, isFocused, isSelected }) => cn(
    'px-4 py-2.5 cursor-default transition-all duration-200 ease-in-out',
    isSelected ? 
      'bg-gradient-to-r from-pumpkin-orange/20 to-pumpkin-orange/10 text-gray-900 dark:text-white font-medium' : 
      '',
    !isSelected && isFocused ? 
      'bg-gray-100/60 dark:bg-gray-700/60' : 
      '',
    isDisabled ? 
      'opacity-50 cursor-not-allowed' : 
      'cursor-pointer hover:translate-y-[-1px]',
  ),
  
  // Placeholder text
  placeholder: () => cn(
    'text-gray-500 dark:text-gray-400'
  ),
  
  // Selected value (single select)
  singleValue: () => cn(
    'text-gray-900 dark:text-white'
  ),
  
  // Multi-value chip (multi select)
  multiValue: () => cn(
    'bg-gradient-to-r from-pumpkin-orange/20 to-pumpkin-orange/10 dark:from-pumpkin-orange/30 dark:to-pumpkin-orange/20',
    'rounded-lg mr-1.5 my-0.5 overflow-hidden border border-pumpkin-orange/10 dark:border-pumpkin-orange/30',
    'shadow-sm'
  ),
  
  // Multi-value label
  multiValueLabel: () => cn(
    'px-2 py-0.5 text-sm font-medium text-gray-800 dark:text-gray-100'
  ),
  
  // Multi-value remove button
  multiValueRemove: () => cn(
    'px-1.5 hover:bg-pumpkin-orange hover:text-white transition-colors',
    'rounded-r-lg'
  ),
  
  // Value container
  valueContainer: () => cn(
    'px-4 py-2 gap-1'
  ),
  
  // Indicators container
  indicatorsContainer: () => cn(
    'text-gray-500 dark:text-gray-400'
  ),
  
  // Clear indicator
  clearIndicator: () => cn(
    'p-1 mx-1 hover:text-pumpkin-orange rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors'
  ),
  
  // Dropdown arrow
  dropdownIndicator: ({ selectProps }) => cn(
    'p-1.5 hover:text-pumpkin-orange dark:hover:text-pumpkin-orange transition-all duration-300 ease-in-out',
    selectProps.menuIsOpen ? 'text-pumpkin-orange dark:text-pumpkin-orange rotate-180' : ''
  ),
  
  // Indicator separator
  indicatorSeparator: () => cn(
    'bg-gray-300 dark:bg-gray-600 mx-1'
  ),
  
  // Loading message
  loadingMessage: () => cn(
    'py-3 px-4 text-center text-gray-500 dark:text-gray-400'
  ),
  
  // No options message
  noOptionsMessage: () => cn(
    'py-3 px-4 text-center text-gray-500 dark:text-gray-400'
  ),
  
  // Input field
  input: () => cn(
    'text-gray-900 dark:text-white m-0 p-0'
  ),
  
  // Option group
  group: () => cn(
    'border-gray-200 dark:border-gray-700 border-b py-1'
  ),
  
  // Group heading
  groupHeading: () => cn(
    'px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400'
  ),
  
  // Menu portal (for rendering outside container)
  menuPortal: () => cn(
    'z-[2000]'
  ),
  
  // Loading indicator
  loadingIndicator: () => cn(
    'text-pumpkin-orange dark:text-pumpkin-orange'
  ),
};

export default selectClassNames;