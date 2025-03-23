import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ElementColumn, ElementRow } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import { ISurvey } from '../../../types/surveys';
import { GripIcon, PlusIcon, TrashIcon } from '../../UI/Icons';
import InputWithLabel from '../../UI/molecules/InputWithLabel';

interface QuestionRowsColumnsEditorProps {
  questionCode: string;
  formPath: string;
  rows?: ElementRow[] | null;
  columns?: ElementColumn[] | null;
}

/**
 * Component for managing rows and columns in matrix-type questions
 * Used by choice, number, and string question types
 */
const QuestionRowsColumnsEditor: React.FC<QuestionRowsColumnsEditorProps> = ({
  questionCode,
  formPath,
  rows = [],
  columns = []
}) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext<ISurvey>();

  // Update rows in the form
  const updateRows = (updatedRows: ElementRow[]) => {
    setValue(`${formPath}.rows` as any, updatedRows, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  // Update columns in the form
  const updateColumns = (updatedColumns: ElementColumn[]) => {
    setValue(`${formPath}.columns` as any, updatedColumns, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  // Add a new row
  const handleAddRow = () => {
    const rowIndex = rows?.length || 0;
    const newRow: ElementRow = {
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `row_${rowIndex + 1}`,
      label: t('New Row'),
      index: rowIndex,
      depth: 0,             // Add required depth property
      isLast: true          // Add required isLast property
    };
    
    // Update isLast property for previous last row if it exists
    const updatedRows = [...(rows || [])].map(row => ({
      ...row,
      isLast: false
    }));
    
    updateRows([...updatedRows, newRow]);
  };

  // Add a new column
  const handleAddColumn = () => {
    const columnIndex = columns?.length || 0;
    const newColumn: ElementColumn = {
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `col_${columnIndex + 1}`,
      label: t('New Column'),
      index: columnIndex,
      depth: 0,              // Add required depth property
      isLast: true           // Add required isLast property
    };
    
    // Update isLast property for previous last column if it exists
    const updatedColumns = [...(columns || [])].map(column => ({
      ...column,
      isLast: false
    }));
    
    updateColumns([...updatedColumns, newColumn]);
  };

  // Update a row
  const handleUpdateRow = (index: number, field: keyof ElementRow, value: string | number) => {
    const updatedRows = [...(rows || [])];
    updatedRows[index] = {
      ...updatedRows[index],
      [field]: value
    };
    updateRows(updatedRows);
  };

  // Update a column
  const handleUpdateColumn = (index: number, field: keyof ElementColumn, value: string | number) => {
    const updatedColumns = [...(columns || [])];
    updatedColumns[index] = {
      ...updatedColumns[index],
      [field]: value
    };
    updateColumns(updatedColumns);
  };

  // Delete a row
  const handleDeleteRow = (index: number) => {
    const updatedRows = [...(rows || [])].filter((_, i) => i !== index);
    
    // Update indices after deletion
    updatedRows.forEach((row, i) => {
      row.index = i;
      // Set isLast property correctly
      row.isLast = i === updatedRows.length - 1;
    });
    
    updateRows(updatedRows);
  };

  // Delete a column
  const handleDeleteColumn = (index: number) => {
    const updatedColumns = [...(columns || [])].filter((_, i) => i !== index);
    
    // Update indices after deletion
    updatedColumns.forEach((column, i) => {
      column.index = i;
      // Set isLast property correctly
      column.isLast = i === updatedColumns.length - 1;
    });
    
    updateColumns(updatedColumns);
  };

  return (
    <div className="space-y-6">
      {/* Rows Section */}
      <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('Rows')}</h3>
          <button
            type="button"
            onClick={handleAddRow}
            className={cn(
              "flex items-center px-3 py-1.5 rounded-lg text-sm",
              "bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80",
              "text-white font-medium shadow-sm hover:shadow-md",
              "transition-all duration-200 hover:translate-y-[-1px]"
            )}
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            {t('Add Row')}
          </button>
        </div>
        
        {rows && rows.length > 0 ? (
          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={`row-${index}`} className="flex items-start gap-2">
                <div className="flex-shrink-0 py-2.5 px-2 text-gray-400">
                  <GripIcon className="h-5 w-5" />
                </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputWithLabel
                    id={`${questionCode}-row-${index}-label`}
                    label={t('Label')}
                    inputProps={{
                      value: row.label,
                      onChange: (e) => handleUpdateRow(index, 'label', e.target.value),
                      className: "backdrop-blur-sm"
                    }}
                  />
                  <InputWithLabel
                    id={`${questionCode}-row-${index}-code`}
                    label={t('Code')}
                    inputProps={{
                      value: row.code,
                      onChange: (e) => handleUpdateRow(index, 'code', e.target.value),
                      className: "backdrop-blur-sm"
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteRow(index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            {t('No rows added yet. Add a row to get started.')}
          </div>
        )}
      </div>

      {/* Columns Section */}
      <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('Columns')}</h3>
          <button
            type="button"
            onClick={handleAddColumn}
            className={cn(
              "flex items-center px-3 py-1.5 rounded-lg text-sm",
              "bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80",
              "text-white font-medium shadow-sm hover:shadow-md",
              "transition-all duration-200 hover:translate-y-[-1px]"
            )}
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            {t('Add Column')}
          </button>
        </div>
        
        {columns && columns.length > 0 ? (
          <div className="space-y-3">
            {columns.map((column, index) => (
              <div key={`column-${index}`} className="flex items-start gap-2">
                <div className="flex-shrink-0 py-2.5 px-2 text-gray-400">
                  <GripIcon className="h-5 w-5" />
                </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputWithLabel
                    id={`${questionCode}-column-${index}-label`}
                    label={t('Label')}
                    inputProps={{
                      value: column.label,
                      onChange: (e) => handleUpdateColumn(index, 'label', e.target.value),
                      className: "backdrop-blur-sm"
                    }}
                  />
                  <InputWithLabel
                    id={`${questionCode}-column-${index}-code`}
                    label={t('Code')}
                    inputProps={{
                      value: column.code,
                      onChange: (e) => handleUpdateColumn(index, 'code', e.target.value),
                      className: "backdrop-blur-sm"
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteColumn(index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            {t('No columns added yet. Add a column to get started.')}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionRowsColumnsEditor;