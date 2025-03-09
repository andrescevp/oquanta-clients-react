import React, { useEffect, useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import { toast } from 'sonner';

import { 
  OrganizationBasic,
  OrganizationsApi,
  OrganizationUser, 
  OrganizationUserCreate, 
  OrganizationUsersApi,
  OrganizationUserUpdate, 
  UserBasic,
  UsersApi} from '../../../../api-generated/api';
import { IconSave, IconX } from '../../../../components/UI/Icons';
import ButtonLoader from '../../../../components/UI/molecules/ButtonLoder';
import { ConfirmationTooltip } from '../../../../components/UI/molecules/ConfirmationTooltip';
import darkSelectClassNames from '../../../../components/UI/ReactSelectTheme';
import { useApi } from '../../../../hooks/useApi';
import { cn } from '../../../../lib/utils';
import { SelectOption } from '../../../../types/shared';

// Opciones para roles que puede tener un usuario en una organización
export const ORGANIZATION_ROLES: SelectOption[] = [
    { value: 'ROLE_OWNER', label: 'Owner' },
];

// Interfaces para las opciones de selección
interface UserOption {
  value: string;
  label: string;
}

interface OrganizationOption {
  value: string;
  label: string;
}

interface RoleOption {
  value: string;
  label: string;
}

type FormValues = {
  user: UserOption | null;
  organization: OrganizationOption | null;
  roles: RoleOption[];
}

interface OrganizationUserFormProps {
  id?: number;
  organizationUserData?: OrganizationUser;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultOrganizationId?: string;
  defaultUserId?: string;
}

/**
 * Form component for creating and editing organization-user relationships
 */
const OrganizationUserForm: React.FC<OrganizationUserFormProps> = ({ 
  id,
  organizationUserData,
  onSuccess,
  onCancel,
  defaultOrganizationId,
  defaultUserId
}) => {
  const { t } = useTranslation();
  const organizationUsersApi = useApi(OrganizationUsersApi);
  const organizationsApi = useApi(OrganizationsApi);
  const usersApi = useApi(UsersApi);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [organizationOptions, setOrganizationOptions] = useState<OrganizationOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState({ users: false, organizations: false });
  
  // Form setup with react-hook-form
  const { 
    control, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: {
      user: null,
      organization: null,
      roles: organizationUserData?.roles || []
    }
  });
  
  // Cargar usuarios para el selector
  const loadUsers = async () => {
    setLoadingOptions(prev => ({ ...prev, users: true }));
    try {
      const response = await usersApi.call('getApiUsersList', 1, 100);
      if (response.data.results && Array.isArray(response.data.results)) {
        const users = response.data.results as UserBasic[];
        const options = users.map(user => ({
          value: user.uuid || '',
          label: `${user.name || ''} ${user.lastName || ''} (${user.email || ''})`
        }));
        setUserOptions(options);
      }
    } catch (e) {
      console.error('Error al cargar usuarios:', e);
    } finally {
      setLoadingOptions(prev => ({ ...prev, users: false }));
    }
  };
  
  // Cargar organizaciones para el selector
  const loadOrganizations = async () => {
    setLoadingOptions(prev => ({ ...prev, organizations: true }));
    try {
      const response = await organizationsApi.call('getApiOrganizationsList', 1, 100);
      if (response.data.results && Array.isArray(response.data.results)) {
        const organizations = response.data.results as OrganizationBasic[];
        const options = organizations.map(org => ({
          value: org.uuid || '',
          label: org.name || ''
        }));
        setOrganizationOptions(options);
      }
    } catch (e) {
      console.error('Error al cargar organizaciones:', e);
    } finally {
      setLoadingOptions(prev => ({ ...prev, organizations: false }));
    }
  };
  
  // Cargar datos iniciales
  useEffect(() => {
    loadUsers();
    loadOrganizations();
  }, []);
  
  // Configurar valores predeterminados cuando los datos estén disponibles
  // eslint-disable-next-line complexity
  useEffect(() => {
    if (organizationUserData) {
      // Configurar usuario si está disponible
      if (organizationUserData.user && typeof organizationUserData.user === 'object') {
        const user = organizationUserData.user as any;
        if (user.uuid) {
          setValue('user', {
            value: user.uuid,
            label: `${user.name || ''} ${user.lastName || ''} (${user.email || ''})`
          });
        }
      }
      
      // Configurar organización si está disponible
      if (organizationUserData.organization && typeof organizationUserData.organization === 'object') {
        const org = organizationUserData.organization as any;
        if (org.uuid) {
          setValue('organization', {
            value: org.uuid,
            label: org.name || ''
          });
        }
      }
      
      // Configurar roles si están disponibles
      if (organizationUserData.roles && Array.isArray(organizationUserData.roles)) {
        const selectedRoles = organizationUserData.roles
          .map(role => {
            const roleOption = ORGANIZATION_ROLES.find(option => option.value === role);
            return roleOption || null;
          })
          .filter(Boolean) as RoleOption[];
          
        setValue('roles', selectedRoles);
      }
    } else {
      // Configurar valores predeterminados para nueva relación usuario-organización
      if (defaultOrganizationId) {
        const defaultOrg = organizationOptions.find(org => org.value === defaultOrganizationId);
        if (defaultOrg) {
          setValue('organization', defaultOrg);
        }
      }
      
      if (defaultUserId) {
        const defaultUser = userOptions.find(user => user.value === defaultUserId);
        if (defaultUser) {
          setValue('user', defaultUser);
        }
      }
    }
  }, [organizationUserData, organizationOptions, userOptions, defaultOrganizationId, defaultUserId, setValue]);
  
  // Manejar envío del formulario
  const onSubmit = async (data: FormValues) => {
    if (!data.user || !data.organization) {
      setError(t('Se requiere seleccionar un usuario y una organización'));
      return;
    }
    
    if (!data.roles || data.roles.length === 0) {
      setError(t('Se debe asignar al menos un rol'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const roleValues = data.roles.map(role => role.value);
      
      if (id) {
        // Actualizar relación usuario-organización existente
        const updateData: OrganizationUserUpdate = {
          roles: roleValues
        };
        await organizationUsersApi.call('putApiOrganizationUsersUpdate', String(id), updateData);
        toast(t('Usuario de organización actualizado correctamente'));
      } else {
        // Crear nueva relación usuario-organización
        const createData: OrganizationUserCreate = {
          userUuid: data.user.value,
          organizationUuid: data.organization.value,
          roles: roleValues
        };
        await organizationUsersApi.call('postApiOrganizationUsersCreate', createData);
        toast(t('Usuario de organización creado correctamente'));
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error al guardar usuario de organización:', err);
      setError(
        err.response?.data?.message || 
        t('No se pudo guardar la información del usuario de organización')
      );
    } finally {
      setLoading(false);
    }
  };

  // Eliminar relación usuario-organización
  const handleDelete = async () => {
    if (!id) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await organizationUsersApi.call('deleteApiOrganizationUsersDelete', String(id));
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error al eliminar relación usuario-organización:', err);
      setError(
        err.response?.data?.message || 
        t('No se pudo eliminar la relación usuario-organización')
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-2xl">      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-500/60 dark:text-red-400">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('Usuario')}
          </label>
          <Controller
            name="user"
            control={control}
            rules={{ required: t('El usuario es obligatorio') }}
            render={({ field }) => (
              <Select
                {...field}
                classNames={darkSelectClassNames}
                options={userOptions}
                isLoading={loadingOptions.users}
                placeholder={t('Seleccionar usuario...')}
                noOptionsMessage={() => t('No hay usuarios disponibles')}
                className={cn(
                  errors.user && "border-red-500 ring-1 ring-red-500 rounded-md"
                )}
                isDisabled={!!id} // Deshabilitar si estamos editando
              />
            )}
          />
          {errors.user && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.user.message}</p>
          )}
        </div>
        
        {/* Organización */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('Organización')}
          </label>
          <Controller
            name="organization"
            control={control}
            rules={{ required: t('La organización es obligatoria') }}
            render={({ field }) => (
              <Select
                {...field}
                classNames={darkSelectClassNames}
                options={organizationOptions}
                isLoading={loadingOptions.organizations}
                placeholder={t('Seleccionar organización...')}
                noOptionsMessage={() => t('No hay organizaciones disponibles')}
                className={cn(
                  errors.organization && "border-red-500 ring-1 ring-red-500 rounded-md"
                )}
                isDisabled={!!id || !!defaultOrganizationId} // Deshabilitar si estamos editando o si hay una organización predeterminada
              />
            )}
          />
          {errors.organization && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.organization.message}</p>
          )}
        </div>
        
        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('Roles')}
          </label>
          <Controller
            name="roles"
            control={control}
            rules={{ required: t('Al menos un rol es obligatorio') }}
            render={({ field }) => (
              <Select
                {...field}
                classNames={darkSelectClassNames}
                options={ORGANIZATION_ROLES}
                isMulti
                placeholder={t('Seleccionar roles...')}
                noOptionsMessage={() => t('No hay roles disponibles')}
                className={cn(
                  errors.roles && "border-red-500 ring-1 ring-red-500 rounded-md"
                )}
              />
            )}
          />
          {errors.roles && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.roles.message}</p>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-4">
          <div>
            {id && (            
              <ConfirmationTooltip
                confirmationMessage={t('¿Estás seguro de que deseas eliminar esta relación usuario-organización? Esta acción no se puede deshacer.')}
                onConfirm={handleDelete}
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
              {id ? t('Actualizar') : t('Crear')}
            </ButtonLoader>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrganizationUserForm;