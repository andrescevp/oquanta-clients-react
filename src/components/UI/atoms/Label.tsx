import React from 'react';

import type { ClassValue } from 'clsx';

import { cn } from '../../../lib/utils';

const Label: React.FC<
    React.LabelHTMLAttributes<HTMLLabelElement> & {
        className?: ClassValue | ClassValue[];
    }
> = ({ className, children, ...props }) => {
    return (
        <label className={cn('block text-sm font-medium text-gray-700', className)} {...props}>
            {children}
        </label>
    );
};

export default Label;
