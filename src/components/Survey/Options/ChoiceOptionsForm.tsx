import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuestionChoice } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import { AlertCircleIcon } from '../../UI/Icons';
import InputWithLabel from '../../UI/molecules/InputWithLabel';
import CommonOptionsForm from './CommonOptionsForm';

interface ChoiceOptionsFormProps {
    element: QuestionChoice;
    onChange: (field: string, value: string | number | boolean | null) => void;
    className?: string;
}

/**
 * Form component for choice question options
 * Handles widget type and multiple selection settings including validation rules
 */
// eslint-disable-next-line complexity
const ChoiceOptionsForm: React.FC<ChoiceOptionsFormProps> = ({ element, onChange, className }) => {
    const { t } = useTranslation();
    const { options, rows, columns } = element;
    const hasRows = rows ? rows.length > 0 : false;
    const hasColumns = columns ? columns.length > 0 : false;
    const [isMultiple, setIsMultiple] = React.useState<boolean>(options?.multiple || false);

    // Helper function to handle numeric input validation
    const handleNumericChange = (field: string, value: string) => {
        const numValue = value === '' ? null : parseInt(value, 10);
        onChange(field, numValue);
    };

    return (
        <div className={cn('space-y-6', className)}>
            {/* Common options */}
            <div className='bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <h3 className='font-medium text-gray-800 dark:text-gray-200 mb-4'>{t('General Settings')}</h3>
                <CommonOptionsForm options={options} onChange={onChange} showRandomize={hasRows || hasColumns} />
            </div>

            {/* Choice-specific options */}
            <div className='space-y-5 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <h3 className='font-medium text-gray-800 dark:text-gray-200'>{t('Choice Options')}</h3>

                {/* Multiple selection toggle */}
                <div className='flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700'>
                    <div className='space-y-0.5'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            {t('Allow Multiple Selections')}
                        </label>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {t('Respondent can select more than one option. This will override required setting.')}
                        </p>
                    </div>
                    <div>
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                className='sr-only peer'
                                checked={isMultiple}
                                onChange={e => {
                                    onChange('multiple', e.target.checked || false);
                                    if (!e.target.checked) {
                                        onChange('multiple', false);
                                        onChange('fixedChoices', null);
                                        onChange('minChoices', null);
                                        onChange('maxChoices', null);
                                        setIsMultiple(false);
                                    } else {
                                        onChange('multiple', true);
                                        setIsMultiple(true);
                                        onChange('required', false);
                                    }
                                }}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pumpkin-orange"></div>
                        </label>
                    </div>
                </div>

                {/* Multiple selection options - only visible when multiple is true */}
                {isMultiple && (
                    <div className='mt-4 space-y-4 pl-4 border-l-2 border-pumpkin-orange/30'>
                        <div className='flex flex-col gap-5'>
                            {/* Fixed number of choices */}
                            <div className='space-y-1'>
                                <InputWithLabel
                                    id='fixedChoices'
                                    label={t('Fixed Number of Choices')}
                                    helperText={t(
                                        'Respondents must select exactly this number of options. If set, min/max settings are ignored.',
                                    )}
                                    inputProps={{
                                        type: 'number',
                                        min: 0,
                                        value: options?.fixedChoices !== undefined ? options.fixedChoices : '',
                                        onChange: e => handleNumericChange('fixedChoices', e.target.value),
                                        placeholder: t('No fixed limit'),
                                        className: 'backdrop-blur-sm',
                                    }}
                                />

                                {options?.fixedChoices !== undefined && options.fixedChoices > 0 && (
                                    <div className='flex items-center text-amber-600 dark:text-amber-400 mt-1'>
                                        <AlertCircleIcon className='h-4 w-4 mr-1.5' />
                                        <p className='text-xs'>
                                            {t('Using fixed choices will override min/max settings')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Min/Max choices section */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {/* Minimum choices */}
                                <InputWithLabel
                                    id='minChoices'
                                    label={t('Minimum Choices')}
                                    helperText={t('Least number of options that must be selected')}
                                    inputProps={{
                                        type: 'number',
                                        min: 0,
                                        value: options?.minChoices !== undefined ? options.minChoices : '',
                                        onChange: e => handleNumericChange('minChoices', e.target.value),
                                        placeholder: t('No minimum'),
                                        className: 'backdrop-blur-sm',
                                        disabled: options?.fixedChoices !== undefined && options.fixedChoices > 0,
                                    }}
                                />

                                {/* Maximum choices */}
                                <InputWithLabel
                                    id='maxChoices'
                                    label={t('Maximum Choices')}
                                    helperText={t('Most number of options that can be selected')}
                                    inputProps={{
                                        type: 'number',
                                        min: 0,
                                        value: options?.maxChoices !== undefined ? options.maxChoices : '',
                                        onChange: e => handleNumericChange('maxChoices', e.target.value),
                                        placeholder: t('No maximum'),
                                        className: 'backdrop-blur-sm',
                                        disabled: options?.fixedChoices !== undefined && options.fixedChoices > 0,
                                    }}
                                />
                            </div>

                            {options?.minChoices !== undefined &&
                                options?.maxChoices !== undefined &&
                                options.minChoices > options.maxChoices &&
                                options.maxChoices > 0 && (
                                    <div className='flex items-center text-red-600 dark:text-red-400'>
                                        <AlertCircleIcon className='h-4 w-4 mr-1.5' />
                                        <p className='text-xs'>
                                            {t('Minimum choices cannot be greater than maximum choices')}
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>
                )}
                {/* Randomize choices toggle */}
                <div className='flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700'>
                    <div className='space-y-0.5'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            {t('Randomize Choices')}
                        </label>
                    </div>
                    <div>
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                className='sr-only peer'
                                checked={options?.randomizeChoices || false}
                                onChange={e => {
                                    onChange('randomizeChoices', e.target.checked || false);
                                }}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pumpkin-orange"></div>
                        </label>
                    </div>
                </div>
                {/* Expand choices toggle - Not expand means will use a dropdown*/}
                <div className='flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700'>
                    <div className='space-y-0.5'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            {t('Show Choices in Dropdown')}
                        </label>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {t('If unchecked, choices will be using radio or checkboxes if multiple')}
                        </p>
                    </div>
                    <div>
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                className='sr-only peer'
                                checked={options?.expandChoices || false}
                                onChange={e => {
                                    onChange('expandChoices', e.target.checked || false);
                                }}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pumpkin-orange"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChoiceOptionsForm;
