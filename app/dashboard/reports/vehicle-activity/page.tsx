'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchVehicleActivity, clearActivityData, ActivityPacket } from '@/lib/redux/features/vehicleActivitySlice';
import { fetchVehicles } from '@/lib/redux/features/vehicleSlice';
import { Search, ChevronLeft, ChevronRight, Calendar, Clock, ChevronDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExportButtons from '@/components/dashboard/ExportButtons';

// Headers for export
const headers: { key: keyof ActivityPacket; label: string }[] = [
  { key: 'imei', label: 'IMEI' },
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'speed_kmh', label: 'Speed (km/h)' },
  { key: 'ignition', label: 'Ignition' },
  { key: 'main_power', label: 'Main Power' },
];

export default function VehicleActivityPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { packets, analytics, status } = useSelector((state: RootState) => state.vehicleActivity);
  const { vehicles, status: vehiclesStatus } = useSelector((state: RootState) => state.vehicle);

  // Filter states
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

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

  // Filter packets based on search
  const filteredPackets = packets.filter((packet) =>
    Object.values(packet).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredPackets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPackets = filteredPackets.slice(startIndex, endIndex);

  const handleGenerate = () => {
    if (!selectedVehicle || !startDate || !endDate) {
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
      return;
    }

    const startDateString = startDateTime.toISOString();
    const endDateString = endDateTime.toISOString();

    dispatch(fetchVehicleActivity({
      vehicleNumber: selectedVehicle,
      startDate: startDateString,
      endDate: endDateString,
    }));

    // Reset pagination
    setCurrentPage(1);
  };

  const handleClear = () => {
    dispatch(clearActivityData());
    setSelectedVehicle('');
    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Get vehicle number from vehicle object
  const getVehicleNumber = (vehicle: any) => {
    return vehicle.vehicleNumber || vehicle._id || 'N/A';
  };

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6 p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
          Filter Vehicle Activity
        </h2>
        
        <div className="flex flex-col md:flex-row lg:flex-row gap-6 flex-wrap">
          {/* Vehicle Selection */}
          <div className="flex-1 min-w-[200px] lg:max-w-[250px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Vehicle <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={getVehicleNumber(vehicle)}>
                    {getVehicleNumber(vehicle)}
                  </option>
                ))}
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
              disabled={!selectedVehicle || !startDate || !endDate || status === 'loading'}
              className="flex-1 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Loading...' : 'Generate'}
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

      {/* Analytics Summary Section */}
      {analytics && (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6 p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
            Activity Analytics Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Max Speed</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.maxSpeed || 0} km/h
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Avg Speed</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.averageSpeed?.toFixed(1) || 0} km/h
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Total Distance</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.totalDistance?.toFixed(2) || 0} km
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Run Time</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.runTimeHours?.toFixed(1) || 0} hrs
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Idle Time</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.idleTimeHours?.toFixed(1) || 0} hrs
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Stopped</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.stoppedDurationHours?.toFixed(1) || 0} hrs
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Over Speed</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.overspeedCount || 0}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Harsh Breaking</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.harshBreakingCount || 0}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Harsh Acceleration</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.harshAccelerationCount || 0}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Rash Turning</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.rashTurningCount || 0}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Disconnect</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.disconnectCount || 0}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Tamper Alert</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {analytics.temperCount || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      {packets.length > 0 && (
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
                  data={currentPackets} 
                  headers={headers} 
                  filename="vehicle-activity" 
                  allData={packets} 
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
                  placeholder="Search vehicle activity..."
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
      {packets.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--navy-dark)] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">IMEI</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Timestamp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Latitude</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Longitude</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Speed (km/h)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ignition</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Main Power</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {currentPackets.length > 0 ? (
                  currentPackets.map((packet, index) => (
                    <tr key={packet._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                        {packet.imei}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                        {packet.timestamp}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                        {packet.latitude?.toFixed(6) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                        {packet.longitude?.toFixed(6) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                        {packet.speed_kmh || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            packet.ignition
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {packet.ignition ? 'ON' : 'OFF'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            packet.main_power
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {packet.main_power ? 'Connected' : 'Disconnected'}
                        </span>
                      </td>
                    </tr>
                  ))
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
              Showing results {startIndex + 1} out of {filteredPackets.length}
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
              <div className="text-lg">Loading vehicle activity...</div>
            ) : (
              <div>
                <p className="text-lg mb-2">No vehicle activity available</p>
                <p className="text-sm">Please select a vehicle and date range, then click Generate to view activity</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
