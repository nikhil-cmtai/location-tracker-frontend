import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

interface PopulatedField {
  _id: string;
  manufacturerName?: string;
  modelName?: string;
}

export interface RenewalPlan {
  _id: string;
  planName: string;
  vltdManufacturer: PopulatedField;
  vltdModel: PopulatedField;
  tariff: number;
  gst: number;
  total: number;
  validityDays: number;
  gracePeriodDays: number;
  deactivationPeriodDays: number;
  status: 'active' | 'inactive';
}

interface RenewalPlanState {
  renewalPlans: RenewalPlan[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RenewalPlanState = {
  renewalPlans: [],
  status: 'idle',
  error: null,
};

export const fetchRenewalPlans = createAsyncThunk(
  'renewalPlans/fetchRenewalPlans',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/renewalplan`, { withCredentials: true });
    return response.data.message;
  }
);

export const addNewRenewalPlan = createAsyncThunk(
  'renewalPlans/addNewRenewalPlan',
  async (
    newRenewalPlan: {
      planName: string;
      vltdManufacturer: string;
      vltdModel: string;
      tariff: number;
      gst: number;
      total: number;
      validityDays: number;
      gracePeriodDays: number;
      deactivationPeriodDays: number;
      status: 'active' | 'inactive';
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/addrenewalplan`, newRenewalPlan, { withCredentials: true });
      toast.success('Renewal plan added successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to add renewal plan: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateRenewalPlan = createAsyncThunk(
  'renewalPlans/updateRenewalPlan',
  async (
    updatedRenewalPlan: {
      id: string;
      planName: string;
      vltdManufacturer: string;
      vltdModel: string;
      tariff: number;
      gst: number;
      total: number;
      validityDays: number;
      gracePeriodDays: number;
      deactivationPeriodDays: number;
      status: 'active' | 'inactive';
    },
    thunkAPI
  ) => {
    try {
      const { id, ...updateData } = updatedRenewalPlan;
      const response = await axios.put(`${API_BASE_URL}/addrenewalplan/${id}`, updateData, { withCredentials: true });
      toast.success('Renewal plan updated successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to update renewal plan: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const renewalPlanSlice = createSlice({
  name: 'renewalPlans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRenewalPlans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRenewalPlans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.renewalPlans = action.payload;
      })
      .addCase(fetchRenewalPlans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch renewal plans';
      })
      .addCase(addNewRenewalPlan.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(updateRenewalPlan.fulfilled, (state, action) => {
        const index = state.renewalPlans.findIndex(
          (plan) => plan._id === action.payload._id
        );
        if (index !== -1) {
          state.renewalPlans[index] = action.payload;
        } else {
          state.status = 'idle';
        }
      });
  },
});

export default renewalPlanSlice.reducer;