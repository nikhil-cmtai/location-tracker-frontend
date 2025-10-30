import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

interface PopulatedField {
    _id: string;
    manufacturerName?: string;
    modelName?: string;
}

export interface Plan {
  _id: string;
  planName: string;
  vltdManufacturer: PopulatedField;
  vltdModel: PopulatedField;
  durationDays: number;
}

interface PlanState {
  plans: Plan[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlanState = {
  plans: [],
  status: 'idle',
  error: null,
};

export const fetchPlans = createAsyncThunk('plans/fetchPlans', async () => {
  const response = await axios.get(`${API_BASE_URL}/plan`, { withCredentials: true });
  return response.data.message;
});

export const addNewPlan = createAsyncThunk('plans/addNewPlan', async (newPlan: { planName: string; vltdManufacturer: string; vltdModel: string; durationDays: number }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addplan`, newPlan, { withCredentials: true });
    toast.success('Plan added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add Plan: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updatePlan = createAsyncThunk('plans/updatePlan', async (updatedPlan: { id: string; planName: string; vltdManufacturer: string; vltdModel: string; durationDays: number }, thunkAPI) => {
  try {
    const { id, ...updateData } = updatedPlan;
    const response = await axios.put(`${API_BASE_URL}/addplan/${id}`, updateData, { withCredentials: true });
    toast.success('Plan updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update Plan: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch Plans';
      })
      .addCase(addNewPlan.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex((plan) => plan._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        } else {
          state.status = 'idle';
        }
      });
  },
});

export default planSlice.reducer;