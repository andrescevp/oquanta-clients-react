import * as React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { commands, ExecuteState, ICommand, TextAreaCommandOrchestrator, TextAreaTextApi } from '@uiw/react-md-editor';
import { ContextStore } from '@uiw/react-md-editor/src/Context';

import { PlaceholderInitializer, PlaceholdersDropdown } from '../components/Survey/Editor/PlaceholdersDropdown';

export type MDCommandChildrenHandle = {
    close: () => void;
    execute: () => void;
    getState?: TextAreaCommandOrchestrator['getState'];
    textApi?: TextAreaTextApi;
    dispatch?: React.Dispatch<ContextStore>;
};

interface UsePlaceholdersCommandOptions {
    initializers: PlaceholderInitializer[];
    placeholderColors?: Record<string, string>;
}

/**
 * A hook that creates a command to insert placeholders from a dropdown
 * Reacts to changes in initializers and placeholderColors
 *
 * @param options Object containing initializers and optional placeholderColors
 * @returns ICommand for MDEditor
 */
export const usePlaceholdersCommand = (options: UsePlaceholdersCommandOptions): ICommand => {
    const { initializers = [], placeholderColors = {} } = options;

    // Store selected placeholder data in refs to persist between renders
    // but allow access in the execute function
    const selectedInitializerRef = useRef<PlaceholderInitializer | null>(null);
    const selectedPlaceholderRef = useRef<string | null>(null);

    // Create a key that changes when initializers change
    // This forces the dropdown to re-render when initializers change
    const [dropdownKey, setDropdownKey] = useState<number>(0);

    // Whenever initializers change, force a re-render of the dropdown
    React.useEffect(() => {
        setDropdownKey(prev => prev + 1);
    }, [initializers]);

    // Handle selecting a placeholder
    const handleSelectPlaceholder = useCallback((initializer: PlaceholderInitializer, placeholder: string) => {
        selectedInitializerRef.current = initializer;
        selectedPlaceholderRef.current = placeholder;
    }, []);

    // Handle dropdown unmount
    const handleUnmount = useCallback(() => {
        selectedInitializerRef.current = null;
        selectedPlaceholderRef.current = null;
    }, []);

    // Execute function for inserting the selected placeholder
    const executeCommand = useCallback((state: ExecuteState, api: TextAreaTextApi) => {
        const selectedInitializer = selectedInitializerRef.current;
        const selectedPlaceholder = selectedPlaceholderRef.current;

        // Only insert if we have both selected initializer and placeholder
        if (selectedInitializer && selectedPlaceholder) {
            const newText = selectedInitializer.start + selectedPlaceholder + selectedInitializer.stop;

            if (newText) {
                // Check if we have a valid state to determine cursor position
                if (state && state.selection) {
                    // Insert at current cursor position
                    api.setSelectionRange({
                        start: state.selection.start || newText.length,
                        end: state.selection.end || newText.length,
                    });
                    // Replace the selected text with the new placeholder text
                    api.replaceSelection(newText);
                } else {
                    // If no cursor position is available, insert at the end
                    const currentText = state.text || '';
                    const appendedText = currentText + (currentText.endsWith('\n') ? '' : '\n') + newText;
                    state.text = appendedText; // Update the text state

                    // Set cursor position after the inserted placeholder
                    const newPosition = appendedText.length;
                    api.setSelectionRange({
                        start: newPosition,
                        end: newPosition,
                    });
                }
            }

            // Reset the selected values after insertion
            selectedPlaceholderRef.current = null;
            selectedInitializerRef.current = null;
        }
    }, []);

    // Render function for the dropdown
    const renderChildren = useCallback(
        (handle: MDCommandChildrenHandle) => {
            return (
                <PlaceholdersDropdown
                    key={`placeholders-dropdown-${dropdownKey}`}
                    handle={handle}
                    initializers={initializers}
                    placeholderColors={placeholderColors}
                    onSelectPlaceholder={handleSelectPlaceholder}
                    onUnmount={handleUnmount}
                />
            );
        },
        [initializers, placeholderColors, dropdownKey, handleSelectPlaceholder, handleUnmount],
    );

    // Create the command object
    return useMemo(() => {
        if (initializers.length === 0) {
            return commands.group([], {});
        }

        return commands.group([], {
            name: 'placeholders',
            groupName: 'placeholders',
            icon: (
                <svg
                    viewBox='0 0 24 24'
                    width='12'
                    height='12'
                    stroke='currentColor'
                    strokeWidth='2'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path
                        d='M17.5 2H9.5C8.12 2 7 3.12 7 4.5V6H8.5V4.5C8.5 3.95 8.95 3.5 9.5 3.5H17.5C18.05 3.5 18.5 3.95 18.5 4.5V19.5C18.5 20.05 18.05 20.5 17.5 20.5H9.5C8.95 20.5 8.5 20.05 8.5 19.5V18H7V19.5C7 20.88 8.12 22 9.5 22H17.5C18.88 22 20 20.88 20 19.5V4.5C20 3.12 18.88 2 17.5 2Z'
                        fill='currentColor'
                    />
                    <path
                        d='M9.5 7.5L4 12L9.5 16.5'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeMiterlimit='10'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M14.5 12H4'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeMiterlimit='10'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            ),
            buttonProps: { 'aria-label': 'Insert placeholder' },
            children: renderChildren,
            execute: executeCommand,
        });
    }, [initializers, renderChildren, executeCommand]);
};
