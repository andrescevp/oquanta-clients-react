import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

import { GetApiUsersListOrderEnum, User, UserBasic, UserList, UsersApi } from '../../api-generated/api';
import { Restricted } from '../../components/UI/atoms/Restricted';
import { IconAdd, IconEdit, IconRefresh } from '../../components/UI/Icons';
import { SearchButton } from '../../components/UI/molecules/SearchButton';
import { OffsetPanel } from '../../components/UI/organisms/OffsetPanel';
import { usePermission } from '../../context/PermissionContext';
import UserForm from '../../domain/admin/Users/components/UserForm';
import { useApi } from '../../hooks/useApi';



// Componente principal de la página de usuarios
const UsersPage: React.FC = () => {
  const {t} = useTranslation();
  const usersApi = useApi(UsersApi);
  const [userList, setUserList] = useState<UserList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('email');
  const [sortOrder, setSortOrder] = useState<GetApiUsersListOrderEnum>(GetApiUsersListOrderEnum.Asc);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { hasRole } = usePermission();

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
        sortOrder
      );
      setUserList(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al iniciar y cuando cambien los parámetros
  useEffect(() => {
    console.log('Cargando usuarios...');
    const timer = setTimeout(() => {
      loadUsers();
    }, 200);
    return () => clearTimeout(timer);
  }, [currentPage, rowsPerPage, sortField, sortOrder]);

  // Manejar búsqueda con debounce
  useEffect(() => {
    console.log('Buscando usuarios...');
    const timer = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Manejar cambio de ordenamiento
  const handleSort = (column: TableColumn<UserBasic>, sortDirection: string) => {
    if (!column.sortable || !column.sortField) {
      return;
    }
    setSortField(column.sortField);
    setSortOrder(sortDirection.toUpperCase() === 'DESC' ? GetApiUsersListOrderEnum.Desc : GetApiUsersListOrderEnum.Asc);
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
      ...[(hasRole('ROLE_ADMIN') || hasRole('ROLE_SUPER_ADMIN')) ? {  
        name: t('Actions'),
        cell: (row: User) => (
          <OffsetPanel
            buttonPosition="inline" 
            buttonClassName="p-2 text-gray-500 hover:text-blue-600 transition-colors !bg-transparent border rounded shadow"
            buttonText={""}
            title={t('Editar usuario')}
            buttonIcon={IconEdit}
            buttonIconClassName="w-5 h-5"
          >
            <UserForm userData={row} onSuccess={loadUsers} />
          </OffsetPanel>
        ),
        selector: (row: User) => row.uuid || '',  
        } : {}],
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
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
      </div>

      <div className="mb-4 flex justify-start items-center space-x-1">
        <button 
          className="btn"
          onClick={loadUsers}
          title="Actualizar"
        >
          <IconRefresh size={20} />
        </button>
        <Restricted roles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
          <OffsetPanel 
            buttonPosition="inline" 
            buttonClassName="btn"
            buttonText={""}
            title={t('Crear usuario')}
            buttonIcon={IconAdd}
            buttonIconClassName="w-5 h-5"
            >
              <UserForm onSuccess={loadUsers} />
          </OffsetPanel>
        </Restricted>
        <div className="relative w-full max-w-md">
        <SearchButton
            value={search}
            onChange={setSearch}
            placeholder={t('Buscar usuarios...')}
            onSubmit={loadUsers}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <DataTable<UserBasic>
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
          noDataComponent={<div className="p-4 text-center text-gray-500">{t('No hay usuarios disponibles')}</div>}
        />
      </div>
    </div>
  );
};

export default UsersPage;