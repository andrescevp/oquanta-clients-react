import * as React from 'react';

import { Switch as HeadlessSwitch } from '@headlessui/react';

import { cn } from '../../../lib/utils';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
}

/**
 * Switch component
 * A toggle switch that follows the oQuanta design system
 * Built with Headless UI for accessibility and consistent behavior
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ checked, onCheckedChange, disabled = false, className, 'aria-label': ariaLabel }, ref) => {
        return (
            <HeadlessSwitch
                ref={ref}
                checked={checked}
                onChange={onCheckedChange}
                disabled={disabled}
                className={cn(
                    'relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-orange/50 focus-visible:ring-offset-2',
                    checked ? 'bg-pumpkin-orange' : 'bg-gray-200 dark:bg-gray-700',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className,
                )}
                aria-label={ariaLabel}>
                <span
                    className={cn(
                        'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out',
                        checked ? 'translate-x-5' : 'translate-x-0',
                    )}
                    aria-hidden='true'
                />
            </HeadlessSwitch>
        );
    },
);

Switch.displayName = 'Switch';

export { Switch };
