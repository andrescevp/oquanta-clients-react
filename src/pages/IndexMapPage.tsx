import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Link } from 'react-router';

import L from 'leaflet';

import { LocationPermission } from '../components/LocationPermission';
import { useUserLocation } from '../hooks/useUserLocation';
import { cn } from '../lib/utils';

import 'leaflet/dist/leaflet.css';

// Definir la interfaz para los resultados de búsqueda
interface SearchResult {
  id: string;
  name: string;
  address?: string;
  coords: [number, number]; // [lat, lng]
}

// Componente para actualizar el centro del mapa
const MapMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(position, 15);
  }, [map, position]);
  
  return (
    <Marker position={position}>
      <Popup>{`${position[0]}, ${position[1]}`}</Popup>
    </Marker>
  );
};

export const IndexMapPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([51.505, -0.09]);
  const [showMarker, setShowMarker] = useState(false);
  const { permissionStatus, coordinates, hasLocation } = useUserLocation();
  const [showLocationDialog, setShowLocationDialog] = useState(true);

  // Solucionar el problema de los iconos de Leaflet
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Usar coordenadas reales si están disponibles
  useEffect(() => {
    if (permissionStatus === "granted" && coordinates) {
      setSelectedLocation([coordinates.latitude, coordinates.longitude]);
      setShowMarker(true);
    }
  }, [coordinates]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchActive(true);
    
    // Simulación de resultados de búsqueda (reemplazar con API real)
    const mockResults: SearchResult[] = [
      {
        id: '1',
        name: 'Central Park',
        address: 'New York, NY, USA',
        coords: [40.785091, -73.968285]
      },
      {
        id: '2',
        name: 'Torre Eiffel',
        address: 'París, Francia',
        coords: [48.858844, 2.294351]
      },
      {
        id: '3',
        name: 'Plaza Mayor',
        address: 'Madrid, España',
        coords: [40.415363, -3.707398]
      }
    ];
    
    setSearchResults(mockResults);
  };

  const selectLocation = (result: SearchResult) => {
    setSelectedLocation(result.coords);
    setShowMarker(true);
  };

  const resetSearch = () => {
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handlePermissionGranted = () => {
    setShowLocationDialog(false);
    // Puedes centrar el mapa en la ubicación del usuario aquí si lo deseas
  };
  
  const handlePermissionDenied = () => {
    setShowLocationDialog(false);
    // Podrías mostrar algún mensaje o alternativa aquí
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Capa del mapa (capa inferior) */}
      <div className="h-full w-full absolute inset-0 -z-10">
        <MapContainer 
          center={selectedLocation} 
          zoom={13} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false} // Mover los controles de zoom para evitar conflictos
          >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {showMarker && <MapMarker position={selectedLocation} />}
        </MapContainer>
      </div>
      
      {/* Botón de inicio de sesión (capa superior) */}
      <div className="absolute top-4 right-4 z-50">
        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          {t('Login')}
        </Link>
      </div>
      
      {/* Barra de búsqueda con animación (capa superior) */}
      <div 
        className={cn(
          "z-40 absolute px-4 sm:px-0 w-full sm:max-w-lg left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out",
          searchActive ? "top-4" : "top-1/2 -translate-y-1/2"
        )}
      >
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            {searchActive && (
              <button 
                type="button"
                onClick={resetSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
            )}
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Buscar ubicaciones...')}
              className={cn(
                "w-full px-4 py-3 rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                searchActive ? "pl-10" : ""
              )}
            />
            
            <button 
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </form>
        
        {/* Resultados de búsqueda */}
        {searchActive && searchResults.length > 0 && (
          <div className="mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <ul className="py-2">
              {searchResults.map((result) => (
                <li 
                  key={result.id} 
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => selectLocation(result)}
                >
                  <div className="font-medium text-gray-800">{result.name}</div>
                  {result.address && (
                    <div className="text-sm text-gray-500">{result.address}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mostrar diálogo de permiso solo si no tenemos ubicación */}
      {!hasLocation && (
        <LocationPermission 
          showDialog={showLocationDialog}
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
        />
      )}
    </div>
  );
};
