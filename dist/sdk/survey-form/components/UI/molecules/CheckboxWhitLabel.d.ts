import * as React from 'react';
interface CheckboxWithLabelProps {
    label: string;
    id: string;
    checkboxProps?: React.ComponentProps<'input'>;
}
declare const CheckboxWithLabel: React.ForwardRefExoticComponent<CheckboxWithLabelProps & React.RefAttributes<HTMLInputElement>>;
export default CheckboxWithLabel;
