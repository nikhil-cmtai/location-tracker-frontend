import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { VltdModel } from './vltdModelSlice';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master`;

export interface VltDevice {
  _id: string;
  vlt: VltdModel | string; 
  imeiNumber: number;
  iccid: string; // Changed from number to string
  region: any;
  customer: any;
}

interface VltDeviceState {
  vltDevices: VltDevice[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VltDeviceState = {
  vltDevices: [],
  status: 'idle',
  error: null,
};

export const fetchVltDevices = createAsyncThunk('vltDevices/fetchVltDevices', async (_, thunkAPI) => {
  try {
    // Get user data from auth state
    const state = thunkAPI.getState() as any;
    const user = state.auth?.user;
    console.log(user);
    
    if (user?.hierarchy?.level <= 2) {
      // For hierarchy level 1 or 2, fetch all VLT devices
      const response = await axios.get(`${API_BASE_URL}/vltdevice`, { withCredentials: true });
      return Array.isArray(response.data.message) ? response.data.message : (response.data.data || []);
    } else if (user?.hierarchy?.level === 3) {
      // For hierarchy level 3, fetch by region
      const response = await axios.get(`${API_BASE_URL}/vltdevice/region/${user.region._id}`, { withCredentials: true });
      return Array.isArray(response.data.message) ? response.data.message : (response.data.data || []);
    } else {
      // For hierarchy level 4+, fetch by depot
      const depotId = typeof user.depot === 'string' ? user.depot : user.depot?._id;
      const response = await axios.get(`${API_BASE_URL}/vltdevice/depot/${depotId}`, { withCredentials: true });
      return Array.isArray(response.data.message) ? response.data.message : (response.data.data || []);
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to fetch VLT devices: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const addNewVltDevice = createAsyncThunk('vltDevices/addNewVltDevice', async (newDevice: Omit<VltDevice, '_id' | 'vlt'> & { vlt: string }) => {
  const response = await axios.post(`${API_BASE_URL}/addvltdevice`, newDevice, { withCredentials: true });
  return response.data.data;
});

export const updateVltDevice = createAsyncThunk('vltDevices/updateVltDevice', async (updatedDevice: VltDevice) => {
  const { _id, ...deviceData } = updatedDevice;
  const response = await axios.put(`${API_BASE_URL}/vltdevice/${_id}`, deviceData, { withCredentials: true });
  return response.data.data;
});

const vltDeviceSlice = createSlice({
  name: 'vltDevices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVltDevices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVltDevices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vltDevices = action.payload;
      })
      .addCase(fetchVltDevices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch VLT devices';
      })
      .addCase(addNewVltDevice.fulfilled, (state, action) => {
        state.vltDevices.push(action.payload);
      })
      .addCase(updateVltDevice.fulfilled, (state, action) => {
        const index = state.vltDevices.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.vltDevices[index] = action.payload;
        }
      });
  },
});

export default vltDeviceSlice.reducer;