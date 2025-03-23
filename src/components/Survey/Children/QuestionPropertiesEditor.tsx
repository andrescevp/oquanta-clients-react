import React from 'react';
import { FieldValue, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ElementColumn, ElementRow, SurveyRequestChildrenInner } from '../../../api-generated';
import { ISurvey } from '../../../types/surveys';
import InputWithLabel from '../../UI/molecules/InputWithLabel';
import TextareaWithLabel from '../../UI/molecules/TextareaWithLabel';
import QuestionLoopConceptsEditor from './QuestionLoopConceptsEditor';
import QuestionRowsColumnsEditor from './QuestionRowsColumnsEditor';

interface QuestionPropertiesEditorProps {
  questionType: string;
  questionCode: string;
  formPath: string;
  label: string;
  help?: string;
  rows?: ElementRow[] | null;
  columns?: ElementColumn[] | null;
}

/**
 * QuestionPropertiesEditor component
 * Responsible for editing common properties of survey questions
 * Extracted to promote reusability and composition
 */
const QuestionPropertiesEditor: React.FC<QuestionPropertiesEditorProps> = ({
  questionType,
  questionCode,
  formPath,
  label,
  help,
  rows,
  columns
}) => {
  const { t } = useTranslation();
  const { setValue, formState, getFieldState } = useFormContext<ISurvey>();
  const {errors} = formState;
  const { error } = getFieldState(`${formPath}.code` as keyof FieldValue<ISurvey>, formState);

  // Handler for field changes
  const handleFieldChange = (field: keyof SurveyRequestChildrenInner, value: any) => {
    // Create the full path for the specific field
    const fieldPath = `${formPath}.${field}` as any;
    
    // Update the field directly in the form
    setValue(fieldPath, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  // Determine what label to use based on question type
  const labelText = ['block', 'loop'].includes(questionType)
    ? t('Block Title')
    : t('Question Text');

  // Check if the question type supports rows and columns
  const supportsRowsColumns = ['choice', 'number', 'string'].includes(questionType);
  const isLoop = questionType === 'loop';

  return (
    <div className="space-y-6">
      {/* Block/Loop Title or Question Code */}
      <InputWithLabel
        id={`${questionCode}-code`}
        label={t('Question Code')}
        error={error && error.message}
        inputProps={{
          type: "text",
          value: questionCode,
          onChange: (e) => {
            handleFieldChange('code', e.target.value);
          },
          placeholder: t('Enter unique identifier'),
          className: "backdrop-blur-sm"
        }}
        helperText={t('Unique identifier used for data analysis')}
      />
      
      {/* For blocks and loops, we need label instead of question text */}
      {['block', 'loop'].includes(questionType) ? (
        <InputWithLabel
          id={`${questionCode}-label`}
          label={labelText}
          inputProps={{
            type: "text",
            value: label,
            onChange: (e) => handleFieldChange('label', e.target.value),
            placeholder: t('Enter title'),
            className: "backdrop-blur-sm"
          }}
          helperText={isLoop ? t('Descriptive name for this loop section') : t('Title for this group of questions')}
        />
      ) : (
        <>
          {/* Question text for regular questions */}
          <TextareaWithLabel
            id={`${questionCode}-label`}
            label={labelText}
            textareaProps={{
              value: label,
              onChange: (e) => handleFieldChange('label', e.target.value),
              placeholder: t('Enter your question'),
              className: "backdrop-blur-sm",
              rows: 3
            }}
          />
          
          {/* Help Text */}
          <TextareaWithLabel
            id={`${questionCode}-help`}
            label={t('Help Text')}
            textareaProps={{
              value: help || '',
              onChange: (e) => handleFieldChange('help', e.target.value),
              placeholder: t('Additional help text for respondents'),
              className: "backdrop-blur-sm",
              rows: 2
            }}
            helperText={t('Provide additional context or instructions for this question')}
          />
        </>
      )}
      
      {/* Loop Concepts Editor for loop type */}
      {isLoop && (
          <QuestionLoopConceptsEditor
            questionCode={questionCode}
            formPath={formPath}
          />
      )}

      {/* Rows and Columns Editor for supported question types */}
      {supportsRowsColumns && (
        <div className="mt-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('Matrix Configuration')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('Configure rows and columns for this matrix question')}
            </p>
          </div>
          
          <QuestionRowsColumnsEditor 
            questionCode={questionCode}
            formPath={formPath}
            rows={rows}
            columns={columns}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionPropertiesEditor;