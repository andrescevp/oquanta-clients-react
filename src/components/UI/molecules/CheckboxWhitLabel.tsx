import * as React from 'react';

import Checkbox from '../atoms/Checkbox';
import Label from '../atoms/Label';

interface CheckboxWithLabelProps {
    label: string;
    id: string;
    checkboxProps?: React.ComponentProps<'input'>;
}

const CheckboxWithLabel = React.forwardRef<HTMLInputElement, CheckboxWithLabelProps>(
    ({ label, id, checkboxProps }, ref) => {
        return (
            <div className='flex items-center space-x-2'>
                <Checkbox id={id} ref={ref} {...checkboxProps} />
                <Label htmlFor={id} className='dark:text-dark-300'>{label}</Label>
            </div>
        );
    },
);

CheckboxWithLabel.displayName = 'CheckboxWithLabel';

export default CheckboxWithLabel;
