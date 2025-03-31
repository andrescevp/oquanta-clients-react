import * as React from 'react';
import Textarea from '../atoms/Textarea';
/**
 * TextareaWithLabel component
 * Combines a label with a textarea field for multiline input scenarios
 * Follows the same pattern as InputWithLabel for consistency
 */
interface TextareaWithLabelProps {
    label: string;
    id: string;
    inline?: boolean;
    className?: string;
    textareaProps?: React.ComponentProps<typeof Textarea>;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
    helperText?: string;
    required?: boolean;
}
declare const TextareaWithLabel: React.ForwardRefExoticComponent<TextareaWithLabelProps & React.RefAttributes<HTMLTextAreaElement>>;
export default TextareaWithLabel;
