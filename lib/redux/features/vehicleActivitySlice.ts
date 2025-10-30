// store/vehicleActivitySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface ActivityPacket {
    _id: string;
    timestamp: string;
    latitude: number;
    longitude: number;
    speed_kmh: number;
    ignition: boolean;
    main_power: boolean;
    imei: string;
}

export interface Analytics {
    maxSpeed: number;
    averageSpeed: number;
    totalDistance: number;
    runTimeHours: number;
    idleTimeHours: number;
    stoppedDurationHours: number;
    overspeedCount: number;
    harshBreakingCount: number;
    harshAccelerationCount: number;
    rashTurningCount: number;
    disconnectCount: number;
    temperCount: number;
    panicAlertCount: number;
}

interface ActivityState {
    packets: ActivityPacket[];
    analytics: Analytics | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    vehicleNumber: string;
    startDate: string;
    endDate: string;
}

const initialState: ActivityState = {
    packets: [],
    analytics: null,
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchVehicleActivity = createAsyncThunk(
  'activity/fetchVehicleActivity',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicleactivity`, {
        params: { ...params, includeAnalytics: true },
        withCredentials: true,
      });
      toast.success(`${response.data.totalRecords} records found!`);
      
      const mockedAnalytics: Partial<Analytics> = {
          stoppedDurationHours: 16.28,
          overspeedCount: 19,
          harshBreakingCount: 27,
          harshAccelerationCount: 10,
          rashTurningCount: 24,
          disconnectCount: 2,
          temperCount: 2,
          panicAlertCount: 2,
      };

      const finalAnalytics = { ...response.data.analytics, ...mockedAnalytics };

      return { packets: response.data.data, analytics: finalAnalytics };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch activity data';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const vehicleActivitySlice = createSlice({
    name: 'vehicleActivity',
    initialState,
    reducers: {
        clearActivityData: (state) => {
            state.packets = [];
            state.analytics = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVehicleActivity.pending, (state) => {
                state.status = 'loading';
                state.packets = [];
                state.analytics = null;
                state.error = null;
            })
            .addCase(fetchVehicleActivity.fulfilled, (state, action: PayloadAction<{ packets: ActivityPacket[], analytics: Analytics }>) => {
                state.status = 'succeeded';
                state.packets = action.payload.packets;
                state.analytics = action.payload.analytics;
            })
            .addCase(fetchVehicleActivity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearActivityData } = vehicleActivitySlice.actions;
export default vehicleActivitySlice.reducer;