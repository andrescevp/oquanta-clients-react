import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

import { GetApiUsersListOrderEnum, User, UserList, UsersApi } from '../../api-generated/api';
import { Restricted } from '../../components/UI/atoms/Restricted';
import { IconAdd, IconRefresh, IconSearch } from '../../components/UI/Icons';
import { OffsetPanel } from '../../components/UI/organisms/OffsetPanel';
import UserForm from '../../domain/admin/Users/components/UserForm';
import { useApi } from '../../hooks/useApi';

// Columnas para la tabla de usuarios
const columns = [
  {
    name: 'Nombre',
    selector: (row: User) => `${row.name || ''} ${row.lastName || ''}`,
    sortable: true,
    sortField: 'name',
  },
  {
    name: 'Email',
    selector: (row: User) => row.email || '',
    sortable: true,
    sortField: 'email',
  },
  {
    name: 'Roles',
    selector: (row: User) => {
      if (!row.roles || row.roles.length === 0) return '-';
      return row.roles.join(', ');
    },
  },
];

// Componente principal de la página de usuarios
const UsersPage: React.FC = () => {
  const {t} = useTranslation();
  const usersApi = useApi(UsersApi);
  const [userList, setUserList] = useState<UserList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<GetApiUsersListOrderEnum>(GetApiUsersListOrderEnum.Asc);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Cargar lista de usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
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
    loadUsers();
  }, [currentPage, rowsPerPage, sortField, sortOrder]);

  // Manejar búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Manejar cambio de ordenamiento
  const handleSort = (column: any, sortDirection: string) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Restricted roles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
          <OffsetPanel 
          buttonPosition="inline" 
          buttonText={t('Crear usuario')}
          title={t('Crear usuario')}
          buttonIcon={IconAdd}
          >
            <UserForm onSuccess={loadUsers} />
          </OffsetPanel>
        </Restricted>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          onClick={loadUsers}
          title="Actualizar"
        >
          <IconRefresh size={20} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <DataTable
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
          noDataComponent={<div className="p-4 text-center text-gray-500">No hay usuarios disponibles</div>}
        />
      </div>
    </div>
  );
};

export default UsersPage;