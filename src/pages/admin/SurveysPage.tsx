import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ErrorMessage } from '@hookform/error-message';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

import { SurveyList, SurveyListItem, SurveysApi } from '../../api-generated';
import Label from '../../components/UI/atoms/Label';
import getDataTableTheme from '../../components/UI/DataTableTheme';
import { AlertCircleIcon, IconAdd as PlusIcon, IconSave as  SaveIcon, IconTrash as TrashIcon } from '../../components/UI/Icons';
import ButtonLoader from '../../components/UI/molecules/ButtonLoder';
import InputWithLabel from '../../components/UI/molecules/InputWithLabel';
import ButtonModal from '../../components/UI/organisms/ButtonModal';
import { useAuth } from '../../context/AuthContext';
import { useBreadcrumbs } from '../../context/BreadcrumbsContext';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { ISurvey } from '../../types/surveys';

export const SurveysPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useAuth();
    const { setBreadcrumbs } = useBreadcrumbs();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const surveyApi = new SurveysApi(configuration);
    const [surveys, setSurveys] = useState<SurveyList['results']>([]);
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ISurvey>({
        defaultValues: {
            title: '',
            description: '',
            children: [],
        },
    });

    const deleteSurvey = async (id: string) => {
        try {
            await surveyApi.deleteSurvey(id);
            setSurveys(surveys.filter(survey => survey.uuid !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const newSurveyPost = async (data: ISurvey) => {
        setIsSubmitting(true);
        try {
            const response = await surveyApi.createSurvey({
                ...data,
                children: [],
            });
            reset();
            navigate(`/survey/${response.data.uuid}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (loading || loaded || !configuration) {
            return;
        }

        setLoading(true);
        setBreadcrumbs([
            {
                label: 'Surveys',
                path: '/surveys',
            },
        ]);
        
        surveyApi.listSurveys()
            .then(response => {
                setSurveys(response.data.results);
                setLoaded(true);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [configuration, loading, loaded, setBreadcrumbs]);

    const columns: TableColumn<SurveyListItem>[] = [
        {
            name: t('ID'),
            selector: row => row.uuid || '',
            sortable: true,
            maxWidth: '200px',
        },
        {
            name: t('Title'),
            selector: row => row.title || '',
            sortable: true,
            grow: 2,
        },
        {
            name: t('Description'),
            selector: row => row.description || '',
            sortable: true,
            grow: 3,
        },
        {
            name: '',
            cell: row => row.uuid && (
                <ButtonModal
                    buttonTitle={t('Delete')}
                    className="p-2 rounded-full text-white bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 shadow-md hover:shadow-lg shadow-red-500/20 hover:translate-y-[-2px] transition-all duration-200"
                    modalTitle={t('Delete Survey')}
                    modalContent={
                        <div className="text-gray-800 dark:text-gray-200">
                            {t('Are you sure you want to delete this survey?')}
                        </div>
                    }
                    modalFooter={
                        <ButtonLoader
                            type="button"
                            onClick={() => deleteSurvey(row.uuid || '')}
                            className="py-2.5 px-4 rounded-xl text-white bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 shadow-lg shadow-red-500/20 hover:translate-y-[-2px] transition-all duration-200 flex items-center gap-2"
                            loading={isSubmitting}
                        >
                            <TrashIcon className="h-5 w-5" />
                            <span>{t('Delete')}</span>
                        </ButtonLoader>
                    }
                >
                    <TrashIcon className="h-5 w-5" />
                </ButtonModal>
            ),
            width: '80px',
            button: true,
        },
    ];

    return (
        <div className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {t('Surveys')}
                        </h1>
                        
                        <ButtonModal
                            buttonTitle={t('New Survey')}
                            className="py-2.5 px-4 rounded-xl text-white bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 hover:translate-y-[-2px] shadow-lg shadow-pumpkin-orange/20 transition-all duration-200 flex items-center gap-2"
                            modalTitle={t('New Survey')}
                            modalContent={
                                <form className="space-y-6 p-1">
                                    <div className="space-y-4">
                                        <InputWithLabel
                                            id="survey-title"
                                            label={t('Title')}
                                            inputProps={{
                                                ...register('title', {
                                                    required: t('Title is required'),
                                                }),
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
                                        <Controller
                                            render={({ field }) => (
                                                <div className="flex flex-col space-y-2">
                                                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        {t('Description')}
                                                    </Label>
                                                    <MDEditor
                                                        preview="edit"
                                                        value={String(field.value || '')}
                                                        onChange={field.onChange}
                                                        previewOptions={{
                                                            rehypePlugins: [[rehypeSanitize]],
                                                        }}
                                                        className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600"
                                                    />
                                                </div>
                                            )}
                                            name="description"
                                            control={control}
                                        />
                                    </div>
                                </form>
                            }
                            modalFooter={
                                <ButtonLoader
                                    type="button"
                                    onClick={handleSubmit(newSurveyPost)}
                                    className="py-2.5 px-4 rounded-xl text-white bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 hover:translate-y-[-2px] shadow-lg shadow-pumpkin-orange/20 transition-all duration-200 flex items-center gap-2"
                                    loading={isSubmitting}
                                >
                                    <SaveIcon className="h-5 w-5" />
                                    <span>{t('Create')}</span>
                                </ButtonLoader>
                            }
                        >
                            <div className="flex items-center gap-2">
                                <PlusIcon className="h-5 w-5" />
                                <span>{t('New Survey')}</span>
                            </div>
                        </ButtonModal>
                    </div>
                    
                    <div className="p-0">
                        <DataTable
                            columns={columns}
                            data={surveys}
                            highlightOnHover
                            pointerOnHover
                            theme={getDataTableTheme(isDark)}
                            onRowClicked={row => navigate(`/admin/surveys/${row.uuid}`)}
                            fixedHeader
                            pagination
                            progressPending={loading}
                            noDataComponent={
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    {t('No surveys found')}
                                </div>
                            }
                            className="rounded-b-2xl overflow-hidden"                            
                        />
                    </div>
                </div>
    );
};

export default SurveysPage;