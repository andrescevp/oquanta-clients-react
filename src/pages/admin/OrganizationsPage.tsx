import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

import { GetApiOrganizationsListOrderEnum, Organization, OrganizationBasic, OrganizationList, OrganizationsApi } from '../../api-generated/api';
import { Restricted } from '../../components/UI/atoms/Restricted';
import { IconAdd, IconEdit, IconRefresh } from '../../components/UI/Icons';
import { SearchButton } from '../../components/UI/molecules/SearchButton';
import { OffsetPanel } from '../../components/UI/organisms/OffsetPanel';
import { usePermission } from '../../context/PermissionContext';
import OrganizationForm from '../../domain/admin/Organizations/components/OrganizationForm';
import { useApi } from '../../hooks/useApi';

/**
 * Component for managing organizations
 */
const OrganizationsPage: React.FC = () => {
  const { t } = useTranslation();
  const organizationsApi = useApi(OrganizationsApi);
  const [organizationList, setOrganizationList] = useState<OrganizationList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<GetApiOrganizationsListOrderEnum>(GetApiOrganizationsListOrderEnum.Asc);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { hasRole } = usePermission();

  // Cargar lista de organizaciones
  const loadOrganizations = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await organizationsApi.call(
        'getApiOrganizationsList',
        currentPage,
        rowsPerPage,
        search || undefined,
        sortField,
        sortOrder
      );
      setOrganizationList(response.data);
    } catch (error) {
      console.error('Error al cargar organizaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar organizaciones al iniciar y cuando cambien los parámetros
  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrganizations();
    }, search !== null ? 500 : 200);
    return () => clearTimeout(timer);
  }, [currentPage, rowsPerPage, sortField, sortOrder, search]);

  // Manejar cambio de ordenamiento
  const handleSort = (column: TableColumn<OrganizationBasic>, sortDirection: string) => {
    if (!column.sortable || !column.sortField) {
      return;
    }
    setSortField(column.sortField);
    setSortOrder(sortDirection.toUpperCase() === 'DESC' ? GetApiOrganizationsListOrderEnum.Desc : GetApiOrganizationsListOrderEnum.Asc);
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

  // Columnas para la tabla de organizaciones
  const columns: TableColumn<OrganizationBasic>[] = [
    ...[(hasRole('ROLE_ADMIN') || hasRole('ROLE_SUPER_ADMIN')) ? {  
      name: t('Acciones'),
      cell: (row: Organization) => (
        <OffsetPanel
          buttonPosition="inline" 
          buttonClassName="p-2 text-gray-500 hover:text-blue-600 transition-colors !bg-transparent border rounded shadow"
          buttonText={""}
          title={t('Editar organización')}
          buttonIcon={IconEdit}
          buttonIconClassName="w-5 h-5"
          panelId={`organization_${row.uuid}`}
        >
          <OrganizationForm organizationData={row} onSuccess={loadOrganizations} />
        </OffsetPanel>
      ),
      selector: (row: Organization) => row.uuid || '',  
    } : {}],
    {
      name: t('Nombre'),
      selector: (row: Organization) => row.name || '',
      sortable: true,
      sortField: 'name',
    },
    {
      name: t('ID Legal / CIF'),
      selector: (row: Organization) => row.legalId || '',
      sortable: true,
      sortField: 'legalId',
    },
    {
      name: t('Email'),
      selector: (row: Organization) => row.contactEmail || '',
    },
    {
      name: t('Ciudad'),
      selector: (row: Organization) => row.city || '',
    },
    {
      name: t('País'),
      selector: (row: Organization) => row.country || '',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('Gestión de Organizaciones')}</h1>
      </div>

      <div className="mb-4 flex justify-start items-center space-x-1">
        <button 
          className="btn"
          onClick={loadOrganizations}
          title={t('Actualizar')}
        >
          <IconRefresh size={20} />
        </button>
        <Restricted roles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
          <OffsetPanel 
            buttonPosition="inline" 
            buttonClassName="btn"
            buttonText={""}
            title={t('Crear organización')}
            buttonIcon={IconAdd}
            buttonIconClassName="w-5 h-5"
            panelId='new_organization'
          >
            <OrganizationForm onSuccess={loadOrganizations} />
          </OffsetPanel>
        </Restricted>
        <div className="relative w-full max-w-md">
          <SearchButton
            value={search}
            onChange={setSearch}
            placeholder={t('Buscar organizaciones...')}
            onSubmit={loadOrganizations}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <DataTable<OrganizationBasic>
          columns={columns}
          data={organizationList?.results || []}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={organizationList?.count || 0}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          sortServer
          onSort={handleSort}
          defaultSortFieldId={sortField}
          defaultSortAsc={sortOrder === GetApiOrganizationsListOrderEnum.Asc}
          paginationDefaultPage={currentPage}
          noDataComponent={<div className="p-4 text-center text-gray-500">{t('No hay organizaciones disponibles')}</div>}
        />
      </div>
    </div>
  );
};

export default OrganizationsPage;