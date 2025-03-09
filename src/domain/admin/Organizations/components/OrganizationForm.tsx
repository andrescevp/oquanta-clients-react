import React, { useState } from 'react';
import {useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Organization, 
  OrganizationCreate, 
  OrganizationsApi, 
  OrganizationUpdate, 
  OrganizationUser,
  OrganizationUsersApi,
  UsersApi} from '../../../../api-generated/api';
import { IconSave, IconX } from '../../../../components/UI/Icons';
import ButtonLoader from '../../../../components/UI/molecules/ButtonLoder';
import { ConfirmationTooltip } from '../../../../components/UI/molecules/ConfirmationTooltip';
import InputWithLabel from '../../../../components/UI/molecules/InputWithLabel';
import { useApi } from '../../../../hooks/useApi';
import { useTheme } from '../../../../hooks/useTheme';
import { cn } from '../../../../lib/utils';
import OrganizationUsersTable from './OrganizationUsersTable';

type FormValues = Omit<Organization, 'uuid'>
type RoleOption = { value: string; label: string };

interface OrganizationFormProps {
  uuid?: string;
  organizationData?: Organization;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Form component for creating and editing organizations
 */
// eslint-disable-next-line complexity
const OrganizationForm: React.FC<OrganizationFormProps> = ({ 
  uuid,
  organizationData,
  onSuccess,
  onCancel
}) => {
  const { t } = useTranslation();
  const organizationsApi = useApi(OrganizationsApi);
  const organizationUsersApi = useApi(OrganizationUsersApi);
  const usersApi = useApi(UsersApi);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {isDark} = useTheme();
  
  // Estado para los usuarios de la organización
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(null);
  const [isAddUserMode, setIsAddUserMode] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingRolesForId, setEditingRolesForId] = useState<number | null>(null);
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    totalRows: 0,
    perPage: 10
  });

  // Opciones de roles disponibles
  const roleOptions: RoleOption[] = [
    { value: 'ROLE_OWNER', label: t('Owner') },
  ];
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: organizationData ? {
      name: organizationData.name || '',
      legalId: organizationData.legalId || '',
      mainContactPhone: organizationData.mainContactPhone || undefined,
      secondaryContactPhone: organizationData.secondaryContactPhone || undefined,
      contactEmail: organizationData.contactEmail || '',
      address: organizationData.address || '',
      country: organizationData.country || '',
      city: organizationData.city || '',
      postalCode: organizationData.postalCode || ''
    } : {
      name: '',
      legalId: '',
      contactEmail: '',
      address: '',
      country: '',
      city: '',
      postalCode: ''
    }
  });
  
  // Enviar el formulario
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      if (organizationData && organizationData.uuid) {
        // Actualizar organización existente
        const updateData: OrganizationUpdate = {
          name: data.name,
          legalId: data.legalId,
          mainContactPhone: data.mainContactPhone,
          secondaryContactPhone: data.secondaryContactPhone,
          contactEmail: data.contactEmail,
          address: data.address,
          country: data.country,
          city: data.city,
          postalCode: data.postalCode
        };
        await organizationsApi.call('putApiOrganizationsUpdate', organizationData.uuid, updateData);
      } else {
        // Crear nueva organización
        const createData: OrganizationCreate = {
          name: data.name,
          legalId: data.legalId,
          mainContactPhone: data.mainContactPhone,
          secondaryContactPhone: data.secondaryContactPhone,
          contactEmail: data.contactEmail,
          address: data.address,
          country: data.country,
          city: data.city,
          postalCode: data.postalCode
        };
        await organizationsApi.call('postApiOrganizationsCreate', createData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error al guardar organización:', err);
      setError(t('No se pudo guardar la información de la organización'));
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async () => {
    if (!organizationData || !organizationData.uuid) {
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      await organizationsApi.call('deleteApiOrganizationsDelete', organizationData.uuid);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error al eliminar organización:', err);
      setError(t('No se pudo eliminar la organización'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}
      
      {/* Formulario de la organización */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {organizationData?.uuid ? t('Editar organización') : t('Nueva organización')}
        </h2>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          
          {/* Nombre */}
          <InputWithLabel
            id="name"
            label={t('Nombre')}
            error={errors.name && t(errors.name.message || 'El nombre es obligatorio')}
            inputProps={{
              type: "text",
              ...register('name', { required: t('El nombre es obligatorio') })
            }}
          />
          
          {/* ID Legal */}
          <InputWithLabel
            id="legalId"
            label={t('ID Legal / CIF')}
            error={errors.legalId && t(errors.legalId.message || 'El ID legal es obligatorio')}
            inputProps={{
              type: "text",
              ...register('legalId', { required: t('El ID legal es obligatorio') })
            }}
          />
          
          {/* Email de contacto */}
          <InputWithLabel
            id="contactEmail"
            label={t('Email de contacto')}
            error={errors.contactEmail && t(errors.contactEmail.message || 'El email no tiene un formato válido')}
            inputProps={{
              type: "email",
              ...register('contactEmail', { 
                required: t('El email de contacto es obligatorio'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('El email no tiene un formato válido')
                }
              })
            }}
          />
          
          {/* Teléfono principal */}
          <InputWithLabel
            id="mainContactPhone"
            label={t('Teléfono principal')}
            error={errors.mainContactPhone && t(errors.mainContactPhone.message || 'Formato de teléfono inválido')}
            inputProps={{
              type: "tel",
              ...register('mainContactPhone', { 
                required: t('El teléfono principal es obligatorio'),
                pattern: {
                  value: /^[0-9]+$/,
                  message: t('Solo se permiten números')
                },
              })
            }}
          />
          
          {/* Teléfono secundario */}
          <InputWithLabel
            id="secondaryContactPhone"
            label={t('Teléfono secundario')}
            error={errors.secondaryContactPhone && t(errors.secondaryContactPhone.message || 'Formato de teléfono inválido')}
            inputProps={{
              type: "tel",
              ...register('secondaryContactPhone', { 
                pattern: {
                  value: /^[0-9]*$/,
                  message: t('Solo se permiten números')
                }
              })
            }}
          />
          
          {/* Dirección */}
          <InputWithLabel
            id="address"
            label={t('Dirección')}
            error={errors.address && t(errors.address.message || 'La dirección es obligatoria')}
            inputProps={{
              type: "text",
              ...register('address', { required: t('La dirección es obligatoria') })
            }}
          />
          
          {/* Ciudad */}
          <InputWithLabel
            id="city"
            label={t('Ciudad')}
            error={errors.city && t(errors.city.message || 'La ciudad es obligatoria')}
            inputProps={{
              type: "text",
              ...register('city', { required: t('La ciudad es obligatoria') })
            }}
          />
          
          {/* Código Postal */}
          <InputWithLabel
            id="postalCode"
            label={t('Código Postal')}
            error={errors.postalCode && t(errors.postalCode.message || 'El código postal es obligatorio')}
            inputProps={{
              type: "text",
              ...register('postalCode', { required: t('El código postal es obligatorio') })
            }}
          />
          
          {/* País */}
          <InputWithLabel
            id="country"
            label={t('País')}
            error={errors.country && t(errors.country.message || 'El país es obligatorio')}
            inputProps={{
              type: "text",
              ...register('country', { required: t('El país es obligatorio') })
            }}
          />
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-between items-center">
          <div>
            {organizationData?.uuid && (            
              <ConfirmationTooltip
                confirmationMessage={t('¿Estás seguro de que deseas eliminar esta organización? Esta acción no se puede deshacer.')}
                onConfirm={deleteOrganization}
                confirmText={t('Eliminar')}
                confirmButtonClassName="bg-red-500 hover:bg-red-600"
                disabled={loading}
              >
                <ButtonLoader
                  type="button"
                  className={cn(
                    "btn bg-red-600 text-white hover:bg-red-700",
                  )}
                  disabled={loading}
                  loading={loading}
                  icon={<IconX className='w-5 h-5'/>}
                >
                  {t('Eliminar')}
                </ButtonLoader>
              </ConfirmationTooltip>
            )}
          </div>
            
          <div className="flex justify-end space-x-2 flex-grow">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline"
                disabled={loading}
              >
                {t('Cancelar')}
              </button>
            )}
            
            <ButtonLoader
              type="submit"
              disabled={loading}
              loading={loading}
              icon={<IconSave className='w-5 h-5'/>}
            >
              {organizationData?.uuid 
                ? t('Actualizar') 
                : t('Crear')
              }
            </ButtonLoader>
          </div>
        </div>
      </form>
      
      {/* Sección de usuarios (solo para organizaciones existentes) */}
      {organizationData?.uuid && (
        <OrganizationUsersTable organizationData={organizationData}/>
      )}
    </div>
  );
};

export default OrganizationForm;