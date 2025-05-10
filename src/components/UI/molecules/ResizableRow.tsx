import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '../../../lib/utils';

interface ResizableRowProps {
    /**
     * The child elements that will be rendered as cells in the row
     */
    children: React.ReactNode[];

    /**
     * Optional CSS class to be applied to the row container
     */
    className?: string;

    /**
     * Optional CSS class to be applied to each cell
     */
    cellClassName?: string;

    /**
     * Optional CSS class to be applied to the resize handles
     */
    handleClassName?: string;

    /**
     * Optional minimum width for each cell in pixels
     * @default 50
     */
    minCellWidth?: number;

    /**
     * Callback fired when resizing is finished
     * @param widths Array of widths in percentage
     */
    onResizeEnd?: (widths: number[]) => void;

    /**
     * Initial distribution of widths in percentage
     * Total should equal 100
     */
    initialWidths?: number[];

    /**
     * If true, all cells will have equal width initially
     * @default true
     */
    equalInitialWidth?: boolean;

    /**
     * Sensitivity factor for resize operation (lower means smoother but less responsive)
     * @default 1
     */
    resizeSensitivity?: number;
}

/**
 * A row component with horizontally resizable cells
 *
 * @example
 * ```tsx
 * <ResizableRow>
 *   <div>Cell 1 Content</div>
 *   <div>Cell 2 Content</div>
 *   <div>Cell 3 Content</div>
 * </ResizableRow>
 * ```
 */
