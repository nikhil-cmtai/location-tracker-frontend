'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchVehicleStatus, VehicleStatus } from '@/lib/redux/features/vehicleStatusSlice';
import { Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import ExportButtons from '@/components/dashboard/ExportButtons';

// Headers for export
const headers: { key: keyof VehicleStatus; label: string }[] = [
  { key: 'vehicleNumber', label: 'Vehicle Number' },
  { key: 'imeiNumber', label: 'IMEI' },
  { key: 'status', label: 'Status' },
  { key: 'speed', label: 'Speed' },
  { key: 'batteryStatus', label: 'Battery Status' },
  { key: 'lastLocation', label: 'Last Location' },
  { key: 'lastUpdate', label: 'Last Update' },
  { key: 'ignition', label: 'Ignition' },
  { key: 'mainPower', label: 'Main Power' },
  { key: 'gsmSignal', label: 'GSM Signal' },
  { key: 'satellites', label: 'Satellites' },
];

export default function CurrentStatusPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicleStatuses, isConnected, loading } = useSelector((state: RootState) => state.vehicleStatus);

  // Table states
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Convert vehicleStatuses object to array
  const vehicleStatusArray = Object.values(vehicleStatuses);

  // Filter vehicles based on search
  const filteredData = vehicleStatusArray.filter((vehicle) =>
    vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.imeiNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.lastLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Fetch vehicle statuses on mount
  useEffect(() => {
    dispatch(fetchVehicleStatus());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchVehicleStatus());
    setCurrentPage(1);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running':
        return 'bg-green-100 text-green-700';
      case 'Idle':
        return 'bg-yellow-100 text-yellow-700';
      case 'Stopped':
        return 'bg-orange-100 text-orange-700';
      case 'Offline':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate serial number based on current page
  const getSerialNumber = (index: number) => {
    return startIndex + index + 1;
  };

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6">
        <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Left Section - Live Feed Status */}
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Live feed connected
            </span>
          </div>

          {/* Right Section - Search and Refresh */}
          <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 text-[var(--text-primary)] ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium text-[var(--text-primary)]">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {vehicleStatusArray.length > 0 ? (
        <>
          {/* Header with Export Buttons */}
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
                  <ExportButtons data={currentData} headers={headers} filename="current-status" allData={filteredData} />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--navy-dark)] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">S.No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Vehicle Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">IMEI</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Speed</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Battery Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Last Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Last Update</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Ignition</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Main Power</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">GSM Signal</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Satellites</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-light)]">
                  {currentData.map((vehicle, index) => (
                    <tr key={vehicle.vehicleNumber} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{getSerialNumber(index)}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">{vehicle.vehicleNumber}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{vehicle.imeiNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{vehicle.speed}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{vehicle.batteryStatus}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{vehicle.lastLocation}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{vehicle.lastUpdate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vehicle.ignition ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {vehicle.ignition ? 'ON' : 'OFF'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vehicle.mainPower ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {vehicle.mainPower ? 'ON' : 'OFF'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{vehicle.gsmSignal}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{vehicle.satellites}</td>
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
        </>
      ) : loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">Loading vehicle status...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">No vehicle status available.</p>
        </div>
      )}
    </div>
  );
}
