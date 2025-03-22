import React from 'react';
import { useTranslation } from 'react-i18next';

import { Loop } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import { InfoIcon } from '../../UI/Icons';
import TextareaWithLabel from '../../UI/molecules/TextareaWithLabel';

interface LoopOptionsFormProps {
  element: Loop;
  onChange: (field: string, value: any) => void;
  className?: string;
}

/**
 * Form component for loop-type options
 * Handles loop-specific settings including conditional logic
 */
const LoopOptionsForm: React.FC<LoopOptionsFormProps> = ({
  element,
  onChange,
  className
}) => {
  const { t } = useTranslation();
  const {options} = element;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-5 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('Loop Configuration')}</h3>
        
        <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
          <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('Loops repeat a set of questions based on a condition or a fixed number of iterations.')}
          </p>
        </div>
        
        {/* Loop condition */}
        <TextareaWithLabel
          id="loop-condition-input"
          label={t('Loop Condition')}
          textareaProps={{
            value: options?.condition || '',
            onChange: (e) => onChange('condition', e.target.value),
            placeholder: t('Enter loop condition expression'),
            className: "backdrop-blur-sm",
            rows: 3
          }}
          helperText={t('Expression to control loop iterations. Use variables to create dynamic loops.')}
        />
        
        {/* Example section */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('Examples')}
          </h4>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <p><code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{`iterations = 5`}</code> - {t('Fixed 5 iterations')}</p>
            <p><code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{`iterations = {response.Q1}`}</code> - {t('Dynamic based on previous answer')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoopOptionsForm;