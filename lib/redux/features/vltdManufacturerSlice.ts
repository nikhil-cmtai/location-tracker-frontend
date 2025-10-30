import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

export interface VltdManufacturer {
  _id: string;
  manufacturerName: string;
  shortName: string;
}

interface VltdManufacturerState {
  vltdManufacturers: VltdManufacturer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VltdManufacturerState = {
  vltdManufacturers: [],
  status: 'idle',
  error: null,
};

export const fetchVltdManufacturers = createAsyncThunk('vltdManufacturers/fetchVltdManufacturers', async () => {
  const response = await axios.get(`${API_BASE_URL}/vltdmanufacturer`, { withCredentials: true });
  return response.data.message;
});

export const addNewVltdManufacturer = createAsyncThunk('vltdManufacturers/addNewVltdManufacturer', async (newManufacturer: Omit<VltdManufacturer, '_id'>, thunkAPI) => {
  try {
    const payload = {
      name: newManufacturer.manufacturerName,
      shortName: newManufacturer.shortName
    };
    const response = await axios.post(`${API_BASE_URL}/addvltdmanufacturer`, payload, { withCredentials: true });
    toast.success('VLTD Manufacturer added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add VLTD Manufacturer: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateVltdManufacturer = createAsyncThunk('vltdManufacturers/updateVltdManufacturer', async (updatedManufacturer: VltdManufacturer, thunkAPI) => {
  try {
    const { _id, ...manufacturerData } = updatedManufacturer;
    const payload = {
      name: manufacturerData.manufacturerName,
      shortName: manufacturerData.shortName
    };
    const response = await axios.put(`${API_BASE_URL}/vltmanufacturer/${_id}`, payload, { withCredentials: true });
    toast.success('VLTD Manufacturer updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update VLTD Manufacturer: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const vltdManufacturerSlice = createSlice({
  name: 'vltdManufacturers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVltdManufacturers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVltdManufacturers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vltdManufacturers = action.payload;
      })
      .addCase(fetchVltdManufacturers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch VLTD Manufacturers';
      })
      .addCase(addNewVltdManufacturer.fulfilled, (state, action) => {
        state.vltdManufacturers.push(action.payload);
      })
      .addCase(updateVltdManufacturer.fulfilled, (state, action) => {
        const index = state.vltdManufacturers.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.vltdManufacturers[index] = action.payload;
        }
      });
  },
});

export default vltdManufacturerSlice.reducer;