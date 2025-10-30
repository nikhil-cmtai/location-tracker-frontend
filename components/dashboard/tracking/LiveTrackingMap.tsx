"use client";
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVehicles, type Vehicle } from '@/lib/redux/features/vehicleSlice';
import type { RootState, AppDispatch } from '@/lib/redux/store';

interface LiveTrackingData {
  lat: number;
  lng: number;
  speed: string;
  ignition: boolean;
  powerConnected: boolean;
  battery: number;
  lastUpdated: string;
  vehicleNumber: string;
  vehicleType?: string;
  vehicleModel?: string;
  imei: string;
  heading: number;
  lastUpdatedAtISTStored: string;
  new?:boolean
}

interface MapProps {
    vehicleData: LiveTrackingData | null;
}

// Remove the prototype helper if present using Reflect to avoid unused-expression lint warning
Reflect.deleteProperty(L.Icon.Default.prototype as unknown as Record<string, unknown>, '_getIconUrl');
L.Icon.Default.mergeOptions({
    iconUrl: '',
    iconRetinaUrl: '',
    shadowUrl: '',
});

const createVehicleLocationIcon = (vehicleData: LiveTrackingData) => {
  const isMoving = parseFloat(vehicleData.speed) > 0;
  
  let color = '#EF4444';
  let pulseColor = '#EF4444';
  
  if (vehicleData.powerConnected && vehicleData.ignition && isMoving) {
    color = '#10B981';
    pulseColor = '#10B981';
  } else if (vehicleData.powerConnected && vehicleData.ignition) {
    color = '#F59E0B';
    pulseColor = '#F59E0B';
  }
  
  return L.divIcon({
    className: 'vehicle-location-marker',
    html: `
      <div style="position: relative; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; transform: rotate(${vehicleData.heading}deg); transition: transform 0.3s ease-in-out;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100" width="40" height="60" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
          <!-- Bus body base -->
          <path d="M10,20 L10,85 Q10,95 20,95 L40,95 Q50,95 50,85 L50,20 Q50,10 40,10 L20,10 Q10,10 10,20" 
                fill="${color}" stroke="white" stroke-width="2"/>
          
          <!-- Front curved windshield -->
          <path d="M15,15 Q27.5,5 45,15" fill="none" stroke="#D1E9FF" stroke-width="4"/>
          
          <!-- Side windows (modern style) -->
          <path d="M15,25 H45 V35 H15 Z M15,40 H45 V50 H15 Z M15,55 H45 V65 H15 Z" 
                fill="#D1E9FF" stroke="#2C5282" stroke-width="1"/>
          
          <!-- Bottom curve detail -->
          <path d="M10,85 Q30,90 50,85" fill="none" stroke="white" stroke-width="1.5"/>
          
          <!-- Wheels with modern rims -->
          <g transform="translate(15,85)">
            <circle cx="0" cy="0" r="8" fill="#1A1A1A"/>
            <circle cx="0" cy="0" r="6" fill="#333"/>
            <circle cx="0" cy="0" r="2" fill="#666"/>
          </g>
          <g transform="translate(45,85)">
            <circle cx="0" cy="0" r="8" fill="#1A1A1A"/>
            <circle cx="0" cy="0" r="6" fill="#333"/>
            <circle cx="0" cy="0" r="2" fill="#666"/>
          </g>
          
          <!-- Modern headlights -->
          <path d="M13,12 L17,12 Q20,12 20,15 L20,18 L13,18 Z" 
                fill="${isMoving ? '#FFD700' : '#666'}" stroke="white" stroke-width="1"/>
          <path d="M47,12 L43,12 Q40,12 40,15 L40,18 L47,18 Z" 
                fill="${isMoving ? '#FFD700' : '#666'}" stroke="white" stroke-width="1"/>
          
          <!-- Status indicator with glow effect -->
          <circle cx="30" cy="95" r="3" fill="${color}" stroke="white" stroke-width="1.5">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="${isMoving ? 'indefinite' : '0'}"/>
          </circle>
        </svg>
        ${isMoving ? `
          <div style="position: absolute; top: -10px; left: -10px; width: 100px; height: 100px; border: 2px solid ${pulseColor}; border-radius: 50%; animation: ripple 2s infinite; opacity: 0.45;"></div>
        ` : ''}
      </div>
      <style>
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      </style>
    `,
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    popupAnchor: [0, -45],
  });
};

