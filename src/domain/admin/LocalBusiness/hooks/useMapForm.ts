import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import L from 'leaflet';

import 'leaflet-control-geocoder'; // Importarlo como efecto secundario

type MapFormHookProps = {
    setValue: UseFormSetValue<any>;
    initialPosition?: [number, number];
    initialLatitude?: string;
    initialLongitude?: string;
};

export const useMapForm = ({
    setValue,
    initialPosition = [40.416775, -3.70379],
    initialLatitude,
    initialLongitude,
}: MapFormHookProps) => {
    const [mapPosition, setMapPosition] = useState<[number, number]>(initialPosition);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [geocoderInstance, setGeocoderInstance] = useState<any>(null);

    // Usa Nominatim como geocoder por defecto si no hay API key
    const geocoder = process.env.REACT_APP_LEAFLET_GEOCODER_KEY
        ? (L.Control as any).Geocoder.mapbox({
              apiKey: process.env.REACT_APP_LEAFLET_GEOCODER_KEY,
          })
        : (L.Control as any).Geocoder.nominatim({
              geocodingQueryParams: { countrycodes: 'es' },
          });

    // Actualizar coordenadas del formulario
    const updateFormCoordinates = (lat: number, lng: number) => {
        setValue('latitude', lat.toString());
        setValue('longitude', lng.toString());
    };

    // Actualizar todos los campos de dirección del formulario
    const updateAddressFields = (result: any) => {
        if (result.properties) {
            const { properties } = result;

            if (properties.text) {
                let fullAddress = properties.text;
                if (properties.address) {
                    fullAddress += `, ${properties.address}`;
                }
                setValue('address', fullAddress);
            }

            if (properties.postcode) {
                setValue('postalCode', properties.postcode);
            }

            if (properties.place) {
                setValue('city', properties.place);
            }

            if (properties.region) {
                setValue('region', properties.region);
            }

            if (properties.country) {
                setValue('country', properties.country);
            }
        }
    };

    // Manejar cambio de posición del marcador
    const handlePositionChange = (position: L.LatLng) => {
        updateFormCoordinates(position.lat, position.lng);

        // Geocodificar la posición para obtener la dirección
        if (geocoder) {
            geocoder.reverse(position, 18, (results: any[]) => {
                if (results && results.length > 0) {
                    updateAddressFields(results[0]);
                }
            });
        }
    };

    // Manejar inicialización del mapa
    const handleMapInit = (map: L.Map) => {
        setMapInstance(map);
        // Invalidar tamaño inmediatamente y después de un breve retraso
        map.invalidateSize();
        setTimeout(() => map.invalidateSize(), 100);
    };

    // Crear geocodificador solo una vez
    useEffect(() => {
        if (mapInstance && !geocoderInstance) {
            const geocoderControl = (L.Control as any).geocoder({
                defaultMarkGeocode: false,
                position: 'topright',
                placeholder: 'Buscar dirección...',
                errorMessage: 'No se encontraron resultados',
                geocoder: geocoder,
            });

            geocoderControl.on('markgeocode', (e: any) => {
                const { geocode } = e;
                const latlng = geocode.center;

                setMapPosition([latlng.lat, latlng.lng]);
                updateFormCoordinates(latlng.lat, latlng.lng);
                updateAddressFields(geocode);

                mapInstance.flyTo(latlng, 16);
            });

            geocoderControl.addTo(mapInstance);
            setGeocoderInstance(geocoderControl);
        }
    }, [mapInstance]);

    // Inicializar con coordenadas existentes si están disponibles
    useEffect(() => {
        if (initialLatitude && initialLongitude) {
            const lat = parseFloat(initialLatitude);
            const lng = parseFloat(initialLongitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                setMapPosition([lat, lng]);
            }
        }
    }, [initialLatitude, initialLongitude]);

    return {
        mapPosition,
        setMapPosition,
        handleMapInit,
        handlePositionChange,
    };
};
