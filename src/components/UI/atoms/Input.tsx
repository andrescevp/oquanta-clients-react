import * as React from 'react';

import { cn } from '../../../lib/utils';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (props: InputProps, ref) => {
        const { type = 'text', className, error, ...rest } = props;
        const haveError = error !== undefined && error !== false;
        return (
            <>
                <input
                    type={type}
                    className={cn(
                        className,
                        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-300 dark:border-dark-300 dark:bg-dark-800 dark:placeholder-dark-400',
                        haveError && 'border-red-500',
                    )}
                    ref={ref}
                    {...rest}
                />
                <span className='text-red-500 text-xs min-h-4'>{haveError && error}</span>
            </>
                );
                },
);
Input.displayName = 'Input';

export default Input;
