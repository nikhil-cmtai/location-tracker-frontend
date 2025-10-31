// store/vehicleStatusSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackingPacketType } from '../../types/trackingPacket';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export interface VehicleStatus {
    vehicleNumber: string;
    imeiNumber: string;
    status: 'Running' | 'Idle' | 'Stopped' | 'Offline';
    batteryStatus: string;
    speed: string;
    lastLocation: string;
    lastUpdate: string;
    latitude: number;
    longitude: number;
    ignition: boolean;
    mainPower: boolean;
    emergencyStatus: boolean;
    batteryVoltage: number;
    gsmSignal: number;
    satellites: number;
}

interface FetchParams {
    vehicleNumber?: string;
    startDate?: string;
    endDate?: string;
}

interface VehicleStatusState {
    vehicleStatuses: { [vehicleNumber: string]: VehicleStatus };
    isConnected: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: VehicleStatusState = {
    vehicleStatuses: {},
    isConnected: false,
    loading: false,
    error: null,
};

const vehicleStatusSlice = createSlice({
    name: 'vehicleStatus',
    initialState,
    reducers: {
        setSocketConnection: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        updateVehicleStatus: (state, action: PayloadAction<TrackingPacketType>) => {
            const packet = action.payload;
            if (!packet.vehicle_reg_no) return;

            let status: 'Running' | 'Idle' | 'Stopped' | 'Offline' = 'Stopped';
            if (packet.speed_kmh && packet.speed_kmh > 0) {
                status = 'Running';
            } else if (packet.ignition === true) {
                status = 'Idle';
            }

            const updatedStatus: VehicleStatus = {
                vehicleNumber: packet.vehicle_reg_no,
                imeiNumber: packet.imei || 'N/A',
                status: status,
                batteryStatus: packet.main_power === true ? 'Connected' : 'Disconnected',
                speed: `${packet.speed_kmh ?? 0} km/h`,
                lastLocation: 'Loading...', // Will be updated by geocoding
                lastUpdate: packet.timestamp ? new Date(packet.timestamp).toLocaleString() : '',
                latitude: packet.latitude ?? 0,
                longitude: packet.longitude ?? 0,
                ignition: packet.ignition ?? false,
                mainPower: packet.main_power ?? false,
                emergencyStatus: packet.emergency_status ?? false,
                batteryVoltage: packet.battery_voltage ?? 0,
                gsmSignal: packet.gsm_signal ?? 0,
                satellites: packet.satellites ?? 0,
            };

            state.vehicleStatuses[packet.vehicle_reg_no] = updatedStatus;
        },
        updateVehicleLocation: (state, action: PayloadAction<{ vehicleNumber: string, location: string }>) => {
            const { vehicleNumber, location } = action.payload;
            if (state.vehicleStatuses[vehicleNumber]) {
                state.vehicleStatuses[vehicleNumber].lastLocation = location;
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVehicleStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVehicleStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Convert API response to vehicle statuses format
                if (action.payload && Array.isArray(action.payload)) {
                    action.payload.forEach((vehicle: any) => {
                        if (vehicle.vehicleNumber) {
                            state.vehicleStatuses[vehicle.vehicleNumber] = {
                                vehicleNumber: vehicle.vehicleNumber,
                                imeiNumber: vehicle.imeiNumber || 'N/A',
                                status: vehicle.status || 'Offline',
                                batteryStatus: vehicle.batteryStatus || 'Unknown',
                                speed: vehicle.speed || '0 km/h',
                                lastLocation: vehicle.lastLocation || 'Loading...',
                                lastUpdate: vehicle.lastUpdate || '',
                                latitude: vehicle.latitude || 0,
                                longitude: vehicle.longitude || 0,
                                ignition: vehicle.ignition || false,
                                mainPower: vehicle.mainPower || false,
                                emergencyStatus: vehicle.emergencyStatus || false,
                                batteryVoltage: vehicle.batteryVoltage || 0,
                                gsmSignal: vehicle.gsmSignal || 0,
                                satellites: vehicle.satellites || 0,
                            };
                        }
                    });
                }
            })
            .addCase(fetchVehicleStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch vehicle status';
            });
    }
});

export const { setSocketConnection, updateVehicleStatus, updateVehicleLocation, clearError } = vehicleStatusSlice.actions;

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchVehicleStatus = createAsyncThunk(
  'vehicleStatus/fetchVehicleStatus',
  async (params: FetchParams | undefined, { rejectWithValue }) => {
    try {
      const requestParams: any = { includeLocation: true };
      if (params?.vehicleNumber) requestParams.vehicleNumber = params.vehicleNumber;
      if (params?.startDate) requestParams.startDate = params.startDate;
      if (params?.endDate) requestParams.endDate = params.endDate;
      
      const response = await axios.get(`${API_BASE_URL}/vehiclecurrentstatus`, {
        params: requestParams,
        withCredentials: true,
      });
      toast.success(`${response.data.count || response.data.total || response.data.data?.length || 0} vehicle current status records found!`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch vehicle current status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export default vehicleStatusSlice.reducer;