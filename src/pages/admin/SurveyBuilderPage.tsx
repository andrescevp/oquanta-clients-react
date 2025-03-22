import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { SurveysApi } from '../../api-generated';
import { GeneralSurveyForm } from '../../components/Survey/GeneralSurveyForm';
import QuestionnaireEditorDashboard from '../../components/Survey/QuestionnaireEditorDashboard';
import { QuestionItem } from '../../components/Survey/QuestionTree';
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
    const {t} = useTranslation();
    const { uuid } = useParams<{ uuid: string }>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [currentUuid, setCurrentUuid] = useState<string>();
    const {call, isLoading} = useApi<SurveysApi>(SurveysApi);

    console.log('SurveyBuilderPage', uuid);

    const formMethods = useForm<ISurvey>({
        defaultValues: DefaultSurvey
    });

    const {setValue} = formMethods;

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

    if (isLoading) {
        return <span>Loading...</span>;
    }

    const tabs = [
        {
            name: 'General',
            component: (
                <GeneralSurveyForm/>
            )
        },
        {
            name: 'Questionario',
            component: (
                <QuestionnaireEditorDashboard
                    onChange={handleQuestionsChange}
                />
            )
        },
        {
            name: 'Vista previa',
            component: <div>Vista previa de la encuesta</div>
        }
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">
                {currentUuid === 'new' ? 'Nueva encuesta' : 'Editar encuesta'}
            </h1>
            <FormProvider {...formMethods}>
                <SurveyTabs tabs={tabs} />
            </FormProvider>
        </div>
    );
};
