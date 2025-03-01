import * as React from 'react';
import { useId } from 'react';
import { Tooltip } from 'react-tooltip';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    tooltipPlace?: 'top' | 'bottom' | 'left' | 'right';
    showTooltip?: boolean;
    tooltipChildren?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, type, title, id, tooltipPlace, showTooltip, ...props }, ref) => {
        const randId = useId();
        const btnId = id || `btn-${randId}`;
        return (
            <>
                <button
                    id={btnId}
                    ref={ref}
                    className={className}
                    type={type || 'button'}
                    data-tooltip-id={`${btnId}-tooltip`}
                    data-tooltip-place={tooltipPlace || 'top'}
                    {...props}
                />
                {showTooltip && (
                    <Tooltip id={`${btnId}-tooltip`} clickable={!!props.tooltipChildren}>
                        {props.tooltipChildren || title}
                    </Tooltip>
                )}
            </>
        );
    },
);

Button.displayName = 'Button';

export default Button;
