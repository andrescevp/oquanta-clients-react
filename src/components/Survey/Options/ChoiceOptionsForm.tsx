import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuestionChoice } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import CommonOptionsForm from './CommonOptionsForm';

interface ChoiceOptionsFormProps {
  element: QuestionChoice;
  onChange: (field: string, value: any) => void;
  className?: string;
}

/**
 * Form component for choice question options
 * Handles widget type and multiple selection settings
 */
const ChoiceOptionsForm: React.FC<ChoiceOptionsFormProps> = ({
  element,
  onChange,
  className
}) => {
  const { t } = useTranslation();
  const {options, rows, columns} = element;
  const hasRows = rows ? rows.length > 0 : false;
  const hasColumns = columns ? columns.length > 0 : false;

  return (
    <div className={cn("space-y-6", className)}>      
      {/* Common options */}
      <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">{t('General Settings')}</h3>
        <CommonOptionsForm 
          options={options} 
          onChange={onChange} 
          showRandomize={hasRows || hasColumns}
        />
      </div>
      
      {/* Choice-specific options */}
      <div className="space-y-5 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('Choice Options')}</h3>
        
        {/* Multiple selection toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Allow Multiple Selections')}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('Respondent can select more than one option')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoiceOptionsForm;