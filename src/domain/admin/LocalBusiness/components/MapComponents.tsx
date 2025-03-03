import React, { memo, useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

// Componente para controlar la inicialización del mapa
interface MapControllerProps {
  onMap: (map: L.Map) => void;
}

export const MapController = memo(({ onMap }: MapControllerProps) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMap(map);
    }
  }, [map, onMap]);

  return null;
});

MapController.displayName = 'MapController';

// Componente para manejar el marcador y los eventos del mapa
interface MapMarkerProps {
  position: L.LatLng | [number, number];
  onPositionChange: (position: L.LatLng) => void;
}

export const MapMarker = memo(({ position, onPositionChange }: MapMarkerProps) => {
  const [markerPosition, setMarkerPosition] = useState<L.LatLng>(
    position instanceof L.LatLng ? position : new L.LatLng(position[0], position[1])
  );
  
  const map = useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng);
      onPositionChange(e.latlng);
    },
  });
  
  useEffect(() => {
    if (position instanceof L.LatLng) {
      setMarkerPosition(position);
      map.flyTo(position, map.getZoom());
    } else if (Array.isArray(position)) {
      const latLng = new L.LatLng(position[0], position[1]);
      setMarkerPosition(latLng);
      map.flyTo(latLng, map.getZoom());
    }
  }, [position, map]);
  
  return <Marker position={markerPosition} />;
});

MapMarker.displayName = 'MapMarker';

// Componente para invalidar el tamaño del mapa
interface MapResizeProps {
  isOpen?: boolean;
  width?: number;
}

export const MapResizer = memo(({ isOpen, width }: MapResizeProps) => {
  const map = useMap();
  
  useEffect(() => {
    // Esperar a que la animación termine y luego invalidar el tamaño del mapa
    if (isOpen) {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 500); // Esperar a que termine la transición
      return () => clearTimeout(timer);
    }
  }, [isOpen, map]);
  
  // También invalidar cuando cambia el ancho
  useEffect(() => {
    if (width && map) {
      map.invalidateSize();
    }
  }, [width, map]);
  
  return null;
});

MapResizer.displayName = 'MapResizer';

// Componente principal del mapa
interface FormMapProps {
  position: [number, number];
  onMapInit: (map: L.Map) => void;
  onPositionChange: (position: L.LatLng) => void;
  className?: string;
  isOpen?: boolean;
  panelWidth?: number;
}

export const FormMap = memo(({ 
  position, 
  onMapInit, 
  onPositionChange, 
  className,
  isOpen,
  panelWidth
}: FormMapProps) => {
  return (
    <div className={`min-h-80 w-full ${className || ''}`} style={{ height: '400px' }}>
      <MapContainer 
        center={position} 
        preferCanvas={true}
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-md border border-gray-300"
      >
        <MapController onMap={onMapInit} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMarker 
          position={position} 
          onPositionChange={onPositionChange} 
        />
        <MapResizer isOpen={isOpen} width={panelWidth} />
      </MapContainer>
    </div>
  );
});

FormMap.displayName = 'FormMap';