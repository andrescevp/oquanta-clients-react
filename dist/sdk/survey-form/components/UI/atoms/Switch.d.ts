import * as React from 'react';
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
declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLButtonElement>>;
export { Switch };
