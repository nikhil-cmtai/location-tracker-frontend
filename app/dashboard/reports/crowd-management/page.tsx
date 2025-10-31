'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchCrowdManagementData, CrowdVehicleEntry } from '@/lib/redux/features/crowdSlice';
import { fetchGeoFences } from '@/lib/redux/features/geoFenceSlice';
import { Search, ChevronLeft, ChevronRight, Calendar, Clock, ChevronDown, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExportButtons from '@/components/dashboard/ExportButtons';
import toast from 'react-hot-toast';

// Headers for export
const headers: { key: keyof CrowdVehicleEntry; label: string }[] = [
  { key: 'vehicle_reg_no', label: 'Vehicle Number' },
  { key: 'imei', label: 'IMEI' },
];

type CriteriaOption = 'entry' | 'exit' | 'entryexit';

export default function CrowdManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { geoFences, status: geoFencesStatus } = useSelector((state: RootState) => state.geoFence);
  const { vehicles: crowdVehicles, pagination, summary, status: crowdStatus } = useSelector((state: RootState) => state.crowd);

  // Filter states
  const [selectedGeoFence, setSelectedGeoFence] = useState('');
  const [geoFenceSearch, setGeoFenceSearch] = useState('');
  const [isGeoFenceDropdownOpen, setIsGeoFenceDropdownOpen] = useState(false);
  const [criteria, setCriteria] = useState<CriteriaOption>('entry');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Table states
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch geo-fences on mount
  useEffect(() => {
    if (geoFencesStatus === 'idle') {
      dispatch(fetchGeoFences());
    }
  }, [dispatch, geoFencesStatus]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-geo-fence-dropdown]')) {
        setIsGeoFenceDropdownOpen(false);
      }
    };

    if (isGeoFenceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isGeoFenceDropdownOpen]);

  // Update current page when pagination changes
  useEffect(() => {
    if (pagination) {
      setCurrentPage(pagination.currentPage);
      setItemsPerPage(pagination.itemsPerPage);
    }
  }, [pagination]);

  // Filter geo-fences based on search
  const filteredGeoFences = geoFences.filter((fence) =>
    fence.city.toLowerCase().includes(geoFenceSearch.toLowerCase())
  );

  // Filter vehicles based on search
  const filteredVehicles = crowdVehicles.filter((vehicle) =>
    vehicle.vehicle_reg_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.imei.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerate = () => {
    if (!selectedGeoFence || !startDate || !endDate) {
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

    // Format criteria for API
    let criteriaValue = criteria === 'entryexit' ? 'entryexit' : criteria;

    dispatch(fetchCrowdManagementData({
      geoFence: selectedGeoFence,
      criteria: criteriaValue,
      startDate: startDateString,
      endDate: endDateString,
      page: 1,
    }));

    // Reset pagination
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSelectedGeoFence('');
    setGeoFenceSearch('');
    setIsGeoFenceDropdownOpen(false);
    setCriteria('entry');
    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleGeoFenceSelect = (fenceId: string, city: string) => {
    setSelectedGeoFence(fenceId);
    setGeoFenceSearch(city);
    setIsGeoFenceDropdownOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (!selectedGeoFence || !startDate || !endDate) return;

    const startDateTime = startDate && startTime
      ? new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          startTime.getHours(),
          startTime.getMinutes()
        )
      : startDate;

    const endDateTime = endDate && endTime
      ? new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          endTime.getHours(),
          endTime.getMinutes()
        )
      : endDate;

    const startDateString = startDateTime.toISOString();
    const endDateString = endDateTime.toISOString();

    let criteriaValue = criteria === 'entryexit' ? 'entryexit' : criteria;

    dispatch(fetchCrowdManagementData({
      geoFence: selectedGeoFence,
      criteria: criteriaValue,
      startDate: startDateString,
      endDate: endDateString,
      page: newPage,
    }));
  };

  // Get selected geo-fence name
  const getSelectedGeoFenceName = () => {
    const fence = geoFences.find((f) => f._id === selectedGeoFence);
    return fence ? fence.city : '';
  };

  const totalPages = pagination?.totalPages || 1;
  const currentVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6 p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
          Filter Crowd Management Report
        </h2>
        
        <div className="flex flex-col md:flex-row lg:flex-row gap-6 flex-wrap">
          {/* Geo-Fence Searchable Select */}
          <div className="flex-1 min-w-[250px] lg:max-w-[300px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Geo-Fence <span className="text-red-500">*</span>
            </label>
            <div className="relative" data-geo-fence-dropdown>
              {/* Search Input with Dropdown */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10" />
                <input
                  type="text"
                  placeholder="Search and select geo-fence..."
                  value={selectedGeoFence && !isGeoFenceDropdownOpen ? getSelectedGeoFenceName() : geoFenceSearch}
                  onChange={(e) => {
                    setGeoFenceSearch(e.target.value);
                    setIsGeoFenceDropdownOpen(true);
                    if (selectedGeoFence && e.target.value !== getSelectedGeoFenceName()) {
                      setSelectedGeoFence('');
                    }
                  }}
                  onFocus={() => {
                    setIsGeoFenceDropdownOpen(true);
                    if (selectedGeoFence) {
                      setGeoFenceSearch(getSelectedGeoFenceName());
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] cursor-pointer"
                />
                {(geoFenceSearch || selectedGeoFence) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGeoFenceSearch('');
                      setSelectedGeoFence('');
                      setIsGeoFenceDropdownOpen(false);
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none transition-transform ${isGeoFenceDropdownOpen ? 'rotate-180' : ''}`} />
                
                {/* Dropdown Options */}
                {isGeoFenceDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--border-light)] rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredGeoFences.length > 0 ? (
                      filteredGeoFences.map((fence) => (
                        <button
                          key={fence._id}
                          onClick={() => handleGeoFenceSelect(fence._id, fence.city)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--primary-orange-light)] transition-colors ${
                            selectedGeoFence === fence._id ? 'bg-[var(--primary-orange-light)] font-semibold' : ''
                          }`}
                        >
                          <div className="text-[var(--text-primary)]">{fence.city}</div>
                          <div className="text-xs text-[var(--text-secondary)]">Radius: {fence.radius}m</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-[var(--text-secondary)]">No geo-fence found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Criteria Selection */}
          <div className="flex-1 min-w-[200px] lg:max-w-[250px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Criteria <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={criteria}
                onChange={(e) => setCriteria(e.target.value as CriteriaOption)}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
              >
                <option value="entry">Entry Only</option>
                <option value="exit">Exit Only</option>
                <option value="entryexit">Entry & Exit</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
            </div>
          </div>

          {/* Start Date */}
          <div className="flex-1 min-w-[250px] lg:max-w-[280px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Start Date <span className="text-red-500">*</span>
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
              End Date <span className="text-red-500">*</span>
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
              disabled={!selectedGeoFence || !startDate || !endDate || crowdStatus === 'loading'}
              className="flex-1 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {crowdStatus === 'loading' ? 'Loading...' : 'Generate Report'}
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
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            Report Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Total Vehicles</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {summary.totalVehicles || 0}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Total Events</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {summary.totalEvents || 0}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Criteria</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {summary.criteria || 'N/A'}
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Geo-Fence Radius</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {summary.geofence?.radiusMeters || 0} m
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      {crowdVehicles.length > 0 && (
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
                  data={currentVehicles} 
                  headers={headers} 
                  filename="crowd-management" 
                  allData={crowdVehicles} 
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
      {crowdVehicles.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--navy-dark)] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Vehicle Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">IMEI</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Event Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Entry Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Exit Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Still Inside</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {currentVehicles.length > 0 ? (
                  currentVehicles.map((vehicle, vehicleIndex) => {
                    // Flatten events for display
                    return vehicle.events.map((event: any, eventIndex: number) => {
                      const serialNumber = vehicleIndex * vehicle.events.length + eventIndex + 1;
                      return (
                        <tr key={`${vehicle.vehicle_reg_no}-${eventIndex}`} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                            {serialNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {vehicle.vehicle_reg_no}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {vehicle.imei}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                event.eventType === 'ENTRY'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {event.eventType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {event.entryTime || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {event.exitTime || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                            {event.durationFormatted || `${event.durationMinutes || 0} min`}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                event.stillInside
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {event.stillInside ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      );
                    });
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-[var(--text-secondary)]">
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
              {pagination ? (
                <>
                  Showing results {pagination.currentPage * pagination.itemsPerPage - pagination.itemsPerPage + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} out of{' '}
                  {pagination.totalItems}
                </>
              ) : (
                `Showing results 1 out of ${filteredVehicles.length}`
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || crowdStatus === 'loading'}
                className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 bg-[var(--primary-orange)] text-white rounded-lg font-semibold">
                {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || crowdStatus === 'loading'}
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
            {crowdStatus === 'loading' ? (
              <div className="text-lg">Loading crowd management data...</div>
            ) : (
              <div>
                <p className="text-lg mb-2">No crowd management data available</p>
                <p className="text-sm">Please select filters and click Generate Report to view crowd management data</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
