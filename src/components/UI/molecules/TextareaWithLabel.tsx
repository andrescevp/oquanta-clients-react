import * as React from 'react';

import { cn } from '../../../lib/utils';
import Label from '../atoms/Label';
import Textarea from '../atoms/Textarea';

/**
 * TextareaWithLabel component
 * Combines a label with a textarea field for multiline input scenarios
 * Follows the same pattern as InputWithLabel for consistency
 */
interface TextareaWithLabelProps {
    label: string;
    id: string;
    inline?: boolean;
    className?: string;
    textareaProps?: React.ComponentProps<typeof Textarea>;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
    helperText?: string;
    required?: boolean;
}

const TextareaWithLabel = React.forwardRef<HTMLTextAreaElement, TextareaWithLabelProps>(
    ({ label, id, inline, className, textareaProps, error, helperText, required }, ref) => {
        const hasError = error !== undefined && error !== false;

        return (
            <div
                className={cn(
                    'w-full',
                    inline ? 'flex flex-row items-start gap-3' : 'flex flex-col space-y-1.5',
                    className,
                )}>
                <Label
                    htmlFor={id}
                    className={cn(
                        'text-sm font-medium text-gray-700 dark:text-gray-300',
                        inline && 'pt-2.5 min-w-[100px]',
                        hasError && 'text-red-600 dark:text-red-400',
                    )}>
                    <span>{label}</span>
                    {required && <span className='ml-1 text-red-500'>*</span>}
                </Label>

                <div className={cn('flex-1 flex flex-col', !inline && 'w-full')}>
                    <Textarea id={id} ref={ref} error={error} {...textareaProps} />

                    {helperText && !hasError && (
                        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>{helperText}</p>
                    )}
                </div>
            </div>
        );
    },
);

TextareaWithLabel.displayName = 'TextareaWithLabel';

export default TextareaWithLabel;
