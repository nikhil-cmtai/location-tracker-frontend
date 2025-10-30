import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

// NOTE: Update this URL to match your actual API route for owner types
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

export interface OwnerType {
  _id: string;
  ownerType: string;
  description: string;
}

interface OwnerTypeState {
  ownerTypes: OwnerType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OwnerTypeState = {
  ownerTypes: [],
  status: 'idle',
  error: null,
};

export const fetchOwnerTypes = createAsyncThunk('ownerTypes/fetchOwnerTypes', async () => {
  const response = await axios.get(`${API_BASE_URL}/ownertype`, { withCredentials: true });
  return response.data.message; // Data is inside 'message' property
});

export const addNewOwnerType = createAsyncThunk('ownerTypes/addNewOwnerType', async (newOwnerType: Omit<OwnerType, '_id'>, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ownertype`, newOwnerType, { withCredentials: true });
    toast.success('Owner Type added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add Owner Type: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateOwnerType = createAsyncThunk('ownerTypes/updateOwnerType', async (updatedOwnerType: OwnerType, thunkAPI) => {
  try {
    const { _id, ...updateData } = updatedOwnerType;
    const response = await axios.put(`${API_BASE_URL}/ownertype/${_id}`, updateData, { withCredentials: true });
    toast.success('Owner Type updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update Owner Type: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const ownerTypeSlice = createSlice({
  name: 'ownerTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOwnerTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ownerTypes = action.payload;
      })
      .addCase(fetchOwnerTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch Owner Types';
      })
      .addCase(addNewOwnerType.fulfilled, (state, action) => {
        state.ownerTypes.push(action.payload);
      })
      .addCase(updateOwnerType.fulfilled, (state, action) => {
        const index = state.ownerTypes.findIndex((owner) => owner._id === action.payload._id);
        if (index !== -1) {
          state.ownerTypes[index] = action.payload;
        }
      });
  },
});

export default ownerTypeSlice.reducer;