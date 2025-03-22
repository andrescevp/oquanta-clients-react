import React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '../../../lib/utils';
import { Switch } from '../../UI/atoms/Switch';
import { InfoIcon } from '../../UI/Icons';
import InputWithLabel from '../../UI/molecules/InputWithLabel';

interface CommonOptionsFormProps {
  options: any;
  onChange: (field: string, value: any) => void;
  showRandomize?: boolean;
  className?: string;
}

/**
 * Common options form component used across different question types
 * Handles shared properties like hidden, required, condition, and randomization
 */
const CommonOptionsForm: React.FC<CommonOptionsFormProps> = ({
  options,
  onChange,
  showRandomize = false,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn("space-y-5", className)}>
      {/* Required Option */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Required')}
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('Respondent must answer this question')}
          </p>
        </div>
        <Switch
          checked={options?.required || false}
          onCheckedChange={(checked) => onChange('required', checked)}
          className="data-[state=checked]:bg-pumpkin-orange"
        />
      </div>

      {/* Hidden Option */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Hidden')}
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('Question will not be shown to respondents')}
          </p>
        </div>
        <Switch
          checked={options?.hidden || false}
          onCheckedChange={(checked) => onChange('hidden', checked)}
          className="data-[state=checked]:bg-pumpkin-orange"
        />
      </div>

      {/* Condition */}
      <InputWithLabel
        id="condition-input"
        label={t('Condition')}
        helperText={t('Expression to determine when this question is shown')}
        inputProps={{
          type: "text",
          value: options?.condition || '',
          onChange: (e) => onChange('condition', e.target.value),
          placeholder: t('Enter condition expression'),
          className: "backdrop-blur-sm"
        }}
      />

      {/* Randomization Options (only for matrix questions) */}
      {showRandomize && (
        <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <InfoIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('Matrix randomization options')}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('Randomize rows')}
              </label>
            </div>
            <Switch
              checked={options?.randomizeRows || false}
              onCheckedChange={(checked) => onChange('randomizeRows', checked)}
              className="data-[state=checked]:bg-pumpkin-orange"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('Randomize columns')}
              </label>
            </div>
            <Switch
              checked={options?.randomizeColumns || false}
              onCheckedChange={(checked) => onChange('randomizeColumns', checked)}
              className="data-[state=checked]:bg-pumpkin-orange"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonOptionsForm;