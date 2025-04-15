import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
   
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }
};

// Component to automatically fit map to bounds
function FitBounds({ markers, polylinePoints }) {
  const map = useMap();
  
  useEffect(() => {
    if ((markers && markers.length > 1) || (polylinePoints && polylinePoints.length > 1)) {
      const points = polylinePoints || markers.map(marker => marker.position);
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, polylinePoints, map]);
  
  return null;
}

// Calculate distance between two points in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Calculate total route distance and estimated time
function calculateRouteInfo(points) {
  if (!points || points.length < 2) return { distance: 0, duration: 0 };
  
  let totalDistance = 0;
  
  for (let i = 0; i < points.length - 1; i++) {
    const [lat1, lon1] = points[i];
    const [lat2, lon2] = points[i + 1];
    totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
  }
  
  // Assume average walking speed of 5 km/h
  const durationHours = totalDistance / 5;
  const durationMinutes = Math.round(durationHours * 60);
  
  return {
    distance: totalDistance.toFixed(1),
    duration: durationMinutes
  };
}

export function MapComponent({ center, markers, polylinePoints, height = '400px' }) {
  const [isMounted, setIsMounted] = useState(false);
 
  useEffect(() => {
    setIsMounted(true);
    fixLeafletIcon();
  }, []);
 
  if (!isMounted) {
    return (
      <div
        style={{ height, width: '100%' }}
        className="bg-gray-100 rounded-xl flex items-center justify-center"
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  // Filter out intermediate route points that shouldn't have markers
  const visibleMarkers = markers ? markers.filter(marker => !marker.isRoutePoint) : [];
  
  // Get all points for the polyline (including intermediate points)
  const routePoints = markers ? markers.map(marker => marker.position) : polylinePoints;

  // Calculate route info
  const routeInfo = calculateRouteInfo(routePoints);
  
  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height, width: '100%' }}
        className="rounded-xl z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* Auto-fit bounds to include all markers */}
        {routePoints && routePoints.length > 0 && <FitBounds markers={markers} polylinePoints={routePoints} />}
        
        {/* White outline for the route line */}
        {routePoints && routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            color="#ffffff"
            weight={8}
            opacity={0.4}
            smoothFactor={1}
          />
        )}
        
        {/* Main blue route line */}
        {routePoints && routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            color="#1a73e8" // Google Maps blue
            weight={5}
            opacity={0.9}
            smoothFactor={1}
          />
        )}
       
        {/* Only show actual stop markers, not intermediate route points */}
        {visibleMarkers && visibleMarkers.map((marker, idx) => (
          <Marker position={marker.position} key={idx}>
            <Popup>
              {marker.title && (
                <div className="font-medium">
                  <span className="text-rose-500">#{marker.index}</span> {marker.title}
                </div>
              )}
              {marker.description && (
                <div className="text-gray-600 text-sm">{marker.description}</div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Distance & Time info box (like Google Maps) */}
      {routePoints && routePoints.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg z-10 border border-gray-200">
          <div className="font-medium text-gray-800">{routeInfo.distance} km</div>
          <div className="text-sm text-gray-600">{routeInfo.duration} min</div>
        </div>
      )}
    </div>
  );
}