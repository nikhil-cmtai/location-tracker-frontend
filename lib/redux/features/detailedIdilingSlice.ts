import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface DetailedIdlingEventDetail {
    vehicleNumber: string;
    idlingStartTime: string;
    idlingEndTime: string;
    totalStoppageDuration: string;
    idlingLocation: string;
    stoppageStartTime: string;
    stoppageEndTime: string;
    stoppageLocation: string;
}

export interface DetailedIdlingSummary {
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
    details: DetailedIdlingEventDetail[];
}

interface DetailedIdlingSummaryState {
    reportData: DetailedIdlingSummary[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    startDate: string;
    endDate: string;
    regionId?: string;
    depotId?: string;
    vehicleNumber?: string;
}

const initialState: DetailedIdlingSummaryState = {
    reportData: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchDetailedIdlingSummary = createAsyncThunk(
  'idlingdetailed',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/idlingdetailed`, { params, withCredentials: true });
      toast.success(response.data.message);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch report';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const detailedIdlingSummarySlice = createSlice({
    name: 'detailedIdlingSummary',
    initialState,
    reducers: {
        clearDetailedIdlingSummary: (state) => {
            state.reportData = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDetailedIdlingSummary.pending, (state) => {
                state.status = 'loading';
                state.reportData = [];
                state.error = null;
            })
            .addCase(fetchDetailedIdlingSummary.fulfilled, (state, action: PayloadAction<DetailedIdlingSummary[]>) => {
                state.status = 'succeeded';
                state.reportData = action.payload;
            })
            .addCase(fetchDetailedIdlingSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearDetailedIdlingSummary } = detailedIdlingSummarySlice.actions;
export default detailedIdlingSummarySlice.reducer;