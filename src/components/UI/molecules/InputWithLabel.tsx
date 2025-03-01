import * as React from 'react';

import { clsx } from 'clsx';

import Input from '../atoms/Input';
import Label from '../atoms/Label';

interface InputWithLabelProps {
    label: string;
    id: string;
    inline?: boolean;
    className?: string;
    inputProps?: React.ComponentProps<'input'>;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
    ({ label, id, inline, className, inputProps, error }, ref) => {
        const haveError = error !== undefined && error !== false;
        return (
            <div
                className={clsx(
                    inline ? 'flex flex-row space-x-1 items-start' : 'flex flex-col space-y-0.5',
                    className,
                )}>
                <Label htmlFor={id} className={clsx('font-bold', haveError && 'text-red-500')}>
                    <span>
                        {label}
                    </span>
                </Label>
                <Input id={id} ref={ref} error={error} {...inputProps} />
            </div>
        );
    },
);

InputWithLabel.displayName = 'InputWithLabel';

export default InputWithLabel;
