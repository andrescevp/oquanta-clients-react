import * as React from 'react';
interface ButtonLoderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    tooltipPlace?: 'top' | 'bottom' | 'left' | 'right';
    showTooltip?: boolean;
    tooltipChildren?: React.ReactNode;
    icon?: React.ReactNode;
    loading?: boolean;
    iconLoaderClassName?: string;
}
declare const ButtonLoader: React.ForwardRefExoticComponent<ButtonLoderProps & React.RefAttributes<HTMLButtonElement>>;
export default ButtonLoader;