// Safely format values that might be string or populated objects
type ObjectWithCommonFields = {
  name?: string;
  type?: string;
  label?: string;
  make?: string;
  model?: string;
  modelName?: string;
  vehicleModelName?: string;
  vehicleType?: string;
  title?: string;
};

function formatMaybePopulated(value: string | number | ObjectWithCommonFields | null | undefined, fallback: string = 'N/A'): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    const commonFields = value as ObjectWithCommonFields;
    const label = commonFields.name || commonFields.type || commonFields.label || 
                  commonFields.make || commonFields.model || commonFields.modelName || 
                  commonFields.vehicleModelName || commonFields.vehicleType || commonFields.title;
    if (typeof label === 'string' && label.trim()) return label;
  }
  return fallback;
}

function MapUpdater({ position, isInitial, onInitialHandled, hasVehicleData }: { position: [number, number]; isInitial?: boolean; onInitialHandled?: () => void; hasVehicleData?: boolean }) {
  const map = useMap();
  const [userZoomed, setUserZoomed] = useState(false);
  const [initialZoom, setInitialZoom] = useState<number>(5);

  useEffect(() => {
    // Set initial zoom level from the map on mount
    const z = map.getZoom();
    if (typeof z === 'number') setInitialZoom(z);
  }, [map]);

  useEffect(() => {
    // Listen for zoom events to detect user interaction
    const handleZoom = () => setUserZoomed(true);
    map.on('zoomend', handleZoom);
    return () => { map.off('zoomend', handleZoom); };
  }, [map]);

  useEffect(() => {
    // If no vehicle data, keep India view
    if (!hasVehicleData) {
      if (!userZoomed) {
        map.setView([20.5937, 78.9629], 5);
      }
      return;
    }

    if (position[0] !== 0 && position[1] !== 0) {
      // If this is the initial arrival and the user hasn't zoomed, force zoom=14
      if (isInitial && !userZoomed) {
        map.flyTo(position, 14, { animate: true, duration: 1.5 });
        try { onInitialHandled && onInitialHandled(); } catch (e) {
          console.error("Initial zoom error:", e);
        }
        return;
      }

      // Otherwise preserve user's zoom if they interacted, else use initial map zoom
      const zoomToUse = userZoomed ? (map.getZoom() || initialZoom) : initialZoom;
      map.flyTo(position, zoomToUse, { animate: true, duration: 1.5, easeLinearity: 0.5 });
    }
  }, [position, map, userZoomed, initialZoom, isInitial, onInitialHandled, hasVehicleData]);

  return null;
}