const ResizableRow: React.FC<ResizableRowProps> = ({
    children,
    className,
    cellClassName,
    handleClassName,
    minCellWidth = 50,
    onResizeEnd,
    initialWidths,
    equalInitialWidth = true,
    resizeSensitivity = 1,
}) => {
    const childrenArray = React.Children.toArray(children);
    const rowRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [resizing, setResizing] = useState<number | null>(null);
    const [startX, setStartX] = useState<number>(0);
    const [startWidths, setStartWidths] = useState<number[]>([]);
    const lastClientXRef = useRef<number>(0);

    // Initialize cell widths
    const [cellWidths, setCellWidths] = useState<number[]>(() => {
        if (initialWidths && initialWidths.length === childrenArray.length) {
            return initialWidths;
        }

        // Default to equal widths
        const width = 100 / childrenArray.length;
        return Array(childrenArray.length).fill(width);
    });

    // Store cell widths in a ref to avoid closure issues during animation
    const cellWidthsRef = useRef<number[]>(cellWidths);
    useEffect(() => {
        cellWidthsRef.current = cellWidths;
    }, [cellWidths]);

    // Clean up any pending animation frames on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Handle start of resize operation
    const handleResizeStart = useCallback((index: number, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

        setResizing(index);
        setStartX(clientX);
        lastClientXRef.current = clientX;
        setStartWidths([...cellWidthsRef.current]);

        // Apply styles globally
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        // Add a temporary overlay to prevent pointer events during resize
        const overlay = document.createElement('div');
        overlay.id = 'resize-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);
    }, []);

    // Handle the actual resize with requestAnimationFrame for smoother performance
    const updateWidths = useCallback(
        (clientX: number) => {
            if (resizing === null || !rowRef.current) return;

            const deltaX = clientX - startX;
            const rowWidth = rowRef.current.getBoundingClientRect().width;
            const deltaPercentage = (deltaX / rowWidth) * 100 * resizeSensitivity;

            // Ensure minimum width is maintained
            const minWidthPercent = (minCellWidth / rowWidth) * 100;

            // Calculate new widths
            const newWidths = [...startWidths];
            const leftCellNewWidth = newWidths[resizing] + deltaPercentage;
            const rightCellNewWidth = newWidths[resizing + 1] - deltaPercentage;

            if (leftCellNewWidth >= minWidthPercent && rightCellNewWidth >= minWidthPercent) {
                newWidths[resizing] = leftCellNewWidth;
                newWidths[resizing + 1] = rightCellNewWidth;
                setCellWidths(newWidths);
            }
        },
        [resizing, startX, startWidths, minCellWidth, resizeSensitivity],
    );

    // Handle mouse/touch move during resize with throttling via requestAnimationFrame
    const handleResizeMove = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (resizing === null) return;

            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

            // Store the latest clientX value
            lastClientXRef.current = clientX;

            // Only schedule a new animation frame if we don't already have one pending
            if (animationFrameRef.current === null) {
                animationFrameRef.current = requestAnimationFrame(() => {
                    updateWidths(lastClientXRef.current);
                    animationFrameRef.current = null;
                });
            }
        },
        [resizing, updateWidths],
    );

    // Handle end of resize operation
    const handleResizeEnd = useCallback(() => {
        if (resizing !== null) {
            setResizing(null);

            // Clean up styles
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            // Remove the overlay
            const overlay = document.getElementById('resize-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }

            // Cancel any pending animation frames
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            if (onResizeEnd) {
                onResizeEnd(cellWidthsRef.current);
            }
        }
    }, [resizing, onResizeEnd]);

    // Set up event listeners
    useEffect(() => {
        if (resizing !== null) {
            // Use passive: false for touch events to allow preventDefault
            const touchMoveOptions = { passive: false };

            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('touchmove', handleResizeMove, touchMoveOptions);
            window.addEventListener('mouseup', handleResizeEnd);
            window.addEventListener('touchend', handleResizeEnd);

            return () => {
                window.removeEventListener('mousemove', handleResizeMove);
                window.removeEventListener('touchmove', handleResizeMove);
                window.removeEventListener('mouseup', handleResizeEnd);
                window.removeEventListener('touchend', handleResizeEnd);
            };
        }
    }, [resizing, handleResizeMove, handleResizeEnd]);

    return (
        <div ref={rowRef} className={cn('flex w-full relative', className)} role='row'>
            {childrenArray.map((child, index) => (
                <React.Fragment key={index}>
                    <div
                        className={cn(
                            'relative overflow-hidden',
                            // Use hardware acceleration with transform for smoother resizing
                            'will-change-width transform-gpu transition-[background-color] duration-200',
                            resizing === index && 'bg-pumpkin-orange/5',
                            cellClassName,
                        )}
                        style={{
                            width: `${cellWidths[index]}%`,
                            minWidth: `${minCellWidth}px`,
                        }}
                        role='cell'>
                        {child}
                    </div>

                    {index < childrenArray.length - 1 && (
                        <div
                            className={cn(
                                'relative select-none z-10 w-1 cursor-col-resize touch-none',
                                "after:content-[''] after:absolute after:top-0 after:left-[-4px] after:bottom-0 after:w-[8px]",
                                'hover:bg-pumpkin-orange/80 transition-colors duration-150',
                                'active:bg-pumpkin-orange active:shadow-[0_0_0_2px_rgba(253,83,4,0.3)]',
                                resizing === index && 'bg-pumpkin-orange shadow-[0_0_0_2px_rgba(253,83,4,0.3)]',
                                handleClassName,
                            )}
                            onMouseDown={e => handleResizeStart(index, e)}
                            onTouchStart={e => handleResizeStart(index, e)}
                            role='separator'
                            aria-orientation='vertical'
                            tabIndex={0}
                            onKeyDown={e => {
                                // Allow keyboard resizing with left/right arrows
                                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                                    e.preventDefault();
                                    const delta = e.key === 'ArrowLeft' ? -1 : 1;
                                    const newWidths = [...cellWidths];
                                    newWidths[index] += delta;
                                    newWidths[index + 1] -= delta;
                                    setCellWidths(newWidths);

                                    if (onResizeEnd) {
                                        onResizeEnd(newWidths);
                                    }
                                }
                            }}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default ResizableRow;
