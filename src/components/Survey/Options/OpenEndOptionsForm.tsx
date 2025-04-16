import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuestionOpenEnd } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import CommonOptionsForm from './CommonOptionsForm';

interface FormOptionsFormProps {
  element: QuestionOpenEnd;
  onChange: (field: string, value: any) => void;
  className?: string;
}

/**
 * Form component for managing Form-type question options
 * Allows customizing the form path for nested survey elements
 */
const FormOptionsForm: React.FC<FormOptionsFormProps> = ({
  element,
  onChange,
  className
}) => {
  const { t } = useTranslation();
  const { options } = element;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Common options like condition */}
      <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">{t('General Settings')}</h3>
        <CommonOptionsForm 
          options={options} 
          onChange={onChange}
          showRandomize={false}
        />
      </div>
      
      {/* Form-specific options */}
      <div className="space-y-5 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('Form Path Settings')}</h3>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">{t('About Form Elements')}</p>
            <p>
              {t('Form elements provide a way to organize your survey with custom naming. When a question is inside a Form, its path will use the custom path you define here rather than the default numeric indexes.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormOptionsForm;