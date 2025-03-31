import * as React from 'react';
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
export default Checkbox;
