// store/stoppageSummarySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface StoppageEventDetail {
    vehicleNumber: string;
    stopStartTime: string;
    stopEndTime: string;
    totalStopDuration: string;
    stopLocation: string;
}

export interface StoppageEvent {
    sNo: number;
    region: string;
    depot: string;
    vehicleNumber: string;
    imeiNumber: string;
    serviceType: string;
    ownerType: string;
    totalStopDuration: string;
    stopEventCount: number;
    details: StoppageEventDetail[];
}

interface StoppageState {
    reportData: StoppageEvent[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    startDate: string;
    endDate: string;
    idleDuration?: number;
    regionId?: string;
    depotId?: string;
    vehicleNumber?: string;
}

const initialState: StoppageState = {
    reportData: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchStoppageSummary = createAsyncThunk(
  'stoppageSummary/fetchStoppageSummary',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stopsummary`, { params, withCredentials: true });
      toast.success(response.data.message);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch report';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const stoppageSummarySlice = createSlice({
    name: 'stoppageSummary',
    initialState,
    reducers: {
        clearStoppageSummary: (state) => {
            state.reportData = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStoppageSummary.pending, (state) => {
                state.status = 'loading';
                state.reportData = [];
                state.error = null;
            })
            .addCase(fetchStoppageSummary.fulfilled, (state, action: PayloadAction<StoppageEvent[]>) => {
                state.status = 'succeeded';
                state.reportData = action.payload;
            })
            .addCase(fetchStoppageSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearStoppageSummary } = stoppageSummarySlice.actions;
export default stoppageSummarySlice.reducer;