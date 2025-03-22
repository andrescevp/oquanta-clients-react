import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ErrorMessage } from '@hookform/error-message';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

import { cn } from '../../lib/utils';
import { ISurvey } from '../../types/surveys';
import Label from '../UI/atoms/Label';
import { AlertCircleIcon, FileTextIcon } from '../UI/Icons';
import InputWithLabel from '../UI/molecules/InputWithLabel';

/**
 * GeneralSurveyForm component for editing basic survey information
 * Provides fields for title and description with validation
 */
export const GeneralSurveyForm: React.FC = () => {
    const { t } = useTranslation();
    const { register, formState: { errors }, control, setValue, watch } = useFormContext<ISurvey>();
    const description = watch('description');

    return (
        <div className="p-6 space-y-6 backdrop-blur-sm bg-white/40 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="space-y-2">
                    <InputWithLabel
                        id="survey-title"
                        label={t('Survey Title')}
                        inputProps={{
                            ...register('title', {
                                required: t('Survey title is required')
                            }),
                            placeholder: t('Enter survey title'),
                            className: cn(
                                "pl-10 pr-4 py-2.5 rounded-xl w-full",
                                "bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600",
                                "focus:ring-2 focus:ring-pumpkin-orange/50 focus:border-pumpkin-orange",
                                "transition-all duration-200 ease-in-out",
                                errors.title && "border-red-500 focus:ring-red-500/50"
                            )
                        }}
                    />
                    {errors.title && (
                        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 mt-1.5 text-sm">
                            <AlertCircleIcon className="h-4 w-4" />
                            <ErrorMessage errors={errors} name="title" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="survey-description" className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                            <FileTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            {t('Survey Description')}
                        </Label>
                        
                        <MDEditor
                            id="survey-description"
                            value={description || ''}
                            onChange={(value) => setValue('description', value || '')}
                            preview="edit"
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]],
                            }}
                            className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 min-h-[150px]"
                            height={200}
                        />
                    </div>

                    {errors.description && (
                        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 mt-1.5 text-sm">
                            <AlertCircleIcon className="h-4 w-4" />
                            <ErrorMessage errors={errors} name="description" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneralSurveyForm;