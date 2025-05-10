import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';

import { FormDefinition, SurveyOperationsApi } from '../../api-generated';
import { useApi } from '../../hooks/useApi';
import { cn } from '../../lib/utils';
import { IconRefresh as RefreshCwIcon } from '../UI/Icons';
import ButtonLoader from '../UI/molecules/ButtonLoder';
import SurveyFormRenderer from './Public/SurveyFormRenderer';

interface SurveyFormSchemaPreviewProps {
    surveyUuid: string;
}

/**
 * Component for previewing the form schema of a survey
 * Displays JSON structure with reload capability
 */
// eslint-disable-next-line complexity
const SurveyFormSchemaPreview: React.FC<SurveyFormSchemaPreviewProps> = ({ surveyUuid }) => {
    const { t } = useTranslation();
    const { call, isLoading } = useApi<SurveyOperationsApi>(SurveyOperationsApi);
    const [formSchema, setFormSchema] = React.useState<FormDefinition>();
    const [formReferences, setFormReferences] = React.useState<{ [key: string]: any }>();
    const [isReloading, setIsReloading] = useState<boolean>(false);

    const fetchFormSchema = async () => {
        setIsReloading(true);
        try {
            const response = await call('getSurveyForm', surveyUuid);
            console.log('response', response);
            setFormSchema(response.data);
        } catch (error) {
            console.error('Error fetching form schema:', error);
        } finally {
            setIsReloading(false);
        }
    };

    const fetchFormReferences = async () => {
        setIsReloading(true);
        try {
            const response = await call('getSurveyReferences', surveyUuid);
            setFormReferences(response.data as never);
        } catch (error) {
            console.error('Error fetching form schema:', error);
        } finally {
            setIsReloading(false);
        }
    };

    React.useEffect(() => {
        fetchFormSchema();
        fetchFormReferences();
    }, [surveyUuid]);

    const handleReload = () => {
        fetchFormSchema();
        fetchFormReferences();
    };

    return (
        <div className='flex flex-col gap-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {t('Survey Form Schema Preview')}
                </h2>

                <ButtonLoader
                    onClick={handleReload}
                    loading={isReloading}
                    disabled={isReloading || isLoading}
                    className={cn(
                        'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80',
                        'text-white py-2 px-3 rounded-xl',
                        'shadow-md shadow-pumpkin-orange/20',
                        'hover:translate-y-[-1px] transition-all duration-200 ease-in-out',
                        'flex items-center justify-center text-sm',
                    )}>
                    <RefreshCwIcon className='h-4 w-4 mr-1.5' />
                    {t('Reload')}
                </ButtonLoader>
            </div>

            <div className='relative'>
                {(isLoading || isReloading) && (
                    <div className='absolute inset-0 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center rounded-md z-10'>
                        <div className='animate-pulse flex flex-col items-center'>
                            <div className='h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mb-2'></div>
                            <div className='h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl'></div>
                        </div>
                    </div>
                )}

                <pre
                    className={cn(
                        'bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700',
                        'text-sm text-gray-800 dark:text-gray-300 overflow-auto max-h-[500px]',
                        'transition-opacity duration-200',
                        (isLoading || isReloading) && 'opacity-50',
                    )}>
                    {formSchema ? <ReactJson src={formSchema} /> : t('Loading schema...')}
                </pre>

                <pre
                    className={cn(
                        'bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700',
                        'text-sm text-gray-800 dark:text-gray-300 overflow-auto max-h-[500px]',
                        'transition-opacity duration-200',
                        (isLoading || isReloading) && 'opacity-50',
                    )}>
                    {formReferences ? <ReactJson src={formReferences} /> : t('Loading schema...')}
                </pre>
            </div>

            {formSchema && <SurveyFormRenderer schema={formSchema} loading={isLoading || isReloading} />}
        </div>
    );
};

export default SurveyFormSchemaPreview;
