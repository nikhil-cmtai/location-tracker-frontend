'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVehicles } from '@/lib/redux/features/vehicleSlice';

// Dynamic import to avoid SSR issues with Leaflet
const LiveTrackingMap = dynamic(
  () => import('@/components/dashboard/tracking/LiveTrackingMap'),
  { ssr: false }
);

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
  new?: boolean;
}

export default function LiveTrackingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, status } = useSelector((state: RootState) => state.vehicle);
  
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleData, setVehicleData] = useState<LiveTrackingData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicles());
    }
  }, [dispatch, status]);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    
    // TODO: Fetch live tracking data from API
    // For now, using sample data
    if (vehicleId) {
      const selectedVehicleData = vehicles.find(v => v._id === vehicleId);
      if (selectedVehicleData) {
        const sampleData: LiveTrackingData = {
          lat: 26.8467,
          lng: 80.9462,
          speed: '45 km/h',
          ignition: true,
          powerConnected: true,
          battery: 85,
          lastUpdated: new Date().toLocaleString(),
          vehicleNumber: selectedVehicleData.vehicleNumber,
          vehicleType: 'Bus',
          vehicleModel: 'Tata',
          imei: '123456789012345',
          heading: 45,
          lastUpdatedAtISTStored: new Date().toISOString(),
          new: false
        };
        setVehicleData(sampleData);
      }
    } else {
      setVehicleData(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Vehicle Selector at Top */}
      <div className="bg-white border-b border-[var(--border-light)] p-4 flex-shrink-0">
        <div className="max-w-md">
          <label htmlFor="vehicle-select" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Select Vehicle
          </label>
          <select
            id="vehicle-select"
            value={selectedVehicle}
            onChange={(e) => handleVehicleSelect(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.vehicleNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Container - Full Width/Height */}
      <div className="flex-1 relative">
        <LiveTrackingMap vehicleData={vehicleData} />
        
        {/* Overlay message when no vehicle selected */}
        {!vehicleData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center max-w-md">
              <p className="text-lg text-[var(--text-primary)] font-semibold mb-2">
                No vehicle selected
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Select a vehicle to view live tracking
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}