'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { LatLngExpression, Icon, Map as LeafletMap } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Search, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import 'leaflet/dist/leaflet.css';

const DefaultIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface ListingLocation {
  id: number;
  position: LatLngExpression;
  title: string;
  price: string;
}

interface MapComponentProps {
  center?: LatLngExpression;
  zoom?: number;
  listings?: ListingLocation[];
  searchQuery?: string;
  category?: string;
  radius?: number;
  onSearchArea?: () => void;
  onListingClick?: (id: number) => void;
}

// Component to handle map controls
function MapControls({ onZoomIn, onZoomOut, onLocate }: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
}) {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="bg-white shadow-lg hover:bg-gray-100 w-10 h-10"
        onClick={onZoomIn}
      >
        <ZoomIn className="w-5 h-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="bg-white shadow-lg hover:bg-gray-100 w-10 h-10"
        onClick={onZoomOut}
      >
        <ZoomOut className="w-5 h-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="bg-white shadow-lg hover:bg-gray-100 w-10 h-10"
        onClick={onLocate}
      >
        <Navigation className="w-5 h-5" />
      </Button>
    </div>
  );
}

function MapUpdater({ center, zoom, mapRef }: { 
  center: LatLngExpression; 
  zoom: number;
  mapRef: { current: LeafletMap | null };
}) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  
  return null;
}

export default function MapComponent({
  center = [37.7749, -122.4194],
  zoom = 13,
  listings = [],
  searchQuery = '',
  category = 'Vehicles',
  radius = 10,
  onSearchArea,
  onListingClick
}: MapComponentProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [currentCategory, setCurrentCategory] = useState(category);
  const [currentRadius, setCurrentRadius] = useState(radius);
  const [currentSearch, setCurrentSearch] = useState(searchQuery);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };

  const handleLocate = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (mapRef.current) {
          mapRef.current.setView(
            [position.coords.latitude, position.coords.longitude],
            15
          );
        }
      });
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Map Search Bar - Unified container */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 md:p-2 gap-1 md:gap-2">
          {/* Search Icon */}
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 ml-1 md:ml-0" />
          
          {/* Search Input */}
          <Input
            type="text"
            value={currentSearch}
            onChange={(e) => setCurrentSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearchArea?.();
              }
            }}
            placeholder="vintage bicycle"
            className="border-0 focus-visible:ring-0 flex-1 min-w-0 text-sm md:text-base"
          />
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          {/* Category Filter */}
          <Select value={currentCategory} onValueChange={setCurrentCategory}>
            <SelectTrigger className="h-auto py-1 md:py-2 px-2 md:px-3 border-0 shadow-none bg-transparent hover:bg-gray-50 focus:ring-0 focus-visible:ring-0 w-[100px] md:w-[120px] text-xs md:text-sm [&>span]:bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="!z-[1010]">
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="Vehicles">Vehicles</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Home & Garden">Home & Garden</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Sports & Outdoors">Sports & Outdoors</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          {/* Radius Filter */}
          <Select value={currentRadius.toString()} onValueChange={(val) => setCurrentRadius(Number(val))}>
            <SelectTrigger className="h-auto py-1 md:py-2 px-2 md:px-3 border-0 shadow-none bg-transparent hover:bg-gray-50 focus:ring-0 focus-visible:ring-0 w-[80px] md:w-[100px] text-xs md:text-sm [&>span]:bg-transparent">
              <SelectValue>
                <span className="bg-transparent">{currentRadius}km</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="!z-[1010]">
              <SelectItem value="5">5km</SelectItem>
              <SelectItem value="10">10km</SelectItem>
              <SelectItem value="25">25km</SelectItem>
              <SelectItem value="50">50km</SelectItem>
              <SelectItem value="100">100km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} mapRef={mapRef} />
        
        {/* Radius Circle */}
        <Circle
          center={center}
          radius={currentRadius * 1000} // Convert km to meters
          pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
        />

        {/* Listing Markers */}
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={listing.position}
            icon={DefaultIcon}
            eventHandlers={{
              click: () => onListingClick?.(listing.id)
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-1">{listing.title}</div>
                <div className="text-blue-600 font-bold">{listing.price}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocate}
      />
    </div>
  );
}

