import React from 'react';
interface ConfirmationTooltipProps {
    /**
     * ID for the tooltip, automatically generated if not provided
     */
    id?: string;
    /**
     * The content to wrap with the confirmation tooltip
     */
    children: React.ReactNode;
    /**
     * Message to display in the confirmation tooltip
     */
    confirmationMessage: string;
    /**
     * Function to execute when the user confirms the action
     */
    onConfirm: () => void;
    /**
     * Text for the confirm button
     */
    confirmText?: string;
    /**
     * Text for the cancel button
     */
    cancelText?: string;
    /**
     * Optional class name for the tooltip content
     */
    tooltipClassName?: string;
    /**
     * Optional class name for the confirm button
     */
    confirmButtonClassName?: string;
    /**
     * Optional class name for the cancel button
     */
    cancelButtonClassName?: string;
    /**
     * Tooltip placement
     */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * Function to execute when the user cancels the action
     */
    onCancel?: () => void;
    /**
     * Whether to disable the tooltip functionality
     */
    disabled?: boolean;
}
/**
 * ConfirmationTooltip component that wraps content with a confirmation tooltip
 * Uses react-tooltip to display a confirmation dialog before executing an action
 */
export declare const ConfirmationTooltip: React.FC<ConfirmationTooltipProps>;
export {};
