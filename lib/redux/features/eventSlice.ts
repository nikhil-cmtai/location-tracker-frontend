import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DeviceEvent } from './deviceEventSlice';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tracking`;

export interface Event {
  _id: string;
  vehicleNo: string;
  imei: number;
  eventName?: string | DeviceEvent;
  eventNumber: number;
  dateAndTime: string;
  latitude: number;
  longitude: number;
  location?: string;
}

export interface FetchEventsParams {
  vehicleNo?: string;
  category?: string; // Changed from eventName to category
  startDay?: string;
  endDay?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface EventState {
  events: Event[];
  pagination: PaginationState;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventState = {
  events: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  },
  status: 'idle',
  error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params: FetchEventsParams = {}, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/event`, { params, withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
  }
});

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default eventSlice.reducer;