import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface ActivationCheck {
    sNo: number;
    vehicleNumber: string;
    imeiNumber: string;
    deviceModel: string;
    deviceManufacturer: string;
    activationStatus: 'Active' | 'Inactive' | 'Expired' | 'Pending';
    planName: string;
    activationDate: string;
    expiryDate: string;
    lastUpdate: string;
}

interface ActivationCheckState {
    reportData: ActivationCheck[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    vehicleNumber?: string;
    imeiNumber?: string;
    status?: string;
}

const initialState: ActivationCheckState = {
    reportData: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchActivationCheck = createAsyncThunk(
  'activationCheck/fetchActivationCheck',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/activationcheck`, { params, withCredentials: true });
      toast.success('Report generated successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch activation check report';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const activationCheckSlice = createSlice({
    name: 'activationCheck',
    initialState,
    reducers: {
        clearActivationCheck: (state) => {
            state.reportData = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivationCheck.pending, (state) => {
                state.status = 'loading';
                state.reportData = [];
                state.error = null;
            })
            .addCase(fetchActivationCheck.fulfilled, (state, action: PayloadAction<ActivationCheck[]>) => {
                state.status = 'succeeded';
                state.reportData = action.payload;
            })
            .addCase(fetchActivationCheck.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearActivationCheck } = activationCheckSlice.actions;
export default activationCheckSlice.reducer;

