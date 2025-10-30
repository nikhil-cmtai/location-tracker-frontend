import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface IdleEventDetail {
    vehicleNumber: string;
    idlingStartTime: string;
    idlingEndTime: string;
    totalIdleDuration: string;
    idlingLocation: string;
}

export interface IdlingSummary {
    sNo: number;
    region: string;
    depot: string;
    vehicleNumber: string;
    imeiNumber: string;
    serviceType: string;
    ownerType: string;
    totalIdleDuration: string;
    details: IdleEventDetail[];
}

interface IdlingSummaryState {
    reportData: IdlingSummary[];
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

const initialState: IdlingSummaryState = {
    reportData: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchIdlingSummary = createAsyncThunk(
  'idlingSummary/fetchIdlingSummary',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/idlingsummary`, { params, withCredentials: true });
      toast.success(response.data.message);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch report';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const idlingSummarySlice = createSlice({
    name: 'idlingSummary',
    initialState,
    reducers: {
        clearIdlingSummary: (state) => {
            state.reportData = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIdlingSummary.pending, (state) => {
                state.status = 'loading';
                state.reportData = [];
                state.error = null;
            })
            .addCase(fetchIdlingSummary.fulfilled, (state, action: PayloadAction<IdlingSummary[]>) => {
                state.status = 'succeeded';
                state.reportData = action.payload;
            })
            .addCase(fetchIdlingSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearIdlingSummary } = idlingSummarySlice.actions;
export default idlingSummarySlice.reducer;