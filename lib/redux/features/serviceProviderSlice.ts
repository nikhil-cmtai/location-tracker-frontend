import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

// This uses the /api/admin route as per your backend route definitions for SIM services
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

export interface ServiceProvider {
  _id: string;
  serviceProviderName: string;
  shortName: string;
}

interface ServiceProviderState {
  serviceProviders: ServiceProvider[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServiceProviderState = {
  serviceProviders: [],
  status: 'idle',
  error: null,
};

export const fetchServiceProviders = createAsyncThunk('serviceProviders/fetchServiceProviders', async () => {
  const response = await axios.get(`${API_BASE_URL}/sim`, { withCredentials: true });
  return response.data.message;
});

export const addNewServiceProvider = createAsyncThunk('serviceProviders/addNewServiceProvider', async (newProvider: Omit<ServiceProvider, '_id'>, thunkAPI) => {
  try {
    const payload = {
      name: newProvider.serviceProviderName,
      shortName: newProvider.shortName,
    };
    const response = await axios.post(`${API_BASE_URL}/addsim`, payload, { withCredentials: true });
    toast.success('Service Provider added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add Service Provider: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateServiceProvider = createAsyncThunk('serviceProviders/updateServiceProvider', async (updatedProvider: ServiceProvider, thunkAPI) => {
  try {
    const { _id, ...providerData } = updatedProvider;
    const payload = {
      name: providerData.serviceProviderName,
      shortName: providerData.shortName,
    };
    const response = await axios.put(`${API_BASE_URL}/sim/${_id}`, payload, { withCredentials: true });
    toast.success('Service Provider updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update Service Provider: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const serviceProviderSlice = createSlice({
  name: 'serviceProviders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceProviders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServiceProviders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.serviceProviders = action.payload;
      })
      .addCase(fetchServiceProviders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch service providers';
      })
      .addCase(addNewServiceProvider.fulfilled, (state, action) => {
        state.serviceProviders.push(action.payload);
      })
      .addCase(updateServiceProvider.fulfilled, (state, action) => {
        const index = state.serviceProviders.findIndex((sp) => sp._id === action.payload._id);
        if (index !== -1) {
          state.serviceProviders[index] = action.payload;
        }
      });
  },
});

export default serviceProviderSlice.reducer;