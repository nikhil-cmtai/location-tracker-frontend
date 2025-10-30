// store/distanceReportSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface JourneySegment {
    vehicleNumber: string;
    startTime: string;
    startLocation: string;
    endTime: string;
    endLocation: string;
    journeyTime: string;
    distanceTravelled: string;
}

export interface ReportSummary {
    vehicleNumber: string;
    startTime: string;
    endTime: string;
    totalDistance: string;
    totalJourneys: number;
}

interface DistanceReportState {
    summary: ReportSummary | null;
    journeys: JourneySegment[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    vehicleNumber: string;
    startDate: string;
    endDate: string;
}

const initialState: DistanceReportState = {
    summary: null,
    journeys: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchDistanceReport = createAsyncThunk(
  'distance/fetchDistanceReport',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/distancetravelled`, { params, withCredentials: true });
      toast.success('Report generated successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch report';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const distanceReportSlice = createSlice({
    name: 'distanceReport',
    initialState,
    reducers: {
        clearDistanceReport: (state) => {
            state.summary = null;
            state.journeys = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDistanceReport.pending, (state) => {
                state.status = 'loading';
                state.summary = null;
                state.journeys = [];
                state.error = null;
            })
            .addCase(fetchDistanceReport.fulfilled, (state, action: PayloadAction<{ summary: ReportSummary, journeys: JourneySegment[] }>) => {
                state.status = 'succeeded';
                state.summary = action.payload.summary;
                state.journeys = action.payload.journeys;
            })
            .addCase(fetchDistanceReport.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearDistanceReport } = distanceReportSlice.actions;
export default distanceReportSlice.reducer;