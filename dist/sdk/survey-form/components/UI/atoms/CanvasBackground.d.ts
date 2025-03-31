import React from 'react';
/**
 * Props for the data-driven canvas background
 */
interface CanvasBackgroundProps {
    /** Optional CSS class for the canvas element */
    className?: string;
    /** Visualization mode - affects appearance and behavior */
    mode?: 'background' | 'foreground';
    /** Controls whether points emerge and disappear constantly */
    dynamic?: boolean;
    /** Controls data point density (higher = fewer points) */
    density?: number;
    /** Controls what type of insights to highlight */
    insightFocus?: 'campaigns' | 'engagement' | 'conversions' | 'all';
    /** Controls the base color scheme */
    theme?: 'standard' | 'performance' | 'growth';
}
/**
 * A dynamic, data-driven canvas visualization that transforms analytics
 * into an engaging visual layer. Represents entities as points that connect
 * based on relationships, with colors and animations reflecting performance metrics.
 *
 * Serves as both an aesthetic background and functional data visualization.
 */
export declare const CanvasBackground: React.FC<CanvasBackgroundProps>;
export default CanvasBackground;
