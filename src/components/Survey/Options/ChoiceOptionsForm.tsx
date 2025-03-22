import React from 'react';
import { useTranslation } from 'react-i18next';

import { ElementOptionsChoiceWidgetEnum, QuestionChoice } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import { Switch } from '../../UI/atoms/Switch';
import { CheckboxIcon, IconChevronDown as ChevronDownIcon,RadioButtonIcon } from '../../UI/Icons';
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
        
        {/* Widget type selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Display Style')}
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onChange('widget', ElementOptionsChoiceWidgetEnum.Radio)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-4 border rounded-xl transition-all",
                "text-sm font-medium",
                options?.widget === ElementOptionsChoiceWidgetEnum.Radio ?
                  "bg-pumpkin-orange/10 border-pumpkin-orange text-pumpkin-orange" :
                  "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <RadioButtonIcon className="h-6 w-6 mb-2" />
              {t('Radio Buttons')}
            </button>
            
            <button
              type="button"
              onClick={() => onChange('widget', ElementOptionsChoiceWidgetEnum.Checkbox)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-4 border rounded-xl transition-all",
                "text-sm font-medium",
                options?.widget === ElementOptionsChoiceWidgetEnum.Checkbox ?
                  "bg-pumpkin-orange/10 border-pumpkin-orange text-pumpkin-orange" :
                  "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <CheckboxIcon className="h-6 w-6 mb-2" />
              {t('Checkboxes')}
            </button>
            
            <button
              type="button"
              onClick={() => onChange('widget', ElementOptionsChoiceWidgetEnum.Dropdown)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-4 border rounded-xl transition-all",
                "text-sm font-medium",
                options?.widget === ElementOptionsChoiceWidgetEnum.Dropdown ?
                  "bg-pumpkin-orange/10 border-pumpkin-orange text-pumpkin-orange" :
                  "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <ChevronDownIcon className="h-6 w-6 mb-2" />
              {t('Dropdown')}
            </button>
          </div>
        </div>
        
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
          <Switch
            checked={options?.muliple || false}
            onCheckedChange={(checked) => onChange('muliple', checked)}
            className="data-[state=checked]:bg-pumpkin-orange"
            disabled={options?.widget === ElementOptionsChoiceWidgetEnum.Radio}
          />
        </div>
      </div>
    </div>
  );
};

export default ChoiceOptionsForm;