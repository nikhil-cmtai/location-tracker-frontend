// store/fuelTypeSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface FuelTypeInfo {
    _id: string;
    fuelTypeName: string;
    fuelTypeDescription: string;
}

interface FuelTypeState {
    fuelTypes: FuelTypeInfo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: FuelTypeState = {
    fuelTypes: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/otc`;

export const fetchAllFuelTypes = createAsyncThunk(
  'fuelType/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fueltype`, { withCredentials: true });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch fuel types';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addFuelType = createAsyncThunk(
  'fuelType/add',
  async (fuelType: Omit<FuelTypeInfo, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/fueltype`, fuelType, { withCredentials: true });
      toast.success('Fuel type added successfully');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add fuel type';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateFuelType = createAsyncThunk(
  'fuelType/update',
  async (fuelType: FuelTypeInfo, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/fueltype/${fuelType._id}`, fuelType, { withCredentials: true });
      toast.success('Fuel type updated successfully');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update fuel type';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteFuelType = createAsyncThunk(
  'fuelType/delete',
  async (_id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/fueltype/${_id}`, { withCredentials: true });
      toast.success('Fuel type deleted successfully');
      return _id;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete fuel type';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const fuelTypeSlice = createSlice({
    name: 'fuelType',
    initialState,
    reducers: {
        clearFuelTypes: (state) => {
            state.fuelTypes = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFuelTypes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllFuelTypes.fulfilled, (state, action: PayloadAction<FuelTypeInfo[]>) => {
                state.status = 'succeeded';
                state.fuelTypes = action.payload;
            })
            .addCase(fetchAllFuelTypes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(addFuelType.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addFuelType.fulfilled, (state, action: PayloadAction<FuelTypeInfo>) => {
                state.status = 'succeeded';
                state.fuelTypes.push(action.payload);
            })
            .addCase(addFuelType.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(updateFuelType.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateFuelType.fulfilled, (state, action: PayloadAction<FuelTypeInfo>) => {
                state.status = 'succeeded';
                state.fuelTypes = state.fuelTypes.map(ft => 
                    ft._id === action.payload._id ? action.payload : ft
                );
            })
            .addCase(updateFuelType.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(deleteFuelType.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteFuelType.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.fuelTypes = state.fuelTypes.filter(ft => ft._id !== action.payload);
            })
            .addCase(deleteFuelType.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearFuelTypes } = fuelTypeSlice.actions;
export default fuelTypeSlice.reducer;