import React, { useEffect,useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { 
  GetApiOrganizationUsersByOrganizationOrderEnum,
  Organization, 
  OrganizationCreate, 
  OrganizationsApi, 
  OrganizationUpdate, 
  OrganizationUser, 
  OrganizationUsersApi
} from '../../../../api-generated/api';
import { IconAdd, IconEdit, IconSave, IconUser, IconX } from '../../../../components/UI/Icons';
import ButtonLoader from '../../../../components/UI/molecules/ButtonLoder';
import { ConfirmationTooltip } from '../../../../components/UI/molecules/ConfirmationTooltip';
import InputWithLabel from '../../../../components/UI/molecules/InputWithLabel';
import { OffsetPanel } from '../../../../components/UI/organisms/OffsetPanel';
import { useApi } from '../../../../hooks/useApi';
import { cn } from '../../../../lib/utils';
import OrganizationUserForm from './OrganizationUserForm';

type FormValues = Omit<Organization, 'uuid'>

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
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  
  // Estado para los usuarios de la organización
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(null);
  const [isAddUserMode, setIsAddUserMode] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    totalRows: 0,
    perPage: 10
  });
  
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
  
  // Cargar usuarios de la organización
  const loadOrganizationUsers = async (page = 1) => {
    if (!organizationData?.uuid) {
      return;
    }
    
    setLoadingUsers(true);
    try {
      const response = await organizationUsersApi.call(
        'getApiOrganizationUsersByOrganization',
        organizationData.uuid,
        page,
        usersPagination.perPage,
        'user.name',
        GetApiOrganizationUsersByOrganizationOrderEnum.Asc
      );
      
      if (response.data.results && Array.isArray(response.data.results)) {
        setOrganizationUsers(response.data.results as OrganizationUser[]);
        setUsersPagination({
          ...usersPagination,
          page: response.data.page,
          totalRows: response.data.count || 0
        });
      }
    } catch (err) {
      console.error('Error al cargar usuarios de la organización:', err);
    } finally {
      setLoadingUsers(false);
    }
  };
  
  // Cargar usuarios cuando se está editando una organización existente
  useEffect(() => {
    if (organizationData?.uuid) {
      loadOrganizationUsers();
    }
  }, [organizationData?.uuid]);
  
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
  
  // Manejar cambios de página en la tabla
  const handlePageChange = (page: number) => {
    loadOrganizationUsers(page);
  };
  
  // Manejar cambios en registros por página
  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setUsersPagination({
      ...usersPagination,
      perPage: newPerPage
    });
    loadOrganizationUsers(page);
  };
  
  // Editar un usuario
  const handleEditUser = (user: OrganizationUser) => {
    setSelectedUser(user);
    setIsAddUserMode(false);
    setShowUserForm(true);
  };
  
  // Añadir un nuevo usuario
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddUserMode(true);
    setShowUserForm(true);
  };
  
  // Función que se llama cuando se completa una operación con usuarios
  const handleUserFormSuccess = () => {
    setShowUserForm(false);
    setSelectedUser(null);
    loadOrganizationUsers(usersPagination.page);
  };
  
  // Definición de columnas para DataTable
  const columns: TableColumn<OrganizationUser>[] = [
    {
      name: t('Usuario'),
      selector: row => {
        const user = row.user as any;
        return `${user?.name || ''} ${user?.lastName || ''}`;
      },
      sortable: true,
      grow: 2,
    },
    {
      name: t('Email'),
      selector: row => {
        const user = row.user as any;
        return user?.email || '';
      },
      sortable: true,
      grow: 2,
    },
    {
      name: t('Roles'),
      selector: row => {
        return Array.isArray(row.roles) 
          ? row.roles.map((role: string) => {
              switch(role) {
                case 'ROLE_ORG_ADMIN': return t('Administrador');
                case 'ROLE_ORG_EDITOR': return t('Editor');
                case 'ROLE_ORG_VIEWER': return t('Visualizador');
                default: return role;
              }
            }).join(', ')
          : '';
      },
    },
    {
      name: t('Acciones'),
      cell: row => {
        return (
          <div className="flex space-x-2">
          <OffsetPanel
            title={t('Editar usuario')}
            buttonIcon={IconEdit}
            panelId={`edit-organization-user-${row.id}`}
            persistState={false}
            defaultOpen={false}
          >
            <OrganizationUserForm
              id={Number(row.id)}
              organizationUserData={row}
              onSuccess={handleUserFormSuccess}
              onCancel={() => setShowUserForm(false)}
              defaultOrganizationId={organizationData?.uuid || undefined}
            />
          </OffsetPanel>
          </div>
        );
      },
      button: true,
      width: '100px',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl">      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
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
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <IconUser className="w-6 h-6" />
              {t('Usuarios de la organización')}
            </h2>
            
            <OffsetPanel
              title={isAddUserMode ? t('Añadir usuario') : t('Editar usuario')}
              position="right"
              buttonIcon={IconAdd}
              panelId="new-organization-user-form"
              buttonText={t('Añadir usuario')}
              persistState={false}
              defaultOpen={false}
            >
              <OrganizationUserForm
                id={selectedUser?.id ? Number(selectedUser.id) : undefined}
                organizationUserData={selectedUser || undefined}
                onSuccess={handleUserFormSuccess}
                onCancel={() => setShowUserForm(false)}
                defaultOrganizationId={organizationData?.uuid || undefined}
              />
            </OffsetPanel>
          </div>
          
          <DataTable
            columns={columns}
            data={organizationUsers}
            progressPending={loadingUsers}
            pagination
            paginationServer
            paginationTotalRows={usersPagination.totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            noDataComponent={<div className="p-4 text-center">{t('No hay usuarios asignados a esta organización')}</div>}
            persistTableHead
            className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </div>
      )}
    </div>
  );
};

export default OrganizationForm;