import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tab } from '@headlessui/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import {
  NormalSchedule,
  NormalSchedulePeriod,
  OrganizationPlaceWorkingHours,
  OrganizationPlaceWorkingHoursApi,
  SpecialSchedule
} from '../../../../api-generated/api';
import { IconAdd, IconCalendar, IconClock, IconReset, IconSave, IconTrash } from '../../../../components/UI/Icons';
import ButtonLoader from '../../../../components/UI/molecules/ButtonLoder';
import { useApi } from '../../../../hooks/useApi';
import { useTheme } from '../../../../hooks/useTheme';
import { cn } from '../../../../lib/utils';

interface OrganizationPlaceWorkingHoursManagerProps {
  placeUuid: string;
  onSuccess?: () => void;
}

const DAYS_OF_WEEK = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
];

// Componente principal
const OrganizationPlaceWorkingHoursManager: React.FC<OrganizationPlaceWorkingHoursManagerProps> = ({
  placeUuid,
  onSuccess
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const workingHoursApi = useApi(OrganizationPlaceWorkingHoursApi);

  // Estado de los horarios
  const [workingHours, setWorkingHours] = useState<OrganizationPlaceWorkingHours>({
    normalSchedule: [],
    specialSchedule: []
  });
  
  // Estado para el tracking de modificaciones
  const [isModified, setIsModified] = useState<boolean>(false);  

  // Asegurar que todos los días de la semana estén representados en normalSchedule
  const ensureCompleteDaysOfWeek = (schedule: NormalSchedule[]): NormalSchedule[] => {
    const existingDays = schedule.map(s => s.day);
    const completedSchedule = [...schedule];
    
    for (let day = 0; day <= 6; day++) {
      if (!existingDays.includes(day)) {
        completedSchedule.push({
          day,
          periods: []
        });
      }
    }
    
    // Ordenar por día de la semana
    return completedSchedule.sort((a, b) => (a.day || 0) - (b.day || 0));
  };

  // Cargar los horarios desde la API
  const loadWorkingHours = async () => {
    try {
      const response = await workingHoursApi.call('getApiOrganizationPlaceWorkingHoursGet', placeUuid);
      if (response.data) {
        // Asegúrate que normalSchedule tenga una entrada por cada día de la semana
        const normalSchedule = ensureCompleteDaysOfWeek(response.data.normalSchedule || []);
        setWorkingHours({
          normalSchedule,
          specialSchedule: response.data.specialSchedule || []
        });
      }
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      toast.error(t('No se pudieron cargar los horarios del establecimiento'));
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (placeUuid) {
      loadWorkingHours();
    }
  }, [placeUuid]);

  

  // Guardar los cambios en la API
  const handleSave = async () => {
    try {
      await workingHoursApi.call('putApiOrganizationPlaceWorkingHoursUpdate', placeUuid, workingHours);
      setIsModified(false);
      toast.success(t('Horarios actualizados correctamente'));
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar horarios:', error);
      toast.error(t('No se pudieron guardar los cambios'));
    }
  };

  // Restablecer los horarios a valores por defecto
  const handleReset = async () => {
    if (confirm(t('¿Está seguro de que desea restablecer los horarios? Esta acción no se puede deshacer.'))) {
      try {
        await workingHoursApi.call('postApiOrganizationPlaceWorkingHoursReset', placeUuid);
        toast.success(t('Horarios restablecidos correctamente'));
        loadWorkingHours();
      } catch (error) {
        console.error('Error al restablecer horarios:', error);
        toast.error(t('No se pudieron restablecer los horarios'));
      }
    }
  };

  // Agregar un nuevo período de tiempo a un día específico
  const addPeriodToDay = (dayIndex: number) => {
    const updatedSchedule = [...workingHours.normalSchedule || []];
    const daySchedule = updatedSchedule.find(day => day.day === dayIndex);
    
    if (daySchedule) {
      // Asegurarse de que periods es un array
      const periods = Array.isArray(daySchedule.periods) ? daySchedule.periods : [];
      
      // Agregar un nuevo período con valores por defecto
      const newPeriod: NormalSchedulePeriod = {
        from: '09:00',
        to: '18:00'
      };
      
      daySchedule.periods = [...periods, newPeriod];
      
      setWorkingHours({
        ...workingHours,
        normalSchedule: updatedSchedule
      });
      
      setIsModified(true);
    }
  };

  // Actualizar un período específico para un día
  const updatePeriod = (dayIndex: number, periodIndex: number, field: 'from' | 'to', value: string) => {
    const updatedSchedule = [...workingHours.normalSchedule || []];
    const daySchedule = updatedSchedule.find(day => day.day === dayIndex);
    
    if (daySchedule && daySchedule.periods && Array.isArray(daySchedule.periods)) {
      daySchedule.periods[periodIndex][field] = value;
      
      setWorkingHours({
        ...workingHours,
        normalSchedule: updatedSchedule
      });
      
      setIsModified(true);
    }
  };

  // Eliminar un período específico
  const removePeriod = (dayIndex: number, periodIndex: number) => {
    const updatedSchedule = [...workingHours.normalSchedule || []];
    const daySchedule = updatedSchedule.find(day => day.day === dayIndex);
    
    if (daySchedule && daySchedule.periods && Array.isArray(daySchedule.periods)) {
      daySchedule.periods = daySchedule.periods.filter((_, index) => index !== periodIndex);
      
      setWorkingHours({
        ...workingHours,
        normalSchedule: updatedSchedule
      });
      
      setIsModified(true);
    }
  };

  // Agregar un nuevo horario especial
  const addSpecialSchedule = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const newSpecial: SpecialSchedule = {
      validFrom: format(today, 'yyyy-MM-dd'),
      validThrough: format(tomorrow, 'yyyy-MM-dd'),
      opens: '09:00',
      closes: '18:00',
      reason: t('Horario especial')
    };
    
    setWorkingHours({
      ...workingHours,
      specialSchedule: [...(workingHours.specialSchedule || []), newSpecial]
    });
    
    setIsModified(true);
  };

  // Actualizar un horario especial
  const updateSpecialSchedule = (index: number, field: keyof SpecialSchedule, value: string) => {
    const updatedSpecials = [...(workingHours.specialSchedule || [])];
    updatedSpecials[index] = {
      ...updatedSpecials[index],
      [field]: value
    };
    
    setWorkingHours({
      ...workingHours,
      specialSchedule: updatedSpecials
    });
    
    setIsModified(true);
  };

  // Eliminar un horario especial
  const removeSpecialSchedule = (index: number) => {
    const updatedSpecials = [...(workingHours.specialSchedule || [])];
    updatedSpecials.splice(index, 1);
    
    setWorkingHours({
      ...workingHours,
      specialSchedule: updatedSpecials
    });
    
    setIsModified(true);
  };

  // Componente para los horarios regulares
  const NormalScheduleTab = () => (
    <div className="space-y-6">
      {workingHours.normalSchedule?.map((daySchedule) => (
        <div 
          key={daySchedule.day} 
          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            {DAYS_OF_WEEK.find(d => d.id === daySchedule.day)?.name}
          </h3>
          
          {/* Lista de períodos para este día */}
          <div className="space-y-3">
            {daySchedule.periods && Array.isArray(daySchedule.periods) ? (
              daySchedule.periods.map((period, periodIndex) => (
                <div key={periodIndex} className="flex items-center space-x-3">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('Desde')}
                      </label>
                      <input
                        type="time"
                        value={period.from || ''}
                        onChange={(e) => updatePeriod(daySchedule.day || 0, periodIndex, 'from', e.target.value)}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('Hasta')}
                      </label>
                      <input
                        type="time"
                        value={period.to || ''}
                        onChange={(e) => updatePeriod(daySchedule.day || 0, periodIndex, 'to', e.target.value)}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => removePeriod(daySchedule.day || 0, periodIndex)}
                      className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      aria-label={t('Eliminar período')}
                    >
                      <IconTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                {t('No hay horarios configurados para este día')}
              </p>
            )}
          </div>
          
          {/* Botón para agregar un nuevo período */}
          <button
            type="button"
            onClick={() => addPeriodToDay(daySchedule.day || 0)}
            className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <IconAdd className="w-4 h-4 mr-1" />
            {t('Agregar horario')}
          </button>
        </div>
      ))}
    </div>
  );

  // Componente para los horarios especiales
  const SpecialScheduleTab = () => (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">{t('Desde')}</th>
              <th className="px-6 py-3">{t('Hasta')}</th>
              <th className="px-6 py-3">{t('Abre')}</th>
              <th className="px-6 py-3">{t('Cierra')}</th>
              <th className="px-6 py-3">{t('Motivo')}</th>
              <th className="px-6 py-3 w-20">{t('Acciones')}</th>
            </tr>
          </thead>
          <tbody>
            {workingHours.specialSchedule && workingHours.specialSchedule.length > 0 ? (
              workingHours.specialSchedule.map((special, index) => (
                <tr 
                  key={index} 
                  className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4">
                    <input
                      type="date"
                      value={special.validFrom || ''}
                      onChange={(e) => updateSpecialSchedule(index, 'validFrom', e.target.value)}
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="date"
                      value={special.validThrough || ''}
                      onChange={(e) => updateSpecialSchedule(index, 'validThrough', e.target.value)}
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="time"
                      value={special.opens || ''}
                      onChange={(e) => updateSpecialSchedule(index, 'opens', e.target.value)}
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="time"
                      value={special.closes || ''}
                      onChange={(e) => updateSpecialSchedule(index, 'closes', e.target.value)}
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={special.reason || ''}
                      onChange={(e) => updateSpecialSchedule(index, 'reason', e.target.value)}
                      placeholder={t('Motivo del horario especial')}
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => removeSpecialSchedule(index)}
                      className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      aria-label={t('Eliminar horario especial')}
                    >
                      <IconTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 italic">
                  {t('No hay horarios especiales configurados')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Botón para agregar un nuevo horario especial */}
      <button
        type="button"
        onClick={addSpecialSchedule}
        className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        <IconAdd className="w-4 h-4 mr-1" />
        {t('Agregar horario especial')}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {t('Horarios de trabajo')}
        </h2>
        
        <div className="flex space-x-2">
          <ButtonLoader
            type="button"
            onClick={handleReset}
            className="btn btn-outline"
            icon={<IconReset className="w-5 h-5" />}
          >
            {t('Restablecer')}
          </ButtonLoader>
          
          <ButtonLoader
            type="button"
            onClick={handleSave}
            className="btn btn-primary"
            disabled={!isModified || workingHoursApi.isLoading}
            loading={workingHoursApi.isLoading}
            icon={<IconSave className="w-5 h-5" />}
          >
            {t('Guardar cambios')}
          </ButtonLoader>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              cn(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center">
              <IconClock className="w-5 h-5 mr-2" />
              {t('Horarios regulares')}
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center">
              <IconCalendar className="w-5 h-5 mr-2" />
              {t('Horarios especiales')}
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <NormalScheduleTab />
          </Tab.Panel>
          <Tab.Panel>
            <SpecialScheduleTab />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default OrganizationPlaceWorkingHoursManager;