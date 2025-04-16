import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { SurveysApi, ValidationError } from '../../api-generated';
import { useApi } from '../../hooks/useApi';
import { cn } from '../../lib/utils';
import { ISurvey } from '../../types/surveys';
import { AlertCircleIcon,IconSave as SaveIcon } from '../UI/Icons';
import ButtonLoader from '../UI/molecules/ButtonLoder';
import { GeneralSurveyForm } from './GeneralSurveyForm';
import QuestionnaireEditorDashboard from './QuestionnaireEditorDashboard';
import { QuestionItem } from './QuestionTree';
import SurveyFormSchemaPreview from './SurveyFormSchemaPreview';
import { SurveyTabs } from './SurveyTabs';

const DefaultSurvey: ISurvey = {
    uuid: '',
    title: '',
    description: '',
    children: [
        {
            uniqueId: String(Math.floor(Math.random() * Date.now())),
            code: 'q1',
            type: 'text',
            label: 'What is your name?',
            index: 0,
            depth: 0,
            isLast: false,
            children: []
        },
        {
            uniqueId: String(Math.floor(Math.random() * Date.now())),
            code: 'q2',
            type: 'choice',
            label: 'How did you hear about us?',
            index: 1,
            depth: 0,
            isLast: true,
            children: []
        }
    ]
}

export const SurveyBuilder: React.FC = () => {
    // use path param uuid to load survey
    const { t } = useTranslation();
    const { uuid } = useParams<{ uuid: string }>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [currentUuid, setCurrentUuid] = useState<string>();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [validationFailed, setValidationFailed] = useState<boolean>(false);
    const { call, isLoading } = useApi<SurveysApi>(SurveysApi);
    const navigate = useNavigate();

    const showSuccess = (message: string) => toast(message);
    const showError = (message: string) => toast.error(message);

    const formMethods = useForm<ISurvey>({
        defaultValues: DefaultSurvey,
        mode: 'onChange', // Ensure we validate on submit, not onChange
        criteriaMode: "all",
    });

    const { 
        setValue, 
        handleSubmit, 
        formState: { isSubmitting }, 
        setError,
        clearErrors 
    } = formMethods;

    useEffect(() => {
        if (loaded || isLoading || !uuid) {
            return;
        }     
        // Aquí se cargarían las preguntas desde la API si es una encuesta existente
        if (uuid) {
            setCurrentUuid(uuid);   
            // Simular carga desde API
            call('getSurvey', uuid)
                .then(response => {
                    const survey = response.data;
                    setValue('title', survey.title);
                    setValue('description', survey.description);
                    setValue('children', survey.children);
                })
                .catch(error => {
                    console.error('Error loading survey:', error);
                    showError(t('Error loading survey. Please try again.'));
                })
                .finally(() => {
                    setLoaded(true);
                });
        }
    }, [call, isLoading, loaded, setValue, t, uuid]);

    const handleQuestionsChange = (newQuestions: QuestionItem[]) => {
        setValue('children', newQuestions);
        // When content changes, clear any previous validation errors
        if (validationFailed) {
            clearErrors();
            setValidationFailed(false);
        }
    };

    // eslint-disable-next-line complexity
    const onSubmit = async (data: ISurvey) => {
        // Clear previous validation state
        setValidationFailed(false);
        setIsSaving(true);
        
        try {
            let response;
            
            if (currentUuid && currentUuid !== 'new') {
                // Update existing survey
                response = await call('updateSurvey', currentUuid, data);
                showSuccess(t('Survey updated successfully'));
            } else {
                // Create new survey
                response = await call('createSurvey', data);
                showSuccess(t('Survey created successfully'));
                // Navigate to edit page with the new UUID
                if (response?.data?.uuid) {
                    navigate(`/admin/surveys/${response.data.uuid}`);
                }
            }
        } catch (error) {
            console.error('Error saving survey:', error);
            
            if (error instanceof AxiosError) {
                const axiosError = error as AxiosError<ValidationError>;
                
                if (axiosError.response && [400, 422].includes(axiosError.response?.status || 0)) {
                    const validationData = axiosError.response.data;
                    
                    if (validationData?.violations && validationData.violations.length > 0) {
                        // Set validation failed flag
                        setValidationFailed(true);
                        
                        // Clear all previous errors first
                        clearErrors();
                        
                        // Set individual field errors
                        validationData.violations.forEach(violation => {
                            setError(violation.propertyPath as keyof ISurvey, {
                                type: 'custom',
                                message: violation.title 
                            });
                        });
                        
                        // Show a more specific error message
                        showError(t('Please correct the highlighted fields and try again.'));
                    } else {
                        // Generic bad request error
                        showError(t('Invalid form data. Please check your entries and try again.'));
                    }
                } else {
                    // Other API errors
                    showError(t('Error saving survey. Please try again later.'));
                }
            } else {
                // Non-Axios errors
                showError(t('An unexpected error occurred. Please try again.'));
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !isSubmitting) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3"></div>
                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    const tabs = [
        {
            name: t('General'),
            component: (
                <GeneralSurveyForm/>
            )
        },
        {
            name: t('Questionnaire'),
            component: (
                <QuestionnaireEditorDashboard
                    onChange={handleQuestionsChange}
                />
            )
        },
        {
            name: t('Preview'),
            component: <div>{uuid && <SurveyFormSchemaPreview surveyUuid={uuid} />}</div>
        }
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {currentUuid === 'new' ? t('New survey') : t('Edit survey')}
                    </h1>
                    
                    {validationFailed && (
                        <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircleIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            <span>{t('Please fix the validation errors before saving')}</span>
                        </div>
                    )}
                </div>
                
                <ButtonLoader
                    onClick={handleSubmit(onSubmit)}
                    loading={isSaving}
                    disabled={isSaving}
                    className={cn(
                        "bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80",
                        "text-white py-3 px-4 rounded-xl",
                        "shadow-lg shadow-pumpkin-orange/20",
                        "hover:translate-y-[-2px] transition-all duration-200 ease-in-out",
                        "flex items-center justify-center"
                    )}
                >
                    <SaveIcon className="h-5 w-5 mr-2" />
                    {t('Save survey')}
                </ButtonLoader>
            </div>
            
            <FormProvider {...formMethods}>
                <SurveyTabs tabs={tabs} />
            </FormProvider>
        </div>
    );
};