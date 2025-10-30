import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

export interface EventCategory {
  _id: string;
  name: string;
  description?: string;
}

interface EventCategoryState {
  eventCategories: EventCategory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventCategoryState = {
  eventCategories: [],
  status: 'idle',
  error: null,
};

export const fetchEventCategories = createAsyncThunk('eventCategories/fetchEventCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventCategory`, { withCredentials: true });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch event categories');
  }
});

export const addNewEventCategory = createAsyncThunk('eventCategories/addNewEventCategory', async (newCategory: Omit<EventCategory, '_id'>, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/eventCategory`, newCategory, { withCredentials: true });
    toast.success('Event Category added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add Event Category: ${message}`);
    return rejectWithValue(message);
  }
});

export const updateEventCategory = createAsyncThunk('eventCategories/updateEventCategory', async (updatedCategory: EventCategory, { rejectWithValue }) => {
  try {
    const { _id, ...categoryData } = updatedCategory;
    const response = await axios.put(`${API_BASE_URL}/eventCategory/${_id}`, categoryData, { withCredentials: true });
    toast.success('Event Category updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update Event Category: ${message}`);
    return rejectWithValue(message);
  }
});

const eventCategorySlice = createSlice({
  name: 'eventCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventCategories.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.eventCategories = action.payload;
      })
      .addCase(fetchEventCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addNewEventCategory.fulfilled, (state, action) => {
        state.eventCategories.push(action.payload);
      })
      .addCase(updateEventCategory.fulfilled, (state, action) => {
        const index = state.eventCategories.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.eventCategories[index] = action.payload;
        }
      });
  },
});

export default eventCategorySlice.reducer;