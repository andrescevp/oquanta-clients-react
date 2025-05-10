import { ICommand } from '@uiw/react-md-editor';

import { MDCommandChildrenHandle, usePlaceholdersCommand } from '../../../hooks/usePlaceholdersCommand';
import { PlaceholderInitializer } from './PlaceholdersDropdown';

// Re-export the MDCommandChildrenHandle type for backward compatibility
export type { MDCommandChildrenHandle };

/**
 * Creates a command to insert placeholders from a dropdown
 * This is a compatibility function that uses the usePlaceholdersCommand hook
 *
 * @param initializers List of placeholder initializers
 * @param placeholderColors Custom colors for placeholders
 * @returns ICommand for MDEditor
 * @deprecated Use usePlaceholdersCommand hook directly for better reactivity
 */
export const createPlaceholdersCommand = (
    initializers: PlaceholderInitializer[] = [],
    placeholderColors: Record<string, string> = {},
): ICommand => {
    // Forward to the hook implementation
    // Note: This won't react to changes in initializers after initial render
    // For that functionality, use the hook directly in your component
    return usePlaceholdersCommand({ initializers, placeholderColors });
};
