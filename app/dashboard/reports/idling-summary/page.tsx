'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchIdlingSummary, clearIdlingSummary, IdlingSummary } from '@/lib/redux/features/idlingSummarySlice';
import { fetchVehicles } from '@/lib/redux/features/vehicleSlice';
import { Search, ChevronLeft, ChevronRight, Calendar, Clock, ChevronDown, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExportButtons from '@/components/dashboard/ExportButtons';
import toast from 'react-hot-toast';

// Headers for export
const headers: { key: keyof IdlingSummary; label: string }[] = [
  { key: 'vehicleNumber', label: 'Vehicle Number' },
  { key: 'imeiNumber', label: 'IMEI' },
  { key: 'serviceType', label: 'Service Type' },
  { key: 'ownerType', label: 'Owner Type' },
  { key: 'totalIdleDuration', label: 'Total Idle Duration' },
];

export default function IdlingSummaryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { reportData, status } = useSelector((state: RootState) => state.idlingSummary);
  const { vehicles, status: vehiclesStatus } = useSelector((state: RootState) => state.vehicle);

  // Filter states
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Table states
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

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

  // Filter vehicles based on search
  const filteredVehicles = vehicles.filter((vehicle) =>
    (vehicle.vehicleNumber || '').toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  // Filter report data based on search
  const filteredData = reportData.filter((item) =>
    item.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.imeiNumber.toLowerCase().includes(searchQuery.toLowerCase())
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

    const startDateTime = startDate && startTime
      ? new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          startTime.getHours(),
          startTime.getMinutes()
        )
      : startDate || null;

    const endDateTime = endDate && endTime
      ? new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          endTime.getHours(),
          endTime.getMinutes()
        )
      : endDate || null;

    if (!startDateTime || !endDateTime) {
      toast.error('Please select both start and end dates');
      return;
    }

    const startDateString = startDateTime.toISOString();
    const endDateString = endDateTime.toISOString();

    dispatch(fetchIdlingSummary({
      startDate: startDateString,
      endDate: endDateString,
      vehicleNumber: selectedVehicle || undefined,
    }));

    // Reset pagination
    setCurrentPage(1);
    setExpandedRows(new Set());
  };

  const handleClear = () => {
    dispatch(clearIdlingSummary());
    setSelectedVehicle('');
    setVehicleSearch('');
    setIsVehicleDropdownOpen(false);
    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    setSearchQuery('');
    setCurrentPage(1);
    setExpandedRows(new Set());
  };

  const handleVehicleSelect = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setVehicleSearch(vehicleNumber);
    setIsVehicleDropdownOpen(false);
  };

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  // Get vehicle number from vehicle object
  const getVehicleNumber = (vehicle: any) => {
    return vehicle.vehicleNumber || vehicle._id || 'N/A';
  };

  // Get selected vehicle name
  const getSelectedVehicleName = () => {
    const vehicle = vehicles.find((v) => getVehicleNumber(v) === selectedVehicle);
    return vehicle ? getVehicleNumber(vehicle) : '';
  };

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6 p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
          Filter Idling Summary Report
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
          <div className="flex-1 min-w-[250px] lg:max-w-[280px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Start Date & Time <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MMM dd, yyyy"
                  placeholderText="Date"
                  className="w-full pl-8 pr-3 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  popperPlacement="bottom-start"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
                <DatePicker
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Time"
                  className="w-full pl-8 pr-3 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  popperPlacement="right-start"
                />
              </div>
            </div>
          </div>

          {/* End Date */}
          <div className="flex-1 min-w-[250px] lg:max-w-[280px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              End Date & Time <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="MMM dd, yyyy"
                  placeholderText="Date"
                  className="w-full pl-8 pr-3 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  popperPlacement="bottom-start"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Time"
                  className="w-full pl-8 pr-3 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  popperPlacement="right-start"
                />
              </div>
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
                <ExportButtons 
                  data={currentData} 
                  headers={headers} 
                  filename="idling-summary" 
                  allData={reportData} 
                />
              </div>
            </div>

            {/* Right Section - Search */}
            <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
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
                  <th className="px-6 py-4 text-left text-sm font-semibold w-12"></th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Vehicle Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">IMEI</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Region</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Depot</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Service Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Owner Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Total Idle Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => {
                    const actualIndex = startIndex + index;
                    const isExpanded = expandedRows.has(actualIndex);
                    return (
                      <>
                        <tr key={item.vehicleNumber} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            {item.details && item.details.length > 0 && (
                              <button
                                onClick={() => toggleRowExpansion(actualIndex)}
                                className="text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)]"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-5 h-5 rotate-180 transition-transform" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 transition-transform" />
                                )}
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                            {item.sNo || actualIndex + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {item.vehicleNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {item.imeiNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {item.region || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {item.depot || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {item.serviceType || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {item.ownerType || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-semibold">
                            {item.totalIdleDuration || 'N/A'}
                          </td>
                        </tr>
                        {isExpanded && item.details && item.details.length > 0 && (
                          <tr>
                            <td colSpan={9} className="px-6 py-4 bg-gray-50">
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Vehicle Number</th>
                                      <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Idling Start Time</th>
                                      <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Idling End Time</th>
                                      <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Duration</th>
                                      <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Location</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.details.map((detail, detailIndex) => (
                                      <tr key={detailIndex} className="border-b border-gray-200">
                                        <td className="px-4 py-2 text-xs text-[var(--text-primary)]">{detail.vehicleNumber}</td>
                                        <td className="px-4 py-2 text-xs text-[var(--text-primary)]">{detail.idlingStartTime}</td>
                                        <td className="px-4 py-2 text-xs text-[var(--text-primary)]">{detail.idlingEndTime}</td>
                                        <td className="px-4 py-2 text-xs text-[var(--text-primary)]">{detail.totalIdleDuration}</td>
                                        <td className="px-4 py-2 text-xs text-[var(--text-primary)]">{detail.idlingLocation || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-[var(--text-secondary)]">
              Showing results {startIndex + 1} out of {filteredData.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 bg-[var(--primary-orange)] text-white rounded-lg font-semibold">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-12 text-center">
          <div className="text-[var(--text-secondary)]">
            {status === 'loading' ? (
              <div className="text-lg">Loading idling summary...</div>
            ) : (
              <div>
                <p className="text-lg mb-2">No idling summary data available</p>
                <p className="text-sm">Please select filters and click Generate Report to view idling summary</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
