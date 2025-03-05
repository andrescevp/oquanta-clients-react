import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import AsyncSelect from 'react-select/async';

import { GetApiOrganizationPlacesListOrderEnum, Organization, OrganizationPlace, OrganizationPlaceBasic, OrganizationPlaceList, OrganizationPlacesApi, OrganizationsApi } from '../../api-generated/api';
import { Restricted } from '../../components/UI/atoms/Restricted';
import { IconAdd, IconEdit, IconRefresh } from '../../components/UI/Icons';
import { SearchButton } from '../../components/UI/molecules/SearchButton';
import { OffsetPanel } from '../../components/UI/organisms/OffsetPanel';
import { usePermission } from '../../context/PermissionContext';
import OrganizationPlaceForm from '../../domain/admin/LocalBusiness/components/OrganizationPlaceForm';
import { useApi } from '../../hooks/useApi';

interface OrganizationOption {
  value: string;
  label: string;
}


  // Memoized component for organization name cell
const OrganizationNameCell = React.memo(({ organizationUuid, organizationsCache, getOrganizationName }: {
    organizationUuid: string | undefined;
    organizationsCache: Map<string, Organization>;
    getOrganizationName: (uuid: string) => Promise<string>;
  }) => {
    const { t } = useTranslation();
    const [orgName, setOrgName] = useState<string>('');
        
    useEffect(() => {
      if (organizationUuid) {
        if (organizationsCache.has(organizationUuid)) {
          setOrgName(organizationsCache.get(organizationUuid)?.name || '');
        } else {
          getOrganizationName(organizationUuid).then(setOrgName);
        }
      }
    }, [organizationUuid, organizationsCache, getOrganizationName]);
        
    return <>{orgName || t('Cargando...')}</>;
  });

OrganizationNameCell.displayName = 'OrganizationNameCell';

/**
 * Component for managing organization places (establishments)
 */
