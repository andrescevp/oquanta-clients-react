import * as React from 'react';

import { Switch as HeadlessSwitch } from '@headlessui/react';

import { cn } from '../../../lib/utils';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, checked, onChange, disabled = false, size = 'md', ...props }, ref) => {
        const sizes = {
            sm: { switch: 'h-5 w-9', thumb: 'h-3 w-3', translate: checked ? 'translate-x-4' : 'translate-x-1' },
            md: { switch: 'h-6 w-11', thumb: 'h-4 w-4', translate: checked ? 'translate-x-6' : 'translate-x-1' },
            lg: { switch: 'h-7 w-14', thumb: 'h-5 w-5', translate: checked ? 'translate-x-8' : 'translate-x-1' }
        };
        
        return (
            <HeadlessSwitch
                checked={checked}
                onChange={onChange}
                className={cn(
                    'relative inline-flex items-center rounded-full transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    'dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800',
                    checked 
                        ? 'bg-blue-600 dark:bg-blue-700' 
                        : 'bg-gray-200 dark:bg-gray-700',
                    disabled && 'opacity-50 cursor-not-allowed',
                    sizes[size].switch,
                    className
                )}
                disabled={disabled}
                ref={ref}
                {...props}
            >
                <span className="sr-only">Activar</span>
                <span
                    className={cn(
                        'inline-block transform rounded-full bg-white transition-transform',
                        'dark:bg-gray-200',
                        sizes[size].thumb,
                        sizes[size].translate
                    )}
                    aria-hidden="true"
                />
            </HeadlessSwitch>
        );
    }
);

Switch.displayName = 'Switch';

export default Switch;