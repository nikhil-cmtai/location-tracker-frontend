'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Play, Pause, RotateCcw, FastForward, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVehicles } from '@/lib/redux/features/vehicleSlice';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Dynamic import to avoid SSR issues with Leaflet
const JourneyReplayMap = dynamic(
  () => import('@/components/dashboard/tracking/JourneyReplayMap'),
  { ssr: false }
);

export default function HistoryReplayPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, status } = useSelector((state: RootState) => state.vehicle);

  // Form states
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [fromDateTime, setFromDateTime] = useState<Date | null>(null);
  const [toDateTime, setToDateTime] = useState<Date | null>(null);

  // Playback states
  const [journeyData, setJourneyData] = useState<[number, number][]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [replayKey, setReplayKey] = useState(0);
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicles());
    }
  }, [dispatch, status]);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('historyReplaySidebarOpen');
    if (savedState !== null) {
      setIsSidebarOpen(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('historyReplaySidebarOpen', JSON.stringify(newState));
  };

  const handleShow = () => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle');
      return;
    }

    // Check if time period or date range is selected
    if (!timePeriod && (!fromDateTime || !toDateTime)) {
      toast.error('Please select a time period or date range');
      return;
    }

    // TODO: Fetch journey data from API
    // For now, using sample data
    const sampleJourneyData: [number, number][] = [
      [26.8467, 80.9462],
      [26.8477, 80.9472],
      [26.8487, 80.9482],
      [26.8497, 80.9492],
      [26.8507, 80.9502],
      [26.8517, 80.9512],
      [26.8527, 80.9522],
      [26.8537, 80.9532],
      [26.8547, 80.9542],
      [26.8557, 80.9552],
    ];

    setJourneyData(sampleJourneyData);
    setReplayKey((prev) => prev + 1);
    setIsPlaying(false);
    toast.success('Journey data loaded successfully!');
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setReplayKey((prev) => prev + 1);
    setIsPlaying(false);
  };

  const handleSpeedChange = () => {
    if (replaySpeed === 1) setReplaySpeed(2);
    else if (replaySpeed === 2) setReplaySpeed(4);
    else setReplaySpeed(1);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Left Sidebar */}
      <div 
        className={`bg-white flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-96 border-r border-[var(--border-light)] overflow-y-auto' : 'w-0 overflow-hidden border-r-0'
        }`}
      >
        <div className="w-96 p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Journey Tracking</h2>
          </div>

          {/* Select Vehicle */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Select Vehicle
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
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

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Period
            </label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
            >
              <option value="">Select Time Period</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border-light)]"></div>
            <span className="text-sm text-[var(--text-secondary)] font-medium">OR</span>
            <div className="flex-1 h-px bg-[var(--border-light)]"></div>
          </div>

          {/* From Date & Time */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              From
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
                <DatePicker
                  selected={fromDateTime}
                  onChange={(date) => setFromDateTime(date)}
                  dateFormat="EEE, MMM dd"
                  placeholderText="Pick Date"
                  className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  calendarClassName="custom-datepicker"
                  popperPlacement="bottom-start"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
                <DatePicker
                  selected={fromDateTime}
                  onChange={(date) => setFromDateTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Pick Time"
                  className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  popperPlacement="right-start"
                />
              </div>
            </div>
          </div>

          {/* To Date & Time */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              To
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
                <DatePicker
                  selected={toDateTime}
                  onChange={(date) => setToDateTime(date)}
                  dateFormat="EEE, MMM dd"
                  placeholderText="Pick Date"
                  className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  calendarClassName="custom-datepicker"
                  popperPlacement="bottom-start"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10 pointer-events-none" />
                <DatePicker
                  selected={toDateTime}
                  onChange={(date) => setToDateTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Pick Time"
                  className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  popperPlacement="right-start"
                />
              </div>
            </div>
          </div>

          {/* Show Button */}
          <button
            onClick={handleShow}
            className="w-full bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white py-3 rounded-lg font-medium transition-colors"
          >
            Show
          </button>

          {/* Play Back Control */}
          {journeyData.length > 0 && (
            <>
              <div className="pt-4 border-t border-[var(--border-light)]">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-4">
                  Play Back Control
                </label>
                <div className="bg-[#FFE5D9] rounded-lg p-6">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      onClick={() => {
                        handleReset();
                        setTimeout(() => setIsPlaying(true), 100);
                      }}
                      className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="Restart"
                    >
                      <FastForward className="w-5 h-5 text-[var(--primary-orange)] rotate-180" />
                    </button>
                    <button
                      onClick={handlePlayPause}
                      className="p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-[var(--primary-orange)]" />
                      ) : (
                        <Play className="w-6 h-6 text-[var(--primary-orange)]" />
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="Reset"
                    >
                      <RotateCcw className="w-5 h-5 text-[var(--primary-orange)]" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="Forward"
                    >
                      <FastForward className="w-5 h-5 text-[var(--primary-orange)]" />
                    </button>
                  </div>

                  {/* Speed Control */}
                  <div className="text-center">
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                      Speed
                    </label>
                    <button
                      onClick={handleSpeedChange}
                      className="px-6 py-2 bg-white rounded-full text-[var(--primary-orange)] font-bold hover:bg-gray-100 transition-colors"
                    >
                      {replaySpeed}x
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative min-w-0">
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[1000] bg-white hover:bg-gray-50 border border-[var(--border-light)] rounded-lg p-3 shadow-lg transition-all duration-200"
          title={isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-6 h-6 text-[var(--text-primary)]" />
          ) : (
            <ChevronRight className="w-6 h-6 text-[var(--text-primary)]" />
          )}
        </button>

        <div className="w-full h-full">
          <JourneyReplayMap
            journeyData={journeyData}
            isPlaying={isPlaying}
            replaySpeed={replaySpeed}
            replayKey={replayKey}
          />
        </div>
        
        {/* Overlay message when no data */}
        {journeyData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center max-w-md">
              <p className="text-lg text-[var(--text-primary)] font-semibold mb-2">
                No journey data to display
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Select a vehicle and time period to view journey history
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}