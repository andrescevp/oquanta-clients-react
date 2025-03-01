import * as React from 'react';

import { cn } from '../../../lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
    return (
        <input
            type='checkbox'
            className={cn('form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out', className)}
            ref={ref}
            {...props}
        />
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
