import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate,useParams } from 'react-router-dom';

import { toast } from 'sonner';

import { SurveysApi } from '../../api-generated';
import { GeneralSurveyForm } from '../../components/Survey/GeneralSurveyForm';
import QuestionnaireEditorDashboard from '../../components/Survey/QuestionnaireEditorDashboard';
import { QuestionItem } from '../../components/Survey/QuestionTree';
import { IconSave as SaveIcon } from '../../components/UI/Icons';
import ButtonLoader from '../../components/UI/molecules/ButtonLoder';
import { SurveyTabs } from '../../components/UI/molecules/SurveyTabs';
import { useApi } from '../../hooks/useApi';
import { ISurvey } from '../../types/surveys';

const DefaultSurvey: ISurvey = {
    uuid: '',
    title: '',
    description: '',
    children: [
        {
            code: 'q1',
            type: 'text',
            label: 'What is your name?',
            options: {},
            children: [],
            index: 0,
            depth: 0,
            isLast: false,
        },
        {
            code: 'q2',
            type: 'radio',
            label: 'How did you hear about us?',
            options: {},
            children: [],
            index: 1,
            depth: 0,
            isLast: true
        }
    ]
}

export const SurveyBuilderPage: React.FC = () => {
    // use path param uuid to load survey
    const { t } = useTranslation();
    const { uuid } = useParams<{ uuid: string }>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [currentUuid, setCurrentUuid] = useState<string>();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { call, isLoading } = useApi<SurveysApi>(SurveysApi);
    const navigate = useNavigate();

    const showSuccess = (message : string) => toast(message);
    const showError = (message : string) => toast.error(message);

    console.log('SurveyBuilderPage', uuid);

    const formMethods = useForm<ISurvey>({
        defaultValues: DefaultSurvey
    });

    const { setValue, handleSubmit, formState: { isDirty, isSubmitting }, } = formMethods;

    useEffect(() => {
        if (loaded || isLoading || !uuid) {
            return;
        }     
        // Aquí se cargarían las preguntas desde la API si es una encuesta existente
        // Por ahora usamos datos de ejemplo
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
                    console.error(error);
                }
                ).finally(() => {
                    setLoaded(true);
                });
        }
    }, []);

    const handleQuestionsChange = (newQuestions: QuestionItem[]) => {
        setValue('children', newQuestions);
        console.log('Questions updated', newQuestions);
        // Aquí se podrían guardar los cambios en la API
    };

    const onSubmit = async (data: ISurvey) => {
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
            
            console.log('Survey saved successfully', response);
        } catch (error) {
            console.error('Error saving survey', error);
            showError(t('Error saving survey. Please try again.'));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !isSubmitting) {
        return <span>Loading...</span>;
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
            component: <div>{t('Survey preview')}</div>
        }
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {currentUuid === 'new' ? t('New survey') : t('Edit survey')}
                </h1>
                
                <ButtonLoader
                    onClick={handleSubmit(onSubmit)}
                    loading={isSaving}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 text-white py-2 px-4 rounded-xl shadow-lg shadow-pumpkin-orange/20 hover:translate-y-[-2px] transition-all duration-200 ease-in-out"
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