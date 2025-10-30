import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { VehicleMake } from './vehicleManufacturer';
import { VehicleType } from './vehicleTypeSlice';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master`;

export interface VehicleModel {
  _id?: string;
  make: string | VehicleMake;
  vehicleType: string | VehicleType;
  vehicleModel: string;
}

interface VehicleModelState {
  vehicleModels: VehicleModel[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VehicleModelState = {
  vehicleModels: [],
  status: 'idle',
  error: null,
};

export const fetchVehicleModels = createAsyncThunk('vehicleModels/fetchVehicleModels', async () => {
  const response = await axios.get(`${API_BASE_URL}/vehiclemodel`, { withCredentials: true });
  return response.data.data;
});

export const addNewVehicleModel = createAsyncThunk('vehicleModels/addNewVehicleModel', async (newModel: Omit<VehicleModel, '_id'>, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vehiclemodel`, newModel, { withCredentials: true });
    toast.success('Vehicle Model added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add Vehicle Model: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateVehicleModel = createAsyncThunk('vehicleModels/updateVehicleModel', async (updatedModel: VehicleModel, thunkAPI) => {
  try {
    const { _id, ...modelData } = updatedModel;
    if (!_id) {
      throw new Error("Vehicle Model ID is missing for update.");
    }
    const response = await axios.put(`${API_BASE_URL}/vehiclemodel/${_id}`, modelData, { withCredentials: true });
    toast.success('Vehicle Model updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update Vehicle Model: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const vehicleModelSlice = createSlice({
  name: 'vehicleModels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleModels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVehicleModels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicleModels = action.payload;
      })
      .addCase(fetchVehicleModels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch vehicle models';
      })
      .addCase(addNewVehicleModel.fulfilled, (state, action) => {
        state.vehicleModels.push(action.payload);
      })
      .addCase(updateVehicleModel.fulfilled, (state, action) => {
        const index = state.vehicleModels.findIndex((vm) => vm._id === action.payload._id);
        if (index !== -1) {
          state.vehicleModels[index] = action.payload;
        }
      });
  },
});

export default vehicleModelSlice.reducer;