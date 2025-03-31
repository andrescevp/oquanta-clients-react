import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SurveyRequestChildrenInner } from '../../../../api-generated';
import { InfoIcon,SettingsIcon } from '../../../../components/UI/Icons';
import { cn } from '../../../../lib/utils';
import { ISurvey } from '../../../../types/surveys';
import OptionsFormFactory from '../../../Survey/Options/OptionsFormFactory';
import { QuestionItem } from '../../QuestionTree';

interface QuestionConfigProps {
  selectedQuestion: QuestionItem | null;
  selectedQuestionFormKey: string;
  onQuestionUpdate?: (updatedQuestion: QuestionItem) => void;
}

/**
 * Question configuration component
 * Handles editing of question properties and options based on question type
 */
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
      onQuestionUpdate(updatedQuestion as QuestionItem);
    }
  };

  // If no question is selected, show an empty state
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

  return (
    <div className="h-full flex flex-col">
      {/* Header section */}
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
      
      {/* Content section with scrollable area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Question Type selector (only for non-block, non-loop types) */}
        {!['loop', 'block'].includes(selectedQuestion.type) && (
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
              <option value="string">{t('Text')}</option>
              <option value="choice">{t('Choice')}</option>
              <option value="number">{t('Numeric')}</option>
            </select>
          </div>
        )}

        {/* Type-specific options using OptionsFormFactory */}
        <OptionsFormFactory
            element={selectedQuestion}
            onChange={handleOptionsChange}
          />

        {/* Context hint - shown at the bottom for added help */}
        <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start">
            <InfoIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                {t('About question types')}
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedQuestion.type === 'string' && t('Text questions allow free-form text responses from survey participants.')}
                {selectedQuestion.type === 'number' && t('Number questions collect numeric data with optional validation ranges.')}
                {selectedQuestion.type === 'choice' && t('Choice questions provide options for participants to select from.')}
                {selectedQuestion.type === 'block' && t('Blocks are containers that group related questions together.')}
                {selectedQuestion.type === 'loop' && t('Loops repeat a set of questions based on conditions or fixed iterations.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionConfig;