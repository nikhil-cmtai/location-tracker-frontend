// store/journeyHistorySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface JourneyPacket {
    serialNumber: number;
    vehicleNumber: string;
    dateTime: string;
    latitude: number;
    longitude: number;
    location: string;
    ignition: 'ON' | 'OFF';
    speedKmh: number;
    mainPower: 'Connected' | 'Disconnected';
}

interface PaginationData {
    currentPage: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface DateRange {
    startDate: string;
    endDate: string;
    duration: string;
}

interface JourneyHistoryState {
    packets: JourneyPacket[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    pagination: PaginationData | null;
    dateRange: DateRange | null;
    vehicleNumber: string | null;
    period: string | null;
}

interface FetchParams {
    vehicleNumber: string;
    period: string;
    startDate?: string;
    endDate?: string;
    page?: number;
}

const initialState: JourneyHistoryState = {
    packets: [],
    status: 'idle',
    error: null,
    pagination: null,
    dateRange: null,
    vehicleNumber: null,
    period: null
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchJourneyHistory = createAsyncThunk(
  'journey/fetchJourneyHistory',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
        const { vehicleNumber, ...queryParams } = params;
        const response = await axios.get(`${API_BASE_URL}/journeyhistory/${vehicleNumber}`, {
            params: { ...queryParams, includeLocation: true },
            withCredentials: true,
        });
        toast.success(`${response.data.totalRecords} records found!`);
        return {
            data: response.data.data,
            pagination: response.data.pagination,
            dateRange: response.data.dateRange,
            vehicleNumber: response.data.vehicleNumber,
            period: response.data.period
        };
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to fetch journey history';
        toast.error(message);
        return rejectWithValue(message);
    }
  }
);

const journeyHistorySlice = createSlice({
    name: 'journeyHistory',
    initialState,
    reducers: {
        clearJourneyHistory: (state) => {
            state.packets = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJourneyHistory.pending, (state) => {
                state.status = 'loading';
                state.packets = [];
                state.error = null;
            })
            .addCase(fetchJourneyHistory.fulfilled, (state, action: PayloadAction<{
                data: JourneyPacket[];
                pagination: PaginationData;
                dateRange: DateRange;
                vehicleNumber: string;
                period: string;
            }>) => {
                state.status = 'succeeded';
                state.packets = action.payload.data;
                state.pagination = action.payload.pagination;
                state.dateRange = action.payload.dateRange;
                state.vehicleNumber = action.payload.vehicleNumber;
                state.period = action.payload.period;
            })
            .addCase(fetchJourneyHistory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearJourneyHistory } = journeyHistorySlice.actions;
export default journeyHistorySlice.reducer;