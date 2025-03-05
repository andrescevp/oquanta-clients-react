import React, { useEffect, useRef,useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AsyncSelect from 'react-select/async';

import L from 'leaflet';
// Corregir problema de íconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { Organization, OrganizationPlace, OrganizationPlaceCreate, OrganizationPlacesApi, OrganizationPlaceUpdate, OrganizationsApi } from '../../../../api-generated/api';
import { IconMapPin, IconSave,IconX } from '../../../../components/UI/Icons';
import ButtonLoader from '../../../../components/UI/molecules/ButtonLoder';
import { ConfirmationTooltip } from '../../../../components/UI/molecules/ConfirmationTooltip';
import InputWithLabel from '../../../../components/UI/molecules/InputWithLabel';
import { useApi } from '../../../../hooks/useApi';
import { cn } from '../../../../lib/utils';
import { useMapForm } from '../hooks/useMapForm';
import { FormMap } from './MapComponents';

// import 'leaflet/dist/leaflet.css';
// // Importar el geocodificador correctamente
// import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
// import 'leaflet-control-geocoder'; // Importarlo como efecto secundario

// El resto del código permanece igual
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type FormValues = Omit<OrganizationPlace, 'uuid'>;

interface OrganizationOption {
  value: string;
  label: string;
}

interface OrganizationPlaceFormProps {
  uuid?: string;
  organizationPlaceData?: OrganizationPlace;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultOrganizationId?: string;
}

// eslint-disable-next-line complexity
const OrganizationPlaceForm: React.FC<OrganizationPlaceFormProps> = ({ 
  uuid,
  organizationPlaceData,
  onSuccess,
  onCancel,
  defaultOrganizationId
}) => {
  const { t } = useTranslation();
  const organizationPlacesApi = useApi(OrganizationPlacesApi);
  const organizationsApi = useApi(OrganizationsApi);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultOrganization, setDefaultOrganization] = useState<OrganizationOption | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const mapContainerId = useRef(`map-container-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  const { 
    register, 
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: organizationPlaceData ? {
      name: organizationPlaceData.name || '',
      slug: organizationPlaceData.slug || '',
      longitude: organizationPlaceData.longitude || '',
      latitude: organizationPlaceData.latitude || '',
      address: organizationPlaceData.address || '',
      postalCode: organizationPlaceData.postalCode || '',
      city: organizationPlaceData.city || '',
      country: organizationPlaceData.country || '',
      region: organizationPlaceData.region || '',
      organizationUuid: organizationPlaceData.organizationUuid || defaultOrganizationId || ''
    } : {
      name: '',
      slug: '',
      longitude: '',
      latitude: '',
      address: '',
      postalCode: '',
      city: '',
      country: '',
      region: '',
      organizationUuid: defaultOrganizationId || ''
    }
  });

  // Observar cambios en las coordenadas
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  
  // Usar el hook personalizado para la lógica del mapa
  const { 
    mapPosition, 
    setMapPosition,
    handleMapInit: originalHandleMapInit,
    handlePositionChange
  } = useMapForm({
    setValue,
    initialPosition: [40.416775, -3.70379],
    initialLatitude: organizationPlaceData?.latitude || undefined,
    initialLongitude: organizationPlaceData?.longitude || undefined,
  });

  // Wrapper para el mapInit que guarda la referencia y maneja el tamaño
  const handleMapInit = (map: L.Map) => {
    // Guardar la referencia al mapa
    mapInstanceRef.current = map;
    
    // Llamar al handler original
    originalHandleMapInit(map);
    
    // Reajustar tamaño después de un tiempo para asegurar que el panel esté visible
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 300);
  };

  // Efecto para preparar el mapa
  useEffect(() => {
    // Retrasar la inicialización del mapa para asegurar que el contenedor esté listo
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 200);
    
    // Limpieza cuando el componente se desmonta
    return () => {
      clearTimeout(timer);
      // Limpiar la referencia del mapa de forma segura
      if (mapInstanceRef.current) {
        try {
          // Verificamos si el mapa sigue en el DOM antes de intentar eliminarlo
          const container = document.getElementById(mapContainerId.current);
          // Usar una comprobación alternativa o aserción de tipo
          if (container && (container as any)._leaflet_id) {
            mapInstanceRef.current.remove();
          }
        } catch (mapError) { // Renombrar 'error' a 'mapError' para evitar shadow
          console.warn('Error al eliminar el mapa:', mapError);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Actualizar posición del mapa cuando cambien las coordenadas en el formulario
  useEffect(() => {
    if (latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
      setMapPosition([parseFloat(latitude), parseFloat(longitude)]);
    }
  }, [latitude, longitude, setMapPosition]);

  // Cargar organización por defecto si hay un UUID
  useEffect(() => {
    const fetchDefaultOrganization = async () => {
      const orgUuid = organizationPlaceData?.organizationUuid || defaultOrganizationId;
      if (orgUuid) {
        try {
          const response = await organizationsApi.call('getApiOrganizationsGet', orgUuid);
          if (response.data) {
            setDefaultOrganization({
              value: response.data.uuid || '',
              label: response.data.name || ''
            });
          }
        } catch (err) {
          console.error('Error al cargar organización por defecto:', err);
        }
      }
    };
    
    fetchDefaultOrganization();
  }, [organizationPlaceData?.organizationUuid, defaultOrganizationId, organizationsApi]);

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
        return (response.data.results as Organization[])
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

  // Generar slug automáticamente a partir del nombre
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };
  
  // Enviar el formulario
  // eslint-disable-next-line complexity
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      // Si no hay slug, generarlo a partir del nombre
      if (!data.slug) {
        data.slug = generateSlug(data.name || '');
      }
      
      if (organizationPlaceData && organizationPlaceData.uuid) {
        // Actualizar establecimiento existente
        const updateData: OrganizationPlaceUpdate = {
          name: data.name,
          slug: data.slug,
          longitude: data.longitude,
          latitude: data.latitude,
          address: data.address,
          postalCode: data.postalCode,
          city: data.city,
          country: data.country,
          region: data.region
        };
        await organizationPlacesApi.call(
          'putApiOrganizationPlacesUpdate', 
          organizationPlaceData.uuid, 
          updateData
        );
      } else {
        // Crear nuevo establecimiento
        const createData: OrganizationPlaceCreate = {
          name: data.name || '',
          slug: data.slug || '',
          longitude: data.longitude,
          latitude: data.latitude,
          address: data.address || '',
          postalCode: data.postalCode,
          city: data.city || '',
          country: data.country || '',
          region: data.region,
          organizationUuid: data.organizationUuid || ''
        };
        await organizationPlacesApi.call('postApiOrganizationPlacesCreate', createData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error al guardar establecimiento:', err);
      setError(t('No se pudo guardar la información del establecimiento'));
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganizationPlace = async () => {
    if (!organizationPlaceData || !organizationPlaceData.uuid) {
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      await organizationPlacesApi.call('deleteApiOrganizationPlacesDelete', organizationPlaceData.uuid);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error al eliminar establecimiento:', err);
      setError(t('No se pudo eliminar el establecimiento'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Mapa para seleccionar ubicación */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">{t('Ubicación en el mapa')}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {t('Haz clic en el mapa para establecer la ubicación o usa el buscador.')}
          </p>
          
          {/* Contenedor del mapa con ID único */}
          <div 
            id={mapContainerId.current}
            className="relative" 
            style={{ height: '400px', minHeight: '320px' }}
          >
            {isMapReady && (
              <FormMap
                position={mapPosition}
                onMapInit={handleMapInit}
                onPositionChange={handlePositionChange}
              />
            )}
          </div>
          
          <div className="mt-2 text-sm text-gray-600 flex items-center">
            <IconMapPin className="w-4 h-4 mr-1" />
            <span>{t('Las coordenadas se actualizan automáticamente al mover el marcador.')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Organización */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Organización')}
              </label>
              <Controller
                name="organizationUuid"
                control={control}
                rules={{ required: t('La organización es obligatoria') }}
                render={({ field }) => (
                  <AsyncSelect
                    inputId="organization-select"
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOrganizationOptions}
                    defaultValue={defaultOrganization}
                    placeholder={t('Buscar organización...')}
                    noOptionsMessage={() => t('No hay resultados')}
                    loadingMessage={() => t('Cargando...')}
                    onChange={(option) => field.onChange(option?.value || '')}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    value={defaultOrganization || { value: field.value, label: field.value ? t('Cargando...') : '' }}
                    isDisabled={loading || !!organizationPlaceData?.uuid}
                  />
                )}
              />
              {errors.organizationUuid && (
                <p className="mt-1 text-sm text-red-600">{errors.organizationUuid.message}</p>
              )}
            </div>
            
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
            
            {/* Slug */}
            <InputWithLabel
              id="slug"
              label={t('Slug/URL')}
            //   helperText={t('Identificador único para URLs. Si se deja vacío, se generará automáticamente.')}
              error={errors.slug && t(errors.slug.message || 'El slug tiene un formato incorrecto')}
              inputProps={{
                type: "text",
                ...register('slug', { 
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: t('Solo se permiten minúsculas, números y guiones')
                  }
                })
              }}
            />
            
            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-4">
              <InputWithLabel
                id="latitude"
                label={t('Latitud')}
                error={errors.latitude && t(errors.latitude.message || 'Formato inválido')}
                inputProps={{
                  type: "text",
                  ...register('latitude', { 
                    required: t('La latitud es obligatoria'),
                    pattern: {
                      value: /^-?\d+(\.\d+)?$/,
                      message: t('Formato numérico inválido')
                    }
                  })
                }}
              />
              
              <InputWithLabel
                id="longitude"
                label={t('Longitud')}
                error={errors.longitude && t(errors.longitude.message || 'Formato inválido')}
                inputProps={{
                  type: "text",
                  ...register('longitude', { 
                    required: t('La longitud es obligatoria'),
                    pattern: {
                      value: /^-?\d+(\.\d+)?$/,
                      message: t('Formato numérico inválido')
                    }
                  })
                }}
              />
            </div>
          </div>
          
          <div className="space-y-6">
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
            
            {/* Región */}
            <InputWithLabel
              id="region"
              label={t('Región/Provincia')}
              error={errors.region && t(errors.region.message || 'La región es obligatoria')}
              inputProps={{
                type: "text",
                ...register('region', { required: t('La región es obligatoria') })
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
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-between items-center mt-8">
          <div>
            {organizationPlaceData?.uuid && (            
              <ConfirmationTooltip
                confirmationMessage={t('¿Estás seguro de que deseas eliminar este establecimiento? Esta acción no se puede deshacer.')}
                onConfirm={deleteOrganizationPlace}
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
            <button
              type="button"
              onClick={onCancel}
              className="btn"
              disabled={loading}
            >
              <IconX className='w-5 h-5 mr-2' />
              {t('Cancelar')}
            </button>
            <ButtonLoader
              type="submit"
              disabled={loading}
              loading={loading}
              icon={<IconSave className='w-5 h-5'/>}
            >
              {organizationPlaceData?.uuid 
                ? t('Actualizar') 
                : t('Crear')
              }
            </ButtonLoader>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrganizationPlaceForm;