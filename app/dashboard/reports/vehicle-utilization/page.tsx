'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchVehicleUtilization, clearUtilizationReport, DailyUtilization, ReportSummary } from '@/lib/redux/features/utilizationReportSlice';
import { fetchVehicles } from '@/lib/redux/features/vehicleSlice';
import { Search, ChevronLeft, ChevronRight, Calendar, ChevronDown, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExportButtons from '@/components/dashboard/ExportButtons';
import toast from 'react-hot-toast';

// Headers for export - Daily Utilization
const headers: { key: keyof DailyUtilization; label: string }[] = [
  { key: 'vehicleNumber', label: 'Vehicle Number' },
  { key: 'manufacturerName', label: 'Manufacturer' },
  { key: 'vehicleType', label: 'Vehicle Type' },
  { key: 'model', label: 'Model' },
  { key: 'date', label: 'Date' },
  { key: 'stoppageDuration', label: 'Stoppage Duration' },
  { key: 'idleDuration', label: 'Idle Duration' },
  { key: 'journeyDuration', label: 'Journey Duration' },
  { key: 'journeyTravelled', label: 'Journey Travelled' },
];

export default function VehicleUtilizationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, utilization, status } = useSelector((state: RootState) => state.utilizationReport);
  const { vehicles, status: vehiclesStatus } = useSelector((state: RootState) => state.vehicle);

  // Filter states
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Table states
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch vehicles on mount
  useEffect(() => {
    if (vehiclesStatus === 'idle') {
      dispatch(fetchVehicles());
    }
  }, [dispatch, vehiclesStatus]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-vehicle-dropdown]')) {
        setIsVehicleDropdownOpen(false);
      }
    };

    if (isVehicleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVehicleDropdownOpen]);

  // Helper function to get vehicle number
  const getVehicleNumber = (vehicle: any) => {
    return vehicle.vehicleNumber || vehicle.registrationNumber || '';
  };

  // Filter vehicles based on search
  const filteredVehicles = vehicles.filter((vehicle) =>
    getVehicleNumber(vehicle).toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  // Filter utilization data based on search
  const filteredData = utilization.filter((item) =>
    item.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleGenerate = () => {
    if (!selectedVehicle || !startDate || !endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const startDateString = startDate.toISOString();
    const endDateString = endDate.toISOString();

    dispatch(fetchVehicleUtilization({
      vehicleNumber: selectedVehicle,
      startDate: startDateString,
      endDate: endDateString,
    }));

    // Reset pagination
    setCurrentPage(1);
  };

  const handleClear = () => {
    dispatch(clearUtilizationReport());
    setSelectedVehicle('');
    setVehicleSearch('');
    setIsVehicleDropdownOpen(false);
    setStartDate(null);
    setEndDate(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleVehicleSelect = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setVehicleSearch(vehicleNumber);
    setIsVehicleDropdownOpen(false);
  };

  const getSelectedVehicleName = () => {
    return selectedVehicle;
  };

  // Calculate serial number based on current page
  const getSerialNumber = (index: number) => {
    return startIndex + index + 1;
  };

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6 p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
          Filter Vehicle Utilization Report
        </h2>
        
        <div className="flex flex-col md:flex-row lg:flex-row gap-6 flex-wrap">
          {/* Vehicle Searchable Select */}
          <div className="flex-1 min-w-[250px] lg:max-w-[300px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Vehicle <span className="text-red-500">*</span>
            </label>
            <div className="relative" data-vehicle-dropdown>
              {/* Search Input with Dropdown */}
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

          {/* Start Date */}
          <div className="flex-1 min-w-[250px] lg:max-w-[250px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MMM dd, yyyy"
                placeholderText="Select start date"
                className="w-full pl-10 pr-3 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                popperPlacement="bottom-start"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="flex-1 min-w-[250px] lg:max-w-[250px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="MMM dd, yyyy"
                placeholderText="Select end date"
                className="w-full pl-10 pr-3 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                popperPlacement="bottom-start"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-end gap-3 min-w-[200px] lg:min-w-[250px]">
            <button
              onClick={handleGenerate}
              disabled={!selectedVehicle || !startDate || !endDate || status === 'loading'}
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

      {/* Summary Section */}
      {summary && (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6 p-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <div className="text-sm text-[var(--text-secondary)] mb-1">Vehicle Number</div>
              <div className="text-lg font-semibold text-[var(--text-primary)]">{summary.vehicleNumber}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--text-secondary)] mb-1">Start Time</div>
              <div className="text-lg font-semibold text-[var(--text-primary)]">{summary.startTime}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--text-secondary)] mb-1">End Time</div>
              <div className="text-lg font-semibold text-[var(--text-primary)]">{summary.endTime}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--text-secondary)] mb-1">Total Days</div>
              <div className="text-lg font-semibold text-[var(--text-primary)]">{summary.totalDays}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--text-secondary)] mb-1">Total Journey Travelled</div>
              <div className="text-lg font-semibold text-[var(--text-primary)]">{summary.totalJourneyTravelled}</div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      {utilization.length > 0 && (
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
                <ExportButtons data={currentData} headers={headers} filename="vehicle-utilization" allData={utilization} />
              </div>
            </div>

            {/* Right Section - Search */}
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
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      {utilization.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--navy-dark)] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Vehicle Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Manufacturer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Vehicle Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Model</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Stoppage Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Idle Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Journey Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Journey Travelled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {currentData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.vehicleNumber}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.manufacturerName}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.vehicleType}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.model}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.stoppageDuration}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.idleDuration}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.journeyDuration}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{item.journeyTravelled}</td>
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
          <p className="text-[var(--text-secondary)]">Loading report...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">No data available. Please generate a report.</p>
        </div>
      )}
    </div>
  );
}
