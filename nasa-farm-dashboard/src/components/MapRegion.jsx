import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons missing in Leaflet when bundled with Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapRegion({ lat, lon }) {
  const [areaAcres, setAreaAcres] = useState(50);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const initialCenterRef = useRef([lat, lon]);
  const initialAreaRef = useRef(areaAcres);

  // Initialize Map on mount
  useEffect(() => {
    if (!mapInstanceRef.current) {
      const [initialLat, initialLon] = initialCenterRef.current;
      const initialAreaAcres = initialAreaRef.current;
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([initialLat, initialLon], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Initial marker and highlighted region circle
      markerRef.current = L.marker([initialLat, initialLon]).addTo(mapInstanceRef.current);
      circleRef.current = L.circle([initialLat, initialLon], {
        color: '#0d6efd',
        fillColor: '#0d6efd',
        fillOpacity: 0.2,
        radius: Math.sqrt((initialAreaAcres * 4046.8564224) / Math.PI)
      }).addTo(mapInstanceRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map view, marker, and highlighted circle when lat, lon, or slider scale changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const newLatLng = [lat, lon];
      const radiusMeters = Math.sqrt((areaAcres * 4046.8564224) / Math.PI);

      mapInstanceRef.current.setView(newLatLng);

      if (markerRef.current) {
        markerRef.current.setLatLng(newLatLng);
      }

      if (circleRef.current) {
        circleRef.current.setLatLng(newLatLng);
        circleRef.current.setRadius(radiusMeters);
      }
    }
  }, [lat, lon, areaAcres]);

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <div className="card shadow p-4 border-0 rounded-4">
        <h2 className="h4 mb-3 fw-bold text-primary">Interactive Region Map & Scale Slider</h2>

        {/* Scale Slider */}
        <div className="mb-4">
          <label htmlFor="scaleSlider" className="form-label small fw-bold">
            Region Area: <span className="text-primary">{areaAcres} acres</span>
          </label>
          <input
            type="range"
            className="form-range"
            id="scaleSlider"
            min="50"
            max="1000"
            step="1"
            value={areaAcres}
            onChange={(e) => setAreaAcres(Number(e.target.value))}
          />
        </div>

        {/* Map Display Container */}
        <div 
          ref={mapContainerRef} 
          className="rounded-3 border shadow-sm" 
          style={{ height: '400px', width: '100%' }}
        />
      </div>
    </div>
  );
}