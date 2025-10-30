import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

interface PopulatedField {
  _id: string;
  manufacturerName?: string;
  modelName?: string;
}

export interface ReactivationPlan {
  _id: string;
  vltdManufacturer: PopulatedField;
  vltdModel: PopulatedField;
  reactivationCost: number;
}

interface ReactivationPlanState {
  reactivationPlans: ReactivationPlan[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReactivationPlanState = {
  reactivationPlans: [],
  status: 'idle',
  error: null,
};

export const fetchReactivationPlans = createAsyncThunk(
  'reactivationPlans/fetchReactivationPlans',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/reactivationplan`, { withCredentials: true });
    return response.data.message;
  }
);

export const addNewReactivationPlan = createAsyncThunk(
  'reactivationPlans/addNewReactivationPlan',
  async (
    newReactivationPlan: {
      vltdManufacturer: string;
      vltdModel: string;
      reactivationCost: number;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/addreactivationplan`, newReactivationPlan, { withCredentials: true });
      toast.success('Reactivation plan added successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to add reactivation plan: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateReactivationPlan = createAsyncThunk(
  'reactivationPlans/updateReactivationPlan',
  async (
    updatedReactivationPlan: {
      id: string;
      vltdManufacturer: string;
      vltdModel: string;
      reactivationCost: number;
    },
    thunkAPI
  ) => {
    try {
      const { id, ...updateData } = updatedReactivationPlan;
      const response = await axios.put(`${API_BASE_URL}/addreactivationplan/${id}`, updateData, { withCredentials: true });
      toast.success('Reactivation plan updated successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to update reactivation plan: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const reactivationPlanSlice = createSlice({
  name: 'reactivationPlans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReactivationPlans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReactivationPlans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reactivationPlans = action.payload;
      })
      .addCase(fetchReactivationPlans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch reactivation plans';
      })
      .addCase(addNewReactivationPlan.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(updateReactivationPlan.fulfilled, (state, action) => {
        const index = state.reactivationPlans.findIndex(
          (plan) => plan._id === action.payload._id
        );
        if (index !== -1) {
          state.reactivationPlans[index] = action.payload;
        } else {
          state.status = 'idle';
        }
      });
  },
});

export default reactivationPlanSlice.reducer;