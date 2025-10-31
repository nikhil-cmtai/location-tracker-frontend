'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchActivationCheck, clearActivationCheck, ActivationCheck } from '@/lib/redux/features/activationCheckSlice';
import { fetchVehicles } from '@/lib/redux/features/vehicleSlice';
import { fetchVltDevices } from '@/lib/redux/features/vltDeviceSlice';
import { Search, ChevronLeft, ChevronRight, ChevronDown, X, RefreshCw } from 'lucide-react';
import ExportButtons from '@/components/dashboard/ExportButtons';
import toast from 'react-hot-toast';

// Headers for export
const headers: { key: keyof ActivationCheck; label: string }[] = [
  { key: 'sNo', label: 'S.No' },
  { key: 'vehicleNumber', label: 'Vehicle Number' },
  { key: 'imeiNumber', label: 'IMEI' },
  { key: 'deviceModel', label: 'Device Model' },
  { key: 'deviceManufacturer', label: 'Device Manufacturer' },
  { key: 'activationStatus', label: 'Activation Status' },
  { key: 'planName', label: 'Plan Name' },
  { key: 'activationDate', label: 'Activation Date' },
  { key: 'expiryDate', label: 'Expiry Date' },
  { key: 'lastUpdate', label: 'Last Update' },
];

export default function ActivationCheckPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { reportData, status } = useSelector((state: RootState) => state.activationCheck);
  const { vehicles, status: vehiclesStatus } = useSelector((state: RootState) => state.vehicle);
  const { vltDevices, status: vltDevicesStatus } = useSelector((state: RootState) => state.vltDevice);

  // Filter states
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [selectedImei, setSelectedImei] = useState('');
  const [imeiSearch, setImeiSearch] = useState('');
  const [isImeiDropdownOpen, setIsImeiDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Table states
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
      if (!target.closest('[data-vehicle-dropdown]') && !target.closest('[data-imei-dropdown]')) {
        setIsVehicleDropdownOpen(false);
        setIsImeiDropdownOpen(false);
      }
    };

    if (isVehicleDropdownOpen || isImeiDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVehicleDropdownOpen, isImeiDropdownOpen]);

  // Helper function to get vehicle number
  const getVehicleNumber = (vehicle: any) => {
    return vehicle.vehicleNumber || vehicle.registrationNumber || '';
  };

  // Filter vehicles based on search
  const filteredVehicles = vehicles.filter((vehicle) =>
    getVehicleNumber(vehicle).toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  // Filter IMEIs based on search
  const filteredImeis = vltDevices.filter((device) =>
    device.imeiNumber.toString().toLowerCase().includes(imeiSearch.toLowerCase())
  );

  // Filter report data based on search and status
  const filteredData = reportData.filter((item) => {
    const matchesSearch = item.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.imeiNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deviceManufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.planName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !selectedStatus || item.activationStatus === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleGenerate = () => {
    const params: any = {};
    
    if (selectedVehicle) {
      params.vehicleNumber = selectedVehicle;
    }
    
    if (selectedImei) {
      params.imeiNumber = selectedImei;
    }
    
    if (selectedStatus) {
      params.status = selectedStatus;
    }

    dispatch(fetchActivationCheck(params));

    // Reset pagination
    setCurrentPage(1);
  };

  const handleClear = () => {
    dispatch(clearActivationCheck());
    setSelectedVehicle('');
    setVehicleSearch('');
    setIsVehicleDropdownOpen(false);
    setSelectedImei('');
    setImeiSearch('');
    setIsImeiDropdownOpen(false);
    setSelectedStatus('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleVehicleSelect = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setVehicleSearch(vehicleNumber);
    setIsVehicleDropdownOpen(false);
  };

  const handleImeiSelect = (imei: string) => {
    setSelectedImei(imei);
    setImeiSearch(imei);
    setIsImeiDropdownOpen(false);
  };

  const getSelectedVehicleName = () => {
    return selectedVehicle;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      case 'Expired':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate serial number based on current page
  const getSerialNumber = (index: number) => {
    return startIndex + index + 1;
  };

  // Auto-fetch on mount (fetch all activation checks)
  useEffect(() => {
    dispatch(fetchActivationCheck({}));
  }, [dispatch]);

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6 p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
          Filter Activation Check
        </h2>
        
        <div className="flex flex-col md:flex-row lg:flex-row gap-6 flex-wrap">
          {/* Vehicle Searchable Select */}
          <div className="flex-1 min-w-[250px] lg:max-w-[300px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Vehicle (Optional)
            </label>
            <div className="relative" data-vehicle-dropdown>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10" />
                <input
                  type="text"
                  placeholder="Search and select vehicle..."
                  value={selectedVehicle && !isVehicleDropdownOpen ? getSelectedVehicleName() : vehicleSearch}
                  onChange={(e) => {
                    setVehicleSearch(e.target.value);
                    setIsVehicleDropdownOpen(true);
                    if (selectedVehicle && e.target.value !== getSelectedVehicleName()) {
                      setSelectedVehicle('');
                    }
                  }}
                  onFocus={() => {
                    setIsVehicleDropdownOpen(true);
                    if (selectedVehicle) {
                      setVehicleSearch(getSelectedVehicleName());
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
                    <button
                      onClick={() => handleVehicleSelect('')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--primary-orange-light)] transition-colors ${
                        selectedVehicle === '' ? 'bg-[var(--primary-orange-light)] font-semibold' : ''
                      }`}
                    >
                      All Vehicles
                    </button>
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

          {/* IMEI Searchable Select */}
          <div className="flex-1 min-w-[250px] lg:max-w-[300px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              IMEI (Optional)
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
                    }
                  }}
                  onFocus={() => {
                    setIsImeiDropdownOpen(true);
                    if (selectedImei) {
                      setImeiSearch(selectedImei);
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
                    <button
                      onClick={() => handleImeiSelect('')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--primary-orange-light)] transition-colors ${
                        selectedImei === '' ? 'bg-[var(--primary-orange-light)] font-semibold' : ''
                      }`}
                    >
                      All IMEIs
                    </button>
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

          {/* Status Filter */}
          <div className="flex-1 min-w-[200px] lg:max-w-[200px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Status (Optional)
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] bg-white"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-3 min-w-[200px] lg:min-w-[250px]">
            <button
              onClick={handleGenerate}
              disabled={status === 'loading'}
              className="flex-1 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Loading...' : 'Generate Report'}
            </button>
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
      {reportData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6">
          <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
            {/* Left Section - Shows & Export Buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)]">Shows</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-[var(--border-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                <ExportButtons data={currentData} headers={headers} filename="activation-check" allData={reportData} />
              </div>
            </div>

            {/* Right Section - Search & Refresh */}
            <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={status === 'loading'}
                className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 text-[var(--text-primary)] ${status === 'loading' ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium text-[var(--text-primary)]">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      {reportData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--navy-dark)] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Vehicle Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">IMEI</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Device Model</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Device Manufacturer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Activation Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Plan Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Activation Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {currentData.map((item, index) => (
                  <tr key={item.sNo || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">{item.vehicleNumber}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.imeiNumber}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.deviceModel}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.deviceManufacturer}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.activationStatus)}`}>
                        {item.activationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.planName}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.activationDate}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.expiryDate}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between">
              <div className="text-sm text-[var(--text-secondary)]">
                Showing <span className="font-semibold text-[var(--text-primary)]">{startIndex + 1}</span> to{' '}
                <span className="font-semibold text-[var(--text-primary)]">{Math.min(endIndex, filteredData.length)}</span> of{' '}
                <span className="font-semibold text-[var(--text-primary)]">{filteredData.length}</span> entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : status === 'loading' ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">Loading activation check data...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">No data available. Please generate a report.</p>
        </div>
      )}
    </div>
  );
}
