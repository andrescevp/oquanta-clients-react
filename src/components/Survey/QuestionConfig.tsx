import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SurveyRequestChildrenInner } from '../../api-generated';
import { cn } from '../../lib/utils';
import { ISurvey } from '../../types/surveys';
import { SettingsIcon } from '../UI/Icons';
import { QuestionItem } from './QuestionTree';

interface QuestionConfigProps {
  selectedQuestion: QuestionItem | null;
  selectedQuestionFormKey: string;
  onQuestionUpdate?: (updatedQuestion: QuestionItem) => void;
}

// eslint-disable-next-line complexity
const QuestionConfig: React.FC<QuestionConfigProps> = ({ 
  selectedQuestion, 
  selectedQuestionFormKey,
  onQuestionUpdate
}) => {
  const { t } = useTranslation();
  const { setValue, formState: { errors } } = useFormContext<ISurvey>();
  
  // Helper function to update a specific field
  const handleFieldChange = (field: keyof SurveyRequestChildrenInner, value: any) => {
    if (!selectedQuestion) return;
    
    // Create updated question object
    const updatedQuestion = {
      ...selectedQuestion,
      [field]: value
    };
    
    // Create the full path for the specific field
    const fieldPath = `${selectedQuestionFormKey}.${field}` as any;
    
    // Update the field directly in the form
    setValue(fieldPath, value, {
      shouldValidate: true,
      shouldDirty: true
    });
    
    // Call the callback if provided
    if (onQuestionUpdate) {
      onQuestionUpdate(updatedQuestion);
    }
  };
  
  // Helper function to update options
  const handleOptionsChange = (optionKey: string, value: any) => {
    if (!selectedQuestion) return;
    
    const currentOptions = selectedQuestion.options || {};
    const updatedOptions = {
      ...currentOptions,
      [optionKey]: value
    };
    
    // Create updated question object
    const updatedQuestion = {
      ...selectedQuestion,
      options: updatedOptions
    };
    
    // Update the options field in the form
    setValue(`${selectedQuestionFormKey}.options` as any, updatedOptions, {
      shouldValidate: true,
      shouldDirty: true
    });
    
    // Call the callback if provided
    if (onQuestionUpdate) {
      onQuestionUpdate(updatedQuestion);
    }
  };

  if (!selectedQuestion) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <SettingsIcon className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg font-medium text-center">
          {t('Select a question to configure')}
        </p>
        <p className="text-sm text-center mt-2 max-w-md">
          {t('Choose a question to adjust its settings and behavior')}
        </p>
      </div>
    );
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFieldChange('type', e.target.value);
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOptionsChange('required', e.target.checked);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{t('Configuration')}</h3>
          <div className={cn(
            "px-3 py-1 text-xs rounded-full",
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          )}>
            {selectedQuestion.code}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
          {selectedQuestion.label || t('Untitled Question')}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {t('Question Type')}
          </label>
          <select
            value={selectedQuestion.type}
            onChange={handleTypeChange}
            className={cn(
              "w-full pl-3 pr-4 py-2.5 rounded-xl",
              "bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm",
              "border border-gray-300 dark:border-gray-600", 
              "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
              "transition-all duration-200"
            )}
          >
            <option value="text">{t('Text')}</option>
            <option value="checkbox">{t('Checkbox')}</option>
            <option value="radio">{t('Multiple Choice')}</option>
            <option value="dropdown">{t('Dropdown')}</option>
            <option value="textarea">{t('Long Text')}</option>
            <option value="block">{t('Block')}</option>
            <option value="loop">{t('Loop')}</option>
          </select>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">{t('Basic Settings')}</h4>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required-checkbox"
                checked={selectedQuestion.options?.required || false}
                onChange={handleRequiredChange}
                className="w-4 h-4 text-pumpkin-orange border-gray-300 rounded focus:ring-pumpkin-orange/50"
              />
              <label htmlFor="required-checkbox" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('Required Question')}
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('Question Code')}
              </label>
              <input
                type="text"
                value={selectedQuestion.code}
                onChange={(e) => handleFieldChange('code', e.target.value)}
                className={cn(
                  "w-full pl-3 pr-4 py-2.5 rounded-xl",
                  "bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm",
                  "border border-gray-300 dark:border-gray-600", 
                  "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
                  "transition-all duration-200"
                )}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('Unique identifier for this question')}
              </p>
            </div>
          </div>
        </div>

        {/* Type-specific configuration */}
        {selectedQuestion.type === 'text' && (
          <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">{t('Text Options')}</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('Placeholder text')}
                </label>
                <input
                  type="text"
                  value={selectedQuestion.options?.placeholder || ''}
                  onChange={(e) => handleOptionsChange('placeholder', e.target.value)}
                  className={cn(
                    "w-full pl-3 pr-4 py-2.5 rounded-xl",
                    "bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm",
                    "border border-gray-300 dark:border-gray-600", 
                    "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
                    "transition-all duration-200"
                  )}
                  placeholder={t('Enter placeholder text')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('Maximum length')}
                </label>
                <input
                  type="number"
                  value={selectedQuestion.options?.maxLength || ''}
                  onChange={(e) => handleOptionsChange('maxLength', parseInt(e.target.value) || '')}
                  className={cn(
                    "w-full pl-3 pr-4 py-2.5 rounded-xl",
                    "bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm",
                    "border border-gray-300 dark:border-gray-600", 
                    "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
                    "transition-all duration-200"
                  )}
                  placeholder={t('No limit')}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">{t('Validation')}</h4>
          
          
          {!['text', 'radio', 'checkbox', 'dropdown', 'textarea'].includes(selectedQuestion.type) && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('No validation options available for this question type')}
            </p>
          )}
        </div>

        <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">{t('Advanced')}</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hidden-checkbox"
              checked={selectedQuestion.options?.hidden || false}
              onChange={(e) => handleOptionsChange('hidden', e.target.checked)}
              className="w-4 h-4 text-pumpkin-orange border-gray-300 rounded focus:ring-pumpkin-orange/50"
            />
            <label htmlFor="hidden-checkbox" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Hidden question')}
            </label>
          </div>
          
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t('Hidden questions are not displayed to respondents but can be used for calculations or logic')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionConfig;
