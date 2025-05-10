import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import {
    OrganizationPlaceSurvey,
    OrganizationPlaceSurveyCreate,
    OrganizationPlaceSurveySubsystemEnum,
    OrganizationPlaceSurveySurveyTypeEnum,
    OrganizationPlaceSurveyUpdate,
} from '../../../../api-generated/api';
import ButtonLoader from '../../../../components/UI/molecules/ButtonLoder';
import InputWithLabel from '../../../../components/UI/molecules/InputWithLabel';

interface OrganizationPlaceSurveyFormProps {
    mode: 'create' | 'edit';
    survey?: OrganizationPlaceSurvey | null; // Solo es necesario si mode === 'edit'
    onSubmit: (data: OrganizationPlaceSurveyCreate | OrganizationPlaceSurveyUpdate) => Promise<void>;
    isSubmitting?: boolean;
}

/**
 * Form component for creating and editing organization place surveys
 */
export const OrganizationPlaceSurveyForm: React.FC<OrganizationPlaceSurveyFormProps> = ({
    mode,
    survey,
    onSubmit,
    isSubmitting = false,
}) => {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<OrganizationPlaceSurveyCreate | OrganizationPlaceSurveyUpdate>({
        defaultValues: {
            title: '',
            active: true,
            alias: '',
            startAt: '',
            endAt: '',
            subsystem: OrganizationPlaceSurveySubsystemEnum.Limesurvey,
            surveyType: OrganizationPlaceSurveySurveyTypeEnum.Tracker,
            surveyOid: '',
            lookerReportEmbedUrl: '',
        },
    });

    // Inicializar el formulario con datos de la encuesta si estamos en modo edición
    useEffect(() => {
        if (mode === 'edit' && survey) {
            reset({
                title: survey.title || '',
                active: survey.active || false,
                alias: survey.alias || '',
                startAt: survey.startAt ? survey.startAt.substring(0, 10) : '',
                endAt: survey.endAt ? survey.endAt.substring(0, 10) : '',
                subsystem: survey.subsystem,
                surveyType: survey.surveyType,
                surveyOid: survey.surveyOid || '',
                lookerReportEmbedUrl: survey.lookerReportEmbedUrl || '',
            });
        } else {
            // Reset con valores predeterminados para creación
            reset({
                title: '',
                active: true,
                alias: '',
                startAt: '',
                endAt: '',
                subsystem: OrganizationPlaceSurveySubsystemEnum.Limesurvey,
                surveyType: OrganizationPlaceSurveySurveyTypeEnum.Tracker,
                surveyOid: '',
                lookerReportEmbedUrl: '',
            });
        }
    }, [mode, survey, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-6'>
            <InputWithLabel
                id='survey-title'
                label={`${t('Título')}*`}
                error={errors.title && t('El título es obligatorio')}
                inputProps={{
                    ...register('title', { required: true }),
                    className:
                        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                }}
            />

            <InputWithLabel
                id='survey-alias'
                label={t('Alias')}
                inputProps={{
                    ...register('alias'),
                    className:
                        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                }}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='relative'>
                    <InputWithLabel
                        id='survey-start-date'
                        label={t('Fecha inicio')}
                        inputProps={{
                            type: 'date',
                            ...register('startAt'),
                            className:
                                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                        }}
                    />
                </div>

                <div className='relative'>
                    <InputWithLabel
                        id='survey-end-date'
                        label={t('Fecha fin')}
                        inputProps={{
                            type: 'date',
                            ...register('endAt'),
                            className:
                                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                        }}
                    />
                </div>
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>{t('Subsistema')}*</label>
                <Controller
                    control={control}
                    name='subsystem'
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            value={{
                                value: field.value,
                                label: t('LimeSurvey'),
                            }}
                            onChange={option => field.onChange(option?.value)}
                            options={[
                                { value: OrganizationPlaceSurveySubsystemEnum.Limesurvey, label: t('LimeSurvey') },
                            ]}
                            className='mt-1 block w-full'
                            classNamePrefix='select'
                        />
                    )}
                />
                {errors.subsystem && (
                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{t('El subsistema es obligatorio')}</p>
                )}
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {t('Tipo de encuesta')}*
                </label>
                <Controller
                    control={control}
                    name='surveyType'
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            value={{
                                value: field.value,
                                label:
                                    field.value === OrganizationPlaceSurveySurveyTypeEnum.Tracker
                                        ? t('Tracker')
                                        : t('Campaña'),
                            }}
                            onChange={option => field.onChange(option?.value)}
                            options={[
                                { value: OrganizationPlaceSurveySurveyTypeEnum.Tracker, label: t('Tracker') },
                                { value: OrganizationPlaceSurveySurveyTypeEnum.Campaign, label: t('Campaña') },
                            ]}
                            className='mt-1 block w-full'
                            classNamePrefix='select'
                        />
                    )}
                />
                {errors.surveyType && (
                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                        {t('El tipo de encuesta es obligatorio')}
                    </p>
                )}
            </div>

            <InputWithLabel
                id='survey-oid'
                label={`${t('ID de encuesta')}*`}
                error={errors.surveyOid && t('El ID de encuesta es obligatorio')}
                inputProps={{
                    ...register('surveyOid', { required: true }),
                    className:
                        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                }}
            />

            <InputWithLabel
                id='survey-looker-url'
                label={t('URL de reporte Looker')}
                inputProps={{
                    ...register('lookerReportEmbedUrl'),
                    className:
                        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                }}
            />

            <div className='flex items-center'>
                <input
                    id='active'
                    type='checkbox'
                    {...register('active')}
                    className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
                />
                <label htmlFor='active' className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
                    {t('Encuesta activa')}
                </label>
            </div>

            <div className='mt-6 flex justify-end'>
                <ButtonLoader
                    type='submit'
                    loading={isSubmitting}
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'>
                    {mode === 'edit' ? t('Actualizar') : t('Crear')}
                </ButtonLoader>
            </div>
        </form>
    );
};

export default OrganizationPlaceSurveyForm;
