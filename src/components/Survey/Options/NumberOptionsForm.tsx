import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuestionNumber } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import { Switch } from '../../UI/atoms/Switch';
import InputWithLabel from '../../UI/molecules/InputWithLabel';
import CommonOptionsForm from './CommonOptionsForm';

interface NumberOptionsFormProps {
  element: QuestionNumber;
  onChange: (field: string, value: any) => void;
  className?: string;
}

/**
 * Form component for numeric question options
 * Handles range constraints and format settings
 */
const NumberOptionsForm: React.FC<NumberOptionsFormProps> = ({
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
      {/* Number-specific options */}
      <div className="space-y-5 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('Number Input Options')}</h3>
        
        {/* Range constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputWithLabel
            id="min-input"
            label={t('Minimum Value')}
            inputProps={{
              type: "number",
              value: options?.min ?? 1,
              onChange: (e) => onChange('min', e.target.value ? parseFloat(e.target.value) : null),
              placeholder: t('No minimum'),
              className: "backdrop-blur-sm"
            }}
          />
          
          <InputWithLabel
            id="max-input"
            label={t('Maximum Value')}
            inputProps={{
              type: "number",
              value: options?.max ?? '',
              onChange: (e) => onChange('max', e.target.value ? parseFloat(e.target.value) : null),
              placeholder: t('No maximum'),
              className: "backdrop-blur-sm"
            }}
          />
        </div>
        
        {/* Decimal toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Allow Decimal Numbers')}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('Enable decimal point in numeric input')}
            </p>
          </div>
          <Switch
            checked={options?.decimal || false}
            onCheckedChange={(checked) => onChange('decimal', checked)}
            className="data-[state=checked]:bg-pumpkin-orange"
          />
        </div>
      </div>
    </div>
  );
};

export default NumberOptionsForm;