import * as React from 'react';

import { cn } from '../../../lib/utils';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

interface InputWithLabelProps {
    label: string;
    id: string;
    inline?: boolean;
    className?: string;
    inputProps?: React.ComponentProps<typeof Input>;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
    helperText?: string;
    required?: boolean;
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
    ({ label, id, inline, className, inputProps, error, helperText, required }, ref) => {
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
                    <Input id={id} ref={ref} error={error} {...inputProps} />

                    {helperText && !hasError && (
                        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>{helperText}</p>
                    )}
                </div>
            </div>
        );
    },
);

InputWithLabel.displayName = 'InputWithLabel';

export default InputWithLabel;
