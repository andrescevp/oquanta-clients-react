import React, { useEffect,useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { BusinessCard } from '../components/BusinessCard';
import { LocationPermission } from '../components/LocationPermission';
import { useUserLocation } from '../hooks/useUserLocation';

// Interfaces para los datos
interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  postalCode: string;
  category: string;
  rating: number;
  imageUrl: string;
}

interface LocationState {
  postalCode?: string;
}

export const IndexMapPage: React.FC = () => {
  const { t } = useTranslation();
  const routerLocation = useLocation();
  const locationState = routerLocation.state as LocationState | undefined;
  
  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [postalCodeInput, setPostalCodeInput] = useState(locationState?.postalCode || '');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationDialog, setShowLocationDialog] = useState(true);
  
  // Usar el hook de ubicación
  const { permissionStatus, coordinates, postalCode, setManualPostalCode, hasLocation } = useUserLocation();

  // Inicializar con el código postal de la ubicación o el estado de la ruta
  useEffect(() => {
    if (postalCode) {
      setPostalCodeInput(postalCode);
    } else if (locationState?.postalCode) {
      setPostalCodeInput(locationState.postalCode);
      // Actualizar también en el contexto
      setManualPostalCode(locationState.postalCode);
    }
  }, [postalCode, locationState?.postalCode, setManualPostalCode]);

  // Cargar datos de negocios (simulados por ahora)
  useEffect(() => {
    // Simulación de carga de datos
    setIsLoading(true);
    
    // Datos de ejemplo - reemplazar con llamada a API real
    const mockBusinesses: Business[] = [
      {
        id: '1',
        name: 'Café Aromático',
        description: 'El mejor café de la ciudad con ambiente acogedor.',
        address: 'Calle Principal 123',
        postalCode: '28001',
        category: 'Restaurantes',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNhZmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: '2',
        name: 'Farmacia 24h',
        description: 'Farmacia con servicio las 24 horas del día.',
        address: 'Avenida Central 456',
        postalCode: '28002',
        category: 'Salud',
        rating: 4.2,
        imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGhhcm1hY3l8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: '3',
        name: 'Supermercado Fresh',
        description: 'Gran variedad de productos frescos y orgánicos.',
        address: 'Plaza Mayor 789',
        postalCode: '28003',
        category: 'Compras',
        rating: 4.0,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3VwZXJtYXJrZXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: '4',
        name: 'Taller Automotriz Rápido',
        description: 'Reparaciones rápidas y de calidad para tu vehículo.',
        address: 'Carretera Industrial 101',
        postalCode: '28004',
        category: 'Servicios',
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1562614459-a9458ea7bc9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YXV0byUyMHJlcGFpcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: '5',
        name: 'Gimnasio Fitness Pro',
        description: 'Instalaciones modernas y entrenadores certificados.',
        address: 'Calle del Deporte 202',
        postalCode: '28005',
        category: 'Deporte',
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      }
    ];
    
    // Simular tiempo de carga
    setTimeout(() => {
      setBusinesses(mockBusinesses);
      setFilteredBusinesses(mockBusinesses);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrado de negocios
  useEffect(() => {
    if (!searchQuery.trim() && !postalCodeInput.trim()) {
      setFilteredBusinesses(businesses);
      return;
    }

    const filtered = businesses.filter(business => {
      const matchesSearch = !searchQuery.trim() || 
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPostal = !postalCodeInput.trim() ||
        business.postalCode.startsWith(postalCodeInput);
      
      return matchesSearch && matchesPostal;
    });

    setFilteredBusinesses(filtered);
  }, [searchQuery, postalCodeInput, businesses]);

  // Manejar envío del formulario de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // El filtrado ya ocurre en el useEffect
  };

  // Manejar cambio de código postal
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPostalCode = e.target.value;
    setPostalCodeInput(newPostalCode);
    
    // Si el código postal es válido, actualizarlo en el contexto
    if (newPostalCode.trim().length >= 4) {
      setManualPostalCode(newPostalCode.trim());
    }
  };

  // Manejo de permisos
  const handlePermissionGranted = () => {
    setShowLocationDialog(false);
  };
  
  const handlePermissionDenied = () => {
    setShowLocationDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabecera con búsqueda y código postal */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <h1 className="text-xl font-bold text-gray-900">{t('Negocios locales')}</h1>
            
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative w-full sm:w-64">
                <form onSubmit={handleSearch} className="w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('Buscar negocios...')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </form>
              </div>
              
              {/* Campo de código postal */}
              <div className="relative w-full sm:w-40">
                <input
                  type="text"
                  value={postalCodeInput}
                  onChange={handlePostalCodeChange}
                  placeholder={t('Código postal')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Contenido principal - Listado de negocios */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map(business => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-lg font-medium text-gray-900 mb-2">{t('No se encontraron resultados')}</h2>
            <p className="text-gray-600">{t('Intenta con otra búsqueda o código postal')}</p>
          </div>
        )}
      </main>
      
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
