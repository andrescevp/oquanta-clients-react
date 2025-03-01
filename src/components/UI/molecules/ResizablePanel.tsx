import React, { useCallback, useEffect, useState } from 'react';

import { useLocalStorage } from '../../../hooks/useLocalStorage';

interface ResizablePanelProps {
  children: React.ReactNode;
  direction: 'horizontal' | 'vertical';
  initialSize: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  onResize?: (newSize: number) => void;
  storageKey?: string; // Clave única para localStorage
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  direction,
  initialSize,
  minSize = 100,
  maxSize = Infinity,
  className = '',
  onResize,
  storageKey
}) => {
  // Usar custom hook para localStorage
  const [storedSize, setStoredSize] = useLocalStorage<number>(
    `resizable-panel-${storageKey || direction}`,
    initialSize
  );
  
  const [size, setSize] = useState(storedSize);
  const [resizing, setResizing] = useState(false);
  
  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(true);
  }, []);

  const stopResize = useCallback(() => {
    setResizing(false);
  }, []);

  const onResizeMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;

    const newSize = direction === 'horizontal' 
      ? e.clientX 
      : e.clientY;

    const clampedSize = Math.max(minSize, Math.min(maxSize, newSize));
    setSize(clampedSize);
    setStoredSize(clampedSize); // Guardar en localStorage
    
    if (onResize) {
      onResize(clampedSize);
    }
  }, [resizing, direction, minSize, maxSize, onResize, setStoredSize]);

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', onResizeMove);
      window.addEventListener('mouseup', stopResize);
    }
    
    return () => {
      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [resizing, onResizeMove, stopResize]);

  // Restablecer tamaño por defecto con doble clic
  const handleDoubleClick = () => {
    setSize(initialSize);
    setStoredSize(initialSize);
    if (onResize) {
      onResize(initialSize);
    }
  };

  return (
    <div 
      className={`relative ${className}`} 
      style={{
        [direction === 'horizontal' ? 'width' : 'height']: `${size}px`,
        overflow: 'hidden'
      }}
    >
      {children}
      <div
        className={`absolute ${
          direction === 'horizontal' 
            ? 'right-0 top-0 w-1 h-full cursor-col-resize' 
            : 'bottom-0 left-0 h-1 w-full cursor-row-resize'
        } bg-gray-300 hover:bg-blue-500 transition-colors duration-200 z-10`}
        onMouseDown={startResize}
        onDoubleClick={handleDoubleClick}
        title="Doble clic para restablecer"
      />
    </div>
  );
};

export default ResizablePanel;
