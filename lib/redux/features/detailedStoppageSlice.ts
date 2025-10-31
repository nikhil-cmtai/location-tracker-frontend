import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface DetailedStoppageEventDetail {
    vehicleNumber: string;
    stopStartTime: string;
    stopEndTime: string;
    totalStopDuration: string;
    stopLocation: string;
}

export interface DetailedStoppageSummary {
    sNo: number;
    zoneRegion: string;
    depotCustomer: string;
    vehicleNumber: string;
    imeiNumber: string;
    serviceType: string;
    ownerType: string;
    stoppageStartTime: string;
    stoppageEndTime: string;
    totalStoppageDuration: string;
    stoppageLocation: string;
    details: DetailedStoppageEventDetail[];
}

interface DetailedStoppageSummaryState {
    reportData: DetailedStoppageSummary[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    startDate: string;
    endDate: string;
    minimumDuration?: number;
    vehicleNumber?: string;
}

const initialState: DetailedStoppageSummaryState = {
    reportData: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchDetailedStoppageSummary = createAsyncThunk(
  'detailedStoppage/fetchDetailedStoppageSummary',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stopdetailed`, { params, withCredentials: true });
      toast.success(response.data.message);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch report';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const detailedStoppageSummarySlice = createSlice({
    name: 'detailedStoppageSummary',
    initialState,
    reducers: {
        clearDetailedStoppageSummary: (state) => {
            state.reportData = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDetailedStoppageSummary.pending, (state) => {
                state.status = 'loading';
                state.reportData = [];
                state.error = null;
            })
            .addCase(fetchDetailedStoppageSummary.fulfilled, (state, action: PayloadAction<DetailedStoppageSummary[]>) => {
                state.status = 'succeeded';
                state.reportData = action.payload;
            })
            .addCase(fetchDetailedStoppageSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearDetailedStoppageSummary } = detailedStoppageSummarySlice.actions;
export default detailedStoppageSummarySlice.reducer;

