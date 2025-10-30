import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { VltdModel } from './vltdModelSlice';
import { EventCategory } from './eventCategorySlice';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master`;

export interface DeviceEvent {
  _id: string;
  vlt: string | VltdModel;
  messageId: number;
  eventName: string;
  description: string;
  category?: string | EventCategory;
}

interface DeviceEventState {
  deviceEvents: DeviceEvent[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DeviceEventState = {
  deviceEvents: [],
  status: 'idle',
  error: null,
};

export const fetchDeviceEvents = createAsyncThunk('deviceEvents/fetchDeviceEvents', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deviceevents`, { withCredentials: true });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch device events');
  }
});

export const addNewDeviceEvent = createAsyncThunk('deviceEvents/addNewDeviceEvent', async (newEvent: Omit<DeviceEvent, '_id'>, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/deviceevents`, newEvent, { withCredentials: true });
    toast.success('Event Configuration added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add Event Configuration: ${message}`);
    return rejectWithValue(message);
  }
});

export const updateDeviceEvent = createAsyncThunk('deviceEvents/updateDeviceEvent', async (updatedEvent: DeviceEvent, { rejectWithValue }) => {
  try {
    const { _id, ...eventData } = updatedEvent;
    const response = await axios.put(`${API_BASE_URL}/deviceevents/${_id}`, eventData, { withCredentials: true });
    toast.success('Event Configuration updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update Event Configuration: ${message}`);
    return rejectWithValue(message);
  }
});

const deviceEventSlice = createSlice({
  name: 'deviceEvents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceEvents.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDeviceEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deviceEvents = action.payload;
      })
      .addCase(fetchDeviceEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addNewDeviceEvent.fulfilled, (state, action) => {
        state.deviceEvents.push(action.payload);
      })
      .addCase(updateDeviceEvent.fulfilled, (state, action) => {
        const index = state.deviceEvents.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.deviceEvents[index] = action.payload;
        }
      });
  },
});

export default deviceEventSlice.reducer;