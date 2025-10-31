// store/utilizationReportSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface DailyUtilization {
    vehicleNumber: string;
    manufacturerName: string;
    vehicleType: string;
    model: string;
    date: string;
    stoppageDuration: string;
    idleDuration: string;
    journeyDuration: string;
    journeyTravelled: string;
}

export interface ReportSummary {
    vehicleNumber: string;
    startTime: string;
    endTime: string;
    totalDays: number;
    totalJourneyTravelled: string;
}

interface UtilizationState {
    summary: ReportSummary | null;
    utilization: DailyUtilization[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    vehicleNumber: string;
    startDate: string;
    endDate: string;
}

const initialState: UtilizationState = {
    summary: null,
    utilization: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchVehicleUtilization = createAsyncThunk(
  'utilization/fetchVehicleUtilization',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicleutilization`, { params, withCredentials: true });
      toast.success('Report generated successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch report';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const utilizationReportSlice = createSlice({
    name: 'utilizationReport',
    initialState,
    reducers: {
        clearUtilizationReport: (state) => {
            state.summary = null;
            state.utilization = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVehicleUtilization.pending, (state) => {
                state.status = 'loading';
                state.summary = null;
                state.utilization = [];
                state.error = null;
            })
            .addCase(fetchVehicleUtilization.fulfilled, (state, action: PayloadAction<{ summary: ReportSummary, utilization: DailyUtilization[] }>) => {
                state.status = 'succeeded';
                state.summary = action.payload.summary;
                state.utilization = action.payload.utilization;
            })
            .addCase(fetchVehicleUtilization.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearUtilizationReport } = utilizationReportSlice.actions;
export default utilizationReportSlice.reducer;