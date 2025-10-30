// store/firmwareSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface FirmwareInfo {
    serialNo: number;
    imeiNumber: string;
    deviceMake: string;
    deviceModel: string;
    mappedVehicle: string;
    lastReportedDateTime: string;
    firmwareVersion: string;
}

interface FirmwareState {
    deviceInfo: FirmwareInfo | null;
    allDevices: FirmwareInfo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: FirmwareState = {
    deviceInfo: null,
    allDevices: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchLatestFirmware = createAsyncThunk(
  'firmware/fetchLatest',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/firmware/${searchTerm}`, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch firmware info';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchAllFirmware = createAsyncThunk(
  'firmware/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/firmware`, { withCredentials: true });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch all firmware info';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const firmwareSlice = createSlice({
    name: 'firmware',
    initialState,
    reducers: {
        clearFirmwareInfo: (state) => {
            state.deviceInfo = null;
            state.status = 'idle';
            state.error = null;
        },
        clearAllFirmware: (state) => {
            state.allDevices = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLatestFirmware.pending, (state) => {
                state.status = 'loading';
                state.deviceInfo = null;
                state.error = null;
            })
            .addCase(fetchLatestFirmware.fulfilled, (state, action: PayloadAction<FirmwareInfo>) => {
                state.status = 'succeeded';
                state.deviceInfo = action.payload;
            })
            .addCase(fetchLatestFirmware.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchAllFirmware.pending, (state) => {
                state.status = 'loading';
                state.allDevices = [];
                state.error = null;
            })
            .addCase(fetchAllFirmware.fulfilled, (state, action: PayloadAction<FirmwareInfo[]>) => {
                state.status = 'succeeded';
                state.allDevices = action.payload;
            })
            .addCase(fetchAllFirmware.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearFirmwareInfo, clearAllFirmware } = firmwareSlice.actions;
export default firmwareSlice.reducer;