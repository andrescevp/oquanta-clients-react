import React, { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ElementChoice, ElementColumn, ElementOptionsChoice, ElementRow } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import { ISurvey } from '../../../types/surveys';
import { GripIcon, PlusIcon, TrashIcon } from '../../UI/Icons';
import InputWithLabel from '../../UI/molecules/InputWithLabel';

interface QuestionRowsColumnsEditorProps {
    questionCode: string;
    formPath: string;
    questionType: string;
    rows?: ElementRow[] | null;
    columns?: ElementColumn[] | null;
    choices?: ElementChoice[] | null;
}

/**
 * Component for managing rows and columns in matrix-type questions
 * Used by choice, number, and string question types
 */
// eslint-disable-next-line complexity
const QuestionRowsColumnsEditor: React.FC<QuestionRowsColumnsEditorProps> = ({
    questionCode,
    formPath,
    rows = [],
    columns = [],
    choices = [],
    questionType,
}) => {
    const { t } = useTranslation();
    const { setValue, register, getValues, watch } = useFormContext<ISurvey>();
    const isChoiceQuestion = questionType === 'choice';
    const valueFields = watch(`${formPath}.options` as never) as never as ElementOptionsChoice;
    const { useRowsAsChoices, useColumnsAsChoices } = valueFields || {};
    console.log('useRowsAsChoices:', useRowsAsChoices);
    console.log('useColumnsAsChoices:', useColumnsAsChoices);
    const registerChildrens = useCallback(() => {
        register(`${formPath}.rows` as any, {
            value: rows,
        });
        register(`${formPath}.columns` as any, {
            value: columns,
        });
        register(`${formPath}.choices` as any, {
            value: choices?.length ? choices : null,
        });
        console.log('Registering rows, columns, and choices:', formPath);
    }, [formPath]);

    useEffect(() => {
        registerChildrens();
    }, [registerChildrens]);

    // Update rows in the form
    const updateRows = (updatedRows: ElementRow[]) => {
        console.log('Updating rows:', updatedRows, formPath);
        setValue(`${formPath}.rows` as any, updatedRows, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // Update columns in the form
    const updateColumns = (updatedColumns: ElementColumn[]) => {
        setValue(`${formPath}.columns` as any, updatedColumns, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // Update choices in the form - only if the question type is choice
    const updateChoices = (updatedChoices: ElementChoice[]) => {
        setValue(`${formPath}.choices` as any, updatedChoices, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // Add a new row
    const handleAddRow = () => {
        console.log('Adding new row');
        const rowIndex = rows?.length || 0;
        const newRow: ElementRow = {
            uniqueId: String(Math.floor(Math.random() * Date.now())),
            code: `row_${rowIndex + 1}`,
            label: t('New Row'),
            index: rowIndex,
            depth: 0, // Add required depth property
            isLast: true, // Add required isLast property
        };

        // Update isLast property for previous last row if it exists
        const updatedRows = [...(rows || [])].map(row => ({
            ...row,
            isLast: false,
        }));

        updateRows([...updatedRows, newRow]);
    };

    // Add a new column
    const handleAddColumn = () => {
        const columnIndex = columns?.length || 0;
        const newColumn: ElementColumn = {
            uniqueId: String(Math.floor(Math.random() * Date.now())),
            code: `col_${columnIndex + 1}`,
            label: t('New Column'),
            index: columnIndex,
            depth: 0, // Add required depth property
            isLast: true, // Add required isLast property
        };

        // Update isLast property for previous last column if it exists
        const updatedColumns = [...(columns || [])].map(column => ({
            ...column,
            isLast: false,
        }));

        updateColumns([...updatedColumns, newColumn]);
    };

    // Add a new choice - only if the question type is choice
    const handleAddChoice = () => {
        const choiceIndex = choices?.length || 0;
        const newChoice: ElementChoice = {
            uniqueId: String(Math.floor(Math.random() * Date.now())),
            code: `choice_${choiceIndex + 1}`,
            label: t('New Choice'),
            index: choiceIndex,
            depth: 0, // Add required depth property
            isLast: true, // Add required isLast property
        };

        // Update isLast property for previous last choice if it exists
        const updatedChoices = [...(choices || [])].map(choice => ({
            ...choice,
            isLast: false,
        }));

        updateChoices([...updatedChoices, newChoice]);
    };

    // Update a row
    const handleUpdateRow = (index: number, field: keyof ElementRow, value: string | number) => {
        const updatedRows = [...(rows || [])];
        updatedRows[index] = {
            ...updatedRows[index],
            [field]: value,
        };
        updateRows(updatedRows);
    };

    // Update a column
    const handleUpdateColumn = (index: number, field: keyof ElementColumn, value: string | number) => {
        const updatedColumns = [...(columns || [])];
        updatedColumns[index] = {
            ...updatedColumns[index],
            [field]: value,
        };
        updateColumns(updatedColumns);
    };

    // Update a choice - only if the question type is choice
    const handleUpdateChoice = (index: number, field: keyof ElementChoice, value: string | number) => {
        const updatedChoices = [...(choices || [])];
        updatedChoices[index] = {
            ...updatedChoices[index],
            [field]: value,
        };
        updateChoices(updatedChoices);
    };

    // Delete a row
    const handleDeleteRow = (index: number) => {
        const updatedRows = [...(rows || [])].filter((_, i) => i !== index);

        // Update indices after deletion
        updatedRows.forEach((row, i) => {
            row.index = i;
            // Set isLast property correctly
            row.isLast = i === updatedRows.length - 1;
        });

        updateRows(updatedRows);
    };

    // Delete a column
    const handleDeleteColumn = (index: number) => {
        const updatedColumns = [...(columns || [])].filter((_, i) => i !== index);

        // Update indices after deletion
        updatedColumns.forEach((column, i) => {
            column.index = i;
            // Set isLast property correctly
            column.isLast = i === updatedColumns.length - 1;
        });

        updateColumns(updatedColumns);
    };

    // Delete a choice - only if the question type is choice
    const handleDeleteChoice = (index: number) => {
        const updatedChoices = [...(columns || [])].filter((_, i) => i !== index);

        // Update indices after deletion
        updatedChoices.forEach((choice, i) => {
            choice.index = i;
            // Set isLast property correctly
            choice.isLast = i === updatedChoices.length - 1;
        });

        updateChoices(updatedChoices);
    };

    return (
        <div className='space-y-6'>
            {/* Choices Section */}
            {isChoiceQuestion && (useRowsAsChoices || useColumnsAsChoices) && (
                <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {t('Choices are automatically generated from rows or columns.')}
                    </p>
                </div>
            )}
            {!useRowsAsChoices && !useColumnsAsChoices && (
                <div className='bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-medium text-gray-800 dark:text-gray-200'>{t('Choices')}</h3>
                        <div className='flex items-center space-x-2 justify-end'>
                            <button
                                type='button'
                                onClick={handleAddChoice}
                                className={cn(
                                    'flex items-center px-3 py-1.5 rounded-lg text-sm',
                                    'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80',
                                    'text-white font-medium shadow-sm hover:shadow-md',
                                    'transition-all duration-200 hover:translate-y-[-1px]',
                                )}>
                                <PlusIcon className='h-4 w-4 mr-1.5' />
                                {t('Add Choice')}
                            </button>
                        </div>
                    </div>

                    {choices && choices.length > 0 ? (
                        <div className='space-y-3'>
                            {choices.map((choice, index) => (
                                <div key={`choice-${index}`} className='flex items-start gap-2'>
                                    <div className='flex-shrink-0 py-2.5 px-2 text-gray-400'>
                                        <GripIcon className='h-5 w-5' />
                                    </div>
                                    <div className='flex-grow grid grid-cols-1 md:grid-cols-2 gap-3'>
                                        <InputWithLabel
                                            id={`${questionCode}-choice-${index}-label`}
                                            label={t('Label')}
                                            inputProps={{
                                                value: choice.label,
                                                onChange: e => handleUpdateChoice(index, 'label', e.target.value),
                                                className: 'backdrop-blur-sm',
                                            }}
                                        />
                                        <InputWithLabel
                                            id={`${questionCode}-choice-${index}-code`}
                                            label={t('Code')}
                                            inputProps={{
                                                value: choice.code,
                                                onChange: e => handleUpdateChoice(index, 'code', e.target.value),
                                                className: 'backdrop-blur-sm',
                                            }}
                                        />
                                        <InputWithLabel
                                            id={`${questionCode}-choice-${index}-code`}
                                            label={t('Value')}
                                            inputProps={{
                                                type: 'number',
                                                value: choice.value as number,
                                                onChange: e =>
                                                    handleUpdateChoice(index, 'value', parseInt(e.target.value, 10)),
                                                className: 'backdrop-blur-sm',
                                            }}
                                        />
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => handleDeleteChoice(index)}
                                        className='flex-shrink-0 p-2 text-red-500 hover:text-red-700 transition-colors duration-200'>
                                        <TrashIcon className='h-5 w-5' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-4 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-lg'>
                            {t('No choices added yet. Add a choice to get started.')}
                        </div>
                    )}
                </div>
            )}
            {/* Rows Section */}
            <div className='bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='font-medium text-gray-800 dark:text-gray-200'>{t('Rows')}</h3>
                    <div className='flex items-center space-x-2 justify-end'>
                        {isChoiceQuestion && !useColumnsAsChoices && (
                            <div className='flex items-center flex-col w-1/3'>
                                <div className='flex items-center justify-between'>
                                    <div className='space-y-0.5'>
                                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                            {t('Use rows as choices')}
                                        </label>
                                    </div>
                                    <div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                className='sr-only peer'
                                                {...register(`${formPath}.options.useRowsAsChoices` as any, {
                                                    value: false,
                                                    onChange: e => {
                                                        const updatedValue = e.target.checked;
                                                        setValue(
                                                            `${formPath}.options.useRowsAsChoices` as any,
                                                            updatedValue,
                                                            {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            },
                                                        );
                                                        if (updatedValue) {
                                                            setValue(
                                                                `${formPath}.options.useColumnsAsChoices` as any,
                                                                false,
                                                                {
                                                                    shouldValidate: true,
                                                                    shouldDirty: true,
                                                                },
                                                            );
                                                        }
                                                    },
                                                })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pumpkin-orange"></div>
                                        </label>
                                    </div>
                                </div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    {t(
                                        'Respondent can select one or more rows as choices. Current choices will be overridden.',
                                    )}
                                </p>
                            </div>
                        )}
                        <button
                            type='button'
                            onClick={handleAddRow}
                            className={cn(
                                'flex items-center px-3 py-1.5 rounded-lg text-sm',
                                'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80',
                                'text-white font-medium shadow-sm hover:shadow-md',
                                'transition-all duration-200 hover:translate-y-[-1px]',
                            )}>
                            <PlusIcon className='h-4 w-4 mr-1.5' />
                            {t('Add Row')}
                        </button>
                    </div>
                </div>

                {rows && rows.length > 0 ? (
                    <div className='space-y-3'>
                        {rows.map((row, index) => (
                            <div key={`row-${index}`} className='flex items-start gap-2'>
                                <div className='flex-shrink-0 py-2.5 px-2 text-gray-400'>
                                    <GripIcon className='h-5 w-5' />
                                </div>
                                <div className='flex-grow grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <InputWithLabel
                                        id={`${questionCode}-row-${index}-label`}
                                        label={t('Label')}
                                        inputProps={{
                                            value: row.label,
                                            onChange: e => handleUpdateRow(index, 'label', e.target.value),
                                            className: 'backdrop-blur-sm',
                                        }}
                                    />
                                    <InputWithLabel
                                        id={`${questionCode}-row-${index}-code`}
                                        label={t('Code')}
                                        inputProps={{
                                            value: row.code,
                                            onChange: e => handleUpdateRow(index, 'code', e.target.value),
                                            className: 'backdrop-blur-sm',
                                        }}
                                    />
                                </div>
                                <button
                                    type='button'
                                    onClick={() => handleDeleteRow(index)}
                                    className='flex-shrink-0 p-2 text-red-500 hover:text-red-700 transition-colors duration-200'>
                                    <TrashIcon className='h-5 w-5' />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-4 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-lg'>
                        {t('No rows added yet. Add a row to get started.')}
                    </div>
                )}
            </div>

            {/* Columns Section */}
            <div className='bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='font-medium text-gray-800 dark:text-gray-200'>{t('Columns')}</h3>
                    <div className='flex items-center space-x-2 justify-end'>
                        {isChoiceQuestion && !useRowsAsChoices && (
                            <div className='flex items-center flex-col w-1/3'>
                                <div className='flex items-center justify-between'>
                                    <div className='space-y-0.5'>
                                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                            {t('Use rows as choices')}
                                        </label>
                                    </div>
                                    <div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                className='sr-only peer'
                                                {...register(`${formPath}.options.useColumnsAsChoices` as any, {
                                                    value: false,
                                                    onChange: e => {
                                                        const updatedValue = e.target.checked;
                                                        setValue(
                                                            `${formPath}.options.useColumnsAsChoices` as any,
                                                            updatedValue,
                                                            {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            },
                                                        );
                                                        if (updatedValue) {
                                                            setValue(
                                                                `${formPath}.options.useRowsAsChoices` as any,
                                                                false,
                                                                {
                                                                    shouldValidate: true,
                                                                    shouldDirty: true,
                                                                },
                                                            );
                                                        }
                                                    },
                                                })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pumpkin-orange"></div>
                                        </label>
                                    </div>
                                </div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    {t(
                                        'Respondent can select one or more rows as choices. Current choices will be overridden.',
                                    )}
                                </p>
                            </div>
                        )}
                        <button
                            type='button'
                            onClick={handleAddColumn}
                            className={cn(
                                'flex items-center px-3 py-1.5 rounded-lg text-sm',
                                'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80',
                                'text-white font-medium shadow-sm hover:shadow-md',
                                'transition-all duration-200 hover:translate-y-[-1px]',
                            )}>
                            <PlusIcon className='h-4 w-4 mr-1.5' />
                            {t('Add Column')}
                        </button>
                    </div>
                </div>

                {columns && columns.length > 0 ? (
                    <div className='space-y-3'>
                        {columns.map((column, index) => (
                            <div key={`column-${index}`} className='flex items-start gap-2'>
                                <div className='flex-shrink-0 py-2.5 px-2 text-gray-400'>
                                    <GripIcon className='h-5 w-5' />
                                </div>
                                <div className='flex-grow grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <InputWithLabel
                                        id={`${questionCode}-column-${index}-label`}
                                        label={t('Label')}
                                        inputProps={{
                                            value: column.label,
                                            onChange: e => handleUpdateColumn(index, 'label', e.target.value),
                                            className: 'backdrop-blur-sm',
                                        }}
                                    />
                                    <InputWithLabel
                                        id={`${questionCode}-column-${index}-code`}
                                        label={t('Code')}
                                        inputProps={{
                                            value: column.code,
                                            onChange: e => handleUpdateColumn(index, 'code', e.target.value),
                                            className: 'backdrop-blur-sm',
                                        }}
                                    />
                                </div>
                                <button
                                    type='button'
                                    onClick={() => handleDeleteColumn(index)}
                                    className='flex-shrink-0 p-2 text-red-500 hover:text-red-700 transition-colors duration-200'>
                                    <TrashIcon className='h-5 w-5' />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-4 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-lg'>
                        {t('No columns added yet. Add a column to get started.')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionRowsColumnsEditor;
