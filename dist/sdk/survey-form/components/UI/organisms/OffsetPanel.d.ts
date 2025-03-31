import React from 'react';
interface OffsetPanelProps {
    children: React.ReactNode;
    position?: 'left' | 'right';
    title?: string;
    className?: string;
    buttonText?: string;
    buttonIcon?: React.ElementType;
    buttonClassName?: string;
    buttonPosition?: 'fixed' | 'inline';
    buttonIconClassName?: string;
    /**
     * Unique identifier for this panel in URL params
     * @default "panel"
     */
    panelId?: string;
    /**
     * Whether to persist panel state in URL
     * @default true
     */
    persistState?: boolean;
    /**
     * Default state when no URL parameter exists
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Callback function executed when panel opens
     */
    onOpen?: () => void;
    /**
     * Callback function executed when panel closes
     */
    onClose?: () => void;
    /**
     * Whether to lazily load panel content
     * @default true
     */
    lazy?: boolean;
}
export declare const OffsetPanel: React.FC<OffsetPanelProps>;
export default OffsetPanel;
