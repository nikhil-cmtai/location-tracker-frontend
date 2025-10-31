'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchEvents, Event } from '@/lib/redux/features/eventSlice';
import { fetchVehicles } from '@/lib/redux/features/vehicleSlice';
import { fetchEventCategories } from '@/lib/redux/features/eventCategorySlice';
import { Search, ChevronLeft, ChevronRight, Calendar, Clock, ChevronDown, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExportButtons from '@/components/dashboard/ExportButtons';
import toast from 'react-hot-toast';

// Headers for export
const headers: { key: keyof Event; label: string }[] = [
  { key: 'vehicleNo', label: 'Vehicle Number' },
  { key: 'imei', label: 'IMEI' },
  { key: 'eventName', label: 'Event Name' },
  { key: 'eventNumber', label: 'Event Number' },
  { key: 'dateAndTime', label: 'Date & Time' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'location', label: 'Location' },
];

export default function EventsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, status, pagination } = useSelector((state: RootState) => state.event);
  const { vehicles, status: vehiclesStatus } = useSelector((state: RootState) => state.vehicle);
  const { eventCategories, status: eventCategoriesStatus } = useSelector((state: RootState) => state.eventCategory);

  // Filter states
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Table states
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch vehicles and event categories on mount
  useEffect(() => {
    if (vehiclesStatus === 'idle') {
      dispatch(fetchVehicles());
    }
    if (eventCategoriesStatus === 'idle') {
      dispatch(fetchEventCategories());
    }
  }, [dispatch, vehiclesStatus, eventCategoriesStatus]);

  // Update current page when pagination changes
  useEffect(() => {
    if (pagination) {
      setCurrentPage(pagination.currentPage);
      setItemsPerPage(pagination.itemsPerPage);
    }
  }, [pagination]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-vehicle-dropdown]') && !target.closest('[data-category-dropdown]')) {
        setIsVehicleDropdownOpen(false);
        setIsCategoryDropdownOpen(false);
      }
    };

    if (isVehicleDropdownOpen || isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVehicleDropdownOpen, isCategoryDropdownOpen]);

  // Helper function to get vehicle number
  const getVehicleNumber = (vehicle: any) => {
    return vehicle.vehicleNumber || vehicle.registrationNumber || '';
  };

  // Helper function to get event name
  const getEventName = (event: Event) => {
    if (typeof event.eventName === 'string') {
      return event.eventName;
    }
    if (event.eventName && typeof event.eventName === 'object') {
      return (event.eventName as any).eventName || 'N/A';
    }
    return 'N/A';
  };

  // Filter vehicles based on search
  const filteredVehicles = vehicles.filter((vehicle) =>
    getVehicleNumber(vehicle).toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  // Filter event categories based on search
  const filteredCategories = eventCategories.filter((category) =>
    category.name.toUpperCase().includes(categorySearch.toUpperCase())
  );

  // Filter events based on search
  const filteredEvents = events.filter((event) =>
    event.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.imei.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    getEventName(event).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = pagination?.totalPages || Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handleGenerate = () => {
    if (!startDate || !endDate) {
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

    const startDayString = startDateTime.toISOString();
    const endDayString = endDateTime.toISOString();

    const params: any = {
      startDay: startDayString,
      endDay: endDayString,
      page: currentPage,
      limit: itemsPerPage,
    };

    if (selectedVehicle) {
      params.vehicleNo = selectedVehicle;
    }

    if (selectedCategory) {
      params.category = selectedCategory;
    }

    dispatch(fetchEvents(params));

    // Reset pagination
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSelectedVehicle('');
    setVehicleSearch('');
    setIsVehicleDropdownOpen(false);
    setSelectedCategory('');
    setCategorySearch('');
    setIsCategoryDropdownOpen(false);
    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleVehicleSelect = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setVehicleSearch(vehicleNumber);
    setIsVehicleDropdownOpen(false);
  };

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    setCategorySearch(categoryName);
    setIsCategoryDropdownOpen(false);
  };

  const getSelectedVehicleName = () => {
    return selectedVehicle;
  };

  const getSelectedCategoryName = () => {
    const category = eventCategories.find((c) => c._id === selectedCategory);
    return category ? category.name : '';
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
          Filter Events
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

          {/* Event Category Searchable Select */}
          <div className="flex-1 min-w-[250px] lg:max-w-[300px]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Event Category (Optional)
            </label>
            <div className="relative" data-category-dropdown>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10" />
                <input
                  type="text"
                  placeholder="Search and select category..."
                  value={selectedCategory && !isCategoryDropdownOpen ? getSelectedCategoryName() : categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setIsCategoryDropdownOpen(true);
                    if (selectedCategory && e.target.value !== getSelectedCategoryName()) {
                      setSelectedCategory('');
                    }
                  }}
                  onFocus={() => {
                    setIsCategoryDropdownOpen(true);
                    if (selectedCategory) {
                      setCategorySearch(getSelectedCategoryName());
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] cursor-pointer"
                />
                {(categorySearch || selectedCategory) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategorySearch('');
                      setSelectedCategory('');
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                
                {/* Dropdown Options */}
                {isCategoryDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--border-light)] rounded-lg shadow-lg max-h-60 overflow-auto">
                    <button
                      onClick={() => handleCategorySelect('', '')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--primary-orange-light)] transition-colors ${
                        selectedCategory === '' ? 'bg-[var(--primary-orange-light)] font-semibold' : ''
                      }`}
                    >
                      All Categories
                    </button>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => handleCategorySelect(category._id, category.name)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--primary-orange-light)] transition-colors ${
                            selectedCategory === category._id ? 'bg-[var(--primary-orange-light)] font-semibold' : ''
                          }`}
                        >
                          {category.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-[var(--text-secondary)]">No category found</div>
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
              disabled={!startDate || !endDate || status === 'loading'}
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
      {events.length > 0 && (
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
                    // Refetch with new page size
                    if (startDate && endDate) {
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
                      dispatch(fetchEvents({
                        startDay: startDateTime.toISOString(),
                        endDay: endDateTime.toISOString(),
                        vehicleNo: selectedVehicle || undefined,
                        category: selectedCategory || undefined,
                        page: 1,
                        limit: Number(e.target.value),
                      }));
                    }
                  }}
                  className="border border-[var(--border-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                <ExportButtons data={currentEvents} headers={headers} filename="events" allData={events} />
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
      {events.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--navy-dark)] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Vehicle Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">IMEI</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Event Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Event Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Latitude</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Longitude</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {currentEvents.map((event, index) => (
                  <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">{event.vehicleNo}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{event.imei}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{getEventName(event)}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{event.eventNumber}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{event.dateAndTime}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{event.latitude}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{event.longitude}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{event.location || 'N/A'}</td>
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
                <span className="font-semibold text-[var(--text-primary)]">{Math.min(endIndex, filteredEvents.length)}</span> of{' '}
                <span className="font-semibold text-[var(--text-primary)]">{pagination?.totalItems || filteredEvents.length}</span> entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    setCurrentPage(newPage);
                    if (startDate && endDate) {
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
                      dispatch(fetchEvents({
                        startDay: startDateTime.toISOString(),
                        endDay: endDateTime.toISOString(),
                        vehicleNo: selectedVehicle || undefined,
                        category: selectedCategory || undefined,
                        page: newPage,
                        limit: itemsPerPage,
                      }));
                    }
                  }}
                  disabled={currentPage === 1 || !pagination?.hasPrevPage}
                  className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => {
                    const newPage = Math.min(totalPages, currentPage + 1);
                    setCurrentPage(newPage);
                    if (startDate && endDate) {
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
                      dispatch(fetchEvents({
                        startDay: startDateTime.toISOString(),
                        endDay: endDateTime.toISOString(),
                        vehicleNo: selectedVehicle || undefined,
                        category: selectedCategory || undefined,
                        page: newPage,
                        limit: itemsPerPage,
                      }));
                    }
                  }}
                  disabled={currentPage === totalPages || !pagination?.hasNextPage}
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
          <p className="text-[var(--text-secondary)]">Loading events...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">No data available. Please generate a report.</p>
        </div>
      )}
    </div>
  );
}
