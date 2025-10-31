'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchRawData, clearRawData, TrackingPacket } from '@/lib/redux/features/rawDataSlice';
import { fetchVltDevices } from '@/lib/redux/features/vltDeviceSlice';
import { Search, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExportButtons from '@/components/dashboard/ExportButtons';
import { ChevronDown } from 'lucide-react';

// Headers for export
const headers: { key: keyof TrackingPacket; label: string }[] = [
  { key: 'imei', label: 'IMEI' },
  { key: 'vehicle_reg_no', label: 'Vehicle Reg No' },
  { key: 'formatted_datetime', label: 'Date & Time' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'speed_kmh', label: 'Speed (km/h)' },
  { key: 'heading', label: 'Heading' },
  { key: 'satellites', label: 'Satellites' },
  { key: 'packet_status', label: 'Status' },
];

export default function RawDataPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { packets, status } = useSelector((state: RootState) => state.rawData);
  const { vltDevices, status: vltDevicesStatus } = useSelector((state: RootState) => state.vltDevice);

  // Filter states
  const [selectedImei, setSelectedImei] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Table states
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch VLT devices on mount
  useEffect(() => {
    if (vltDevicesStatus === 'idle') {
      dispatch(fetchVltDevices());
    }
  }, [dispatch, vltDevicesStatus]);

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
    if (!selectedImei) {
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

    dispatch(fetchRawData({
      imei: selectedImei,
      startDate: startDateString,
      endDate: endDateString,
    }));

    // Reset pagination
    setCurrentPage(1);
  };

  const handleClear = () => {
    dispatch(clearRawData());
    setSelectedImei('');
    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6 p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
          Filter Raw Data
        </h2>
        
        <div className="flex flex-col md:flex-row lg:flex-row gap-6 flex-wrap">
          {/* IMEI Selection */}
          <div className="flex-1 min-w-[200px] lg:max-w-[250px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              IMEI Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedImei}
                onChange={(e) => setSelectedImei(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
              >
                <option value="">Select IMEI</option>
                {vltDevices.map((device) => (
                  <option key={device._id} value={device.imeiNumber.toString()}>
                    {device.imeiNumber}
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

          {/* Action Buttons */}
          <div className="flex items-end gap-3 min-w-[200px] lg:min-w-[250px]">
            <button
              onClick={handleGenerate}
              disabled={!selectedImei || !startDate || !endDate || status === 'loading'}
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
                  filename="raw-data" 
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
                  placeholder="Search raw data..."
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Vehicle Reg No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Latitude</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Longitude</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Speed (km/h)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Heading</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Satellites</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
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
                        {packet.vehicle_reg_no || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                        {packet.formatted_datetime || `${packet.date} ${packet.time}`}
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
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                        {packet.heading || 'N/A'}°
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                        {packet.satellites || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            packet.packet_status === 'Valid'
                              ? 'bg-green-100 text-green-700'
                              : packet.packet_status === 'Invalid'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {packet.packet_status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-[var(--text-secondary)]">
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
              <div className="text-lg">Loading raw data...</div>
            ) : (
              <div>
                <p className="text-lg mb-2">No raw data available</p>
                <p className="text-sm">Please select filters and click Generate to view raw data</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
