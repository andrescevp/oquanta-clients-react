import React, { useEffect,useRef, useState } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { IconGripVertical, IconLayoutList, IconPlus, IconRefresh, IconTrash } from '../UI/Icons';
import { QuestionItem } from './QuestionTree';

interface SortableItemProps {
  id: string;
  item: QuestionItem;
  isSelected: boolean;
  onClick: () => void;
  onAddSubQuestion: () => void;
  onAddSubBlock: () => void;
  onAddSubLoop: () => void;
  canHaveChildren: boolean;
  onDelete?: () => void;
  isDragOver?: boolean;
}

// eslint-disable-next-line complexity
const SortableItem: React.FC<SortableItemProps> = ({
  id,
  item,
  isSelected,
  onClick,
  onAddSubQuestion,
  onAddSubBlock,
  onAddSubLoop,
  canHaveChildren,
  onDelete,
  isDragOver = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const [showChildOptions, setShowChildOptions] = useState(false);
  const [isHoveredBottom, setIsHoveredBottom] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Función para configurar ambas referencias
  const setRefs = (node: HTMLDivElement | null) => {
    // Establecer la referencia para dnd-kit
    setNodeRef(node);
    // Establecer nuestra propia referencia
    elementRef.current = node;
  };

  useEffect(() => {
    // Solo agregamos listener si es un elemento contenedor
    if (!canHaveChildren) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        // Detectamos si el ratón está en el último 25% del elemento
        const isInBottomArea = e.clientY > rect.top + rect.height * 0.75;
        setIsHoveredBottom(isInBottomArea);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canHaveChildren]);

  // Determinar el color del badge según el tipo
  const getBadgeColor = () => {
    switch (item.type) {
      case 'block': 
        return 'bg-green-500';
      case 'loop':
        return 'bg-purple-500';
      case 'radio':
        return 'bg-orange-500';
      case 'checkbox':
        return 'bg-yellow-500';
      case 'select':
        return 'bg-cyan-500';
      case 'number':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={clsx(
      'flex items-center space-x-2 p-2 mb-1 rounded border transition-colors',
      {
        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700': isSelected,
        'bg-gray-200 dark:bg-green-900/20 border-gray-300 dark:border-gray-700': isDragOver && !isHoveredBottom,
        'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700': !isSelected && !isDragOver
      }
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab">
      <IconGripVertical className="w-4 h-4 text-gray-400" />
      </div>
      
      <div
      className="flex-1 cursor-pointer truncate space-y-1"
      onClick={onClick}
      >
      <div className="font-medium text-sm">{item.label || id}</div>
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
        <span className={clsx('inline-block w-2 h-2 rounded-full mr-1', getBadgeColor())}></span>
        <span>{item.type}</span>
        <div className="font-medium text-sm shadow px-2 border-gray-200 bg-blue-200 w-auto rounded text-ellipsis overflow-hidden">{item.code || id}</div>
      </div>
      </div>
      
      <div className="flex space-x-1 relative">
      {canHaveChildren && (
        <>
        <button
          onClick={() => setShowChildOptions(!showChildOptions)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
          title="Añadir elemento hijo"
        >
          <IconPlus className="w-4 h-4" />
        </button>
        
        {showChildOptions && (
          <div className="absolute top-full right-0 mt-1 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-md shadow-md z-10">
          <button 
            onClick={() => {
            onAddSubQuestion();
            setShowChildOptions(false);
            }}
            className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <IconPlus className="w-4 h-4 mr-2" />
            <span>Pregunta</span>
          </button>
          <button 
            onClick={() => {
            onAddSubBlock();
            setShowChildOptions(false);
            }}
            className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <IconLayoutList className="w-4 h-4 mr-2" />
            <span>Bloque</span>
          </button>
          <button 
            onClick={() => {
            onAddSubLoop();
            setShowChildOptions(false);
            }}
            className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <IconRefresh className="w-4 h-4 mr-2" />
            <span>Loop</span>
          </button>
          </div>
        )}
        </>
      )}
      
      {onDelete && (
        <button
        onClick={onDelete}
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
        title="Delete question"
        >
        <IconTrash className="w-4 h-4 text-red-500" />
        </button>
      )}
      </div>
    </div>
  );
};

export default SortableItem;
