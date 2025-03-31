import * as React from 'react';
import Input from '../atoms/Input';
interface InputWithLabelProps {
    label: string;
    id: string;
    inline?: boolean;
    className?: string;
    inputProps?: React.ComponentProps<typeof Input>;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
    helperText?: string;
    required?: boolean;
}
declare const InputWithLabel: React.ForwardRefExoticComponent<InputWithLabelProps & React.RefAttributes<HTMLInputElement>>;
export default InputWithLabel;
