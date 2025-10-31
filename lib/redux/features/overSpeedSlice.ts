import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface OverSpeedEvent {
    sNo: number;
    vehicleNumber: string;
    imeiNumber: string;
    speed: number;
    speedLimit: number;
    dateTime: string;
    location: string;
    latitude: number;
    longitude: number;
}

interface OverSpeedState {
    reportData: OverSpeedEvent[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    vehicleNumber?: string;
    speedLimit?: number;
    startDate?: string;
    endDate?: string;
}

const initialState: OverSpeedState = {
    reportData: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchOverSpeedReport = createAsyncThunk(
  'overSpeed/fetchOverSpeedReport',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/overspeed`, { params, withCredentials: true });
      toast.success('Report generated successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch over-speed report';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const overSpeedSlice = createSlice({
    name: 'overSpeed',
    initialState,
    reducers: {
        clearOverSpeedReport: (state) => {
            state.reportData = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOverSpeedReport.pending, (state) => {
                state.status = 'loading';
                state.reportData = [];
                state.error = null;
            })
            .addCase(fetchOverSpeedReport.fulfilled, (state, action: PayloadAction<OverSpeedEvent[]>) => {
                state.status = 'succeeded';
                state.reportData = action.payload;
            })
            .addCase(fetchOverSpeedReport.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearOverSpeedReport } = overSpeedSlice.actions;
export default overSpeedSlice.reducer;

