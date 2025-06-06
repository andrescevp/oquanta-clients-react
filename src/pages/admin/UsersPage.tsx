import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

import { GetApiUsersListOrderEnum, User, UserBasic, UserList, UsersApi } from '../../api-generated/api';
import { Restricted } from '../../components/UI/atoms/Restricted';
import { IconAdd, IconRefresh } from '../../components/UI/Icons';
import { SearchButton } from '../../components/UI/molecules/SearchButton';
import { usePermission } from '../../context/PermissionContext';
import UserForm from '../../domain/admin/Users/components/UserForm';
import { useApi } from '../../hooks/useApi';
import useOffsetPanelCreator from '../../hooks/useOffsetPanelCreator';
import { useTheme } from '../../hooks/useTheme';

// Componente principal de la página de usuarios
const UsersPage: React.FC = () => {
    const { t } = useTranslation();
    const usersApi = useApi(UsersApi);
    const [userList, setUserList] = useState<UserList | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string>('email');
    const [sortOrder, setSortOrder] = useState<GetApiUsersListOrderEnum>(GetApiUsersListOrderEnum.Asc);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const { hasRole } = usePermission();
    const { isDark } = useTheme();

    // Cargar lista de usuarios
    const loadUsers = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const response = await usersApi.call(
                'getApiUsersList',
                currentPage,
                rowsPerPage,
                search || undefined,
                sortField,
                sortOrder,
            );
            setUserList(response.data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        } finally {
            setLoading(false);
        }
    };
    
    
    const newUserPanel = useOffsetPanelCreator({
        title: 'New User',
        position: 'right',
        buttonIcon: IconAdd,
        buttonClassName: 'btn btn-outline',
        panelId: 'new-user-panel',
        persistState: false,
        defaultOpen: false,
        children: <UserForm onSuccess={() => {
            loadUsers();
            newUserPanel.closePanel();
        }} />
    });
    
    
    const editUserPanel = useOffsetPanelCreator({
        title: 'Edit User',
        position: 'right',
        defaultOpen: false,
        persistState: false,
    });

    // Combinar los dos efectos en uno solo
    useEffect(() => {
        console.log('Cambio en parámetros de búsqueda o paginación...');
        const timer = setTimeout(
            () => {
                loadUsers();
            },
            search !== null ? 500 : 200,
        ); // Usa un tiempo más largo para búsquedas

        return () => clearTimeout(timer);
    }, [currentPage, rowsPerPage, sortField, sortOrder, search]);

    // Manejar cambio de ordenamiento
    const handleSort = (column: TableColumn<UserBasic>, sortDirection: string) => {
        if (!column.sortable || !column.sortField) {
            return;
        }
        setSortField(column.sortField);
        setSortOrder(
            sortDirection.toUpperCase() === 'DESC' ? GetApiUsersListOrderEnum.Desc : GetApiUsersListOrderEnum.Asc,
        );
    };

    // Manejar cambio de página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Manejar cambio de filas por página
    const handlePerRowsChange = (newPerPage: number) => {
        setRowsPerPage(newPerPage);
        setCurrentPage(1);
    };
    // Columnas para la tabla de usuarios
    const columns: TableColumn<UserBasic>[] = [
        {
            name: t('Nombre'),
            selector: (row: User) => `${row.name || ''} ${row.lastName || ''}`,
            sortable: true,
            sortField: 'name',
        },
        {
            name: t('Email'),
            selector: (row: User) => row.email || '',
            sortable: true,
            sortField: 'email',
        },
        {
            name: t('Roles'),
            selector: (row: User) => {
                if (!row.roles || row.roles.length === 0) return '-';
                return row.roles.join(', ');
            },
            cell: (row: User) => {
                if (!row.roles || row.roles.length === 0) return '-';
                return row.roles.map((role) => (
                    <span key={role} className='badge badge-primary mr-1 p-1 bg-blue-400 rounded dark:text-dark-800 truncate' title={role}>
                        {role}
                    </span>
                ));
            }
        },
    ];

    return (
        <div className='container mx-auto px-4 py-8'>
            {editUserPanel.renderPanel()}
            <div className='mb-6 flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Gestión de Usuarios</h1>
            </div>
            <div className='mb-4 flex justify-end items-center space-x-1'>
                <div className='relative w-full max-w-md'>
                    <SearchButton
                        expandDirection='left'
                        value={search}
                        onChange={setSearch}
                        placeholder={t('Buscar usuarios...')}
                        onSubmit={loadUsers}
                    />
                </div>
                <Restricted roles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                    {newUserPanel.renderPanelButton()}
                </Restricted>
                <button className='btn btn-outline' onClick={loadUsers} title='Actualizar'>
                    <IconRefresh size={20} />
                </button>
            </div>

            <div className='rounded-t shadow-md'>
                <DataTable<UserBasic>
                    theme={isDark ? 'dark' : undefined}
                    columns={columns}
                    data={userList?.results || []}
                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={userList?.count || 0}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    sortServer
                    onSort={handleSort}
                    defaultSortFieldId={sortField}
                    defaultSortAsc={sortOrder === GetApiUsersListOrderEnum.Asc}
                    paginationDefaultPage={currentPage}
                    noDataComponent={
                        <div className='p-4 text-center text-gray-500'>{t('No hay usuarios disponibles')}</div>
                    }
                    highlightOnHover
                    pointerOnHover
                    striped
                    dense
                    onRowClicked={(row) => {
                        if (!hasRole('ROLE_ADMIN') || !hasRole('ROLE_SUPER_ADMIN')) {
                            return;
                        }
                        if (editUserPanel.isOpen) {
                            editUserPanel.closePanel();
                        } else {
                            editUserPanel.openPanel();
                        }
                        editUserPanel.setContent(
                            <UserForm userData={row} onSuccess={loadUsers} />,
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default UsersPage;