const OrganizationPlacesPage: React.FC = () => {
  const { t } = useTranslation();
  const organizationPlacesApi = useApi(OrganizationPlacesApi);
  const organizationsApi = useApi(OrganizationsApi);
  const [placesList, setPlacesList] = useState<OrganizationPlaceList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<GetApiOrganizationPlacesListOrderEnum>(GetApiOrganizationPlacesListOrderEnum.Asc);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationOption | null>(null);
  const [organizationsCache, setOrganizationsCache] = useState<Map<string, Organization>>(new Map());
  const { hasRole } = usePermission();

  // Cargar y cachear organización cuando se necesite
  const getOrganizationName = async (uuid: string): Promise<string> => {
    if (organizationsCache.has(uuid)) {
      return organizationsCache.get(uuid)?.name || '';
    }
    
    try {
      const response = await organizationsApi.call('getApiOrganizationsGet', uuid);
      if (response.data) {
        const org = response.data;
        setOrganizationsCache(prev => {
          const newCache = new Map(prev);
          newCache.set(uuid, org);
          return newCache;
        });
        return org.name || '';
      }
    } catch (error) {
      console.error(`Error al cargar organización ${uuid}:`, error);
    }
    
    return '';
  };

  // Función para cargar opciones de organizaciones asíncronamente
  const loadOrganizationOptions = async (inputValue: string): Promise<OrganizationOption[]> => {
    try {
      const response = await organizationsApi.call(
        'getApiOrganizationsList', 
        1, 
        20, 
        inputValue.length > 0 ? inputValue : undefined
      );
      
      if (response.data.results && Array.isArray(response.data.results)) {
        const orgs = response.data.results as Organization[];
        
        // Actualizar caché de organizaciones
        orgs.forEach(org => {
          if (org.uuid) {
            setOrganizationsCache(prev => {
              const newCache = new Map(prev);
              newCache.set(org.uuid || '', org);
              return newCache;
            });
          }
        });
        
        return orgs
          .map(org => ({
            value: org.uuid || '',
            label: org.name || ''
          }))
          .filter(option => option.value !== '');
      }
      
      return [];
    } catch (err) {
      console.error('Error al cargar opciones de organizaciones:', err);
      return [];
    }
  };

  // Cargar lista de establecimientos
  const loadPlaces = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await organizationPlacesApi.call(
        'getApiOrganizationPlacesList',
        currentPage,
        rowsPerPage,
        search || undefined,
        sortField,
        sortOrder,
        selectedOrganization?.value || undefined
      );
      setPlacesList(response.data);
      
      // Precargar nombres de organizaciones para la lista
      if (response.data.results && Array.isArray(response.data.results)) {
        const places = response.data.results as OrganizationPlace[];
        const uniqueOrgIds = Array.from(new Set(places.map(place => place.organizationUuid).filter(Boolean)));
        
        uniqueOrgIds.forEach(uuid => {
          if (uuid && !organizationsCache.has(uuid)) {
            getOrganizationName(uuid);
          }
        });
      }
    } catch (error) {
      console.error('Error al cargar establecimientos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar establecimientos al iniciar y cuando cambien los parámetros
  useEffect(() => {
    console.log('Cambio en parámetros de búsqueda o paginación...');
    const timer = setTimeout(() => {
      loadPlaces();
    }, search !== null ? 500 : 200);
    return () => clearTimeout(timer);
  }, [currentPage, rowsPerPage, sortField, sortOrder, selectedOrganization, search]);

  // Manejar cambio de ordenamiento
  const handleSort = (column: TableColumn<OrganizationPlaceBasic>, sortDirection: string) => {
    if (!column.sortable || !column.sortField) {
      return;
    }
    setSortField(column.sortField);
    setSortOrder(sortDirection.toUpperCase() === 'DESC' ? GetApiOrganizationPlacesListOrderEnum.Desc : GetApiOrganizationPlacesListOrderEnum.Asc);
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

  // Columnas para la tabla de establecimientos

  const columns: TableColumn<OrganizationPlaceBasic>[] = [
    ...[(hasRole('ROLE_ADMIN') || hasRole('ROLE_SUPER_ADMIN')) ? {  
      name: t('Acciones'),
      cell: (row: OrganizationPlace) => (
        <OffsetPanel
          buttonPosition="inline" 
          buttonClassName="p-2 text-gray-500 hover:text-blue-600 transition-colors !bg-transparent border rounded shadow"
          buttonText={""}
          title={t('Editar establecimiento')}
          buttonIcon={IconEdit}
          buttonIconClassName="w-5 h-5"
          panelId={`place_${row.uuid}`}
        >
          <OrganizationPlaceForm organizationPlaceData={row} onSuccess={loadPlaces} />
        </OffsetPanel>
      ),
      selector: (row: OrganizationPlace) => row.uuid || '',  
    } : {}],
    {
      name: t('Nombre'),
      selector: (row: OrganizationPlace) => row.name || '',
      sortable: true,
      sortField: 'name',
    },
    {
      name: t('Dirección'),
      selector: (row: OrganizationPlace) => row.address || '',
      sortable: true,
      sortField: 'address',
    },
    {
      name: t('Ciudad'),
      selector: (row: OrganizationPlace) => row.city || '',
      sortable: true,
      sortField: 'city',
    },
    {
      name: t('País'),
      selector: (row: OrganizationPlace) => row.country || '',
    },
    {
      name: t('Organización'),
      cell: (row: OrganizationPlace) => (
        <OrganizationNameCell
          organizationUuid={row.organizationUuid || ''}
          organizationsCache={organizationsCache}
          getOrganizationName={getOrganizationName}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('Gestión de Establecimientos')}</h1>
      </div>

      <div className="mb-4 flex flex-wrap justify-start items-center gap-2">
        <button 
          className="btn"
          onClick={loadPlaces}
          title={t('Actualizar')}
        >
          <IconRefresh size={20} />
        </button>
        <Restricted roles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
          <OffsetPanel 
            buttonPosition="inline" 
            buttonClassName="btn"
            buttonText={""}
            title={t('Crear establecimiento')}
            buttonIcon={IconAdd}
            buttonIconClassName="w-5 h-5"
            panelId='new_place'
          >
            <OrganizationPlaceForm onSuccess={loadPlaces} />
          </OffsetPanel>
        </Restricted>
        
        <div className="w-64">
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadOrganizationOptions}
            value={selectedOrganization}
            onChange={(option) => setSelectedOrganization(option)}
            placeholder={t('Filtrar por organización')}
            noOptionsMessage={() => t('No hay resultados')}
            loadingMessage={() => t('Cargando...')}
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable={true}
          />
        </div>
        
        <div className="relative flex-grow max-w-md">
          <SearchButton
            value={search}
            onChange={setSearch}
            placeholder={t('Buscar establecimientos...')}
            onSubmit={loadPlaces}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <DataTable<OrganizationPlaceBasic>
          columns={columns}
          data={placesList?.results || []}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={placesList?.count || 0}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          sortServer
          onSort={handleSort}
          defaultSortFieldId={sortField}
          defaultSortAsc={sortOrder === GetApiOrganizationPlacesListOrderEnum.Asc}
          paginationDefaultPage={currentPage}
          noDataComponent={<div className="p-4 text-center text-gray-500">{t('No hay establecimientos disponibles')}</div>}
        />
      </div>
    </div>
  );
};

export default OrganizationPlacesPage;