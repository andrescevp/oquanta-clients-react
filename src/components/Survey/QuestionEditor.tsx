import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SurveyRequestChildrenInner } from '../../api-generated';
import { cn } from '../../lib/utils';
import { ISurvey } from '../../types/surveys';
import { AlertCircleIcon, HelpCircleIcon } from '../UI/Icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../UI/molecules/Tabs';
import { QuestionItem } from './QuestionTree';

interface QuestionEditorProps {
  selectedQuestion: QuestionItem | null;
  selectedQuestionFormKey: string;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ 
  selectedQuestion,
  selectedQuestionFormKey
}) => {
  const { t } = useTranslation();
  const { watch, setValue, formState: { errors } } = useFormContext<ISurvey>();
  
  // Use the direct form path to update fields
  const handleFieldChange = (field: keyof SurveyRequestChildrenInner, value: any) => {
    if (!selectedQuestion) return;
    
    // Create the full path for the specific field
    const fieldPath = `${selectedQuestionFormKey}.${field}` as any;
    
    // Update the field directly in the form
    setValue(fieldPath, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  // Check if we have a valid selected question
  if (!selectedQuestion) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <HelpCircleIcon className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg font-medium text-center">
          {t('Select a question to edit')}
        </p>
        <p className="text-sm text-center mt-2 max-w-md">
          {t('Click on any question in the tree to edit its properties and content')}
        </p>
      </div>
    );
  }

  // Render different editors based on question type
  const renderQuestionEditor = () => {
    switch (selectedQuestion.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('Question Text')}
              </label>
              <input
                type="text"
                value={selectedQuestion.label}
                onChange={(e) => handleFieldChange('label', e.target.value)}
                className={cn(
                  "w-full pl-3 pr-4 py-2.5 rounded-xl",
                  "bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm",
                  "border border-gray-300 dark:border-gray-600", 
                  "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
                  "transition-all duration-200"
                )}
                placeholder={t('Enter your question')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('Help Text')}
              </label>
              <textarea
                value={selectedQuestion.help || ''}
                onChange={(e) => handleFieldChange('help', e.target.value)}
                className={cn(
                  "w-full pl-3 pr-4 py-2.5 rounded-xl",
                  "bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm",
                  "border border-gray-300 dark:border-gray-600", 
                  "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
                  "transition-all duration-200"
                )}
                placeholder={t('Additional help text for respondents')}
                rows={3}
              />
            </div>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('Question Text')}
              </label>
              <input
                type="text"
                value={selectedQuestion.label}
                onChange={(e) => handleFieldChange('label', e.target.value)}
                className={cn(
                  "w-full pl-3 pr-4 py-2.5 rounded-xl",
                  "bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm",
                  "border border-gray-300 dark:border-gray-600", 
                  "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
                  "transition-all duration-200"
                )}
                placeholder={t('Enter your question')}
              />
            </div>
            
            {/* Options for radio buttons would go here */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('Options')}
              </label>
              <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('Options editor will be implemented here')}
                </p>
              </div>
            </div>
          </div>
        );
      case 'block':
      case 'loop':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('Block Title')}
              </label>
              <input
                type="text"
                value={selectedQuestion.label}
                onChange={(e) => handleFieldChange('label', e.target.value)}
                className={cn(
                  "w-full pl-3 pr-4 py-2.5 rounded-xl",
                  "bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm",
                  "border border-gray-300 dark:border-gray-600", 
                  "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
                  "transition-all duration-200"
                )}
                placeholder={t('Enter block title')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('Description')}
              </label>
              <textarea
                value={selectedQuestion.help || ''}
                onChange={(e) => handleFieldChange('help', e.target.value)}
                className={cn(
                  "w-full pl-3 pr-4 py-2.5 rounded-xl",
                  "bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm",
                  "border border-gray-300 dark:border-gray-600", 
                  "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
                  "transition-all duration-200"
                )}
                placeholder={t('Block description')}
                rows={3}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300">{t('Editor not implemented for this question type:')}</p>
            <div className="mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-mono">
              {selectedQuestion.type}
            </div>
          </div>
        );
    }
  };

  // Renderizar vista previa según el tipo de pregunta
  // eslint-disable-next-line complexity
  const renderQuestionPreview = () => {
    switch (selectedQuestion.type) {
      case 'text':
        return (
          <div className="p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="font-medium mb-2 text-gray-900 dark:text-white">{selectedQuestion.label || t('Question text')}</p>
            {selectedQuestion.help && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{selectedQuestion.help}</p>
            )}
            <input
              type="text"
              disabled
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder={t('Text answer')}
            />
          </div>
        );
      case 'radio':
        return (
          <div className="p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="font-medium mb-2 text-gray-900 dark:text-white">{selectedQuestion.label || t('Question text')}</p>
            {selectedQuestion.help && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{selectedQuestion.help}</p>
            )}
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  disabled 
                  className="w-4 h-4 text-pumpkin-orange"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{t('Option 1')}</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  disabled 
                  className="w-4 h-4 text-pumpkin-orange"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{t('Option 2')}</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  disabled 
                  className="w-4 h-4 text-pumpkin-orange"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{t('Option 3')}</span>
              </div>
            </div>
          </div>
        );
      case 'block':
      case 'loop':
        return (
          <div className="p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{selectedQuestion.label || t('Block title')}</h3>
                {selectedQuestion.help && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedQuestion.help}</p>
                )}
              </div>
              <div className={cn(
                "px-3 py-1 text-xs rounded-full", 
                selectedQuestion.type === 'block' 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              )}>
                {selectedQuestion.type.toUpperCase()}
              </div>
            </div>
            
            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30">
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                {t('Child questions will appear here')}
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-10 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
            <AlertCircleIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-700 dark:text-gray-300">{t('Preview not available')}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{t('Question Editor')}</h3>
          <div className={cn(
            "px-3 py-1 text-xs rounded-full", 
            selectedQuestion.type === 'text' 
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : selectedQuestion.type === 'radio'
                ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                : selectedQuestion.type === 'block'
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
          )}>
            {selectedQuestion.type.toUpperCase()}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
          {selectedQuestion.label || t('Untitled Question')}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
          {selectedQuestionFormKey}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Tabs className="w-full">
          <TabsList className="mb-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger id="edit">{t('Edit')}</TabsTrigger>
            <TabsTrigger id="preview">{t('Preview')}</TabsTrigger>
          </TabsList>
          <TabsContent id="edit" className="focus-visible:outline-none focus-visible:ring-0">
            {renderQuestionEditor()}
          </TabsContent>
          <TabsContent id="preview" className="focus-visible:outline-none focus-visible:ring-0">
            {renderQuestionPreview()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestionEditor;