import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/vehicletype`;

export interface VehicleType {
  _id?: string;
  make: string;
  vehicleType?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface VehicleTypeState {
  vehicleTypes: VehicleType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: VehicleTypeState = {
  vehicleTypes: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
};

// Async thunks
export const fetchVehicleTypes = createAsyncThunk(
  'vehicleType/fetchVehicleTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vehicle types');
    }
  }
);

export const createVehicleType = createAsyncThunk(
  'vehicleType/createVehicleType',
  async (data: Omit<VehicleType, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE_URL, data, { withCredentials: true });
      toast.success('Vehicle Type created successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create vehicle type';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateVehicleType = createAsyncThunk(
  'vehicleType/updateVehicleType',
  async ({ id, data }: { id: string; data: Omit<VehicleType, '_id'> }, { rejectWithValue }) => {

    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, data, { withCredentials: true });
      toast.success('Vehicle Type updated successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update vehicle type';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteVehicleType = createAsyncThunk(
  'vehicleType/deleteVehicleType',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, { withCredentials: true });
      toast.success('Vehicle Type deleted successfully!');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete vehicle type';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const vehicleTypeSlice = createSlice({
  name: 'vehicleType',
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vehicle types
      .addCase(fetchVehicleTypes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicleTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchVehicleTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Create vehicle type
      .addCase(createVehicleType.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createVehicleType.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.vehicleTypes.push(action.payload);
        state.error = null;
      })
      .addCase(createVehicleType.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Update vehicle type
      .addCase(updateVehicleType.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateVehicleType.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.vehicleTypes.findIndex(vt => vt._id === action.payload._id);
        if (index !== -1) {
          state.vehicleTypes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateVehicleType.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Delete vehicle type
      .addCase(deleteVehicleType.pending, (state) => {
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteVehicleType.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.vehicleTypes = state.vehicleTypes.filter(vt => vt._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteVehicleType.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetCreateStatus, resetUpdateStatus, resetDeleteStatus, clearError } = vehicleTypeSlice.actions;
export default vehicleTypeSlice.reducer;
