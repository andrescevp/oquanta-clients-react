import * as React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export default Input;
