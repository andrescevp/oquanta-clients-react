import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormDefinition } from '../../../api-generated/api';
import { cn } from '../../../lib/utils';
import ButtonLoader from '../../UI/molecules/ButtonLoder';
import InputWithLabel from '../../UI/molecules/InputWithLabel';

export interface SurveyFormRendererProps {
    schema: FormDefinition;
    onSubmit?: (data: any) => void;
    loading?: boolean;
    className?: string;
}

export interface ChoiceOption {
    label: string;
    value: string | number;
    data: { [key: string]: any };
    attr: { [key: string]: any };
    labelTranslationParameters: { [key: string]: any };
}

export type SurveyAnswer = string | number | boolean | null | undefined;

export interface SurveyCollectionAnswer {
    [key: string]: SurveyAnswer | SurveyCollectionAnswer;
}

/**
 * Component that dynamically renders a form based on a JSON schema
 * This can be exported as part of the SDK for public-facing applications
 */
const SurveyFormRenderer: React.FC<SurveyFormRendererProps> = ({
                                                                   schema,
                                                                   onSubmit,
                                                                   loading = false,
                                                                   className,
                                                               }) => {
    const { t } = useTranslation();
    // const [formSchema, setFormSchema] = React.useState<SurveyCollectionAnswer>();

    const methods = useForm<SurveyCollectionAnswer>({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    // Render individual field based on type
    // eslint-disable-next-line complexity
    const renderField = (key: string, prop: FormDefinition) => {
        console.log('renderField', key, prop);
        const { type, label, placeholder } = prop;
        let elementOptions = {};
        if (prop.attributes && prop.attributes['data-element']) {
            elementOptions = prop.attributes['data-element']['options'];
        }
        const formOptions = prop.options || {};
        const isRequired = false;
        if (!prop.form_path) {
            return null;
        }

        let elementType = 'text';
        if (type === 'text') {
            elementType = ('multiline' in elementOptions && elementOptions['multiline'] === true) ? 'textarea' : 'text';
            elementType = ('type' in elementOptions && elementOptions['type'] === 'string') ? elementType : 'number';
        } else if (type === 'choice') {
            elementType = ('multiple' in formOptions && formOptions.multiple === true) ? 'checkbox' : 'radio';
        }
        const choiceOptions = 'choices' in formOptions ? formOptions.choices : [];
        console.log('choiceOptions', elementType, choiceOptions);

        switch (elementType) {
            case 'text':
                return (
                    <div>
                        <label
                            htmlFor={key}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {label}
                            {isRequired && <span className="ml-1 text-red-500">*</span>}
                        </label>
                        <input
                            id={key}
                            type="text"
                            placeholder={placeholder || ''}
                            {...methods.register(key, { required: isRequired })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-pumpkin-orange/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            data-form-path={prop.form_path}
                        />
                    </div>
                );
            case 'number':
                return (
                    <div>
                        <label
                            htmlFor={key}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {label}
                            {isRequired && <span className="ml-1 text-red-500">*</span>}
                        </label>
                        <input
                            id={key}
                            type="number"
                            placeholder={placeholder || ''}
                            {...methods.register(key, {
                                required: isRequired,
                                valueAsNumber: true,
                            })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-pumpkin-orange/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            data-form-path={prop.form_path}
                        />
                    </div>
                );
            case 'textarea':
                return (
                    <div>
                        <label
                            htmlFor={key}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {label}
                            {isRequired && <span className="ml-1 text-red-500">*</span>}
                        </label>
                        <textarea
                            id={key}
                            placeholder={placeholder || ''}
                            {...methods.register(key, { required: isRequired })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-pumpkin-orange/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            rows={3}
                            data-form-path={prop.form_path}
                        />
                    </div>
                );
            case 'checkbox':
                return (
                    <div>
                        <div>
                            {label}
                        </div>
                        <div>
                            {choiceOptions.map((option: ChoiceOption, index: number) => (
                                <div key={option.value} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`${key}-${option.value}`}
                                        value={option.value}
                                        {...methods.register(key)}
                                        className="mr-2"
                                        data-form-path={`${prop.form_path}[${index}][${option.value}]`}
                                    />
                                    <label htmlFor={`${key}-${option.value}`} className="text-sm">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'radio':
                return (
                    <div>
                        <div>
                            {label}
                        </div>
                        <div>
                            {choiceOptions.map((option: ChoiceOption) => (
                                <div key={option.value} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`${key}-${option.value}`}
                                        value={option.value}
                                        {...methods.register(key)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`${key}-${option.value}`} className="text-sm">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <InputWithLabel
                        key={key}
                        id={key}
                        label={label || ''}
                        required={isRequired}
                        inputProps={{
                            type: 'text',
                            placeholder: placeholder || '',
                            ...methods.register(key, { required: isRequired }),
                            className: 'backdrop-blur-sm',
                        }}
                    />
                );
        }
    };

    // Render row layout (multiple fields grouped under one question)
    const renderRowLayout = (questionPath: string, properties: [string, any][]) => {
        const title = properties[0][1].attr?.['data-child-label'] || 'Question';

        return (
            <div key={questionPath} className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {title}
                </h3>
                <div
                    className="space-y-3 bg-gray-50/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    {properties.map(([key, prop]) => (
                        <div key={key} className="flex items-start">
                            <div
                                className="min-w-[120px] mr-3 pt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {prop.attr?.['data-row-label'] || 'Row'}
                            </div>
                            <div className="flex-grow">
                                {renderField(key, prop)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Process and organize schema properties for rendering
    const formFields = (form: FormDefinition) => {
        console.log('formFields', form);
        if (!form) {
            return null;
        }
        const { children } = form || {};

        console.log('form', children, form);

        if (!children || Object.keys(children).length === 0) {
            return null;
        }

        console.log('children', children);

        // Render groups
        return Object.entries(children).map(([itemCode, formDefinition]) => {
            console.log('formDefinition', formDefinition);
            const { type } = formDefinition as FormDefinition;

            if (type === 'collection') {
                return null;
            }

            return (
                <div key={itemCode} className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        {formDefinition.label || 'Question'}
                    </h3>
                    <div className="space-y-3">
                        {renderField(itemCode, formDefinition)}
                    </div>
                </div>
            );
        });
    };

    const defaultSubmit = (data: any) => {
        console.log('Form submitted with data:', data);
    };

    console.log('SurveyFormRenderer', loading, schema);

    return !loading && schema ? (
        <div
            className={cn('bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm', className)}>
            {/*{schema.title && (*/}
            {/*    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">*/}
            {/*        {schema.title}*/}
            {/*    </h2>*/}
            {/*)}*/}

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit || defaultSubmit)} className="space-y-6">
                    <div className="space-y-6">
                        {formFields(schema)}
                    </div>

                    <ButtonLoader
                        type="submit"
                        loading={loading}
                        className={cn(
                            'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80',
                            'text-white py-3 px-4 rounded-xl',
                            'shadow-lg shadow-pumpkin-orange/20',
                            'hover:translate-y-[-2px] transition-all duration-200 ease-in-out',
                            'mt-6 w-full',
                        )}
                    >
                        {t('Submit')}
                    </ButtonLoader>
                </form>
            </FormProvider>
        </div>
    ) : null;
};

export default SurveyFormRenderer;