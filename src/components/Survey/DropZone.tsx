import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSortable } from '@dnd-kit/sortable';
import clsx from 'clsx';

interface DropZoneProps {
  id: string;
  parentId?: string;
  isActive: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ id, parentId, isActive }) => {
  const { t } = useTranslation();
  const { setNodeRef, attributes, listeners } = useSortable({
    id,
    data: {
      type: 'dropzone',
      parentId
    }
  });

  const dropZoneClasses = clsx(
    'my-2 rounded-md border-2 transition-all duration-300 flex items-center justify-center h-20',
    isActive
      ? 'border-blue-500 bg-blue-100/60 dark:bg-blue-900/30 dark:border-blue-500 shadow-md'
      : 'border-dashed border-gray-300 dark:border-gray-600'
  );

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={dropZoneClasses}
    >
      {isActive ? (
        <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {t('Soltar aquí')}
        </span>
      ) : (
        <span className="text-gray-400 dark:text-gray-500 text-sm">
          {t('Zona para soltar')}
        </span>
      )}
    </div>
  );
};

export default DropZone;