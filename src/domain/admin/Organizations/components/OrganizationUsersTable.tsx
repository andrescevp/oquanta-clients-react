import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import Select, { ClassNamesConfig, MultiValue } from 'react-select';

import {
    GetApiOrganizationUsersByOrganizationOrderEnum,
    Organization,
    OrganizationUser,
    OrganizationUsersApi,
    OrganizationUserUpdate,
} from '../../../../api-generated/api';
import Button from '../../../../components/UI/atoms/Button';
import { IconAdd, IconEdit, IconTrash, IconUser, IconX } from '../../../../components/UI/Icons';
import { ConfirmationTooltip } from '../../../../components/UI/molecules/ConfirmationTooltip';
import { OffsetPanel } from '../../../../components/UI/organisms/OffsetPanel';
import darkSelectClassNames from '../../../../components/UI/ReactSelectTheme';
import { useApi } from '../../../../hooks/useApi';
import { useTheme } from '../../../../hooks/useTheme';
import { SelectOption } from '../../../../types/shared';
import OrganizationUserForm, { ORGANIZATION_ROLES } from './OrganizationUserForm';

type FormValues = Omit<Organization, 'uuid'>;
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
const OrganizationUsersTable: React.FC<OrganizationFormProps> = ({ uuid, organizationData, onSuccess, onCancel }) => {
    const { t } = useTranslation();
    const organizationUsersApi = useApi(OrganizationUsersApi);
    const [error, setError] = useState<string | null>(null);
    const { isDark } = useTheme();

    // Estado para los usuarios de la organización
    const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(null);
    const [isAddUserMode, setIsAddUserMode] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingRolesForId, setEditingRolesForId] = useState<number | null>(null);
    const [usersPagination, setUsersPagination] = useState({
        page: 1,
        totalRows: 0,
        perPage: 10,
    });

    // Cargar usuarios de la organización
    const loadOrganizationUsers = async (page = 1) => {
        if (!organizationData?.uuid) {
            return;
        }

        try {
            const response = await organizationUsersApi.call(
                'getApiOrganizationUsersByOrganization',
                organizationData.uuid,
                page,
                usersPagination.perPage,
                'user.name',
                GetApiOrganizationUsersByOrganizationOrderEnum.Asc,
            );

            if (response.data.results && Array.isArray(response.data.results)) {
                setOrganizationUsers(response.data.results as OrganizationUser[]);
                setUsersPagination({
                    ...usersPagination,
                    page: response.data.page,
                    totalRows: response.data.count || 0,
                });
            }
        } catch (err) {
            console.error('Error al cargar usuarios de la organización:', err);
        }
    };

    // Cargar usuarios cuando se está editando una organización existente
    useEffect(() => {
        loadOrganizationUsers();
    }, [organizationData]);

    // Manejar cambios de página en la tabla
    const handlePageChange = (page: number) => {
        loadOrganizationUsers(page);
    };

    // Manejar cambios en registros por página
    const handlePerRowsChange = async (newPerPage: number, page: number) => {
        setUsersPagination({
            ...usersPagination,
            perPage: newPerPage,
        });
        loadOrganizationUsers(page);
    };

    // Función que se llama cuando se completa una operación con usuarios
    const handleUserFormSuccess = () => {
        setShowUserForm(false);
        setSelectedUser(null);
        loadOrganizationUsers(usersPagination.page);
    };

    // Función para actualizar los roles de un usuario
    const handleUpdateRoles = async (userId: number, newRoles: string[]) => {
        try {
            const updateData: OrganizationUserUpdate = {
                roles: newRoles,
            };

            await organizationUsersApi.call('putApiOrganizationUsersUpdate', String(userId), updateData);

            // Actualizar el estado local
            setOrganizationUsers(prev => prev.map(user => (user.id === userId ? { ...user, roles: newRoles } : user)));

            setEditingRolesForId(null);
        } catch (err) {
            console.error('Error al actualizar los roles:', err);
            setError(t('No se pudieron actualizar los roles del usuario'));
        }
    };

    // Función para eliminar un usuario de la organización
    const handleDeleteUser = async (userId: number) => {
        try {
            await organizationUsersApi.call('deleteApiOrganizationUsersDelete', String(userId));
            // Recargar la lista de usuarios
            loadOrganizationUsers(usersPagination.page);
        } catch (err) {
            console.error('Error al eliminar usuario de la organización:', err);
            setError(t('No se pudo eliminar el usuario de la organización'));
        }
    };

    // Función para obtener las opciones de roles seleccionadas para un usuario
    const getUserRoleOptions = (roles: any[] | null): RoleOption[] => {
        if (!roles || !Array.isArray(roles)) return [];

        return roles.map(role => {
            const option = ORGANIZATION_ROLES.find(opt => opt.value === role);
            return option || { value: String(role), label: String(role) };
        });
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
            cell: row => {
                // Si estamos editando este usuario, mostrar selector de roles
                if (editingRolesForId === row.id) {
                    return (
                        <div className='flex items-center justify-between w-full space-x-2'>
                            <div className='flex-grow'>
                                <Select<SelectOption, true>
                                    isMulti
                                    options={ORGANIZATION_ROLES as SelectOption[]}
                                    defaultValue={getUserRoleOptions(row.roles || null)}
                                    onChange={(newValue: MultiValue<SelectOption>) => {
                                        const newRoles = newValue.map(option => option.value);
                                        handleUpdateRoles(Number(row.id), newRoles);
                                    }}
                                    classNames={darkSelectClassNames as ClassNamesConfig<SelectOption, true>}
                                />
                            </div>
                            <div className='flex justify-end'>
                                <Button className='btn btn-outline' onClick={() => setEditingRolesForId(null)}>
                                    <IconX className='w-4 h-4' />
                                </Button>
                            </div>
                        </div>
                    );
                }

                // Mostrar roles como texto y botón de edición
                return (
                    <div className='flex items-center justify-between w-full'>
                        <span>
                            {Array.isArray(row.roles)
                                ? row.roles
                                      .map((role: string) => {
                                          switch (role) {
                                              case 'ROLE_ORG_ADMIN':
                                                  return t('Administrador');
                                              case 'ROLE_ORG_EDITOR':
                                                  return t('Editor');
                                              case 'ROLE_ORG_VIEWER':
                                                  return t('Visualizador');
                                              default:
                                                  return role;
                                          }
                                      })
                                      .join(', ')
                                : ''}
                        </span>
                        <span>
                            <Button
                                onClick={() => setEditingRolesForId(Number(row.id))}
                                className='btn btn-outline'
                                aria-label={t('Editar roles')}>
                                <IconEdit className='w-4 h-4' />
                            </Button>
                        </span>
                    </div>
                );
            },
            width: '300px',
        },
        {
            name: t('Acciones'),
            cell: row => {
                return (
                    <div className='flex space-x-2'>
                        <ConfirmationTooltip
                            confirmationMessage={t('¿Estás seguro de eliminar este usuario de la organización?')}
                            onConfirm={() => handleDeleteUser(Number(row.id))}
                            confirmText={t('Eliminar')}
                            confirmButtonClassName='bg-red-500 hover:bg-red-600'>
                            <Button
                                className='btn hover:!border-red-500 hover:!text-red-500'
                                aria-label={t('Eliminar usuario')}>
                                <IconTrash className='w-4 h-4' />
                            </Button>
                        </ConfirmationTooltip>
                    </div>
                );
            },
            button: true,
            width: '100px',
        },
    ];

    return (
        <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200'>
                    <IconUser className='w-6 h-6' />
                    {t('Usuarios de la organización')}
                </h2>

                <OffsetPanel
                    title={isAddUserMode ? t('Añadir usuario') : t('Editar usuario')}
                    position='right'
                    buttonIcon={IconAdd}
                    panelId='new-organization-user-form'
                    buttonText={t('Añadir usuario')}
                    persistState={false}
                    defaultOpen={false}>
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
                theme={isDark ? 'dark' : undefined}
                data={organizationUsers}
                progressPending={organizationUsersApi.isLoading}
                pagination
                paginationServer
                paginationTotalRows={usersPagination.totalRows}
                onChangePage={handlePageChange}
                paginationDefaultPage={usersPagination.page}
                onChangeRowsPerPage={handlePerRowsChange}
                noDataComponent={
                    <div className='p-4 text-center'>{t('No hay usuarios asignados a esta organización')}</div>
                }
                persistTableHead
                className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700'
            />
        </div>
    );
};

export default OrganizationUsersTable;
