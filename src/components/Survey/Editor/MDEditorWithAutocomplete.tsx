import * as React from 'react';
import { useEffect } from 'react';

import MDEditor, {
    commands,
    ContextStore,
    ExecuteCommandState,
    ICommand,
    TextAreaCommandOrchestrator,
} from '@uiw/react-md-editor';
import { TextAreaProps } from '@uiw/react-md-editor/lib/components/TextArea/Textarea';
import rehypeSanitize from 'rehype-sanitize';

import { SurveyModel, SurveyReferences } from '../../../api-generated';
import { useDottedObject } from '../../../hooks/useDottedObject';
import { usePlaceholdersCommand } from '../../../hooks/usePlaceholdersCommand';
import { cn } from '../../../lib/utils';
import { PlaceholderInitializer } from './PlaceholdersDropdown';

export interface MDEditorWithAutocompleteProps {
    value: string;
    onChange?: (value?: string) => void;
    placeholder?: string;
    height?: number;
    visibleDragbar?: boolean;
    hideToolbar?: boolean;
    enableScroll?: boolean;
    commands?: ICommand[];
    extraCommands?: ICommand[];
    className?: string;
    initializers?: PlaceholderInitializer[];
    formReferences?: SurveyReferences;
    placeholderColors?: Record<string, string>;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
}

export type RenderTextareaHandle = {
    dispatch: ContextStore['dispatch'];
    onChange?: TextAreaProps['onChange'];
    useContext?: {
        commands: ContextStore['commands'];
        extraCommands: ContextStore['extraCommands'];
        commandOrchestrator?: TextAreaCommandOrchestrator;
    };
    shortcuts?: (
        e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>,
        commands: ICommand[],
        commandOrchestrator?: TextAreaCommandOrchestrator,
        dispatch?: React.Dispatch<ContextStore>,
        state?: ExecuteCommandState,
    ) => void;
};

const TooltipMarker: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <mark className='bg-pumpkin-orange-60'>{children}</mark>;
};

const PlaceholdersRegex = /\[\[([^\s[\]]+)]]/g;

/**
 * Enhanced Markdown editor component that combines MDEditor with AutocompleteTextarea
 * Supports placeholder autocompletion and syntax highlighting
 */
const MDEditorWithAutocomplete: React.FC<MDEditorWithAutocompleteProps> = ({
    value,
    onChange,
    placeholder,
    height,
    visibleDragbar = true,
    hideToolbar = false,
    enableScroll = true,
    commands: customCommands,
    extraCommands,
    className,
    initializers = [],
    placeholderColors = {},
    error,
    formReferences,
}) => {
    // Create placeholders command
    const placeholdersCommand = usePlaceholdersCommand({ initializers, placeholderColors });
    const [editorKey, setEditorKey] = React.useState<number>(0);

    const references = formReferences?.surveySchema && useDottedObject<SurveyModel>(formReferences.surveySchema);
    const commandsList = React.useMemo(() => {
        const baseCommands = [
            placeholdersCommand,
            commands.divider,
            commands.bold,
            commands.italic,
            commands.strikethrough,
            commands.divider,
            commands.quote,
            commands.divider,
            commands.link,
            commands.image,
            commands.divider,
            commands.checkedListCommand,
            commands.orderedListCommand,
            commands.unorderedListCommand,
        ];

        if (customCommands) {
            return [...baseCommands, ...customCommands];
        }

        return baseCommands;
    }, [customCommands, placeholdersCommand, formReferences]);

    if (extraCommands) {
        commandsList.push(...extraCommands);
    }

    useEffect(() => {
        setEditorKey(prev => prev + 1);
    }, [initializers, formReferences]);

    return (
        <div id={`editor-${editorKey}`} className={cn('w-full', error ? 'has-error' : '')}>
            <MDEditor
                value={value}
                onChange={onChange}
                height={height}
                visibleDragbar={visibleDragbar}
                hideToolbar={hideToolbar}
                enableScroll={enableScroll}
                commands={commandsList}
                preview='edit'
                highlightEnable
                className={cn(
                    // 'rounded-xl border border-gray-300 dark:border-gray-600',
                    // 'bg-gray-50 dark:bg-gray-700/50',
                    error
                        ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500/50'
                        : 'focus-within:border-pumpkin-orange focus-within:ring-2 focus-within:ring-pumpkin-orange/50',
                    className,
                )}
                textareaProps={{
                    placeholder,
                }}
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                }}
                components={
                    {
                        // textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement> | React.HTMLAttributes<HTMLDivElement>, opts: RenderTextareaHandle) => {
                        //     const { onChange: textareaOnChange } = opts;
                        //     // @ todo implement a new textarea with
                        // },
                        // preview: (v: string) => {
                        //     console.log('Preview:', v, initializers, formReferences);
                        //     const { placeholders, start, stop } = initializers[0] || {
                        //         start: undefined,
                        //         stop: undefined,
                        //         placeholders: undefined,
                        //     };
                        //     let replacedValue = v;
                        //     const highlightPreview: Highlight = [
                        //         // {
                        //         //     highlight: PlaceholdersRegex,
                        //         //     component: TooltipMarker,
                        //         // },
                        //     ];
                        //     if (replacedValue && placeholders && references) {
                        //         placeholders.forEach((p) => {
                        //             const reference = String(references[`children.${p}`]) || p;
                        //             const subString = `${start}${p}${stop}`;
                        //             // replace all occurrences of the substring
                        //             replacedValue = replacedValue.replaceAll(subString, reference);
                        //             highlightPreview.push({
                        //                 highlight: reference,
                        //                 component: TooltipMarker,
                        //             });
                        //         });
                        //     }
                        //     // return <div className="markdown-preview">{replacedValue}</div>;
                        //     return <HighlightWithinTextarea
                        //     value={String(replacedValue)}
                        //     highlight={highlightPreview}
                        //     readOnly
                        // />;
                        // },
                    }
                }
            />

            {error && typeof error !== 'boolean' && (
                <div className='flex items-start space-x-1.5 text-red-600 dark:text-red-400 text-sm mt-1.5'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 mt-0.5 flex-shrink-0'
                        viewBox='0 0 20 20'
                        fill='currentColor'>
                        <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                        />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default MDEditorWithAutocomplete;
