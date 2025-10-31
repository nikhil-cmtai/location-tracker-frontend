'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchLatestFirmware, clearFirmwareInfo, FirmwareInfo } from '@/lib/redux/features/firmwareSlice';
import { fetchVehicles } from '@/lib/redux/features/vehicleSlice';
import { fetchVltDevices } from '@/lib/redux/features/vltDeviceSlice';
import { Search, ChevronDown, X } from 'lucide-react';
import ExportButtons from '@/components/dashboard/ExportButtons';
import toast from 'react-hot-toast';

// Headers for export
const headers: { key: keyof FirmwareInfo; label: string }[] = [
  { key: 'serialNo', label: 'S.No' },
  { key: 'imeiNumber', label: 'IMEI Number' },
  { key: 'deviceMake', label: 'Device Make' },
  { key: 'deviceModel', label: 'Device Model' },
  { key: 'mappedVehicle', label: 'Mapped Vehicle' },
  { key: 'lastReportedDateTime', label: 'Last Reported Date/Time' },
  { key: 'firmwareVersion', label: 'Firmware Version' },
];

export default function FirmwareDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { deviceInfo, status } = useSelector((state: RootState) => state.firmware);
  const { vehicles, status: vehiclesStatus } = useSelector((state: RootState) => state.vehicle);
  const { vltDevices, status: vltDevicesStatus } = useSelector((state: RootState) => state.vltDevice);

  // Selection type state
  const [selectionType, setSelectionType] = useState<'imei' | 'vehicle' | null>(null);

  // IMEI states
  const [selectedImei, setSelectedImei] = useState('');
  const [imeiSearch, setImeiSearch] = useState('');
  const [isImeiDropdownOpen, setIsImeiDropdownOpen] = useState(false);

  // Vehicle states
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

  // Fetch vehicles and VLT devices on mount
  useEffect(() => {
    if (vehiclesStatus === 'idle') {
      dispatch(fetchVehicles());
    }
    if (vltDevicesStatus === 'idle') {
      dispatch(fetchVltDevices());
    }
  }, [dispatch, vehiclesStatus, vltDevicesStatus]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-imei-dropdown]') && !target.closest('[data-vehicle-dropdown]')) {
        setIsImeiDropdownOpen(false);
        setIsVehicleDropdownOpen(false);
      }
    };

    if (isImeiDropdownOpen || isVehicleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isImeiDropdownOpen, isVehicleDropdownOpen]);

  // Helper function to get vehicle number
  const getVehicleNumber = (vehicle: any) => {
    return vehicle.vehicleNumber || vehicle.registrationNumber || '';
  };

  // Filter IMEIs based on search
  const filteredImeis = vltDevices.filter((device) =>
    device.imeiNumber.toString().toLowerCase().includes(imeiSearch.toLowerCase())
  );

  // Filter vehicles based on search
  const filteredVehicles = vehicles.filter((vehicle) =>
    getVehicleNumber(vehicle).toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  const handleImeiSelect = (imei: string) => {
    setSelectedImei(imei);
    setImeiSearch(imei);
    setIsImeiDropdownOpen(false);
    setSelectionType('imei');
    // Clear vehicle selection when IMEI is selected
    setSelectedVehicle('');
    setVehicleSearch('');
    setIsVehicleDropdownOpen(false);
    
    // Fetch firmware details
    dispatch(fetchLatestFirmware(imei));
  };

  const handleVehicleSelect = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setVehicleSearch(vehicleNumber);
    setIsVehicleDropdownOpen(false);
    setSelectionType('vehicle');
    // Clear IMEI selection when vehicle is selected
    setSelectedImei('');
    setImeiSearch('');
    setIsImeiDropdownOpen(false);
    
    // Fetch firmware details
    dispatch(fetchLatestFirmware(vehicleNumber));
  };

  const handleClear = () => {
    dispatch(clearFirmwareInfo());
    setSelectedImei('');
    setImeiSearch('');
    setIsImeiDropdownOpen(false);
    setSelectedVehicle('');
    setVehicleSearch('');
    setIsVehicleDropdownOpen(false);
    setSelectionType(null);
  };

  // Prepare data for display
  const displayData = deviceInfo ? [deviceInfo] : [];

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6 p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
          Firmware Details
        </h2>
        
        <div className="flex flex-col md:flex-row lg:flex-row gap-6 flex-wrap">
          {/* IMEI Searchable Select */}
          <div className="flex-1 min-w-[250px] lg:max-w-[300px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Select IMEI
            </label>
            <div className="relative" data-imei-dropdown>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10" />
                <input
                  type="text"
                  placeholder="Search and select IMEI..."
                  value={selectedImei && !isImeiDropdownOpen ? selectedImei : imeiSearch}
                  onChange={(e) => {
                    setImeiSearch(e.target.value);
                    setIsImeiDropdownOpen(true);
                    if (selectedImei && e.target.value !== selectedImei) {
                      setSelectedImei('');
                      setSelectionType(null);
                    }
                  }}
                  onFocus={() => {
                    setIsImeiDropdownOpen(true);
                    if (selectedImei) {
                      setImeiSearch(selectedImei);
                    }
                    // Clear vehicle selection when focusing on IMEI
                    if (selectedVehicle) {
                      setSelectedVehicle('');
                      setVehicleSearch('');
                      setSelectionType(null);
                      dispatch(clearFirmwareInfo());
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] cursor-pointer"
                />
                {(imeiSearch || selectedImei) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImeiSearch('');
                      setSelectedImei('');
                      setIsImeiDropdownOpen(false);
                      setSelectionType(null);
                      dispatch(clearFirmwareInfo());
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none transition-transform ${isImeiDropdownOpen ? 'rotate-180' : ''}`} />
                
                {/* Dropdown Options */}
                {isImeiDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--border-light)] rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredImeis.length > 0 ? (
                      filteredImeis.map((device) => (
                        <button
                          key={device._id}
                          onClick={() => handleImeiSelect(device.imeiNumber.toString())}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--primary-orange-light)] transition-colors ${
                            selectedImei === device.imeiNumber.toString() ? 'bg-[var(--primary-orange-light)] font-semibold' : ''
                          }`}
                        >
                          {device.imeiNumber}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-[var(--text-secondary)]">No IMEI found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Searchable Select */}
          <div className="flex-1 min-w-[250px] lg:max-w-[300px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Select Vehicle
            </label>
            <div className="relative" data-vehicle-dropdown>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10" />
                <input
                  type="text"
                  placeholder="Search and select vehicle..."
                  value={selectedVehicle && !isVehicleDropdownOpen ? selectedVehicle : vehicleSearch}
                  onChange={(e) => {
                    setVehicleSearch(e.target.value);
                    setIsVehicleDropdownOpen(true);
                    if (selectedVehicle && e.target.value !== selectedVehicle) {
                      setSelectedVehicle('');
                      setSelectionType(null);
                    }
                  }}
                  onFocus={() => {
                    setIsVehicleDropdownOpen(true);
                    if (selectedVehicle) {
                      setVehicleSearch(selectedVehicle);
                    }
                    // Clear IMEI selection when focusing on vehicle
                    if (selectedImei) {
                      setSelectedImei('');
                      setImeiSearch('');
                      setSelectionType(null);
                      dispatch(clearFirmwareInfo());
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] cursor-pointer"
                />
                {(vehicleSearch || selectedVehicle) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVehicleSearch('');
                      setSelectedVehicle('');
                      setIsVehicleDropdownOpen(false);
                      setSelectionType(null);
                      dispatch(clearFirmwareInfo());
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none transition-transform ${isVehicleDropdownOpen ? 'rotate-180' : ''}`} />
                
                {/* Dropdown Options */}
                {isVehicleDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--border-light)] rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => {
                        const vehicleNumber = getVehicleNumber(vehicle);
                        return (
                          <button
                            key={vehicle._id}
                            onClick={() => handleVehicleSelect(vehicleNumber)}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--primary-orange-light)] transition-colors ${
                              selectedVehicle === vehicleNumber ? 'bg-[var(--primary-orange-light)] font-semibold' : ''
                            }`}
                          >
                            {vehicleNumber}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-2 text-sm text-[var(--text-secondary)]">No vehicle found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clear Button */}
          <div className="flex items-end gap-3 min-w-[200px] lg:min-w-[150px]">
            <button
              onClick={handleClear}
              className="px-4 py-3 border-2 border-[var(--primary-orange)] text-[var(--primary-orange)] rounded-lg font-medium hover:bg-[var(--primary-orange-light)] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Header Section */}
      {deviceInfo && (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6">
          <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <ExportButtons data={displayData} headers={headers} filename="firmware-details" allData={displayData} />
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      {deviceInfo ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--navy-dark)] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">IMEI Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Device Make</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Device Model</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Mapped Vehicle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Last Reported Date/Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Firmware Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{deviceInfo.serialNo}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{deviceInfo.imeiNumber}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{deviceInfo.deviceMake}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{deviceInfo.deviceModel}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{deviceInfo.mappedVehicle}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{deviceInfo.lastReportedDateTime}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{deviceInfo.firmwareVersion}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : status === 'loading' ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">Loading firmware details...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">Please select an IMEI or Vehicle to view firmware details.</p>
        </div>
      )}
    </div>
  );
}
