import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

import cn from 'clsx';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';

import { 
  OrganizationPlaceSurvey, 
  OrganizationPlaceSurveyCreate,
  OrganizationPlaceSurveysApi,
  OrganizationPlaceSurveyUpdate} from '../../../../api-generated/api';
import { IconEdit } from '../../../../components/UI/Icons';
import { OffsetPanel } from '../../../../components/UI/organisms/OffsetPanel';
import { useApi } from '../../../../hooks/useApi';
import OrganizationPlaceSurveyForm from './OrganizationPlaceSurveyForm';

interface OrganizationPlaceSurveysProps {
  organizationPlaceId: string;
  onSuccess?: () => void;
}

export const OrganizationPlaceSurveys: React.FC<OrganizationPlaceSurveysProps> = ({
  organizationPlaceId,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [surveys, setSurveys] = useState<OrganizationPlaceSurvey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedSurvey, setSelectedSurvey] = useState<OrganizationPlaceSurvey | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const { call } = useApi(OrganizationPlaceSurveysApi);

  const loadSurveys = async () => {
    try {
      setIsLoading(true);
      const response = await call(
        'getApiOrganizationPlaceSurveysList',
        organizationPlaceId,
        currentPage,
        rowsPerPage,
        '',
        'title',
        'ASC',
      );
      
      setSurveys(response.data.results);
      setTotalRows(response.data.count || 0);
    } catch (error) {
      console.error('Error loading surveys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, [organizationPlaceId, currentPage, rowsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newRowsPerPage: number, page: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(page);
  };

  const handlePanelOpen = (survey?: OrganizationPlaceSurvey) => {
    if (survey) {
      setSelectedSurvey(survey);
    } else {
      setSelectedSurvey(null);
    }
  };

  const onSubmit = async (data: OrganizationPlaceSurveyCreate | OrganizationPlaceSurveyUpdate) => {
    try {
      setIsSubmitting(true);
      if (selectedSurvey) {
        // Actualizar encuesta existente
        await call('putApiOrganizationPlaceSurveysUpdate', organizationPlaceId, selectedSurvey.uuid!, data);
      } else {
        // Crear nueva encuesta
        await call('postApiOrganizationPlaceSurveysCreate', organizationPlaceId, data);
      }
      
      loadSurveys();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm(t('¿Estás seguro de eliminar esta encuesta?'))) {
      try {
        await call('deleteApiOrganizationPlaceSurveysDelete', organizationPlaceId, uuid);
        loadSurveys();
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Error deleting survey:', error);
      }
    }
  };

  const columns = [
    {
      name: t('Título'),
      selector: (row: OrganizationPlaceSurvey) => row.title || '',
      sortable: true,
    },
    {
      name: t('Alias'),
      selector: (row: OrganizationPlaceSurvey) => row.alias || '',
      sortable: true,
    },
    {
      name: t('Tipo'),
      selector: (row: OrganizationPlaceSurvey) => 
        row.surveyType === 'tracker' ? t('Tracker') : t('Campaña'),
      sortable: true,
    },
    {
      name: t('Estado'),
      cell: (row: OrganizationPlaceSurvey) => (
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-semibold',
          row.active 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        )}>
          {row.active ? t('Activo') : t('Inactivo')}
        </span>
      ),
      sortable: true,
    },
    {
      name: t('Fecha inicio'),
      selector: (row: OrganizationPlaceSurvey) => 
        row.startAt ? format(new Date(row.startAt), 'dd/MM/yyyy') : '-',
      sortable: true,
    },
    {
      name: t('Fecha fin'),
      selector: (row: OrganizationPlaceSurvey) => 
        row.endAt ? format(new Date(row.endAt), 'dd/MM/yyyy') : '-',
      sortable: true,
    },
    {
      name: t('Acciones'),
      cell: (row: OrganizationPlaceSurvey) => (
        <div className="flex space-x-2">
          <OffsetPanel
          title={t(`Editar encuesta: ${row.title}`)}
          position="right"
          panelId={`edit-survey-${row.uuid}`}
          buttonIcon={IconEdit}
          buttonClassName="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
          buttonIconClassName="w-4 h-4"
          defaultOpen={false}
          onOpen={() => handlePanelOpen()}
        >
          <OrganizationPlaceSurveyForm
            mode="edit"
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            survey={row}
          />
        </OffsetPanel>
          <button 
            onClick={() => handleDelete(row.uuid!)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
            title={t('Eliminar')}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {t('Encuestas del lugar')}
        </h2>
        
        <OffsetPanel
          title={t('Nueva encuesta')}
          position="right"
          panelId="new-survey"
          buttonText={t('Nueva encuesta')}
          buttonIcon={Plus}
          buttonClassName="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
          buttonIconClassName="w-4 h-4"
          defaultOpen={false}
          onOpen={() => handlePanelOpen()}
        >
          <OrganizationPlaceSurveyForm
            mode="create"
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </OffsetPanel>
      </div>

      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <DataTable
          columns={columns}
          data={surveys}
          progressPending={isLoading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          noDataComponent={<div className="p-4">{t('No hay encuestas disponibles')}</div>}
          persistTableHead
          className="rounded-lg overflow-hidden"
        />
      </div>

      {/* Panel lateral para editar encuestas */}
      <OffsetPanel
        title={t('Editar encuesta')}
        position="right"
        panelId="edit-survey"
        buttonText=""
        buttonClassName="hidden"
        persistState={false}
      >
        <OrganizationPlaceSurveyForm
          mode="edit"
          survey={selectedSurvey}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </OffsetPanel>
    </div>
  );
};

export default OrganizationPlaceSurveys;