import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plan } from './planSlice';

export interface VltdDevice {
  _id: string;
  imeiNumber: number;
}

export interface Subscription {
  _id: string;
  vehicleNumber: string;
  vltdDevice: string | VltdDevice;
  plan: Plan;
  activePlan: string;
  expiry: string;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SubscriptionState = {
  subscriptions: [],
  status: 'idle',
  error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master`;

export const fetchSubscriptions = createAsyncThunk('subscriptions/fetchSubscriptions', async () => {
  const response = await axios.get(`${API_BASE_URL}/subscription`, { withCredentials: true });
  return response.data.message;
});

export const addNewSubscription = createAsyncThunk('subscriptions/addNewSubscription', async (newSubscription: Omit<Subscription, '_id' | 'plan'> & { plan: string }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subscription`, newSubscription, { withCredentials: true });
    toast.success('Subscription added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to add Subscription: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateSubscription = createAsyncThunk('subscriptions/updateSubscription', async (updatedSubscription: { _id: string; vehicleNumber: string; vltdDevice: string; plan: string; activePlan: string; expiry: string; }, thunkAPI) => {
  try {
    const { _id, ...updateData } = updatedSubscription;
    const response = await axios.put(`${API_BASE_URL}/subscription/${_id}`, updateData, { withCredentials: true });
    toast.success('Subscription updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Failed to update Subscription: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch Subscriptions';
      })
      .addCase(addNewSubscription.fulfilled, (state, action) => {
        state.subscriptions.push(action.payload);
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(sub => sub._id === action.payload._id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      });
  },
});

export default subscriptionSlice.reducer;