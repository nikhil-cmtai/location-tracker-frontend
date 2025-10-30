import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

// Note: Using the /api/admin route as per your original backend structure for VLTD models
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

export interface VltdModel {
  _id: string;
  manufacturerId?: string; // Optional for backward compatibility
  manufacturerName?: string; // Optional for display purposes
  modelName: string;
}

interface VltdModelState {
  vltdModels: VltdModel[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VltdModelState = {
  vltdModels: [],
  status: 'idle',
  error: null,
};

export const fetchVltdModels = createAsyncThunk('vltdModels/fetchVltdModels', async () => {
  const response = await axios.get(`${API_BASE_URL}/vltmodel`, { withCredentials: true });
  return response.data.message;
});

export const addNewVltdModel = createAsyncThunk('vltdModels/addNewVltdModel', async (newModel: Omit<VltdModel, '_id'>, thunkAPI) => {
  try {
    const payload = {
      manufacturerId: newModel.manufacturerId,
      modelName: newModel.modelName
    };
    const response = await axios.post(`${API_BASE_URL}/addvltmodel`, payload, { withCredentials: true });
    toast.success('VLTD Model added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add VLTD Model: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateVltdModel = createAsyncThunk('vltdModels/updateVltdModel', async (updatedModel: VltdModel, thunkAPI) => {
  try {
    const { _id, ...modelData } = updatedModel;
    const payload = {
      manufacturerId: modelData.manufacturerId,
      modelName: modelData.modelName
    };
    const response = await axios.put(`${API_BASE_URL}/vltmodel/${_id}`, payload, { withCredentials: true });
    toast.success('VLTD Model updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update VLTD Model: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const vltdModelSlice = createSlice({
  name: 'vltdModels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVltdModels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVltdModels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vltdModels = action.payload;
      })
      .addCase(fetchVltdModels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch VLT models';
      })
      .addCase(addNewVltdModel.fulfilled, (state, action) => {
        state.vltdModels.push(action.payload);
      })
      .addCase(updateVltdModel.fulfilled, (state, action) => {
        const index = state.vltdModels.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.vltdModels[index] = action.payload;
        }
      });
  },
});

export default vltdModelSlice.reducer;