export default function LiveTrackingMap({ vehicleData }: MapProps) {
  const [address, setAddress] = useState<string>('Fetching location...');
  const [trail, setTrail] = useState<[number, number][]>([]);
  // markerPos holds the displayed marker position and is animated towards currentPosition
  const [markerPos, setMarkerPos] = useState<[number, number]>([vehicleData?.lat ?? 20.5937, vehicleData?.lng ?? 78.9629]);
  const dispatch = useDispatch<AppDispatch>();
  // Reference to the underlying Leaflet marker instance (typed, avoid `any`)
  const markerRef = useRef<L.Marker | null>(null);
  const rafRef = useRef<number | null>(null);
  // Keep a mutable ref of the displayed marker position so we don't need to include markerPos in effect deps
  const markerPosRef = useRef<[number, number]>(markerPos);
  const vehicles = useSelector((state: RootState) => state.vehicle.vehicles ?? []);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  // max points to keep in trail to avoid memory blowup
  const MAX_TRAIL_POINTS = 1000;

  // localStorage key helper per vehicle
  const storageKeyFor = (vehicleNumber?: string) => `live-trail-${(vehicleNumber||'').replace(/\s+/g,'').toUpperCase()}`;

    useEffect(() => {
    if (!vehicleData?.lat || !vehicleData?.lng) {
      setAddress('Location not available');
      // if there's no vehicle data, do not modify the trail
      return;
    }

        const fetchAddress = async () => {
            try {
                const response = await fetch(`http://nominatim.locationtrack.in/reverse?format=geocodejson&lat=${vehicleData.lat}&lon=${vehicleData.lng}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch address');
                }
                const data = await response.json();
                const locationLabel = data.features[0]?.properties?.geocoding?.label || 'Address not found';
                setAddress(locationLabel);
            } catch (error) {
                console.error("Address fetch error:", error);
                setAddress('Could not determine location');
            }
        };

        fetchAddress();
    }, [vehicleData?.lat, vehicleData?.lng]);

  const currentPosition: [number, number] = vehicleData 
    ? [vehicleData.lat, vehicleData.lng]
    : [20.5937, 78.9629];

  // initial center/zoom refs so MapContainer props don't change on updates
  const initialCenterRef = useRef<[number, number]>([20.5937, 78.9629]);
  const initialZoomRef = useRef<number>(5);

    // Track previous vehicle so we can reset or load trails appropriately when vehicle changes
    const prevVehicleRef = useRef<string | null>(null);

  // When vehicleData changes, decide whether to load a stored trail (same vehicle)
    // or start fresh from the live point (different vehicle)
    useEffect(() => {
      if (!vehicleData) {
        // Do not modify trail when tracking stops; keep it in memory if needed
        return;
      }

      const vehicleNumber = vehicleData.vehicleNumber || '';
      const lat = Number(vehicleData.lat) || 0;
      const lng = Number(vehicleData.lng) || 0;
      if (lat === 0 && lng === 0) return;

      const prevVehicle = prevVehicleRef.current;

      // If vehicle changed (including first selection), reset trail and start with current live point
      if (!prevVehicle || prevVehicle !== vehicleNumber) {
        prevVehicleRef.current = vehicleNumber;
        setTrail([[lat, lng]]);
        try {
          localStorage.setItem(storageKeyFor(vehicleNumber), JSON.stringify([[lat, lng]]));
        } catch (err) {
          console.error("Storage write error:", err);
        }
        // mark that an initial arrival happened — trigger a one-time map zoom to 14
        setShouldInitialZoom(true);
        return; // initialized trail for the new vehicle
      }

      // Same vehicle: append if new unique point
      setTrail((prev: [number, number][]) => {
        const last = prev[prev.length - 1];
        if (last && Math.abs(last[0] - lat) < 1e-6 && Math.abs(last[1] - lng) < 1e-6) {
          return prev;
        }
        const next: [number, number][] = [...prev, [lat, lng] as [number, number]];
        if (next.length > MAX_TRAIL_POINTS) next.splice(0, next.length - MAX_TRAIL_POINTS);
        try {
          if (vehicleNumber) localStorage.setItem(storageKeyFor(vehicleNumber), JSON.stringify(next));
        } catch (err) {
          console.error("Storage write error:", err);
          // ignore storage write errors
        }
        return next;
      });
    }, [vehicleData]);

  // Smoothly animate displayed marker position towards the live currentPosition
  // Use primitives for dependencies to satisfy exhaustive-deps lint rules
  const posLat = currentPosition[0];
  const posLng = currentPosition[1];

  useEffect(() => {
    // Cancel any previous animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

  // Read stable start from ref to avoid retriggering effect when markerPos state updates during animation
  const start: [number, number] = markerPosRef.current;
  const end: [number, number] = [posLat, posLng];

    // If positions are identical, no animation needed
    if (Math.abs(start[0] - end[0]) < 1e-8 && Math.abs(start[1] - end[1]) < 1e-8) {
      return;
    }

    const duration = 800; // milliseconds
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      // easeInOut quad
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const lat = start[0] + (end[0] - start[0]) * eased;
      const lng = start[1] + (end[1] - start[1]) * eased;
      setMarkerPos([lat, lng]);
      // keep ref in sync without causing effect deps change
      markerPosRef.current = [lat, lng];

      // also move underlying leaflet marker if ref available (avoid full React re-render cost)
      try {
        const m = markerRef.current;
        if (m && typeof m.setLatLng === 'function') {
          m.setLatLng([lat, lng] as L.LatLngExpression);
        }
      } catch {
        // ignore errors from direct marker update
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [posLat, posLng]);

  // one-time initial zoom flag
  const [shouldInitialZoom, setShouldInitialZoom] = useState(false);

    return (
        <MapContainer 
          center={initialCenterRef.current} 
          zoom={initialZoomRef.current} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Always render MapUpdater to maintain India view when no vehicle */}
          <MapUpdater
            position={currentPosition}
            isInitial={shouldInitialZoom}
            onInitialHandled={() => setShouldInitialZoom(false)}
            hasVehicleData={!!vehicleData}
          />

          {vehicleData && (
            <>
              {/* Draw the trail including the current position.
                  - If we have 2 or more points, draw a Polyline.
                  - If we have exactly 1 point, draw a small CircleMarker so the trail is visible immediately. */}
              {trail && trail.length > 1 ? (
                <Polyline
                  positions={trail}
                  pathOptions={{ color: '#500000', weight: 12, opacity: 0.9 }}
                />
              ) : (trail && trail.length === 1 && (
                <CircleMarker
                  center={trail[0]}
                  pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 1 }}
                  radius={6}
                />
              ))}

              <Marker position={markerPos} icon={createVehicleLocationIcon(vehicleData)} zIndexOffset={1000} ref={markerRef}>
                <Popup maxWidth={650} maxHeight={420} >
                  <div className="font-sans min-w-[550px] ">
                    <table
                      className="w-full text-sm border border-black rounded overflow-hidden"
                      style={{
                        borderCollapse: "collapse",
                        border: "2px solid black",
                        width: "100%",
                        maxWidth: "650px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            className="py-1 px-2 font-bold border border-black align-top"
                            style={{ width: "120px" }}
                          >
                            Vehicle:
                          </td>
                          <td className="py-1 px-2 border border-black" colSpan={3}>
                            {(() => {
                              const vehicle = vehicles.find((v: Vehicle) => v.vehicleNumber === vehicleData.vehicleNumber);
                              const typeText = formatMaybePopulated(vehicle?.vehicleType, "N/A");
                              const manuText = formatMaybePopulated(vehicle?.vehicleModel?.vehicleModel, "N/A");
                              return `${vehicleData.vehicleNumber} / ${typeText} / ${manuText}`;
                            })()}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 font-bold border border-black align-top">
                            IMEI Number:
                          </td>
                          <td className="py-1 px-2 border border-black" colSpan={3}>
                            {vehicleData.imei}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 font-bold border border-black align-top">
                            Location:
                          </td>
                          <td className="py-1 px-2 border border-black" colSpan={3}>
                            <div className="break-words max-w-[420px]">{address}</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 font-bold border border-black align-top">
                            Date / Time:
                          </td>
                          <td className="py-1 px-2 border border-black">
                            {vehicleData.lastUpdated}
                          </td>
                          <td className="py-1 px-2 font-bold border border-black align-top">
                            Power Status:
                          </td>
                          <td
                            className={`py-1 px-2 border border-black font-semibold ${
                              vehicleData.powerConnected ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {vehicleData.powerConnected ? "Connected" : "Disconnected"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 font-bold border border-black align-top">
                            Speed:
                          </td>
                          <td className="py-1 px-2 border border-black">
                            {vehicleData.speed}
                          </td>
                          <td className="py-1 px-2 font-bold border border-black align-top">
                            Ignition:
                          </td>
                          <td
                            className={`py-1 px-2 border border-black font-semibold ${
                              vehicleData.ignition ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {vehicleData.ignition ? "ON" : "OFF"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
    );
}