import * as React from 'react';
import { useId } from 'react';
import { Tooltip } from 'react-tooltip';

import { cn } from '../../../lib/utils';
import { IconLoaderCircle } from '../Icons';

interface ButtonLoderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    tooltipPlace?: 'top' | 'bottom' | 'left' | 'right';
    showTooltip?: boolean;
    tooltipChildren?: React.ReactNode;
    icon?: React.ReactNode;
    loading?: boolean;
    iconLoaderClassName?: string;
}

const ButtonLoader = React.forwardRef<HTMLButtonElement, ButtonLoderProps>(
    // eslint-disable-next-line complexity
    (
        {
            className,
            type,
            title,
            id,
            tooltipPlace,
            showTooltip,
            icon,
            loading,
            children,
            iconLoaderClassName,
            ...props
        },
        ref,
    ) => {
        const randId = useId();
        const btnId = id || `btn-${randId}`;
        return (
            <>
                <button
                    id={btnId}
                    ref={ref}
                    className={cn('btn', className)}
                    type={type || 'button'}
                    data-tooltip-id={`${btnId}-tooltip`}
                    data-tooltip-place={tooltipPlace || 'top'}
                    {...props}>
                    {loading ? (
                        <IconLoaderCircle className={cn(iconLoaderClassName || 'animate-spin w-5 h-5')} />
                    ) : (
                        <span className={cn('flex items-center', icon ? 'space-x-2' : '')}>
                            {icon && <span>{icon}</span>}
                            <span>{children}</span>
                        </span>
                    )}
                </button>
                {showTooltip && (
                    <Tooltip id={`${btnId}-tooltip`} clickable={!!props.tooltipChildren}>
                        {props.tooltipChildren || title}
                    </Tooltip>
                )}
            </>
        );
    },
);

ButtonLoader.displayName = 'ButtonLoder';

export default ButtonLoader;
