import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
    ElementChoice,
    ElementColumn,
    ElementRow,
    SurveyModel,
    SurveyOperationsApi,
    SurveyReferences,
    SurveyRequestChildrenInner,
} from '../../../api-generated';
import { useApi } from '../../../hooks/useApi';
import { QuestionItem } from '../../../hooks/useSurveyTreeManager';
import { ISurvey } from '../../../types/surveys';
import Label from '../../UI/atoms/Label';
import { FileTextIcon } from '../../UI/Icons';
import InputWithLabel from '../../UI/molecules/InputWithLabel';
import MDEditorWithAutocomplete from '../Editor/MDEditorWithAutocomplete';
import type { PlaceholderInitializer } from '../Editor/PlaceholdersDropdown';
import QuestionLoopConceptsEditor from './QuestionLoopConceptsEditor';
import QuestionRowsColumnsEditor from './QuestionRowsColumnsEditor';

interface QuestionPropertiesEditorProps {
    surveyUuid: string;
    question: QuestionItem;
    formPath: string;
}

/**
 * QuestionPropertiesEditor component
 * Responsible for editing common properties of survey questions
 * Extracted to promote reusability and composition
 */
// eslint-disable-next-line complexity
const QuestionPropertiesEditor: React.FC<QuestionPropertiesEditorProps> = ({
                                                                               surveyUuid,
                                                                               question,
                                                                               formPath,
                                                                           }) => {
    const { t } = useTranslation();
    const { call } = useApi<SurveyOperationsApi>(SurveyOperationsApi);
    const [formReferences, setFormReferences] = React.useState<SurveyReferences>();
    const [initializers, setInitializers] = useState<PlaceholderInitializer[]>([]);

    const { setValue, getFieldState, clearErrors } = useFormContext<ISurvey>();
    const { error } = getFieldState(`${formPath}.code` as never as keyof ISurvey);
    const questionType = question.type;
    const questionCode = question.code;
    const label = question.label;
    const help = question.help;
    const rows = question.rows as ElementRow[] || null;
    const columns = question.columns as ElementColumn[] || null;
    const choices = question.choices as ElementChoice[] || null;

    const getChildrenLabels = useCallback((schema: SurveyModel | SurveyModel['children']) => {
        const labels: string[] = [];
        if (schema && 'children' in schema && schema.children) {
            Object.keys(schema.children).forEach(key => {
                if (!schema.children) {
                    return;
                }
                const childrenElement = schema.children[key as never];
                labels.push(`${key}.label`);
                if (childrenElement.children && childrenElement.children.length > 0) {
                    labels.push(...getChildrenLabels(childrenElement as never));
                }
            });
        }
        return labels;
    }, []);

    const fetchFormReferences = async () => {
        try {
            let response;
            if (!question.code) {
                response = await call('getSurveyReferences', surveyUuid);
            } else {
                response = await call('getSurveyElementReferences', surveyUuid, question.code);
            }
            setFormReferences(response.data);
            console.log('Form references:', response.data);
            const { surveySchema } = response.data;
            const labelsPlaceholders: string[] = [];
            if (surveySchema) {
                labelsPlaceholders.push(...getChildrenLabels(surveySchema));
            }

            console.log('Form schema:', surveySchema, labelsPlaceholders);

            const constLabelsInitializers = {
                start: '[[',
                stop: ']]',
                placeholders: labelsPlaceholders,
            };

            setInitializers(prev => {
                const existing = prev.find(init => init.start === constLabelsInitializers.start && init.stop === constLabelsInitializers.stop);
                if (existing) {
                    // merge existing placeholders with new ones
                    existing.placeholders = Array.from(new Set(constLabelsInitializers.placeholders));
                    return prev;
                }
                return [...prev, constLabelsInitializers];
            });
        } catch (e) {
            console.error('Error fetching form schema:', e);
        }
    };

    useEffect(() => {
        if (!question.code) {
            return;
        }
        fetchFormReferences();
    }, [question]);

    // Handler for field changes
    const handleFieldChange = (field: keyof SurveyRequestChildrenInner, value: any) => {
        // Create the full path for the specific field
        const fieldPath = `${formPath}.${field}` as any;
        // Update the field directly in the form
        clearErrors(fieldPath);
        setValue(fieldPath, value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // Determine what label to use based on question type
    const labelText = ['block', 'loop'].includes(questionType)
        ? t('Block Title')
        : t('Question Text');

    // Check if the question type supports rows and columns
    const supportsRowsColumns = ['choice', 'open_end'].includes(questionType);
    const isLoop = questionType === 'loop';

    return (
        <div className="space-y-6">
            {/* Block/Loop Title or Question Code */}
            <InputWithLabel
                id={`${questionCode}-code`}
                label={t('Question Code')}
                error={error && error.message}
                inputProps={{
                    type: 'text',
                    value: questionCode,
                    onChange: (e) => {
                        handleFieldChange('code', e.target.value);
                    },
                    placeholder: t('Enter unique identifier'),
                    className: 'backdrop-blur-sm',
                }}
                helperText={t('Unique identifier used for data analysis')}
            />

            {/* For blocks and loops, we need label instead of question text */}
            {['block', 'loop'].includes(questionType) ? (
                <InputWithLabel
                    id={`${questionCode}-label`}
                    label={labelText}
                    inputProps={{
                        type: 'text',
                        value: label,
                        onChange: (e) => handleFieldChange('label', e.target.value),
                        placeholder: t('Enter title'),
                        className: 'backdrop-blur-sm',
                    }}
                    helperText={isLoop ? t('Descriptive name for this loop section') : t('Title for this group of questions')}
                />
            ) : (
                <>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="survey-description"
                               className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                            <FileTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            {t('Element label')}
                        </Label>
                        <MDEditorWithAutocomplete
                            value={label || ''}
                            onChange={function(value?: string): void {
                                handleFieldChange('label', value || '');
                            }}
                            initializers={initializers}
                            formReferences={formReferences}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="survey-description"
                               className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                            <FileTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            {t('Element Help')}
                        </Label>
                        <MDEditorWithAutocomplete
                            value={help || ''}
                            onChange={function(value?: string): void {
                                handleFieldChange('help', value || '');
                            }}
                            initializers={initializers}
                            formReferences={formReferences}
                        />
                    </div>
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
                        questionType={questionType}
                        choices={choices}
                    />
                </div>
            )}
        </div>
    );
};

export default QuestionPropertiesEditor;