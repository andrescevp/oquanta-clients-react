import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuestionString } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import { Switch } from '../../UI/atoms/Switch';
import InputWithLabel from '../../UI/molecules/InputWithLabel';
import CommonOptionsForm from './CommonOptionsForm';

interface StringOptionsFormProps {
  element: QuestionString;
  onChange: (field: string, value: any) => void;
  className?: string;
}

/**
 * Form component for string-type question options
 * Handles text input configuration including validation
 */
const StringOptionsForm: React.FC<StringOptionsFormProps> = ({
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
      {/* Text-specific options */}
      <div className="space-y-5 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('Text Input Options')}</h3>
        
        {/* Multiline toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Multiline text')}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('Allow multiple lines of text')}
            </p>
          </div>
          <Switch
            checked={options?.multiline || false}
            onCheckedChange={(checked) => onChange('multiline', checked)}
            className="data-[state=checked]:bg-pumpkin-orange"
          />
        </div>
        
        {/* Placeholder */}
        <InputWithLabel
          id="placeholder-input"
          label={t('Placeholder')}
          helperText={t('Text shown when no answer is provided')}
          inputProps={{
            type: "text",
            value: options?.placeholder || '',
            onChange: (e) => onChange('placeholder', e.target.value),
            placeholder: t('Enter placeholder text'),
            className: "backdrop-blur-sm"
          }}
        />
        
        {/* Validation fields */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('Validation')}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithLabel
              id="minLength-input"
              label={t('Minimum Length')}
              inputProps={{
                type: "number",
                min: 0,
                value: options?.minLength || '',
                onChange: (e) => onChange('minLength', e.target.value ? parseInt(e.target.value) : null),
                placeholder: t('No minimum'),
                className: "backdrop-blur-sm"
              }}
            />
            
            <InputWithLabel
              id="maxLength-input"
              label={t('Maximum Length')}
              inputProps={{
                type: "number",
                min: 0,
                value: options?.maxLength || '',
                onChange: (e) => onChange('maxLength', e.target.value ? parseInt(e.target.value) : null),
                placeholder: t('No maximum'),
                className: "backdrop-blur-sm"
              }}
            />
          </div>
          
          <div className="mt-4">
            <InputWithLabel
              id="regex-input"
              label={t('Validation Pattern')}
              helperText={t('Regular expression for validating input')}
              inputProps={{
                type: "text",
                value: options?.regex || '',
                onChange: (e) => onChange('regex', e.target.value),
                placeholder: t('e.g. ^[a-zA-Z0-9]+$'),
                className: "backdrop-blur-sm"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StringOptionsForm;