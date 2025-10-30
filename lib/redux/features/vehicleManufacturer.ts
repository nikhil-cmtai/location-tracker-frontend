import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master`;

export interface VehicleMake {
  _id: string;
  make: string;
  shortName: string;
}

interface VehicleMakeState {
  vehicleMakes: VehicleMake[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VehicleMakeState = {
  vehicleMakes: [],
  status: 'idle',
  error: null,
};

export const fetchVehicleMakes = createAsyncThunk('vehicleMakes/fetchVehicleMakes', async () => {
  const response = await axios.get(`${API_BASE_URL}/vehiclemanufacturer`, { withCredentials: true });
  return response.data.message;
});

export const addNewVehicleMake = createAsyncThunk('vehicleMakes/addNewVehicleMake', async (newVehicleMake: Omit<VehicleMake, '_id'>, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vehiclemanufacturer`, newVehicleMake, { withCredentials: true });
    toast.success('Vehicle Make added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add Vehicle Make: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateVehicleMake = createAsyncThunk('vehicleMakes/updateVehicleMake', async (updatedVehicleMake: VehicleMake, thunkAPI) => {
  try {
    const { _id, ...vehicleMakeData } = updatedVehicleMake;
    const response = await axios.put(`${API_BASE_URL}/vehiclemanufacturer/${_id}`, vehicleMakeData, { withCredentials: true });
    toast.success('Vehicle Make updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update Vehicle Make: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const vehicleMakeSlice = createSlice({
  name: 'vehicleMakes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleMakes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVehicleMakes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicleMakes = action.payload;
      })
      .addCase(fetchVehicleMakes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch vehicle makes';
      })
      .addCase(addNewVehicleMake.fulfilled, (state, action) => {
        state.vehicleMakes.push(action.payload);
      })
      .addCase(updateVehicleMake.fulfilled, (state, action) => {
        const index = state.vehicleMakes.findIndex((vm) => vm._id === action.payload._id);
        if (index !== -1) {
          state.vehicleMakes[index] = action.payload;
        }
      });
  },
});

export default vehicleMakeSlice.reducer;