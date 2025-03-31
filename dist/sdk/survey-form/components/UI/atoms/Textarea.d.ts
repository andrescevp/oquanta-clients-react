import * as React from 'react';
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    resizable?: boolean;
}
/**
 * Textarea component for multiline text input
 * Follows the same styling patterns as Input component
 */
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export default Textarea;
